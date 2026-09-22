# Sentry Error Tracking Setup Guide

Complete guide for configuring Sentry for production error monitoring and exception tracking.

## Overview

Sentry provides real-time error tracking, performance monitoring, and release management for RbxFolio:

- **Error Tracking**: Capture unhandled exceptions in backend and frontend
- **Performance Monitoring**: Track slow operations and bottlenecks
- **Release Management**: Track deployments and associate errors with versions
- **Alerts**: Notify team of critical issues
- **Source Maps**: Original source code in error traces (TypeScript)

## Prerequisites

- Sentry account (https://sentry.io)
- Project created for RbxFolio
- API tokens generated

## Step 1: Create Sentry Account

1. Sign up at https://sentry.io (free tier available)
2. Create organization (e.g., "RbxFolio")
3. Create two projects:
   - **Project A**: API (Node.js/NestJS)
   - **Project B**: Web (Next.js/React)

## Step 2: Get DSN Keys

For each project:

1. Go to **Settings** > **Projects** > **[Project Name]**
2. Click **Client Keys (DSN)**
3. Copy DSN (Data Source Name)

Format: `https://[key]@o[org-id].ingest.sentry.io/[project-id]`

Store in environment files:

```env
# Backend
SENTRY_DSN_API=https://[api-key]@o[org-id].ingest.sentry.io/[api-project-id]

# Frontend
NEXT_PUBLIC_SENTRY_DSN_WEB=https://[web-key]@o[org-id].ingest.sentry.io/[web-project-id]

# Auth token (for releases)
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Backend Setup (NestJS)

### Install Dependencies

```bash
pnpm add @sentry/node @sentry/tracing
```

### Create Sentry Interceptor

File: `apps/api/src/common/sentry.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      catchError((error) => {
        // Capture exception in Sentry
        Sentry.captureException(error, {
          tags: {
            method: request.method,
            url: request.url,
          },
          extra: {
            body: request.body,
            query: request.query,
            params: request.params,
          },
        });

        // Re-throw error for normal handling
        throw error;
      })
    );
  }
}
```

### Initialize Sentry in Main Module

File: `apps/api/src/main.ts`

```typescript
import * as Sentry from '@sentry/node';

async function bootstrap() {
  // Initialize Sentry
  if (process.env.SENTRY_DSN_API) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN_API,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
      ],
      release: process.env.APP_VERSION,
      beforeSend(event, hint) {
        // Filter out 404 errors
        if (event.request?.url?.includes('/health')) {
          return null;
        }
        return event;
      },
    });
  }

  const app = await NestFactory.create(AppModule);

  // Add Sentry error handler
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());

  // Your other middleware...

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
```

### Register Sentry Interceptor

File: `apps/api/src/app.module.ts`

```typescript
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from './common/sentry.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
    // ... other providers
  ],
})
export class AppModule {}
```

### Manual Error Tracking

In services:

```typescript
import * as Sentry from '@sentry/node';

export class SomeService {
  async criticalOperation() {
    try {
      // ... operation
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          operation: 'criticalOperation',
          severity: 'high',
        },
        level: 'error',
      });
      throw error;
    }
  }

  // Track breadcrumbs for context
  someMethod() {
    Sentry.captureMessage('Operation started', 'info');
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: 'User performed action X',
      level: 'info',
    });
  }
}
```

## Step 4: Frontend Setup (Next.js)

### Install Dependencies

```bash
pnpm add @sentry/nextjs
```

### Create Sentry Configuration

File: `apps/web/sentry.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN_WEB,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Capture replays
    integrations: [
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Capture 10% of all sessions for performance monitoring
    replaysSessionSampleRate: 0.1,
    
    // If the entire session is not sampled, use this to sample 20% of all sessions with an error
    replaysOnErrorSampleRate: 0.2,

    // Filter out certain errors
    beforeSend(event, hint) {
      // Don't send network errors in development
      if (process.env.NODE_ENV === 'development' && 
          hint.originalException?.message?.includes('Network')) {
        return null;
      }
      return event;
    },

    release: process.env.NEXT_PUBLIC_APP_VERSION,
  });
}
```

### Initialize in _app.tsx / app layout

```typescript
import { useEffect } from 'react';
import { initSentry } from '@/config/sentry.config';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initSentry();
  }, []);

  return <Component {...pageProps} />;
}
```

### Manual Error Tracking

In components/pages:

```typescript
import * as Sentry from '@sentry/nextjs';

export default function Page() {
  const handleError = () => {
    try {
      // ... some operation
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'HomePage',
          action: 'handleError',
        },
      });
    }
  };

  return (
    <button onClick={handleError}>
      Test Error
    </button>
  );
}
```

## Step 5: Environment Variables

### Development

```env
SENTRY_DSN_API=https://[key]@o[org-id].ingest.sentry.io/[api-project-id]
NEXT_PUBLIC_SENTRY_DSN_WEB=https://[key]@o[org-id].ingest.sentry.io/[web-project-id]
NODE_ENV=development
```

### Production

```env
SENTRY_DSN_API=https://[key]@o[org-id].ingest.sentry.io/[api-project-id]
NEXT_PUBLIC_SENTRY_DSN_WEB=https://[key]@o[org-id].ingest.sentry.io/[web-project-id]
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=production
APP_VERSION=1.0.0
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Step 6: Release Management

### Create Release

Before deployment:

