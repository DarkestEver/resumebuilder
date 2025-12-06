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
  free: { name: 'Free', credits: 100, price: 0 },
  pro: { name: 'Pro', credits: 10000, price: 999, stripeId: 'price_pro' }, // $9.99/month
  enterprise: { name: 'Enterprise', credits: 50000, price: 4999, stripeId: 'price_enterprise' }, // $49.99/month
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
        features: [
          '3 basic templates',
          '100 AI credits/month',
          'Public profile access',
          'Basic resume management',
          'Community support',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: PLAN_PRICES.pro.price / 100,
        currency: 'usd',
        period: 'month',
        credits: PLAN_PRICES.pro.credits,
        features: [
          'All templates',
          '10,000 AI credits/month',
          'Premium themes',
          'Unlimited resumes',
          'CV upload & parsing',
          'Tailored resume generation',
          'Cover letter generation',
          'ATS optimization',
          'Email support',
        ],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: PLAN_PRICES.enterprise.price / 100,
        currency: 'usd',
        period: 'month',
        credits: PLAN_PRICES.enterprise.credits,
        features: [
          'Everything in Pro',
          '50,000 AI credits/month',
          'Team collaboration',
          'Custom branding',
          'Priority support',
          'API access',
          'Advanced analytics',
          'Bulk operations',
        ],
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
