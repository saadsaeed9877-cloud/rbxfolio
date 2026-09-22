import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  ContactRequestSchema,
  ContactRequestUpdateSchema,
} from "@rbxfolio/types";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";

@Injectable()
export class ContactRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async submit(username: string, data: unknown) {
    const parsed = ContactRequestSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const profile = await this.prisma.profile.findUnique({
      where: { username },
      include: { user: true },
    });
    if (!profile) {
      throw new NotFoundException("Developer not found");
    }

    const request = await this.prisma.contactRequest.create({
      data: {
        developerId: profile.userId,
        visitorName: parsed.data.visitorName,
        message: parsed.data.message,
      },
    });

    // Send notification emails
    try {
      // Notify the developer
      await this.emailService.sendContactRequestNotification(
        profile.user.email,
        profile.name || profile.username || "Developer",
        parsed.data.visitorName,
        "unknown@example.com", // Email from visitor would need to be added to schema if needed
        parsed.data.message,
        request.id,
      );

      // Optionally send confirmation to visitor (if we had their email in future)
    } catch (error) {
      // Log error but don't fail the request
      console.error("Failed to send contact request emails:", error);
    }

    return {
      id: request.id,
      status: request.status,
      message: "Contact request submitted successfully",
    };
  }

  async listForDeveloper(developerId: string) {
    const requests = await this.prisma.contactRequest.findMany({
      where: { developerId },
      orderBy: { createdAt: "desc" },
    });

    return requests.map((r) => ({
      id: r.id,
      visitorName: r.visitorName,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt,
      respondedAt: r.respondedAt,
    }));
  }

  async updateStatus(developerId: string, id: string, data: unknown) {
    const parsed = ContactRequestUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const request = await this.prisma.contactRequest.findFirst({
      where: { id, developerId },
    });
    if (!request) {
      throw new NotFoundException("Contact request not found");
    }

    const updated = await this.prisma.contactRequest.update({
      where: { id },
      data: {
        status: parsed.data.status,
        respondedAt: new Date(),
      },
    });

    const profile = await this.prisma.profile.findUnique({
      where: { userId: developerId },
    });

    return {
      id: updated.id,
      status: updated.status,
      respondedAt: updated.respondedAt,
      preferredContact:
        updated.status === "ACCEPTED" ? profile?.preferredContact : null,
    };
  }

  async countPending(developerId: string) {
    return this.prisma.contactRequest.count({
      where: { developerId, status: "PENDING" },
    });
  }
}
