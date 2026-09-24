# Free-Tier Service Optimization Plan - RbxFolio MVP

**Date:** September 22, 2026  
**Goal:** Run RbxFolio MVP entirely on free-tier services  
**Status:** ✅ Achievable with strategic choices

---

## Executive Summary

RbxFolio MVP can operate **completely free** using free-tier services from major cloud providers:

| Service | Free Tier | Current Setup | Cost |
|---------|-----------|---------------|------|
| **Frontend Hosting** | Vercel (50GB/month) | ✅ Vercel | $0 |
| **Backend API** | Railway ($5/month but free tier) | Railway | $0-5 |
| **Database** | Railway PostgreSQL (free tier) | Railway | $0-5 |
| **File Storage** | AWS S3 (1GB/month) + Cloudflare (free) | R2 ($0.015/GB) | $0 |
| **Email Service** | SendGrid (100 emails/day) | Resend ($paid) | $0 |
| **Error Tracking** | Sentry (free plan) | Sentry ($paid) | $0 |
| **APM Monitoring** | New Relic (free trial) | New Relic ($paid) | $0 |
| **Domain** | Freenom or cheap domain | Custom domain | $0-10/year |
| **CDN** | Cloudflare (free tier) | Cloudflare | $0 |
| **Database Backups** | Manual via pg_dump | Railway | $0 |

**Total Monthly Cost: $0-10 (domain only)**

---

## 1. Frontend Hosting - Vercel (Free)

### Setup
```bash
# Already configured - Vercel free tier includes:
✅ 50GB storage per month
✅ Unlimited deployments
✅ Automatic HTTPS
✅ Global CDN
✅ Zero cold starts
✅ Next.js optimizations
✅ Serverless functions included

# No action needed - use as-is
```

### Free Tier Limits
- Storage: 50GB/month (sufficient for MVP)
- Bandwidth: Unmetered ✅
- Functions: 100GB-hours/month (plenty for MVP)
- Build time: 100 hours/month

**Status:** ✅ Already on free tier - continue as-is

---

## 2. Backend API - Railway (Free Trial + Credit)

### Current Cost: Free first month, $5-10/month after

### Option A: Use Railway Free Trial ($5/month credit)
```
Railway provides:
✅ $5 free monthly credit (nearly free)
✅ Pay-as-you-go after credit
✅ Estimated cost: $3-5/month for typical MVP usage

Expected usage:
- API server: ~512MB RAM = ~$2-3/month
- PostgreSQL database: ~500MB = ~$2-3/month
- Total with credit: ~$0/month (covered by credit)
```

**Action:** Keep Railway as primary choice (nearly free)

### Option B: Alternative - Render (Free Tier + Paid)
```
If Railway credit expires, use Render:
✅ Free tier: 1 free web service
✅ 512MB RAM
✅ Auto-sleep after 15 min inactivity
✅ Perfect for MVP

Cost: $0/month (may auto-sleep after inactivity)
```

**Recommendation:** Use Railway while credit available, then migrate to Render

---

## 3. Database - PostgreSQL

### Option A: Railway PostgreSQL (Included in $5 credit)
```
✅ 1GB storage included in $5/month credit
✅ Fully managed
✅ SSL included
✅ Daily backups included (7-day retention)

Cost: $0 (covered by Railway credit)
```

**Recommendation:** Continue with Railway

### Option B: Alternative - Render PostgreSQL (Free)
```
Free tier:
✅ 1GB storage
✅ Shared instance (may be slow)
✅ Auto-sleep after inactivity

Cost: $0/month
```

**Backup Strategy (Free):**
```bash
# Manual backup using pg_dump (free)
# Schedule in GitHub Actions (free)

# Create backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Then commit to GitHub and auto-rotate
```

---

## 4. File Storage - AWS S3 + Cloudflare

### Current Setup: Cloudflare R2 ($0.015/GB) - PAID

### Option A: AWS S3 (Free Tier)
```
AWS S3 Free Tier:
✅ 5GB storage/month (perfect for MVP)
✅ 20,000 GET requests/month
✅ 2,000 PUT requests/month
✅ Lasts 12 months (new accounts)

Estimated MVP usage:
- Avatars/banners: 50 users × 200KB = 10MB
- Projects media: 100 projects × 5MB = 500MB
- Total: ~600MB (within 5GB limit)
- Cost: $0/month for 12 months

Setup:
1. Create AWS S3 bucket
2. Create IAM user with S3 permissions
3. Update apps/api/.env:
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=rbxfolio-media
```

**Action Required:**
- Create AWS account (if new, get S3 free tier)
- Create S3 bucket
- Update backend to use AWS SDK

