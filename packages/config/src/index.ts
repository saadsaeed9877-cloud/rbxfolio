import { z } from "zod";

// Base schema - all fields optional for build-time compatibility
const baseEnvSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
});

export const webEnvSchema = baseEnvSchema.extend({
  BETTER_AUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
});

export const apiEnvSchema = baseEnvSchema.extend({
  PORT: z.coerce.number().default(3001),
  UPLOAD_DIR: z.string().default("./uploads"),
  CORS_ORIGIN: z.string().url().optional(),
  LOG_LEVEL: z.string().default("info"),
  BLOB_STORE_ID: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  NEW_RELIC_LICENSE_KEY: z.string().optional(),
  NEW_RELIC_APP_NAME: z.string().optional(),
  NEW_RELIC_LOG_LEVEL: z.string().optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;
export type ApiEnv = z.infer<typeof apiEnvSchema>;

export function parseWebEnv(env: NodeJS.ProcessEnv = process.env): WebEnv {
  return webEnvSchema.parse(env);
}

export function parseApiEnv(env: NodeJS.ProcessEnv = process.env): ApiEnv {
  return apiEnvSchema.parse(env);
}

export function isR2Configured(env: ApiEnv): boolean {
  return Boolean(
    env.R2_ACCOUNT_ID &&
      env.R2_ACCESS_KEY_ID &&
      env.R2_SECRET_ACCESS_KEY &&
      env.R2_BUCKET_NAME &&
      env.R2_PUBLIC_URL,
  );
}

export function isBlobConfigured(env: ApiEnv): boolean {
  return Boolean(env.BLOB_READ_WRITE_TOKEN && env.BLOB_STORE_ID);
}
