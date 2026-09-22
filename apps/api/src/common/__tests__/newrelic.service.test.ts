import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { NewRelicService } from '../newrelic.service';

// Mock newrelic module
vi.mock('newrelic', () => ({
  recordMetric: vi.fn(),
  recordCustomEvent: vi.fn(),
  startBackgroundTransaction: vi.fn(() => ({})),
  endTransaction: vi.fn(),
  ignoreTransaction: vi.fn(),
  getTransaction: vi.fn(() => ({ setName: vi.fn() })),
  addCustomAttribute: vi.fn(),
}));

describe('NewRelicService', () => {
  let service: NewRelicService;

  beforeEach(() => {
    process.env.NEW_RELIC_LICENSE_KEY = 'test-key-123';
    service = new NewRelicService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.NEW_RELIC_LICENSE_KEY;
  });

  describe('initialization', () => {
    it('should create service when enabled', () => {
      expect(service).toBeDefined();
    });

    it('should not throw when disabled', () => {
      delete process.env.NEW_RELIC_LICENSE_KEY;

      expect(() => {
        new NewRelicService();
      }).not.toThrow();
    });
  });

  describe('recordMetric', () => {
    it('should record custom metric without error', () => {
      expect(() => {
        service.recordMetric('UserSignup', 1);
      }).not.toThrow();
    });

    it('should handle disabled', () => {
      delete process.env.NEW_RELIC_LICENSE_KEY;
      const disabledService = new NewRelicService();

      expect(() => {
        disabledService.recordMetric('Test', 1);
      }).not.toThrow();
    });
  });

  describe('recordCustomEvent', () => {
    it('should record event without error', () => {
      expect(() => {
        service.recordCustomEvent('UserSignup', { plan: 'free' });
      }).not.toThrow();
    });
  });

  describe('startBackgroundTransaction', () => {
    it('should return transaction handle', () => {
      const handle = service.startBackgroundTransaction('ProcessBatch');

      expect(handle.end).toBeDefined();
      expect(typeof handle.end).toBe('function');
    });

    it('should end transaction', () => {
      const handle = service.startBackgroundTransaction('ProcessBatch');

      expect(() => handle.end()).not.toThrow();
    });
  });

  describe('ignoreTransaction', () => {
    it('should ignore transaction without error', () => {
      expect(() => {
        service.ignoreTransaction();
      }).not.toThrow();
    });
  });

  describe('getTransaction', () => {
    it('should return transaction', () => {
      const tx = service.getTransaction();

      expect(tx === null || typeof tx === 'object').toBe(true);
    });

    it('should return null when disabled', () => {
      delete process.env.NEW_RELIC_LICENSE_KEY;
      const disabledService = new NewRelicService();

      const tx = disabledService.getTransaction();

      expect(tx).toBeNull();
    });
  });

  describe('setTransactionName', () => {
    it('should set name without error', () => {
      expect(() => {
        service.setTransactionName('CustomName');
      }).not.toThrow();
    });
  });

  describe('addCustomAttribute', () => {
    it('should add attribute without error', () => {
      expect(() => {
        service.addCustomAttribute('user_id', '123');
      }).not.toThrow();
    });

    it('should add multiple attributes without error', () => {
      expect(() => {
        service.addCustomAttributes({ user_id: '123', plan: 'pro' });
      }).not.toThrow();
    });
  });

  describe('recordDatabaseQuery', () => {
    it('should record query without error', () => {
      expect(() => {
        service.recordDatabaseQuery('SELECT * FROM users', 125, 'postgres');
      }).not.toThrow();
    });

    it('should handle slow queries', () => {
      expect(() => {
        service.recordDatabaseQuery('SELECT * FROM large', 1500, 'postgres');
      }).not.toThrow();
    });
  });

  describe('cache metrics', () => {
    it('should record cache hit', () => {
      expect(() => {
        service.recordCacheHit('user:123', 5);
      }).not.toThrow();
    });

    it('should record cache miss', () => {
      expect(() => {
        service.recordCacheMiss('user:456');
      }).not.toThrow();
    });
  });

  describe('business metrics', () => {
    it('should record business metric', () => {
      expect(() => {
        service.recordBusinessMetric('Signup/Complete', 1);
      }).not.toThrow();
    });

    it('should record user action', () => {
      expect(() => {
        service.recordUserAction('project_created', { project_id: '123' });
      }).not.toThrow();
    });
  });

  describe('API and external calls', () => {
    it('should record API call', () => {
      expect(() => {
        service.recordApiCall('POST', '/users', 150, 201);
      }).not.toThrow();
    });

    it('should record external call', () => {
      expect(() => {
        service.recordExternalCall('PaymentGateway', 'charge', 250, true);
      }).not.toThrow();
    });
  });

  describe('batch and queue operations', () => {
    it('should record batch operation', () => {
      expect(() => {
        service.recordBatchOperation('ImportUsers', 1000, 5000);
      }).not.toThrow();
    });

    it('should record queue metric', () => {
      expect(() => {
        service.recordQueueMetric('EmailQueue', 42, 2, 1);
      }).not.toThrow();
    });
  });

  describe('error tracking', () => {
    it('should record application error', () => {
      expect(() => {
        service.recordError('UserCreationError', { user_id: '123' });
      }).not.toThrow();
    });
  });

  describe('healthCheck', () => {
    it('should return boolean', () => {
      const result = service.healthCheck();

      expect(typeof result).toBe('boolean');
    });

    it('should be true when enabled', () => {
      const result = service.healthCheck();

      expect(result).toBe(true);
    });
  });
});
