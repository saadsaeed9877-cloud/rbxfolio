# Quick Start - 100% Free No-Card Setup (30 Min Guide)

**Total Setup Time: 30 minutes**  
**Total Cost: $0**  
**Credit Card: Not needed**

---

## Service Sign-Up List (Copy-Paste URLs)

Copy these URLs and sign up in order. **No card will be asked at any step.**

### 1️⃣ Frontend (Already Done)
```
✅ Vercel: https://vercel.com
   - Sign up with GitHub
   - Connect rbxfolio repo
   - Auto-deploys every push
```

### 2️⃣ Domain (5 min)
```
Go to: https://www.freenom.com
- Search: rbxfolio.tk
- Click "Get it now"
- Checkout → FREE (no card!)
- Verify email
```

### 3️⃣ Database (5 min)
```
Go to: https://supabase.com
- Sign up with GitHub
- Create project: rbxfolio
- Get connection string (DATABASE_URL)
- Copy password from generation
```

### 4️⃣ Backend (5 min)
```
Go to: https://render.com
- Sign up with GitHub
- Connect rbxfolio repo
- Deploy as Web Service
- Add DATABASE_URL to environment
```

### 5️⃣ Email (5 min)
```
Go to: https://www.brevo.com
- Click "Sign Up Free"
- Create account (no card!)
- Settings → SMTP & API
- Copy API Key (BREVO_API_KEY)
```

### 6️⃣ File Storage (0 min - Already Done!)
```
✅ Local storage already configured
✅ Files go to ./uploads directory
✅ No setup needed
✅ Completely free
```

### 7️⃣ Error Tracking
```
✅ Already have Sentry
   Dashboard: https://sentry.io
   Use free plan (5K events/month)
```

### 8️⃣ Monitoring
```
✅ Already have New Relic
   Dashboard: https://newrelic.com
   Use free plan (1GB data/month)
```

### 9️⃣ CDN/DNS (5 min)
```
Go to: https://dash.cloudflare.com
- Sign up (no card!)
- Add site: rbxfolio.tk
- Update Freenom to use Cloudflare nameservers
```

---

## Environment Variables (Copy-Paste Template)

Create `.env.production` with these values:

```bash
# Database - from Supabase
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres

# Authentication
BETTER_AUTH_SECRET=generate-32-random-characters-here
BETTER_AUTH_URL=https://rbxfolio.tk

# API Configuration
CORS_ORIGIN=https://rbxfolio.tk
PORT=3001

# File Storage - Local (no setup needed!)
UPLOAD_DIR=./uploads

# Email - from Brevo
BREVO_API_KEY=your-api-key-from-brevo
BREVO_FROM_EMAIL=noreply@rbxfolio.tk

# Error Tracking
SENTRY_DSN_API=your-sentry-dsn

# Monitoring
NEW_RELIC_LICENSE_KEY=your-new-relic-key
NEW_RELIC_APP_NAME=rbxfolio-api
NEW_RELIC_LOG_LEVEL=info
```

---

## One-Line Reference

| Service | Sign-Up URL | No Card? | Time |
|---------|-------------|----------|------|
| Vercel | vercel.com | ✅ Yes | ✅ Done |
| Freenom | freenom.com | ✅ Yes | 5 min |
| Supabase | supabase.com | ✅ Yes | 5 min |
| Render | render.com | ✅ Yes | 5 min |
| Brevo | brevo.com | ✅ Yes | 5 min |
| Cloudflare | cloudflare.com | ✅ Yes | 5 min | ✅ Free Forever |
| Sentry | sentry.io | ✅ Yes | ✅ Done |
| New Relic | newrelic.com | ✅ Yes | ✅ Done |
| Cloudflare | cloudflare.com | ✅ Yes | 5 min |

---

## Deployment Checklist

