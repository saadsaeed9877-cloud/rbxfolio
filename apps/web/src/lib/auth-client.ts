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
  const result = await authClient.signUp.email({
    email,
    password,
    name,
  });
  return result;
}

// Alias for backward compatibility
export const signUp = signUpWithEmail;

/**
 * Sign in with email/password
 * @param email User's email address
 * @param password User's password
 */
export async function signInWithEmail(email: string, password: string) {
  const result = await authClient.signIn.email({
    email,
    password,
  });
  return result;
}

// Alias for backward compatibility
export const signIn = signInWithEmail;

/**
 * Sign in with OAuth provider
 * @param provider "discord" | "github" | "google"
 */
export async function signInWithOAuth(
  provider: "discord" | "github" | "google"
) {
  return authClient.signIn.social({
    provider,
  });
}

/**
 * Sign out current user
 */
export async function signOut() {
  return authClient.signOut();
}

/**
 * Get current session (client-side)
 */
export async function getCurrentSession() {
  return authClient.getSession();
}
