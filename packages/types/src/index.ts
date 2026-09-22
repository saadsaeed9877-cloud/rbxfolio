import { z } from "zod";

export const PrimaryRoleSchema = z.enum([
  "BUILDER",
  "SCRIPTER",
  "UI_DESIGNER",
  "ANIMATOR",
  "MODELER",
  "VFX_ARTIST",
]);

export const ExperienceLevelSchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "PROFESSIONAL",
]);

export const AvailabilitySchema = z.enum(["OPEN", "BUSY", "UNAVAILABLE"]);

export const CompletionStatusSchema = z.enum(["COMPLETED", "IN_PROGRESS"]);

export const ProjectVisibilitySchema = z.enum(["PUBLIC", "PRIVATE"]);

export const ContactRequestStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "DECLINED",
]);

export const SocialLinksSchema = z.object({
  roblox: z.string().url().optional().or(z.literal("")),
  discord: z.string().max(100).optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  x: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

export const ProfileUpdateSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Username must be lowercase alphanumeric with _ or -")
    .optional(),
  tagline: z.string().max(120).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  primaryRole: PrimaryRoleSchema.optional(),
  secondaryRoles: z.array(PrimaryRoleSchema).max(3).optional(),
  experienceLevel: ExperienceLevelSchema.optional(),
  location: z.string().max(100).optional().nullable(),
  languages: z.array(z.string().max(50)).max(10).optional(),
  socialLinks: SocialLinksSchema.optional(),
  availability: AvailabilitySchema.optional(),
  preferredContact: z.string().max(200).optional().nullable(),
});

export const ProjectCreateSchema = z.object({
  title: z.string().min(2).max(100),
  shortDescription: z.string().min(10).max(300),
  detailedDescription: z.string().max(10000).optional(),
  completionStatus: CompletionStatusSchema.optional(),
  visibility: ProjectVisibilitySchema.optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial();

export const ContactRequestSchema = z.object({
  visitorName: z.string().min(2).max(100),
  message: z.string().min(10).max(1000),
});

export const ContactRequestUpdateSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "PENDING"]),
});

export const MediaReorderSchema = z.object({
  mediaIds: z.array(z.string()).min(1),
});

export const SearchQuerySchema = z.object({
  q: z.string().max(100).optional(),
  role: PrimaryRoleSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const BrowseQuerySchema = z.object({
  sort: z.enum(["newest", "updated"]).default("newest"),
  role: PrimaryRoleSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const MediaUploadConstraints = {
  image: {
    maxSizeBytes: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  video: {
    maxSizeBytes: 100 * 1024 * 1024,
    allowedMimeTypes: ["video/mp4", "video/webm"],
  },
} as const;

export type PrimaryRole = z.infer<typeof PrimaryRoleSchema>;
export type ExperienceLevel = z.infer<typeof ExperienceLevelSchema>;
export type Availability = z.infer<typeof AvailabilitySchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;
export type ContactRequestInput = z.infer<typeof ContactRequestSchema>;
export type SocialLinks = z.infer<typeof SocialLinksSchema>;

export const ROLE_LABELS: Record<PrimaryRole, string> = {
  BUILDER: "Builder",
  SCRIPTER: "Scripter",
  UI_DESIGNER: "UI Designer",
  ANIMATOR: "Animator",
  MODELER: "Modeler",
  VFX_ARTIST: "VFX Artist",
};

export const AVAILABILITY_LABELS: Record<
  z.infer<typeof AvailabilitySchema>,
  string
> = {
  OPEN: "Open for work",
  BUSY: "Busy",
  UNAVAILABLE: "Not available",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
