# Complete RbxFolio Setup Guide - No Credit Card Required

**Status:** Production-ready setup guide  
**Cost:** $0/month (completely free)  
**Time:** 2-3 hours total setup  
**Credit Card:** Not needed at any step

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Frontend Hosting - Vercel](#step-1-frontend-hosting--vercel)
3. [Step 2: Database - Supabase](#step-2-database--supabase)
4. [Step 3: Backend - Render](#step-3-backend--render)
5. [Step 4: Email Service - Brevo](#step-4-email-service--brevo)
6. [Step 5: File Storage - Bunny CDN](#step-5-file-storage--bunny-cdn)
7. [Step 6: Error Tracking - Sentry](#step-6-error-tracking--sentry)
8. [Step 7: APM Monitoring - New Relic](#step-7-apm-monitoring--new-relic)
9. [Step 8: Domain - Freenom](#step-8-domain--freenom)
10. [Step 9: CDN/DNS - Cloudflare](#step-9-cdndns--cloudflare)
11. [Step 10: Local Development Setup](#step-10-local-development-setup)
12. [Step 11: Environment Variables Configuration](#step-11-environment-variables-configuration)
13. [Step 12: Deploy to Production](#step-12-deploy-to-production)
14. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:
- GitHub account (free)
- Terminal/Command line access
- Text editor (VS Code, etc.)
- pnpm installed (`npm install -g pnpm`)
- Git installed and configured

**No credit card needed for any service!**

---

## Step 1: Frontend Hosting - Vercel

**Duration:** 10 minutes  
**Cost:** $0  
**Card Required:** ❌ No

### 1.1: Create Vercel Account

```
1. Go to: https://vercel.com
2. Click "Sign Up"
3. Choose "Sign up with GitHub"
4. Authorize GitHub (you may already be logged in)
5. Confirm email if needed
```

### 1.2: Connect Your Repository

```
1. Vercel Dashboard → "New Project"
2. Select "Import Git Repository"
3. Search for: rbxfolio
4. Select your rbxfolio repository
5. Click "Import"
```

### 1.3: Configure Project Settings

```
1. Project settings → General
2. Framework: Next.js (auto-detected)
3. Root Directory: apps/web (important!)
4. Build & Development Settings:
   - Build Command: pnpm exec turbo run build
   - Output Directory: (leave default)
   - Install Command: pnpm install
5. Click "Deploy"
```

### 1.4: Wait for Deployment

```
Vercel will:
- Install dependencies
- Build the project
- Deploy to CDN
- Provide a .vercel.app URL

✅ Frontend will be live at: https://[project-name].vercel.app
```

**Status:** ✅ Vercel setup complete - frontend hosting active

---

## Step 2: Database - Supabase

**Duration:** 15 minutes  
**Cost:** $0 (500MB free forever)  
**Card Required:** ❌ No

### 2.1: Create Supabase Account

```
1. Go to: https://supabase.com
2. Click "Sign Up"
3. Choose "Sign up with GitHub"
4. Authorize Supabase
5. Verify email if needed
```

### 2.2: Create New Project

```
1. Supabase Dashboard → "New Project"
2. Fill in:
   - Project Name: rbxfolio
   - Database Password: [Save this somewhere safe - you'll need it]
   - Region: Choose closest to your location
   - Pricing Plan: Free
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize
```

### 2.3: Get Connection String

```
1. Go to project → Settings → Database
2. Look for "Connection Pooling" or "Connection string"
3. Copy the PostgreSQL connection string
4. It will look like:
   postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres
5. Replace [PASSWORD] with the password you generated
```

### 2.4: Create Tables (Database Schema)

```bash
# Clone the repo locally if you haven't already
git clone https://github.com/your-username/rbxfolio.git
cd rbxfolio

# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push schema to database
# When prompted, add your DATABASE_URL (connection string from above)
pnpm db:push
```

**Status:** ✅ Supabase setup complete - database ready

---

## Step 3: Backend - Render

**Duration:** 15 minutes  
**Cost:** $0 (free forever, no card required)  
**Card Required:** ❌ No

### 3.1: Create Render Account

```
1. Go to: https://render.com
2. Click "Get Started"
3. Choose "Sign up with GitHub"
4. Authorize Render
5. Verify email if needed
```

### 3.2: Create Web Service

```
1. Render Dashboard → "New +" → "Web Service"
2. Select your rbxfolio repository
3. Fill in:
   - Name: rbxfolio-api
   - Environment: Docker
   - Plan: Free
4. Click "Create Web Service"
5. Wait for initial build (5-10 minutes first time)
```

### 3.3: Configure Environment Variables

```
1. Go to your web service → Environment
2. Add these variables (copy from Step 11 below):
   - DATABASE_URL (from Supabase)
   - BETTER_AUTH_SECRET (generate random 32 chars)
   - BETTER_AUTH_URL (your Vercel domain)
   - CORS_ORIGIN (your Vercel domain)
   - BREVO_API_KEY (from Step 4 below)
   - BUNNY_API_KEY (from Step 5 below)
   - And all others from your .env.production
```

### 3.4: Configure Build & Deploy Commands

```
1. Settings → Build & Deploy
2. Set Build Command:
   pnpm install && pnpm db:push && pnpm --filter @rbxfolio/api build
3. Set Start Command:
   node dist/main.js
4. Save changes
```

### 3.5: Deploy

```
1. Go back to Deployments
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for build to complete (10-15 minutes)
4. Check logs for errors
5. Get your API URL: https://[service-name].onrender.com
```

**Status:** ✅ Render setup complete - backend API live

---

## Step 4: Email Service - Brevo

**Duration:** 10 minutes  
**Cost:** $0 (300 emails/day free)  
**Card Required:** ❌ No

### 4.1: Create Brevo Account

```
1. Go to: https://www.brevo.com
2. Click "Sign Up Free"
3. Enter email and create password
4. Verify email
5. ✅ No card asked!
```

### 4.2: Create API Key

```
1. Brevo Dashboard → Settings
2. Look for "SMTP & API"
3. Click "Create API Key"
4. Name it: rbxfolio-api
5. Copy the API Key (starts with SG.xxxxx)
6. Save this - you'll need it in environment variables
```

### 4.3: Verify Domain (Optional but recommended)

```
1. Settings → Domains
2. Click "Add Domain"
3. Enter your domain (from Step 8: rbxfolio.tk)
4. Add DNS records shown by Brevo
5. Wait 24-48 hours for verification
6. Once verified, use: noreply@rbxfolio.tk
```

**Status:** ✅ Brevo setup complete - email service ready

---

## Step 5: File Storage - Bunny CDN

**Duration:** 10 minutes  
**Cost:** $0 (10GB/month free)  
**Card Required:** ❌ No

### 5.1: Create Bunny Account

```
1. Go to: https://bunny.net
2. Click "Sign Up" (no card needed)
3. Enter email and create password
4. Verify email
5. ✅ You're in!
```

### 5.2: Create Storage Zone

```
1. Bunny Dashboard → Storage
2. Click "Add Storage Zone"
3. Fill in:
   - Name: rbxfolio-media
   - Region: Choose closest to your location
   - Replication: (keep default)
4. Click "Create"
5. Wait 30 seconds for zone to be created
```

### 5.3: Get API Credentials

```
1. Select your storage zone: rbxfolio-media
2. Look for:
   - Storage Zone Name: rbxfolio-media
   - API Key: (copy from FTP & API section)
3. Look at your account:
   - Account Settings → Account
   - AccessKey: (your API key)
4. Save both values
```

### 5.4: Configure CDN

```
1. Select your storage zone → CDN
2. Settings:
   - Enable HTTPS: ✅ Yes
   - Enable CDN: ✅ Yes
   - Default CDN Hostname: rbxfolio-media.b-cdn.net
3. You can also add your custom domain later
```

**Status:** ✅ Bunny CDN setup complete - file storage ready

---

## Step 6: Error Tracking - Sentry

**Duration:** 10 minutes  
**Cost:** $0 (5K events/month free)  
**Card Required:** ❌ No (if using GitHub auth)

### 6.1: Create Sentry Account

```
1. Go to: https://sentry.io
2. Click "Sign Up"
3. Choose "Sign up with GitHub"
4. Authorize Sentry
5. Verify email if needed
```

### 6.2: Create Project

```
1. Sentry Dashboard → Projects → "Create Project"
2. Platform: NestJS
3. Alert Setting: Default (emails on critical issues)
4. Project name: rbxfolio-api
5. Click "Create Project"
```

### 6.3: Get DSN

```
1. Project Settings → Client Keys (DSN)
2. Copy the DSN (looks like: https://xxx@yyy.ingest.sentry.io/zzz)
3. Save this for environment variables
4. Also check:
   - Settings → Release tracking (optional)
   - Settings → Integrations → GitHub (for enhanced tracking)
```

**Status:** ✅ Sentry setup complete - error tracking ready

---

## Step 7: APM Monitoring - New Relic

**Duration:** 10 minutes  
**Cost:** $0 (1GB data/month free)  
**Card Required:** ❌ No

### 7.1: Create New Relic Account

```
1. Go to: https://newrelic.com
2. Click "Sign Up Free"
3. Enter email, create password
4. Verify email
5. ✅ No card required!
```

### 7.2: Create Application

```
1. New Relic Dashboard → "Add more data"
2. Search for: Node.js
3. Click "Node.js APM"
4. Follow setup wizard:
   - Application Name: rbxfolio-api
   - Framework: NestJS (or Express)
5. Click "Download agent"
```

### 7.3: Get License Key

```
1. New Relic Dashboard → Account Settings
2. Look for "License key"
3. Copy it (40-character string)
4. Save for environment variables
```

### 7.4: Install Agent (Backend)

```bash
# In apps/api directory
npm install newrelic

# Add to main.ts (first line)
require('newrelic');
```

**Status:** ✅ New Relic setup complete - APM monitoring ready

---

## Step 8: Domain - Freenom

**Duration:** 10 minutes  
**Cost:** $0 (free for 12 months, renewable free)  
**Card Required:** ❌ No

### 8.1: Go to Freenom

```
1. Go to: https://www.freenom.com
2. In search bar, type: rbxfolio.tk
3. Choose your domain (or try .ml, .ga, .cf)
4. Click "Get it now!"
```

### 8.2: Checkout (Free!)

```
1. Review cart (shows $0.00)
2. Click "Continue"
3. If asked for login: Sign up with email
4. Choose period: 12 months
5. Click "Complete Order"
6. ✅ Zero dollars charged!
```

### 8.3: Activate Domain

```
1. Check your email for activation link
2. Click link to verify
3. Your domain is now active!
```

### 8.4: Point to Cloudflare (Step 9)

```
We'll set nameservers in the next step
Keep this DNS info handy:
- Registrar: Freenom
- Domain: rbxfolio.tk
```

**Status:** ✅ Domain registered - now configure DNS

---

## Step 9: CDN/DNS - Cloudflare

**Duration:** 15 minutes  
**Cost:** $0 (free forever)  
**Card Required:** ❌ No

### 9.1: Create Cloudflare Account

```
1. Go to: https://dash.cloudflare.com
2. Click "Sign Up"
3. Enter email and password
4. Verify email
5. ✅ No card required!
```

### 9.2: Add Your Domain

```
1. Cloudflare Dashboard → "Add site"
2. Enter your domain: rbxfolio.tk
3. Select Plan: Free
4. Click "Add site"
5. Scan DNS records (Cloudflare will detect existing)
```

### 9.3: Update Nameservers at Freenom

```
1. Go to Freenom Dashboard
2. Select your domain → Manage domain
3. Management Tools → Nameservers
4. Use custom nameservers
5. Enter Cloudflare's nameservers:
   - ns1.cloudflare.com
   - ns2.cloudflare.com
6. Save changes (takes 24-48 hours to propagate)
```

### 9.4: Configure DNS Records

```
1. Back in Cloudflare → DNS
2. Add these records:

   For Frontend (Vercel):
   - Type: CNAME
   - Name: www
   - Target: [your-vercel-project].vercel.app
   - Proxy: Proxied (orange cloud)

   For Backend (Render):
   - Type: CNAME
   - Name: api
   - Target: [your-render-service].onrender.com
   - Proxy: Proxied (orange cloud)

3. Save all records
```

### 9.5: SSL Certificate

```
1. Cloudflare → SSL/TLS
2. Encryption mode: Full (Strict)
3. Edge Certificates: Auto (enabled)
4. You now have free SSL for your domain!
```

**Status:** ✅ Cloudflare setup complete - DNS & SSL ready

---

## Step 10: Local Development Setup

**Duration:** 15 minutes  
**Cost:** $0  
**Card Required:** ❌ No

### 10.1: Clone Repository

```bash
# Clone the repo
git clone https://github.com/your-username/rbxfolio.git
cd rbxfolio

# Install dependencies
pnpm install

# Install Prisma
pnpm db:generate
```

### 10.2: Set Up Local Database (Optional for Development)

```bash
# Using Docker Compose (if you have Docker installed)
docker-compose up -d

# This starts local PostgreSQL on localhost:5433
# Database: rbxfolio
# User: rbxfolio
# Password: rbxfolio
```

**Or** use Supabase connection string for development:

```bash
# Your DATABASE_URL will point to Supabase
# Set in .env file (Step 11)
```

### 10.3: Create .env File

```bash
# Copy the example
cp .env.example .env

# Edit .env with your values (see Step 11)
nano .env  # or use your editor
```

**Status:** ✅ Local setup complete

---

## Step 11: Environment Variables Configuration

**Duration:** 10 minutes

### 11.1: Get Your Credentials

By now you should have collected:

**From Supabase:**
- DATABASE_URL: postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres

**From Brevo:**
- BREVO_API_KEY: SG.xxxxx
- BREVO_FROM_EMAIL: noreply@rbxfolio.tk

**From Bunny:**
- BUNNY_STORAGE_ZONE: rbxfolio-media
- BUNNY_API_KEY: xxxxx
- BUNNY_STORAGE_ENDPOINT: rbxfolio-media.b-cdn.net

**From Sentry:**
- SENTRY_DSN_API: https://xxx@yyy.ingest.sentry.io/zzz

**From New Relic:**
- NEW_RELIC_LICENSE_KEY: xxxxx (40-char string)
- NEW_RELIC_APP_NAME: rbxfolio-api

**From Vercel:**
- NEXT_PUBLIC_APP_URL: https://rbxfolio-[random].vercel.app

**From Render:**
- (Will get deployment URL after first deploy)

### 11.2: Create Root .env File

Create `.env` in the project root:

```bash
# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres

# Authentication (generate random 32-char string)
BETTER_AUTH_SECRET=generate-a-random-32-character-string-here
BETTER_AUTH_URL=https://rbxfolio-[random].vercel.app

# Web (Frontend)
NEXT_PUBLIC_API_URL=https://api.rbxfolio.tk/api/v1
NEXT_PUBLIC_APP_URL=https://rbxfolio-[random].vercel.app

# API (Backend)
PORT=3001
UPLOAD_DIR=./uploads
CORS_ORIGIN=https://rbxfolio-[random].vercel.app

# Email (Brevo)
BREVO_API_KEY=SG.xxxxx
BREVO_FROM_EMAIL=noreply@rbxfolio.tk

# File Storage (Bunny CDN)
BUNNY_STORAGE_ZONE=rbxfolio-media
BUNNY_API_KEY=xxxxx
BUNNY_STORAGE_ENDPOINT=rbxfolio-media.b-cdn.net

# Error Tracking (Sentry)
SENTRY_DSN_API=https://xxx@yyy.ingest.sentry.io/zzz

# APM Monitoring (New Relic)
NEW_RELIC_LICENSE_KEY=xxxxx
NEW_RELIC_APP_NAME=rbxfolio-api
NEW_RELIC_LOG_LEVEL=info
```

### 11.3: Create .env.production (for Render deployment)

Create `.env.production` in the project root (same values as above, but with production URLs):

```bash
# Same as .env but with production URLs
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres
BETTER_AUTH_SECRET=same-random-32-char-string
BETTER_AUTH_URL=https://rbxfolio.tk  # Use custom domain once DNS propagates
NEXT_PUBLIC_API_URL=https://api.rbxfolio.tk/api/v1
NEXT_PUBLIC_APP_URL=https://rbxfolio.tk
# ... rest same as above
```

### 11.4: Add to Render Environment

```
1. Go to Render → Your Service → Environment
2. Add all variables from .env.production
3. Click "Save"
4. Trigger re-deploy: Manual Deploy → Deploy latest commit
```

**Status:** ✅ Environment configured

---

## Step 12: Deploy to Production

**Duration:** 20 minutes

### 12.1: Push Code to GitHub

```bash
# Make sure all code is committed
git status  # should show clean working directory

# Push to main branch
git push origin main
```

### 12.2: Verify Vercel Deployment

```
1. Go to Vercel Dashboard
2. Select rbxfolio project
3. Check "Deployments" tab
4. Last deployment should show "READY" (green)
5. Click to get domain: https://rbxfolio-[random].vercel.app
```

### 12.3: Verify Render Deployment

```
1. Go to Render Dashboard
2. Select rbxfolio-api service
3. Check "Events" tab
4. Last deployment should show "Deploy succeeded"
5. Check "Environment" → "Environment" tab
   - Verify all variables are set correctly
6. Get deployment URL: https://[service-name].onrender.com
```

### 12.4: Test API Connection

```bash
# Test from your local machine
curl https://[render-service].onrender.com/api/v1/health

# Expected response:
# {"status":"ok","timestamp":"2024-09-22T10:30:00Z"}
```

### 12.5: Test Frontend

```
1. Open browser: https://rbxfolio-[random].vercel.app
2. Should see homepage (may load slowly first time)
3. Try login flow
4. Check console for any errors
```

### 12.6: DNS Propagation (Wait 24-48 hours)

```
Once Cloudflare DNS propagates:
1. https://rbxfolio.tk → Vercel frontend
2. https://api.rbxfolio.tk → Render backend
3. https://www.rbxfolio.tk → Vercel frontend

Check status: https://www.whatsmydns.net/
```

**Status:** ✅ Deployed to production!

---

## Step 13: Post-Deployment Verification

### 13.1: Check All Services

```bash
# Frontend health
curl -I https://rbxfolio-[random].vercel.app

# Backend health
curl https://[render-service].onrender.com/api/v1/health

# Database connection
pnpm db:generate

# Email sending (check Brevo dashboard later)
# File uploads (test from UI)
```

### 13.2: Monitor Errors

```
1. Sentry Dashboard → rbxfolio-api
   - Check for any errors in first 5 minutes
   
2. New Relic Dashboard
   - Check APM data coming in
   - Should see transaction traces
```

### 13.3: Set Up Alerts (Optional)

```
1. Sentry → Alerts
   - Create alert for critical errors
   
2. New Relic → Notification Channels
   - Add email for high-latency alerts
```

**Status:** ✅ Production monitoring active

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Credit card required during signup"

**Solution:** You clicked the wrong button. Use GitHub OAuth instead:
1. Don't click "Continue with email"
2. Click "Sign up with GitHub"
3. Authorize the service
4. No card ever asked

---

#### Issue: "Database connection failed"

**Solution:** Check your DATABASE_URL:
1. Go to Supabase → Settings → Database
2. Copy connection string again
3. Replace [PASSWORD] with actual password
4. Check DATABASE_URL in Render environment

---

#### Issue: "Email not sending"

**Solution:** Check BREVO_API_KEY:
1. Go to Brevo → Settings → SMTP & API
2. Create new API key if needed
3. Copy exact key (no spaces)
4. Update in Render environment
5. Check Brevo dashboard → Emails for delivery status

---

#### Issue: "File upload fails"

**Solution:** Check Bunny CDN credentials:
1. Go to Bunny → Storage → rbxfolio-media
2. Verify storage zone exists
3. Copy API key from FTP & API section
4. Update BUNNY_API_KEY in environment
5. Restart Render service

---

#### Issue: "DNS not resolving"

**Solution:** DNS takes 24-48 hours to propagate:
1. Check: https://www.whatsmydns.net/?domain=rbxfolio.tk
2. If not updated:
   - Verify nameservers at Freenom
   - Should be: ns1.cloudflare.com, ns2.cloudflare.com
   - Wait another 12-24 hours
3. Use temporary vercel.app URL in the meantime

---

#### Issue: "Render deployment failing"

**Solution:** Check build logs:
1. Go to Render → Service → Events
2. Click on failed deployment
3. Scroll through logs to find error
4. Common causes:
   - DATABASE_URL missing
   - pnpm install failing
   - Port not set to 3001

---

### Quick Checklist Before Launch

- [ ] Vercel frontend deployed
- [ ] Supabase database created
- [ ] Render backend deployed
- [ ] Environment variables set in all services
- [ ] Brevo email API key verified
- [ ] Bunny CDN storage zone created
- [ ] Sentry project created
- [ ] New Relic account set up
- [ ] Freenom domain registered
- [ ] Cloudflare DNS configured
- [ ] All services tested
- [ ] Monitoring alerts set up

---

## Success Indicators

When everything is working:

✅ Frontend loads at: https://rbxfolio.tk (or .vercel.app URL)
✅ API responds at: https://api.rbxfolio.tk/api/v1/health
✅ Database: Can create/read/update/delete records
✅ Email: Emails send successfully (check Brevo)
✅ Storage: File uploads work
✅ Errors: Sentry shows 0 errors initially
✅ Performance: New Relic shows API <100ms responses
✅ HTTPS: Green lock in browser address bar

---

## What's Running (Cost Breakdown)

| Service | Cost | Monthly | Annual |
|---------|------|---------|--------|
| Vercel | Free | $0 | $0 |
| Render | Free | $0 | $0 |
| Supabase | Free | $0 | $0 |
| Brevo | Free | $0 | $0 |
| Bunny CDN | Free | $0 | $0 |
| Sentry | Free | $0 | $0 |
| New Relic | Free | $0 | $0 |
| Freenom | Free | $0 | $0 |
| Cloudflare | Free | $0 | $0 |
| **TOTAL** | **FREE** | **$0** | **$0** |

---

## Support & Resources

**For Each Service:**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Render Docs: https://render.com/docs
- Brevo Docs: https://developers.brevo.com/
- Bunny Docs: https://support.bunny.net/
- Sentry Docs: https://docs.sentry.io/
- New Relic Docs: https://docs.newrelic.com/
- Freenom FAQs: https://freenom.com/en/faq.html
- Cloudflare Docs: https://developers.cloudflare.com/

---

## Next Steps

After successful deployment:

1. **Share the live site** - Tell the world about RbxFolio!
2. **Gather user feedback** - Monitor Sentry for errors
3. **Plan Phase 3** - Add real-time notifications, messaging
4. **Optimize performance** - Monitor New Relic dashboard

---

**Congratulations! RbxFolio is now live! 🎉**

Your production MVP is running completely free with professional infrastructure.

**Status:** ✅ Ready to serve users  
**Cost:** $0/month  
**Next:** Phase 3 features and enhancements
