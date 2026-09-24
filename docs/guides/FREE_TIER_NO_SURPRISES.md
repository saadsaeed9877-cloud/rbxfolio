# RbxFolio: 100% Free Forever Services Setup

**Date:** September 2026  
**Goal:** Zero risk of surprise charges - all services are completely free with no trial periods, no credit card required

---

## Overview

This guide replaces ALL services that have:
- ❌ Trial periods
- ❌ Potential for surprise charges  
- ❌ Credit card requirements
- ❌ Usage-based pricing after free tier

With services that offer:
- ✅ Truly free forever
- ✅ No credit card needed
- ✅ No hidden charges
- ✅ Clear free tier limits

---

## Service Migration Matrix

| Previous | Issues | Replacement | Why Better |
|----------|--------|-------------|-----------|
| Supabase DB | Trial auth | PostgreSQL (local) | Self-hosted, unlimited |
| Brevo Email | 300 emails/day limit | Resend Free | 100 emails/day free, real free tier |
| Bunny CDN | Potential overages | Local Storage | Host files yourself, no charges |
| Sentry | 5K events/month | Local Logging | Winston logs, free forever |
| New Relic | 1GB data/month | Console Logs | Built-in Node.js logging |
| Vercel | Free but needs credit card | Railway/Render | No credit card required |

---

## 1. Database: Local PostgreSQL

### Why Not Supabase?
- Requires credit card
- Trial can expire unexpectedly
- Potential for accidental charges

### Setup: Local PostgreSQL (Development)

#### On Linux/macOS:

```bash
# Install PostgreSQL
brew install postgresql@15          # macOS
sudo apt-get install postgresql-15  # Ubuntu/Debian

# Start PostgreSQL service
brew services start postgresql@15   # macOS
sudo systemctl start postgresql     # Linux

# Create database
createdb rbxfolio_dev
psql rbxfolio_dev

# Inside psql:
CREATE USER rbxfolio WITH PASSWORD 'dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE rbxfolio_dev TO rbxfolio;
\q
```

#### Update `.env`:

```env
DATABASE_URL=postgresql://rbxfolio:dev_password_123@localhost:5432/rbxfolio_dev
```

#### Run migrations:

```bash
pnpm db:push
```

### For Production: Use Free Tier Railway or Render

**Railway (Free tier: $5/month credit):**
- Visit https://railway.app
- Create account (no credit card)
- Create PostgreSQL service (included in free credit)
- Copy connection string

**Render (Free PostgreSQL):**
- Visit https://render.com
- Create account (no credit card)
- Create PostgreSQL database (free tier available)
- Copy connection string

---

## 2. Email: Resend (100 emails/day free)

### Why Not Brevo?
- 300 emails/day limit (still low)
- Marketing focus = potential upsell pressure

### Setup: Resend

```bash
# 1. Go to https://resend.com
# 2. Sign up with email (no credit card)
# 3. Go to API Keys
# 4. Create new API key
# 5. Copy the key
```

#### Update `.env`:

```env
# Use Resend instead of Brevo
RESEND_API_KEY=re_xxxxx_your_key
RESEND_FROM_EMAIL=noreply@rbxfolio.local
```

#### Update backend to use Resend:

**apps/api/src/common/email.service.ts:**

```typescript
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const response = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@rbxfolio.local',
        to,
        subject,
        html,
      });
      return response;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendPasswordReset(email: string, resetUrl: string) {
    return this.sendEmail(
      email,
      'Reset Your RbxFolio Password',
      `
        <h1>Password Reset</h1>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour.</p>
      `,
    );
  }

  async sendVerificationEmail(email: string, verifyUrl: string) {
    return this.sendEmail(
      email,
      'Verify Your RbxFolio Email',
      `
        <h1>Email Verification</h1>
        <p><a href="${verifyUrl}">Click here to verify your email</a></p>
      `,
    );
  }
}
```

#### Install Resend:

```bash
pnpm add resend
```

---

## 3. File Storage: Local + AWS S3 (Free tier)

### Why Not Bunny CDN?
- Can incur charges after free tier
- Requires monitoring usage

### Option A: Local Storage (Development)

