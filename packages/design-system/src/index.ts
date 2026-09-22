/**
 * RbxFolio Design System
 * 
 * CRITICAL: This is the main export file for all design system elements.
 * ALWAYS import from this file, NEVER from sub-paths.
 * 
 * Example:
 * ✅ import { Text, TextVariants, FONT_SIZES } from "@rbxfolio/design-system"
 * ❌ import { Text } from "@rbxfolio/design-system/src/typography/text"
 * 
 * See: DESIGN_SYSTEM_GUIDE.md for complete documentation
 */

// ============================================================================
// TYPOGRAPHY SYSTEM - Phase 1 ✅ (COMPLETE)
// ============================================================================

// Font definitions and tokens
export {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  LETTER_SPACING,
  TextVariants,
  type TextVariants as TextVariantsType,
} from "./typography/fonts";

// Text components
export {
  Text,
  Heading1,
  Heading2,
  Heading3,
  Paragraph,
  Label,
  Caption,
  type TextProps,
} from "./typography/text";

// ============================================================================
// FORM COMPONENTS - Phase 2 ✅ (COMPLETE)
// ============================================================================

export {
  Input,
  Textarea,
  Select,
  Checkbox,
  Toggle,
  FileUpload,
  type InputProps,
  type TextareaProps,
  type SelectProps,
  type Option,
  type CheckboxProps,
  type ToggleProps,
  type FileUploadProps,
} from "./forms";

// ============================================================================
// COLORS SYSTEM - Phase 3 (Coming Soon)
// ============================================================================

// export * from "./colors/palette";
// export * from "./colors/semanticColors";

// ============================================================================
// SPACING & LAYOUT - Phase 4 (Coming Soon)
// ============================================================================

// export * from "./spacing/spacing";
// export * from "./spacing/breakpoints";

// ============================================================================
// UTILITY COMPONENTS - Phase 5 (Coming Soon)
// ============================================================================

// export * from "./components/Button/Button";
// export * from "./components/Card/Card";
// export * from "./components/Form/Form";
// export * from "./components/Dialog/Dialog";
// export * from "./components/Dropdown/Dropdown";
// export * from "./components/Badge/Badge";
// export * from "./components/Avatar/Avatar";

// ============================================================================
// UTILITIES (Coming Soon)
// ============================================================================

// export * from "./shadows/shadows";
// export * from "./animations/transitions";
// export * from "./icons/icons";
// export * from "./hooks/useResponsive";

// ============================================================================
// Design System Status
// ============================================================================

export const DESIGN_SYSTEM_VERSION = "0.2.0";
export const DESIGN_SYSTEM_PHASE = "Phase 2 - Form Components";

/**
 * Current Implementation Status
 * 
 * Phase 1: Typography ✅ COMPLETE
 *   ✓ Font families (base, mono)
 *   ✓ Font sizes (xs - 5xl)
 *   ✓ Font weights (normal - black)
 *   ✓ Line heights (tight - loose)
 *   ✓ Letter spacing (tight - wider)
 *   ✓ 11 text variants
 *   ✓ Text component with semantic wrappers
 *   ✓ Unit tests
 *
 * Phase 2: Form Components ✅ COMPLETE
 *   ✓ Input component
 *   ✓ Textarea component
 *   ✓ Select component
 *   ✓ Checkbox component
 *   ✓ Toggle component
 *   ✓ FileUpload component
 *   ✓ Error and hint support
 *   ✓ Accessibility (ARIA labels, descriptions)
 *
 * Phase 3: Colors (Planned)
 *   - Color palette
 *   - Semantic colors
 *   - Color utilities
 *
 * Phase 4: Spacing & Layout (Planned)
 *   - Spacing scale
 *   - Breakpoints
 *   - Grid utilities
 *
 * Phase 5: Utility Components (Planned)
 *   - Button component
 *   - Card component
 *   - Form container
 *   - Dialog/Modal
 *   - Badge component
 *   - Avatar component
 *
 * Phase 6: Refactoring (Planned)
 *   - Refactor existing components
 *   - 100% design-system compliance
 */
