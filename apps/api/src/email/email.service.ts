import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

/**
 * Email Service
 * Handles transactional email delivery via Resend
 */

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      this.logger.warn('RESEND_API_KEY not configured - email service disabled');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  /**
   * Send account verification email
   */
  async sendVerificationEmail(
    email: string,
    userName: string,
    token: string,
  ): Promise<void> {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@rbxfolio.com',
        to: email,
        subject: 'Verify your RbxFolio account',
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">Welcome to RbxFolio, ${userName}!</h1>
                <p>Thank you for signing up. Please verify your email to activate your account.</p>
                <p>
                  <a href="${verificationUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    Verify Email
                  </a>
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  Verification link expires in 24 hours. If you didn't create this account, please ignore this email.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    userName: string,
    token: string,
  ): Promise<void> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@rbxfolio.com',
        to: email,
        subject: 'Reset your RbxFolio password',
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">Password Reset Request</h1>
                <p>Hi ${userName},</p>
                <p>We received a request to reset the password for your RbxFolio account.</p>
                <p>
                  <a href="${resetUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    Reset Password
                  </a>
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  This link expires in 1 hour. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send welcome email after account activation
   */
  async sendWelcomeEmail(
    email: string,
    userName: string,
  ): Promise<void> {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@rbxfolio.com',
        to: email,
        subject: 'Your RbxFolio account is ready!',
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">Welcome to RbxFolio!</h1>
                <p>Hi ${userName},</p>
                <p>Your account is now active. Here's what you can get started with:</p>
                <ul style="color: #555;">
                  <li>Create and showcase your development projects</li>
                  <li>Upload images and videos to your portfolio</li>
                  <li>Connect with other developers and creators</li>
                  <li>Receive and manage collaboration requests</li>
                </ul>
                <p>
                  <a href="${dashboardUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    Go to Dashboard
                  </a>
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  Questions? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #007bff;">documentation</a> or reach out to <a href="mailto:support@rbxfolio.com" style="color: #007bff;">support@rbxfolio.com</a>
                </p>
              </div>
            </body>
          </html>
        `,
      });

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }

  /**
   * Send contact request notification to developer
   */
  async sendContactRequestNotification(
    developerEmail: string,
    developerName: string,
    visitorName: string,
    visitorEmail: string,
    message: string,
    requestId: string,
  ): Promise<void> {
    const inboxUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/contact-requests`;

    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@rbxfolio.com',
        to: developerEmail,
        subject: `New contact request from ${visitorName}`,
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">New Contact Request</h1>
                <p>Hi ${developerName},</p>
                <p><strong>From:</strong> ${visitorName}</p>
                <p><strong>Email:</strong> ${visitorEmail}</p>
                <h3 style="color: #555;">Message:</h3>
                <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
                  ${message.replace(/\n/g, '<br />')}
                </div>
                <p>
                  <a href="${inboxUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    View in Inbox
                  </a>
                </p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  Reply directly to this request in your RbxFolio inbox to connect with ${visitorName}.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      this.logger.log(
        `Contact request notification sent to ${developerEmail} (Request: ${requestId})`
      );
    } catch (error) {
      this.logger.error(
        `Failed to send contact request notification to ${developerEmail}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Send contact request confirmation to visitor
   */
  async sendContactRequestConfirmation(
    visitorEmail: string,
    visitorName: string,
    developerName: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@rbxfolio.com',
        to: visitorEmail,
        subject: `Your message to ${developerName} was sent`,
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">Message Sent!</h1>
                <p>Hi ${visitorName},</p>
                <p>Your message to ${developerName} has been successfully sent.</p>
                <p>We'll notify you if they respond to your request.</p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  Thank you for using RbxFolio!
                </p>
              </div>
            </body>
          </html>
        `,
      });

      this.logger.log(`Contact confirmation email sent to ${visitorEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send contact confirmation email to ${visitorEmail}:`,
        error
      );
      // Don't throw - confirmation email is not critical
    }
  }

  /**
   * Send collaboration invitation email
   */
  async sendCollaborationInvite(
    email: string,
    userName: string,
    inviterName: string,
    projectName: string,
    message: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@rbxfolio.com',
        to: email,
        subject: `${inviterName} invited you to collaborate on "${projectName}"`,
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">Collaboration Invitation</h1>
                <p>Hi ${userName},</p>
                <p><strong>${inviterName}</strong> has invited you to collaborate on:</p>
                <h2 style="color: #007bff;">${projectName}</h2>
                <p><strong>Invitation Message:</strong></p>
                <p>${message}</p>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  Log in to your RbxFolio account to view the full invitation and respond.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      this.logger.log(`Collaboration invitation sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send collaboration invitation to ${email}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Health check - test email service connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test by sending a simple request
      const response = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@rbxfolio.com',
        to: 'test@resend.dev', // Resend's test email
        subject: 'RbxFolio Health Check',
        html: '<p>Health check</p>',
      });

      return !!response.data?.id;
    } catch (error) {
      this.logger.error('Email service health check failed:', error);
      return false;
    }
  }
}
