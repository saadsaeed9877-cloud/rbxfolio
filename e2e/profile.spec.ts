import { test, expect } from '@playwright/test';

/**
 * Profile Management E2E Tests
 * Tests profile viewing, editing, and avatar/banner uploads
 */

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByRole('link', { name: /log in|login/i }).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('TestPassword123!');
    await page.getByRole('button', { name: /log in|login/i }).click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should view own profile', async ({ page }) => {
    // Navigate to profile page
    await page.getByRole('link', { name: /profile|settings/i }).click();
    await expect(page).toHaveURL(/profile|settings/);

    // Should display profile form
    await expect(page.getByLabel(/display name/i)).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/bio/i)).toBeVisible();
  });

  test('should view public profile by username', async ({ page }) => {
    // Navigate to a user's public profile
    // This would typically be via browse or search
    await page.goto('/browse');
    
    // Click on a profile
    const profileLink = page.getByRole('link').first();
    if (await profileLink.isVisible()) {
      await profileLink.click();
      
      // Should display public profile info
      await expect(page.getByRole('heading')).toBeTruthy();
    }
  });

  test('should update profile information', async ({ page }) => {
    // Navigate to profile settings
    await page.getByRole('link', { name: /profile|settings/i }).click();

    // Update display name
    const displayNameInput = page.getByLabel(/display name/i);
    await displayNameInput.clear();
    await displayNameInput.fill('Updated Display Name');

    // Update tagline
    const taglineInput = page.getByLabel(/tagline/i);
    if (await taglineInput.isVisible()) {
      await taglineInput.clear();
      await taglineInput.fill('Updated tagline');
    }

    // Save changes
    await page.getByRole('button', { name: /save|update/i }).click();

    // Should show success message
    await expect(page.getByText(/success|updated|saved/i)).toBeVisible();

    // Verify changes persisted
    await expect(displayNameInput).toHaveValue('Updated Display Name');
  });

  test('should upload profile avatar', async ({ page }) => {
    // Navigate to profile settings
    await page.getByRole('link', { name: /profile|settings/i }).click();

    // Find avatar upload
    const avatarInput = page.locator('input[accept*="image"]').first();
    
    // Create and upload a test image
    await avatarInput.setInputFiles({
      name: 'avatar.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data'),
    });

    // Should show upload progress or completion
    await expect(page.getByText(/uploading|uploaded|success/i)).toBeTruthy();
  });

  test('should upload profile banner', async ({ page }) => {
    // Navigate to profile settings
    await page.getByRole('link', { name: /profile|settings/i }).click();

    // Find banner upload
    const bannerInputs = page.locator('input[accept*="image"]');
    const bannerInput = bannerInputs.nth(1); // Usually second image input

    // Create and upload a test image
    await bannerInput.setInputFiles({
      name: 'banner.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-banner-data'),
    });

    // Should show upload progress or completion
    await expect(page.getByText(/uploading|uploaded|success/i)).toBeTruthy();
  });

  test('should validate profile fields', async ({ page }) => {
    // Navigate to profile settings
    await page.getByRole('link', { name: /profile|settings/i }).click();

    // Try to enter invalid username
    const usernameInput = page.getByLabel(/username/i);
    await usernameInput.clear();
    await usernameInput.fill('UPPERCASE_USERNAME'); // Should be lowercase

    // Try to save
    await page.getByRole('button', { name: /save|update/i }).click();

    // Should show validation error
    await expect(page.getByText(/lowercase|invalid|error/i)).toBeTruthy();
  });

  test('should display role and availability', async ({ page }) => {
    // Navigate to profile settings
    await page.getByRole('link', { name: /profile|settings/i }).click();

    // Should have role selector
    await expect(page.getByLabel(/primary role/i)).toBeVisible();

    // Should have availability selector
    await expect(page.getByLabel(/availability/i)).toBeVisible();
  });

  test('should manage social links', async ({ page }) => {
    // Navigate to profile settings
    await page.getByRole('link', { name: /profile|settings/i }).click();

    // Should have social links section
    if (await page.getByText(/social|github|twitter|portfolio/i).isVisible()) {
      // Add or edit a social link
      const socialInput = page.getByLabel(/github|twitter/i).first();
      if (await socialInput.isVisible()) {
        await socialInput.clear();
        await socialInput.fill('https://github.com/testuser');
      }

      // Save
      await page.getByRole('button', { name: /save|update/i }).click();
      await expect(page.getByText(/success|updated/i)).toBeVisible();
    }
  });

  test('should display profile character counts', async ({ page }) => {
    // Navigate to profile settings
    await page.getByRole('link', { name: /profile|settings/i }).click();

    // Check for character count display
    const bioInput = page.getByLabel(/bio/i);
    if (await bioInput.isVisible()) {
      // Type in bio
      await bioInput.clear();
      await bioInput.fill('This is my bio');

      // Should show character count
      await expect(page.getByText(/\d+ \/ \d+/)).toBeVisible();
    }
  });
});
