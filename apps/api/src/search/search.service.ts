import { BadRequestException, Injectable } from "@nestjs/common";
import { BrowseQuerySchema, SearchQuerySchema } from "@rbxfolio/types";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: Record<string, unknown>) {
    const parsed = SearchQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const { q, role, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where = {
      ...(role ? { primaryRole: role } : {}),
      ...(q
        ? {
            OR: [
              { displayName: { contains: q, mode: "insensitive" as const } },
              { username: { contains: q, mode: "insensitive" as const } },
              { bio: { contains: q, mode: "insensitive" as const } },
              {
                user: {
                  projects: {
                    some: {
                      visibility: "PUBLIC" as const,
                      OR: [
                        { title: { contains: q, mode: "insensitive" as const } },
                        {
                          tags: {
                            some: {
                              tag: {
                                name: { contains: q, mode: "insensitive" as const },
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [profiles, total] = await Promise.all([
      this.prisma.profile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          user: {
            include: {
              projects: {
                where: { visibility: "PUBLIC" },
                take: 3,
                orderBy: { updatedAt: "desc" },
              },
            },
          },
        },
      }),
      this.prisma.profile.count({ where }),
    ]);

    return {
      data: profiles.map((p) => this.formatDeveloper(p)),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async browse(query: Record<string, unknown>) {
    const parsed = BrowseQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const { sort, role, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where = role ? { primaryRole: role } : {};

    const orderBy =
      sort === "updated"
        ? { updatedAt: "desc" as const }
        : { createdAt: "desc" as const };

    const [profiles, total] = await Promise.all([
      this.prisma.profile.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            include: {
              projects: {
                where: { visibility: "PUBLIC" },
                take: 3,
                orderBy: { updatedAt: "desc" },
              },
            },
          },
        },
      }),
      this.prisma.profile.count({ where }),
    ]);

    return {
      data: profiles.map((p) => this.formatDeveloper(p)),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getFeatured(limit = 6) {
    const profiles = await this.prisma.profile.findMany({
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          include: {
            projects: {
              where: { visibility: "PUBLIC" },
              take: 1,
              orderBy: { updatedAt: "desc" },
            },
          },
        },
      },
    });

    return profiles.map((p) => this.formatDeveloper(p));
  }

  private formatDeveloper(profile: {
    userId: string;
    displayName: string;
    username: string;
    profilePictureUrl: string | null;
    tagline: string | null;
    primaryRole: string;
    availability: string;
    updatedAt: Date;
    user: {
      projects: {
        id: string;
        title: string;
        thumbnailUrl: string | null;
      }[];
    };
  }) {
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      username: profile.username,
      profilePictureUrl: profile.profilePictureUrl,
      tagline: profile.tagline,
      primaryRole: profile.primaryRole,
      availability: profile.availability,
      updatedAt: profile.updatedAt,
      publicProjectCount: profile.user.projects.length,
      featuredProjects: profile.user.projects.map((p) => ({
        id: p.id,
        title: p.title,
        thumbnailUrl: p.thumbnailUrl,
      })),
    };
  }
}
