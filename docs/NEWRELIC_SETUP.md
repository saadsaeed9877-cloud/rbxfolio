# New Relic APM Setup Guide

Complete guide for configuring New Relic for application performance monitoring, instrumentation, and alerting.

## Overview

New Relic provides real-time APM (Application Performance Monitoring) for RbxFolio:

- **Transaction Monitoring**: Track request performance and throughput
- **Database Monitoring**: Query performance and connection pool metrics
- **Error Analysis**: Exception tracking and error rates
- **Distributed Tracing**: Cross-service request tracking
- **Custom Metrics**: Application-specific performance data
- **Alerts**: Proactive notification of performance degradation

## Prerequisites

- New Relic account (https://newrelic.com)
- License key obtained
- Node.js and Next.js applications
- API and Web applications created in New Relic

## Step 1: Create New Relic Account

1. Sign up at https://newrelic.com
2. Start free trial (100GB/month free)
3. Create organization
4. Create two applications:
   - **App A**: API (Node.js)
   - **App B**: Web (Node.js)

## Step 2: Get License Keys

For each application:

1. Go to **Settings** > **Account Settings** > **License Keys**
2. Copy License Key (40-character string)

Store in environment files:

```env
# Backend
NEW_RELIC_LICENSE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEW_RELIC_APP_NAME=rbxfolio-api

# Frontend
NEW_RELIC_LICENSE_KEY_WEB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEW_RELIC_APP_NAME_WEB=rbxfolio-web

# Configuration
NEW_RELIC_ENABLED=true
NEW_RELIC_LOG_LEVEL=info
```

## Step 3: Backend Setup (Node.js NestJS)

### Install Dependencies

```bash
pnpm add newrelic
```

### Create New Relic Configuration

File: `apps/api/newrelic.js`

```javascript
'use strict'

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'rbxfolio-api'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info',
    filepath: 'stdout',
  },
  rules: {
    ignore_user_agents: [
      {
        prefix: 'HeadlessChrome',
      },
      {
        prefix: 'PhantomJS',
      },
    ],
  },
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    detail: 1,
    record_sql: 'obfuscated',
    slow_sql: {
      enabled: true,
      threshold: 500,
    },
  },
  error_collector: {
    enabled: true,
    capture_events: true,
    max_event_samples_stored: 100,
  },
  distributed_tracing: {
    enabled: process.env.NODE_ENV === 'production',
  },
  process_host: {
    display_name: process.env.NODE_ENV || 'development',
  },
  custom_metrics: {
    enabled: true,
  },
  environment_variables: ['NODE_ENV', 'ENVIRONMENT'],
}
```

### Initialize in Main Module

File: `apps/api/src/main.ts` (at very top, before imports)

```typescript
// Must be first import
require('newrelic');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ... rest of setup
}

bootstrap();
```

### Create New Relic Service

File: `apps/api/src/common/newrelic.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';

const newrelic = require('newrelic');

/**
 * New Relic Service
 * Provides methods for custom metrics and transaction tracking
 */

@Injectable()
export class NewRelicService {
  private readonly logger = new Logger(NewRelicService.name);

  /**
   * Record custom metric
   */
  recordMetric(name: string, value: number, unit?: string): void {
    try {
      newrelic.recordMetric(`Custom/${name}`, value);
      if (unit) {
        this.logger.debug(`Recorded metric: ${name} = ${value} ${unit}`);
      }
    } catch (error) {
      this.logger.error(`Failed to record metric: ${name}`, error);
    }
  }

  /**
   * Record custom event
   */
  recordCustomEvent(eventType: string, attributes: Record<string, any>): void {
    try {
      newrelic.recordCustomEvent(eventType, attributes);
      this.logger.debug(`Recorded custom event: ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to record custom event: ${eventType}`, error);
    }
  }

  /**
   * Start custom transaction
   */
  startCustomTransaction(name: string): () => void {
    const transaction = newrelic.startBackgroundTransaction(name, () => {
      // Transaction ended
    });

    return () => {
      newrelic.endTransaction();
    };
  }

  /**
   * Ignore transaction (don't track in New Relic)
   */
  ignoreTransaction(): void {
    try {
      newrelic.ignoreTransaction();
    } catch (error) {
      this.logger.error('Failed to ignore transaction', error);
    }
  }

  /**
   * Get transaction info
   */
  getTransaction(): any {
    try {
      return newrelic.getTransaction();
    } catch (error) {
      this.logger.error('Failed to get transaction', error);
      return null;
    }
  }

  /**
   * Set transaction name (for grouping in dashboard)
   */
  setTransactionName(name: string): void {
    try {
      const transaction = newrelic.getTransaction();
      if (transaction) {
        transaction.setName(name);
      }
    } catch (error) {
      this.logger.error('Failed to set transaction name', error);
    }
  }

  /**
   * Add custom attribute to transaction
   */
  addCustomAttribute(key: string, value: any): void {
    try {
      newrelic.addCustomAttribute(key, value);
    } catch (error) {
      this.logger.error(`Failed to add custom attribute: ${key}`, error);
    }
  }

  /**
   * Add multiple custom attributes
   */
  addCustomAttributes(attributes: Record<string, any>): void {
    try {
      for (const [key, value] of Object.entries(attributes)) {
        newrelic.addCustomAttribute(key, value);
      }
    } catch (error) {
      this.logger.error('Failed to add custom attributes', error);
    }
  }

  /**
   * Record database query timing
   */
  recordDatabaseQuery(query: string, duration: number, host?: string): void {
    this.recordMetric(`Database/Query/Time`, duration);
    this.recordCustomEvent('DatabaseQuery', {
      query: query.substring(0, 100),
      duration_ms: duration,
      host: host || 'unknown',
    });
  }

  /**
   * Record cache hit
   */
  recordCacheHit(key: string, duration: number = 0): void {
    this.recordMetric(`Cache/Hit`, 1);
    this.recordMetric(`Cache/Hit/Time`, duration);
    this.addCustomAttribute('cache_hit_key', key);
  }

  /**
   * Record cache miss
   */
  recordCacheMiss(key: string): void {
    this.recordMetric(`Cache/Miss`, 1);
    this.addCustomAttribute('cache_miss_key', key);
  }

  /**
   * Record business metric
   */
  recordBusinessMetric(metricName: string, value: number): void {
    this.recordMetric(`Business/${metricName}`, value);
  }

  /**
   * Health check - verify New Relic is active
   */
  healthCheck(): boolean {
    try {
      const transaction = newrelic.getTransaction();
      return !!transaction;
    } catch (error) {
      this.logger.error('New Relic health check failed', error);
      return false;
    }
  }
}
```

### Register in App Module

```typescript
import { NewRelicService } from './common/newrelic.service';

@Module({
  providers: [NewRelicService],
  exports: [NewRelicService],
})
export class AppModule {}
```

## Step 4: Frontend Setup (Next.js)

### Install Dependencies

```bash
pnpm add @newrelic/browser-agent
```

### Create Browser Agent Configuration

File: `apps/web/lib/newrelic.ts`

```typescript
import { agent } from '@newrelic/browser-agent/loaders/agent';

export function initNewRelic() {
  if (!process.env.NEXT_PUBLIC_NEWRELIC_LICENSE_KEY) {
    console.warn('New Relic license key not configured');
    return;
  }

  try {
    agent.start({
      licenseKey: process.env.NEXT_PUBLIC_NEWRELIC_LICENSE_KEY,
      applicationID: process.env.NEXT_PUBLIC_NEWRELIC_APP_ID || '0',
      nreum: {
        distributed_tracing: {
          enabled: true,
        },
      },
      info: {
        environment: process.env.NODE_ENV || 'development',
        applicationVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      },
      session_replay: {
        enabled: true,
        sampling_rate: 10, // 10% of sessions
        error_sampling_rate: 100, // 100% of error sessions
      },
    });
  } catch (error) {
    console.error('Failed to initialize New Relic', error);
  }
}
```

### Initialize in App

File: `apps/web/src/app/_app.tsx` or `app.tsx`

```typescript
import { useEffect } from 'react';
import { initNewRelic } from '@/lib/newrelic';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initNewRelic();
  }, []);

  return <Component {...pageProps} />;
}
```

## Step 5: Custom Metrics Examples

### Track API Endpoint Performance

```typescript
import { NewRelicService } from './common/newrelic.service';

@Controller('users')
export class UsersController {
  constructor(private newrelic: NewRelicService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const start = Date.now();
    
    try {
      this.newrelic.setTransactionName(`GET /users/${id}`);
      this.newrelic.addCustomAttribute('user_id', id);

      const user = await this.usersService.findOne(id);

      const duration = Date.now() - start;
      this.newrelic.recordCustomEvent('UserFetch', {
        user_id: id,
        duration_ms: duration,
        status: 'success',
      });

      return user;
    } catch (error) {
      const duration = Date.now() - start;
      this.newrelic.recordCustomEvent('UserFetch', {
        user_id: id,
        duration_ms: duration,
        status: 'error',
        error: error.message,
      });
      throw error;
    }
  }
}
```

### Track Database Performance

```typescript
export class UserRepository {
  constructor(private prisma: PrismaService, private newrelic: NewRelicService) {}

  async findById(id: string) {
    const start = Date.now();
    const query = 'SELECT * FROM users WHERE id = ?';

    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      const duration = Date.now() - start;

      this.newrelic.recordDatabaseQuery(query, duration, 'prisma');
      
      if (duration > 100) {
        this.newrelic.recordCustomEvent('SlowQuery', {
          query: query.substring(0, 100),
          duration_ms: duration,
        });
      }

      return user;
    } catch (error) {
      const duration = Date.now() - start;
      this.newrelic.recordMetric('Database/Error', 1);
      throw error;
    }
  }
}
```

### Track Business Events

```typescript
export class SignupService {
  constructor(private newrelic: NewRelicService) {}

  async signup(email: string, password: string) {
    // ... signup logic

    // Record business metric
    this.newrelic.recordBusinessMetric('Signup/Complete', 1);
    this.newrelic.recordCustomEvent('UserSignup', {
      email_domain: email.split('@')[1],
      plan: 'free',
    });

    return user;
  }
}
```

## Step 6: Configure Alerts

### Apdex Score Alert

Apdex measures user satisfaction with response time:

1. Go to **Alerts** > **Alert Policies**
2. Create new policy: "API Performance"
3. Add condition:
   - Metric: `Apdex (Web)`
   - Alert threshold: When Apdex < 0.7 for 5 minutes
   - Critical threshold: When Apdex < 0.5 for 2 minutes

### Error Rate Alert

1. Create condition:
   - Metric: `Error rate`
   - Alert threshold: When error rate > 5% for 5 minutes
   - Notify: Slack channel

### Throughput Alert

1. Create condition:
   - Metric: `Throughput`
   - Alert threshold: When throughput < 10 requests/minute for 10 minutes
   - Indicates possible outage or issue

## Step 7: Environment Variables

### Development

```env
NEW_RELIC_LICENSE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEW_RELIC_APP_NAME=rbxfolio-api-dev
NEW_RELIC_LOG_LEVEL=info
NEXT_PUBLIC_NEWRELIC_LICENSE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_NEWRELIC_APP_ID=12345
NODE_ENV=development
```

### Production

```env
NEW_RELIC_LICENSE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEW_RELIC_APP_NAME=rbxfolio-api-prod
NEW_RELIC_LOG_LEVEL=warn
NEXT_PUBLIC_NEWRELIC_LICENSE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_NEWRELIC_APP_ID=67890
NEW_RELIC_ENABLED=true
NODE_ENV=production
```

## Key Metrics to Monitor

### API Performance

- **Apdex Score**: User satisfaction with response time (target: >0.94)
- **Response Time**: Average, median, 95th percentile
- **Throughput**: Requests per minute
- **Error Rate**: % of requests with errors

### Database

- **Query Time**: Average query duration (target: <100ms)
- **Queries/Min**: Query throughput
- **Slow Queries**: Queries > 1 second
- **Connection Pool**: Active connections

### Frontend

- **Page Load Time**: DOM interactive, fully loaded
- **First Paint**: Time to first visual change
- **Long Tasks**: JavaScript execution time > 50ms
- **Error Rate**: Frontend JavaScript errors

### Business

- **Signup Rate**: New users per hour
- **Login Success Rate**: % successful logins
- **Transaction Completion**: % completed transactions
- **API Usage**: By endpoint and user

## Dashboard Best Practices

### Create Custom Dashboard

1. Go to **Dashboards**
2. Create new dashboard
3. Add widgets:
   - Apdex score (top left)
   - Response time (top center)
   - Error rate (top right)
   - Throughput (bottom left)
   - Top slow transactions (bottom right)

### Monitor Key Transactions

1. Go to **Transactions**
2. Mark important endpoints as "Key Transactions"
3. Track their performance over time

### Set Up Service Maps

1. Go to **Service Maps** (if using distributed tracing)
2. Visualize dependencies between services
3. Identify bottlenecks and failures

## Troubleshooting

### New Relic Not Reporting

1. Verify license key is correct
2. Check application name matches New Relic configuration
3. Ensure `newrelic` require is first import in main.ts
4. Check New Relic network connectivity
5. Review New Relic agent logs

### High Memory Usage

1. Reduce `max_event_samples_stored` in config
2. Disable session replay on non-production
3. Reduce custom event sampling
4. Check for memory leaks in application

### Missing Metrics

1. Verify custom metrics are being recorded
2. Check metric naming conventions
3. Ensure attributes are not PII
4. Review New Relic documentation for limits

## Production Checklist

- [ ] New Relic account created
- [ ] License keys obtained and stored securely
- [ ] Backend agent initialized (at top of main.ts)
- [ ] Frontend agent initialized (on app load)
- [ ] Custom metrics implemented for key operations
- [ ] Database query tracking enabled
- [ ] Business event tracking configured
- [ ] Alert policies created and tested
- [ ] Slack integration enabled
- [ ] Dashboard created with key metrics
- [ ] Key transactions marked
- [ ] Team trained on dashboard usage

## Cost Optimization

- **Data Ingestion**: Free tier = 100GB/month
- **Custom Events**: Keep under 5,000/min for free tier
- **Sampling**: Reduce session replay to 10% in production
- **Retention**: Use 7-day retention for non-critical metrics

## Resources

- [New Relic Documentation](https://docs.newrelic.com)
- [Node.js APM Guide](https://docs.newrelic.com/docs/apm/agents/nodejs-agent)
- [Browser Agent Guide](https://docs.newrelic.com/docs/browser/browser-monitoring)
- [Custom Metrics](https://docs.newrelic.com/docs/agents/manage-apm-agents/agent-data/collect-custom-metrics)
- [API Reference](https://docs.newrelic.com/docs/agents/nodejs-agent/api-guides)
- [Distributed Tracing](https://docs.newrelic.com/docs/distributed-tracing)

## Related Documentation

- [PRODUCTION_CONFIG.md](./PRODUCTION_CONFIG.md) - Production environment setup
- [SENTRY_SETUP.md](./SENTRY_SETUP.md) - Error tracking (complements APM)
- `apps/api/newrelic.js` - Backend configuration
- `apps/api/src/common/newrelic.service.ts` - Service implementation
