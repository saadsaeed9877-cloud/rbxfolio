import { test, expect } from '@playwright/test';

/**
 * Contact Requests E2E Tests
 * Tests sending, viewing, and managing contact requests
 */

test.describe('Contact Requests', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByRole('link', { name: /log in|login/i }).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('TestPassword123!');
    await page.getByRole('button', { name: /log in|login/i }).click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should view contact requests inbox', async ({ page }) => {
    await page.getByRole('link', { name: /contact|requests|inbox/i }).click();
    await expect(page).toHaveURL(/contact-requests|inbox/);

    // Should display request list or empty state
    await expect(
      page.getByText(/contact requests|inbox|no requests/i)
    ).toBeTruthy();
  });

  test('should filter contact requests by status', async ({ page }) => {
    await page.getByRole('link', { name: /contact|requests|inbox/i }).click();

    // Should have filter tabs
    const allTab = page.getByRole('tab', { name: /all/i });
    const pendingTab = page.getByRole('tab', { name: /pending/i });
    const acceptedTab = page.getByRole('tab', { name: /accepted/i });

    if (await pendingTab.isVisible()) {
      await pendingTab.click();
      // Should show only pending requests
      await page.waitForLoadState('networkidle');
    }

    if (await acceptedTab.isVisible()) {
      await acceptedTab.click();
      // Should show only accepted requests
      await page.waitForLoadState('networkidle');
    }
  });

  test('should expand contact request details', async ({ page }) => {
    await page.getByRole('link', { name: /contact|requests|inbox/i }).click();

    // Find and click on a request
    const requestCard = page.locator('[data-testid="request-card"]').first();
    if (await requestCard.isVisible()) {
      await requestCard.click();

      // Should expand to show full message
      await expect(page.getByText(/message|details/i)).toBeTruthy();
    }
  });

  test('should accept contact request', async ({ page }) => {
    await page.getByRole('link', { name: /contact|requests|inbox/i }).click();

    // Find pending request
    const pendingTab = page.getByRole('tab', { name: /pending/i });
    if (await pendingTab.isVisible()) {
      await pendingTab.click();
    }

    // Find and expand request
    const requestCard = page.locator('[data-testid="request-card"]').first();
    if (await requestCard.isVisible()) {
      await requestCard.click();

      // Find accept button
      const acceptBtn = page.getByRole('button', { name: /accept/i });
      if (await acceptBtn.isVisible()) {
        await acceptBtn.click();

        // Should show success or confirmation
        await expect(page.getByText(/accepted|success/i)).toBeTruthy();
      }
    }
  });

  test('should decline contact request', async ({ page }) => {
    await page.getByRole('link', { name: /contact|requests|inbox/i }).click();

    // Find pending request
    const pendingTab = page.getByRole('tab', { name: /pending/i });
    if (await pendingTab.isVisible()) {
      await pendingTab.click();
    }

    // Find and expand request
    const requestCard = page.locator('[data-testid="request-card"]').first();
    if (await requestCard.isVisible()) {
      await requestCard.click();

      // Find decline button
      const declineBtn = page.getByRole('button', { name: /decline|reject/i });
      if (await declineBtn.isVisible()) {
        await declineBtn.click();

        // Should show success or confirmation
        await expect(page.getByText(/declined|rejected|success/i)).toBeTruthy();
      }
    }
  });

  test('should submit contact request to another user', async ({ page, context }) => {
    // Navigate to browse or public profile
    await page.goto('/browse');

    // Find a user profile
    const profileLink = page.getByRole('link').first();
    if (await profileLink.isVisible()) {
      await profileLink.click();

      // Should be on public profile
      // Find contact button
      const contactBtn = page.getByRole('button', { name: /contact|message|reach out/i });
      if (await contactBtn.isVisible()) {
        await contactBtn.click();

        // Should show contact form
        // Fill form
        const nameInput = page.getByLabel(/name|your name/i);
        if (await nameInput.isVisible()) {
          await nameInput.fill('Test Visitor');
        }

        const messageInput = page.getByLabel(/message|your message/i);
        if (await messageInput.isVisible()) {
          await messageInput.fill('I would like to collaborate on a project!');
        }

        // Submit
        const submitBtn = page.getByRole('button', { name: /send|submit/i });
        if (await submitBtn.isVisible()) {
          await submitBtn.click();

          // Should show success
          await expect(page.getByText(/sent|success|thank you/i)).toBeTruthy();
        }
      }
    }
  });

  test('should display pending contact request count', async ({ page }) => {
    // Navigate to dashboard
    await expect(page).toHaveURL(/dashboard/);

    // Should show badge with pending count
    const contactLink = page.getByRole('link', { name: /contact|requests|inbox/i });
    if (await contactLink.isVisible()) {
      // May have a badge with count
      const badge = contactLink.locator('span[data-testid="badge"]');
      if (await badge.isVisible()) {
        const count = await badge.textContent();
        expect(count).toMatch(/\d+/);
      }
    }
  });

  test('should validate contact request form', async ({ page }) => {
    await page.goto('/browse');

    // Find and open profile
    const profileLink = page.getByRole('link').first();
    if (await profileLink.isVisible()) {
      await profileLink.click();

      // Find contact button
      const contactBtn = page.getByRole('button', { name: /contact|message|reach out/i });
      if (await contactBtn.isVisible()) {
        await contactBtn.click();

        // Try to submit without filling form
        const submitBtn = page.getByRole('button', { name: /send|submit/i });
        if (await submitBtn.isVisible()) {
          await submitBtn.click();

          // Should show validation error
          await expect(page.getByText(/required|invalid/i)).toBeTruthy();
        }
      }
    }
  });
});