```bash
# Set version
export RELEASE=1.0.0

# Create Sentry release
sentry-cli releases create $RELEASE

# Upload source maps
sentry-cli releases files upload-sourcemaps ./dist --release $RELEASE

# Finalize release
sentry-cli releases finalize $RELEASE
```

Or in CI/CD (GitHub Actions):

```yaml
- name: Create Sentry Release
  uses: getsentry/action-release@v1
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: rbxfolio
    SENTRY_PROJECT: api
  with:
    version: ${{ github.sha }}
    sourcemaps: ./dist
    url_prefix: '~/'
```

## Step 7: Alerts Configuration

### Email Alerts

1. Go to **Alerts** > **Create Alert Rule**
2. Set conditions:
   - Event: `is error`
   - Environment: `production`
   - Frequency: `happens more than 10 times in 5 minutes`
3. Configure notification:
   - Team email
   - Slack channel (if integrated)

### Slack Integration

1. Go to **Settings** > **Integrations** > **Slack**
2. Click **Install**
3. Authorize Sentry in Slack
4. Configure alert channel

## Error Tagging Strategy

### Standard Tags

Implement consistent tagging for better filtering:

```typescript
// Backend
Sentry.captureException(error, {
  tags: {
    service: 'auth',          // Service/module name
    operation: 'signup',       // Operation name
    severity: 'high',          // high/medium/low
    environment: 'production', // Environment
  },
  level: 'error',              // error/warning/info
});

// Frontend
Sentry.captureException(error, {
  tags: {
    component: 'LoginForm',
    action: 'handleSubmit',
    page: '/auth/login',
  },
});
```

### User Context

Add user context for better debugging:

```typescript
// Backend
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
  plan: user.plan,
});

// Frontend
Sentry.setUser({
  id: currentUser?.id,
  email: currentUser?.email,
  username: currentUser?.username,
});
```

## Performance Monitoring

### Monitor Database Queries

```typescript
import * as Sentry from '@sentry/node';

const transaction = Sentry.startTransaction({
  op: 'database',
  name: 'getUserById',
  description: 'Fetch user from database',
});

try {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  transaction.finish();
  return user;
} catch (error) {
  transaction.setStatus('error');
  transaction.finish();
  throw error;
}
```

### Monitor API Calls

```typescript
const span = transaction.startChild({
  op: 'http.client',
  description: 'Fetch from external API',
});

try {
  const response = await fetch('https://api.example.com/data');
  span.setStatus('ok');
} catch (error) {
  span.setStatus('error');
}
```

## Dashboard Usage

### Key Metrics

1. **Error Rate**: % of requests with errors
2. **Error Frequency**: Count of errors over time
3. **Affected Users**: How many users impacted
4. **User Sessions**: Session replays with errors

### Issue Management

1. Go to **Issues**
2. Review new errors
3. Assign to team member
4. Set status:
   - **Unresolved**: Needs investigation
   - **Resolved**: Fixed in code
   - **Ignored**: Not actionable

### Release Tracking

1. Go to **Releases**
2. View errors by version
3. Identify regression versions
4. Compare error counts between releases

## Best Practices

### What to Track

✅ DO track:
- Unhandled exceptions
- Failed API calls
- Database errors
- Auth failures
- Payment/transaction errors
- Critical business logic errors

❌ DON'T track:
- 404 errors (too noisy)
- Validation errors (user input)
- Network timeouts (external issues)
- Development errors (noise)

### Sampling

For high-volume applications:

```typescript
// Track 100% of errors, 10% of success
tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
```

This reduces costs while capturing errors.

### Source Maps

Store source maps separately:

```bash
# Upload source maps
sentry-cli releases files upload-sourcemaps ./dist
```

This allows Sentry to show original TypeScript code, not minified output.

## Troubleshooting

### Events Not Appearing

1. Check DSN is correct
2. Verify environment variable is set
3. Check Sentry network status
4. Review `beforeSend` filter - may be blocking

### High Error Volume

1. Review error filtering
2. Implement sampling
3. Add conditions to alert rules
4. Identify and fix root cause

### Session Replay Not Working

1. Check `replaysSessionSampleRate` > 0
2. Verify privacy settings allow recording
3. Check browser console for errors

## Cost Optimization

### Free Tier

- 5,000 error events/month
- 1 team member
- Basic alerts
- 30-day retention

### Paid Tiers

- **Team**: $29/month (50K events, 5 users)
- **Business**: $99/month (500K events, unlimited users)
- **Enterprise**: Custom pricing

### Cost Reduction

1. Increase sampling rate in production
2. Filter out noise (404s, validation errors)
3. Archive old releases
4. Use development environment less

## Production Checklist

- [ ] Sentry account created
- [ ] Projects created (API + Web)
- [ ] DSN keys obtained and stored securely
- [ ] Backend Sentry integration implemented
- [ ] Frontend Sentry integration implemented
- [ ] Source maps uploaded
- [ ] Alert rules configured
- [ ] Slack integration enabled
- [ ] User context implemented
- [ ] Error tagging strategy defined
- [ ] Performance monitoring enabled
- [ ] Release tracking configured
- [ ] Team trained on dashboard usage

## Related Documentation

- [Sentry Documentation](https://docs.sentry.io)
- [NestJS Integration](https://docs.sentry.io/platforms/node/guides/nest/)
- [Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
- [Release Management](https://docs.sentry.io/product/releases/)

## Resources

- [Sentry Pricing](https://sentry.io/pricing)
- [API Documentation](https://docs.sentry.io/api)
- [CLI Reference](https://docs.sentry.io/cli)
