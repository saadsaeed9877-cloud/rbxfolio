# Contributing to RbxFolio Design System

## Before You Start

**READ THIS FIRST:** Before adding any new UI element to the codebase, check if it already exists in `packages/design-system/`.

- ❌ **DO NOT** create custom styles in feature files
- ❌ **DO NOT** duplicate components
- ✅ **DO** use existing design-system elements
- ✅ **DO** extend design-system if needed element doesn't exist

---

## Adding a New Element

### For Design Tokens (Colors, Spacing, Typography, etc.)

#### 1. Add to Appropriate File

```typescript
// packages/design-system/src/colors/palette.ts
// or
// packages/design-system/src/spacing/spacing.ts
// etc.

export const NEW_TOKEN = {
  // definition
};
```

#### 2. Create or Update README.md

```markdown
# New Token

## Description
What is this token used for?

## Values
List all values/variants

## Usage
```typescript
import { NEW_TOKEN } from "@rbxfolio/design-system";
// Usage example
```

## Examples
Show 2-3 practical examples
```

#### 3. Export from Index

```typescript
// packages/design-system/src/index.ts
export * from "./your-folder/your-file";
```

#### 4. Add Tests

```typescript
// packages/design-system/src/__tests__/newToken.test.ts
import { NEW_TOKEN } from "../";

describe("NEW_TOKEN", () => {
  it("should have all required properties", () => {
    expect(NEW_TOKEN).toBeDefined();
    // Add assertions
  });
});
```

### For Components

#### 1. Create Component Folder

```
packages/design-system/src/components/NewComponent/
├── NewComponent.tsx
├── NewComponent.variants.ts
├── NewComponent.test.ts
└── README.md
```

#### 2. Create Component File

```typescript
// NewComponent.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const newComponentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        sm: "small-styles",
        md: "medium-styles",
        lg: "large-styles",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface NewComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof newComponentVariants> {
  // Add props
}

export function NewComponent({
  className,
  variant,
  size,
  ...props
}: NewComponentProps) {
  return (
    <div
      className={cn(newComponentVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

#### 3. Create README.md

```markdown
# NewComponent

## Overview
Brief description of what this component does.

## Installation
```typescript
import { NewComponent } from "@rbxfolio/design-system";
```

## Usage
```typescript
<NewComponent variant="default" size="md">
  Content
</NewComponent>
```

## Variants

### Variant: variant
- `default` - Default style (used when no variant specified)
- `secondary` - Secondary style

### Size: size
- `sm` - Small (32px)
- `md` - Medium (40px) **default**
- `lg` - Large (48px)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'secondary' | 'default' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Component size |
| className | string | undefined | Additional CSS classes |

## Examples

### Basic
```typescript
<NewComponent>Default content</NewComponent>
```

### With Variant
```typescript
<NewComponent variant="secondary" size="lg">
  Large secondary component
</NewComponent>
```

### Inside Other Components
```typescript
import { Card } from "@rbxfolio/design-system";

<Card>
  <NewComponent>Inside card</NewComponent>
</Card>
```

## Accessibility
- [ ] Keyboard navigation support
- [ ] ARIA labels where needed
- [ ] Screen reader support
- [ ] Color contrast >= 4.5:1

## Testing
All components must have unit tests.

```typescript
import { render } from "@testing-library/react";
import { NewComponent } from "./NewComponent";

describe("NewComponent", () => {
  it("renders with default props", () => {
    const { getByText } = render(
      <NewComponent>Test</NewComponent>
    );
    expect(getByText("Test")).toBeInTheDocument();
  });
});
```
```

#### 4. Add Tests

```typescript
// NewComponent.test.ts
import { render } from "@testing-library/react";
import { NewComponent } from "./NewComponent";

