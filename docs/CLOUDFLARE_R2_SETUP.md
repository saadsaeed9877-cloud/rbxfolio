# Cloudflare R2 Setup Guide

This guide covers setting up Cloudflare R2 for production media storage.

## Overview

Cloudflare R2 is an S3-compatible object storage service. RbxFolio uses it for:
- Profile avatars and banners
- Project thumbnails and media
- User-uploaded images and videos

## Prerequisites

- Cloudflare account with R2 enabled
- Node.js 20+ with `@aws-sdk/client-s3`
- Access to environment variables

## Step 1: Create R2 API Token

1. Log in to Cloudflare Dashboard
2. Navigate to **Account Settings** > **API Tokens**
3. Create a new token with permissions:
   - `Object Storage: Edit`
   - `Account Resources: Include All Accounts`
4. Copy the token and store securely

## Step 2: Create R2 Bucket

1. In Cloudflare Dashboard, go to **R2**
2. Click **Create Bucket**
3. Name: `rbxfolio-media` (or your preferred name)
4. Region: Choose closest to your servers (US, EU, etc.)
5. Click **Create Bucket**

## Step 3: Configure Environment Variables

Add to `.env.production`:

```env
# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=rbxfolio-media
R2_REGION=auto
R2_PUBLIC_URL=https://cdn.rbxfolio.com  # Custom domain (optional)
```

### Finding Your Account ID

1. Go to **R2** in Cloudflare Dashboard
2. Click on your bucket
3. Account ID shown in the endpoint URL: `https://{account-id}.r2.cloudflarestorage.com`

## Step 4: Set Up Custom Domain (Optional)

For public access with your domain:

1. In **R2** bucket settings, click **Settings**
2. Under **Public Access**, enable custom domain
3. Add your domain (e.g., `cdn.rbxfolio.com`)
4. Configure DNS CNAME pointing to R2 endpoint
5. Set SSL/TLS certificate

## Step 5: Configure CORS (If Needed)

For direct browser uploads:

```json
[
  {
    "AllowedOrigins": ["https://rbxfolio.com", "https://www.rbxfolio.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Step 6: Set Up Lifecycle Rules

To manage storage costs:

1. In bucket settings, click **Lifecycle Rules**
2. Delete old temporary uploads after 7 days
3. Archive rarely accessed media after 30 days

## Integration with RbxFolio

### Backend Service

The `R2StorageService` handles uploads:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

class R2StorageService {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.R2_REGION,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.client.send(command);

    // Return public URL
    const publicUrl = process.env.R2_PUBLIC_URL || 
      `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    return `${publicUrl}/${key}`;
  }
}
```

### File Paths

Organize uploads by type:

- Avatars: `avatars/{userId}/{timestamp}`
- Banners: `banners/{userId}/{timestamp}`
- Project media: `projects/{projectId}/{timestamp}`
- Temporary: `temp/{sessionId}/{timestamp}` (auto-deleted)

## Best Practices

### Security

1. **Restrict Access**: Use least-privilege API tokens
2. **Enable Versioning**: Keep upload history
3. **Encryption**: Use KMS keys for sensitive data
4. **Rate Limiting**: Implement request throttling

### Performance

1. **CDN**: Use Cloudflare's global CDN for fast delivery
2. **Caching**: Set appropriate cache headers
3. **Compression**: Enable gzip for text files
4. **Image Optimization**: Use Cloudflare Image Optimization

### Cost Optimization

1. **Lifecycle Rules**: Delete old temporary files
2. **Multipart Upload**: Use for large files
3. **Batch Operations**: Group upload operations
4. **Monitor Usage**: Review monthly R2 bills

## Troubleshooting

### Upload Failures

- Check credentials in environment variables
- Verify bucket name and region
- Ensure bucket has public access enabled (if needed)

### File Not Found

- Verify file key construction
- Check bucket lifecycle rules (not auto-deleted)
- Confirm custom domain DNS configuration

### Slow Uploads

- Use multipart upload for files >5MB
- Check region selection
- Enable compression if applicable

## Monitoring

### CloudFlare Dashboard

1. Navigate to **R2** > Your Bucket
2. Monitor:
   - Requests per minute
   - Data transfer
   - Storage usage
   - Error rates

### Application Logging

```typescript
logger.info('R2 Upload', {
  userId: user.id,
  fileName: file.originalname,
  size: file.size,
  key: uploadedKey,
});
```

## Disaster Recovery

### Backup Strategy

1. Enable versioning on all buckets
2. Daily backup to cold storage
3. Cross-region replication for critical data

### Recovery Procedures

1. List object versions: `aws s3api list-object-versions`
2. Restore previous version if needed
3. Validate file integrity after restore

## Cost Estimate

Based on typical usage:

- Storage: 100GB = ~$1.50/month
- Upload requests: 10M/month = ~$0.005/month
- Download (via CDN): 500GB/month = $0/month (CDN cache)

**Total: ~$1.50-5/month** depending on usage

## Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/)
