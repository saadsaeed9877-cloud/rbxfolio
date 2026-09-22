import { describe, expect, it } from "vitest";
import {
  ContactRequestSchema,
  ProfileUpdateSchema,
  ProjectCreateSchema,
  slugify,
} from "./index.js";

describe("ProfileUpdateSchema", () => {
  it("accepts valid profile updates", () => {
    const result = ProfileUpdateSchema.safeParse({
      displayName: "Dev User",
      username: "dev_user",
      tagline: "Roblox scripter",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid usernames", () => {
    const result = ProfileUpdateSchema.safeParse({
      username: "Invalid User!",
    });
    expect(result.success).toBe(false);
  });
});

describe("ProjectCreateSchema", () => {
  it("requires title and short description", () => {
    const result = ProjectCreateSchema.safeParse({
      title: "My Game",
      shortDescription: "A cool simulator project",
    });
    expect(result.success).toBe(true);
  });
});

describe("ContactRequestSchema", () => {
  it("validates contact request input", () => {
    const result = ContactRequestSchema.safeParse({
      visitorName: "Client",
      message: "Interested in hiring you for a project.",
    });
    expect(result.success).toBe(true);
  });
});

describe("slugify", () => {
  it("creates URL-safe slugs", () => {
    expect(slugify("My Cool Project!")).toBe("my-cool-project");
  });
});