### Option B: Stay with Cloudflare R2 (Minimal Cost)
```
Cloudflare R2 pricing:
✅ First 10GB/month free (tier based)
✅ Includes 1M API requests/month free
✅ No egress charges (unlike S3)

Estimated cost for MVP:
- 1GB storage: $0 (within 10GB free)
- 100K requests: $0 (within 1M free)
- Total: $0/month
```

**Recommendation:** Keep R2 (already configured, free tier covers MVP)

### Option C: Supabase Storage (PostgreSQL integrated)
```
Supabase Storage (built on S3):
✅ 1GB free storage
✅ Integrated with PostgreSQL
✅ Free tier includes 100K API requests

Perfect for MVP, but less flexible than R2
```

**Final Recommendation: Use AWS S3 free tier for cost optimization**

---

## 5. Email Service - SendGrid or AWS SES (Free)

### Current Setup: Resend ($paid) - REPLACE

### Option A: SendGrid (Free)
```
SendGrid Free Tier:
✅ 100 emails/day (3,000/month)
✅ Perfect for MVP
✅ 1 month free trial
✅ Free after trial if you verify credentials

Setup:
1. Go to https://sendgrid.com/free
2. Create account
3. Generate API key
4. Update apps/api/.env:
   SENDGRID_API_KEY=...
5. Update email.service.ts to use SendGrid SDK
```

**Email Templates (Free):**
```typescript
// Instead of Resend, use SendGrid
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'user@example.com',
  from: 'noreply@rbxfolio.com', // Verify this email in SendGrid
  subject: 'Welcome to RbxFolio',
  html: '<h1>Welcome!</h1>',
};

await sgMail.send(msg);
```

**Cost:** $0/month (100 emails/day = plenty for MVP)

### Option B: AWS SES (Simple Email Service)
```
AWS SES Free Tier:
✅ 62,000 emails/month (first 3 months)
✅ Free SMTP access
✅ $0.10 per 1,000 emails after free period
✅ Excellent for newsletters, transactional emails

Setup:
1. Enable SES in AWS console
2. Verify domain (add TXT record)
3. Request production access
4. Update email.service.ts to use AWS SES

Cost: $0/month (62K emails included)
```

**Recommendation: Use SendGrid (simpler setup) or AWS SES (more emails)**

---

## 6. Error Tracking - Sentry (Free Plan)

### Current Setup: Sentry ($paid) - USE FREE PLAN

### Sentry Free Tier
```
✅ 5,000 events/month free
✅ 1 project
✅ 24-hour data retention
✅ Email alerts

Estimated MVP usage:
- Normal operation: 100-500 errors/month
- Well within free tier

No changes needed - Sentry free plan is sufficient
```

**Action:** Switch to free plan in Sentry dashboard
```
1. Go to https://sentry.io/pricing/
2. Downgrade to free plan
3. Keep existing configuration
4. Cost: $0/month
```

---

## 7. APM Monitoring - New Relic (Free)

### Current Setup: New Relic ($paid) - USE FREE TIER

### New Relic Free Tier
```
✅ Full APM monitoring
✅ 1GB data ingestion/month
✅ 24-hour data retention
✅ All core features

Estimated MVP usage:
- Metrics: ~10MB/month
- Traces: ~20MB/month
- Logs: ~10MB/month
- Total: ~40MB (well within 1GB)

No changes needed
```

**Action:** Switch to free tier
```
1. Go to https://newrelic.com/pricing
2. Select free tier
3. Keep existing configuration
4. Cost: $0/month
```

---

## 8. Domain Name - Free or Cheap

### Current Setup: Custom domain ($10-15/year)

### Option A: Free Domain (Freenom)
```
Freenom Free Tier:
✅ Free .tk, .ml, .ga, .cf domains
✅ 12 months free (renewable)
✅ No credit card required

Limitations:
❌ Not ideal for professional branding
❌ May appear less trustworthy
❌ Slower domain propagation

Example: rbxfolio.tk
```

### Option B: Cheap Domain ($0.99/year)
```
Namecheap First-Year Pricing:
✅ .com domain: $0.99 first year (then $8.88/year)
✅ .dev domain: $1.99 first year (then $12.99/year)
✅ Professional branding
✅ WHOIS privacy free

Total investment: $1-2 for first year
```

**Recommendation: Use cheap domain ($1-2) for professionalism**

---

## 9. CDN - Cloudflare (Free)

### Current Setup: Cloudflare free tier - KEEP AS-IS

### Cloudflare Free Plan
```
✅ Global CDN
✅ Free SSL/TLS
✅ DNSSEC
✅ DDoS protection
✅ 1 root domain

Perfect for MVP - no changes needed
```

