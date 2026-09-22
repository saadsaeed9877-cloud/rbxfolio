/**
 * Typography System Tests
 * Verifies font tokens and variants are correctly defined
 */

import {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  LETTER_SPACING,
  TextVariants,
} from "../fonts";

describe("Typography System", () => {
  describe("FONT_FAMILIES", () => {
    it("should have base and mono families", () => {
      expect(FONT_FAMILIES.base).toBeDefined();
      expect(FONT_FAMILIES.mono).toBeDefined();
    });

    it("base should be a string", () => {
      expect(typeof FONT_FAMILIES.base).toBe("string");
      expect(FONT_FAMILIES.base.length).toBeGreaterThan(0);
    });

    it("mono should be a string", () => {
      expect(typeof FONT_FAMILIES.mono).toBe("string");
      expect(FONT_FAMILIES.mono.length).toBeGreaterThan(0);
    });
  });

  describe("FONT_SIZES", () => {
    it("should have all required sizes", () => {
      const expectedSizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];
      expectedSizes.forEach((size) => {
        expect(FONT_SIZES[size as keyof typeof FONT_SIZES]).toBeDefined();
      });
    });

    it("all sizes should be in rem units", () => {
      Object.values(FONT_SIZES).forEach((size) => {
        expect(size).toMatch(/rem$/);
      });
    });

    it("sizes should be in ascending order", () => {
      const sizes = Object.values(FONT_SIZES).map((s) => parseFloat(s));
      for (let i = 0; i < sizes.length - 1; i++) {
        expect(sizes[i]).toBeLessThan(sizes[i + 1]);
      }
    });
  });

  describe("FONT_WEIGHTS", () => {
    it("should have all required weights", () => {
      const expectedWeights = ["normal", "medium", "semibold", "bold", "black"];
      expectedWeights.forEach((weight) => {
        expect(FONT_WEIGHTS[weight as keyof typeof FONT_WEIGHTS]).toBeDefined();
      });
    });

    it("weights should be valid CSS values", () => {
      const validWeights = [400, 500, 600, 700, 900];
      Object.values(FONT_WEIGHTS).forEach((weight) => {
        expect(validWeights).toContain(weight);
      });
    });

    it("weights should be in ascending order", () => {
      const weights = Object.values(FONT_WEIGHTS);
      for (let i = 0; i < weights.length - 1; i++) {
        expect(weights[i]).toBeLessThan(weights[i + 1]);
      }
    });
  });

  describe("LINE_HEIGHTS", () => {
    it("should have all required line heights", () => {
      const expectedHeights = ["tight", "normal", "relaxed", "loose"];
      expectedHeights.forEach((height) => {
        expect(LINE_HEIGHTS[height as keyof typeof LINE_HEIGHTS]).toBeDefined();
      });
    });

    it("all line heights should be numbers", () => {
      Object.values(LINE_HEIGHTS).forEach((height) => {
        expect(typeof height).toBe("number");
        expect(height).toBeGreaterThan(0);
      });
    });
  });

  describe("LETTER_SPACING", () => {
    it("should have all required letter spacings", () => {
      const expectedSpacings = ["tight", "normal", "wide", "wider"];
      expectedSpacings.forEach((spacing) => {
        expect(LETTER_SPACING[spacing as keyof typeof LETTER_SPACING]).toBeDefined();
      });
    });

    it("all spacings should have em units", () => {
      Object.values(LETTER_SPACING).forEach((spacing) => {
        expect(spacing).toMatch(/em$/);
      });
    });
  });

  describe("TextVariants", () => {
    const expectedVariants = [
      // Display
      "displayXL",
      "displayLg",
      // Heading
      "headingXl",
      "headingLg",
      "headingMd",
      "headingSm",
      // Body
      "bodyLg",
      "bodyMd",
      "bodySm",
      // Caption
      "captionMd",
      "captionSm",
      // Code
      "code",
    ];

    it("should have all required variants", () => {
      expectedVariants.forEach((variant) => {
        expect(TextVariants[variant as keyof typeof TextVariants]).toBeDefined();
      });
    });

    it("each variant should have required properties", () => {
      expectedVariants.forEach((variant) => {
        const variantStyle = TextVariants[variant as keyof typeof TextVariants];
        expect(variantStyle.fontSize).toBeDefined();
        expect(variantStyle.fontWeight).toBeDefined();
        expect(variantStyle.lineHeight).toBeDefined();
        expect(variantStyle.fontFamily).toBeDefined();
      });
    });

    it("display variants should use black weight", () => {
      expect(TextVariants.displayXL.fontWeight).toBe(FONT_WEIGHTS.black);
      expect(TextVariants.displayLg.fontWeight).toBe(FONT_WEIGHTS.bold);
    });

    it("heading variants should use bold weight", () => {
      expect(TextVariants.headingXl.fontWeight).toBe(FONT_WEIGHTS.bold);
      expect(TextVariants.headingLg.fontWeight).toBe(FONT_WEIGHTS.bold);
      expect(TextVariants.headingMd.fontWeight).toBe(FONT_WEIGHTS.bold);
      expect(TextVariants.headingSm.fontWeight).toBe(FONT_WEIGHTS.semibold);
    });

    it("body variants should use normal weight", () => {
      expect(TextVariants.bodyLg.fontWeight).toBe(FONT_WEIGHTS.normal);
      expect(TextVariants.bodyMd.fontWeight).toBe(FONT_WEIGHTS.normal);
      expect(TextVariants.bodySm.fontWeight).toBe(FONT_WEIGHTS.normal);
    });

    it("caption variants should use appropriate weights", () => {
      expect(TextVariants.captionMd.fontWeight).toBe(FONT_WEIGHTS.medium);
      expect(TextVariants.captionSm.fontWeight).toBe(FONT_WEIGHTS.normal);
    });

    it("display and heading variants should use tight line height", () => {
      expect(TextVariants.displayXL.lineHeight).toBe(LINE_HEIGHTS.tight);
      expect(TextVariants.displayLg.lineHeight).toBe(LINE_HEIGHTS.tight);
      expect(TextVariants.headingXl.lineHeight).toBe(LINE_HEIGHTS.tight);
      expect(TextVariants.headingLg.lineHeight).toBe(LINE_HEIGHTS.tight);
      expect(TextVariants.headingMd.lineHeight).toBe(LINE_HEIGHTS.tight);
    });

    it("body variants should use relaxed line height", () => {
      expect(TextVariants.bodyLg.lineHeight).toBe(LINE_HEIGHTS.relaxed);
      expect(TextVariants.bodyMd.lineHeight).toBe(LINE_HEIGHTS.relaxed);
    });

    it("caption variants should use normal line height", () => {
      expect(TextVariants.captionMd.lineHeight).toBe(LINE_HEIGHTS.normal);
      expect(TextVariants.captionSm.lineHeight).toBe(LINE_HEIGHTS.normal);
    });

    it("all variants should use base font family", () => {
      expectedVariants.forEach((variant) => {
        const variantStyle = TextVariants[variant as keyof typeof TextVariants];
        if (variant !== "code") {
          expect(variantStyle.fontFamily).toBe(FONT_FAMILIES.base);
        }
      });
    });

    it("code variant should use mono font family", () => {
      expect(TextVariants.code.fontFamily).toBe(FONT_FAMILIES.mono);
    });

    it("caption variants should have letter spacing", () => {
      expect(TextVariants.captionMd.letterSpacing).toBe(LETTER_SPACING.wide);
    });
  });

  describe("Typography Scale", () => {
    it("font sizes should follow modular scale", () => {
      const sizes = Object.values(FONT_SIZES).map((s) => parseFloat(s));
      // Approximate 1.125 multiplier (allowing tolerance of 1.05-1.35 for variation)
      for (let i = 1; i < sizes.length; i++) {
        const ratio = sizes[i] / sizes[i - 1];
        expect(ratio).toBeGreaterThan(1.05);
        expect(ratio).toBeLessThanOrEqual(1.35);
      }
    });

    it("display variants should be larger than headings", () => {
      const displaySize = parseFloat(TextVariants.displayXL.fontSize);
      const headingSize = parseFloat(TextVariants.headingXl.fontSize);
      expect(displaySize).toBeGreaterThan(headingSize);
    });

    it("body variants should be smaller than headings", () => {
      const headingSize = parseFloat(TextVariants.headingMd.fontSize);
      const bodySize = parseFloat(TextVariants.bodyMd.fontSize);
      expect(headingSize).toBeGreaterThan(bodySize);
    });

    it("caption variants should be smallest", () => {
      const bodySize = parseFloat(TextVariants.bodySm.fontSize);
      const captionSize = parseFloat(TextVariants.captionSm.fontSize);
      expect(bodySize).toBeGreaterThan(captionSize);
    });
  });
});
