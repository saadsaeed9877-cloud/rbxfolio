# .env Setup Reference Card

**Quick copy-paste guide for all environment variables**

---

## Development Setup (.env)

Copy and paste this template, then fill in your values:

```bash
# DATABASE (from Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres

# AUTHENTICATION
BETTER_AUTH_SECRET=your-random-32-char-string-here
BETTER_AUTH_URL=http://localhost:3000

# WEB (Frontend)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API (Backend)
PORT=3001
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:3000

# EMAIL (Brevo)
BREVO_API_KEY=SG.your_api_key_here
BREVO_FROM_EMAIL=noreply@rbxfolio.local

# FILE STORAGE (Local Filesystem - Free, No Setup)
UPLOAD_DIR=./uploads

# ERROR TRACKING (Sentry)
SENTRY_DSN_API=https://your_key@domain.ingest.sentry.io/project_id

# APM MONITORING (New Relic)
NEW_RELIC_LICENSE_KEY=your_40_char_license_key
NEW_RELIC_APP_NAME=rbxfolio-api
NEW_RELIC_LOG_LEVEL=info
```

---

## Production Setup (.env.production)

Create `.env.production` with production URLs:

```bash
# DATABASE (same as dev - Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres

# AUTHENTICATION (use production domain)
BETTER_AUTH_SECRET=same-random-32-char-string-as-dev
BETTER_AUTH_URL=https://rbxfolio.tk

# WEB (Frontend - production domain)
NEXT_PUBLIC_API_URL=https://api.rbxfolio.tk/api/v1
NEXT_PUBLIC_APP_URL=https://rbxfolio.tk

# API (Backend - use Render port or default)
PORT=3001
UPLOAD_DIR=./uploads
CORS_ORIGIN=https://rbxfolio.tk

# EMAIL (Brevo - same as dev)
BREVO_API_KEY=SG.your_api_key_here
BREVO_FROM_EMAIL=noreply@rbxfolio.tk

# FILE STORAGE (Local Filesystem - same as dev)
UPLOAD_DIR=/var/app/uploads
BUNNY_STORAGE_ENDPOINT=rbxfolio-media.b-cdn.net

# ERROR TRACKING (Sentry - same as dev)
SENTRY_DSN_API=https://your_key@domain.ingest.sentry.io/project_id

# APM MONITORING (New Relic - same as dev)
NEW_RELIC_LICENSE_KEY=your_40_char_license_key
NEW_RELIC_APP_NAME=rbxfolio-api
NEW_RELIC_LOG_LEVEL=info
```

---

## How to Get Each Value

### DATABASE_URL (Supabase)

```
1. Go to: https://supabase.com/projects
2. Select your project: rbxfolio
3. Go to: Settings → Database
4. Find: "Connection string"
5. Copy the postgresql://... URL
6. Replace [PASSWORD] with the password you set
7. Format: postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres
```

### BETTER_AUTH_SECRET

```
Generate a random 32-character string:

Option 1 (Node.js):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Option 2 (Python):
python3 -c "import secrets; print(secrets.token_hex(32))"

Option 3 (openssl):
openssl rand -hex 32

Keep this SECRET! Same for dev and production.
```

### BETTER_AUTH_URL

```
Development:  http://localhost:3000

Production:   https://rbxfolio.tk
              (after DNS setup completes)

Fallback:     https://rbxfolio-[random].vercel.app
              (your Vercel domain)
```

### NEXT_PUBLIC_API_URL

```
Development:  http://localhost:3001/api/v1

Production:   https://api.rbxfolio.tk/api/v1
              (after DNS setup completes)

Fallback:     https://[render-service].onrender.com/api/v1
              (your Render domain)
```

### NEXT_PUBLIC_APP_URL

```
Development:  http://localhost:3000

Production:   https://rbxfolio.tk
              (after DNS setup completes)

Fallback:     https://rbxfolio-[random].vercel.app
              (your Vercel domain)
```

### BREVO_API_KEY

```
1. Go to: https://www.brevo.com/login
2. Dashboard → Settings
3. Find: "SMTP & API"
4. Click: "Create API Key"
5. Name it: rbxfolio-api
6. Copy the key (starts with: SG.xxxxx)

Keep this SECRET!
```

### BREVO_FROM_EMAIL

```
Development:  noreply@rbxfolio.local

Production:   noreply@rbxfolio.tk
              (must be verified in Brevo first)
```

### BUNNY_STORAGE_ZONE

```
1. Go to: https://bunny.net/dashboard
2. Storage → Your Zone
3. Look for: "Storage Zone Name"
4. It should be: rbxfolio-media
```

### BUNNY_API_KEY

```
1. Go to: https://bunny.net/dashboard
2. Storage → rbxfolio-media
3. Look for: "FTP & API" section
4. Copy the "API Key"

Alternative:
1. Account Settings
2. Find: "AccessKey"
3. Copy it

Keep this SECRET!
```

### BUNNY_STORAGE_ENDPOINT

