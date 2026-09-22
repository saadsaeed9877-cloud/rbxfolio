# RbxFolio

Professional portfolio platform for Roblox developers.

## Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, shadcn/ui, TanStack Query, Better Auth
- **Backend:** NestJS REST API
- **Database:** PostgreSQL + Prisma
- **Monorepo:** pnpm + Turborepo

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker

### Setup

```bash
# Start PostgreSQL
docker compose up -d

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
cp .env.example apps/web/.env
cp .env.example apps/api/.env

# Run database migrations
pnpm db:push

# Start dev servers (web :3000, api :3001)
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001/api/v1

## Project structure

```
apps/web     — Next.js frontend
apps/api     — NestJS backend
packages/database — Prisma schema & client
packages/types    — Shared Zod schemas
packages/config   — Environment validation
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm test` | Run tests |
