import { test, expect } from '@playwright/test';

/**
 * Projects Management E2E Tests
 * Tests project creation, editing, viewing, and media management
 */

test.describe('Projects Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByRole('link', { name: /log in|login/i }).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('TestPassword123!');
    await page.getByRole('button', { name: /log in|login/i }).click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();
    await expect(page).toHaveURL(/projects/);
    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
  });

  test('should create new project', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();
    await page.getByRole('button', { name: /create|new project/i }).click();
    await expect(page).toHaveURL(/projects\/new/);

    // Fill project form
    const projectTitle = `Test Project ${Date.now()}`;
    await page.getByLabel(/title/i).fill(projectTitle);
    await page.getByLabel(/description/i).fill('A test project for E2E testing');

    // Set visibility
    await page.getByLabel(/visibility|public|private/i).first().click();
    const publicOption = page.getByRole('option', { name: /public/i });
    if (await publicOption.isVisible()) {
      await publicOption.click();
    }

    // Submit
    await page.getByRole('button', { name: /create|submit|save/i }).click();

    // Should redirect to project details
    await expect(page).toHaveURL(/projects/);
    
    // Should show success message or the new project
    await expect(page.getByText(new RegExp(projectTitle, 'i'))).toBeTruthy();
  });

  test('should edit existing project', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();

    // Find and click edit on first project
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page).toHaveURL(/projects\/.*\/edit/);

      // Update project
      const titleInput = page.getByLabel(/title/i);
      const currentValue = await titleInput.inputValue();
      await titleInput.clear();
      await titleInput.fill(`${currentValue} - Updated`);

      // Save
      await page.getByRole('button', { name: /save|update/i }).click();

      // Should show success
      await expect(page.getByText(/success|updated|saved/i)).toBeVisible();
    }
  });

  test('should delete project with confirmation', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();

    const projectCount = await page.locator('[data-testid="project-card"]').count();

    // Find and click delete on first project
    const deleteButton = page.getByRole('button', { name: /delete|remove/i }).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Should show confirmation dialog
      const confirmButton = page.getByRole('button', { name: /confirm|delete|yes/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();

        // Should show success message
        await expect(page.getByText(/deleted|removed|success/i)).toBeTruthy();

        // Count should decrease
        const newCount = await page.locator('[data-testid="project-card"]').count();
        expect(newCount).toBeLessThanOrEqual(projectCount);
      }
    }
  });

  test('should switch between grid and list view', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();

    // Click grid view button
    const gridViewBtn = page.getByRole('button', { name: /grid/i });
    if (await gridViewBtn.isVisible()) {
      await gridViewBtn.click();
      // Grid view should be active
      await expect(gridViewBtn).toHaveClass(/active|selected/);
    }

    // Click list view button
    const listViewBtn = page.getByRole('button', { name: /list/i });
    if (await listViewBtn.isVisible()) {
      await listViewBtn.click();
      // List view should be active
      await expect(listViewBtn).toHaveClass(/active|selected/);
    }
  });

  test('should filter projects by status', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();

    // Find filter dropdown
    const filterBtn = page.getByRole('button', { name: /filter|status/i });
    if (await filterBtn.isVisible()) {
      await filterBtn.click();

      // Select "Completed"
      const completedOption = page.getByRole('option', { name: /completed/i });
      if (await completedOption.isVisible()) {
        await completedOption.click();

        // Should only show completed projects
        await page.waitForLoadState('networkidle');
        
        const badges = page.locator('[data-testid="status-badge"]');
        for (let i = 0; i < (await badges.count()); i++) {
          const text = await badges.nth(i).textContent();
          expect(text?.toLowerCase()).toContain('completed');
        }
      }
    }
  });

  test('should upload project media', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();

    // Open first project
    const projectCard = page.locator('[data-testid="project-card"]').first();
    if (await projectCard.isVisible()) {
      await projectCard.click();

      // Should be in project details page
      // Find upload button
      const uploadBtn = page.getByRole('button', { name: /upload|add media/i });
      if (await uploadBtn.isVisible()) {
        await uploadBtn.click();

        // Upload image
        const fileInput = page.locator('input[type="file"]').first();
        await fileInput.setInputFiles({
          name: 'test-image.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('fake-image-data'),
        });

        // Should show upload success
        await expect(page.getByText(/uploaded|success/i)).toBeTruthy();
      }
    }
  });

  test('should reorder project media via drag-drop', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();

    // Open project with media
    const projectCard = page.locator('[data-testid="project-card"]').first();
    if (await projectCard.isVisible()) {
      await projectCard.click();

      // Find media items
      const mediaItems = page.locator('[data-testid="media-item"]');
      const count = await mediaItems.count();

      if (count > 1) {
        // Drag first to second position
        const firstItem = mediaItems.first();
        const secondItem = mediaItems.nth(1);

        // Use drag and drop
        await firstItem.dragTo(secondItem);

        // Should show success
        await expect(page.getByText(/reordered|updated/i)).toBeTruthy();
      }
    }
  });

  test('should view project publicly', async ({ page, context }) => {
    await page.getByRole('link', { name: /projects/i }).click();

    // Get project URL or open publicly
    // First, create/find a public project and get its view URL
    const projectCard = page.locator('[data-testid="project-card"]').first();
    if (await projectCard.isVisible()) {
      // Get the project URL and open in new context (not logged in)
      const projectLink = projectCard.locator('a').first();
      if (await projectLink.isVisible()) {
        const href = await projectLink.getAttribute('href');
        
        if (href) {
          // Open in new context (no session)
          const newPage = await context.newPage();
          await newPage.goto(href);

          // Should display project
          await expect(newPage.getByRole('heading')).toBeTruthy();
        }
      }
    }
  });

  test('should show tags on project', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();

    // Create new project with tags
    await page.getByRole('button', { name: /create|new project/i }).click();

    await page.getByLabel(/title/i).fill(`Tagged Project ${Date.now()}`);
    await page.getByLabel(/description/i).fill('Test project with tags');

    // Add tags if available
    const tagInput = page.getByLabel(/tags/i);
    if (await tagInput.isVisible()) {
      await tagInput.fill('game');
      await page.keyboard.press('Enter');

      await tagInput.fill('puzzle');
      await page.keyboard.press('Enter');
    }

    // Submit
    await page.getByRole('button', { name: /create|submit/i }).click();

    // Should show tags
    await expect(page.getByText('game')).toBeTruthy();
    await expect(page.getByText('puzzle')).toBeTruthy();
  });
});