---

## Implementation Plan - Migration to Free Tier

### Phase 1: Email Service (1 hour)
```bash
# 1. Create SendGrid account
#    - Sign up at https://sendgrid.com/free
#    - Verify email
#    - Get API key

# 2. Update backend
#    - Install: npm install @sendgrid/mail
#    - Update apps/api/.env:
#      SENDGRID_API_KEY=<your-api-key>
#      SENDGRID_FROM_EMAIL=noreply@rbxfolio.com

# 3. Update email.service.ts
#    - Replace Resend with SendGrid
#    - Test: Send test email

# 4. Run tests
#    - pnpm --filter @rbxfolio/api test
#    - Verify email tests pass
```

### Phase 2: File Storage (2 hours)
```bash
# 1. Create AWS account
#    - Sign up at https://aws.amazon.com
#    - Verify email
#    - Create S3 bucket: rbxfolio-media

# 2. Setup IAM user
#    - Create user with S3 only access
#    - Download credentials

# 3. Update backend
#    - Install: npm install aws-sdk
#    - Update apps/api/.env:
#      AWS_ACCESS_KEY_ID=...
#      AWS_SECRET_ACCESS_KEY=...
#      AWS_REGION=us-east-1
#      AWS_S3_BUCKET=rbxfolio-media

# 4. Migrate from R2 to S3
#    - Update r2-storage.service.ts to use AWS SDK
#    - Test file upload
#    - Verify S3 bucket receiving files

# 5. Run tests
#    - pnpm --filter @rbxfolio/api test
#    - Verify storage tests pass
```

### Phase 3: Monitoring (30 min)
```bash
# 1. Downgrade Sentry
#    - Go to https://sentry.io/settings/billing/
#    - Downgrade to free plan
#    - Keep DSN token

# 2. Downgrade New Relic
#    - Go to https://one.newrelic.com/admin/licensing
#    - Select free tier
#    - Keep API keys

# 3. Verify both still working
#    - Check dashboards still receiving data
#    - No configuration changes needed
```

### Phase 4: Testing & Verification (1 hour)
```bash
# 1. Run full test suite
pnpm test
# Expected: All tests passing

# 2. Test critical flows
#    - User signup (email should arrive via SendGrid)
#    - File upload (should go to S3)
#    - Error logging (should appear in Sentry)
#    - Performance tracking (should appear in New Relic)

# 3. Test in staging environment
#    - Deploy to Railway staging
#    - Verify all services connected
#    - Check logs for any errors

# 4. Deploy to production
#    - Push to main branch
#    - Monitor Vercel & Railway deployments
#    - Verify free tier services receiving data
```

---

## Cost Breakdown - Before & After

### Before (Current Setup)

| Service | Monthly | Annual |
|---------|---------|--------|
| Vercel | $0 | $0 |
| Railway | $5-10 | $60-120 |
| Cloudflare R2 | $2-5 | $24-60 |
| Resend | $20 | $240 |
| Sentry | $20 | $240 |
| New Relic | $30 | $360 |
| Domain | $1 | $12 |
| **TOTAL** | **$78-87** | **$936-1,032** |

### After (Free Tier Optimization)

| Service | Monthly | Annual |
|---------|---------|--------|
| Vercel | $0 | $0 |
| Railway | $0* | $0* |
| AWS S3 | $0** | $0** |
| SendGrid | $0 | $0 |
| Sentry | $0 | $0 |
| New Relic | $0 | $0 |
| Domain | $0.10 | $1.20 |
| **TOTAL** | **$0.10** | **$1.20** |

**Savings: $78-87/month = $936-1,032/year** 🎉

*Railway: $5/month credit covers API + DB  
**AWS S3: Free for 12 months, then ~$5/month after first year

---

## Service Comparison Table

| Feature | Vercel | Railway | AWS S3 | SendGrid | Sentry | New Relic |
|---------|--------|---------|--------|----------|--------|-----------|
| **Free Tier** | 50GB | $5 credit | 5GB (12mo) | 100/day | 5K/mo | 1GB/mo |
| **Cost** | $0 | $0-5 | $0 | $0 | $0 | $0 |
| **Suitable** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

---

## Migration Checklist

### Week 1: Email Service
- [ ] Create SendGrid account
- [ ] Verify domain in SendGrid
- [ ] Get API key
- [ ] Update backend code
- [ ] Update environment variables
- [ ] Test email sending
- [ ] Run test suite
- [ ] Deploy to staging

### Week 2: File Storage
- [ ] Create AWS account
- [ ] Create S3 bucket
- [ ] Create IAM user
- [ ] Get AWS credentials
- [ ] Update backend code
- [ ] Update environment variables
- [ ] Migrate existing files (if any)
- [ ] Test file upload
- [ ] Run test suite
- [ ] Deploy to staging

