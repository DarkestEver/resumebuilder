import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class TokenService {
  /**
   * Generate access token (15 minutes expiry)
   */
  static generateAccessToken(payload: TokenPayload): string {
    try {
      const options: jwt.SignOptions = {
        expiresIn: config.jwt.accessExpiry as jwt.SignOptions['expiresIn'],
      };
      return jwt.sign(payload, config.jwt.accessSecret, options);
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
    }
  }

  /**
   * Generate refresh token (7 days expiry)
   */
  static generateRefreshToken(payload: TokenPayload): string {
    try {
      const options: jwt.SignOptions = {
        expiresIn: config.jwt.refreshExpiry as jwt.SignOptions['expiresIn'],
      };
      return jwt.sign(payload, config.jwt.refreshSecret, options);
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokenPair(payload: TokenPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Generate OTP token (6 digits)
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate password reset token
   */
  static generateResetToken(): string {
    return jwt.sign(
      { purpose: 'password-reset', timestamp: Date.now() },
      config.jwt.accessSecret,
      { expiresIn: '1h' }
    );
  }

  /**
   * Verify password reset token
   */
  static verifyResetToken(token: string): boolean {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
      return decoded.purpose === 'password-reset';
    } catch {
      return false;
    }
  }

  /**
   * Generate email verification token
   */
  static generateEmailVerificationToken(email: string): string {
    return jwt.sign(
      { email, purpose: 'email-verification' },
      config.jwt.accessSecret,
      { expiresIn: '24h' }
    );
  }

  /**
   * Verify email verification token
   */
  static verifyEmailVerificationToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
      if (decoded.purpose === 'email-verification') {
        return decoded.email;
      }
      return null;
    } catch {
      return null;
    }
  }
}
