import { describe, it, expect, beforeEach, vi } from "vitest";
import { ContactRequestsService } from "../contact-requests.service";
import { PrismaService } from "../../prisma/prisma.service";
import { EmailService } from "../../email/email.service";

/**
 * ContactRequestsService Unit Tests
 * Tests for contact request submission, listing, and status management
 */

describe("ContactRequestsService", () => {
  let service: ContactRequestsService;
  let prismaMock: any;
  let emailServiceMock: any;

  beforeEach(() => {
    prismaMock = {
      profile: {
        findUnique: vi.fn(),
      },
      contactRequest: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
    };

    emailServiceMock = {
      sendContactRequestNotification: vi.fn().mockResolvedValue(undefined),
      sendContactRequestConfirmation: vi.fn().mockResolvedValue(undefined),
    };

    service = new ContactRequestsService(prismaMock as any, emailServiceMock as any);
  });

  describe("submit", () => {
    it("should submit contact request to developer", async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce({
        userId: "dev-user-1",
        name: "Dev User",
        username: "dev_user",
        user: { email: "dev@example.com" },
      });
      prismaMock.contactRequest.create.mockResolvedValueOnce({
        id: "req-1",
        developerId: "dev-user-1",
        visitorName: "John Doe",
        message: "I'd like to collaborate",
        status: "PENDING",
        createdAt: new Date(),
        respondedAt: null,
        preferredContact: null,
      });

      const result = await service.submit("dev_user", {
        visitorName: "John Doe",
        message: "I'd like to collaborate",
      });

      expect(result).toHaveProperty("status", "PENDING");
      expect(prismaMock.contactRequest.create).toHaveBeenCalled();
      expect(emailServiceMock.sendContactRequestNotification).toHaveBeenCalled();
    });

    it("should throw if developer not found", async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.submit("nonexistent", {
          visitorName: "John",
          message: "Message",
        })
      ).rejects.toThrow();
    });

    it("should validate input data", async () => {
      await expect(
        service.submit("dev_user", {
          visitorName: "",
          message: "Message",
        })
      ).rejects.toThrow();
    });
  });

  describe("listForDeveloper", () => {
    it("should return developer's contact requests", async () => {
      const mockRequests = [
        {
          id: "req-1",
          developerId: "dev-1",
          visitorName: "John",
          message: "Collaboration request",
          status: "PENDING",
          createdAt: new Date(),
          respondedAt: null,
        },
      ];

      prismaMock.contactRequest.findMany.mockResolvedValueOnce(mockRequests);

      const result = await service.listForDeveloper("dev-1");

      expect(result).toHaveLength(1);
      expect(prismaMock.contactRequest.findMany).toHaveBeenCalledWith({
        where: { developerId: "dev-1" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return empty array if no requests", async () => {
      prismaMock.contactRequest.findMany.mockResolvedValueOnce([]);

      const result = await service.listForDeveloper("dev-1");

      expect(result).toHaveLength(0);
    });
  });

  describe("updateStatus", () => {
    it("should update contact request status", async () => {
      prismaMock.contactRequest.findFirst.mockResolvedValueOnce({
        id: "req-1",
        developerId: "dev-1",
        status: "PENDING",
      });
      prismaMock.contactRequest.update.mockResolvedValueOnce({
        id: "req-1",
        developerId: "dev-1",
        status: "ACCEPTED",
        respondedAt: new Date(),
      });
      prismaMock.profile.findUnique.mockResolvedValueOnce({
        preferredContact: "email",
      });

      const result = await service.updateStatus("dev-1", "req-1", {
        status: "ACCEPTED",
      });

      expect(result.status).toBe("ACCEPTED");
      expect(prismaMock.contactRequest.update).toHaveBeenCalled();
    });

    it("should throw if request not found", async () => {
      prismaMock.contactRequest.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.updateStatus("dev-1", "nonexistent", { status: "ACCEPTED" })
      ).rejects.toThrow();
    });

    it("should throw if invalid status", async () => {
      await expect(
        service.updateStatus("dev-1", "req-1", { status: "INVALID" })
      ).rejects.toThrow();
    });
  });

  describe("countPending", () => {
    it("should return pending request count", async () => {
      prismaMock.contactRequest.count.mockResolvedValueOnce(5);

      const result = await service.countPending("dev-1");

      expect(result).toBe(5);
      expect(prismaMock.contactRequest.count).toHaveBeenCalledWith({
        where: {
          developerId: "dev-1",
          status: "PENDING",
        },
      });
    });

    it("should return 0 if no pending requests", async () => {
      prismaMock.contactRequest.count.mockResolvedValueOnce(0);

      const result = await service.countPending("dev-1");

      expect(result).toBe(0);
    });
  });

  describe("email notifications", () => {
    it("should send email notification when request submitted", async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce({
        userId: "dev-user-1",
        name: "Dev User",
        username: "dev_user",
        user: { email: "dev@example.com" },
      });
      prismaMock.contactRequest.create.mockResolvedValueOnce({
        id: "req-1",
        developerId: "dev-user-1",
        visitorName: "John Doe",
        message: "Collaboration message",
        status: "PENDING",
      });

      await service.submit("dev_user", {
        visitorName: "John Doe",
        message: "Collaboration message",
      });

      expect(emailServiceMock.sendContactRequestNotification).toHaveBeenCalledWith(
        "dev@example.com",
        "Dev User",
        "John Doe",
        "unknown@example.com",
        "Collaboration message",
        "req-1"
      );
    });

    it("should handle email sending errors gracefully", async () => {
      prismaMock.profile.findUnique.mockResolvedValueOnce({
        userId: "dev-user-1",
        name: "Dev User",
        username: "dev_user",
        user: { email: "dev@example.com" },
      });
      prismaMock.contactRequest.create.mockResolvedValueOnce({
        id: "req-1",
        developerId: "dev-user-1",
        visitorName: "John Doe",
        message: "Long enough message",
        status: "PENDING",
      });
      emailServiceMock.sendContactRequestNotification.mockRejectedValueOnce(
        new Error("Email service down")
      );

      // Should not throw even if email fails
      const result = await service.submit("dev_user", {
        visitorName: "John Doe",
        message: "Long enough message",
      });

      expect(result).toHaveProperty("status", "PENDING");
    });
  });
});
