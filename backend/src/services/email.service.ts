import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.smtpHost,
      port: config.email.smtpPort,
      secure: config.email.smtpPort === 465,
      auth: {
        user: config.email.smtpUser,
        pass: config.email.smtpPass,
      },
    });
  }

  /**
   * Send email
   */
  private async send(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"${config.email.fromName}" <${config.email.fromEmail}>`,
        to,
        subject,
        html,
      });
      logger.info(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ProfileBuilder! 🎉</h2>
        <p>Hi ${name},</p>
        <p>Thank you for joining ProfileBuilder. We're excited to help you create amazing resumes!</p>
        <p>Get started by:</p>
        <ul>
          <li>Completing your profile</li>
          <li>Uploading your existing CV for auto-extraction</li>
          <li>Choosing from 20+ professional templates</li>
          <li>Generating tailored resumes for specific jobs</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The ProfileBuilder Team</p>
      </div>
    `;
    return this.send(to, 'Welcome to ProfileBuilder!', html);
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(to: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${config.app.frontendUrl}/verify-email?token=${verificationToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `;
    return this.send(to, 'Verify Your Email - ProfileBuilder', html);
  }

  /**
   * Send OTP email
   */
  async sendOTPEmail(to: string, otp: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Login Code</h2>
        <p>Use the following code to log in to your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${otp}</div>
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `;
    return this.send(to, 'Your Login Code - ProfileBuilder', html);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${config.app.frontendUrl}/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      </div>
    `;
    return this.send(to, 'Reset Your Password - ProfileBuilder', html);
  }

  /**
   * Send password changed confirmation
   */
  async sendPasswordChangedEmail(to: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Changed Successfully</h2>
        <p>Hi ${name},</p>
        <p>Your password has been changed successfully.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <p>Best regards,<br>The ProfileBuilder Team</p>
      </div>
    `;
    return this.send(to, 'Password Changed - ProfileBuilder', html);
  }

  /**
   * Send account deletion confirmation
   */
  async sendAccountDeletionEmail(to: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Account Deleted</h2>
        <p>Hi ${name},</p>
        <p>Your ProfileBuilder account has been deleted as requested.</p>
        <p>All your data has been permanently removed from our systems.</p>
        <p>We're sorry to see you go. If you change your mind, you can create a new account anytime.</p>
        <p>Best regards,<br>The ProfileBuilder Team</p>
      </div>
    `;
    return this.send(to, 'Account Deleted - ProfileBuilder', html);
  }
}

// Export singleton instance
export const emailService = new EmailService();
