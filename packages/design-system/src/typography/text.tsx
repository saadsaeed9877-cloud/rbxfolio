/**
 * Text Component - Typography Wrapper
 * 
 * CRITICAL: This is part of the unified design system.
 * Use this component for all text rendering to ensure consistent typography.
 * DO NOT use <p>, <span>, or <div> for text styling.
 * 
 * See: packages/design-system/src/typography/README.md
 */

import React from "react";
import { TextVariants, type TextVariants as TextVariantsType } from "./fonts";

type TextVariant = keyof typeof TextVariants;

export interface TextProps
  extends React.HTMLAttributes<HTMLElement> {
  /**
   * The text variant to use from the predefined typography system
   * @default "bodyMd"
   */
  variant?: TextVariant;

  /**
   * The HTML element to render as
   * @default "span"
   */
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label";

  /**
   * Additional class names to append
   */
  className?: string;

  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * Text Component
 * 
 * Provides consistent typography across the application.
 * Combines font size, weight, line height, and letter spacing.
 * 
 * @example
 * // Display text
 * <Text variant="displayXL">Hero Title</Text>
 * 
 * @example
 * // Heading
 * <Text as="h1" variant="headingMd">Page Title</Text>
 * 
 * @example
 * // Body text
 * <Text variant="bodyMd">This is a paragraph of text.</Text>
 * 
 * @example
 * // Caption/label
 * <Text as="label" variant="captionSm">Field Label</Text>
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = "bodyMd",
      as: Component = "span",
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = TextVariants[variant];

    // Merge variant styles with any additional styles
    const mergedStyle: React.CSSProperties = {
      ...variantStyles,
      ...style,
    };

    return (
      <Component
        ref={ref as any}
        style={mergedStyle}
        className={className}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";

/**
 * Semantic Text Components - Convenience wrappers
 */

export const Heading1 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TextProps, "as" | "variant">
>((props, ref) => (
  <Text ref={ref as any} as="h1" variant="displayXL" {...props} />
));
Heading1.displayName = "Heading1";

export const Heading2 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TextProps, "as" | "variant">
>((props, ref) => (
  <Text ref={ref as any} as="h2" variant="headingXl" {...props} />
));
Heading2.displayName = "Heading2";

export const Heading3 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TextProps, "as" | "variant">
>((props, ref) => (
  <Text ref={ref as any} as="h3" variant="headingMd" {...props} />
));
Heading3.displayName = "Heading3";

export const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  Omit<TextProps, "as" | "variant">
>((props, ref) => (
  <Text ref={ref as any} as="p" variant="bodyMd" {...props} />
));
Paragraph.displayName = "Paragraph";

export const Label = React.forwardRef<
  HTMLLabelElement,
  Omit<TextProps, "as" | "variant">
>((props, ref) => (
  <Text ref={ref as any} as="label" variant="captionMd" {...props} />
));
Label.displayName = "Label";

export const Caption = React.forwardRef<
  HTMLSpanElement,
  Omit<TextProps, "as" | "variant">
>((props, ref) => (
  <Text ref={ref as any} as="span" variant="captionSm" {...props} />
));
Caption.displayName = "Caption";
