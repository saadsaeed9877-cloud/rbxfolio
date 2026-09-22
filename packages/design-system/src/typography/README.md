# Typography System

**Part of RbxFolio Design System Phase 1**

Complete typography system providing consistent font sizes, weights, line heights, and text variants across the application.

> **CRITICAL RULE:** All text styling MUST use these definitions. Do NOT create custom font sizes, weights, or families outside this system.

---

## Quick Start

### Using Text Variants (Recommended)

```typescript
import { TextVariants } from "@rbxfolio/design-system";

<h1 style={TextVariants.headingMd}>Page Title</h1>
<p style={TextVariants.bodyMd}>Regular paragraph text</p>
<span style={TextVariants.captionSm}>Small caption</span>
```

### Using Text Component (Best)

```typescript
import { Text, Heading3, Paragraph, Caption } from "@rbxfolio/design-system";

// Flexible component
<Text variant="headingMd" as="h1">Page Title</Text>

// Semantic shortcuts
<Heading3>Section Title</Heading3>
<Paragraph>Regular text content</Paragraph>
<Caption>Small secondary text</Caption>
```

---

## Approved Text Variants

### Display Variants

Use for hero sections, landing pages, and maximum impact areas.

| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| `displayXL` | 48px | 900 (black) | Hero titles, main banner text |
| `displayLg` | 36px | 700 (bold) | Large display headings |

**Example:**
```typescript
<h1 style={TextVariants.displayXL}>
  Showcase Your Roblox Creations
</h1>
```

### Heading Variants

Use for page titles, section headings, and content structure.

| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| `headingXl` | 30px | 700 (bold) | Page titles, main headings |
| `headingLg` | 24px | 700 (bold) | Section titles |
| `headingMd` | 20px | 700 (bold) | Subsection titles |
| `headingSm` | 18px | 600 (semibold) | Component titles, card headers |

**Example:**
```typescript
<Text as="h2" variant="headingLg">My Projects</Text>
<Text as="h3" variant="headingMd">Featured Work</Text>
```

### Body Variants

Use for main content, descriptions, and regular text.

| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| `bodyLg` | 18px | 400 (normal) | Large body text, highlighted content |
| `bodyMd` | 16px | 400 (normal) | Default body text, paragraphs |
| `bodySm` | 14px | 400 (normal) | Small body text, descriptions |

**Example:**
```typescript
<Paragraph>
  Join thousands of Roblox developers showcasing their projects.
</Paragraph>

<Text variant="bodySm">
  Optional helper text or additional description
</Text>
```

### Caption Variants

Use for labels, hints, secondary text, and metadata.

| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| `captionMd` | 12px | 500 (medium) | Labels (uppercase), form labels |
| `captionSm` | 12px | 400 (normal) | Hints, timestamps, metadata |

**Example:**
```typescript
<Label>Email Address</Label>
<Caption>Last updated 2 hours ago</Caption>
```

### Code Variant

Use for code snippets, monospace text, and technical content.

| Variant | Size | Weight | Family |
|---------|------|--------|--------|
| `code` | 14px | 400 (normal) | Monospace |

**Example:**
```typescript
<Text variant="code" as="code">
  npm install @rbxfolio/design-system
</Text>
```

---

## Font Sizes

All approved font sizes (in rem, which scales with base font size of 16px):

| Token | Size (rem) | Size (px) |
|-------|-----------|-----------|
| `xs` | 0.75 | 12 |
| `sm` | 0.875 | 14 |
| `base` | 1 | 16 |
| `lg` | 1.125 | 18 |
| `xl` | 1.25 | 20 |
| `2xl` | 1.5 | 24 |
| `3xl` | 1.875 | 30 |
| `4xl` | 2.25 | 36 |
| `5xl` | 3 | 48 |

**NEVER use arbitrary pixel values like `fontSize: "20px"`**

---

## Font Weights

All approved font weights:

| Token | Value | Usage |
|-------|-------|-------|
| `normal` | 400 | Body text, regular content |
| `medium` | 500 | Labels, emphasized text |
| `semibold` | 600 | Sub-headings, important text |
| `bold` | 700 | Headings, emphasis |
| `black` | 900 | Display text, maximum emphasis |

**NEVER use arbitrary weights like `fontWeight: 500`**

---

## Font Families

All approved font families:

| Token | Family | Usage |
|-------|--------|-------|
| `base` | System UI stack | All text content |
| `mono` | Monospace stack | Code, technical content |

Uses system fonts for optimal performance and native appearance.

**NEVER use external font imports unless approved by design team**

---

## Line Heights

Approved line height values:

| Token | Value | Usage |
|-------|-------|-------|
| `tight` | 1.2 | Headings, display text |
| `normal` | 1.5 | Labels, captions |
| `relaxed` | 1.625 | Body text, paragraphs |
| `loose` | 2 | Emphasis, spacing |

---

## Letter Spacing

Approved letter spacing values:

| Token | Value | Usage |
|-------|-------|-------|
| `tight` | -0.02em | Display text |
| `normal` | 0em | Regular text |
| `wide` | 0.02em | Labels, small caps |
| `wider` | 0.05em | Headlines, emphasis |

