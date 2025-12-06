import { Request, Response, NextFunction } from 'express';
import { redisService } from '../services/redis.service';
import { AppError } from './errorHandler';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Max attempts in window
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * Rate limiting middleware factory
 */
export const rateLimit = (config: RateLimitConfig) => {
  const {
    windowMs,
    maxAttempts,
    message = 'Too many requests, please try again later',
    keyGenerator = (req) => req.ip || 'unknown',
  } = config;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = keyGenerator(req);
      const identifier = `rate_limit:${key}`;

      const { allowed, remaining, resetIn } = await redisService.checkRateLimit(
        identifier,
        maxAttempts,
        Math.floor(windowMs / 1000)
      );

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxAttempts);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + resetIn * 1000).toISOString());

      if (!allowed) {
        throw new AppError(message, 429);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Auth endpoint rate limiter (5 attempts per 15 minutes)
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  message: 'Too many authentication attempts, please try again in 15 minutes',
  keyGenerator: (req) => {
    // Rate limit by IP + email if provided
    const email = req.body?.email || '';
    return `${req.ip}:${email}`;
  },
});

/**
 * General API rate limiter (100 requests per minute)
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxAttempts: 100,
  message: 'API rate limit exceeded',
});

/**
 * AI endpoint rate limiter (based on subscription plan)
 */
export const aiRateLimit = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const userId = req.user.userId;
    const key = `ai_usage:${userId}`;

    // Get current month's usage
    const usageStr = await redisService.get(key);
    const currentUsage = usageStr ? parseInt(usageStr, 10) : 0;

    // Get user's plan limits (this should come from user model)
    // For now, using default limits
    const limits: Record<string, number> = {
      free: 10,
      pro: -1, // unlimited
      enterprise: -1, // unlimited
    };

    const userPlan = req.user.role || 'free';
    const limit = limits[userPlan] || 10;

    if (limit !== -1 && currentUsage >= limit) {
      throw new AppError('AI credit limit exceeded for your plan', 429);
    }

    // Increment usage
    const newUsage = await redisService.increment(key);

    // Set expiry to end of month if first usage
    if (newUsage === 1) {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const secondsUntilEndOfMonth = Math.floor((endOfMonth.getTime() - now.getTime()) / 1000);
      await redisService.expire(key, secondsUntilEndOfMonth);
    }

    next();
  } catch (error) {
    next(error);
  }
};
