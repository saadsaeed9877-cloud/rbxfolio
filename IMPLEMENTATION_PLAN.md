# RbxFolio - Complete Implementation Plan

**Project Version:** MVP → Production-Ready  
**Target Date:** September 2026  
**Platform Focus:** Roblox Developer Portfolio & Discovery Platform

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Database Schema](#database-schema)
5. [Core Features to Implement](#core-features-to-implement)
6. [API Endpoints](#api-endpoints)
7. [Frontend Pages & Components](#frontend-pages--components)
8. [Authentication & Security](#authentication--security)
9. [Media & File Handling](#media--file-handling)
10. [Search & Discovery](#search--discovery)
11. [Testing & Quality Assurance](#testing--quality-assurance)
12. [Deployment & Infrastructure](#deployment--infrastructure)
13. [Post-MVP Enhancements](#post-mvp-enhancements)
14. [Development Checklist](#development-checklist)

---

## Project Overview

**RbxFolio** is a professional portfolio and discovery platform for Roblox developers, enabling them to:
- Showcase their projects (games, scripts, assets)
- Build a searchable developer portfolio with detailed profiles
- Get discovered by studios, teams, and clients
- Manage inquiries and contact requests
- Network with other developers across 6 specialized roles

**Target Users:**
- Roblox developers (builders, scripters, UI/UX designers, animators, modelers, VFX artists)
- Game studios and team leads searching for talent
- Developers looking to hire freelancers

**Primary Goals:**
1. Create a central hub for Roblox developer portfolios
2. Enable discovery and networking
3. Facilitate professional connections
4. Build a community-driven ecosystem

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     End Users / Browsers                     │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐  ┌──────▼──────┐  ┌────▼────────┐
    │  Next.js │  │  Static CDN │  │  Analytics  │
    │  Frontend│  │   (Images)  │  │   & Logging │
    └────┬────┘  └──────┬──────┘  └────────────┘
         │               │
    ┌────▼───────────────▼─────────────────┐
    │  API Gateway / Reverse Proxy         │
    │  (Rate Limiting, CORS, Auth Check)  │
    └────┬──────────────────────────────────┘
         │
    ┌────▼─────────────────────────────────┐
    │   NestJS REST API (:3001)            │
    │  ├─ /auth/*          - Sessions      │
    │  ├─ /users/*         - Profiles      │
    │  ├─ /projects/*      - Projects CRUD │
    │  ├─ /search          - Search/Browse │
    │  ├─ /contact-requests - Messaging   │
    │  └─ /media/*         - File Upload   │
    └────┬────────────────────────────────┘
         │
    ┌────┴──────────────────────────────────┐
    │   PostgreSQL Database                 │
    │  ├─ User & Auth (Better Auth)        │
    │  ├─ Profiles & Social Links          │
    │  ├─ Projects & Media                 │
    │  ├─ Tags & Relationships             │
    │  └─ Contact Requests                 │
    └─────────────────────────────────────┘
         │ (Async)
    ┌────▼──────────────────────────────────┐
    │ Storage: Local FS or Cloudflare R2    │
    │ ├─ User Avatars & Banners            │
    │ ├─ Project Media (Images/Videos)     │
    │ └─ Generated Files                   │
    └──────────────────────────────────────┘
```

### Monorepo Structure

```
rbxfolio/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/           # Session management & guards
│   │   │   ├── users/          # Profile CRUD & avatars
│   │   │   ├── projects/       # Project management
│   │   │   ├── search/         # Search & browse APIs
│   │   │   ├── contact-requests/ # Messaging system
│   │   │   ├── media/          # File upload service
│   │   │   ├── prisma/         # DB client
│   │   │   ├── app.module.ts   # Main module
│   │   │   └── main.ts         # Bootstrap
│   │   ├── dist/               # Compiled output
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx           # Root layout
│       │   │   ├── page.tsx             # Homepage
│       │   │   ├── api/auth/[...all]/   # Auth routes
│       │   │   ├── browse/              # Browse developers
│       │   │   ├── search/              # Search page
│       │   │   ├── dashboard/
│       │   │   │   ├── page.tsx         # Dashboard home
│       │   │   │   ├── profile/         # Profile settings
│       │   │   │   ├── projects/        # My projects
│       │   │   │   ├── contact-requests/# Messages
│       │   │   │   ├── settings/        # Account settings
│       │   │   │   └── layout.tsx       # Protected layout
│       │   │   ├── login/               # Auth pages
│       │   │   ├── register/
│       │   │   ├── forgot-password/
│       │   │   ├── reset-password/
│       │   │   └── u/[username]/        # Public profiles
│       │   ├── components/
│       │   │   ├── ui/                  # shadcn/ui components
│       │   │   ├── header.tsx
│       │   │   ├── footer.tsx
│       │   │   ├── developer-card.tsx
│       │   │   ├── contact-request-form.tsx
│       │   │   ├── dashboard-nav.tsx
│       │   │   └── providers.tsx        # Providers wrapper
│       │   ├── lib/
│       │   │   ├── api.ts               # API client utilities
│       │   │   ├── utils.ts             # Helpers & formatters
│       │   │   └── hooks.ts             # Custom React hooks
│       │   └── globals.css              # Tailwind styles
│       ├── next.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── database/                # Shared DB Layer
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Data models
│   │   │   └── migrations/      # Migration files
│   │   └── package.json
│   │
│   ├── types/                  # Shared TypeScript Types & Zod Schemas
│   │   ├── src/
│   │   │   └── index.ts         # All schemas & types
│   │   └── package.json
│   │
│   ├── config/                 # Environment & Config
│   │   ├── src/
│   │   │   └── index.ts         # Zod env schemas & parsers
│   │   └── package.json
│   │
│   └── eslint-config/          # Shared ESLint config

├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
│
├── .env                         # Local dev environment
├── .env.example                 # Template
├── .env.production.example      # Production template
├── package.json                 # Root workspace
├── turbo.json                   # Turborepo config
├── tsconfig.json               # Root TypeScript config
├── README.md
└── docker-compose.yml          # Local PostgreSQL
```

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand + TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation
- **Authentication:** Better Auth (OAuth integration)
- **Animations:** Framer Motion (optional, for polish)
- **Icons:** Lucide React
- **HTTP Client:** Native `fetch` via TanStack Query
- **Analytics:** PostHog or Sentry (optional, post-MVP)

### Backend
- **Framework:** NestJS 11
- **Runtime:** Node.js 22+
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Authentication:** Better Auth
- **File Upload:** Multer
- **Validation:** Zod + class-validator
- **Security:** Helmet.js
- **Rate Limiting:** @nestjs/throttler
- **Testing:** Vitest
- **Logging:** Built-in NestJS logger + optional Sentry

### Infrastructure
- **Package Manager:** pnpm 10
- **Monorepo Tool:** Turborepo
- **Containerization:** Docker (local dev & CI)
- **Database Client:** PostgreSQL 16
- **File Storage:** Local filesystem (dev) → Cloudflare R2 (production)
- **CI/CD:** GitHub Actions
- **Deployment:** 
  - Frontend: Vercel (Next.js optimized)
  - Backend: Railway or Heroku
  - Database: Managed PostgreSQL (Railway, Render, AWS RDS)

---

## Database Schema

### Core Models (Prisma)

```prisma
// Authentication Models (Better Auth)
model User {
  id              String     @id @default(cuid())
  name            String?
  email           String     @unique
  emailVerified   Boolean    @default(false)
  image           String?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  
  sessions        Session[]
  accounts        Account[]
  profile         Profile?
  projects        Project[]
  contactRequests ContactRequest[] @relation("DeveloperContactRequests")
}

model Session {
  id        String   @id @default(cuid())
  expiresAt DateTime
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                    String   @id @default(cuid())
  accountId             String
  providerId            String
  userId                String
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// Profile & Role Models
enum PrimaryRole {
  BUILDER
  SCRIPTER
  UI_DESIGNER
  ANIMATOR
  MODELER
  VFX_ARTIST
}

enum ExperienceLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  PROFESSIONAL
}

enum Availability {
  OPEN
  BUSY
  UNAVAILABLE
}

model Profile {
  userId              String        @id
  user                User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  displayName         String
  username            String        @unique
  profilePictureUrl   String?
  bannerUrl           String?
  tagline             String?       // One-liner tagline
  bio                 String?       // Full biography
  primaryRole         PrimaryRole   @default(SCRIPTER)
  secondaryRoles      PrimaryRole[] // Up to 3 additional roles
  experienceLevel     ExperienceLevel @default(INTERMEDIATE)
  location            String?       // City/Country
  languages           String[]      // Programming languages they know
  socialLinks         Json          // {roblox, discord, github, youtube, x, website}
  availability        Availability  @default(OPEN)
  preferredContact    String?       // Email, Discord, etc.
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  
  @@index([username])
  @@index([displayName])
  @@index([primaryRole])
  @@index([updatedAt])
}

// Project Models
enum CompletionStatus {
  IN_PROGRESS
  COMPLETED
}

enum ProjectVisibility {
  PUBLIC
  PRIVATE
}

enum MediaType {
  IMAGE
  VIDEO
}

model Project {
  id                  String            @id @default(cuid())
  userId              String
  user                User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  title               String
  slug                String            // URL-friendly ID (unique per user)
  shortDescription    String            // 300 char max
  detailedDescription String            // Full description
  thumbnailUrl        String?           // Cover image
  completionStatus    CompletionStatus  @default(IN_PROGRESS)
  visibility          ProjectVisibility @default(PRIVATE)
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt
  
  media               ProjectMedia[]
  tags                ProjectTag[]
  
  @@unique([userId, slug])
  @@index([visibility, updatedAt])
  @@index([title])
}

model ProjectMedia {
  id        String    @id @default(cuid())
  projectId String
  project   Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  type      MediaType
  url       String    // Local or R2 URL
  sortOrder Int       @default(0) // Manual ordering
  mimeType  String    // image/jpeg, video/mp4, etc.
  sizeBytes Int       // File size for validation
  createdAt DateTime  @default(now())
  
  @@index([projectId, sortOrder])
}

model Tag {
  id       String       @id @default(cuid())
  name     String       @unique @default("lower")
  projects ProjectTag[]
  
  @@index([name])
}

model ProjectTag {
  projectId String
  tagId     String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([projectId, tagId])
}

// Contact Requests / Messaging
enum ContactRequestStatus {
  PENDING
  ACCEPTED
  DECLINED
}

model ContactRequest {
  id          String               @id @default(cuid())
  developerId String
  developer   User                 @relation("DeveloperContactRequests", fields: [developerId], references: [id], onDelete: Cascade)
  visitorName String               // Name of person contacting
  message     String               // Message content
  status      ContactRequestStatus @default(PENDING)
  createdAt   DateTime             @default(now())
  respondedAt DateTime?            // When developer responded
  
  @@index([developerId, status])
  @@index([createdAt])
}
```

### Database Indexes & Query Optimization
- Profile lookups by username (public profile pages)
- Projects by visibility + updated timestamp (browse/featured)
- Contact requests by developer + status (dashboard)
- Users by email (authentication)
- Full-text search on profile bio, project titles, tags (search endpoint)

---

## Core Features to Implement

### 1. Authentication & User Management

**Features:**
- ✅ OAuth Login (Discord, GitHub, Google)
- ✅ Email/Password signup (optional)
- ✅ Session management via Better Auth
- ✅ Protected routes (middleware)
- ✅ Profile auto-creation on first login
- ✅ Password reset flow
- ✅ Email verification (optional)
- ✅ Logout functionality

**Endpoints:**
```
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /auth/session
GET    /auth/[provider]/callback
```

**Pages:**
- `/login` - Login page with OAuth buttons
- `/register` - Registration form
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

### 2. User Profiles

**Features:**
- ✅ Edit profile information (displayName, bio, role, experience)
- ✅ Profile picture upload (avatar)
- ✅ Banner image upload
- ✅ Social media links (Roblox, Discord, GitHub, YouTube, X, Website)
- ✅ Professional metadata (skills, languages, location, preferred contact)
- ✅ Public profile viewing
- ✅ Member since date
- ✅ Username validation & availability check

**Endpoints:**
```
GET    /users/me
PATCH  /users/me
POST   /users/me/avatar
POST   /users/me/banner
GET    /users/:username (public)
```

**Pages:**
- `/dashboard/profile` - Edit profile
- `/u/:username` - Public profile view

### 3. Project Management

**Features:**
- ✅ Create/Edit/Delete projects
- ✅ Project metadata (title, short/detailed description, status, visibility)
- ✅ Thumbnail auto-generation
- ✅ Project slug generation (URL-friendly)
- ✅ Visibility control (public/private)
- ✅ Completion status (in progress/completed)
- ✅ Tags for categorization
- ✅ Project search by tags

**Endpoints:**
```
GET    /users/me/projects
POST   /users/me/projects
GET    /projects/:id
PATCH  /users/me/projects/:id
DELETE /users/me/projects/:id
```

**Pages:**
- `/dashboard/projects` - My projects list
- `/dashboard/projects/[id]` - Edit project
- `/u/:username/projects/:slug` - Public project view

### 4. Media Management

**Features:**
- ✅ Upload images (JPG, PNG, WebP) up to 5MB
- ✅ Upload videos (MP4, WebM) up to 100MB
- ✅ Automatic media ordering
- ✅ Reorder media within projects
- ✅ Delete media
- ✅ Thumbnail generation for videos
- ✅ Local storage (dev) → Cloudflare R2 (production)
- ✅ Optimized image delivery via CDN
- ✅ MIME type validation
- ✅ File size validation

**Endpoints:**
```
POST   /users/me/projects/:id/media
PATCH  /users/me/projects/:id/media/reorder
DELETE /users/me/projects/:id/media/:mediaId
```

### 5. Search & Discovery

**Features:**
- ✅ Full-text search across profiles, projects, tags
- ✅ Filter by primary role (6 roles)
- ✅ Browse all developers (paginated)
- ✅ Sort by newest or recently updated
- ✅ Featured developers carousel (homepage)
- ✅ Role-based filtering
- ✅ Pagination with limit/offset
- ✅ Availability status display

**Endpoints:**
```
GET    /search?q=query&role=BUILDER&page=1&limit=20
GET    /browse?sort=newest&role=BUILDER&page=1&limit=20
GET    /featured
```

**Pages:**
- `/` - Homepage with featured developers
- `/browse` - Browse all developers with filters
- `/search` - Search results page

### 6. Contact Requests / Messaging System

**Features:**
- ✅ Submit contact request to a developer
- ✅ View received contact requests (for profile owner)
- ✅ Accept/Decline/Mark as pending contact requests
- ✅ Rate limiting (5 requests per hour per visitor)
- ✅ Timestamp tracking
- ✅ Preferred contact method display (on accept)
- ✅ In-dashboard message center

**Endpoints:**
```
POST   /u/:username/contact
GET    /users/me/contact-requests
PATCH  /users/me/contact-requests/:id
GET    /users/me/contact-requests/pending/count
```

**Pages:**
- `/dashboard/contact-requests` - Message center

### 7. Dashboard

**Features:**
- ✅ Protected dashboard home page
- ✅ Navigation to all dashboard sections
- ✅ Stats overview (profile views, projects, pending messages)
- ✅ Quick access to settings
- ✅ Responsive layout (mobile-friendly)

**Pages:**
- `/dashboard` - Dashboard home
- `/dashboard/profile` - Profile settings
- `/dashboard/projects` - Project management
- `/dashboard/contact-requests` - Messages
- `/dashboard/settings` - Account settings

---

## API Endpoints

### Authentication Routes

```
POST   /api/v1/auth/signup
       Input: { email, password, name }
       Output: { user, session }

POST   /api/v1/auth/login
       Input: { email, password }
       Output: { user, session }

POST   /api/v1/auth/logout
       Output: { success: boolean }

GET    /api/v1/auth/session
       Output: { user } | null

POST   /api/v1/auth/forgot-password
       Input: { email }
       Output: { success: boolean }

POST   /api/v1/auth/reset-password
       Input: { token, password }
       Output: { success: boolean }
```

### User Routes

```
GET    /api/v1/users/me
       Requires: Auth
       Output: Profile object

PATCH  /api/v1/users/me
       Requires: Auth
       Input: Partial<ProfileUpdate>
       Output: Updated Profile

POST   /api/v1/users/me/avatar
       Requires: Auth
       Input: FormData { file: File }
       Output: { profilePictureUrl }

POST   /api/v1/users/me/banner
       Requires: Auth
       Input: FormData { file: File }
       Output: { bannerUrl }

GET    /api/v1/users/:username
       Output: Public Profile + Public Projects
```

### Project Routes

```
GET    /api/v1/users/me/projects
       Requires: Auth
       Output: Project[] (all, including private)

POST   /api/v1/users/me/projects
       Requires: Auth
       Input: ProjectCreate
       Output: Project

GET    /api/v1/projects/:id
       Output: Project details + media + owner info
       (respects visibility)

PATCH  /api/v1/users/me/projects/:id
       Requires: Auth
       Input: ProjectUpdate
       Output: Updated Project

DELETE /api/v1/users/me/projects/:id
       Requires: Auth
       Output: { success }

POST   /api/v1/users/me/projects/:id/media
       Requires: Auth
       Input: FormData { file: File }
       Output: ProjectMedia

PATCH  /api/v1/users/me/projects/:id/media/reorder
       Requires: Auth
       Input: { mediaIds: string[] }
       Output: Project

DELETE /api/v1/users/me/projects/:id/media/:mediaId
       Requires: Auth
       Output: { success }
```

### Search Routes

```
GET    /api/v1/search
       Query: { q, role, page=1, limit=20 }
       Output: { data: Developer[], pagination }

GET    /api/v1/browse
       Query: { sort=newest, role, page=1, limit=20 }
       Output: { data: Developer[], pagination }

GET    /api/v1/featured
       Query: { limit=6 }
       Output: Developer[]
```

### Contact Request Routes

```
POST   /api/v1/u/:username/contact
       Input: ContactRequestInput
       Output: { id, status, message }

GET    /api/v1/users/me/contact-requests
       Requires: Auth
       Output: ContactRequest[]

PATCH  /api/v1/users/me/contact-requests/:id
       Requires: Auth
       Input: { status: "ACCEPTED" | "DECLINED" | "PENDING" }
       Output: Updated ContactRequest

GET    /api/v1/users/me/contact-requests/pending/count
       Requires: Auth
       Output: { count: number }
```

### Health & Status Routes

```
GET    /api/v1/health
       Output: { status: "ok" }
```

---

## Frontend Pages & Components

### Public Pages

#### 1. Homepage (`/`)
- Hero section with CTA buttons
- Statistics cards (developers, projects, connections)
- Features showcase (3 cards)
- Featured developers carousel
- Call-to-action sections
- Footer with links

#### 2. Browse Page (`/browse`)
- Filter sidebar (role, sort)
- Developer grid (responsive)
- Pagination controls
- No results state

#### 3. Search Results (`/search`)
- Search input bar
- Filter options
- Results grid
- Pagination

#### 4. Public Profile (`/u/:username`)
- Banner image
- Profile header (avatar, name, role)
- Bio and metadata
- Social media links
- Projects grid
- Member since date
- Availability status
- Contact button (opens form)

### Authentication Pages

#### 1. Login (`/login`)
- OAuth buttons (Discord, GitHub, Google)
- Email/password form (optional)
- Sign up link
- Forgot password link

#### 2. Register (`/register`)
- Email/password form
- Name input
- Terms & conditions checkbox
- Sign in link
- Email verification flow (optional)

#### 3. Forgot Password (`/forgot-password`)
- Email input
- Submit button
- Back to login link

#### 4. Reset Password (`/reset-password?token=xyz`)
- New password input
- Confirm password
- Submit button

### Protected Pages (Dashboard)

#### 1. Dashboard Home (`/dashboard`)
- Welcome message
- Stats overview (views, projects, pending messages)
- Quick navigation cards
- Recent activity
- Upgrade prompts (post-MVP)

#### 2. My Profile (`/dashboard/profile`)
- Edit form (displayName, bio, role, languages, etc.)
- Avatar upload (drag & drop)
- Banner upload
- Social links form
- Location & preferred contact
- Save button with loading state

#### 3. My Projects (`/dashboard/projects`)
- Projects list/grid view
- New project button
- Edit/Delete actions per project
- Visibility toggle
- Status indicator
- Search/filter within projects

#### 4. Project Editor (`/dashboard/projects/[id]`)
- Project title & slugs
- Short & detailed description
- Completion status (dropdown)
- Visibility (public/private toggle)
- Tags input (autocomplete)
- Media gallery
  - Drag-to-reorder
  - Add media button
  - Media upload preview
  - Delete media action
- Save button
- Delete project button (with confirmation)

#### 5. Contact Requests (`/dashboard/contact-requests`)
- List of received messages
- Filter by status (pending, accepted, declined)
- Message preview
- Accept/Decline actions
- Preferred contact display on accept
- Timestamp
- Search messages

#### 6. Settings (`/dashboard/settings`)
- Account settings (email, password change)
- Privacy settings
- Notification preferences (optional)
- Danger zone (delete account)

### Design System & Component Architecture

> ⚠️ **CRITICAL RULE:** All new UI elements MUST come from `packages/design-system/`. Creating custom styles or components outside this folder is **prohibited**. This ensures consistency, maintainability, and the DRY principle across the entire application.

#### When Should You Use the Design System?

- ✅ Creating any button, input, or visual element
- ✅ Choosing font sizes, weights, or families
- ✅ Selecting colors or spacing values
- ✅ Building new pages or features
- ✅ Refactoring existing components

#### Enforcement Strategy

1. **Code Review Gates:** Every PR checked for compliance
2. **ESLint Rules:** Automated detection of inline styles (post-MVP)
3. **Component READMEs:** Examples in every component folder
4. **Team Discipline:** Commitment to using shared system
5. **Pre-commit Hooks:** Lint design-system imports before commit

---

**Unified Design System** (`packages/design-system/`)

The application uses a centralized design system to enforce consistency across all UI elements. **All new components MUST use elements from this folder—no exceptions.** This ensures DRY (Don't Repeat Yourself) principles and makes design updates faster.

**Folder Structure:**

```
packages/design-system/
├── src/
│   ├── index.ts                 # Main export file
│   ├── typography/
│   │   ├── fonts.ts             # Font definitions & sizes
│   │   ├── text.tsx             # Text component wrappers
│   │   └── README.md            # Typography guidelines
│   ├── colors/
│   │   ├── palette.ts           # Color definitions
│   │   ├── semanticColors.ts    # Semantic color mappings
│   │   └── README.md            # Color usage guide
│   ├── spacing/
│   │   ├── spacing.ts           # Spacing scale
│   │   ├── grid.ts              # Grid utilities
│   │   └── README.md            # Spacing guidelines
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx       # Button component
│   │   │   ├── ButtonVariants.ts # Button size/style variants
│   │   │   └── README.md        # Button usage
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── CardVariants.ts
│   │   │   └── README.md
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── InputVariants.ts
│   │   │   └── README.md
│   │   ├── Dropdown/
│   │   │   ├── Dropdown.tsx
│   │   │   └── README.md
│   │   ├── Dialog/
│   │   │   ├── Dialog.tsx
│   │   │   └── README.md
│   │   ├── Badge/
│   │   │   ├── Badge.tsx
│   │   │   └── README.md
│   │   ├── Avatar/
│   │   │   ├── Avatar.tsx
│   │   │   └── README.md
│   │   ├── Form/
│   │   │   ├── Form.tsx
│   │   │   └── README.md
│   │   └── [others].tsx
│   ├── icons/
│   │   ├── icons.ts             # Icon definitions
│   │   └── README.md
│   ├── animations/
│   │   ├── transitions.ts       # Animation definitions
│   │   └── README.md
│   ├── shadows/
│   │   ├── shadows.ts           # Shadow definitions
│   │   └── README.md
│   ├── borderRadius/
│   │   ├── radius.ts            # Border radius scale
│   │   └── README.md
│   ├── breakpoints/
│   │   ├── breakpoints.ts       # Responsive breakpoints
│   │   └── README.md
│   └── hooks/
│       ├── useResponsive.ts     # Responsive utilities
│       └── README.md
├── package.json
├── README.md                    # Main design system guide
└── CONTRIBUTING.md              # Rules for adding new elements
```

**Phase 1: Typography System** (First PR)

Create comprehensive font & size system:

```typescript
// packages/design-system/src/typography/fonts.ts

export const FONT_FAMILIES = {
  base: "system-ui, -apple-system, sans-serif",
  mono: "ui-monospace, monospace",
} as const;

export const FONT_SIZES = {
  xs: "0.75rem",      // 12px
  sm: "0.875rem",     // 14px
  base: "1rem",       // 16px
  lg: "1.125rem",     // 18px
  xl: "1.25rem",      // 20px
  "2xl": "1.5rem",    // 24px
  "3xl": "1.875rem",  // 30px
  "4xl": "2.25rem",   // 36px
  "5xl": "3rem",      // 48px
} as const;

export const FONT_WEIGHTS = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const LETTER_SPACING = {
  tight: "-0.02em",
  normal: "0em",
  wide: "0.02em",
  wider: "0.05em",
} as const;

// Text component wrapper
export const TextVariants = {
  // Display Sizes
  displayXL: {
    fontSize: FONT_SIZES["5xl"],
    fontWeight: FONT_WEIGHTS.black,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },
  displayLg: {
    fontSize: FONT_SIZES["4xl"],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
  },
  
  // Heading Sizes
  headingXl: {
    fontSize: FONT_SIZES["3xl"],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
  },
  headingLg: {
    fontSize: FONT_SIZES["2xl"],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
  },
  headingMd: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
  },
  headingSm: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.normal,
  },
  
  // Body Sizes
  bodyLg: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.relaxed,
  },
  bodyMd: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.relaxed,
  },
  bodySm: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.normal,
  },
  
  // Caption Sizes
  captionMd: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wide,
  },
  captionSm: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: LINE_HEIGHTS.normal,
  },
};
```

**Phase 2: Color System** (Second PR)

Create unified color palette:

```typescript
// packages/design-system/src/colors/palette.ts

export const COLORS = {
  // Grays
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },
  
  // Primary (RbxFolio Green)
  primary: {
    50: "#f0ffeb",
    100: "#dfffd6",
    200: "#b3ffad",
    300: "#86ff85",
    400: "#4dff5c",
    500: "#00ff4c",
    600: "#00e043",
    700: "#00c03d",
    800: "#009d30",
    900: "#007d26",
  },
  
  // Secondary (Dark)
  secondary: {
    50: "#f8f8f8",
    100: "#f1f1f1",
    200: "#e8e8e8",
    300: "#d0d0d0",
    400: "#a8a8a8",
    500: "#808080",
    600: "#585858",
    700: "#303030",
    800: "#1a1a1a",
    900: "#0f0f0f",
  },
  
  // Status Colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  
  // Semantic
  background: "#0f0f0f",
  foreground: "#f4f4f5",
  card: "#141414",
  border: "#222222",
  ring: "#00ff4c",
} as const;

export const SEMANTIC_COLORS = {
  background: COLORS.secondary[900],
  foreground: COLORS.gray[50],
  card: {
    background: COLORS.secondary[800],
    foreground: COLORS.gray[50],
  },
  primary: {
    base: COLORS.primary[500],
    foreground: COLORS.secondary[900],
    hover: COLORS.primary[600],
  },
  secondary: {
    base: COLORS.secondary[700],
    foreground: COLORS.gray[50],
    hover: COLORS.secondary[600],
  },
  destructive: {
    base: COLORS.error,
    foreground: "#ffffff",
    hover: "#dc2626",
  },
  muted: {
    base: COLORS.secondary[600],
    foreground: COLORS.gray[400],
  },
  border: COLORS.border,
  ring: COLORS.ring,
} as const;
```

**Phase 3: Spacing & Layout** (Third PR)

Create spacing scale and grid system:

```typescript
// packages/design-system/src/spacing/spacing.ts

export const SPACING = {
  xs: "0.25rem",    // 4px
  sm: "0.5rem",     // 8px
  md: "1rem",       // 16px
  lg: "1.5rem",     // 24px
  xl: "2rem",       // 32px
  "2xl": "2.5rem",  // 40px
  "3xl": "3rem",    // 48px
  "4xl": "4rem",    // 64px
} as const;

export const BREAKPOINTS = {
  mobile: "0px",
  tablet: "640px",
  desktop: "1024px",
  wide: "1280px",
  ultraWide: "1536px",
} as const;
```

**Phase 4: Components** (Subsequent PRs)

- Phase 4a: Button variants
- Phase 4b: Card variants
- Phase 4c: Input variants
- Phase 4d: Dropdown/Select
- Phase 4e: Dialog/Modal
- Phase 4f: Forms & validation display
- Phase 4g: Custom components (DeveloperCard, ProjectCard, etc.)

**Usage Rules (CRITICAL)**

Every developer must follow these rules:

1. **Always import from design-system:**
   ```typescript
   // ✅ CORRECT
   import { Button, FONT_SIZES, COLORS } from "@rbxfolio/design-system";
   
   // ❌ WRONG - do not create inline styles
   <button style={{ fontSize: "16px", color: "#00ff4c" }}>Click</button>
   
   // ❌ WRONG - do not use arbitrary Tailwind
   <button className="text-base text-green-500">Click</button>
   ```

2. **Use provided variants only:**
   ```typescript
   // ✅ CORRECT
   <Button variant="primary" size="lg">Submit</Button>
   <Heading variant="headingMd">Title</Heading>
   
   // ❌ WRONG - no custom styles
   <button className="custom-style">Don't do this</button>
   ```

3. **Reference design system docs in code:**
   ```typescript
   // Add comment pointing to design system
   import { Button } from "@rbxfolio/design-system";
   // See packages/design-system/src/components/Button/README.md
   ```

4. **Code review gate:**
   - All PRs checked for design-system compliance
   - No inline colors, fonts, or spacing allowed
   - ESLint rule to catch violations (post-MVP)

**Shared Components (from design-system)**

```typescript
// UI Components (all from design-system)
- Button (with variants)
- Card (with variants)
- Form / FormField / FormLabel
- Input (with variants)
- Textarea
- Select / Dropdown
- Dialog / AlertDialog
- Tabs
- Badge (with variants)
- Avatar (with variants)
- DropdownMenu
- Text / Heading (typography system)

// Custom Components (apps/web/src/components/)
- Header (uses design-system Button, Text)
- Footer (uses design-system Text)
- DeveloperCard (uses design-system Card, Badge)
- ProjectCard (uses design-system Card)
- MediaUpload (uses design-system Input)
- FormInput (uses design-system Input)
- ProtectedRoute (no design)
- PageLayout (uses design-system spacing)
- LoadingSpinner (uses design-system colors)
- ErrorBoundary (no design)
```

---

## Authentication & Security

### Features

1. **Better Auth Integration**
   - Session management via database tokens
   - Secure HTTP-only cookies
   - CSRF protection
   - Token rotation

2. **OAuth Providers** (configure all or subset)
   - Discord (ideal for gaming community)
   - GitHub (for developers)
   - Google (fallback, universal)

3. **Session Guards (NestJS)**
   - `@Public()` decorator for public endpoints
   - `@CurrentUser()` decorator for protected endpoints
   - `@OptionalUser()` decorator for sometimes-auth endpoints
   - Global SessionGuard applied to all routes

4. **Password Security**
   - Hash passwords with bcrypt
   - Salt cost: 12
   - Force password reset on first login (optional)

5. **Rate Limiting**
   - Default: 100 requests per minute per IP
   - Contact form: 5 requests per hour per IP
   - Login: 5 attempts per 15 minutes

6. **CORS**
   - Configured to allow frontend origin
   - Credentials enabled
- Helmet.js security headers

### Validation

- All inputs validated via Zod schemas
- Global ValidationPipe in NestJS
- Whitelist unknown properties
- Transform types automatically
- Custom error messages

---

## Media & File Handling

### Upload Configuration

```
Images:
- Max size: 5MB
- Formats: JPEG, PNG, WebP
- Storage path: /uploads/avatars, /uploads/banners, /uploads/projects/{projectId}

Videos:
- Max size: 100MB
- Formats: MP4, WebM
- Storage path: /uploads/projects/{projectId}
```

### File Storage Strategy

**Development:**
- Local filesystem
- Served via `/uploads` static route
- Stored in `apps/api/uploads/`

**Production:**
- Cloudflare R2 (S3-compatible)
- Public CDN URL for delivery
- Environment-based switch (via `isR2Configured()`)

### Image Optimization

- Next.js `<Image>` component (optimization at build/runtime)
- Responsive sizes
- Lazy loading
- BLURP placeholders

### Security Considerations

- MIME type validation
- File size limits
- Filename sanitization (random UUID)
- Virus scanning (optional, post-MVP)
- Rate limiting on uploads

---

## Search & Discovery

### Search Implementation

**Full-Text Search:**
- Search across: profile names, usernames, bios, project titles, tags
- Case-insensitive matching
- Pagination support (20 results per page)
- Role filtering
- Relevance sorting (optional, with PostgreSQL full-text search)

**Browse Endpoint:**
- Sorted by creation date (newest first) or update date
- Role filtering
- Pagination
- Featured developers selection algorithm:
  - Recently updated
  - Has public projects
  - Complete profiles
  - Randomized for diversity

### Indexing Strategy

- Index on `profile.username` (exact lookups)
- Index on `profile.primaryRole` (filtering)
- Index on `project.visibility + updatedAt` (browse queries)
- Full-text index on bio, project titles, tags (search queries)

---

## Testing & Quality Assurance

### Testing Strategy

#### Unit Tests
- Service layer logic (Vitest)
- Utility functions
- Validation schemas
- Coverage target: 70%+

#### Integration Tests
- API endpoint tests
- Database operations
- Authentication flows

#### E2E Tests (optional, post-MVP)
- Playwright or Cypress
- Critical user flows:
  - Sign up → Create profile → Upload project → Browse
  - Search & discover
  - Contact request flow

### Linting & Formatting

- ESLint configuration (strict rules)
- Prettier for code formatting
- TypeScript strict mode
- Pre-commit hooks (lint-staged)

### Performance Testing

- Lighthouse scores (target: >90 on Core Web Vitals)
- API response time (<200ms target)
- Database query optimization
- Image optimization verification

### Accessibility (A11y)

- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support via Aria labels
- Color contrast ratios (4.5:1 minimum)
- Form label associations
- Semantic HTML

---

## Deployment & Infrastructure

### Development Environment

#### Docker-Based Local Database Setup

**Prerequisites:**
- Node.js 20+ (use nvm)
- Docker & Docker Compose
- pnpm 10+

**Quick Start:**

```bash
# 1. Start PostgreSQL via Docker Compose
docker compose up -d

# Verify database is running
docker compose ps
# Expected output: postgres_1  postgres:16-alpine  Up

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client
pnpm db:generate

# 4. Push schema to database
pnpm db:push

# 5. Start development servers
pnpm dev

# Services
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api/v1
- PostgreSQL: localhost:5432 (rbxfolio / rbxfolio)
```

**Docker Compose Configuration:**

```yaml
# docker-compose.yml (already in project root)
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: rbxfolio
      POSTGRES_PASSWORD: rbxfolio
      POSTGRES_DB: rbxfolio
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rbxfolio"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Database Management:**

```bash
# View database logs
docker compose logs -f postgres

# Stop database (keep data)
docker compose down

# Stop database and delete data (fresh start)
docker compose down -v

# Access PostgreSQL CLI
docker compose exec postgres psql -U rbxfolio -d rbxfolio

# Backup database
docker compose exec postgres pg_dump -U rbxfolio rbxfolio > backup.sql

# Restore database
cat backup.sql | docker compose exec -T postgres psql -U rbxfolio -d rbxfolio
```

**Troubleshooting:**

```bash
# Port already in use
# Change port in docker-compose.yml or:
docker ps | grep postgres
docker kill <container-id>

# Database won't start
docker compose logs postgres

# Reset everything (fresh database)
docker compose down -v
docker compose up -d
pnpm db:push

# Connection refused
# Wait for PostgreSQL to be ready:
sleep 5 && pnpm db:push
```

**Development Workflow:**

```bash
# Daily development
pnpm dev                      # Starts both frontend & backend

# Making schema changes
# 1. Edit packages/database/prisma/schema.prisma
# 2. Create migration (optional for dev)
pnpm db:push                  # Push changes to DB

# 3. Regenerate types if needed
pnpm db:generate

# View database visually
pnpm db:studio                # Opens Prisma Studio on http://localhost:5555

# Run tests
pnpm test                     # With database running

# Backup before major changes
docker compose exec postgres pg_dump -U rbxfolio rbxfolio > backup-$(date +%Y%m%d).sql
```

### Staging Environment (Optional)

- Deployed to staging branches
- PostgreSQL staging database
- Email templates tested
- Preview URLs via Vercel/Railway

### Production Environment

**Frontend (Vercel)**
- Automatic deployments from `main`
- Environment variables in Vercel dashboard
- Image optimization via Vercel
- Edge functions for redirects (optional)
- Domain: rbxfolio.com (or custom)

**Backend (Railway or Heroku)**
- Deployment from `main`
- PostgreSQL managed database
- Environment variables securely stored
- Health checks enabled
- Domain: api.rbxfolio.com (or custom)

**Database (Managed PostgreSQL)**
- Railway, Render, or AWS RDS
- Automated backups
- Point-in-time recovery
- SSL/TLS connections only
- Regular maintenance windows

**File Storage (Cloudflare R2)**
- Configured via environment variables
- Public CDN URL for delivery
- Automatic cleanup of old files (optional)
- Cost-effective vs. AWS S3

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml (already exists in project)

name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build:
    runs-on: ubuntu-latest

    # Database service for integration tests
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: rbxfolio
          POSTGRES_PASSWORD: rbxfolio
          POSTGRES_DB: rbxfolio
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://rbxfolio:rbxfolio@localhost:5432/rbxfolio
      BETTER_AUTH_SECRET: ci-test-secret-key-minimum-32-characters-long
      BETTER_AUTH_URL: http://localhost:3000
      NEXT_PUBLIC_API_URL: http://localhost:3001/api/v1
      NEXT_PUBLIC_APP_URL: http://localhost:3000
      CORS_ORIGIN: http://localhost:3000
      PORT: 3001
      UPLOAD_DIR: ./uploads

    steps:
      - uses: actions/checkout@v4

      # Use pnpm for faster installs
      - uses: pnpm/action-setup@v4
        with:
          version: 10

      # Setup Node.js with pnpm cache
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      # Install dependencies
      - run: pnpm install --frozen-lockfile

      # Generate Prisma client & types
      - run: pnpm db:generate

      # Migrate database (using Docker Compose in CI)
      - run: pnpm db:push

      # Run type checking
      - run: pnpm lint

      # Run tests (backend + types)
      - run: pnpm test

      # Build both apps
      - run: pnpm build

      # (Optional) Run E2E tests if added
      # - run: pnpm e2e
```

**What happens in CI:**

1. **PostgreSQL Service Starts** - GitHub Actions provides a PostgreSQL 16 container
2. **Dependencies Installed** - pnpm install with cache
3. **Database Setup** - `pnpm db:push` creates schema
4. **Type Checking** - ESLint + TypeScript strict mode
5. **Tests Run** - Vitest for backend and types
6. **Build** - Both Next.js and NestJS compile successfully
7. **Pass/Fail** - PR shows green ✅ or red ❌

**For Local Development:**

Use the same Docker setup but with `docker compose up -d` for persistent database while developing.

**Key Differences:**

| Aspect | Local Dev | GitHub Actions CI |
|--------|-----------|-------------------|
| Database | `docker compose up -d` (persistent) | Service container (ephemeral) |
| Duration | Long-running | One-time per workflow |
| Data | Preserved between runs | Fresh for each run |
| Port Access | Direct (localhost:5432) | Via GitHub network |
| Logs | `docker compose logs` | Workflow output |

### Environment Configuration

**Development (.env)**
```
DATABASE_URL=postgresql://rbxfolio:rbxfolio@localhost:5432/rbxfolio
BETTER_AUTH_SECRET=dev-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
PORT=3001
```

**Production (.env.production)**
```
DATABASE_URL=postgresql://[user]:[pass]@[host]/rbxfolio
BETTER_AUTH_SECRET=[generated-long-key]
BETTER_AUTH_URL=https://rbxfolio.com
NEXT_PUBLIC_API_URL=https://api.rbxfolio.com/api/v1
NEXT_PUBLIC_APP_URL=https://rbxfolio.com
CORS_ORIGIN=https://rbxfolio.com
PORT=3001
R2_ACCOUNT_ID=[cloudflare-account-id]
R2_ACCESS_KEY_ID=[r2-token-id]
R2_SECRET_ACCESS_KEY=[r2-token-secret]
R2_BUCKET_NAME=rbxfolio-media
R2_PUBLIC_URL=https://media.rbxfolio.com
```

---

## Post-MVP Enhancements

### Phase 2 (Months 3-6)

1. **Real-Time Notifications**
   - WebSocket integration
   - Contact request notifications
   - Profile view notifications
   - Toast notifications

2. **Advanced Messaging**
   - Direct messaging (private chat)
   - Message history
   - Typing indicators
   - Read receipts

3. **Portfolio Customization**
   - Custom profile themes
   - Reorderable sections
   - Custom backgrounds
   - Portfolio templates

4. **Collaboration Tools**
   - Project collaboration requests
   - Team profiles
   - Shared projects
   - Project collaboration status

5. **Analytics**
   - Profile view tracking
   - Click-through rates
   - Popular projects tracking
   - Developer rankings/leaderboards

### Phase 3 (Months 6-12)

1. **Monetization**
   - Premium profiles
   - Featured listings
   - Portfolio analytics dashboard
   - Job listings board

2. **AI Features**
   - Profile completion suggestions
   - Project description auto-generation
   - Talent matching algorithm
   - Smart search with ML ranking

3. **Community Features**
   - Comments on projects
   - Ratings/reviews of developers
   - Showcase collections/galleries
   - Developer blog platform

4. **Advanced Search**
   - Elasticsearch integration
   - Filters by tools/technologies used
   - Geographic search
   - Availability scheduling

5. **Integrations**
   - GitHub portfolio import
   - Roblox API integration (profile sync)
   - Marketplace integrations

---

## Development Checklist

> **CRITICAL:** Before starting ANY feature, read `DESIGN_SYSTEM_CHECKLIST.md` and understand the design system rules. Every PR must comply with design-system standards.

### Pre-Development Requirements

- [ ] Read `DESIGN_SYSTEM_GUIDE.md` - comprehensive guide
- [ ] Read `DESIGN_SYSTEM_CHECKLIST.md` - before every PR
- [ ] Read `packages/design-system/CONTRIBUTING.md` - for adding elements
- [ ] Understand that **all UI elements must come from design-system**
- [ ] Bookmark design-system folder for quick reference

### Enforcement Strategy

```
Every PR must pass:
✓ Design System Compliance Check
  - No inline colors
  - No hardcoded sizes/spacing
  - All components from design-system
  - Proper imports from main index

✓ Code Review (Design System focused)
  - Reviewer checks for violations
  - Reviewer references DESIGN_SYSTEM_CHECKLIST.md
  - No PR merged without compliance

✓ ESLint Rules (post-MVP)
  - Automated detection of violations
  - Pre-commit hooks block commits
  - CI/CD checks before merge
```

### Phase 1: MVP (Current - 2 months)

- [ ] **Setup & Infrastructure**
  - [ ] Database schema created & migrated
  - [ ] Docker Compose configured for PostgreSQL
  - [ ] Local database setup documentation
  - [ ] Database backup/restore scripts
  - [ ] CI/CD pipeline with Docker services
  - [ ] Development environment setup
  - [ ] Deployment infrastructure ready
  - [ ] Environment variables documented

- [ ] **Design System Unification** (Step-by-step refactoring)
  - [ ] Phase 1: Typography System
    - [ ] Create `packages/design-system/` package
    - [ ] Define font families, sizes, weights
    - [ ] Create Text component wrappers
    - [ ] Document typography guidelines
    - [ ] Convert existing pages to use typography system
    - [ ] PR #1: Typography System
  - [ ] Phase 2: Color System
    - [ ] Define color palette
    - [ ] Map semantic colors
    - [ ] Create color documentation
    - [ ] Convert existing pages to use color system
    - [ ] Add color validation ESLint rules
    - [ ] PR #2: Color System
  - [ ] Phase 3: Spacing & Layout
    - [ ] Define spacing scale
    - [ ] Define breakpoints & grid
    - [ ] Create layout utilities
    - [ ] Document spacing guidelines
    - [ ] Refactor layouts to use spacing scale
    - [ ] PR #3: Spacing & Layout
  - [ ] Phase 4: Component Variants
    - [ ] PR #4a: Button System (all variants)
    - [ ] PR #4b: Card System (all variants)
    - [ ] PR #4c: Input System (all variants)
    - [ ] PR #4d: Form & Validation Components
    - [ ] PR #4e: Dropdown & Select Components
    - [ ] PR #4f: Dialog & Modal Components
    - [ ] PR #4g: Badge & Avatar Components
  - [ ] Phase 5: Custom Components Refactoring
    - [ ] Refactor DeveloperCard to use design-system
    - [ ] Refactor ProjectCard to use design-system
    - [ ] Refactor Header to use design-system
    - [ ] Refactor Footer to use design-system
    - [ ] Refactor Forms to use design-system
    - [ ] PR #5: Custom Components Refactoring
  - [ ] Design System Enforcement
    - [ ] Document usage rules in design-system README
    - [ ] Add ESLint rules to prevent inline styles
    - [ ] Add code review checklist for PR reviews
    - [ ] Update contribution guidelines
    - [ ] Create design-system component audit tool (optional)

- [ ] **Authentication**
  - [ ] Better Auth configured
  - [ ] OAuth providers setup (Discord, GitHub, Google)
  - [ ] Session management working
  - [ ] Protected routes implemented
  - [ ] Password reset flow implemented
  - [ ] Email verification (optional)

- [ ] **User Profiles**
  - [ ] Profile creation on signup
  - [ ] Profile edit page complete
  - [ ] Avatar upload working
  - [ ] Banner upload working
  - [ ] Social links management
  - [ ] Public profile viewing
  - [ ] Username validation

- [ ] **Project Management**
  - [ ] Project CRUD endpoints
  - [ ] Project creation page
  - [ ] Project editor page
  - [ ] Delete project confirmation
  - [ ] Slug generation
  - [ ] Visibility control

- [ ] **Media Handling**
  - [ ] Image upload endpoints
  - [ ] Video upload endpoints
  - [ ] Media reordering
  - [ ] Media deletion
  - [ ] Local storage working
  - [ ] R2 fallback configured

- [ ] **Search & Discovery**
  - [ ] Search endpoint with Zod validation
  - [ ] Browse endpoint with pagination
  - [ ] Featured developers selection
  - [ ] Role-based filtering
  - [ ] Search UI page
  - [ ] Browse UI page
  - [ ] Homepage featured section

- [ ] **Contact Requests**
  - [ ] Submit contact form
  - [ ] List messages endpoint
  - [ ] Accept/decline functionality
  - [ ] Rate limiting enabled
  - [ ] Contact requests page
  - [ ] Message preview

- [ ] **Dashboard**
  - [ ] Protected routes with auth guard
  - [ ] Dashboard home page
  - [ ] Navigation between sections
  - [ ] Responsive mobile layout

- [ ] **Frontend UI**
  - [ ] shadcn/ui components setup
  - [ ] Tailwind CSS configured
  - [ ] Header & footer
  - [ ] Forms with validation display
  - [ ] Loading states
  - [ ] Error states
  - [ ] Dark mode support (optional)

- [ ] **Testing**
  - [ ] Unit tests for services
  - [ ] API endpoint tests
  - [ ] Validation schema tests
  - [ ] E2E tests for critical flows

- [ ] **Documentation**
  - [ ] API documentation (OpenAPI/Swagger)
  - [ ] Development setup guide
  - [ ] Deployment guide
  - [ ] Database schema documentation

- [ ] **Performance & Security**
  - [ ] Rate limiting configured
  - [ ] CORS properly configured
  - [ ] HTTPS enforced
  - [ ] SQL injection prevention (Prisma)
  - [ ] XSS prevention
  - [ ] CSRF protection via Better Auth
  - [ ] Password hashing with bcrypt
  - [ ] Environment variables not exposed

- [ ] **Pre-Launch**
  - [ ] Production database migrated
  - [ ] File storage (R2) configured
  - [ ] Email service configured (Resend)
  - [ ] Domain DNS records
  - [ ] SSL certificates
  - [ ] Monitoring/logging setup
  - [ ] Smoke tests passing
  - [ ] Performance benchmarks met

---

## Design System Implementation Guide

### PR Review Checklist for Design System

Every PR must pass these checks:

**✓ Design System Compliance**
```
- [ ] No inline styles (className="text-16px color-#00ff4c")
- [ ] No arbitrary Tailwind classes (className="text-base text-green-500")
- [ ] All colors from COLORS or SEMANTIC_COLORS
- [ ] All font sizes from FONT_SIZES or TextVariants
- [ ] All spacing from SPACING constant
- [ ] All components from design-system package
- [ ] No custom button/card/input implementations
- [ ] Proper ESLint design-system rules followed
```

**✓ Documentation Compliance**
```
- [ ] Component has corresponding README.md
- [ ] README includes usage examples
- [ ] README documents all props/variants
- [ ] README links to related components
- [ ] Changes documented in design-system CHANGELOG
```

### Post-Merge: Auto-Audit Tool

Once design system is mature, run:

```bash
# Detect design-system violations
pnpm design-system:audit

# Output:
# ✗ apps/web/src/components/Header.tsx:12
#   inline style: color: #00ff4c
#   suggestion: use COLORS.primary[500] from @rbxfolio/design-system

# ✗ apps/web/src/app/page.tsx:45
#   arbitrary class: text-24px
#   suggestion: use fontSize from TextVariants.headingMd
```

---

## Success Criteria

### MVP Launch Metrics

- [ ] **Uptime:** 99%+ availability
- [ ] **Performance:**
  - Page load: <2 seconds (Lighthouse >85)
  - API response: <200ms (p95)
  - Database query: <100ms (p95)
- [ ] **Security:**
  - No OWASP Top 10 vulnerabilities
  - All passwords hashed & salted
  - HTTPS everywhere
  - Rate limiting active
- [ ] **User Experience:**
  - All forms validating correctly
  - Mobile responsive (all pages)
  - Accessibility score >90
  - Zero console errors in production
- [ ] **Data Integrity:**
  - Database backups automated
  - No data loss in deployments
  - Transaction consistency maintained

### Post-Launch Goals (Month 3-6)

- 1,000+ registered developers
- 5,000+ projects uploaded
- 10,000+ monthly active users
- <5% bounce rate on homepage
- >50% featured → profile click-through rate

---

## Design System Enforcement Documentation

### Key Documents

1. **DESIGN_SYSTEM_GUIDE.md** - Complete design system reference
   - Overview and critical rules
   - Phase-based implementation
   - Usage examples
   - Common mistakes to avoid
   - FAQ

2. **DESIGN_SYSTEM_CHECKLIST.md** - Daily developer reference
   - Pre-coding checklist
   - Code review checklist
   - Pre-commit verification
   - PR checklist
   - Common scenarios

3. **packages/design-system/CONTRIBUTING.md** - For adding new elements
   - Step-by-step guides for tokens and components
   - PR checklist for design-system
   - Design decision guidelines
   - Common patterns

### Enforcement Mechanisms

**During Development:**
- Read DESIGN_SYSTEM_CHECKLIST.md before coding
- Use pre-commit hooks to catch violations
- Reference design-system folder structure

**During Code Review:**
- Reviewer checks DESIGN_SYSTEM_CHECKLIST.md items
- Block PRs with inline styles/colors/spacing
- Enforce imports from main index
- Verify component variants used correctly

**During CI/CD:**
- ESLint rules catch hardcoded colors (post-MVP)
- Linting blocks suspicious patterns
- Tests verify design-system compliance

**During Deployment:**
- Production builds reject non-compliant code
- Design system audit tool runs (post-MVP)

### Team Responsibilities

**Every Developer:**
- Read design system docs before coding
- Always check design-system first
- Use design-system elements exclusively
- Ask before creating new elements
- Report missing elements to team

**Code Reviewers:**
- Verify design-system compliance
- Use DESIGN_SYSTEM_CHECKLIST.md
- Reference specific violations with examples
- Request changes if non-compliant

**Design System Maintainers:**
- Review design-system PRs
- Ensure consistency with existing patterns
- Update documentation
- Maintain CHANGELOG.md
- Help team with questions

### Success Criteria for Design System

**Phase 1 (Typography) Complete when:**
- ✅ All text in app uses TextVariants or FONT_SIZES
- ✅ No hardcoded font sizes remain
- ✅ All pages converted to use typography system
- ✅ Zero violations in code review

**Phase 2 (Colors) Complete when:**
- ✅ All colors use COLORS or SEMANTIC_COLORS
- ✅ No hardcoded hex values in code
- ✅ All pages converted to use color system
- ✅ ESLint rules preventing violations

**Phase 3 (Spacing) Complete when:**
- ✅ All spacing uses SPACING constant
- ✅ No hardcoded pixel values for margins/padding
- ✅ Breakpoints defined and used
- ✅ Grid system implemented

**Phase 4 (Components) Complete when:**
- ✅ All components (Button, Card, Input, etc.) in design-system
- ✅ Zero custom implementations in feature files
- ✅ 100% of pages using design-system components
- ✅ All variants documented with examples

**Phase 5 (Refactoring) Complete when:**
- ✅ All custom components refactored to use design-system
- ✅ DeveloperCard, ProjectCard fully compliant
- ✅ Forms and validation using design-system
- ✅ Zero violations across entire codebase

---

## Summary: From MVP to Design Excellence

This implementation plan combines:

1. **Technical Foundation**
   - Docker-based PostgreSQL for consistent dev environment
   - Monorepo structure with shared packages
   - Modern tech stack (Next.js, NestJS, Prisma)

2. **Disciplined Design System**
   - Centralized design tokens and components
   - Phase-based rollout to manage complexity
   - Strict enforcement rules to prevent violations
   - Clear documentation for developers

3. **Production-Ready Architecture**
   - Secure authentication with Better Auth
   - Rate limiting and validation
   - File storage strategy (local dev → R2 production)
   - CI/CD pipeline with Docker services

4. **Developer Experience**
   - Clear checklists and guidelines
   - Reusable components and patterns
   - Quick setup with Docker Compose
   - Comprehensive documentation

**Result:** A maintainable, scalable, design-consistent application that's easier to build and harder to break.

---

## File Structure Summary

```
Total estimated files:
- Backend: ~40 files (services, controllers, guards, modules)
- Frontend: ~60 files (pages, components, hooks, utilities)
- Database: ~1 migration file per schema update
- Config: ~5 files (env, turbo, tsconfig, eslint)
- CI/CD: 1 workflow file

Total lines of code (estimated):
- Backend: ~15,000 LOC
- Frontend: ~12,000 LOC
- Shared packages: ~2,000 LOC
- Total MVP: ~30,000 LOC
```

---

## Conclusion

RbxFolio is a complete web application for Roblox developers to showcase their work and discover opportunities. The implementation plan covers all necessary features from authentication to deployment, with clear milestones and success criteria.

**Next Steps:**
1. Begin with database schema finalization
2. Set up development environment
3. Implement authentication & profiles
4. Build project management features
5. Add search & discovery
6. Deploy and launch MVP
7. Gather user feedback
8. Plan Phase 2 enhancements

**Estimated Timeline:**
- MVP Development: 8-12 weeks
- Testing & Polish: 2-3 weeks
- Launch & Monitoring: Ongoing
