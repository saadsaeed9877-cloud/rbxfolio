/**
 * New Relic Configuration
 * Application Performance Monitoring setup for RbxFolio API
 */

'use strict'

exports.config = {
  // Application name
  app_name: [process.env.NEW_RELIC_APP_NAME || 'rbxfolio-api'],

  // License key
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  // Logging
  logging: {
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info',
    filepath: 'stdout',
  },

  // Transaction tracer - captures transaction details
  transaction_tracer: {
    enabled: true,
    transaction_threshold: 'apdex_f',
    detail: 1,
    record_sql: 'obfuscated', // obfuscate sensitive data
    slow_sql: {
      enabled: true,
      threshold: 500, // milliseconds
    },
  },

  // Database query tracing
  slow_sql: {
    enabled: true,
    threshold: 500,
  },

  // Error collection
  error_collector: {
    enabled: true,
    capture_events: true,
    max_event_samples_stored: 100,
    expected_status_codes: [
      400, 401, 403, 404, 405, 408, 409, 410, 422, 429, 500, 502, 503, 504,
    ],
  },

  // Distributed tracing
  distributed_tracing: {
    enabled: process.env.NODE_ENV === 'production',
  },

  // High security mode
  high_security: false,

  // Process host
  process_host: {
    display_name: process.env.NODE_ENV || 'development',
  },

  // Custom metrics
  custom_metrics: {
    enabled: true,
  },

  // Capture environment variables
  environment_variables: [
    'NODE_ENV',
    'ENVIRONMENT',
    'NEST_DEBUG',
  ],

  // Ignore certain transactions
  rules: {
    ignore_user_agents: [
      {
        prefix: 'HeadlessChrome',
      },
      {
        prefix: 'PhantomJS',
      },
      {
        prefix: 'New Relic',
      },
    ],
    ignore_transactions: [
      '/health',
      '/status',
      '/metrics',
    ],
  },

  // Span events (for distributed tracing)
  span_events: {
    enabled: true,
    harvest_limit: 1000,
  },

  // Request params capture
  capture_params: false,

  // Transaction naming
  naming_strategy: 'framework',

  // Browser monitoring
  browser_monitoring: {
    enabled: false,
  },
}
