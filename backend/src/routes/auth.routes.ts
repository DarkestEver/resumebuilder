import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimit } from '../middleware/rateLimit.middleware';
import { validate, schemas, sanitize } from '../middleware/validation.middleware';
import { LinkedInOAuthService } from '../services/linkedinOAuthService';
import { TokenService } from '../services/token.service';

const router = Router();

// Apply sanitization to all routes
router.use(sanitize);

// Public auth routes with rate limiting
router.post(
  '/register',
  authRateLimit,
  validate(schemas.register),
  AuthController.register
);

router.post(
  '/login',
  authRateLimit,
  validate(schemas.login),
  AuthController.login
);

router.post(
  '/request-otp',
  authRateLimit,
  validate(schemas.loginWithOTP),
  AuthController.requestOTP
);

router.post(
  '/verify-otp',
  authRateLimit,
  validate(schemas.verifyOTP),
  AuthController.verifyOTP
);

router.post(
  '/refresh-token',
  validate(schemas.refreshToken),
  AuthController.refreshToken
);

router.post(
  '/forgot-password',
  authRateLimit,
  validate(schemas.forgotPassword),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  authRateLimit,
  validate(schemas.resetPassword),
  AuthController.resetPassword
);

router.get('/verify-email', AuthController.verifyEmail);

// Protected routes
router.post('/logout', authenticate, AuthController.logout);
router.post('/resend-verification', authenticate, AuthController.resendVerification);

// OAuth routes
router.get('/google', (_req, res) => {
  res.status(501).json({ message: 'Google OAuth - Coming soon' });
});

/**
 * LinkedIn OAuth - Redirect to LinkedIn authorization
 */
router.get('/linkedin', (_req, res) => {
  try {
    const state = Math.random().toString(36).substring(7); // CSRF protection
    const authUrl = LinkedInOAuthService.getAuthorizationUrl(state);
    
    res.json({
      success: true,
      data: {
        authUrl,
        state,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initiate LinkedIn OAuth',
    });
  }
});

/**
 * LinkedIn OAuth callback
 */
router.get('/linkedin/callback', async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    // Check for OAuth errors
    if (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/error?error=${error}&description=${error_description}`
      );
    }

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required',
      });
    }

    // Handle OAuth callback
    const result = await LinkedInOAuthService.handleOAuthCallback(code);

    // Generate JWT tokens
    const { accessToken, refreshToken } = TokenService.generateTokenPair({
      userId: result.user._id.toString(),
      email: result.user.email,
      role: result.user.role
    });

    // Redirect to frontend with tokens
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/auth/callback`);
    redirectUrl.searchParams.set('accessToken', accessToken);
    redirectUrl.searchParams.set('refreshToken', refreshToken);
    redirectUrl.searchParams.set('isNewUser', result.isNewUser.toString());

    res.redirect(redirectUrl.toString());
  } catch (error: any) {
    console.error('LinkedIn OAuth callback error:', error);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/error?error=oauth_failed&description=${encodeURIComponent(
        error.message || 'LinkedIn authentication failed'
      )}`
    );
  }
});

router.get('/github', (_req, res) => {
  res.status(501).json({ message: 'GitHub OAuth - Coming soon' });
});

export default router;