```
Format: [STORAGE_ZONE_NAME].b-cdn.net

If your zone is: rbxfolio-media
Then endpoint is: rbxfolio-media.b-cdn.net
```

### SENTRY_DSN_API

```
1. Go to: https://sentry.io/organizations
2. Select: rbxfolio-api
3. Settings → Client Keys (DSN)
4. Copy the DSN (looks like):
   https://xxx@yyy.ingest.sentry.io/zzz

Keep this SECRET!
```

### NEW_RELIC_LICENSE_KEY

```
1. Go to: https://one.newrelic.com
2. Account Settings (top right)
3. Find: "License key"
4. Copy the 40-character string

Keep this SECRET!
```

### NEW_RELIC_APP_NAME

```
Just use: rbxfolio-api
(or whatever you called your project)
```

---

## Common Mistakes & Fixes

### ❌ "DATABASE_URL not set"
**Fix:** Make sure you replaced [PASSWORD] with actual password from Supabase

### ❌ "BETTER_AUTH_SECRET too short"
**Fix:** Must be at least 32 characters. Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### ❌ "Email not sending"
**Fix:** Check BREVO_API_KEY is correct and starts with SG.

### ❌ "File upload fails"
**Fix:** Check BUNNY_API_KEY and BUNNY_STORAGE_ZONE are correct

### ❌ "API can't connect to frontend"
**Fix:** Check CORS_ORIGIN matches your frontend URL exactly

### ❌ "Errors not showing in Sentry"
**Fix:** Check SENTRY_DSN_API is correct and doesn't have extra spaces

---

## Security Notes

⚠️ **NEVER commit these values to git:**
- BETTER_AUTH_SECRET
- BREVO_API_KEY
- BUNNY_API_KEY
- SENTRY_DSN_API
- NEW_RELIC_LICENSE_KEY
- DATABASE_URL (contains password)

✅ **They're already in .gitignore**, but be careful!

For production on Render:
1. Add variables via Render Dashboard → Environment
2. DO NOT put .env file in git
3. Render will automatically read from Environment section

---

## Quick Verification

After setting up .env, run:

```bash
# Check database connection
pnpm db:generate

# Check if environment loads (dev server)
pnpm dev

# Expected output:
# ✓ Web server running on http://localhost:3000
# ✓ API server running on http://localhost:3001
# ✓ Connected to database
# ✓ All services online
```

---

## File Locations

```
.env                  ← Development (on your computer)
.env.production       ← Production (before pushing to Render)
.env.example          ← Template (committed to git)
.env.local            ← Optional: local overrides (gitignored)
.gitignore            ← .env is already listed here
```

---

## For Render Deployment

Instead of .env file, add variables via Render Dashboard:

```
1. Render → Your Service → Environment
2. Add each variable:
   - DATABASE_URL: ...
   - BETTER_AUTH_SECRET: ...
   - etc.
3. Click "Save"
4. Manual Deploy → Deploy latest commit
```

---

## Summary Table

| Variable | Source | Format | Dev Example | Prod Example |
|----------|--------|--------|-------------|--------------|
| DATABASE_URL | Supabase | postgresql://... | Supabase URL | Supabase URL |
| BETTER_AUTH_SECRET | Generated | hex string (32 char) | random-string | same as dev |
| BETTER_AUTH_URL | Your frontend | https://... | http://localhost:3000 | https://rbxfolio.tk |
| NEXT_PUBLIC_API_URL | API domain | https://...​/api/v1 | http://localhost:3001/api/v1 | https://api.rbxfolio.tk/api/v1 |
| NEXT_PUBLIC_APP_URL | Frontend domain | https://... | http://localhost:3000 | https://rbxfolio.tk |
| PORT | Fixed | number | 3001 | 3001 |
| UPLOAD_DIR | Fixed | path | ./uploads | ./uploads |
| CORS_ORIGIN | Frontend domain | https://... | http://localhost:3000 | https://rbxfolio.tk |
| BREVO_API_KEY | Brevo | SG.xxxxx | SG.xxxxx | SG.xxxxx |
| BREVO_FROM_EMAIL | Your domain | email | noreply@rbxfolio.local | noreply@rbxfolio.tk |
| BUNNY_STORAGE_ZONE | Bunny | zone name | rbxfolio-media | rbxfolio-media |
| BUNNY_API_KEY | Bunny | api key | xxxxx | xxxxx |
| BUNNY_STORAGE_ENDPOINT | Bunny | domain | rbxfolio-media.b-cdn.net | rbxfolio-media.b-cdn.net |
| SENTRY_DSN_API | Sentry | DSN URL | https://xxx@yyy/zzz | https://xxx@yyy/zzz |
| NEW_RELIC_LICENSE_KEY | New Relic | 40-char string | xxxxx | xxxxx |
| NEW_RELIC_APP_NAME | Your choice | name | rbxfolio-api | rbxfolio-api |
| NEW_RELIC_LOG_LEVEL | Fixed | log level | info | info |

---

**Status:** Ready to set up all environments! 🚀
