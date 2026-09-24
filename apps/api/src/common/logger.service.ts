import { Injectable, Logger as NestLogger } from "@nestjs/common";
import * as winston from "winston";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

/**
 * Winston Logger Service
 * Handles all application logging to files and console
 * Free alternative to Sentry - no trial, no credit card, fully self-hosted
 */

@Injectable()
export class LoggerService {
  private logger: winston.Logger;
  private nestLogger = new NestLogger(LoggerService.name);

  constructor() {
    // Create logs directory if it doesn't exist
    const logsDir = join(process.cwd(), "logs");
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr =
            Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : "";
          return `${timestamp} [${level.toUpperCase()}] ${message} ${metaStr}`;
        })
      ),
      defaultMeta: { service: "rbxfolio-api" },
      transports: [
        // Error logs - only errors
        new winston.transports.File({
          filename: join(logsDir, "error.log"),
          level: "error",
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),
        // Combined logs - all levels
        new winston.transports.File({
          filename: join(logsDir, "combined.log"),
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),
      ],
    });

    // Console output in development
    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message, ...meta }) =>
                `${timestamp} [${level}] ${message} ${
                  Object.keys(meta).length > 0
                    ? JSON.stringify(meta, null, 2)
                    : ""
                }`
            )
          ),
        })
      );
    }
  }

  /**
   * Log error with full context
   */
  error(message: string, error?: Error | any, context?: Record<string, any>) {
    const meta: any = { ...context };

    if (error instanceof Error) {
      meta.error = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    } else if (error) {
      meta.error = error;
    }

    this.logger.error(message, meta);
  }

  /**
   * Log warning
   */
  warn(message: string, context?: Record<string, any>) {
    this.logger.warn(message, context || {});
  }

  /**
   * Log info
   */
  info(message: string, context?: Record<string, any>) {
    this.logger.info(message, context || {});
  }

  /**
   * Log debug
   */
  debug(message: string, context?: Record<string, any>) {
    this.logger.debug(message, context || {});
  }

  /**
   * Log HTTP request details
   */
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    context?: Record<string, any>
  ) {
    const level = statusCode >= 400 ? "warn" : "info";
    const message = `${method} ${url} - ${statusCode} (${duration}ms)`;

    this.logger[level as "warn" | "info"](message, {
      ...context,
      http: {
        method,
        url,
        status_code: statusCode,
        duration_ms: duration,
      },
    });
  }

  /**
   * Log database query
   */
  logQuery(query: string, duration: number, success: boolean = true) {
    const level = success ? "debug" : "warn";
    const message = `Database query (${duration}ms)`;

    this.logger[level as "debug" | "warn"](message, {
      query: query.substring(0, 200),
      duration_ms: duration,
      success,
    });
  }

  /**
   * Log API timing
   */
  logApiTiming(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    body?: any
  ) {
    this.logRequest(method, url, statusCode, duration, { body });
  }
}
