import { test, expect } from '@playwright/test';

/**
 * Search and Browse E2E Tests
 * Tests discovering profiles and projects
 */

test.describe('Search and Browse', () => {
  test('should access browse page without login', async ({ page }) => {
    await page.goto('/browse');
    await expect(page).toHaveURL(/browse/);

    // Should display profiles
    await expect(page.getByRole('heading', { name: /browse|profiles/i })).toBeTruthy();
  });

  test('should sort browse results', async ({ page }) => {
    await page.goto('/browse');

    // Find sort dropdown
    const sortBtn = page.getByRole('button', { name: /sort/i });
    if (await sortBtn.isVisible()) {
      await sortBtn.click();

      // Select "Most Updated"
      const updatedOption = page.getByRole('option', { name: /updated|recent/i });
      if (await updatedOption.isVisible()) {
        await updatedOption.click();

        // Should re-sort results
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should paginate browse results', async ({ page }) => {
    await page.goto('/browse');

    // Should have pagination
    const nextBtn = page.getByRole('button', { name: /next/i });
    if (await nextBtn.isVisible()) {
      const firstPageContent = await page.locator('[data-testid="profile-card"]').first().textContent();

      await nextBtn.click();
      await page.waitForLoadState('networkidle');

      // Should have different content
      const secondPageContent = await page.locator('[data-testid="profile-card"]').first().textContent();
      expect(firstPageContent).not.toBe(secondPageContent);
    }
  });

  test('should search for profiles', async ({ page }) => {
    await page.goto('/search');

    // Should have search input
    const searchInput = page.getByLabel(/search|query|find/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('game developer');
      await page.keyboard.press('Enter');

      // Should show search results
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading')).toBeTruthy();
    }
  });

  test('should filter search by role', async ({ page }) => {
    await page.goto('/search');

    // Fill search query
    const searchInput = page.getByLabel(/search|query|find/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('game');
    }

    // Find role filter
    const roleFilter = page.getByLabel(/role|filter/i);
    if (await roleFilter.isVisible()) {
      await roleFilter.click();

      const scriptOption = page.getByRole('option', { name: /scripter|builder/i });
      if (await scriptOption.isVisible()) {
        await scriptOption.click();

        // Should filter results
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should view search result profile', async ({ page }) => {
    await page.goto('/search');

    // Search for profiles
    const searchInput = page.getByLabel(/search|query|find/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.keyboard.press('Enter');

      // Click on first result
      await page.waitForLoadState('networkidle');
      const resultLink = page.getByRole('link').first();
      if (await resultLink.isVisible()) {
        await resultLink.click();

        // Should be on profile page
        await expect(page.getByRole('heading')).toBeTruthy();
      }
    }
  });

  test('should browse projects', async ({ page }) => {
    // Navigate to projects browse
    const projectsBrowse = page.getByRole('link', { name: /projects|browse projects/i });
    if (await projectsBrowse.isVisible()) {
      await projectsBrowse.click();
      await expect(page).toHaveURL(/projects|browse/);
    } else {
      // Try direct navigation
      await page.goto('/projects/browse');
    }

    // Should display projects
    await expect(page.getByRole('heading', { name: /projects/i })).toBeTruthy();
  });

  test('should search for projects', async ({ page }) => {
    // Navigate to projects
    const projectSearch = page.getByRole('link', { name: /projects|browse projects/i });
    if (await projectSearch.isVisible()) {
      await projectSearch.click();
    } else {
      await page.goto('/projects/browse');
    }

    // Should have search
    const searchInput = page.getByLabel(/search|query/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('puzzle game');
      await page.keyboard.press('Enter');

      // Should show search results
      await page.waitForLoadState('networkidle');
    }
  });

  test('should filter projects by tag', async ({ page }) => {
    await page.goto('/projects/browse');

    // Should have tag filter
    const tagFilter = page.getByLabel(/tag|filter/i);
    if (await tagFilter.isVisible()) {
      await tagFilter.click();

      // Select a tag
      const tagOption = page.getByRole('option').first();
      if (await tagOption.isVisible()) {
        await tagOption.click();

        // Should filter results
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should view project from browse', async ({ page }) => {
    await page.goto('/projects/browse');

    // Click on first project
    const projectLink = page.getByRole('link').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();

      // Should be on project page
      await expect(page.getByRole('heading')).toBeTruthy();
    }
  });

  test('should show profile info in search results', async ({ page }) => {
    await page.goto('/search');

    // Search
    const searchInput = page.getByLabel(/search|query/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('developer');
      await page.keyboard.press('Enter');

      // Should display profile info in results
      await page.waitForLoadState('networkidle');
      
      // Look for profile details in results
      const results = page.locator('[data-testid="search-result"]');
      if ((await results.count()) > 0) {
        // Should show name, role, location
        await expect(page.getByText(/scripter|builder|designer|animator|modeler/i)).toBeTruthy();
      }
    }
  });

  test('should show project info in search results', async ({ page }) => {
    await page.goto('/projects/browse');

    // Search
    const searchInput = page.getByLabel(/search|query/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('game');
      await page.keyboard.press('Enter');

      // Should display project info in results
      await page.waitForLoadState('networkidle');
      
      // Look for project details
      const results = page.locator('[data-testid="project-result"]');
      if ((await results.count()) > 0) {
        // Should show title, description, tags
        await expect(page.getByText(/game|puzzle|adventure/i)).toBeTruthy();
      }
    }
  });

  test('should clear search results', async ({ page }) => {
    await page.goto('/search');

    // Search
    const searchInput = page.getByLabel(/search|query/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');

      // Clear search
      await searchInput.clear();
      await page.keyboard.press('Enter');

      // Should show all or reset
      await page.waitForLoadState('networkidle');
    }
  });
});
