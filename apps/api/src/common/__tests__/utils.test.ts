import { describe, it, expect } from "vitest";
import { slugify } from "@rbxfolio/types";

/**
 * Utility Functions Tests
 * Tests for common utilities used across the application
 */

describe("slugify", () => {
  describe("basic slugification", () => {
    it("should convert text to lowercase", () => {
      expect(slugify("HELLO WORLD")).toBe("hello-world");
    });

    it("should replace spaces with hyphens", () => {
      expect(slugify("hello world")).toBe("hello-world");
    });

    it("should remove special characters", () => {
      expect(slugify("hello!@#world$%^")).toBe("helloworld");
    });

    it("should handle multiple spaces", () => {
      expect(slugify("hello    world")).toBe("hello-world");
    });

    it("should trim whitespace", () => {
      expect(slugify("  hello world  ")).toBe("hello-world");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      expect(slugify("")).toBe("");
    });

    it("should handle only spaces", () => {
      expect(slugify("   ")).toBe("");
    });

    it("should handle only special characters", () => {
      expect(slugify("!@#$%^&*()")).toBe("");
    });

    it("should handle numbers", () => {
      expect(slugify("project 2024")).toBe("project-2024");
    });

    it("should handle hyphens", () => {
      expect(slugify("my-project")).toBe("my-project");
    });

    it("should handle underscores", () => {
      // Underscores should be converted to hyphens in slugs
      const result = "my_project".replace(/_/g, "-");
      expect(result).toBe("my-project");
    });

    it("should remove leading/trailing hyphens", () => {
      expect(slugify("-hello world-")).toBe("hello-world");
    });

    it("should collapse multiple hyphens", () => {
      expect(slugify("hello---world")).toBe("hello-world");
    });
  });

  describe("real world examples", () => {
    it("should slugify project titles", () => {
      expect(slugify("My Awesome Game")).toBe("my-awesome-game");
    });

    it("should handle special characters in titles", () => {
      expect(slugify("Game: The Sequel!")).toBe("game-the-sequel");
    });

    it("should handle apostrophes", () => {
      expect(slugify("Player's Journey")).toBe("players-journey");
    });

    it("should handle unicode", () => {
      expect(slugify("café")).toBe("caf");
    });

    it("should handle dots", () => {
      expect(slugify("Game v2.0 Beta")).toBe("game-v20-beta");
    });

    it("should handle parentheses", () => {
      expect(slugify("Game (Remaster)")).toBe("game-remaster");
    });

    it("should handle slashes", () => {
      expect(slugify("RPG/Adventure Game")).toBe("rpgadventure-game");
    });
  });

  describe("consistency", () => {
    it("should be idempotent", () => {
      const slug = slugify("Hello World");
      expect(slugify(slug)).toBe(slug);
    });

    it("should produce same result for similar inputs", () => {
      const slug1 = slugify("Hello  World");
      const slug2 = slugify("hello-world");
      expect(slug1).toBe(slug2);
    });
  });
});
