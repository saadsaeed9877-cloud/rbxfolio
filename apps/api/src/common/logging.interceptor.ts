import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { LoggerService } from "./logger.service";

/**
 * Logging Interceptor
 * Captures all HTTP requests/responses and logs them using Winston
 * Free alternative to Sentry - no trial, no credit card, fully self-hosted
 */

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, params, body, ip } = request;

    const startTime = Date.now();

    return next.handle().pipe(
      tap((response) => {
        // Success path
        const duration = Date.now() - startTime;

        this.loggerService.logRequest(method, url, 200, duration, {
          ip,
          query,
          params,
          duration_ms: duration,
        });

        // Log slow requests
        if (duration > 1000) {
          this.loggerService.warn(`Slow request detected: ${method} ${url}`, {
            duration_ms: duration,
            threshold_ms: 1000,
          });
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || error.statusCode || 500;

        // Log request with error
        this.loggerService.logRequest(method, url, statusCode, duration, {
          ip,
          query,
          params,
          error: error.message,
          duration_ms: duration,
        });

        // Log full error details
        this.loggerService.error(
          `Request failed: ${method} ${url}`,
          error,
          {
            statusCode,
            duration_ms: duration,
            url,
            method,
            ip,
            body: this.sanitizeBody(body),
          }
        );

        // Re-throw error for normal NestJS error handling
        throw error;
      })
    );
  }

  /**
   * Sanitize body to remove sensitive information
   */
  private sanitizeBody(body: any): any {
    if (!body) return undefined;

    const sensitiveFields = [
      "password",
      "passwordConfirm",
      "token",
      "refreshToken",
      "apiKey",
      "secret",
      "ssn",
      "creditCard",
    ];

    const sanitized = JSON.parse(JSON.stringify(body));

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = "[REDACTED]";
      }
    }

    return sanitized;
  }
}
