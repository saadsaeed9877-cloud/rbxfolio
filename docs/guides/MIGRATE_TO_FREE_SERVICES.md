# Step-by-Step Migration to 100% Free Services

This document provides the exact code changes needed to migrate from services with trial periods to completely free alternatives.

---

## 1. Email Service Migration: Brevo → Resend

### Current Setup (Brevo - has trial period)
- Requires credit card
- 300 emails/day limit
- Can expire unexpectedly

### New Setup (Resend - truly free)
- ✅ 100 emails/day free
- ✅ No credit card needed
- ✅ No trial period
- ✅ No surprise charges

### Implementation

#### Step 1: Install Resend

```bash
cd /home/saad/Documents/Personal/Projects/RbxFolio
pnpm add resend
```

#### Step 2: Create Email Service (Resend)

**File: `apps/api/src/common/email.service.ts`**

```typescript
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not set - email service disabled');
    }
    this.resend = new Resend(apiKey);
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
        return { id: 'mock-' + Date.now() };
      }

      const response = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@rbxfolio.local',
        to,
        subject,
        html,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Failed to send email:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async sendPasswordReset(email: string, resetUrl: string) {
    return this.sendEmail(
      email,
      'Reset Your RbxFolio Password',
      `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Reset Your Password</h1>
            <p>Click the link below to reset your RbxFolio password:</p>
            <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #00ff4c; color: black; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a></p>
            <p style="color: #666; font-size: 12px;">This link expires in 1 hour.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
          </body>
        </html>
      `,
    );
  }

  async sendVerificationEmail(email: string, verifyUrl: string) {
    return this.sendEmail(
      email,
      'Verify Your RbxFolio Email',
      `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Verify Your Email</h1>
            <p>Click the link below to verify your RbxFolio account:</p>
            <p><a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #00ff4c; color: black; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a></p>
            <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
          </body>
        </html>
      `,
    );
  }

  async sendWelcomeEmail(email: string, displayName: string) {
    return this.sendEmail(
      email,
      'Welcome to RbxFolio!',
      `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to RbxFolio, ${displayName}!</h1>
            <p>Your account is now active. You can start showcasing your Roblox creations.</p>
            <p><a href="https://rbxfolio.app/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #00ff4c; color: black; text-decoration: none; border-radius: 4px; font-weight: bold;">Go to Dashboard</a></p>
          </body>
        </html>
      `,
    );
  }

  async sendContactNotification(developerEmail: string, visitorName: string, message: string) {
    return this.sendEmail(
      developerEmail,
      `New Contact Request from ${visitorName}`,
      `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>New Contact Request</h1>
            <p><strong>From:</strong> ${visitorName}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <p><a href="https://rbxfolio.app/dashboard/contact-requests" style="display: inline-block; padding: 10px 20px; background-color: #00ff4c; color: black; text-decoration: none; border-radius: 4px; font-weight: bold;">View Request</a></p>
          </body>
        </html>
      `,
    );
  }
}
```

#### Step 3: Update Environment Variables

**Update `.env`:**

```env
# Remove Brevo variables:
# BREVO_API_KEY=
# BREVO_FROM_EMAIL=

# Add Resend variables:
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@rbxfolio.local
```

#### Step 4: Update `.env.example`

```env
# ============================================================================
# EMAIL SERVICE - Resend (100 emails/day free, no card required)
# ============================================================================
# Get from: https://resend.com → API Keys → Create API Key
# No credit card required!
RESEND_API_KEY=re_

# Email address to send from
# Local: noreply@rbxfolio.local
# Production: noreply@yourdomain.com (must verify domain in Resend)
RESEND_FROM_EMAIL=noreply@rbxfolio.local
```

#### Step 5: Register EmailService in Module

**File: `apps/api/src/common/common.module.ts`** (if it exists, or create it)

```typescript
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';

@Module({
  providers: [EmailService, LoggerService],
  exports: [EmailService, LoggerService],
})
export class CommonModule {}
```

#### Step 6: Use in Services

In any service where you need to send emails:

```typescript
import { EmailService } from '../common/email.service';

@Injectable()
export class AuthService {
  constructor(
    private emailService: EmailService,
    // ... other dependencies
  ) {}

  async signup(email: string, displayName: string) {
    // ... create user
    await this.emailService.sendWelcomeEmail(email, displayName);
  }
}
```

---

## 2. Error Logging: Sentry → Winston

### Current Setup (Sentry - has 5K/month limit)
- 5,000 events/month free tier
- Can incur charges for overages
- Requires monitoring

### New Setup (Winston - unlimited)
- ✅ Unlimited events
- ✅ Local file storage
- ✅ No charges ever
- ✅ Simple file rotation

### Implementation

#### Step 1: Install Winston

```bash
pnpm add winston
```

#### Step 2: Create Logger Service

**File: `apps/api/src/common/logger.service.ts`**

```typescript
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    // Create logs directory if it doesn't exist
    const logsDir = join(process.cwd(), 'logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    // Winston logger configuration
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'rbxfolio-api' },
      transports: [
        // Error logs
        new winston.transports.File({
          filename: join(logsDir, 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // Combined logs
        new winston.transports.File({
          filename: join(logsDir, 'combined.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),
      ],
    });

    // Console output in development
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, context, stack }) => {
              return `${timestamp} [${level}] ${context ? `[${context}]` : ''} ${message} ${stack ? `\n${stack}` : ''}`;
            }),
          ),
        }),
      );
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, error?: Error | string, context?: string) {
    const stack = error instanceof Error ? error.stack : error;
    this.logger.error(message, { context, stack });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  // Log database queries
  query(sql: string, duration: number, context?: string) {
    this.logger.debug(`Query: ${sql} (${duration}ms)`, { context });
  }

  // Log API calls
  apiCall(method: string, url: string, duration: number, statusCode: number, context?: string) {
    this.logger.info(`[${method}] ${url} - ${statusCode} (${duration}ms)`, { context });
  }
}
```

