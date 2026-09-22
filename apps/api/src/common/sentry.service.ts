import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';

/**
 * Sentry Service
 * Provides methods for manual error tracking, breadcrumbs, and user context
 */

interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  userId?: string;
  email?: string;
  username?: string;
}

interface BreadcrumbData {
  category: string;
  message: string;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  data?: Record<string, any>;
}

@Injectable()
export class SentryService {
  private readonly logger = new Logger(SentryService.name);

  /**
   * Capture an exception in Sentry
   */
  captureException(error: Error, context?: ErrorContext): string | null {
    if (!this.isSentryEnabled()) {
      return null;
    }

    try {
      const eventId = Sentry.captureException(error, {
        level: context?.level || 'error',
        tags: {
          ...context?.tags,
        },
        extra: {
          ...context?.extra,
        },
      });

      this.logger.debug(`Exception captured in Sentry: ${eventId}`);
      return eventId as string;
    } catch (sentryError) {
      this.logger.error(
        'Failed to capture exception in Sentry',
        sentryError
      );
      return null;
    }
  }

  /**
   * Capture a message in Sentry
   */
  captureMessage(
    message: string,
    level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
    context?: ErrorContext
  ): string | null {
    if (!this.isSentryEnabled()) {
      return null;
    }

    try {
      const eventId = Sentry.captureMessage(message, {
        level,
        tags: context?.tags,
        extra: context?.extra,
      });

      this.logger.debug(`Message captured in Sentry: ${eventId}`);
      return eventId as string;
    } catch (sentryError) {
      this.logger.error('Failed to capture message in Sentry', sentryError);
      return null;
    }
  }

  /**
   * Add a breadcrumb for tracking user actions/flow
   */
  addBreadcrumb(data: BreadcrumbData): void {
    if (!this.isSentryEnabled()) {
      return;
    }

    try {
      Sentry.addBreadcrumb({
        category: data.category,
        message: data.message,
        level: data.level || 'info',
        data: data.data,
        timestamp: Date.now() / 1000,
      });
    } catch (error) {
      this.logger.error('Failed to add breadcrumb to Sentry', error);
    }
  }

  /**
   * Set user context for all future events
   */
  setUserContext(userId: string, email?: string, username?: string): void {
    if (!this.isSentryEnabled()) {
      return;
    }

    try {
      Sentry.setUser({
        id: userId,
        email: email,
        username: username,
      });

      this.logger.debug(`User context set: ${userId}`);
    } catch (error) {
      this.logger.error('Failed to set user context in Sentry', error);
    }
  }

  /**
   * Clear user context
   */
  clearUserContext(): void {
    if (!this.isSentryEnabled()) {
      return;
    }

    try {
      Sentry.setUser(null);
      this.logger.debug('User context cleared');
    } catch (error) {
      this.logger.error('Failed to clear user context in Sentry', error);
    }
  }

  /**
   * Set custom tags for all future events
   */
  setTag(key: string, value: string): void {
    if (!this.isSentryEnabled()) {
      return;
    }

    try {
      Sentry.setTag(key, value);
    } catch (error) {
      this.logger.error('Failed to set tag in Sentry', error);
    }
  }

  /**
   * Set multiple tags
   */
  setTags(tags: Record<string, string>): void {
    if (!this.isSentryEnabled()) {
      return;
    }

    try {
      for (const [key, value] of Object.entries(tags)) {
        Sentry.setTag(key, value);
      }
    } catch (error) {
      this.logger.error('Failed to set tags in Sentry', error);
    }
  }

  /**
   * Set context for all future events
   */
  setContext(name: string, context: Record<string, any>): void {
    if (!this.isSentryEnabled()) {
      return;
    }

    try {
      Sentry.setContext(name, context);
    } catch (error) {
      this.logger.error('Failed to set context in Sentry', error);
    }
  }

  /**
   * Start a performance transaction
   */
  startTransaction(
    operation: string,
    name: string,
    tags?: Record<string, string>
  ): Sentry.Transaction {
    const transaction = Sentry.startTransaction({
      op: operation,
      name: name,
      tags: tags,
    });

    return transaction;
  }

  /**
   * Capture timing for a database query
   */
  captureQueryTiming(
    query: string,
    duration: number,
    success: boolean = true
  ): void {
    this.addBreadcrumb({
      category: 'database',
      message: `Query: ${query.substring(0, 100)}...`,
      level: success ? 'debug' : 'warning',
      data: {
        duration_ms: duration,
        query: query,
        success: success,
      },
    });
  }

  /**
   * Capture timing for an API call
   */
  captureApiTiming(
    method: string,
    url: string,
    duration: number,
    statusCode: number
  ): void {
    const level = statusCode >= 400 ? 'warning' : 'info';

    this.addBreadcrumb({
      category: 'http',
      message: `${method} ${url} - ${statusCode}`,
      level: level,
      data: {
        method,
        url,
        status_code: statusCode,
        duration_ms: duration,
      },
    });
  }

  /**
   * Health check - verify Sentry is accessible
   */
  async healthCheck(): Promise<boolean> {
    if (!this.isSentryEnabled()) {
      return false;
    }

    try {
      // Try to capture a test event
      const eventId = Sentry.captureMessage('Sentry health check', 'info');
      return !!eventId;
    } catch (error) {
      this.logger.error('Sentry health check failed', error);
      return false;
    }
  }

  /**
   * Check if Sentry is configured and enabled
   */
  private isSentryEnabled(): boolean {
    return !!process.env.SENTRY_DSN_API;
  }
}
