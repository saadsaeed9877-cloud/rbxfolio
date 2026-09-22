import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SentryService } from '../sentry.service';
import * as Sentry from '@sentry/node';

// Mock Sentry module
vi.mock('@sentry/node', () => ({
  captureException: vi.fn().mockReturnValue('event-123'),
  captureMessage: vi.fn().mockReturnValue('message-456'),
  addBreadcrumb: vi.fn(),
  setUser: vi.fn(),
  setTag: vi.fn(),
  setContext: vi.fn(),
  startTransaction: vi.fn().mockReturnValue({
    finish: vi.fn(),
  }),
}));

describe('SentryService', () => {
  let service: SentryService;

  beforeEach(() => {
    process.env.SENTRY_DSN_API = 'https://test@sentry.io/123';
    service = new SentryService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.SENTRY_DSN_API;
  });

  describe('captureException', () => {
    it('should capture exception with context', () => {
      const error = new Error('Test error');
      const context = {
        tags: { service: 'auth' },
        level: 'error' as const,
      };

      const eventId = service.captureException(error, context);

      expect(eventId).toBe('event-123');
      expect(Sentry.captureException).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          level: 'error',
        })
      );
    });

    it('should return null if Sentry disabled', () => {
      delete process.env.SENTRY_DSN_API;
      const newService = new SentryService();
      const error = new Error('Test');

      const eventId = newService.captureException(error);

      expect(eventId).toBeNull();
    });

    it('should handle capture errors gracefully', () => {
      vi.mocked(Sentry.captureException).mockImplementationOnce(() => {
        throw new Error('Sentry error');
      });

      const error = new Error('Capture failed');
      const eventId = service.captureException(error);

      expect(eventId).toBeNull();
    });
  });

  describe('captureMessage', () => {
    it('should capture message with level', () => {
      const eventId = service.captureMessage('Test message', 'warning');

      expect(eventId).toBe('message-456');
      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        'Test message',
        expect.objectContaining({
          level: 'warning',
        })
      );
    });

    it('should use default info level', () => {
      const eventId = service.captureMessage('Test message');

      expect(eventId).toBe('message-456');
    });

    it('should return null if Sentry disabled', () => {
      delete process.env.SENTRY_DSN_API;
      const newService = new SentryService();

      const eventId = newService.captureMessage('Test');

      expect(eventId).toBeNull();
    });
  });

  describe('addBreadcrumb', () => {
    it('should add breadcrumb with data', () => {
      service.addBreadcrumb({
        category: 'user-action',
        message: 'User clicked button',
        level: 'info',
        data: { buttonId: 'submit' },
      });

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'user-action',
          message: 'User clicked button',
        })
      );
    });

    it('should not fail if Sentry disabled', () => {
      delete process.env.SENTRY_DSN_API;
      const newService = new SentryService();

      expect(() => {
        newService.addBreadcrumb({
          category: 'test',
          message: 'Test',
        });
      }).not.toThrow();
    });
  });

  describe('setUserContext', () => {
    it('should set user context', () => {
      service.setUserContext('user-123', 'user@example.com', 'username');

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'user@example.com',
        username: 'username',
      });
    });

    it('should clear user context', () => {
      service.clearUserContext();

      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });
  });

  describe('setTag', () => {
    it('should set single tag', () => {
      service.setTag('service', 'auth');

      expect(Sentry.setTag).toHaveBeenCalledWith('service', 'auth');
    });

    it('should set multiple tags', () => {
      service.setTags({
        service: 'auth',
        operation: 'signup',
      });

      expect(Sentry.setTag).toHaveBeenCalledTimes(2);
    });
  });

  describe('setContext', () => {
    it('should set context', () => {
      service.setContext('user', {
        id: 'user-123',
        plan: 'pro',
      });

      expect(Sentry.setContext).toHaveBeenCalledWith('user', {
        id: 'user-123',
        plan: 'pro',
      });
    });
  });

  describe('startTransaction', () => {
    it('should start transaction', () => {
      const transaction = service.startTransaction('database', 'getUserById', {
        service: 'user',
      });

      expect(Sentry.startTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          op: 'database',
          name: 'getUserById',
        })
      );
      expect(transaction).toBeDefined();
    });
  });

  describe('captureQueryTiming', () => {
    it('should capture database query timing', () => {
      const addBreadcrumbSpy = vi.spyOn(service, 'addBreadcrumb');

      service.captureQueryTiming('SELECT * FROM users', 150, true);

      expect(addBreadcrumbSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'database',
          data: expect.objectContaining({
            duration_ms: 150,
            success: true,
          }),
        })
      );
    });

    it('should mark failed query with warning level', () => {
      const addBreadcrumbSpy = vi.spyOn(service, 'addBreadcrumb');

      service.captureQueryTiming('SELECT * FROM users', 5000, false);

      expect(addBreadcrumbSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'warning',
        })
      );
    });
  });

  describe('captureApiTiming', () => {
    it('should capture successful API call', () => {
      const addBreadcrumbSpy = vi.spyOn(service, 'addBreadcrumb');

      service.captureApiTiming('GET', 'https://api.example.com/users', 200, 200);

      expect(addBreadcrumbSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'http',
          data: expect.objectContaining({
            method: 'GET',
            status_code: 200,
            duration_ms: 200,
          }),
        })
      );
    });

    it('should mark failed API call with warning level', () => {
      const addBreadcrumbSpy = vi.spyOn(service, 'addBreadcrumb');

      service.captureApiTiming('POST', 'https://api.example.com/users', 500, 500);

      expect(addBreadcrumbSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'warning',
        })
      );
    });
  });

  describe('healthCheck', () => {
    it('should return true if Sentry healthy', async () => {
      const result = await service.healthCheck();

      expect(result).toBe(true);
    });

    it('should return false if Sentry disabled', async () => {
      delete process.env.SENTRY_DSN_API;
      const newService = new SentryService();

      const result = await newService.healthCheck();

      expect(result).toBe(false);
    });

    it('should return false on capture error', async () => {
      vi.mocked(Sentry.captureMessage).mockImplementationOnce(() => {
        throw new Error('Sentry error');
      });

      const result = await service.healthCheck();

      expect(result).toBe(false);
    });
  });
});
