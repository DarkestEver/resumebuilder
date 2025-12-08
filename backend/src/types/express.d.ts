/**
 * Express Type Extensions
 * Extends Express Request type with user property
 */

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

export {};
