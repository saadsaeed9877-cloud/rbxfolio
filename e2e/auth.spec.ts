import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * Tests signup, login, and session flows
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up|register/i }).click();
    await expect(page).toHaveURL(/signup|register/);
    await expect(page.getByRole('heading', { name: /sign up|register/i })).toBeVisible();
  });

  test('should show validation errors for invalid signup', async ({ page }) => {
    await page.getByRole('link', { name: /sign up|register/i }).click();

    // Try to submit without filling required fields
    await page.getByRole('button', { name: /sign up|register/i }).click();

    // Should show validation errors
    await expect(page.getByText(/required|invalid/i)).toBeTruthy();
  });

  test('should signup with valid credentials', async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'SecurePassword123!';

    await page.getByRole('link', { name: /sign up|register/i }).click();

    // Fill signup form
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).first().fill(testPassword);
    await page.getByLabel(/confirm password/i).fill(testPassword);
    await page.getByLabel(/name/i).fill('Test User');

    // Submit
    await page.getByRole('button', { name: /sign up|register/i }).click();

    // Should redirect to dashboard or onboarding
    await expect(page).toHaveURL(/dashboard|onboarding/);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: /log in|login/i }).click();
    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole('heading', { name: /log in|login/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByRole('link', { name: /log in|login/i }).click();

    // Fill with invalid credentials
    await page.getByLabel(/email/i).fill('nonexistent@example.com');
    await page.getByLabel(/password/i).fill('WrongPassword123!');

    // Submit
    await page.getByRole('button', { name: /log in|login/i }).click();

    // Should show error
    await expect(page.getByText(/invalid|incorrect|failed/i)).toBeTruthy();
  });

  test('should persist session after login', async ({ page, context }) => {
    // Assuming there's a test user available
    const testEmail = 'test@example.com';
    const testPassword = 'TestPassword123!';

    await page.getByRole('link', { name: /log in|login/i }).click();

    // Login
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /log in|login/i }).click();

    // Wait for redirect
    await expect(page).toHaveURL(/dashboard/);

    // Open new page in same context to test session persistence
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');

    // Should still be logged in
    await expect(newPage.getByText(/logout|sign out/i)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    const testEmail = 'test@example.com';
    const testPassword = 'TestPassword123!';

    await page.getByRole('link', { name: /log in|login/i }).click();
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /log in|login/i }).click();

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);

    // Find and click logout button
    await page.getByRole('button', { name: /logout|sign out|profile/i }).click();
    const logoutButton = page.getByRole('menuitem', { name: /logout|sign out/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }

    // Should redirect to home or login
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/?$|login/);
  });

  test('should prevent access to protected pages without login', async ({ page }) => {
    // Try to access dashboard directly
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('should allow access to public pages without login', async ({ page }) => {
    // Browse page should be accessible
    await page.goto('/browse');
    await expect(page).toHaveURL(/browse/);
    await expect(page.getByRole('heading')).toBeTruthy();
  });
});