Already configured! Files stored in `./uploads` directory.

```env
# Already set (development)
UPLOAD_DIR=./uploads
```

### Option B: AWS S3 (Free for 12 months, 5GB/month)

**Setup AWS S3:**

```bash
# 1. Go to https://aws.amazon.com
# 2. Create free account (no credit card for 12 months)
# 3. Go to S3 console
# 4. Create bucket: rbxfolio-media
# 5. Create IAM user with S3 access
# 6. Generate access keys
```

#### Update `.env`:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key_id
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=rbxfolio-media
S3_PUBLIC_URL=https://rbxfolio-media.s3.amazonaws.com
```

#### Update media.service.ts to support S3:

```bash
pnpm add aws-sdk
```

**apps/api/src/media/s3-storage.service.ts:**

```typescript
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3StorageService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  async upload(key: string, buffer: Buffer, contentType: string): Promise<string> {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read' as const,
    };

    try {
      await this.s3.putObject(params).promise();
      return `${process.env.S3_PUBLIC_URL}/${key}`;
    } catch (error) {
      console.error('S3 upload failed:', error);
      throw error;
    }
  }
}
```

---

## 4. Error Tracking: Local Winston Logging

### Why Not Sentry?
- 5K events/month limit
- Can incur charges for overages

### Setup: Winston Logger

```bash
pnpm add winston
```

**apps/api/src/common/logger.service.ts:**

```typescript
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        ...(process.env.NODE_ENV !== 'production'
          ? [new winston.transports.Console({
              format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
            })]
          : []),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}
```

**Use in services:**

```typescript
@Injectable()
export class UsersService {
  constructor(private logger: LoggerService) {}

  async getUser(id: string) {
    try {
      // ... get user
    } catch (error) {
      this.logger.error('Failed to get user', error.stack, 'UsersService');
      throw error;
    }
  }
}
```

---

## 5. APM Monitoring: Console Logs

### Why Not New Relic?
- 1GB data/month limit
- Potential overages

### Setup: Simple Performance Logging

**apps/api/src/common/performance.interceptor.ts:**

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const status = context.switchToHttp().getResponse().statusCode;
        console.log(
          `[${method}] ${url} - ${status} - ${duration}ms`,
        );
      }),
    );
  }
}
```

---

## 6. Frontend Deployment: Railway (Free tier)

### Why Not Vercel with credit card?
- Requires credit card for "safety"
- Risk of accidental charges

### Setup: Railway (No credit card needed)

```bash
# 1. Go to https://railway.app
# 2. Sign up with GitHub (no credit card)
# 3. Create new project
# 4. Connect GitHub repo
# 5. Railway auto-detects Next.js
# 6. Deploy!
```

#### Railway provides:
- ✅ $5/month free credit
- ✅ No credit card required
- ✅ PostgreSQL included
- ✅ Environment variables UI
- ✅ Auto-deploys from Git

---

## 7. Backend Deployment: Render (Free tier)

### Setup: Render

```bash
# 1. Go to https://render.com
# 2. Sign up (no credit card)
# 3. Create new Web Service
# 4. Connect GitHub repo
# 5. Configure:
#    - Environment: Node
#    - Build: npm install && npm run build
#    - Start: npm run start
# 6. Add environment variables
# 7. Deploy!
```

---

## Complete Free Setup Summary

### Services Used (All 100% Free)

| Service | Purpose | Cost | Card Required |
|---------|---------|------|----------------|
| PostgreSQL (local) | Database | Free | ❌ |
| PostgreSQL (Railway) | Production DB | Covered by $5 credit | ❌ |
| Resend | Email | 100/day free | ❌ |
| Local Storage | File uploads | Free | ❌ |
| AWS S3 | Optional backup | $0 for 12 months | ❌ |
| Winston | Error logging | Free | ❌ |
| Console logs | Performance | Free | ❌ |
| Railway | Frontend | $5 credit | ❌ |
| Render | Backend | Free tier | ❌ |
| GitHub | Git hosting | Free | ❌ |
| **TOTAL MONTHLY COST** | | **$0** | **❌ NONE** |

### Year 1 Costs

