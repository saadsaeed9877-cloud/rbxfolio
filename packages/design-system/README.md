# RbxFolio Design System

**One source of truth for all UI elements, tokens, and components.**

> ⚠️ **CRITICAL:** All UI elements in RbxFolio must be created in this folder or chosen from existing components here. Creating custom styles, colors, or components in individual feature files is strictly prohibited.

---

## Quick Links

- **Developer Guide:** `../../DESIGN_SYSTEM_GUIDE.md`
- **Quick Reference:** `../../DESIGN_SYSTEM_QUICK_REFERENCE.md`
- **Checklist:** `../../DESIGN_SYSTEM_CHECKLIST.md`
- **Contributing:** `./CONTRIBUTING.md`

---

## What is the Design System?

A centralized, shared package of:

- **Design Tokens:** Colors, typography, spacing, shadows, animations
- **Components:** Buttons, cards, inputs, forms, dialogs, etc.
- **Guidelines:** When to use what, how to extend, best practices
- **Documentation:** READMEs, examples, API docs for every element

---

## Folder Structure

```
packages/design-system/
├── src/
│   ├── index.ts                     # ⭐ Main export file - import from here!
│   │
│   ├── typography/
│   │   ├── fonts.ts                 # Font families, sizes, weights
│   │   ├── text.tsx                 # Text component wrapper
│   │   ├── README.md
│   │   └── __tests__/
│   │
│   ├── colors/                      # Phase 2
│   │   ├── palette.ts               # Color definitions
│   │   ├── semanticColors.ts        # Semantic mappings
│   │   ├── README.md
│   │   └── __tests__/
│   │
│   ├── spacing/                     # Phase 3
│   │   ├── spacing.ts               # Spacing scale
│   │   ├── breakpoints.ts           # Responsive breakpoints
│   │   ├── README.md
│   │   └── __tests__/
│   │
│   ├── components/
│   │   ├── Button/                  # Phase 4a
│   │   │   ├── Button.tsx
│   │   │   ├── Button.variants.ts
│   │   │   ├── README.md
│   │   │   └── __tests__/
│   │   ├── Card/                    # Phase 4b
│   │   ├── Input/                   # Phase 4c
│   │   ├── Form/                    # Phase 4d
│   │   ├── Dialog/                  # Phase 4e
│   │   ├── Dropdown/                # Phase 4e
│   │   ├── Badge/                   # Phase 4g
│   │   ├── Avatar/                  # Phase 4g
│   │   └── [others]/
│   │
│   ├── shadows/
│   │   ├── shadows.ts
│   │   ├── README.md
│   │   └── __tests__/
│   │
│   ├── animations/
│   │   ├── transitions.ts
│   │   ├── README.md
│   │   └── __tests__/
│   │
│   ├── icons/
│   │   ├── icons.ts
│   │   ├── README.md
│   │   └── __tests__/
│   │
│   ├── hooks/
│   │   ├── useResponsive.ts
│   │   ├── README.md
│   │   └── __tests__/
│   │
│   └── __tests__/
│       └── index.test.ts             # Integration tests
│
├── package.json
├── tsconfig.json
├── README.md                         # This file
├── CONTRIBUTING.md                  # How to add new elements
└── CHANGELOG.md                      # Version history
```

---

## Current Status: Phase 1 ✏️

**Typography System** (In Development)

### Available Now

```typescript
import { TextVariants, FONT_SIZES, FONT_WEIGHTS } from "@rbxfolio/design-system";
```

**Text Variants:**
- `displayXL` - Hero titles (48px, black)
- `displayLg` - Large headings (36px, bold)
- `headingXl` - Page titles (30px, bold)
- `headingLg` - Section titles (24px, bold)
- `headingMd` - Subsection titles (20px, bold)
- `headingSm` - Component titles (18px, semibold)
- `bodyLg` - Large body text (18px, normal)
- `bodyMd` - Regular body text (16px, normal)
- `bodySm` - Small body text (14px, normal)
- `captionMd` - Labels (12px, medium, uppercase)
- `captionSm` - Small captions (12px, normal)

**Font Sizes:** `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`

**Font Weights:** `normal`, `medium`, `semibold`, `bold`, `black`

**Usage:**
```typescript
import { TextVariants } from "@rbxfolio/design-system";

<h1 style={TextVariants.headingMd}>Page Title</h1>
<p style={TextVariants.bodyMd}>Regular text</p>
<span style={TextVariants.captionSm}>Small label</span>
```

---

## Upcoming Phases

### Phase 2: Color System 🎨

**When:** Week 3-4

**What:**
- Color palette (grays, primary, secondary, status colors)
- Semantic colors (primary, secondary, destructive, etc.)
- Color utilities and helpers

**Usage:**
```typescript
import { COLORS, SEMANTIC_COLORS } from "@rbxfolio/design-system";

<div style={{ color: SEMANTIC_COLORS.primary.base }}>Text</div>
```

### Phase 3: Spacing & Layout 📏

**When:** Week 5-6

**What:**
- Spacing scale (xs through 4xl)
- Breakpoints for responsive design
- Grid utilities

**Usage:**
```typescript
import { SPACING, BREAKPOINTS } from "@rbxfolio/design-system";

<div style={{ padding: SPACING.md, marginBottom: SPACING.lg }}>
  Content
</div>
```

