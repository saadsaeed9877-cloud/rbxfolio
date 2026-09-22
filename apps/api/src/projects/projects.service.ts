import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  ProjectCreateSchema,
  ProjectUpdateSchema,
  MediaReorderSchema,
  slugify,
} from "@rbxfolio/types";
import { PrismaService } from "../prisma/prisma.service";
import { MediaService } from "../media/media.service";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async listMyProjects(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        tags: { include: { tag: true } },
        media: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    });

    return projects.map((p) => this.formatProject(p));
  }

  async getProject(id: string, userId?: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        media: { orderBy: { sortOrder: "asc" } },
        user: { include: { profile: true } },
      },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    if (project.visibility === "PRIVATE" && project.userId !== userId) {
      throw new ForbiddenException("Project is private");
    }

    return {
      ...this.formatProject(project),
      detailedDescription: project.detailedDescription,
      media: project.media.map((m) => ({
        id: m.id,
        type: m.type,
        url: m.url,
        sortOrder: m.sortOrder,
        mimeType: m.mimeType,
      })),
      owner: project.user.profile
        ? {
            username: project.user.profile.username,
            displayName: project.user.profile.displayName,
          }
        : null,
    };
  }

  async createProject(userId: string, data: unknown) {
    const parsed = ProjectCreateSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const slug = await this.uniqueSlug(userId, slugify(parsed.data.title));

    const project = await this.prisma.project.create({
      data: {
        userId,
        title: parsed.data.title,
        slug,
        shortDescription: parsed.data.shortDescription,
        detailedDescription: parsed.data.detailedDescription ?? "",
        completionStatus: parsed.data.completionStatus ?? "IN_PROGRESS",
        visibility: parsed.data.visibility ?? "PRIVATE",
      },
      include: {
        tags: { include: { tag: true } },
        media: true,
      },
    });

    if (parsed.data.tags?.length) {
      await this.syncTags(project.id, parsed.data.tags);
    }

    return this.getProject(project.id, userId);
  }

  async updateProject(userId: string, id: string, data: unknown) {
    await this.ensureOwnership(userId, id);
    const parsed = ProjectUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    delete updateData.tags;

    if (parsed.data.title) {
      updateData.slug = await this.uniqueSlug(
        userId,
        slugify(parsed.data.title),
        id,
      );
    }

    await this.prisma.project.update({
      where: { id },
      data: updateData,
    });

    if (parsed.data.tags) {
      await this.syncTags(id, parsed.data.tags);
    }

    return this.getProject(id, userId);
  }

  async deleteProject(userId: string, id: string) {
    await this.ensureOwnership(userId, id);
    await this.prisma.project.delete({ where: { id } });
    return { success: true };
  }

  async uploadMedia(userId: string, projectId: string, file: Express.Multer.File) {
    await this.ensureOwnership(userId, projectId);
    const isVideo = file.mimetype.startsWith("video/");
    const url = isVideo
      ? await this.mediaService.saveVideo(file, `projects/${projectId}`)
      : await this.mediaService.saveImage(file, `projects/${projectId}`);

    const maxOrder = await this.prisma.projectMedia.aggregate({
      where: { projectId },
      _max: { sortOrder: true },
    });

    const media = await this.prisma.projectMedia.create({
      data: {
        projectId,
        type: isVideo ? "VIDEO" : "IMAGE",
        url,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
    });

    if (!isVideo) {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });
      if (project && !project.thumbnailUrl) {
        await this.prisma.project.update({
          where: { id: projectId },
          data: { thumbnailUrl: url },
        });
      }
    }

    return media;
  }

  async reorderMedia(userId: string, projectId: string, data: unknown) {
    await this.ensureOwnership(userId, projectId);
    const parsed = MediaReorderSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    await Promise.all(
      parsed.data.mediaIds.map((mediaId, index) =>
        this.prisma.projectMedia.updateMany({
          where: { id: mediaId, projectId },
          data: { sortOrder: index },
        }),
      ),
    );

    return this.getProject(projectId, userId);
  }

  async deleteMedia(userId: string, projectId: string, mediaId: string) {
    await this.ensureOwnership(userId, projectId);
    await this.prisma.projectMedia.deleteMany({
      where: { id: mediaId, projectId },
    });
    return { success: true };
  }

  private async ensureOwnership(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException("Project not found");
    if (project.userId !== userId) throw new ForbiddenException();
    return project;
  }

  private async uniqueSlug(
    userId: string,
    base: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = base || "project";
    let counter = 1;
    while (true) {
      const existing = await this.prisma.project.findFirst({
        where: {
          userId,
          slug,
          ...(excludeId ? { NOT: { id: excludeId } } : {}),
        },
      });
      if (!existing) return slug;
      slug = `${base}-${counter++}`;
    }
  }

  private async syncTags(projectId: string, tagNames: string[]) {
    await this.prisma.projectTag.deleteMany({ where: { projectId } });

    for (const name of tagNames) {
      const normalized = name.trim().toLowerCase();
      if (!normalized) continue;
      const tag = await this.prisma.tag.upsert({
        where: { name: normalized },
        create: { name: normalized },
        update: {},
      });
      await this.prisma.projectTag.create({
        data: { projectId, tagId: tag.id },
      });
    }
  }

  private formatProject(project: {
    id: string;
    userId: string;
    title: string;
    slug: string;
    shortDescription: string;
    thumbnailUrl: string | null;
    completionStatus: string;
    visibility: string;
    createdAt: Date;
    updatedAt: Date;
    tags?: { tag: { name: string } }[];
    media?: { url: string }[];
  }) {
    return {
      id: project.id,
      userId: project.userId,
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      thumbnailUrl:
        project.thumbnailUrl ?? project.media?.[0]?.url ?? null,
      completionStatus: project.completionStatus,
      visibility: project.visibility,
      tags: project.tags?.map((t) => t.tag.name) ?? [],
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
