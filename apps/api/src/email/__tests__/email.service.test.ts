import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmailService } from '../email.service';

// Mock Resend
vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({
          data: { id: 'email-123' },
        }),
      },
    })),
  };
});

describe('EmailService', () => {
  let service: EmailService;
  const mockEmail = 'user@example.com';
  const mockUserName = 'John Doe';
  const mockToken = 'test-token-123';

  beforeEach(() => {
    // Set required env vars
    process.env.RESEND_API_KEY = 'test-key';
    process.env.NEXT_PUBLIC_APP_URL = 'https://rbxfolio.com';
    process.env.RESEND_FROM_EMAIL = 'noreply@rbxfolio.com';

    service = new EmailService();
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email with correct parameters', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendVerificationEmail(mockEmail, mockUserName, mockToken);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@rbxfolio.com',
          to: mockEmail,
          subject: 'Verify your RbxFolio account',
          html: expect.stringContaining('Welcome to RbxFolio'),
        })
      );
    });

    it('should include verification URL in email', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendVerificationEmail(mockEmail, mockUserName, mockToken);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain(`verify?token=${mockToken}`);
    });

    it('should include user name in email body', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendVerificationEmail(mockEmail, mockUserName, mockToken);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain(mockUserName);
    });

    it('should throw error if Resend API fails', async () => {
      vi.spyOn(service['resend'].emails, 'send').mockRejectedValueOnce(
        new Error('API Error')
      );

      await expect(
        service.sendVerificationEmail(mockEmail, mockUserName, mockToken)
      ).rejects.toThrow('API Error');
    });

    it('should use default from email if not configured', async () => {
      delete process.env.RESEND_FROM_EMAIL;
      const newService = new EmailService();
      const sendSpy = vi.spyOn(newService['resend'].emails, 'send');

      await newService.sendVerificationEmail(mockEmail, mockUserName, mockToken);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.from).toBe('noreply@rbxfolio.com');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with correct parameters', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendPasswordResetEmail(mockEmail, mockUserName, mockToken);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@rbxfolio.com',
          to: mockEmail,
          subject: 'Reset your RbxFolio password',
          html: expect.stringContaining('Password Reset Request'),
        })
      );
    });

    it('should include reset URL in email', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendPasswordResetEmail(mockEmail, mockUserName, mockToken);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain(`reset-password?token=${mockToken}`);
    });

    it('should mention 1 hour expiration', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendPasswordResetEmail(mockEmail, mockUserName, mockToken);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain('1 hour');
    });

    it('should throw error if email sending fails', async () => {
      vi.spyOn(service['resend'].emails, 'send').mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        service.sendPasswordResetEmail(mockEmail, mockUserName, mockToken)
      ).rejects.toThrow('Network error');
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with correct parameters', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendWelcomeEmail(mockEmail, mockUserName);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@rbxfolio.com',
          to: mockEmail,
          subject: 'Your RbxFolio account is ready!',
          html: expect.stringContaining('Welcome to RbxFolio'),
        })
      );
    });

    it('should include dashboard link', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendWelcomeEmail(mockEmail, mockUserName);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain('/dashboard');
    });

    it('should include feature highlights', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendWelcomeEmail(mockEmail, mockUserName);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain('Create and showcase');
      expect(callArgs.html).toContain('Upload images and videos');
    });
  });

  describe('sendContactRequestNotification', () => {
    const developerEmail = 'dev@example.com';
    const developerName = 'Jane Developer';
    const visitorName = 'John Visitor';
    const visitorEmail = 'visitor@example.com';
    const message = 'I would like to collaborate on your project';
    const requestId = 'req-123';

    it('should send contact notification with all details', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendContactRequestNotification(
        developerEmail,
        developerName,
        visitorName,
        visitorEmail,
        message,
        requestId
      );

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@rbxfolio.com',
          to: developerEmail,
          subject: `New contact request from ${visitorName}`,
          html: expect.stringContaining('New Contact Request'),
        })
      );
    });

    it('should include visitor name and email in notification', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendContactRequestNotification(
        developerEmail,
        developerName,
        visitorName,
        visitorEmail,
        message,
        requestId
      );

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain(visitorName);
      expect(callArgs.html).toContain(visitorEmail);
    });

    it('should include contact message', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendContactRequestNotification(
        developerEmail,
        developerName,
        visitorName,
        visitorEmail,
        message,
        requestId
      );

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain(message);
    });

    it('should include inbox link', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendContactRequestNotification(
        developerEmail,
        developerName,
        visitorName,
        visitorEmail,
        message,
        requestId
      );

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain('/dashboard/contact-requests');
    });

    it('should handle multiline messages with line breaks', async () => {
      const multilineMessage = 'Line 1\nLine 2\nLine 3';
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendContactRequestNotification(
        developerEmail,
        developerName,
        visitorName,
        visitorEmail,
        multilineMessage,
        requestId
      );

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain('<br />');
    });
  });

  describe('sendContactRequestConfirmation', () => {
    const visitorEmail = 'visitor@example.com';
    const visitorName = 'John Visitor';
    const developerName = 'Jane Developer';

    it('should send confirmation email to visitor', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendContactRequestConfirmation(
        visitorEmail,
        visitorName,
        developerName
      );

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: visitorEmail,
          subject: `Your message to ${developerName} was sent`,
        })
      );
    });

    it('should not throw if email sending fails', async () => {
      vi.spyOn(service['resend'].emails, 'send').mockRejectedValueOnce(
        new Error('API Error')
      );

      await expect(
        service.sendContactRequestConfirmation(
          visitorEmail,
          visitorName,
          developerName
        )
      ).resolves.not.toThrow();
    });

    it('should include developer name in message', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendContactRequestConfirmation(
        visitorEmail,
        visitorName,
        developerName
      );

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain(developerName);
    });
  });

  describe('sendCollaborationInvite', () => {
    const email = 'user@example.com';
    const userName = 'John Doe';
    const inviterName = 'Jane Inviter';
    const projectName = 'Cool Project';
    const message = 'I think you would be great for this project!';

    it('should send collaboration invitation', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendCollaborationInvite(
        email,
        userName,
        inviterName,
        projectName,
        message
      );

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: expect.stringContaining(inviterName),
        })
      );
    });

    it('should include project name in subject', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendCollaborationInvite(
        email,
        userName,
        inviterName,
        projectName,
        message
      );

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.subject).toContain(projectName);
    });

    it('should include invitation message', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendCollaborationInvite(
        email,
        userName,
        inviterName,
        projectName,
        message
      );

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain(message);
    });
  });

  describe('healthCheck', () => {
    it('should return true if email service is healthy', async () => {
      vi.spyOn(service['resend'].emails, 'send').mockResolvedValueOnce({
        data: { id: 'health-check-123' },
        error: null,
      });

      const isHealthy = await service.healthCheck();

      expect(isHealthy).toBe(true);
    });

    it('should return false if email service is down', async () => {
      vi.spyOn(service['resend'].emails, 'send').mockRejectedValueOnce(
        new Error('Connection refused')
      );

      const isHealthy = await service.healthCheck();

      expect(isHealthy).toBe(false);
    });

    it('should use test@resend.dev for health check', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.healthCheck();

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.to).toBe('test@resend.dev');
    });

    it('should not throw errors on health check failure', async () => {
      vi.spyOn(service['resend'].emails, 'send').mockRejectedValueOnce(
        new Error('API Error')
      );

      await expect(service.healthCheck()).resolves.not.toThrow();
    });
  });

  describe('error handling and logging', () => {
    it('should log when email is successfully sent', async () => {
      const logSpy = vi.spyOn(service['logger'], 'log');

      await service.sendVerificationEmail(mockEmail, mockUserName, mockToken);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Verification email sent')
      );
    });

    it('should log errors when email sending fails', async () => {
      const errorSpy = vi.spyOn(service['logger'], 'error');
      vi.spyOn(service['resend'].emails, 'send').mockRejectedValueOnce(
        new Error('API Error')
      );

      try {
        await service.sendVerificationEmail(mockEmail, mockUserName, mockToken);
      } catch (e) {
        // Expected
      }

      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('template HTML formatting', () => {
    it('should generate valid HTML in verification email', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendVerificationEmail(mockEmail, mockUserName, mockToken);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain('<html>');
      expect(callArgs.html).toContain('</html>');
      expect(callArgs.html).toContain('<body');
      expect(callArgs.html).toContain('</body>');
    });

    it('should include proper styling in emails', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendVerificationEmail(mockEmail, mockUserName, mockToken);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain('font-family');
      expect(callArgs.html).toContain('color:');
    });

    it('should include call-to-action button styling', async () => {
      const sendSpy = vi.spyOn(service['resend'].emails, 'send');

      await service.sendVerificationEmail(mockEmail, mockUserName, mockToken);

      const callArgs = sendSpy.mock.calls[0][0];
      expect(callArgs.html).toContain('background: #007bff');
      expect(callArgs.html).toContain('color: white');
      expect(callArgs.html).toContain('padding:');
    });
  });
});
