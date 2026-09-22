import { describe, expect, it } from "vitest";
import { ContactRequestSchema, slugify } from "@rbxfolio/types";

describe("API schemas", () => {
  it("validates contact requests", () => {
    const result = ContactRequestSchema.safeParse({
      visitorName: "Client",
      message: "I want to hire you for a simulator.",
    });
    expect(result.success).toBe(true);
  });

  it("slugifies project titles", () => {
    expect(slugify("Epic Simulator 2024")).toBe("epic-simulator-2024");
  });
});