#### Step 3: Replace Sentry Interceptor with Logger

**File: `apps/api/src/common/error.interceptor.ts`** (Replace sentry.interceptor.ts)

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = context.switchToHttp().getResponse().statusCode;
        this.logger.apiCall(method, url, duration, statusCode, 'HttpInterceptor');
      }),
      catchError(error => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `Request failed: [${method}] ${url}`,
          error,
          'HttpInterceptor',
        );
        return throwError(() => error);
      }),
    );
  }
}
```

#### Step 4: Update App Module

**File: `apps/api/src/app.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerService } from './common/logger.service';
import { ErrorInterceptor } from './common/error.interceptor';
// ... other imports

@Module({
  // ... existing imports and providers
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    // ... other providers
  ],
})
export class AppModule {}
```

#### Step 5: Remove Sentry

```bash
# Remove Sentry packages
pnpm remove @sentry/node @sentry/core
```

Remove from `.env`:
```env
# Delete these:
# SENTRY_DSN_API=
# NEW_RELIC_LICENSE_KEY=
# NEW_RELIC_APP_NAME=
# NEW_RELIC_LOG_LEVEL=
```

---

## 3. File Storage: Keep Local (or add S3 option)

The current setup supports both local and R2 storage. We'll keep local as default and make S3 optional.

### Keep Current Setup

Local storage is already free and unlimited. No changes needed!

```typescript
// Already configured in apps/api/src/media/media.service.ts
// Files are stored in: ./uploads
// No charges, no limits
```

---

## 4. Database: Local PostgreSQL (Development)

### Setup Local PostgreSQL

```bash
# Install (macOS)
brew install postgresql@15

# Start service
brew services start postgresql@15

# Create database
createdb rbxfolio_dev

# Create user
psql rbxfolio_dev

# Inside psql:
CREATE USER rbxfolio WITH PASSWORD 'dev_password_123';
ALTER USER rbxfolio CREATEDB;
ALTER ROLE rbxfolio SUPERUSER;
\q
```

### Update `.env`

```env
DATABASE_URL=postgresql://rbxfolio:dev_password_123@localhost:5432/rbxfolio_dev
```

### Test Connection

```bash
pnpm db:push
```

---

## 5. Deployment: Railway + Render

### Frontend: Railway (No credit card)

```bash
# Visit https://railway.app
# Sign up with GitHub
# Create new project
# Connect your repository
# Railway auto-detects Next.js

# Environment variables needed:
BETTER_AUTH_URL=https://rbxfolio.railway.app
NEXT_PUBLIC_API_URL=https://api.rbxfolio.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=https://rbxfolio.railway.app
```

### Backend: Render (No credit card)

```bash
# Visit https://render.com
# Sign up (no credit card)
# Create new Web Service
# Connect repository
# Set build/start commands:
# Build: npm install && npm run build
# Start: npm start

# Environment variables needed:
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://rbxfolio.railway.app
PORT=3001
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@rbxfolio.com
```

---

## 6. Complete Migration Checklist

```bash
# Step 1: Install dependencies
cd /home/saad/Documents/Personal/Projects/RbxFolio
pnpm add resend winston

# Step 2: Create new services
# - Copy email.service.ts code above
# - Copy logger.service.ts code above
# - Copy error.interceptor.ts code above

# Step 3: Update modules
# Update app.module.ts to use new services

# Step 4: Remove old services
# Delete: src/common/sentry.interceptor.ts
# Delete: any Brevo integration code
# pnpm remove @sentry/node @sentry/core

# Step 5: Update environment
# Edit .env with Resend credentials
# Edit .env.example with new structure

# Step 6: Test locally
pnpm dev

# Step 7: Commit changes
git add -A
git commit -m "Migrate to 100% free services (Resend, Winston, local storage)"
git push origin main

# Step 8: Deploy
# Push to Railway (frontend)
# Push to Render (backend)
```

---

## Cost Comparison

### Before (with trial risks)
- Brevo: 300 emails/day (trial period, can expire)
- Sentry: 5K events/month (potential overages)
- Bunny CDN: 10GB/month (potential overages)
- Vercel: Free but requires credit card
- **Risk:** Surprise charges if trial expires or usage exceeds limits

### After (100% free forever)
- Resend: 100 emails/day (no overcharges, no trial)
- Winston: Unlimited events (local files)
- Local Storage: Unlimited (no charges)
- Railway/Render: Free tier always available
- **Risk:** ZERO - no credit card ever needed

---

## Maintenance

### Log Rotation

Logs are automatically rotated:
- Error log: Max 5 files × 5MB = 25MB
- Combined log: Max 10 files × 5MB = 50MB

Check logs:
```bash
tail -f logs/combined.log
tail -f logs/error.log
```

### Email Limits

Resend: 100 emails/day
- If you exceed this, just wait until next day
- No charges, no overages
- Can upgrade anytime if needed

---

## Summary

✅ **Email:** Resend (100/day, free forever)
✅ **Logging:** Winston (unlimited, free forever)  
✅ **Storage:** Local files (unlimited, free forever)  
✅ **Database:** PostgreSQL local (free forever)  
✅ **Frontend:** Railway (free tier always available)  
✅ **Backend:** Render (free tier always available)  
✅ **Total Cost:** $0/month forever  
✅ **Credit Card:** None required  

All done! Your app is now truly 100% free with zero risk of surprise charges.