---

## Usage Patterns

### ✅ Correct Usage

```typescript
// Using Text component
import { Text } from "@rbxfolio/design-system";
<Text variant="headingMd">Title</Text>

// Using semantic components
import { Heading3, Paragraph } from "@rbxfolio/design-system";
<Heading3>My Section</Heading3>
<Paragraph>Content goes here</Paragraph>

// Using TextVariants
import { TextVariants } from "@rbxfolio/design-system";
<h1 style={TextVariants.displayXL}>Hero</h1>

// Using font tokens
import { FONT_SIZES, FONT_WEIGHTS } from "@rbxfolio/design-system";
<span style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold }}>
  Text
</span>
```

### ❌ Incorrect Usage

```typescript
// DO NOT hardcode font sizes
<h1 style={{ fontSize: "36px", fontWeight: 700 }}>Title</h1>

// DO NOT use arbitrary Tailwind classes
<p className="text-2xl font-bold">Paragraph</p>

// DO NOT create custom variants
<span style={{ fontSize: "24px", fontWeight: 500, lineHeight: 1.3 }}>
  Text
</span>

// DO NOT use external fonts
@import url('https://fonts.googleapis.com/css2?family=CustomFont');

// DO NOT apply styles directly to elements
<h1 className="font-black text-5xl">Title</h1>
```

---

## Component Examples

### Page Title

```typescript
import { Text } from "@rbxfolio/design-system";

export function MyPage() {
  return (
    <div>
      <Text as="h1" variant="displayXL">
        My Amazing Page
      </Text>
      <Text variant="bodySm" style={{ marginTop: "0.5rem" }}>
        A short description of what this page is about
      </Text>
    </div>
  );
}
```

### Card with Heading

```typescript
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Text, Heading3 } from "@rbxfolio/design-system";

export function MyCard() {
  return (
    <Card>
      <CardHeader>
        <Heading3>Card Title</Heading3>
      </CardHeader>
      <div className="px-6 pb-4">
        <Text variant="bodyMd">
          Card content with regular body text
        </Text>
      </div>
    </Card>
  );
}
```

### Form Input Label

```typescript
import { Label } from "@rbxfolio/design-system";
import { Input } from "@/components/ui/input";

export function EmailField() {
  return (
    <div>
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" placeholder="your@email.com" />
      <Text variant="captionSm" style={{ marginTop: "0.25rem" }}>
        We'll never share your email
      </Text>
    </div>
  );
}
```

---

## CSS Variables (Tailwind Integration)

Typography tokens are also available as CSS variables in `globals.css`:

```css
/* In your Tailwind CSS config */
--font-family-base: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-family-mono: ui-monospace, 'SFMono-Regular', monospace;
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
/* ... etc */
```

Use in Tailwind:

```typescript
<h1 className="text-[var(--font-size-5xl)] font-black">Title</h1>
```

(Not recommended - use Text component instead)

---

## Accessibility

### Semantic HTML

Always use semantic HTML elements:

```typescript
// ✅ Correct
<Text as="h1" variant="headingXl">Main Title</Text>
<Text as="h2" variant="headingLg">Section</Text>
<Paragraph>Content</Paragraph>

// ❌ Wrong
<div style={TextVariants.headingXl}>Main Title</div>
<span style={TextVariants.headingLg}>Section</span>
```

### Color Contrast

Typography sizes maintain WCAG AA color contrast ratios:
- Text at 14px+ works with 4.5:1 contrast
- Text at 18px+ works with 3:1 contrast

Always pair with sufficient color contrast from color system.

### Screen Readers

Semantic components announce correctly:
- `<Heading1>` announces as heading level 1
- `<Label>` announces as label
- `<Caption>` announces as secondary text

---

## Migration Guide

If you have existing code with custom typography:

### Before (Custom Styles)

```typescript
<h1 style={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.2 }}>
  Title
</h1>
```

### After (Design System)

```typescript
import { Heading2 } from "@rbxfolio/design-system";

<Heading2>Title</Heading2>
```

---

## Testing

All typography components include unit tests:

```typescript
import { render } from "@testing-library/react";
import { Text } from "@rbxfolio/design-system";

describe("Text Component", () => {
  it("renders with correct font size", () => {
    const { container } = render(
      <Text variant="headingMd">Test</Text>
    );
    const element = container.querySelector("span");
    expect(element).toHaveStyle({ fontSize: "1.25rem" });
  });
});
```

---

## Support

- **Questions?** See main design-system README
- **Bug?** Open GitHub issue with label `typography`
- **Change request?** Post in #design-system Slack
- **Need a new variant?** Follow CONTRIBUTING.md guide

---

## Related

- `packages/design-system/src/colors/` - Color system (Phase 2)
- `packages/design-system/src/spacing/` - Spacing system (Phase 3)
- `DESIGN_SYSTEM_GUIDE.md` - Complete design system guide
- `DESIGN_SYSTEM_CHECKLIST.md` - Before every PR
