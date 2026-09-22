/**
 * Better Auth Client - For use in browser/client components
 * 
 * CRITICAL: This is the client-side auth interface
 * Use this to access current session, sign in, sign out, etc.
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

/**
 * Client-side hooks and utilities
 */
export const {
  useSession,
  useSignIn,
  useSignOut,
  useSignUp,
  useForgotPassword,
  useResetPassword,
  useChangePassword,
} = authClient;

/**
 * Sign up with email/password
 * @param email User's email address
 * @param password User's password
 * @param name User's display name
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  return authClient.signUp.email(
    { email, password, name },
    { onSuccess: () => window.location.href = "/dashboard" }
  );
}

/**
 * Sign in with email/password
 * @param email User's email address
 * @param password User's password
 */
export async function signInWithEmail(email: string, password: string) {
  return authClient.signIn.email(
    { email, password },
    { onSuccess: () => window.location.href = "/dashboard" }
  );
}

/**
 * Sign in with OAuth provider
 * @param provider "discord" | "github" | "google"
 */
export async function signInWithOAuth(
  provider: "discord" | "github" | "google"
) {
  return authClient.signIn.social(
    { provider },
    { onSuccess: () => window.location.href = "/dashboard" }
  );
}

/**
 * Sign out current user
 */
export async function signOut() {
  return authClient.signOut({
    fetchOptions: { onSuccess: () => window.location.href = "/login" },
  });
}

/**
 * Get current session (client-side)
 */
export async function getCurrentSession() {
  return authClient.getSession();
}
