# Form Components

All form inputs in RbxFolio are built from these standardized components. They ensure consistent validation, error handling, and accessibility across the application.

## Components

### Input

Text input field with label, error, and hint support.

```tsx
import { Input } from "@rbxfolio/design-system";

export function MyForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");

  return (
    <Input
      label="Email"
      type="email"
      placeholder="you@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={error}
      hint="We'll never share your email"
      required
    />
  );
}
```

**Props:**
- `label?: string` - Field label text
- `error?: string` - Error message (shows in red)
- `hint?: string` - Helpful text below input
- `required?: boolean` - Shows asterisk indicator
- All standard `HTMLInputElement` attributes

### Textarea

Multi-line text input with optional character counter.

```tsx
import { Textarea } from "@rbxfolio/design-system";

export function DescriptionForm() {
  const [bio, setBio] = React.useState("");

  return (
    <Textarea
      label="Bio"
      placeholder="Tell us about yourself..."
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      maxLength={500}
      showCharCount
      required
    />
  );
}
```

**Props:**
- `label?: string` - Field label text
- `error?: string` - Error message
- `hint?: string` - Helpful text
- `required?: boolean` - Shows asterisk indicator
- `showCharCount?: boolean` - Display char counter
- All standard `HTMLTextAreaElement` attributes

### Select

Dropdown/select input for choosing from predefined options.

```tsx
import { Select } from "@rbxfolio/design-system";

export function RoleSelector() {
  const [role, setRole] = React.useState("");

  return (
    <Select
      label="Primary Role"
      options={[
        { value: "scripter", label: "Scripter" },
        { value: "builder", label: "Builder" },
        { value: "designer", label: "Game Designer" },
      ]}
      value={role}
      onChange={(e) => setRole(e.target.value)}
      placeholder="Choose your role..."
      required
    />
  );
}
```

**Props:**
- `label?: string` - Field label text
- `options: Option[]` - Array of `{ value, label, disabled? }`
- `error?: string` - Error message
- `hint?: string` - Helpful text
- `required?: boolean` - Shows asterisk indicator
- `placeholder?: string` - Initial placeholder text
- All standard `HTMLSelectElement` attributes

### Checkbox

Boolean checkbox with optional description.

```tsx
import { Checkbox } from "@rbxfolio/design-system";

export function TermsCheckbox() {
  const [agreed, setAgreed] = React.useState(false);

  return (
    <Checkbox
      label="I agree to the terms"
      description="You accept our terms and conditions"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
    />
  );
}
```

**Props:**
- `label?: string` - Checkbox label text
- `description?: string` - Optional description below label
- All standard `HTMLInputElement` attributes (type is always "checkbox")

### Toggle

Switch/toggle component for boolean states.

```tsx
import { Toggle } from "@rbxfolio/design-system";

export function PublicProfileToggle() {
  const [isPublic, setIsPublic] = React.useState(true);

  return (
    <Toggle
      label="Public Profile"
      description="Make your profile visible to other users"
      checked={isPublic}
      onChange={(e) => setIsPublic(e.target.checked)}
    />
  );
}
```

**Props:**
- `label?: string` - Toggle label text
- `description?: string` - Optional description
- All standard `HTMLInputElement` attributes

### FileUpload

File upload field with drag-and-drop support.

```tsx
import { FileUpload } from "@rbxfolio/design-system";

export function AvatarUpload() {
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const [error, setError] = React.useState("");

  const handleUpload = (file: File) => {
    if (file.size > 5242880) { // 5MB
      setError("File must be less than 5MB");
      return;
    }
    setAvatar(file);
  };

  return (
    <FileUpload
      label="Avatar"
      accept="image/*"
      maxSize={5242880}
      helpText="JPG, PNG, or WebP up to 5MB"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
      }}
      error={error}
      required
    />
  );
}
```

