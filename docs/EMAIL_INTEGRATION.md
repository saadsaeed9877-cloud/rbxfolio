# Email Integration Guide

Complete guide for email service integration throughout RbxFolio's authentication and contact flows.

## Overview

RbxFolio uses Resend for transactional email delivery across multiple user journeys:

1. **Authentication**: Verification emails, password resets
2. **Contact Requests**: Notifications to developers, confirmations to visitors
3. **Collaboration**: Invite notifications (future)
4. **Account Management**: Welcome emails, notifications

## Setup

### 1. Install Resend Package

```bash
pnpm add resend
```

### 2. Configure Environment

Add to `.env` and `.env.production`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@rbxfolio.com
NEXT_PUBLIC_SUPPORT_EMAIL=support@rbxfolio.com
```

See [RESEND_SETUP.md](./RESEND_SETUP.md) for complete Resend configuration.

## Email Service Architecture

### EmailService

Located at `apps/api/src/email/email.service.ts`

Provides methods for all email types:

```typescript
// Verification
async sendVerificationEmail(email: string, userName: string, token: string)

// Password Reset
async sendPasswordResetEmail(email: string, userName: string, token: string)

// Welcome
async sendWelcomeEmail(email: string, userName: string)

// Contact Requests
async sendContactRequestNotification(
  developerEmail: string,
  developerName: string,
  visitorName: string,
  visitorEmail: string,
  message: string,
  requestId: string,
)

async sendContactRequestConfirmation(
  visitorEmail: string,
  visitorName: string,
  developerName: string,
)

// Collaboration
async sendCollaborationInvite(
  email: string,
  userName: string,
  inviterName: string,
  projectName: string,
  message: string,
)

// Health Check
async healthCheck(): Promise<boolean>
```

### Module Registration

EmailModule is registered in:

1. **AuthModule** (`apps/api/src/auth/auth.module.ts`)
2. **ContactRequestsModule** (`apps/api/src/contact-requests/contact-requests.module.ts`)

## Integration Points

### 1. Authentication Flow

#### Signup Verification

When user signs up:

```typescript
// In auth service
const token = generateVerificationToken(email);
await emailService.sendVerificationEmail(
  email,
  userName,
  token
);
```

Email contains verification link:
```
https://rbxfolio.com/verify?token=xyz123
```

#### Password Reset

When user requests password reset:

```typescript
const token = generatePasswordResetToken(email);
await emailService.sendPasswordResetEmail(
  email,
  userName,
  token
);
```

Email contains reset link:
```
https://rbxfolio.com/reset-password?token=xyz123
```

Link expires in 1 hour.

#### Welcome Email

After email verification:

```typescript
await emailService.sendWelcomeEmail(
  email,
  userName
);
```

### 2. Contact Request Flow

#### Developer Notification

When visitor submits contact request:

```typescript
// ContactRequestsService.submit()
const request = await prisma.contactRequest.create({
  data: { developerId, visitorName, message }
});

