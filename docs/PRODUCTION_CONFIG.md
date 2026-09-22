# Production Configuration Guide

Complete guide for configuring RbxFolio production environment.

## Environment Setup Checklist

- [ ] Database (PostgreSQL)
- [ ] Cloudflare R2 (Media Storage)
- [ ] Resend (Email Service)
- [ ] Sentry (Error Tracking)
- [ ] New Relic (Performance Monitoring)
- [ ] SSL Certificates
- [ ] CDN Configuration
- [ ] API Rate Limiting
- [ ] Logging & Monitoring

## 1. Database Configuration

### PostgreSQL Setup

```bash
# Create database and user
createdb rbxfolio_prod
psql -c "CREATE USER rbxfolio_prod WITH PASSWORD 'secure_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE rbxfolio_prod TO rbxfolio_prod;"

# Run migrations
DATABASE_URL=postgresql://rbxfolio_prod:secure_password@localhost:5432/rbxfolio_prod npm run db:migrate
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/rbxfolio_prod
```

## 2. Cloudflare R2 Configuration

See `CLOUDFLARE_R2_SETUP.md` for detailed instructions.

```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=rbxfolio-media
R2_PUBLIC_URL=https://cdn.rbxfolio.com
```

## 3. Email Service (Resend)

### Setup

1. Sign up at [resend.com](https://resend.com)
2. Create API key
3. Verify sender domain
4. Configure email templates

### Environment Variables

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SUPPORT_EMAIL=support@rbxfolio.com
```

### Email Templates

- Welcome email
- Password reset
- Contact request notification
- Account verification
- Collaboration invitation

## 4. Error Tracking (Sentry)

### Setup

1. Create Sentry project
2. Install `@sentry/node` and `@sentry/nextjs`
3. Configure DSN

### Environment Variables

```env
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENTRY_DSN=https://key@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACE_SAMPLE_RATE=0.1
```

### Integration

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACE_SAMPLE_RATE || "0.1"),
});
```

## 5. Performance Monitoring (New Relic)

### Setup

1. Create New Relic account
2. Get license key
3. Install `newrelic` package

### Environment Variables

```env
NEW_RELIC_LICENSE_KEY=your_license_key
NEW_RELIC_APP_NAME=rbxfolio-production
NEW_RELIC_LOG_LEVEL=info
```

### Integration

```typescript
// Add to top of main.ts
require('newrelic');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.API_PORT || 3001);
}
bootstrap();
```

## 6. SSL/TLS Configuration

### Using Cloudflare SSL

1. Enable "Always Use HTTPS"
2. Set minimum TLS version to 1.2
3. Use Automatic HTTPS rewrites
4. Configure SSL/TLS encryption mode (Full/Flexible)

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d rbxfolio.com -d www.rbxfolio.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## 7. CDN Configuration

### Cloudflare CDN

```
1. Add site to Cloudflare
2. Update nameservers
3. Enable caching rules
4. Set cache TTL:
   - HTML: 30 minutes
   - CSS/JS: 1 year
   - Images: 6 months
   - API: No cache
```

### Cache Headers

```typescript
// In Next.js API routes
res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
```

## 8. Rate Limiting

### Configuration

```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests per window
```

### Implementation

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot({
  ttl: process.env.RATE_LIMIT_WINDOW_MS / 1000,
  limit: process.env.RATE_LIMIT_MAX_REQUESTS,
})
```

## 9. Logging & Monitoring

### Log Levels

```
ERROR   - Critical failures
WARN    - Potential issues
INFO    - Important events
DEBUG   - Development debugging
```

### Log Aggregation

Using ELK Stack or Datadog:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## 10. Security Headers

### Recommended Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=()
```

### Implementation (Next.js)

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};
```

## 11. Backup & Disaster Recovery

### Database Backups

```bash
# Daily automated backup
0 2 * * * pg_dump rbxfolio_prod | gzip > /backups/rbxfolio_$(date +\%Y\%m\%d).sql.gz
```

### R2 Bucket Versioning

Enable in R2 settings to maintain upload history.

### Recovery Procedures

- Database: Restore from backup
- Media: Recover from R2 versioning
- Configuration: Use Terraform for IaC

## 12. Deployment Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database migrations completed
- [ ] SSL certificate installed
- [ ] CDN configured
- [ ] Email service tested
- [ ] Error tracking verified
- [ ] Monitoring active
- [ ] Backup strategy in place
- [ ] Load testing completed
- [ ] Security audit passed

## Monitoring Dashboard

Key metrics to track:

1. **Application Performance**
   - Response time (target: <200ms p95)
   - Error rate (target: <0.1%)
   - Requests per second

2. **Infrastructure**
   - CPU usage
   - Memory usage
   - Disk space
   - Network bandwidth

3. **Business Metrics**
   - Active users
   - Projects created
   - Media uploads
   - Contact requests

## Emergency Contacts

- Database Admin: [contact]
- DevOps: [contact]
- Security: [contact]
- On-call: [contact]

## Useful Commands

```bash
# Check service status
systemctl status rbxfolio-api
systemctl status rbxfolio-web

# View logs
journalctl -u rbxfolio-api -f
docker logs rbxfolio-web

# Database backup
pg_dump rbxfolio_prod > backup.sql

# Check disk space
df -h /data

# Monitor resources
top -u rbxfolio
```