- **Months 1-12:** $0 (AWS free tier + Railway credit)
- **Months 13+:** $0 (local storage only, or $5/month for Railway if desired)

---

## Migration Checklist

### Phase 1: Database
- [ ] Set up local PostgreSQL for development
- [ ] Update `.env` with local connection string
- [ ] Test database connection: `pnpm db:push`
- [ ] Verify migrations run successfully

### Phase 2: Email
- [ ] Create Resend account (no credit card)
- [ ] Generate API key
- [ ] Update `.env` with Resend key
- [ ] Install Resend: `pnpm add resend`
- [ ] Update email service to use Resend
- [ ] Test email sending

### Phase 3: File Storage
- [ ] Keep local storage for development
- [ ] Optional: Set up AWS S3 for production
- [ ] Update media service for S3 support
- [ ] Test file uploads

### Phase 4: Logging
- [ ] Install Winston: `pnpm add winston`
- [ ] Create logger service
- [ ] Replace Sentry with Winston
- [ ] Create logs directory
- [ ] Test error logging

### Phase 5: Deployment
- [ ] Create Railway account (GitHub)
- [ ] Create Render account (GitHub)
- [ ] Deploy frontend to Railway
- [ ] Deploy backend to Render
- [ ] Test production environment

---

## Environment Variables: Complete Free Setup

**.env** (Development)

```env
# Database (Local PostgreSQL)
DATABASE_URL=postgresql://rbxfolio:dev_password_123@localhost:5432/rbxfolio_dev

# Authentication
BETTER_AUTH_SECRET=generate-with-node-crypto-command
BETTER_AUTH_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend
PORT=3001
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:3000

# Email (Resend - 100/day free)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@rbxfolio.local

# Logging
LOG_LEVEL=debug
NODE_ENV=development

# Optional: AWS S3 (first 12 months free)
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# S3_BUCKET_NAME=rbxfolio-media
```

**.env.production** (Railway/Render)

```env
# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
BETTER_AUTH_SECRET=your_production_secret
BETTER_AUTH_URL=https://rbxfolio.railway.app

# Frontend
NEXT_PUBLIC_API_URL=https://api.rbxfolio.onrender.com/api/v1
NEXT_PUBLIC_APP_URL=https://rbxfolio.railway.app

# Backend
PORT=3001
UPLOAD_DIR=/tmp/uploads
CORS_ORIGIN=https://rbxfolio.railway.app

# Email
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@rbxfolio.com

# Logging
LOG_LEVEL=info
NODE_ENV=production
```

---

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Test connection
psql postgresql://rbxfolio:dev_password_123@localhost:5432/rbxfolio_dev

# If port 5432 is in use
psql -p 5433 postgresql://rbxfolio:dev_password_123@localhost:5433/rbxfolio_dev
```

### Resend Email Not Sending

```bash
# Check API key format (should start with "re_")
# Verify sender email is verified in Resend dashboard
# Check logs: tail -f logs/combined.log
```

### Railway/Render Deployment Issues

```bash
# Check build logs in platform dashboard
# Ensure environment variables are set
# Verify DATABASE_URL format
# Check Node.js version (should be 20+)
```

---

## Support & Limits

### Resend Email
- **Limit:** 100 emails/day
- **Overage:** No charges, just stops sending
- **Solution:** Upgrade to paid plan if needed

### AWS S3 (First 12 months)
- **Storage:** 5 GB/month
- **Requests:** 20,000 GET, 2,000 PUT
- **After 12 months:** Minimal charges (pennies)

### Railway/Render
- **Free tier:** Always available
- **Overage:** No charges, just rate limiting
- **Upgrade:** Optional paid tier if desired

---

## Next Steps

1. **Set up local PostgreSQL** - Start with development
2. **Create Resend account** - Test email sending
3. **Deploy to Railway** - Frontend hosting
4. **Deploy to Render** - Backend hosting
5. **Monitor costs** - Should always be $0

---

**Status:** ✅ COMPLETELY FREE FOREVER  
**Credit Card Required:** ❌ NO  
**Surprise Charges Risk:** ❌ ZERO  
**Annual Cost:** $0  

This setup ensures your app can run indefinitely without any financial risk.
