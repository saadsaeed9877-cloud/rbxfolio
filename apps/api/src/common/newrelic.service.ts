import { Injectable, Logger } from '@nestjs/common';

/**
 * New Relic Service
 * Provides methods for custom metrics, events, and transaction tracking
 * Complements automatic APM monitoring with manual instrumentation
 */

const newrelic = require('newrelic');

interface TransactionHandle {
  end: () => void;
}

@Injectable()
export class NewRelicService {
  private readonly logger = new Logger(NewRelicService.name);

  /**
   * Record custom metric
   * Usage: recordMetric('Custom/UserSignup', 1)
   */
  recordMetric(name: string, value: number): void {
    if (!this.isNewRelicEnabled()) {
      return;
    }

    try {
      newrelic.recordMetric(`Custom/${name}`, value);
      this.logger.debug(`Recorded metric: ${name} = ${value}`);
    } catch (error) {
      this.logger.error(`Failed to record metric: ${name}`, error);
    }
  }

  /**
   * Record custom event for analysis in dashboard
   * Usage: recordCustomEvent('UserSignup', { plan: 'free', domain: 'gmail.com' })
   */
  recordCustomEvent(eventType: string, attributes: Record<string, any>): void {
    if (!this.isNewRelicEnabled()) {
      return;
    }

    try {
      newrelic.recordCustomEvent(eventType, attributes);
      this.logger.debug(`Recorded custom event: ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to record custom event: ${eventType}`, error);
    }
  }

  /**
   * Start custom background transaction
   * Usage: const endTransaction = service.startBackgroundTransaction('ImportUsers')
   */
  startBackgroundTransaction(name: string): TransactionHandle {
    if (!this.isNewRelicEnabled()) {
      return { end: () => {} };
    }

    try {
      const transaction = newrelic.startBackgroundTransaction(name, () => {
        // Transaction completed
      });

      return {
        end: () => {
          try {
            newrelic.endTransaction();
          } catch (error) {
            this.logger.error('Failed to end transaction', error);
          }
        },
      };
    } catch (error) {
      this.logger.error(`Failed to start background transaction: ${name}`, error);
      return { end: () => {} };
    }
  }

  /**
   * Ignore transaction (don't track in New Relic)
   * Usage: Useful for health checks, metrics endpoints, etc.
   */
  ignoreTransaction(): void {
    if (!this.isNewRelicEnabled()) {
      return;
    }

    try {
      newrelic.ignoreTransaction();
    } catch (error) {
      this.logger.error('Failed to ignore transaction', error);
    }
  }

  /**
   * Get current transaction
   */
  getTransaction(): any {
    if (!this.isNewRelicEnabled()) {
      return null;
    }

    try {
      return newrelic.getTransaction();
    } catch (error) {
      this.logger.error('Failed to get transaction', error);
      return null;
    }
  }