describe("NewComponent", () => {
  it("renders correctly", () => {
    const { container } = render(<NewComponent />);
    expect(container).toBeInTheDocument();
  });

  it("applies variant class", () => {
    const { container } = render(
      <NewComponent variant="secondary" />
    );
    // Assert variant applied
  });

  it("applies size class", () => {
    const { container } = render(<NewComponent size="lg" />);
    // Assert size applied
  });
});
```

#### 5. Export from Index

```typescript
// packages/design-system/src/index.ts
export { NewComponent, type NewComponentProps } from "./components/NewComponent/NewComponent";
```

#### 6. Add to Main README

Update `packages/design-system/README.md` with new component in the components list.

---

## PR Checklist

Before submitting a PR to design-system, verify:

- [ ] Element placed in correct folder structure
- [ ] All variants/options documented in README.md
- [ ] README includes multiple usage examples
- [ ] README includes props table
- [ ] README includes accessibility notes (for components)
- [ ] Unit tests added and passing
- [ ] Types exported correctly
- [ ] Exported from main `src/index.ts`
- [ ] No breaking changes to existing exports
- [ ] Follows naming conventions (PascalCase for components, UPPER_SNAKE_CASE for tokens)
- [ ] No inline styles (uses CVA or external styles)
- [ ] Tailwind config updated if needed

---

## Using New Design System Elements in Features

Once a design-system PR is merged, using it in feature code:

### ✅ Correct Usage

```typescript
// Feature file using new design-system element
import { NewComponent, COLORS } from "@rbxfolio/design-system";

export function MyFeature() {
  return (
    <div>
      <NewComponent variant="default">
        My feature using design system
      </NewComponent>
    </div>
  );
}
```

### ❌ Wrong Usage

```typescript
// ❌ WRONG - creating custom component instead of using design-system
function MyFeature() {
  return (
    <div style={{ background: "#00ff4c", padding: "16px" }}>
      Custom styles
    </div>
  );
}
```

---

## Design System Phases

Work is organized in phases. Contribute to the current phase or future phases as directed.

### Current Phase: Phase 1 - Typography

Focus: Font sizes, weights, text variants

Contributing to Phase 1:
- [ ] Add new font size if missing
- [ ] Add new text variant if missing
- [ ] Improve typography documentation
- [ ] Add typography tests

### Future Phases

#### Phase 2: Colors
- Add color to palette
- Define semantic colors
- Document color usage

#### Phase 3: Spacing & Layout
- Add spacing value
- Define breakpoints
- Create layout utilities

#### Phase 4: Components
- Button variants
- Card variants
- Input variants
- Forms & validation
- Dropdowns/Selects
- Dialogs
- Badges & Avatars

#### Phase 5: Custom Components
- Refactor existing components to use design-system
- DeveloperCard, ProjectCard, Header, Footer

---

## Design Decisions

When adding new elements, consider:

1. **Consistency:** Does this fit with existing patterns?
2. **Reusability:** Will this be used in multiple places?
3. **Simplicity:** Can this be simplified?
4. **Documentation:** Is this clear to other developers?
5. **Accessibility:** Does this follow WCAG guidelines?
6. **Performance:** Is this optimized?

---

## Common Patterns

### Adding a New Variant to Existing Component

```typescript
// ✅ CORRECT - extend variants
const buttonVariants = cva("base", {
  variants: {
    variant: {
      default: "...",
      secondary: "...",
      tertiary: "...", // ← NEW VARIANT
    },
  },
});

// ✅ Update README.md with new variant
// ✅ Add test for new variant
// ✅ Update CHANGELOG.md
```

### Adding a New Size to Component

```typescript
// ✅ CORRECT - extend sizes
const buttonVariants = cva("base", {
  variants: {
    size: {
      sm: "...",
      md: "...",
      lg: "...",
      xl: "...", // ← NEW SIZE
    },
  },
});
```

---

## Review Process

1. **Self-review:** Check your own PR before submitting
2. **Design System Lead Review:** Verify consistency with existing patterns
3. **Code Review:** Check for bugs and best practices
4. **Testing:** Verify all tests pass
5. **Documentation:** Verify README and examples are clear
6. **Merge:** Once approved, PR is merged

---

## Questions?

- Check existing READMEs in component folders
- Ask in #design-system Slack channel
- Review similar components for patterns

---

## Timeline

- **Week 1-2:** Phase 1 (Typography) - 5 PRs expected
- **Week 3-4:** Phase 2 (Colors) - 3 PRs expected
- **Week 5-6:** Phase 3 (Spacing) - 2 PRs expected
- **Week 7-12:** Phase 4 (Components) - 15-20 PRs expected
- **Week 13-14:** Phase 5 (Refactoring) - 10-15 PRs expected

---

**Remember:** The design system is the foundation of RbxFolio's UI consistency. Take care in what you add, and help maintain quality standards!
