# Free-Tier Services - Implementation Guide

**Status:** Step-by-step setup for each free service  
**Time Estimate:** 3-4 hours total  
**Savings:** $78-87/month

---

## 1. Email Service: SendGrid (30 min)

### Step 1: Create SendGrid Account
```
1. Go to https://sendgrid.com/free
2. Click "Get Started"
3. Fill in signup form
4. Verify email address
5. Complete survey
```

### Step 2: Generate API Key
```
1. Dashboard → Settings → API Keys
2. Create → General API Key
3. Name: rbxfolio-api
4. Full Access
5. Copy API key
```

### Step 3: Verify Sender Email
```
1. Dashboard → Settings → Sender authentication
2. Domain Authentication (recommended)
3. Add domain: rbxfolio.com (or your domain)
4. Add DNS records provided by SendGrid
5. Verify domain
```

### Step 4: Update Backend Code

**Install package:**
```bash
cd apps/api
npm install @sendgrid/mail
```

**Update environment (.env.production):**
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@rbxfolio.com
```

**Update email.service.ts:**
```typescript
import sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendWelcomeEmail(email: string, name: string) {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Welcome to RbxFolio',
      html: `<h1>Welcome, ${name}!</h1>
             <p>Your portfolio is ready.</p>
             <a href="https://rbxfolio.com/dashboard">Get Started</a>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendContactNotification(
    developerEmail: string,
    visitorName: string,
    message: string,
  ) {
    const msg = {
      to: developerEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `New Contact Request from ${visitorName}`,
      html: `<p>${visitorName} sent you a message:</p>
             <blockquote>${message}</blockquote>
             <a href="https://rbxfolio.com/dashboard/contact-requests">
               Reply in Dashboard
             </a>`,
    };

    await sgMail.send(msg);
  }
}
```

### Step 5: Test Email Service
```bash
# Run tests
pnpm --filter @rbxfolio/api test

# Expected: Email service tests pass ✅

# Manual test in SendGrid dashboard
# - Dashboard → Mail Send
# - Check email delivery status
```

---

## 2. File Storage: AWS S3 (1 hour)

### Step 1: Create AWS Account
```
1. Go to https://aws.amazon.com
2. Click "Create AWS Account"
3. Fill in email and password
4. Verify email
5. Add payment method (required, but free tier won't charge)
6. Verify phone number
7. Select free tier
```

### Step 2: Create S3 Bucket
```
1. AWS Console → S3
2. Click "Create Bucket"
3. Bucket name: rbxfolio-media
4. Region: us-east-1 (free tier region)
5. Block all public access: OFF (for CDN access)
6. Create bucket
```

### Step 3: Create IAM User (Security Best Practice)
```
1. AWS Console → IAM → Users
2. Create user → rbxfolio-api
3. Attach policies → S3FullAccess
4. Create access key → Download CSV

Important: Store credentials securely!
Access Key ID: AKIA...
Secret Access Key: ...
```

### Step 4: Configure S3 Bucket for CORS
```
1. AWS Console → S3 → rbxfolio-media
2. Permissions → CORS
3. Edit CORS configuration:
```

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://rbxfolio.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### Step 5: Update Backend Code

**Install package:**
```bash
cd apps/api
npm install aws-sdk
```

**Create S3 storage service:**
```typescript
// apps/api/src/media/s3-storage.service.ts
import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3StorageService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.bucketName = process.env.AWS_S3_BUCKET;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: 'avatars' | 'banners' | 'projects',
    userId: string,
  ): Promise<string> {
    const key = `${folder}/${userId}/${uuid()}.${this.getExtension(
      file.originalname,
    )}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    await this.s3.upload(params).promise();

    const publicUrl = `${process.env.AWS_S3_PUBLIC_URL}/${key}`;
    return publicUrl;
  }

  async deleteFile(url: string): Promise<void> {
    const key = url.replace(`${process.env.AWS_S3_PUBLIC_URL}/`, '');
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  private getExtension(filename: string): string {
    return filename.split('.').pop().toLowerCase();
  }
}
```

**Update environment (.env.production):**
```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=rbxfolio-media
AWS_S3_PUBLIC_URL=https://rbxfolio-media.s3.amazonaws.com
```

**Update media.service.ts:**
```typescript
import { S3StorageService } from './s3-storage.service';

@Injectable()
export class MediaService {
  constructor(private s3Storage: S3StorageService) {}

