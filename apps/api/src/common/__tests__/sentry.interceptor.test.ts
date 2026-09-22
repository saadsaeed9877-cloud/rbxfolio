import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { SentryInterceptor } from '../sentry.interceptor';
import * as Sentry from '@sentry/node';

// Mock Sentry
vi.mock('@sentry/node', () => ({
  startTransaction: vi.fn().mockReturnValue({
    setTag: vi.fn(),
    setStatus: vi.fn(),
    finish: vi.fn(),
  }),
  captureException: vi.fn().mockReturnValue('event-123'),
}));

describe('SentryInterceptor', () => {
  let interceptor: SentryInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;
  let mockRequest: any;

  beforeEach(() => {
    process.env.SENTRY_DSN_API = 'https://test@sentry.io/123';
    interceptor = new SentryInterceptor();
    vi.clearAllMocks();

    mockRequest = {
      method: 'GET',
      url: '/api/users',
      query: { page: '1' },
      params: { id: '123' },
      body: { name: 'John' },
      ip: '127.0.0.1',
      headers: {
        authorization: 'Bearer token123',
        'content-type': 'application/json',
      },
    };

    mockExecutionContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue(mockRequest),
      }),
    } as any;

    mockCallHandler = {
      handle: vi.fn(),
    } as any;
  });

  describe('intercept', () => {
    it('should pass through successful requests', async () => {
      const response = { statusCode: 200, data: 'success' };
      mockCallHandler.handle.mockReturnValue(of(response));

      const result = await interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .toPromise();

      expect(result).toEqual(response);
    });

    it('should capture exceptions', async () => {
      const error = new Error('Request failed');
      error.status = 500;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      try {
        await interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .toPromise();
      } catch (e) {
        // Expected
      }

      expect(Sentry.captureException).toHaveBeenCalled();
    });

    it('should sanitize authorization header', async () => {
      const error = new Error('Auth failed');
      error.status = 401;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      try {
        await interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .toPromise();
      } catch (e) {
        // Expected
      }

      const call = vi.mocked(Sentry.captureException).mock.calls[0];
      const sentryOptions = call[1];
      expect(sentryOptions.contexts.http.headers.authorization).toBe(
        '[REDACTED]'
      );
    });

    it('should sanitize password in body', async () => {
      mockRequest.body = { email: 'user@example.com', password: 'secret123' };
      const error = new Error('Signup failed');
      error.status = 400;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      try {
        await interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .toPromise();
      } catch (e) {
        // Expected
      }

      const call = vi.mocked(Sentry.captureException).mock.calls[0];
      const sentryOptions = call[1];
      expect(sentryOptions.extra.body.password).toBe('[REDACTED]');
    });

    it('should set correct tags on exception', async () => {
      const error = new Error('Not found');
      error.status = 404;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      try {
        await interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .toPromise();
      } catch (e) {
        // Expected
      }

      const call = vi.mocked(Sentry.captureException).mock.calls[0];
      const sentryOptions = call[1];
      expect(sentryOptions.tags.http_method).toBe('GET');
      expect(sentryOptions.tags.http_url).toBe('/api/users');
    });

    it('should include request context in exception', async () => {
      const error = new Error('Database error');
      error.status = 500;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      try {
        await interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .toPromise();
      } catch (e) {
        // Expected
      }

      const call = vi.mocked(Sentry.captureException).mock.calls[0];
      const sentryOptions = call[1];
      expect(sentryOptions.extra.ip).toBe('127.0.0.1');
      expect(sentryOptions.extra.params).toEqual({ id: '123' });
    });

    it('should use error level for server errors', async () => {
      const error = new Error('Internal error');
      error.status = 500;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      try {
        await interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .toPromise();
      } catch (e) {
        // Expected
      }

      const call = vi.mocked(Sentry.captureException).mock.calls[0];
      const sentryOptions = call[1];
      expect(sentryOptions.level).toBe('error');
    });

    it('should rethrow original error', async () => {
      const error = new Error('Original error');
      error.status = 500;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      let caughtError: Error | null = null;
      try {
        await interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .toPromise();
      } catch (e) {
        caughtError = e as Error;
      }

      expect(caughtError?.message).toBe('Original error');
    });

    it('should sanitize sensitive headers', async () => {
      mockRequest.headers = {
        'x-api-key': 'secret-key',
        'x-token': 'secret-token',
        'user-agent': 'Mozilla/5.0',
      };

      const error = new Error('Error');
      error.status = 500;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      try {
        await interceptor
          .intercept(mockExecutionContext, mockCallHandler)
          .toPromise();
      } catch (e) {
        // Expected
      }

      const call = vi.mocked(Sentry.captureException).mock.calls[0];
      const headers = call[1].contexts.http.headers;
      expect(headers['x-api-key']).toBe('[REDACTED]');
      expect(headers['x-token']).toBe('[REDACTED]');
      expect(headers['user-agent']).toBe('Mozilla/5.0');
    });
  });
});
