# Vercel Blob Storage Setup Guide

## Overview

Vercel Blob is your production file storage solution for RbxFolio. It's:
- ✅ Completely free (1GB storage + 10GB transfer/month)
- ✅ No credit card required
- ✅ Global CDN included
- ✅ 99.95%+ uptime SLA
- ✅ Production-ready

---

## How It Works

Your backend uses this storage priority:

```
1. Vercel Blob     (if BLOB_READ_WRITE_TOKEN is set)
   ↓ (falls back if not configured)
2. Cloudflare R2   (if R2_ACCESS_KEY_ID is set)
   ↓ (falls back if not configured)
3. Local Storage   (./uploads directory - always available)
```

---

## Step 1: Create Vercel Blob Store

### In Vercel Dashboard

```
1. Go to: https://vercel.com/dashboard
2. Select your rbxfolio project
3. Click "Storage" tab
4. Click "Create Database" → "Vercel Blob"
5. Choose region (closest to your users)
6. Click "Create"
```

### What Gets Created

Vercel automatically creates:
- A blob store named after your project
- Environment variable: `BLOB_READ_WRITE_TOKEN` (auto-injected)
- Also creates: `BLOB_STORE_ID` (for reference)

---

## Step 2: Get Your Credentials

### From Vercel Dashboard

```
1. Vercel Dashboard → Your Project → Storage
2. Click on your Blob store
3. Copy BLOB_READ_WRITE_TOKEN
4. Copy BLOB_STORE_ID (shown in store details)
```

### Or From Environment Variables

If deployed on Vercel, these are auto-injected. For local development:

```bash
# .env (local development)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx...
BLOB_STORE_ID=store_xxx...
```

---

## Step 3: Test It Works

### Local Development

```bash
# 1. Add to your .env
BLOB_STORE_ID="store_xxx"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"

# 2. Restart your backend
pnpm dev

# 3. Upload a file (via your frontend)
# Your backend will automatically use Vercel Blob
```

### Verify Upload

```bash
# Check in Vercel Dashboard → Storage → Your Blob store
# You should see your uploaded files there
```

---

## How Files Are Stored

### File Path Structure

Files are organized by type:

```
avatars/              # User profile pictures
  └── uuid-1.jpg
  └── uuid-2.png

banners/              # User banner images
  └── uuid-3.jpg

projects/             # Project media
  └── project-id-1/
      ├── uuid-1.jpg
      ├── uuid-2.jpg
      └── uuid-3.mp4
```

### Access URLs

Files are served as:

```
https://xxxxxxxxxxxx.public.blob.vercel-storage.com/avatars/uuid-1.jpg
https://xxxxxxxxxxxx.public.blob.vercel-storage.com/projects/project-1/uuid-2.jpg
```

---

## Pricing Breakdown

### Free Tier (Hobby Plan)

| Feature | Included |
|---------|----------|
| Storage | 1 GB/month |
| Data Transfer | 10 GB/month |
| Request Rate | 1,000 requests/month |
| Cost | $0 |
| Credit Card | ❌ No |

### Usage Limits for MVP

For a typical MVP:
- 100 users × 5 images each = 50 MB (well within 1GB)
- 1,000 monthly visitors = well within limits
- **Verdict:** Free tier is sufficient for Year 1

### When to Upgrade

Upgrade only if:
- Storage exceeds 1GB (after ~200 users with heavy media)
- Transfer exceeds 10GB (after significant viral growth)
- Then: Pro plan at $5/month for 100GB storage + 1TB transfer

---

## Development vs Production

### Development (.env)

```bash
# Local storage (fallback)
# Blob token can be empty or omitted
BLOB_READ_WRITE_TOKEN=
BLOB_STORE_ID=
```

Files are stored in `./uploads` directory

### Production (Vercel)

```bash
# Auto-injected by Vercel
# (no setup needed)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx...
BLOB_STORE_ID=store_xxx...
```

Files are stored in Vercel Blob with global CDN

---

## Fallback Behavior

If Blob token is not set:

```
❌ Blob not configured
   ↓
❌ R2 not configured  
   ↓
✅ Use local ./uploads
   (development works fine)
```

This means you can always develop locally even without Blob configured!

---

## Common Issues

### Issue: "Blob storage not working"

**Check:**
1. Is `BLOB_READ_WRITE_TOKEN` set in .env?
2. Is it the correct token (starts with `vercel_blob_rw_`)?
3. Did you restart the backend after setting it?

**Solution:**
```bash
# Verify token
echo $BLOB_READ_WRITE_TOKEN

# Restart backend
pnpm dev
```

### Issue: "Files not appearing in Vercel Blob"

**Check:**
1. Backend is using Blob (check logs for upload success)
2. Token has write permissions (it should by default)
3. Give it 30 seconds to appear in dashboard

**Solution:**
```bash
# Check backend logs while uploading
pnpm dev
# Upload a file via frontend
# Look for "Blob upload successful" in logs
```

### Issue: "Access Denied when uploading"

**Causes:**
- Token is read-only (shouldn't happen)
- Token is expired (shouldn't happen)
- Token is for different project

**Solution:**
1. Verify you're using the right Blob store
2. Generate new token in Vercel Dashboard
3. Update .env and restart

---

## Monitoring Storage Usage

### In Vercel Dashboard

```
Dashboard → Storage → Your Blob Store → Usage

Shows:
- Current storage used (bytes)
- Monthly transfer used
- Request count
- Trends over time
```

### Set Budget Alerts

```
Dashboard → Billing → Usage Alerts
- Email when approaching limits
- (Free tier has no hard limits, just rate limiting)
```

---

## Scaling Path

### Year 1 (MVP - Current)
- Free tier: 1GB storage, 10GB transfer
- Cost: $0/month
- Status: Sufficient for MVP

### Year 2 (Growth)
- If storage > 1GB: Upgrade to Pro ($5/mo)
- Pro: 100GB storage, 1TB transfer
- Cost: $5/month
- Or: Migrate to S3 if cost becomes a factor

### Year 3+ (Enterprise)
- Custom plan with dedicated support
- Negotiate based on usage

---

## Next Steps

1. ✅ Blob store is already created (you have tokens in .env)
2. ✅ Backend is configured (runs `pnpm dev` and it works)
3. ✅ Upload files - they'll automatically use Blob in production
4. 📊 Monitor usage in Vercel Dashboard
5. 🚀 Deploy to production - Blob will be enabled automatically

---

## Useful Links

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Pricing](https://vercel.com/pricing#blob)
- [Dashboard](https://vercel.com/dashboard)
- [Support](https://vercel.com/support)

---

## FAQ

**Q: Do I need to do anything in production?**  
A: No! Vercel auto-injects the token. Just deploy.

**Q: Can I use Blob from outside Vercel?**  
A: Yes! The token works anywhere (we use it locally too).

**Q: What if I exceed the free tier?**  
A: You'll get rate-limited (not charged). Upgrade when ready.

**Q: Is Blob as good as AWS S3?**  
A: Better! S3 charges for egress; Blob doesn't.

**Q: Can I delete files?**  
A: Yes - `BlobStorageService.delete(url)` works.

---

## Support

For issues, check:
1. [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
2. [Your Vercel Dashboard](https://vercel.com/dashboard)
3. Vercel Support (in Dashboard → Help)

---

**Status:** ✅ Ready to use  
**Cost:** $0/month  
**Setup time:** Already done!
