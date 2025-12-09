import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { TokenService } from '../services/token.service';
import { redisService } from '../services/redis.service';
import { emailService } from '../services/email.service';
import { PasswordUtils } from '../utils/password.utils';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class AuthController {
  /**
   * Register new user
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name, username } = req.body;

      // Check if email exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new AppError('Email already registered', 409);
      }

      // Check if username exists
      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        throw new AppError('Username already taken', 409);
      }

      // Validate password strength
      const { valid, errors } = PasswordUtils.validateStrength(password);
      if (!valid) {
        throw new AppError(errors.join(', '), 400);
      }

      // Hash password
      const hashedPassword = await PasswordUtils.hash(password);

      // Create user
      const user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        username: username.toLowerCase(),
        role: 'user',
        emailVerified: false,
        subscription: {
          plan: 'free',
          status: 'active',
        },
      });

      // Generate verification token
      const verificationToken = TokenService.generateEmailVerificationToken(email);

      // Send verification email
      await emailService.sendVerificationEmail(email, verificationToken);

      // Send welcome email
      await emailService.sendWelcomeEmail(email, name);

      // Generate tokens
      const tokens = TokenService.generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Store refresh token in Redis
      await redisService.storeRefreshToken(user._id.toString(), tokens.refreshToken);

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            username: user.username,
            emailVerified: user.emailVerified,
          },
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login with email and password
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user (with password field since it's set to select: false in schema)
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if account is deleted
      if (user.deletedAt) {
        throw new AppError('Account has been deleted', 403);
      }

      // Verify password
      const isValidPassword = await PasswordUtils.compare(password, user.password || '');
      if (!isValidPassword) {
        throw new AppError('Invalid email or password', 401);
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const tokens = TokenService.generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Store refresh token in Redis
      await redisService.storeRefreshToken(user._id.toString(), tokens.refreshToken);

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            username: user.username,
            emailVerified: user.emailVerified,
            subscription: user.subscription,
          },
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request OTP for passwordless login
   */
  static async requestOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if user exists or not
        res.json({
          success: true,
          message: 'If the email exists, an OTP has been sent',
        });
        return;
      }

      // Generate OTP
      const otp = TokenService.generateOTP();

      // Store OTP in Redis (5 minutes expiry)
      await redisService.storeOTP(email, otp);

      // Send OTP email
      await emailService.sendOTPEmail(email, otp);

      logger.info(`OTP sent to: ${email}`);

      res.json({
        success: true,
        message: 'OTP sent to your email',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify OTP and login
   */
  static async verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;

      // Verify OTP
      const isValid = await redisService.verifyOTP(email, otp);
      if (!isValid) {
        throw new AppError('Invalid or expired OTP', 401);
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate tokens
      const tokens = TokenService.generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Store refresh token
      await redisService.storeRefreshToken(user._id.toString(), tokens.refreshToken);

      logger.info(`User logged in with OTP: ${email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            username: user.username,
            emailVerified: user.emailVerified,
            subscription: user.subscription,
          },
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const payload = TokenService.verifyRefreshToken(refreshToken);

      // Verify token in Redis
      const isValid = await redisService.verifyRefreshToken(payload.userId, refreshToken);
      if (!isValid) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const tokens = TokenService.generateTokenPair({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      // Update refresh token in Redis
      await redisService.storeRefreshToken(payload.userId, tokens.refreshToken);

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      // Delete refresh token from Redis
      await redisService.deleteRefreshToken(req.user.userId);

      logger.info(`User logged out: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Forgot password - send reset link
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if user exists or not
        res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent',
        });
        return;
      }

      // Generate reset token
      const resetToken = TokenService.generateResetToken();

      // Store reset token in Redis (1 hour expiry)
      await redisService.set(`reset_token:${email}`, resetToken, 3600);

      // Send reset email
      await emailService.sendPasswordResetEmail(email, resetToken);

      logger.info(`Password reset requested: ${email}`);

      res.json({
        success: true,
        message: 'Password reset link sent to your email',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      // Verify token
      const isValid = TokenService.verifyResetToken(token);
      if (!isValid) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      // Find token in Redis (to get email)
      // This is a simplified approach - in production, encode email in token
      const email = req.body.email; // Should be extracted from token
      const storedToken = await redisService.get(`reset_token:${email}`);

      if (storedToken !== token) {
        throw new AppError('Invalid reset token', 400);
      }

      // Validate new password
      const { valid, errors } = PasswordUtils.validateStrength(newPassword);
      if (!valid) {
        throw new AppError(errors.join(', '), 400);
      }

      // Find user and update password
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      user.password = await PasswordUtils.hash(newPassword);
      await user.save();

      // Delete reset token
      await redisService.del(`reset_token:${email}`);

      // Send confirmation email
      await emailService.sendPasswordChangedEmail(email, user.name);

      logger.info(`Password reset successful: ${email}`);

      res.json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        throw new AppError('Invalid verification token', 400);
      }

      // Verify token and extract email
      const email = TokenService.verifyEmailVerificationToken(token);
      if (!email) {
        throw new AppError('Invalid or expired verification token', 400);
      }

      // Find and update user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.emailVerified) {
        res.json({
          success: true,
          message: 'Email already verified',
        });
        return;
      }

      user.emailVerified = true;
      user.emailVerifiedAt = new Date();
      await user.save();

      logger.info(`Email verified: ${email}`);

      res.json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.emailVerified) {
        throw new AppError('Email already verified', 400);
      }

      // Generate new verification token
      const verificationToken = TokenService.generateEmailVerificationToken(user.email);

      // Send verification email
      await emailService.sendVerificationEmail(user.email, verificationToken);

      res.json({
        success: true,
        message: 'Verification email sent',
      });
    } catch (error) {
      next(error);
    }
  }
}