### Phase 4: Components 🧩

**When:** Week 7-12

**What:**
- Phase 4a: Button (all variants)
- Phase 4b: Card (all variants)
- Phase 4c: Input (all variants)
- Phase 4d: Form & validation
- Phase 4e: Dropdown, Dialog, Select
- Phase 4g: Badge, Avatar

**Usage:**
```typescript
import { Button, Card, Input, Form } from "@rbxfolio/design-system";

<Button variant="primary" size="lg">Click</Button>
<Card variant="elevated">Content</Card>
<Input placeholder="Text" />
```

### Phase 5: Refactoring 🔄

**When:** Week 13-14

**What:**
- Refactor existing components to use design-system
- DeveloperCard, ProjectCard, Header, Footer
- Forms and validation displays

**Result:** 100% design-system compliance across entire app

---

## How to Use

### 1. Always Import from Main Index

```typescript
// ✅ CORRECT
import { Button, COLORS, TextVariants } from "@rbxfolio/design-system";

// ❌ WRONG - don't import from sub-paths
import { Button } from "@rbxfolio/design-system/src/components/Button";
```

### 2. Use Component Variants, Not Overrides

```typescript
// ✅ CORRECT
<Button variant="primary" size="lg">Click</Button>

// ❌ WRONG - no style overrides
<Button style={{ color: "red" }}>Click</Button>
<Button className="custom-style">Click</Button>
```

### 3. Use Tokens, Not Hardcoded Values

```typescript
// ✅ CORRECT
<div style={{ padding: SPACING.md, color: COLORS.primary[500] }}>
  Content
</div>

// ❌ WRONG - hardcoded values
<div style={{ padding: "16px", color: "#00ff4c" }}>
  Content
</div>
```

### 4. Reference Design System in Code Comments

```typescript
// Reference the design system in comments
import { TextVariants } from "@rbxfolio/design-system";
// See packages/design-system/src/typography/README.md

<h1 style={TextVariants.headingMd}>Title</h1>
```

---

## Adding New Elements

See `CONTRIBUTING.md` for detailed guides on adding:

- Design tokens (colors, spacing, typography, etc.)
- Components (Button, Card, Input, etc.)
- Utilities and helpers

---

## Documentation

Each element in the design system has:

1. **Implementation** - TypeScript/React code
2. **README.md** - Usage guide with examples
3. **Tests** - Unit tests in `__tests__/`
4. **Props** - Documented interfaces

Example: `packages/design-system/src/components/Button/`
```
Button/
├── Button.tsx           # Component code
├── Button.variants.ts   # Variant definitions
├── README.md            # Usage guide
└── __tests__/
    └── Button.test.ts   # Tests
```

---

## Common Tasks

### Add a New Color

1. Edit `src/colors/palette.ts`
2. Update `src/colors/README.md`
3. Add tests in `src/colors/__tests__/`
4. Update `src/index.ts` exports
5. Create PR

### Add a New Component

1. Create `src/components/NewComponent/` folder
2. Create component files
3. Create `README.md` with examples
4. Add tests
5. Update `src/index.ts` exports
6. Create PR

### Update Existing Element

1. Make changes
2. Update corresponding `README.md`
3. Update/add tests
4. Update `CHANGELOG.md`
5. Create PR

---

## Review Process

Every PR must pass:

- [ ] Element placed in correct folder
- [ ] README.md with examples
- [ ] Unit tests added
- [ ] Exported from main index
- [ ] No breaking changes
- [ ] Follows naming conventions
- [ ] Design decisions documented

---

## Questions?

- Read `DESIGN_SYSTEM_GUIDE.md` for detailed info
- Read `DESIGN_SYSTEM_QUICK_REFERENCE.md` for quick lookup
- Check existing components for examples
- Ask in #design-system Slack

---

## Enforcement

**In Code:**
- All UI elements use design-system
- No hardcoded colors, fonts, or spacing
- Components use variants only

**In Code Review:**
- Every PR checked for compliance
- Reviewer references DESIGN_SYSTEM_CHECKLIST.md
- No PR merged without compliance

**In CI/CD:**
- Linting catches violations
- Tests verify compliance
- Pre-commit hooks block violations

---

## Success Metrics

| Phase | Success Criteria |
|-------|------------------|
| 1 | All text uses typography system |
| 2 | All colors use color system |
| 3 | All spacing uses spacing system |
| 4 | All components from design-system |
| 5 | 100% design-system compliance |

---

## Timeline

- **Week 1-2:** Phase 1 (Typography)
- **Week 3-4:** Phase 2 (Colors)
- **Week 5-6:** Phase 3 (Spacing & Layout)
- **Week 7-12:** Phase 4 (Components)
- **Week 13-14:** Phase 5 (Refactoring)

---

## Key Principles

1. **DRY (Don't Repeat Yourself)** - One source of truth
2. **Consistency** - Same patterns everywhere
3. **Scalability** - Easy to add new elements
4. **Maintainability** - Global updates in one place
5. **Developer Experience** - Clear docs and examples

---

**Remember:** The design system makes YOUR life easier. Embrace it. Use it. Love it.

For detailed information, see:
- `DESIGN_SYSTEM_GUIDE.md` - Full reference
- `DESIGN_SYSTEM_QUICK_REFERENCE.md` - Quick lookup
- `CONTRIBUTING.md` - How to add elements
