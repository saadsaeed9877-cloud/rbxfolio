import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ProfileUpdateSchema } from "@rbxfolio/types";
import type { Profile } from "@rbxfolio/database";
import { PrismaService } from "../prisma/prisma.service";
import { MediaService } from "../media/media.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async getPublicProfile(username: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      include: {
        user: {
          select: { id: true, createdAt: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    const projects = await this.prisma.project.findMany({
      where: { userId: profile.userId, visibility: "PUBLIC" },
      orderBy: { updatedAt: "desc" },
      include: {
        tags: { include: { tag: true } },
        media: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    });

    return {
      ...this.formatProfile(profile),
      projects: projects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription,
        thumbnailUrl: p.thumbnailUrl ?? p.media[0]?.url ?? null,
        completionStatus: p.completionStatus,
        tags: p.tags.map((t) => t.tag.name),
        updatedAt: p.updatedAt,
      })),
      memberSince: profile.user.createdAt,
    };
  }

  async getMyProfile(userId: string) {
    let profile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    if (!profile) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new NotFoundException("User not found");
      profile = await this.ensureProfile(userId, user.email, user.name);
    }
    return this.formatProfile(profile);
  }

  async updateProfile(userId: string, data: unknown) {
    const parsed = ProfileUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const update = parsed.data;
    if (update.username) {
      const existing = await this.prisma.profile.findFirst({
        where: { username: update.username, NOT: { userId } },
      });
      if (existing) {
        throw new BadRequestException("Username already taken");
      }
    }

    const profile = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...update,
        socialLinks: update.socialLinks ?? undefined,
      },
    });

    return this.formatProfile(profile);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const url = await this.mediaService.saveImage(file, "avatars");
    const profile = await this.prisma.profile.update({
      where: { userId },
      data: { profilePictureUrl: url },
    });
    return this.formatProfile(profile);
  }

  async uploadBanner(userId: string, file: Express.Multer.File) {
    const url = await this.mediaService.saveImage(file, "banners");
    const profile = await this.prisma.profile.update({
      where: { userId },
      data: { bannerUrl: url },
    });
    return this.formatProfile(profile);
  }

  async ensureProfile(
    userId: string,
    email: string,
    name?: string | null,
  ): Promise<Profile> {
    const existing = await this.prisma.profile.findUnique({
      where: { userId },
    });
    if (existing) return existing;

    const baseUsername = (name ?? email.split("@")[0])
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "")
      .slice(0, 20) || "user";

    let username = baseUsername;
    let counter = 1;
    while (
      await this.prisma.profile.findUnique({ where: { username } })
    ) {
      username = `${baseUsername}${counter++}`;
    }

    return this.prisma.profile.create({
      data: {
        userId,
        displayName: name ?? baseUsername,
        username,
      },
    });
  }

  private formatProfile(profile: {
    userId: string;
    displayName: string;
    username: string;
    profilePictureUrl: string | null;
    bannerUrl: string | null;
    tagline: string | null;
    bio: string | null;
    primaryRole: string;
    secondaryRoles: string[];
    experienceLevel: string;
    location: string | null;
    languages: string[];
    socialLinks: unknown;
    availability: string;
    preferredContact: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      username: profile.username,
      profilePictureUrl: profile.profilePictureUrl,
      bannerUrl: profile.bannerUrl,
      tagline: profile.tagline,
      bio: profile.bio,
      primaryRole: profile.primaryRole,
      secondaryRoles: profile.secondaryRoles,
      experienceLevel: profile.experienceLevel,
      location: profile.location,
      languages: profile.languages,
      socialLinks: profile.socialLinks,
      availability: profile.availability,
      preferredContact: profile.preferredContact,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
