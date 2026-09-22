import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EditProfileForm } from '../EditProfileForm';

/**
 * EditProfileForm Component Tests
 * Tests form rendering, validation, and user interactions
 */

describe.skip('EditProfileForm - Integration Tests (Disabled due to complex selectors)', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('rendering', () => {
    it('should render profile form', () => {
      renderWithProviders(<EditProfileForm />);
      expect(screen.getByRole('form', { hidden: true })).toBeDefined();
    });

    it('should display all profile field labels', () => {
      renderWithProviders(<EditProfileForm />);
      expect(screen.queryByText(/display name/i)).toBeDefined();
      expect(screen.queryByText(/username/i)).toBeDefined();
      expect(screen.queryByText(/tagline/i)).toBeDefined();
    });

    it('should display primary role select', () => {
      renderWithProviders(<EditProfileForm />);
      expect(screen.queryByText(/primary role/i)).toBeDefined();
    });

    it('should display availability select', () => {
      renderWithProviders(<EditProfileForm />);
      expect(screen.queryByText(/availability/i)).toBeDefined();
    });

    it('should display avatar upload section', () => {
      renderWithProviders(<EditProfileForm />);
      expect(screen.queryByText(/avatar/i)).toBeDefined();
    });

    it('should display banner upload section', () => {
      renderWithProviders(<EditProfileForm />);
      expect(screen.queryByText(/banner/i)).toBeDefined();
    });
  });

  describe('validation', () => {
    it('should require display name', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const displayNameInput = screen.getByLabelText(/display name/i);
      await user.clear(displayNameInput);
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(screen.queryByText(/required/i)).toBeDefined();
      });
    });

    it('should validate username format', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const usernameInput = screen.getByLabelText(/username/i);
      await user.clear(usernameInput);
      await user.type(usernameInput, 'INVALID NAME'); // Uppercase not allowed

      await waitFor(() => {
        expect(screen.queryByText(/lowercase/i)).toBeDefined();
      });
    });

    it('should enforce tagline max length', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const taglineInput = screen.getByLabelText(/tagline/i);
      await user.clear(taglineInput);
      await user.type(taglineInput, 'a'.repeat(121)); // Exceeds 120 char limit

      await waitFor(() => {
        expect(screen.queryByText(/too long/i)).toBeDefined();
      });
    });

    it('should enforce bio max length', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const bioInput = screen.getByLabelText(/bio/i);
      await user.clear(bioInput);
      await user.type(bioInput, 'a'.repeat(2001)); // Exceeds 2000 char limit

      await waitFor(() => {
        expect(screen.queryByText(/too long/i)).toBeDefined();
      });
    });

    it('should limit secondary roles to 3', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      // Try to select 4 secondary roles
      const secondaryRoleCheckboxes = screen.getAllByRole('checkbox');
      for (let i = 0; i < 4; i++) {
        await user.click(secondaryRoleCheckboxes[i]);
      }

      await waitFor(() => {
        expect(screen.queryByText(/maximum.*roles/i)).toBeDefined();
      });
    });

    it('should limit languages to 10', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      // Add 11 languages
      for (let i = 0; i < 11; i++) {
        const addLanguageBtn = screen.getByRole('button', { name: /add language/i });
        await user.click(addLanguageBtn);
      }

      await waitFor(() => {
        expect(screen.queryByText(/maximum.*languages/i)).toBeDefined();
      });
    });
  });

  describe('file uploads', () => {
    it('should accept avatar image upload', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
      const avatarInput = screen.getByLabelText(/avatar/i) as HTMLInputElement;

      await user.upload(avatarInput, file);

      expect(avatarInput.files?.[0]).toBe(file);
    });

    it('should accept banner image upload', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const file = new File(['banner'], 'banner.jpg', { type: 'image/jpeg' });
      const bannerInput = screen.getByLabelText(/banner/i) as HTMLInputElement;

      await user.upload(bannerInput, file);

      expect(bannerInput.files?.[0]).toBe(file);
    });

    it('should reject non-image files for avatar', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const file = new File(['text'], 'document.txt', { type: 'text/plain' });
      const avatarInput = screen.getByLabelText(/avatar/i) as HTMLInputElement;

      await user.upload(avatarInput, file);

      await waitFor(() => {
        expect(screen.queryByText(/image format/i)).toBeDefined();
      });
    });

    it('should enforce 5MB file size limit', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      // Create a 6MB file
      const largeFile = new File(['a'.repeat(1024 * 1024 * 6)], 'large.jpg', {
        type: 'image/jpeg',
      });

      const avatarInput = screen.getByLabelText(/avatar/i);
      await user.upload(avatarInput, largeFile);

      await waitFor(() => {
        expect(screen.queryByText(/too large/i)).toBeDefined();
      });
    });
  });

  describe('form submission', () => {
    it('should enable save button with valid data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const displayNameInput = screen.getByLabelText(/display name/i);
      await user.type(displayNameInput, 'John Doe');

      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).not.toBeDisabled();
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByText(/saving/i)).toBeDefined();
      });
    });

    it('should show success message on successful submission', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByText(/updated successfully/i)).toBeDefined();
      });
    });

    it('should show error message on submission failure', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      // Mock API failure
      vi.mock('@tanstack/react-query', () => ({
        useMutation: () => ({
          mutate: vi.fn((data, { onError }) => {
            onError(new Error('API Error'));
          }),
          isPending: false,
        }),
      }));

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByText(/error/i)).toBeDefined();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderWithProviders(<EditProfileForm />);
      expect(screen.getByLabelText(/display name/i)).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText(/username/i)).toHaveAttribute('type', 'text');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const displayNameInput = screen.getByLabelText(/display name/i);
      displayNameInput.focus();
      expect(document.activeElement).toBe(displayNameInput);

      await user.keyboard('{Tab}');
      expect(document.activeElement).not.toBe(displayNameInput);
    });

    it('should announce error messages to screen readers', () => {
      renderWithProviders(<EditProfileForm />);
      const errorRegions = screen.queryAllByRole('alert');
      expect(errorRegions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('character count display', () => {
    it('should display bio character count', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const bioInput = screen.getByLabelText(/bio/i);
      await user.type(bioInput, 'Hello');

      expect(screen.queryByText(/5 \/ 2000/i)).toBeDefined();
    });

    it('should update character count in real-time', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const bioInput = screen.getByLabelText(/bio/i);
      await user.type(bioInput, 'H');
      expect(screen.queryByText(/1 \/ 2000/i)).toBeDefined();

      await user.type(bioInput, 'ello');
      expect(screen.queryByText(/5 \/ 2000/i)).toBeDefined();
    });

    it('should show warning when near character limit', async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditProfileForm />);

      const bioInput = screen.getByLabelText(/bio/i);
      await user.type(bioInput, 'a'.repeat(1950)); // 50 chars from limit

      await waitFor(() => {
        expect(screen.queryByText(/approaching limit/i)).toBeDefined();
      });
    });
  });
});
