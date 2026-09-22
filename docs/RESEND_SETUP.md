# Resend Email Service Setup Guide

Complete guide for configuring Resend for production email delivery.

## Overview

Resend is a modern email API for transactional emails. RbxFolio uses it for:
- Account verification emails
- Password reset notifications
- Contact request notifications
- Collaboration invitations
- Welcome emails

## Prerequisites

- Resend account (https://resend.com)
- Verified sender domain
- Node.js 18+ with `resend` package

## Step 1: Create Resend Account

1. Sign up at https://resend.com
2. Verify email
3. Create new project for RbxFolio

## Step 2: Get API Key

1. Go to **Settings** > **API Keys**
2. Create new API key
3. Copy and store securely in `.env.production`

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Verify Sender Domain

### Option A: Using Cloudflare DNS

1. In Resend, go to **Domains**
2. Add domain (e.g., `noreply.rbxfolio.com`)
3. Add DNS records shown by Resend:

```
Type: CNAME
Name: default._domainkey.noreply
Value: default.dkim.resend.dev

Type: MX
Name: noreply
Value: mx.resend.dev (Priority: 10)
```

4. Verify domain in Resend dashboard
5. Wait 5-10 minutes for DNS propagation

### Option B: Using Root Domain

1. Add DNS records for `rbxfolio.com`:

```
Type: MX
Name: @
Value: mx.resend.dev (Priority: 10)

Type: TXT
Name: default._domainkey
Value: [resend-provided-value]
```

## Step 4: Configure Environment Variables

```env
# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SUPPORT_EMAIL=support@rbxfolio.com
NEXT_PUBLIC_NOREPLY_EMAIL=noreply@rbxfolio.com
RESEND_FROM_EMAIL=noreply@rbxfolio.com
RESEND_FROM_NAME=RbxFolio

# Email Features
NEXT_PUBLIC_EMAIL_VERIFICATION=true
NEXT_PUBLIC_CONTACT_NOTIFICATIONS=true
NEXT_PUBLIC_COLLABORATION_EMAILS=true
```

## Step 5: Install Dependencies

```bash
npm install resend
# or
pnpm add resend
```

## Step 6: Create Email Service

### Backend Email Service

Create `apps/api/src/email/email.service.ts`:

```typescript
import { Resend } from 'resend';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

    await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Verify your RbxFolio account',
      html: `
        <p>Welcome to RbxFolio!</p>
        <p><a href="${verificationUrl}">Verify Email</a></p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Reset your RbxFolio password',
      html: `
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
      `,
    });
  }

  async sendContactNotification(
    email: string,
    visitorName: string,
    message: string,
  ): Promise<void> {
    await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `New contact request from ${visitorName}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>From:</strong> ${visitorName}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
  }
}
```

## Email Templates

### 1. Verification Email

```html
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome to RbxFolio!</h1>
      <p>Thank you for signing up. Please verify your email to get started.</p>
      <a href="[VERIFICATION_URL]" style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        If you didn't create this account, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>
```

### 2. Password Reset Email

```html
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Reset Your Password</h1>
      <p>You requested a password reset for your RbxFolio account.</p>
      <p>Click the button below to create a new password:</p>
      <a href="[RESET_URL]" style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        This link expires in 24 hours. If you didn't request this, please ignore this email.
      </p>
    </div>
  </body>
</html>
```

### 3. Contact Request Notification

```html
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">New Contact Request</h1>
      <p><strong>From:</strong> [VISITOR_NAME]</p>
      <p><strong>Email:</strong> [VISITOR_EMAIL]</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007bff;">
        [MESSAGE]
      </div>
      <a href="[INBOX_URL]" style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">
        View in Inbox
      </a>
    </div>
  </body>
</html>
```

### 4. Welcome Email

```html
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome to RbxFolio!</h1>
      <p>Hi [USER_NAME],</p>
      <p>Your account is now active. Here's what you can do:</p>
      <ul>
        <li>Create and showcase your projects</li>
        <li>Upload media (images and videos)</li>
        <li>Connect with other developers</li>
        <li>Receive collaboration requests</li>
      </ul>
      <a href="[DASHBOARD_URL]" style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">
        Go to Dashboard
      </a>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        Need help? Visit our <a href="[DOCS_URL]">documentation</a> or contact <a href="mailto:support@rbxfolio.com">support@rbxfolio.com</a>
      </p>
    </div>
  </body>
</html>
```

## Integration Examples

### Send Verification Email

```typescript
import { EmailService } from './email.service';

export class AuthService {
  constructor(private emailService: EmailService) {}

  async signup(email: string, password: string) {
    // Create user...
    const token = generateToken();
    
    // Send verification email
    await this.emailService.sendVerificationEmail(email, token);
  }
}
```

### Send Contact Notification

```typescript
export class ContactRequestsService {
  constructor(private emailService: EmailService) {}

  async createContactRequest(
    developerId: string,
    visitorName: string,
    message: string,
  ) {
    // Save request...
    const developer = await this.getDeveloper(developerId);
    
    // Send notification
    await this.emailService.sendContactNotification(
      developer.email,
      visitorName,
      message,
    );
  }
}
```

## Testing

### Test Email Sending

```typescript
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(() => {
    service = new EmailService();
  });

  it('should send verification email', async () => {
    const email = 'test@example.com';
    const token = 'test-token';

    await service.sendVerificationEmail(email, token);
    // Email should be sent successfully
  });
});
```

### Using Resend Test Domain

For testing without sending actual emails:

```env
# Test mode - emails sent to test@resend.dev
RESEND_FROM_EMAIL=onboarding@resend.dev
```

## Resend Dashboard Monitoring

### Track Deliverability

1. Go to **Emails** in Resend dashboard
2. Monitor:
   - Sent count
   - Open rate
   - Click rate
   - Bounce rate
   - Spam complaints

### Set Up Webhooks

For tracking opens and clicks:

```typescript
// Handle webhook
app.post('/webhooks/resend', (req, res) => {
  const { type, data } = req.body;

  if (type === 'email.sent') {
    logger.info('Email sent', data);
  } else if (type === 'email.opened') {
    logger.info('Email opened', data);
  } else if (type === 'email.clicked') {
    logger.info('Email clicked', data);
  } else if (type === 'email.bounced') {
    logger.error('Email bounced', data);
  }

  res.json({ success: true });
});
```

## Best Practices

### Email Content

1. **Subject Lines**: Clear, concise (50 chars max)
2. **Preview Text**: Include preview to show in inbox
3. **From Name**: Use company name (e.g., "RbxFolio Team")
4. **Reply-To**: Set support email for replies

### Sending

1. **Rate Limiting**: Don't exceed 5 emails per second
2. **Batch Operations**: Group sends together
3. **Error Handling**: Retry failed sends with exponential backoff
4. **Logging**: Log all email operations for debugging

### Deliverability

1. **SPF/DKIM/DMARC**: Ensure DNS records are correct
2. **List Hygiene**: Remove bounced addresses
3. **Content**: Avoid spam trigger words
4. **Engagement**: Monitor opens and clicks

## Troubleshooting

### Email Not Received

1. Check email address is correct
2. Verify sender domain is authenticated
3. Check spam folder
4. Review bounce logs in Resend dashboard

### Verification Failed

1. Verify domain DNS records propagated (5-10 mins)
2. Check DKIM record syntax
3. Test with `nslookup` or online tools

### Rate Limiting

If hitting rate limits:

```typescript
// Implement queue with rate limiting
import Bull from 'bull';

const emailQueue = new Bull('email');

emailQueue.process(async (job) => {
  await emailService.send(job.data);
});

// Use delay to rate limit
emailQueue.add(emailData, { delay: 1000 }); // 1 second delay
```

## Cost

Resend pricing (as of 2024):

- **Free**: 100 emails/day
- **Starter**: $20/month for 50K emails
- **Pro**: $200/month for 500K emails

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Email Templates](https://resend.com/templates)
- [API Reference](https://resend.com/docs/api-reference)
- [Webhooks Guide](https://resend.com/docs/webhooks)
