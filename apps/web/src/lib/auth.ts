/**
 * Better Auth Configuration
 * 
 * CRITICAL: This handles all authentication for RbxFolio
 * - Session management
 * - OAuth providers (Discord, GitHub, Google)
 * - Email/password authentication
 * - Email verification and password reset
 * 
 * See: DESIGN_SYSTEM_GUIDE.md for usage
 */

import { Resend } from "resend";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@rbxfolio/database";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Send email using Resend in production or log in development
 */
async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[Email dev mode] To: ${to} | Subject: ${subject}`);
    console.log(`[Email dev mode] HTML: ${html.substring(0, 100)}...`);
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@rbxfolio.local",
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
}

/**
 * Better Auth Configuration
 * 
 * Features:
 * - Prisma adapter for PostgreSQL
 * - Email & password authentication
 * - OAuth: Discord, GitHub, Google
 * - Session management with cookie caching
 * - Email verification & password reset
 * - CSRF protection
 */
export const auth = betterAuth({
  // Database
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  basePath: "/api/auth",

  // Secret for signing tokens (CRITICAL: must be >= 32 chars)
  secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret-key-change-in-production",

  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Allow login without email verification
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(
        user.email,
        "Reset your RbxFolio password",
        `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      );
    },
  },

  // Email Verification (optional)
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail(
        user.email,
        "Verify your RbxFolio email",
        `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
      );
    },
  },

  // OAuth Providers
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },

  // Session Management
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAgeUntilAndLeaning: 60 * 60 * 24, // Update every day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes cache
    },
  },

  // CSRF Protection
  advanced: {
    crossSubDomainCookies: {
      enabled: false, // Only for same domain
    },
  },

  // Trusted origins for CORS
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
