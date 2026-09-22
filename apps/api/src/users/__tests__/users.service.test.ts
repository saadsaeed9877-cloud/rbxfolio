import { describe, it, expect, beforeEach, vi } from "vitest";
import { UsersService } from "../users.service";
import { PrismaService } from "../../prisma/prisma.service";
import { MediaService } from "../../media/media.service";

/**
 * UsersService Unit Tests
 * Tests for profile management, avatar/banner uploads, and profile formatting
 */

describe("UsersService", () => {
  let service: UsersService;
  let prismaMock: any;
  let mediaServiceMock: any;

  beforeEach(() => {
    // Mock Prisma
    prismaMock = {
      profile: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
      },
      project: {
        findMany: vi.fn(),
      },
    };

    // Mock MediaService
    mediaServiceMock = {
      saveImage: vi.fn(),
    };

    service = new UsersService(prismaMock as any, mediaServiceMock as any);
  });

  describe("getPublicProfile", () => {
    it("should throw NotFoundException if profile not found", async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.getPublicProfile("nonexistent")
      ).rejects.toThrow("Profile not found");
    });

    it("should return formatted public profile", async () => {
      const mockProfile = {
        userId: "user-1",
        username: "johndoe",
        displayName: "John Doe",
        profilePictureUrl: "https://example.com/avatar.jpg",
        bannerUrl: "https://example.com/banner.jpg",
        tagline: "Game developer",
        bio: "I make games",
        primaryRole: "SCRIPTER",
        secondaryRoles: [],
        experienceLevel: "INTERMEDIATE",
        location: "USA",
        languages: ["English"],
        socialLinks: {},
        availability: "OPEN",
        preferredContact: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
        user: {
          id: "user-1",
          createdAt: new Date("2024-01-01"),
        },
      };

      prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile);
      prismaMock.project.findMany.mockResolvedValueOnce([]);

      const result = await service.getPublicProfile("johndoe");

      expect(result).toHaveProperty("username", "johndoe");
      expect(result).toHaveProperty("displayName", "John Doe");
      expect(result).toHaveProperty("projects");
    });

    it("should include only public projects", async () => {
      const mockProfile = {
        userId: "user-1",
        username: "johndoe",
        displayName: "John Doe",
        profilePictureUrl: null,
        bannerUrl: null,
        tagline: null,
        bio: null,
        primaryRole: "SCRIPTER",
        secondaryRoles: [],
        experienceLevel: "INTERMEDIATE",
        location: null,
        languages: [],
        socialLinks: {},
        availability: "OPEN",
        preferredContact: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: "user-1",
          createdAt: new Date(),
        },
      };

      prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile);
      prismaMock.project.findMany.mockResolvedValueOnce([
        {
          id: "proj-1",
          title: "My Game",
          slug: "my-game",
          shortDescription: "A game",
          thumbnailUrl: null,
          completionStatus: "COMPLETED",
          visibility: "PUBLIC",
          media: [],
          tags: [],
        },
      ]);

      const result = await service.getPublicProfile("johndoe");

      expect(prismaMock.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            visibility: "PUBLIC",
          }),
        })
      );
    });
  });

  describe("updateProfile", () => {
    it("should update profile with valid data", async () => {
      prismaMock.profile.update.mockResolvedValueOnce({
        userId: "user-1",
        displayName: "Updated Name",
        username: "john_doe",
        profilePictureUrl: null,
        bannerUrl: null,
        tagline: null,
        bio: null,
        primaryRole: "SCRIPTER",
        secondaryRoles: [],
        experienceLevel: "INTERMEDIATE",
        location: null,
        languages: [],
        socialLinks: {},
        availability: "OPEN",
        preferredContact: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.updateProfile("user-1", {
        displayName: "Updated Name",
      });

      expect(result).toHaveProperty("displayName", "Updated Name");
    });

    it("should check username uniqueness", async () => {
      prismaMock.profile.findFirst.mockResolvedValueOnce({
        username: "taken_username",
      });

      await expect(
        service.updateProfile("user-1", {
          username: "taken_username",
        })
      ).rejects.toThrow("Username already taken");
    });

    it("should allow same username for same user", async () => {
      prismaMock.profile.findFirst.mockResolvedValueOnce(null);
      prismaMock.profile.update.mockResolvedValueOnce({
        userId: "user-1",
        username: "john_doe",
        displayName: "John",
        profilePictureUrl: null,
        bannerUrl: null,
        tagline: null,
        bio: null,
        primaryRole: "SCRIPTER",
        secondaryRoles: [],
        experienceLevel: "INTERMEDIATE",
        location: null,
        languages: [],
        socialLinks: {},
        availability: "OPEN",
        preferredContact: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        service.updateProfile("user-1", {
          username: "john_doe",
        })
      ).resolves.toBeDefined();
    });
  });

  describe("uploadAvatar", () => {
    it("should upload avatar and update profile", async () => {
      const mockFile = {
        mimetype: "image/jpeg",
        buffer: Buffer.from("test"),
        size: 1024,
      } as any;

      mediaServiceMock.saveImage.mockResolvedValueOnce(
        "https://example.com/avatar.jpg"
      );
      prismaMock.profile.update.mockResolvedValueOnce({
        userId: "user-1",
        profilePictureUrl: "https://example.com/avatar.jpg",
        displayName: "John",
        username: "john",
        bannerUrl: null,
        tagline: null,
        bio: null,
        primaryRole: "SCRIPTER",
        secondaryRoles: [],
        experienceLevel: "INTERMEDIATE",
        location: null,
        languages: [],
        socialLinks: {},
        availability: "OPEN",
        preferredContact: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await service.uploadAvatar("user-1", mockFile);

      expect(mediaServiceMock.saveImage).toHaveBeenCalledWith(
        mockFile,
        "avatars"
      );
      expect(prismaMock.profile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            profilePictureUrl: "https://example.com/avatar.jpg",
          }),
        })
      );
    });
  });

  describe("ensureProfile", () => {
    it("should return existing profile", async () => {
      const existingProfile = {
        userId: "user-1",
        username: "john",
        displayName: "John",
        profilePictureUrl: null,
        bannerUrl: null,
        tagline: null,
        bio: null,
        primaryRole: "SCRIPTER",
        secondaryRoles: [],
        experienceLevel: "INTERMEDIATE",
        location: null,
        languages: [],
        socialLinks: {},
        availability: "OPEN",
        preferredContact: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.profile.findUnique.mockResolvedValueOnce(existingProfile);

      const result = await service.ensureProfile("user-1", "john@example.com");

      expect(result).toEqual(existingProfile);
      expect(prismaMock.profile.create).not.toHaveBeenCalled();
    });

    it("should create profile if not exists", async () => {
      prismaMock.profile.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const newProfile = {
        userId: "user-1",
        username: "john",
        displayName: "John",
        profilePictureUrl: null,
        bannerUrl: null,
        tagline: null,
        bio: null,
        primaryRole: "SCRIPTER",
        secondaryRoles: [],
        experienceLevel: "INTERMEDIATE",
        location: null,
        languages: [],
        socialLinks: {},
        availability: "OPEN",
        preferredContact: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.profile.create.mockResolvedValueOnce(newProfile);

      const result = await service.ensureProfile(
        "user-1",
        "john@example.com",
        "John"
      );

      expect(prismaMock.profile.create).toHaveBeenCalled();
      expect(result).toEqual(newProfile);
    });

    it("should generate unique username on collision", async () => {
      // First call returns null (profile doesn't exist)
      // Subsequent calls simulate username collision and then success
      prismaMock.profile.findUnique
        .mockResolvedValueOnce(null) // profile doesn't exist
        .mockResolvedValueOnce({ username: "john" }) // collision
        .mockResolvedValueOnce(null); // john-1 is available

      const newProfile = {
        userId: "user-1",
        username: "john-1",
        displayName: "John",
        profilePictureUrl: null,
        bannerUrl: null,
        tagline: null,
        bio: null,
        primaryRole: "SCRIPTER",
        secondaryRoles: [],
        experienceLevel: "INTERMEDIATE",
        location: null,
        languages: [],
        socialLinks: {},
        availability: "OPEN",
        preferredContact: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.profile.create.mockResolvedValueOnce(newProfile);

      const result = await service.ensureProfile(
        "user-1",
        "john@example.com",
        "John"
      );

      expect(result.username).toBe("john-1");
    });
  });
});
