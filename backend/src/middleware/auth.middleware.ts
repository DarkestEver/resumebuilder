import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service';
import { AppError } from './errorHandler';
import { User } from '../models/User.model';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * JWT Authentication Middleware
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, 'TOKEN_MISSING');
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = TokenService.verifyAccessToken(token);

    // Verify user still exists
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }

    // Attach user to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError('Invalid or expired token', 401, 'TOKEN_INVALID'));
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = TokenService.verifyAccessToken(token);

      req.user = {
        userId: payload.userId,
        email: payload.email,
      };
    }

    next();
  } catch {
    // Ignore auth errors for optional auth
    next();
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (roles.length > 0 && !roles.includes(req.user.role || 'user')) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

/**
 * Check if user's email is verified
 */
export const requireEmailVerified = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.emailVerified) {
      throw new AppError('Email verification required', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check subscription plan
 */
export const requirePlan = (...plans: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        throw new AppError('User not found', 401);
      }

      if (!plans.includes(user.subscription.plan)) {
        throw new AppError(`This feature requires ${plans.join(' or ')} plan`, 403);
      }

      // Check if subscription is active
      if (user.subscription.status !== 'active' && user.subscription.plan !== 'free') {
        throw new AppError('Subscription expired or inactive', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