```bash
# 1. Run tests locally
pnpm test
# Expected: All tests pass ✅

# 2. Build locally
pnpm build
# Expected: Build successful ✅

# 3. Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# 4. Verify deployments
# - Check Vercel dashboard (frontend should deploy)
# - Check Render dashboard (backend should deploy)

# 5. Test live site
curl https://rbxfolio.tk
# Expected: 200 OK ✅

# 6. Test API
curl https://rbxfolio.tk/api/v1/health
# Expected: {"status":"ok"} ✅
```

---

## Service Credentials Locations (Where to Copy From)

### Supabase
```
Dashboard → Settings → Database
Look for: "Connection string"
Copy the postgresql://... string
Replace [PASSWORD] with your password
```

### Brevo
```
Dashboard → Settings → SMTP & API
Look for: "API Key"
Copy the SG.xxxxx string
```

### Bunny CDN
```
Dashboard → Storage → Your Storage Zone
Look for: "API Key" and "Storage Zone Name"
Copy both values
```

### Render
```
Dashboard → Environment Variables
Add all variables from .env.production template
```

---

## Cost = $0 (Really!)

| Item | Cost | Card? |
|------|------|-------|
| Frontend | $0 | ❌ No |
| Backend | $0 | ❌ No |
| Database | $0 | ❌ No |
| Storage | $0 | ❌ No |
| Email | $0 | ❌ No |
| Errors | $0 | ❌ No |
| Monitoring | $0 | ❌ No |
| Domain | $0 | ❌ No |
| CDN | $0 | ❌ No |
| **TOTAL** | **$0** | **❌ No** |

---

## Expected Issues & Solutions

**Issue: "Credit card required"**
- You clicked wrong button
- Use GitHub OAuth for sign-up (not email)
- Solution: Start signup over

**Issue: "Email verification pending"**
- Check spam folder
- Wait 5-10 minutes
- Solution: Re-request verification email

**Issue: "Database connection failed"**
- Check PASSWORD is correct
- Check DATABASE_URL in Render environment
- Solution: Copy password again from Supabase

**Issue: "Email not sending"**
- Check BREVO_API_KEY is correct
- Verify email domain in Brevo
- Solution: Copy API key again

**Issue: "File upload fails"**
- Check ./uploads directory exists
- Check write permissions on uploads folder
- Solution: `mkdir -p ./uploads && chmod 755 ./uploads`

---

## FAQ

**Q: Do I really not need a credit card?**
A: 100% correct! All these services offer completely free tiers without card requirements.

**Q: Will my site be deleted after 30 days?**
A: No! These are permanent free accounts, not trials.

**Q: What if I get viral and usage explodes?**
A: Services will either serve you for free (within limits) or ask for payment. Your choice then.

**Q: Can I upgrade later?**
A: Yes, if you want paid features. But you don't need to.

**Q: Is this production-ready?**
A: Yes! Enterprise-grade infrastructure used by thousands of startups.

**Q: What about privacy/data security?**
A: All these services are legitimate, secure, and comply with privacy laws.

---

## After 30-Minute Setup

🎉 You'll have:
- ✅ Frontend hosted on Vercel
- ✅ Backend running on Render
- ✅ Database on Supabase
- ✅ Files stored on Bunny CDN
- ✅ Emails sent via Brevo
- ✅ Errors tracked in Sentry
- ✅ Performance monitored by New Relic
- ✅ Domain name (.tk)
- ✅ CDN/DNS on Cloudflare
- ✅ $0 monthly cost
- ✅ Zero credit cards

---

## Links Summary (Save This!)

```
Vercel:      https://vercel.com
Freenom:     https://www.freenom.com
Supabase:    https://supabase.com
Render:      https://render.com
Brevo:       https://www.brevo.com
Bunny CDN:   https://bunny.net
Sentry:      https://sentry.io
New Relic:   https://newrelic.com
Cloudflare:  https://dash.cloudflare.com
```

---

**Time to production: 30 minutes ⏱️**  
**Total cost: $0 💰**  
**Credit card: Not needed ✅**  
**Status: Ready to deploy! 🚀**
