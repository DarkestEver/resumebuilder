import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { User } from '../models/User.model';
import {
  createStripeCustomer,
  createSubscriptionIntent,
  getSubscription,
  cancelSubscription,
  createPortalSession,
} from '../services/stripeService';
import { logger } from '../utils/logger';

const router = Router();

const PLAN_PRICES = {
  free: { 
    name: 'Free', 
    credits: 50, 
    price: 0,
    templates: 3,
    resumes: 2,
  },
  pro: { 
    name: 'Pro', 
    credits: 1000, 
    price: 1499, // $14.99/month
    stripeId: 'price_pro',
    templates: 'unlimited',
    resumes: 'unlimited',
  },
  enterprise: { 
    name: 'Enterprise', 
    credits: 5000, 
    price: 4999, // $49.99/month
    stripeId: 'price_enterprise',
    templates: 'unlimited',
    resumes: 'unlimited',
  },
};

/**
 * POST /api/payments/subscribe
 * Subscribe to a plan
 */
router.post('/subscribe', authenticate, async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    const userId = req.user?.userId;

    if (!planId || !['pro', 'enterprise'].includes(planId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid plan ID',
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Create or get Stripe customer
    let customerId = user.subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await createStripeCustomer(user.email, user.name);
      customerId = customer.id;
      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }

    // Create subscription
    const planInfo = PLAN_PRICES[planId as keyof typeof PLAN_PRICES];
    const priceId = (planInfo as any).stripeId;

    if (!priceId) {
      res.status(400).json({
        success: false,
        message: 'This plan is not available for subscription',
      });
      return;
    }

    const subscription = await createSubscriptionIntent(customerId, priceId);

    // Update user subscription details
    user.subscription.plan = planId as 'pro' | 'enterprise';
    user.subscription.status = 'trialing';
    user.subscription.stripeSubscriptionId = subscription.id;
    user.subscription.startDate = new Date();
    user.aiCredits = planInfo.credits;
    await user.save();

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        planId,
        credits: planInfo.credits,
      },
    });
  } catch (error) {
    logger.error('Subscription creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
    });
  }
});

/**
 * GET /api/payments/subscription
 * Get current subscription details
 */
router.get('/subscription', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (!user.subscription.stripeSubscriptionId) {
      res.json({
        success: true,
        data: {
          plan: user.subscription.plan,
          status: 'none',
          credits: user.aiCredits,
        },
      });
      return;
    }

    const subscription = await getSubscription(user.subscription.stripeSubscriptionId);

    res.json({
      success: true,
      data: {
        plan: user.subscription.plan,
        status: subscription.status,
        startDate: subscription.created,
        currentPeriodEnd: subscription.current_period_end,
        credits: user.aiCredits,
        items: subscription.items.data.map((item) => ({
          priceId: item.price.id,
          amount: item.price.unit_amount,
          currency: item.price.currency,
        })),
      },
    });
  } catch (error) {
    logger.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription',
    });
  }
});

/**
 * POST /api/payments/cancel
 * Cancel current subscription
 */
router.post('/cancel', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (!user.subscription.stripeSubscriptionId) {
      res.status(400).json({
        success: false,
        message: 'No active subscription',
      });
      return;
    }

    await cancelSubscription(user.subscription.stripeSubscriptionId);

    // Update user plan to free
    user.subscription.plan = 'free';
    user.subscription.status = 'canceled';
    user.aiCredits = PLAN_PRICES.free.credits;
    await user.save();

    res.json({
      success: true,
      data: {
        message: 'Subscription canceled successfully',
        plan: 'free',
      },
    });
  } catch (error) {
    logger.error('Subscription cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
    });
  }
});

/**
 * POST /api/payments/portal
 * Get Stripe billing portal session
 */
router.post('/portal', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (!user.subscription.stripeCustomerId) {
      res.status(400).json({
        success: false,
        message: 'No Stripe customer found',
      });
      return;
    }

    const returnUrl = req.body.returnUrl || `${process.env.FRONTEND_URL}/dashboard/billing`;
    const session = await createPortalSession(user.subscription.stripeCustomerId, returnUrl);

    res.json({
      success: true,
      data: {
        url: session.url,
      },
    });
  } catch (error) {
    logger.error('Portal session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create portal session',
    });
  }
});

/**
 * GET /api/payments/plans
 * Get available subscription plans
 */
router.get('/plans', async (_req: Request, res: Response) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'usd',
        period: 'forever',
        credits: PLAN_PRICES.free.credits,
        popular: false,
        features: [
          '3 professional templates',
          '50 AI credits/month',
          '2 resume versions',
          'Basic ATS optimization',
          'PDF export',
          'Public profile (with watermark)',
          'Community support',
        ],
        limitations: [
          'Limited template access',
          'Watermarked downloads',
          'Basic features only',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: PLAN_PRICES.pro.price / 100,
        currency: 'usd',
        period: 'month',
        credits: PLAN_PRICES.pro.credits,
        popular: true,
        features: [
          '20+ premium templates',
          '1,000 AI credits/month',
          'Unlimited resumes',
          'CV upload & auto-parsing',
          'AI content enhancement',
          'Tailored resume generation',
          'Cover letter generator',
          'Advanced ATS optimization',
          'ATS score analysis',
          'Video profile',
          'Custom public profile URL',
          'No watermarks',
          'Priority email support',
        ],
        limitations: [],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: PLAN_PRICES.enterprise.price / 100,
        currency: 'usd',
        period: 'month',
        credits: PLAN_PRICES.enterprise.credits,
        popular: false,
        features: [
          'Everything in Pro',
          '5,000 AI credits/month',
          'Team collaboration (up to 10 members)',
          'Custom branding & templates',
          'Bulk resume operations',
          'Advanced analytics dashboard',
          'API access',
          'White-label option',
          'Dedicated account manager',
          'Custom integrations',
          'Priority phone & chat support',
          'SLA guarantee',
        ],
        limitations: [],
      },
    ];

    res.json({
      success: true,
      data: {
        plans,
      },
    });
  } catch (error) {
    logger.error('Get plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get plans',
    });
  }
});

export default router;