// Send notification to developer
await emailService.sendContactRequestNotification(
  developer.email,
  developer.name,
  visitorName,
  visitorEmail,
  message,
  request.id
);
```

Notification email includes:
- Visitor name and message
- Link to inbox for response
- Quick actions (accept/decline)

#### Visitor Confirmation

Optionally send confirmation to visitor:

```typescript
await emailService.sendContactRequestConfirmation(
  visitorEmail,
  visitorName,
  developerName
);
```

### 3. Future: Collaboration Invites

```typescript
await emailService.sendCollaborationInvite(
  collaboratorEmail,
  collaboratorName,
  inviterName,
  projectName,
  invitationMessage
);
```

## Email Templates

All templates are built-in to `EmailService`. They include:

1. **Responsive Design**: Mobile-friendly HTML
2. **Branding**: RbxFolio colors and fonts
3. **Clear CTAs**: Action buttons with links
4. **Plain Text Fallback**: Accessible content

### Template Customization

To customize templates, edit `apps/api/src/email/email.service.ts`:

```typescript
async sendVerificationEmail(email: string, userName: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  await this.resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'Customize this subject',
    html: `
      <!-- Your custom HTML here -->
    `,
  });
}
```

## Error Handling

EmailService includes graceful error handling:

```typescript
try {
  await emailService.sendVerificationEmail(email, name, token);
} catch (error) {
  // Log error but don't fail user flow
  logger.error('Failed to send email:', error);
  // User flow continues - email is not blocking
}
```

For critical emails (signup, password reset), consider:

```typescript
// Retry pattern
async sendWithRetry(
  emailFn: () => Promise<void>,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await emailFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Exponential backoff
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
}
```

## Testing

### Unit Tests

Location: `apps/api/src/email/__tests__/email.service.test.ts`

Test each email type:

```bash
pnpm --filter @rbxfolio/api test
```

Tests verify:
- Email sent to correct address
- Subject lines correct
- URLs included
- Personalization works
- Error handling

### Integration Tests

Email sending is tested in endpoint tests:

- `POST /auth/signup` - Triggers verification email
- `POST /auth/forgot-password` - Triggers reset email
- `POST /contact-requests/{username}` - Triggers notification emails

Run integration tests:

```bash
pnpm --filter @rbxfolio/api test
```

### Manual Testing

Use Resend's test email:

```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Send to `test@resend.dev` - email appears in Resend dashboard immediately.

### Monitoring

Check email delivery in Resend dashboard:

1. Go to https://resend.com/emails
2. View all sent emails
3. Monitor:
   - Open rates
   - Click rates
   - Bounce rates
   - Spam complaints

## Troubleshooting

### Email Not Received

1. **Check Resend Dashboard**
   - Verify email shows as "sent"
   - Check bounce/failure status
   - Review spam score

2. **Verify DNS Records**
   - Check CNAME and MX records propagated
   - Test with: `nslookup -type=MX noreply.rbxfolio.com`

3. **Check Email Address**
   - Verify recipient email is correct
   - No typos in Resend API key

### Rate Limiting

Resend rate limits: 5 emails/second per API key

If hitting limits:

```typescript
// Use a queue
const emailQueue = new Queue('email');

emailQueue.process(async (job) => {
  await emailService.send(job.data);
});

// With delay between sends
emailQueue.add(emailData, { delay: 200 }); // 5/sec = 200ms
```

### Deliverability Issues

1. **Use Verified Domain**
   - Better deliverability than onboarding@resend.dev
   - Follow DKIM/SPF setup

2. **Monitor Bounce Rate**
   - High bounces indicate list hygiene issues
   - Remove invalid emails

3. **Engagement Metrics**
   - Track opens and clicks
   - Low engagement reduces sender reputation

## Production Checklist

- [ ] Resend account created and verified
- [ ] API key added to production environment
- [ ] Sender domain verified (MX + DKIM records)
- [ ] SSL certificate valid for email domain
- [ ] Email templates reviewed for branding
- [ ] Error handling tested
- [ ] Email delivery monitored in dashboard
- [ ] Bounce handling implemented
- [ ] Unsubscribe mechanism (if needed)
- [ ] GDPR compliance (consent tracking)

## Future Enhancements

1. **Email Queue**
   - Bull/bullmq for reliable delivery
   - Retry logic for failed emails
   - Rate limiting

2. **Templates**
   - Custom template engine (Handlebars/ETA)
   - Per-user template preferences
   - A/B testing support

3. **Webhooks**
   - Track bounces and complaints
   - Auto-disable failed addresses
   - Analytics integration

4. **Unsubscribe**
   - One-click unsubscribe links
   - Preference center
   - GDPR compliance

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Email Templates](https://resend.com/templates)
- [API Reference](https://resend.com/docs/api-reference/emails/send)
- [Best Practices](https://resend.com/docs/best-practices)
- [Webhooks Guide](https://resend.com/docs/webhooks)

## Related Documentation

- [RESEND_SETUP.md](./RESEND_SETUP.md) - Resend configuration
- [PRODUCTION_CONFIG.md](./PRODUCTION_CONFIG.md) - Production environment
- `apps/api/src/email/email.service.ts` - Service implementation
- `apps/api/src/email/__tests__/email.service.test.ts` - Test suite