  /**
   * Set custom transaction name (overrides automatic naming)
   * Usage: setTransactionName('ProcessContactRequest/develop')
   */
  setTransactionName(name: string): void {
    if (!this.isNewRelicEnabled()) {
      return;
    }

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
   * Add custom attribute to current transaction
   * Usage: addCustomAttribute('user_id', '12345')
   */
  addCustomAttribute(key: string, value: any): void {
    if (!this.isNewRelicEnabled()) {
      return;
    }

    try {
      newrelic.addCustomAttribute(key, value);
    } catch (error) {
      this.logger.error(`Failed to add custom attribute: ${key}`, error);
    }
  }

  /**
   * Add multiple custom attributes at once
   */
  addCustomAttributes(attributes: Record<string, any>): void {
    if (!this.isNewRelicEnabled()) {
      return;
    }

    try {
      for (const [key, value] of Object.entries(attributes)) {
        newrelic.addCustomAttribute(key, value);
      }
    } catch (error) {
      this.logger.error('Failed to add custom attributes', error);
    }
  }

  /**
   * Record database query performance
   * Usage: recordDatabaseQuery('SELECT * FROM users WHERE id = ?', 125, 'postgres')
   */
  recordDatabaseQuery(query: string, duration: number, host?: string): void {
    this.recordMetric('Database/Query/Time', duration);
    
    this.recordCustomEvent('DatabaseQuery', {
      query: query.substring(0, 100),
      duration_ms: duration,
      host: host || 'unknown',
      slow: duration > 500,
    });

    // Alert on very slow queries
    if (duration > 1000) {
      this.logger.warn(`Slow database query detected: ${duration}ms`);
    }
  }

  /**
   * Record cache hit (success)
   * Usage: recordCacheHit('user:123', 5)
   */
  recordCacheHit(key: string, duration: number = 0): void {
    this.recordMetric('Cache/Hit', 1);
    this.recordMetric('Cache/Hit/Time', duration);
    
    this.recordCustomEvent('CacheHit', {
      key: key.substring(0, 50),
      duration_ms: duration,
    });
  }

  /**
   * Record cache miss (miss)
   * Usage: recordCacheMiss('user:456')
   */
  recordCacheMiss(key: string): void {
    this.recordMetric('Cache/Miss', 1);
    
    this.recordCustomEvent('CacheMiss', {
      key: key.substring(0, 50),
    });
  }

  /**
   * Record business metric (signup, payment, etc.)
   * Usage: recordBusinessMetric('Signup/Complete', 1)
   */
  recordBusinessMetric(metricName: string, value: number): void {
    this.recordMetric(`Business/${metricName}`, value);
    
    this.recordCustomEvent('BusinessMetric', {
      metric: metricName,
      value,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Record API endpoint call duration
   * Usage: recordApiCall('POST', '/users', 150, 200)
   */
  recordApiCall(method: string, path: string, duration: number, statusCode: number): void {
    const isError = statusCode >= 400;
    
    this.recordMetric(`API/${method}${path}/Time`, duration);
    this.recordMetric(`API/${method}${path}/Count`, 1);

    if (isError) {
      this.recordMetric(`API/${method}${path}/Error`, 1);
    }

    this.recordCustomEvent('ApiCall', {
      method,
      path,
      duration_ms: duration,
      status_code: statusCode,
      is_error: isError,
    });

    // Alert on slow endpoints
    if (duration > 5000) {
      this.logger.warn(`Slow API endpoint: ${method} ${path} took ${duration}ms`);
    }
  }

  /**
   * Record external service call (third-party API, database, etc.)
   * Usage: recordExternalCall('PaymentGateway', 'stripe_charge', 250, true)
   */
  recordExternalCall(
    service: string,
    operation: string,
    duration: number,
    success: boolean,
  ): void {
    this.recordMetric(`External/${service}/${operation}/Time`, duration);

    if (!success) {
      this.recordMetric(`External/${service}/${operation}/Error`, 1);
    }

    this.recordCustomEvent('ExternalCall', {
      service,
      operation,
      duration_ms: duration,
      success,
    });
  }

  /**
   * Record batch operation
   * Usage: recordBatchOperation('ImportUsers', 1000, 50)
   */
  recordBatchOperation(
    operationName: string,
    totalItems: number,
    duration: number,
  ): void {
    const itemsPerSecond = (totalItems / duration) * 1000;

    this.recordMetric(`Batch/${operationName}/Count`, totalItems);
    this.recordMetric(`Batch/${operationName}/Time`, duration);
    this.recordMetric(`Batch/${operationName}/Rate`, itemsPerSecond);

    this.recordCustomEvent('BatchOperation', {
      operation: operationName,
      total_items: totalItems,
      duration_ms: duration,
      items_per_second: itemsPerSecond,
    });
  }

  /**
   * Record async queue metrics
   * Usage: recordQueueMetric('EmailQueue', 42, 2, 1)
   */
  recordQueueMetric(queueName: string, pending: number, processing: number, failed: number): void {
    this.recordMetric(`Queue/${queueName}/Pending`, pending);
    this.recordMetric(`Queue/${queueName}/Processing`, processing);
    this.recordMetric(`Queue/${queueName}/Failed`, failed);

    this.recordCustomEvent('QueueMetric', {
      queue: queueName,
      pending,
      processing,
      failed,
    });
  }

  /**
   * Record error (complements Sentry)
   * Usage: recordError('UserCreationError', { user_id: '123', reason: 'duplicate' })
   */
  recordError(errorType: string, details?: Record<string, any>): void {
    this.recordMetric(`Error/${errorType}`, 1);
    
    this.recordCustomEvent('ApplicationError', {
      error_type: errorType,
      ...details,
    });

    this.logger.error(`Application error recorded: ${errorType}`, details);
  }

  /**
   * Record user action (for business analytics)
   * Usage: recordUserAction('project_created', { project_id: '123' })
   */
  recordUserAction(actionName: string, attributes?: Record<string, any>): void {
    this.recordMetric(`UserAction/${actionName}`, 1);
    
    this.recordCustomEvent('UserAction', {
      action: actionName,
      ...attributes,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Health check - verify New Relic agent is active
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

  /**
   * Check if New Relic is enabled
   */
  private isNewRelicEnabled(): boolean {
    return !!process.env.NEW_RELIC_LICENSE_KEY;
  }
}