### Week 3: Monitoring
- [ ] Downgrade Sentry to free
- [ ] Downgrade New Relic to free
- [ ] Verify both still working
- [ ] No code changes needed

### Week 4: Production Deployment
- [ ] Final testing on staging
- [ ] Deploy to production
- [ ] Monitor all services
- [ ] Document final configuration
- [ ] Update team on new services

---

## Environment Variables - After Migration

```bash
# apps/api/.env.production

# Database (Railway - still $5/month credit)
DATABASE_URL=postgresql://...

# File Storage (AWS S3 - free for 12 months)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=rbxfolio-media
AWS_S3_PUBLIC_URL=https://rbxfolio-media.s3.amazonaws.com

# Email (SendGrid - free)
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@rbxfolio.com

# Error Tracking (Sentry - free)
SENTRY_DSN_API=...

# APM Monitoring (New Relic - free)
NEW_RELIC_LICENSE_KEY=...
NEW_RELIC_APP_NAME=rbxfolio-api
```

---

## Risk Mitigation

### Risk 1: AWS S3 Free Tier Expires After 12 Months
```
Mitigation:
1. Set up CloudWatch budget alarm ($10)
2. Before expiration:
   a. Migrate to Cloudflare R2 ($0.015/GB)
   b. Migrate to Wasabi ($0.0045/GB)
   c. Keep using S3 if usage stays low (~$5/month)
```

### Risk 2: Railway $5 Credit Expires
```
Mitigation:
1. Before expiration:
   a. Option A: Pay $5/month (still very cheap)
   b. Option B: Migrate to Render free tier (may auto-sleep)
   c. Option C: Use Supabase (free PostgreSQL + storage)
```

### Risk 3: SendGrid 100 emails/day limit too low
```
Mitigation:
1. Switch to AWS SES (62K emails/month free)
2. Upgrade SendGrid plan ($10/month for more emails)
3. Implement email queuing to stay within limits
```

---

## Long-Term Free Strategy

### Year 1 (Free/Minimal Cost)
```
✅ Vercel: $0 (frontend)
✅ Railway: $0 (covered by $5 credit)
✅ AWS S3: $0 (12-month free tier)
✅ SendGrid: $0 (100 emails/day)
✅ Sentry: $0 (free plan)
✅ New Relic: $0 (free plan)
✅ Domain: $1-2 (cheap domain)
─────────────
TOTAL: $1-2/month
```

### Year 2+ (Minimal Paid Services)
```
After free tiers expire, evaluate:
✅ Vercel: $0 (stays free)
✅ Railway or Render: $5/month (minimal API/DB)
✅ Cloudflare R2: ~$1/month (10GB data)
✅ SendGrid or SES: $0-10 (as needed)
✅ Sentry: $0 (free plan sufficient)
✅ New Relic: $0 (free plan sufficient)
✅ Domain: $10-15/year
─────────────
TOTAL: $15-25/month ($180-300/year)
```

---

## Recommended Implementation Order

1. **Keep as-is (Free):** Vercel, Sentry (free plan), New Relic (free plan), Cloudflare
2. **Immediate Switch:** Email to SendGrid (saves $20/month)
3. **Phase 2 Switch:** File Storage to AWS S3 (saves $5/month)
4. **Phase 3 Optimize:** Railway credit covers API+DB ($5/month)

**Estimated Savings: $936-1,032/year** ✅

---

## Conclusion

RbxFolio MVP can operate **completely free** using free-tier services:

- **Year 1:** $1-2/month (domain only)
- **Year 2+:** $15-25/month (minimal paid services)

**Total First Year Cost: $12-24**  
**Savings vs. Current Setup: $900+**

This approach is:
- ✅ **Cost-effective** for MVP phase
- ✅ **Scalable** as usage grows
- ✅ **Professional** with paid domain
- ✅ **Sustainable** long-term

---

## Quick Start - Implementation Commands

```bash
# 1. Create SendGrid account
# Go to https://sendgrid.com/free

# 2. Create AWS S3 account & bucket
# Go to https://aws.amazon.com

# 3. Update email service
npm install @sendgrid/mail
# Update apps/api/src/email/email.service.ts

# 4. Update file storage
npm install aws-sdk
# Update apps/api/src/media/r2-storage.service.ts

# 5. Test
pnpm test
pnpm build

# 6. Deploy
git push origin main
```

---

**Status: ✅ Ready for Implementation**  
**Estimated Migration Time: 3-4 hours**  
**Annual Savings: $936+**
