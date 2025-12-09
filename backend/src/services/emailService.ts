/**
 * Email Service
 * Handles transactional emails via SendGrid/Nodemailer
 */

import nodemailer from 'nodemailer';
import { config } from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: config.email.smtp.port === 465,
  auth: {
    user: config.email.smtp.user,
    pass: config.email.smtp.pass,
  },
});

export const emailService = {
  /**
   * Send email
   */
  send: async (options: EmailOptions): Promise<boolean> => {
    try {
      const mailOptions = {
        from: options.from || config.email.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: config.email.from,
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  },

  /**
   * Welcome email template
   */
  sendWelcome: async (email: string, name: string): Promise<boolean> => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to ProfileBuilder!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining ProfileBuilder. We're excited to help you build your professional resume.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Get Started:</h3>
          <ol>
            <li>Complete your profile</li>
            <li>Choose a resume template</li>
            <li>Export and share your resume</li>
            <li>Get hired!</li>
          </ol>
        </div>
        <p><a href="http://localhost:3000/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Started</a></p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">Need help? Contact us at support@profilebuilder.com</p>
      </div>
    `;

    return emailService.send({
      to: email,
      subject: 'Welcome to ProfileBuilder!',
      html,
    });
  },

  /**
   * Email verification email
   */
  sendVerification: async (email: string, token: string): Promise<boolean> => {
    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Verify Your Email</h1>
        <p>Thank you for signing up! Please verify your email address to continue.</p>
        <p><a href="${verificationUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a></p>
        <p style="font-size: 12px; color: #666;">Or paste this link in your browser: ${verificationUrl}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">This link expires in 24 hours.</p>
      </div>
    `;

    return emailService.send({
      to: email,
      subject: 'Verify Your Email - ProfileBuilder',
      html,
    });
  },

  /**
   * Password reset email
   */
  sendPasswordReset: async (email: string, token: string): Promise<boolean> => {
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Reset Your Password</h1>
        <p>We received a request to reset your password. Click the button below to create a new password.</p>
        <p><a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
        <p style="font-size: 12px; color: #666;">Or paste this link: ${resetUrl}</p>
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 12px; color: #92400e;">
            <strong>Didn't request this?</strong> You can safely ignore this email. Your password won't change unless you create a new one.
          </p>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">This link expires in 1 hour.</p>
      </div>
    `;

    return emailService.send({
      to: email,
      subject: 'Reset Your Password - ProfileBuilder',
      html,
    });
  },

  /**
   * Payment confirmation email
   */
  sendPaymentConfirmation: async (
    email: string,
    userName: string,
    planName: string,
    amount: number
  ): Promise<boolean> => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Payment Confirmed</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for upgrading to the <strong>${planName}</strong> plan!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Plan:</strong> ${planName}</p>
          <p style="margin: 10px 0;"><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
          <p style="margin: 10px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Confirmed</span></p>
        </div>
        <p>Your subscription is now active. You can access all premium features immediately.</p>
        <p><a href="http://localhost:3000/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Dashboard</a></p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">Invoice and receipt available in your account settings.</p>
      </div>
    `;

    return emailService.send({
      to: email,
      subject: 'Payment Confirmed - ProfileBuilder',
      html,
    });
  },

  /**
   * Resume shared notification
   */
  sendResumeShared: async (
    email: string,
    senderName: string,
    shareUrl: string
  ): Promise<boolean> => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New Resume Shared with You</h1>
        <p>Hi,</p>
        <p><strong>${senderName}</strong> has shared their resume with you on ProfileBuilder.</p>
        <p><a href="${shareUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Resume</a></p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666;">Build your own resume at ProfileBuilder.com</p>
      </div>
    `;

    return emailService.send({
      to: email,
      subject: `${senderName} shared their resume with you`,
      html,
    });
  },

  /**
   * Send admin alert for critical errors
   */
  sendAdminAlert: async (
    subject: string,
    errorDetails: {
      error: string;
      service: string;
      timestamp: string;
      additionalInfo?: any;
    }
  ): Promise<boolean> => {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚨 Critical Error Alert</h1>
          </div>
          <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="color: #dc2626; margin-top: 0;">Error Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Service:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${errorDetails.service}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Timestamp:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${errorDetails.timestamp}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Error:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #dc2626; font-family: monospace; font-size: 12px; word-break: break-all;">${errorDetails.error}</td>
                </tr>
              </table>
            </div>
            ${errorDetails.additionalInfo ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; color: #92400e;">Additional Information</h3>
              <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(errorDetails.additionalInfo, null, 2)}</pre>
            </div>
            ` : ''}
            <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #1e40af;">Action Required</h3>
              <p style="margin: 0; font-size: 14px; color: #1e3a8a;">Please investigate and resolve this issue immediately to maintain service availability.</p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #666;">
            <p>ProfileBuilder Monitoring System</p>
          </div>
        </div>
      `;

      return emailService.send({
        to: config.email.adminEmail,
        subject: `[CRITICAL] ${subject}`,
        html,
      });
    } catch (error) {
      console.error('Failed to send admin alert:', error);
      return false;
    }
  },
};
