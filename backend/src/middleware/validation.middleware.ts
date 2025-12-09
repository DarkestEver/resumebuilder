import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Validation schemas
 */
export const schemas = {
  // Auth schemas
  register: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      name: z.string().min(2, 'Name must be at least 2 characters'),
      username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens and underscores'),
      agreeToTerms: z.boolean().refine((val: boolean) => val === true, {
        message: 'You must agree to terms and conditions',
      }),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),

  loginWithOTP: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
    }),
  }),

  verifyOTP: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      otp: z.string().length(6, 'OTP must be 6 digits'),
    }),
  }),

  forgotPassword: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
    }),
  }),

  resetPassword: z.object({
    body: z.object({
      token: z.string().min(1, 'Token is required'),
      newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    }),
  }),

  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    }),
  }),

  refreshToken: z.object({
    body: z.object({
      refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
  }),

  // User schemas
  updateProfile: z.object({
    body: z.object({
      name: z.string().min(2).optional(),
      phone: z.string().optional(),
      profilePhoto: z.string().url().optional(),
    }),
  }),

  updateEmail: z.object({
    body: z.object({
      newEmail: z.string().email('Invalid email address'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),

  // Profile schemas
  createProfile: z.object({
    body: z.object({
      personalInfo: z.object({
        fullName: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        location: z.string().optional(),
        website: z.string().url().optional(),
        linkedin: z.string().url().optional(),
      }),
    }),
  }),

  // Resume schemas
  createResume: z.object({
    body: z.object({
      title: z.string().min(1, 'Title is required'),
      templateId: z.string().min(1, 'Template ID is required'),
      visibility: z.enum(['private', 'public', 'password', 'expiring']).default('private'),
    }),
  }),

  updateResume: z.object({
    body: z.object({
      title: z.string().min(1).optional(),
      templateId: z.string().optional(),
      customizations: z.record(z.string(), z.any()).optional(),
      visibility: z.enum(['private', 'public', 'password', 'expiring']).optional(),
    }),
  }),

  tailorResume: z.object({
    body: z.object({
      jobDescription: z.string().min(10, 'Job description too short'),
      resumeId: z.string().min(1, 'Resume ID is required'),
    }),
  }),
};

/**
 * Validation middleware factory
 */
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(new AppError(JSON.stringify(errors), 400));
      }
      next(error);
    }
  };
};

/**
 * Sanitize user input
 */
export const sanitize = (req: Request, _res: Response, next: NextFunction): void => {
  // Remove any potential XSS
  const sanitizeString = (str: string): string => {
    return str
      .replace(/[<>]/g, '')
      .trim();
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};
