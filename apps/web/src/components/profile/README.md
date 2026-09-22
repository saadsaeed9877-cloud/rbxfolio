# Profile Components

Components for managing user profile information and display.

## Components

### EditProfileForm

The main form for editing all profile information. Provides a comprehensive UI for updating:

- **Basic Information**: Display name, username, tagline, bio, location
- **Professional Info**: Primary role, secondary roles, experience level, availability
- **Social Links**: Roblox, GitHub, Discord, YouTube, X, personal website
- **Media**: Avatar and banner image uploads
- **Preferences**: Preferred contact method

#### Usage

```tsx
import { EditProfileForm } from "@/components/profile/EditProfileForm";

export function ProfilePage() {
  return (
    <EditProfileForm
      onSuccess={() => {
        console.log("Profile updated!");
      }}
    />
  );
}
```

#### Props

- `onSuccess?: () => void` - Callback fired after successful profile update

#### Features

- **Form Validation**: Zod schema validation on all fields
- **Image Upload**: Direct avatar and banner uploads with preview
- **Real-time Preview**: Shows avatar and banner images as they're uploaded
- **Error Handling**: Clear error messages for failed submissions
- **Loading States**: Indicates when uploads or saves are in progress
- **Field Groups**: Organized into collapsible sections for clarity
- **Accessibility**: Full WCAG 2.1 AA compliance with ARIA labels

#### Form Fields

**Basic Information**
- Display Name: 2-50 characters, required
- Username: 3-30 characters, lowercase alphanumeric + _ or -, required
- Tagline: Up to 120 characters, optional
- Bio: Up to 2000 characters, optional, shows character count
- Location: Up to 100 characters, optional

**Professional Info**
- Primary Role: 6 roles available (Builder, Scripter, UI Designer, Animator, Modeler, VFX Artist)
- Secondary Roles: Up to 3 additional roles
- Experience Level: 4 levels (Beginner, Intermediate, Advanced, Professional)
- Availability: Open for work, Busy, or Unavailable

**Social Links**
- Roblox: URL or username
- GitHub: GitHub profile URL
- Discord: Discord username or tag
- YouTube: YouTube channel URL
- X: Twitter/X profile URL
- Website: Personal website URL

**Media**
- Avatar: JPG, PNG, or WebP, max 5MB
- Banner: JPG, PNG, or WebP, max 5MB

#### API Integration

The form integrates with these API endpoints:

```
GET /api/v1/users/me/profile          - Load current profile data
PATCH /api/v1/users/me/profile        - Update profile fields
POST /api/v1/users/me/avatar          - Upload avatar image
POST /api/v1/users/me/banner          - Upload banner image
```

#### Example: Advanced Usage

```tsx
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { useQueryClient } from "@tanstack/react-query";

export function SettingsPage() {
  const queryClient = useQueryClient();

  return (
    <EditProfileForm
      onSuccess={() => {
        // Invalidate and refetch profile data
        queryClient.invalidateQueries({ queryKey: ["profile"] });

        // Show success notification
        showNotification("Profile updated successfully!");

        // Optionally redirect
        // router.push("/dashboard");
      }}
    />
  );
}
```

## Design System Integration

All form components use elements from `@rbxfolio/design-system`:

- **Typography**: Heading2, Paragraph, Caption from text system
- **Form Inputs**: Input, Textarea, Select, Checkbox, FileUpload components
- **Styling**: Tailwind CSS with design-system color scheme

## Testing

The form includes comprehensive tests covering:

- Form rendering and layout
- Field validation
- Form submission (success and error cases)
- File uploads (avatar and banner)
- Success/error messaging
- Reset functionality

Run tests with:

```bash
pnpm test EditProfileForm
```

## Accessibility

The form meets WCAG 2.1 AA standards:

- ✅ All form fields have proper `<label>` associations
- ✅ Required fields marked with asterisks and semantic indicators
- ✅ Error messages linked with `aria-describedby`
- ✅ Hint text properly associated
- ✅ Keyboard navigation fully supported
- ✅ Focus indicators visible on all interactive elements
- ✅ Screen reader compatible

## Performance

- Query caching with React Query for profile data
- Debounced validation on blur
- Optimistic UI updates for file uploads
- Minimal re-renders using React Hook Form

## Security

- Form data validated server-side with Zod
- File uploads validated for type and size
- CORS-safe file upload handling
- All API endpoints require authentication

## Future Enhancements

- [ ] Language tags input component (add/remove tags)
- [ ] Secondary roles multi-select with drag-and-drop ordering
- [ ] Social link validation with URL preview
- [ ] Profile completeness indicator
- [ ] Avatar cropping tool
- [ ] Banner image positioning control
- [ ] Undo/revert recent changes

## Related Components

- `@rbxfolio/design-system/forms` - Form input components
- `ProfileCard` - Display profile information (read-only)
- `DeveloperCard` - Public profile card for browsing

## Troubleshooting

**Images not uploading?**
- Check file size (max 5MB)
- Check file type (JPG, PNG, WebP only)
- Verify API endpoint responds with correct CORS headers

**Form validation errors?**
- Check all required fields are filled
- Verify username uses only lowercase alphanumeric + `-` or `_`
- Ensure bio and tagline are under character limits

**Changes not saving?**
- Verify session is active (`useSession()` should return user data)
- Check network tab for API errors
- Verify API endpoint is returning success response
