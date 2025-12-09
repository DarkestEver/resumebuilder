/**
 * Error Notifier Utility
 * Sends admin alerts for critical system errors
 */

import { emailService } from '../services/emailService';
import { logger } from './logger';

export enum ErrorSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

interface ErrorNotification {
  severity: ErrorSeverity;
  service: string;
  error: string;
  additionalInfo?: any;
}

/**
 * Notify admin of critical errors
 * Only sends email for CRITICAL and HIGH severity errors
 */
export async function notifyAdmin(notification: ErrorNotification): Promise<void> {
  // Only send email for critical and high severity errors
  if (notification.severity !== ErrorSeverity.CRITICAL && notification.severity !== ErrorSeverity.HIGH) {
    return;
  }

  try {
    await emailService.sendAdminAlert(
      `${notification.severity} Error - ${notification.service}`,
      {
        error: notification.error,
        service: notification.service,
        timestamp: new Date().toISOString(),
        additionalInfo: notification.additionalInfo,
      }
    );
  } catch (error) {
    logger.error('Failed to send admin notification:', error);
  }
}

/**
 * Pre-configured error notifiers for common scenarios
 */
export const errorNotifiers = {
  /**
   * Database connection errors
   */
  databaseError: async (error: Error, additionalInfo?: any) => {
    await notifyAdmin({
      severity: ErrorSeverity.CRITICAL,
      service: 'Database',
      error: error.message,
      additionalInfo: {
        stack: error.stack,
        ...additionalInfo,
      },
    });
  },

  /**
   * Payment/Stripe errors
   */
  paymentError: async (error: Error, additionalInfo?: any) => {
    await notifyAdmin({
      severity: ErrorSeverity.HIGH,
      service: 'Payment System',
      error: error.message,
      additionalInfo,
    });
  },

  /**
   * Email service errors
   */
  emailError: async (error: Error, additionalInfo?: any) => {
    await notifyAdmin({
      severity: ErrorSeverity.HIGH,
      service: 'Email Service',
      error: error.message,
      additionalInfo,
    });
  },

  /**
   * File storage errors
   */
  storageError: async (error: Error, additionalInfo?: any) => {
    await notifyAdmin({
      severity: ErrorSeverity.HIGH,
      service: 'File Storage',
      error: error.message,
      additionalInfo,
    });
  },

  /**
   * Authentication errors (mass failures)
   */
  authError: async (error: Error, additionalInfo?: any) => {
    await notifyAdmin({
      severity: ErrorSeverity.CRITICAL,
      service: 'Authentication System',
      error: error.message,
      additionalInfo,
    });
  },

  /**
   * Redis/Cache errors
   */
  cacheError: async (error: Error, additionalInfo?: any) => {
    await notifyAdmin({
      severity: ErrorSeverity.MEDIUM,
      service: 'Cache System (Redis)',
      error: error.message,
      additionalInfo,
    });
  },
};

/**
 * Monitor error patterns and send alerts if thresholds are exceeded
 */
class ErrorMonitor {
  private errorCounts: Map<string, number> = new Map();
  private resetInterval = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Reset counts every 5 minutes
    setInterval(() => {
      this.errorCounts.clear();
    }, this.resetInterval);
  }

  /**
   * Track error and send alert if threshold exceeded
   */
  async trackError(service: string, error: Error, threshold: number = 10): Promise<void> {
    const key = `${service}:${error.message}`;
    const count = (this.errorCounts.get(key) || 0) + 1;
    this.errorCounts.set(key, count);

    // Send alert if threshold exceeded
    if (count === threshold) {
      await notifyAdmin({
        severity: ErrorSeverity.HIGH,
        service: `${service} (Pattern Detected)`,
        error: `Error occurred ${count} times in last 5 minutes: ${error.message}`,
        additionalInfo: {
          errorCount: count,
          timeWindow: '5 minutes',
        },
      });
    }
  }
}

export const errorMonitor = new ErrorMonitor();
