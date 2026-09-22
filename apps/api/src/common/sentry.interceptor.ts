import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

/**
 * Sentry Error Interceptor
 * Captures all exceptions and sends them to Sentry for monitoring
 * Also tracks performance metrics for each request
 */

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SentryInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, params, body, ip, headers } = request;

    // Create Sentry transaction for performance monitoring
    const transaction = Sentry.startTransaction({
      op: 'http.server',
      name: `${method} ${url}`,
      description: `${method} request to ${url}`,
      tags: {
        http_method: method,
        http_url: url,
      },
    });

    const startTime = Date.now();

    return next.handle().pipe(
      tap((response) => {
        // Success path
        const duration = Date.now() - startTime;
        
        transaction.setTag('http_status_code', 200);
        transaction.setTag('duration_ms', duration);
        transaction.setStatus('ok');
        transaction.finish();

        // Log slow requests
        if (duration > 1000) {
          this.logger.warn(
            `Slow request: ${method} ${url} took ${duration}ms`,
            { url, method, duration }
          );
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Determine error status code
        const statusCode = error.status || error.statusCode || 500;

        // Capture exception in Sentry
        Sentry.captureException(error, {
          level: statusCode >= 500 ? 'error' : 'warning',
          tags: {
            http_method: method,
            http_url: url,
            http_status_code: statusCode,
            duration_ms: duration,
            service: 'api',
          },
          contexts: {
            http: {
              method,
              url,
              status_code: statusCode,
              query_string: JSON.stringify(query),
              headers: this.sanitizeHeaders(headers),
            },
          },
          extra: {
            body: this.sanitizeBody(body),
            params,
            query,
            ip,
            duration_ms: duration,
          },
        });

        // Update transaction
        transaction.setTag('http_status_code', statusCode);
        transaction.setTag('duration_ms', duration);
        transaction.setStatus(statusCode >= 500 ? 'error' : 'unknown');
        transaction.finish();

        this.logger.error(
          `Request failed: ${method} ${url}`,
          {
            statusCode,
            duration,
            error: error.message,
          }
        );

        // Re-throw error for normal NestJS error handling
        throw error;
      })
    );
  }

  /**
   * Sanitize headers to remove sensitive information
   */
  private sanitizeHeaders(headers: Record<string, any>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'x-api-key',
      'x-token',
    ];

    for (const [key, value] of Object.entries(headers || {})) {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string') {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Sanitize request body to remove sensitive information
   */
  private sanitizeBody(body: any): any {
    if (!body) return undefined;

    const sensitiveFields = [
      'password',
      'passwordConfirm',
      'token',
      'refreshToken',
      'apiKey',
      'secret',
      'ssn',
      'creditCard',
    ];

    const sanitized = JSON.parse(JSON.stringify(body));

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