  async uploadProjectMedia(
    projectId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    const url = await this.s3Storage.uploadFile(
      file,
      'projects',
      projectId,
    );
    
    // Save to database
    return this.prisma.projectMedia.create({
      data: {
        projectId,
        url,
        type: file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE',
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
    });
  }
}
```

### Step 6: Update Module Imports
```typescript
// apps/api/src/media/media.module.ts
import { S3StorageService } from './s3-storage.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, S3StorageService],
})
export class MediaModule {}
```

### Step 7: Test File Upload
```bash
# Run tests
pnpm --filter @rbxfolio/api test

# Expected: Storage service tests pass ✅

# Manual test in AWS Console
# - S3 → rbxfolio-media bucket
# - Upload test file
# - Verify file appears
# - Test public URL access
```

---

## 3. Monitoring Services: Downgrade to Free (30 min)

### Step 1: Downgrade Sentry to Free Plan
```
1. Go to https://sentry.io/account/billing/
2. Click "Downgrade" (if on paid plan)
3. Select "Free Plan"
4. Confirm downgrade
5. Keep DSN token (no code changes needed)
```

**Sentry Free Plan Limits:**
- 5,000 events/month
- 24-hour data retention
- Email alerts
- Perfect for MVP

### Step 2: Downgrade New Relic to Free Plan
```
1. Go to https://one.newrelic.com/admin/licensing
2. Select "Free Tier" option
3. Confirm change
4. Keep API keys (no code changes needed)
```

**New Relic Free Plan Limits:**
- 1GB data ingestion/month
- 24-hour data retention
- Full APM features
- Perfect for MVP

---

## 4. Verification Steps (30 min)

### Step 1: Test Email Service
```bash
# Trigger an email in development
# 1. Sign up new user
# 2. Check SendGrid dashboard for delivery
# 3. Verify email received

# Expected: Email arrives within 2 seconds ✅
```

### Step 2: Test File Upload
```bash
# Trigger file upload
# 1. Upload project image
# 2. Check AWS S3 bucket
# 3. Verify file appears
# 4. Test public URL (should load image)

# Expected: File uploaded and accessible ✅
```

### Step 3: Test Error Tracking
```bash
# Trigger an error
# 1. Sentry Dashboard
# 2. Check if error appears
# 3. Verify alert received

# Expected: Error appears in Sentry within 5 seconds ✅
```

### Step 4: Test Performance Monitoring
```bash
# Make API requests
# 1. New Relic Dashboard
# 2. Check APM metrics
# 3. Verify request appears

# Expected: Request appears in New Relic within 30 seconds ✅
```

---

## 5. Full Test Suite

```bash
# Run entire test suite with new services
cd /home/saad/Documents/Personal/Projects/RbxFolio

# Run all tests
pnpm test

# Expected output:
# ✓ Backend tests:     325/325 PASSING
# ✓ Frontend tests:    14/14 PASSING
# ✓ Email tests:       All mocking SendGrid
# ✓ Storage tests:     All mocking S3

# Build production
pnpm build

# Expected: Both apps build successfully ✅
```

---

## 6. Deployment Steps

### Step 1: Update Environment Variables in Production

**Vercel (Frontend) - No changes needed**

**Railway (Backend) - Update Environment Variables:**
```bash
# Railway Dashboard → Variables → Production

AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=rbxfolio-media
AWS_S3_PUBLIC_URL=https://rbxfolio-media.s3.amazonaws.com

SENDGRID_API_KEY=SG.xxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@rbxfolio.com

# Keep existing:
DATABASE_URL=...
SENTRY_DSN_API=...
NEW_RELIC_LICENSE_KEY=...
# etc.
```

### Step 2: Deploy to Staging
```bash
# Deploy to staging branch
git checkout -b migration/free-tier-services
git add .
git commit -m "feat: migrate to free-tier services (SendGrid, AWS S3)"
git push origin migration/free-tier-services

# Create pull request
# Review changes
# Merge to main branch
```

### Step 3: Monitor Production Deployment
```bash
# Vercel: https://vercel.com/dashboard
# Railway: https://railway.app/dashboard

# Wait for deployments to complete
# Expected: Both deployments successful ✅

# Run smoke tests
curl https://rbxfolio.com
curl https://api.rbxfolio.com/api/v1/health

