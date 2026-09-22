import { describe, it, expect } from "vitest";
import {
  ProfileUpdateSchema,
  ProjectCreateSchema,
  ProjectUpdateSchema,
  ContactRequestSchema,
  SearchQuerySchema,
  BrowseQuerySchema,
} from "@rbxfolio/types";

/**
 * Validation Schema Tests
 * Tests for all Zod validation schemas used in the application
 */

describe("ProfileUpdateSchema", () => {
  describe("valid inputs", () => {
    it("should accept partial profile update", () => {
      const result = ProfileUpdateSchema.safeParse({
        displayName: "John Doe",
      });
      expect(result.success).toBe(true);
    });

    it("should accept empty object", () => {
      const result = ProfileUpdateSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("should accept all fields", () => {
      const result = ProfileUpdateSchema.safeParse({
        displayName: "John",
        username: "john_doe",
        tagline: "Game developer",
        bio: "I make games",
        primaryRole: "SCRIPTER",
        secondaryRoles: ["BUILDER"],
        experienceLevel: "INTERMEDIATE",
        location: "USA",
        languages: ["English", "Spanish"],
        socialLinks: { github: "https://github.com/johndoe" },
        availability: "OPEN",
        preferredContact: "john@example.com",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("username validation", () => {
    it("should reject uppercase in username", () => {
      const result = ProfileUpdateSchema.safeParse({
        username: "John_Doe",
      });
      expect(result.success).toBe(false);
    });

    it("should reject special characters in username", () => {
      const result = ProfileUpdateSchema.safeParse({
        username: "john!@#",
      });
      expect(result.success).toBe(false);
    });

    it("should accept valid username", () => {
      const result = ProfileUpdateSchema.safeParse({
        username: "john_doe-123",
      });
      expect(result.success).toBe(true);
    });

    it("should enforce minimum length", () => {
      const result = ProfileUpdateSchema.safeParse({
        username: "ab",
      });
      expect(result.success).toBe(false);
    });

    it("should enforce maximum length", () => {
      const result = ProfileUpdateSchema.safeParse({
        username: "a".repeat(31),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("field constraints", () => {
    it("should enforce displayName minimum length", () => {
      const result = ProfileUpdateSchema.safeParse({
        displayName: "J",
      });
      expect(result.success).toBe(false);
    });

    it("should enforce tagline maximum length", () => {
      const result = ProfileUpdateSchema.safeParse({
        tagline: "a".repeat(121),
      });
      expect(result.success).toBe(false);
    });

    it("should enforce bio maximum length", () => {
      const result = ProfileUpdateSchema.safeParse({
        bio: "a".repeat(2001),
      });
      expect(result.success).toBe(false);
    });

    it("should limit secondary roles to 3", () => {
      const result = ProfileUpdateSchema.safeParse({
        secondaryRoles: ["BUILDER", "DESIGNER", "ANIMATOR", "MODELER"],
      });
      expect(result.success).toBe(false);
    });

    it("should limit languages to 10", () => {
      const result = ProfileUpdateSchema.safeParse({
        languages: Array(11).fill("Language"),
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("ProjectCreateSchema", () => {
  describe("valid projects", () => {
    it("should accept minimal project", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "My Game",
        shortDescription: "A fun game to play",
      });
      expect(result.success).toBe(true);
    });

    it("should accept full project", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "My Game",
        shortDescription: "A fun game",
        detailedDescription: "This is a longer description",
        completionStatus: "COMPLETED",
        visibility: "PUBLIC",
        tags: ["game", "puzzle"],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("field validation", () => {
    it("should require title", () => {
      const result = ProjectCreateSchema.safeParse({
        shortDescription: "Description",
      });
      expect(result.success).toBe(false);
    });

    it("should require shortDescription", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "Title",
      });
      expect(result.success).toBe(false);
    });

    it("should enforce title minimum length", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "A",
        shortDescription: "Description",
      });
      expect(result.success).toBe(false);
    });

    it("should enforce title maximum length", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "a".repeat(101),
        shortDescription: "Description",
      });
      expect(result.success).toBe(false);
    });

    it("should enforce shortDescription minimum length", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "Title",
        shortDescription: "abc",
      });
      expect(result.success).toBe(false);
    });

    it("should enforce shortDescription maximum length", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "Title",
        shortDescription: "a".repeat(301),
      });
      expect(result.success).toBe(false);
    });

    it("should enforce detailedDescription maximum length", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "Title",
        shortDescription: "Short desc",
        detailedDescription: "a".repeat(10001),
      });
      expect(result.success).toBe(false);
    });

    it("should limit tags to 10", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "Title",
        shortDescription: "Description",
        tags: Array(11).fill("tag"),
      });
      expect(result.success).toBe(false);
    });

    it("should enforce tag length", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "Title",
        shortDescription: "Description",
        tags: ["a".repeat(31)],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("enum validation", () => {
    it("should validate completionStatus", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "Title",
        shortDescription: "Description",
        completionStatus: "INVALID",
      });
      expect(result.success).toBe(false);
    });

    it("should validate visibility", () => {
      const result = ProjectCreateSchema.safeParse({
        title: "Title",
        shortDescription: "Description",
        visibility: "INVALID",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("ContactRequestSchema", () => {
  describe("valid requests", () => {
    it("should accept valid contact request", () => {
      const result = ContactRequestSchema.safeParse({
        visitorName: "John Doe",
        message: "I want to collaborate",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("field validation", () => {
    it("should enforce visitorName minimum length", () => {
      const result = ContactRequestSchema.safeParse({
        visitorName: "J",
        message: "Message text",
      });
      expect(result.success).toBe(false);
    });

    it("should enforce visitorName maximum length", () => {
      const result = ContactRequestSchema.safeParse({
        visitorName: "a".repeat(101),
        message: "Message",
      });
      expect(result.success).toBe(false);
    });

    it("should enforce message minimum length", () => {
      const result = ContactRequestSchema.safeParse({
        visitorName: "John",
        message: "short",
      });
      expect(result.success).toBe(false);
    });

    it("should enforce message maximum length", () => {
      const result = ContactRequestSchema.safeParse({
        visitorName: "John",
        message: "a".repeat(1001),
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("SearchQuerySchema", () => {
  describe("valid queries", () => {
    it("should accept empty query", () => {
      const result = SearchQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("should accept query with all fields", () => {
      const result = SearchQuerySchema.safeParse({
        q: "game",
        role: "SCRIPTER",
        page: 1,
        limit: 20,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("pagination validation", () => {
    it("should set default page to 1", () => {
      const result = SearchQuerySchema.safeParse({});
      if (result.success) {
        expect(result.data.page).toBe(1);
      }
    });

    it("should enforce minimum page", () => {
      const result = SearchQuerySchema.safeParse({ page: 0 });
      expect(result.success).toBe(false);
    });

    it("should enforce maximum limit", () => {
      const result = SearchQuerySchema.safeParse({ limit: 51 });
      expect(result.success).toBe(false);
    });
  });

  describe("search validation", () => {
    it("should enforce query maximum length", () => {
      const result = SearchQuerySchema.safeParse({
        q: "a".repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it("should validate role enum", () => {
      const result = SearchQuerySchema.safeParse({
        role: "INVALID",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("BrowseQuerySchema", () => {
  describe("valid queries", () => {
    it("should accept empty query", () => {
      const result = BrowseQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("should set default sort to newest", () => {
      const result = BrowseQuerySchema.safeParse({});
      if (result.success) {
        expect(result.data.sort).toBe("newest");
      }
    });
  });

  describe("sort validation", () => {
    it("should accept valid sort values", () => {
      const result1 = BrowseQuerySchema.safeParse({ sort: "newest" });
      const result2 = BrowseQuerySchema.safeParse({ sort: "updated" });
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    it("should reject invalid sort", () => {
      const result = BrowseQuerySchema.safeParse({ sort: "invalid" });
      expect(result.success).toBe(false);
    });
  });
});