**Props:**
- `label?: string` - Field label text
- `error?: string` - Error message
- `hint?: string` - Helpful text
- `required?: boolean` - Shows asterisk indicator
- `helpText?: string` - File format/size guidance
- `accept?: string` - MIME type filter (e.g., "image/*")
- `maxSize?: number` - Maximum file size in bytes
- All standard `HTMLInputElement` attributes (type is always "file")

## Usage Patterns

### Form with React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea, Select } from "@rbxfolio/design-system";
import { z } from "zod";

const schema = z.object({
  displayName: z.string().min(2).max(50),
  bio: z.string().max(2000),
  role: z.enum(["scripter", "builder", "designer"]),
});

type FormData = z.infer<typeof schema>;

export function ProfileForm() {
  const { register, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form>
      <Input
        {...register("displayName")}
        label="Display Name"
        placeholder="John Doe"
        error={errors.displayName?.message}
        required
      />

      <Textarea
        {...register("bio")}
        label="Bio"
        placeholder="Tell us about yourself..."
        error={errors.bio?.message}
        maxLength={2000}
        showCharCount
      />

      <Select
        {...register("role")}
        label="Primary Role"
        options={[
          { value: "scripter", label: "Scripter" },
          { value: "builder", label: "Builder" },
          { value: "designer", label: "Game Designer" },
        ]}
        error={errors.role?.message}
        placeholder="Choose one..."
        required
      />
    </form>
  );
}
```

### Controlled vs Uncontrolled

All components work as both controlled and uncontrolled inputs:

```tsx
// Controlled
const [value, setValue] = React.useState("");
<Input value={value} onChange={(e) => setValue(e.target.value)} />

// Uncontrolled with ref
const inputRef = React.useRef<HTMLInputElement>(null);
<Input ref={inputRef} defaultValue="initial" />
```

### Validation

Combine form components with validation libraries:

```tsx
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  bio: z.string().min(10).max(2000),
});

// Display errors from validation
<Input
  label="Email"
  error={errors.email}
  placeholder="you@example.com"
/>
```

## Styling

All components use Tailwind CSS for styling. They follow these principles:

- **Consistent spacing**: Use design-system spacing scale
- **Color scheme**: Gray for borders, blue for active/focus, red for errors
- **Typography**: Uses design-system text variants for labels
- **Accessibility**: ARIA labels, descriptions, and semantic HTML

## Accessibility

All form components follow WCAG 2.1 AA standards:

- ✅ Proper `<label>` associations with `htmlFor`
- ✅ ARIA labels and descriptions
- ✅ Focus indicators and states
- ✅ Keyboard navigation support
- ✅ Error announcements
- ✅ Semantic HTML structure

## Testing

Example tests using React Testing Library:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@rbxfolio/design-system";

test("Input displays error message", () => {
  render(
    <Input
      label="Email"
      error="Invalid email"
      placeholder="you@example.com"
    />
  );

  expect(screen.getByText("Invalid email")).toBeInTheDocument();
});

test("Input accepts user input", async () => {
  const user = userEvent.setup();
  const { getByPlaceholderText } = render(
    <Input placeholder="Enter text" />
  );

  const input = getByPlaceholderText("Enter text");
  await user.type(input, "hello");

  expect(input).toHaveValue("hello");
});
```

## Migration Guide

If migrating from custom form components:

1. Replace custom inputs with `@rbxfolio/design-system` imports
2. Update prop names to match component API
3. Remove inline error/label styling (now built-in)
4. Verify ARIA labels are preserved

Example:

```tsx
// Before
<div className="form-group">
  <label className="form-label">{label}</label>
  <input className="form-input" {...props} />
  {error && <span className="form-error">{error}</span>}
</div>

// After
import { Input } from "@rbxfolio/design-system";

<Input label={label} error={error} {...props} />
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android latest

## Related

- See `typography/README.md` for text component documentation
- See `DESIGN_SYSTEM_GUIDE.md` for overall design system principles
- See `apps/web/src/pages` for usage examples in real pages