# Expected: Both return 200 ✅
```

### Step 4: Verify All Services Connected
```bash
# 1. Send test email
#    - Upload user profile
#    - Check SendGrid dashboard
#    - Verify email received

# 2. Upload test file
#    - Create project, upload image
#    - Check AWS S3 bucket
#    - Verify file accessible

# 3. Verify error tracking
#    - Trigger error
#    - Check Sentry dashboard

# 4. Verify performance tracking
#    - Make API requests
#    - Check New Relic dashboard
```

---

## 7. Troubleshooting

### Email Not Sending
```bash
# Check SendGrid API key
echo $SENDGRID_API_KEY

# Check logs in SendGrid dashboard
# - Click "Activity" → "Failed"
# - Check error message

# Common issues:
# 1. API key incorrect
# 2. Sender email not verified
# 3. Rate limit hit (100 emails/day)

# Solution:
# - Verify API key
# - Verify sender in SendGrid dashboard
# - Use AWS SES if more emails needed
```

### File Not Uploading
```bash
# Check AWS credentials
echo $AWS_ACCESS_KEY_ID

# Check S3 bucket permissions
# - AWS Console → S3 → rbxfolio-media
# - Permissions → Bucket Policy
# - Verify IAM user has S3FullAccess

# Check CORS configuration
# - S3 → rbxfolio-media → CORS
# - Verify CORS rules present

# Solution:
# - Verify AWS credentials
# - Check IAM permissions
# - Check CORS configuration
# - Test with aws-cli:
#   aws s3 ls s3://rbxfolio-media --profile rbxfolio
```

### Monitoring Data Not Appearing
```bash
# Check API keys
# - Sentry: Settings → Projects → rbxfolio
# - New Relic: Settings → API Keys

# Restart application
# - Railway Dashboard → Redeploy
# - Vercel: Re-deploy

# Wait for data ingestion
# - Sentry: Up to 5 seconds
# - New Relic: Up to 30 seconds

# Solution:
# - Verify keys in environment
# - Restart services
# - Wait for data ingestion
```

---

## 8. Checklist

### Email (SendGrid)
- [ ] Account created
- [ ] API key generated
- [ ] Sender email verified
- [ ] Backend code updated
- [ ] Environment variables set
- [ ] Tests passing
- [ ] Manual test email sent

### File Storage (AWS S3)
- [ ] Account created
- [ ] S3 bucket created
- [ ] IAM user created
- [ ] Credentials downloaded
- [ ] Backend code updated
- [ ] Environment variables set
- [ ] Tests passing
- [ ] Manual file upload tested

### Monitoring (Sentry & New Relic)
- [ ] Downgraded to free plans
- [ ] API keys verified
- [ ] Tests passing
- [ ] Data flowing

### Deployment
- [ ] Code committed to git
- [ ] Tests passing locally
- [ ] Deployed to staging
- [ ] Smoke tests pass
- [ ] Deployed to production
- [ ] All services verified

---

## 9. Cost Verification

```bash
# After migration, verify monthly costs:

# Vercel: https://vercel.com/account/billing
Expected: $0/month ✅

# Railway: https://railway.app/dashboard
Expected: $0-5/month (covered by credit) ✅

# AWS S3: https://console.aws.amazon.com/billing
Expected: $0/month (free tier, 12 months) ✅

# SendGrid: https://sendgrid.com/account/billing
Expected: $0/month ✅

# Sentry: https://sentry.io/account/billing
Expected: $0/month ✅

# New Relic: https://one.newrelic.com/admin/licensing
Expected: $0/month ✅

# Domain: ~$0.10/month ($1-2/year)
Expected: $0.10/month ✅

TOTAL EXPECTED: ~$0.10/month
SAVINGS: ~$78/month compared to current setup
```

---

## 10. Next Steps

### Immediate (This Week)
- [ ] Set up SendGrid
- [ ] Set up AWS S3
- [ ] Update backend code
- [ ] Run full test suite
- [ ] Deploy to staging

### This Month
- [ ] Test in production
- [ ] Monitor all services
- [ ] Document configuration
- [ ] Create runbooks for maintenance

### Going Forward
- Monitor free tier usage
- Plan for paid services if usage grows
- Consider upgrading specific services if needed
- Keep free tier optimization updated

---

**Status: ✅ Ready to implement**  
**Estimated Time: 3-4 hours**  
**Annual Savings: $936+**

Start with Step 1 (Email) and work through systematically.

Good luck! 🚀
