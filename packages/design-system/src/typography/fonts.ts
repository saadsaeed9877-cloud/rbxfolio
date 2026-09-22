/**
 * Typography System - Font Definitions
 * 
 * CRITICAL: This is part of the unified design system.
 * All text styling MUST use these definitions.
 * DO NOT create custom font sizes, weights, or families outside this file.
 * 
 * See: packages/design-system/README.md
 */

export const FONT_FAMILIES = {
  base: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  mono: "ui-monospace, 'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
} as const;

/**
 * Font Sizes Scale
 * Based on modular scale (1.125 multiplier)
 */
export const FONT_SIZES = {
  xs: "0.75rem",      // 12px
  sm: "0.875rem",     // 14px
  base: "1rem",       // 16px
  lg: "1.125rem",     // 18px
  xl: "1.25rem",      // 20px
  "2xl": "1.5rem",    // 24px
  "3xl": "1.875rem",  // 30px
  "4xl": "2.25rem",   // 36px
  "5xl": "3rem",      // 48px
} as const;

export const FONT_WEIGHTS = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const LETTER_SPACING = {
  tight: "-0.02em",
  normal: "0em",
  wide: "0.02em",
  wider: "0.05em",
} as const;

/**
 * Text Variants - Pre-defined typography combinations
 * Use these instead of combining font size/weight manually
 */
export const TextVariants = {
  // Display Sizes - For hero sections and standout text
  displayXL: {
    fontSize: FONT_SIZES["5xl"],      // 48px
    fontWeight: FONT_WEIGHTS.black,   // 900
    lineHeight: LINE_HEIGHTS.tight,   // 1.2
    letterSpacing: LETTER_SPACING.tight,
    fontFamily: FONT_FAMILIES.base,
  },
  displayLg: {
    fontSize: FONT_SIZES["4xl"],      // 36px
    fontWeight: FONT_WEIGHTS.bold,    // 700
    lineHeight: LINE_HEIGHTS.tight,   // 1.2
    letterSpacing: LETTER_SPACING.normal,
    fontFamily: FONT_FAMILIES.base,
  },

  // Heading Sizes - For page and section titles
  headingXl: {
    fontSize: FONT_SIZES["3xl"],      // 30px
    fontWeight: FONT_WEIGHTS.bold,    // 700
    lineHeight: LINE_HEIGHTS.tight,   // 1.2
    fontFamily: FONT_FAMILIES.base,
  },
  headingLg: {
    fontSize: FONT_SIZES["2xl"],      // 24px
    fontWeight: FONT_WEIGHTS.bold,    // 700
    lineHeight: LINE_HEIGHTS.tight,   // 1.2
    fontFamily: FONT_FAMILIES.base,
  },
  headingMd: {
    fontSize: FONT_SIZES.xl,          // 20px
    fontWeight: FONT_WEIGHTS.bold,    // 700
    lineHeight: LINE_HEIGHTS.tight,   // 1.2
    fontFamily: FONT_FAMILIES.base,
  },
  headingSm: {
    fontSize: FONT_SIZES.lg,          // 18px
    fontWeight: FONT_WEIGHTS.semibold,// 600
    lineHeight: LINE_HEIGHTS.normal,  // 1.5
    fontFamily: FONT_FAMILIES.base,
  },

  // Body Sizes - For regular content text
  bodyLg: {
    fontSize: FONT_SIZES.lg,          // 18px
    fontWeight: FONT_WEIGHTS.normal,  // 400
    lineHeight: LINE_HEIGHTS.relaxed, // 1.625
    fontFamily: FONT_FAMILIES.base,
  },
  bodyMd: {
    fontSize: FONT_SIZES.base,        // 16px
    fontWeight: FONT_WEIGHTS.normal,  // 400
    lineHeight: LINE_HEIGHTS.relaxed, // 1.625
    fontFamily: FONT_FAMILIES.base,
  },
  bodySm: {
    fontSize: FONT_SIZES.sm,          // 14px
    fontWeight: FONT_WEIGHTS.normal,  // 400
    lineHeight: LINE_HEIGHTS.normal,  // 1.5
    fontFamily: FONT_FAMILIES.base,
  },

  // Caption Sizes - For labels, hints, and secondary text
  captionMd: {
    fontSize: FONT_SIZES.xs,          // 12px
    fontWeight: FONT_WEIGHTS.medium,  // 500
    lineHeight: LINE_HEIGHTS.normal,  // 1.5
    letterSpacing: LETTER_SPACING.wide,
    fontFamily: FONT_FAMILIES.base,
    textTransform: "uppercase" as const,
  },
  captionSm: {
    fontSize: FONT_SIZES.xs,          // 12px
    fontWeight: FONT_WEIGHTS.normal,  // 400
    lineHeight: LINE_HEIGHTS.normal,  // 1.5
    fontFamily: FONT_FAMILIES.base,
  },

  // Code/Monospace
  code: {
    fontSize: FONT_SIZES.sm,          // 14px
    fontWeight: FONT_WEIGHTS.normal,  // 400
    lineHeight: LINE_HEIGHTS.normal,  // 1.5
    fontFamily: FONT_FAMILIES.mono,
  },
} as const;

/**
 * Usage Examples:
 * 
 * React Component:
 * ```tsx
 * import { TextVariants } from "@rbxfolio/design-system";
 * <h1 style={TextVariants.headingMd}>Page Title</h1>
 * <p style={TextVariants.bodyMd}>Regular text</p>
 * ```
 * 
 * Tailwind CSS (if using):
 * ```tsx
 * // Use CSS variables set in globals.css
 * <h1 className="text-heading-md">Title</h1>
 * ```
 * 
 * Direct Font Size (if needed):
 * ```tsx
 * import { FONT_SIZES, FONT_WEIGHTS } from "@rbxfolio/design-system";
 * <p style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.semibold }}>Text</p>
 * ```
 */
