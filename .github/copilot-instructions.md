# Project Guidelines — PENSAR Debate Platform

## Architecture

Single Next.js 16 app at the repository root (not a published npm workspaces monorepo):

- **App** — Public site + admin panel (`/admin/dashboard`): landing, debates, library/docs, auth, admin. Port 3000 in dev.
- **Database** — [`lib/db/schema.ts`](lib/db/schema.ts) (Drizzle ORM) + [`lib/db/index.ts`](lib/db/index.ts) exports `db` using a shared `pg` pool (singleton in development).
- **Auth** — Better Auth with `@better-auth/drizzle-adapter`, PostgreSQL provider `pg`, `camelCase: true`, optional `experimental.joins`.

Path alias `@/*` maps to the project root (see `tsconfig.json`). For broader setup and architecture, link to [`README.md`](../README.md) and [`ARCHITECTURE.md`](../ARCHITECTURE.md) instead of duplicating their contents. Treat current source files as the source of truth if those docs drift.

## Code Style

- **TypeScript strict mode** everywhere.
- **No semicolons** in source files (pages, components, utils). Config files may use them.
- **4-space indentation** in components/pages; 2-space in JSON/config files.
- **Double quotes** for strings and JSX attributes.
- Pages: `export default function PageName()` — Server Components by default.
- Add `"use client"` only when the component uses hooks, event handlers, or browser APIs.
- Props: prefer `interface Props { ... }` over `type`.
- Icons: `lucide-react` primary, `react-icons` only for OAuth brand icons.

## UI & Styling

- **Tailwind CSS v4** — `@import "tailwindcss"`. Colors via CSS variables in oklch.
- **shadcn/ui** — base components live under `@/ui/*`; domain/business components live under `@/components/*`.
- Keep Server Components as the default. Add client components only at the interaction boundary, and pass serialized data from server code into them.
- Use `revalidatePath` after Server Actions or API mutations that affect public/admin views.

## Build & Dev

```bash
npm run dev              # Next.js dev server (port 3000)
npm run build
npm run lint

# Database (Drizzle)
npm run db:generate      # drizzle-kit generate
npm run db:push          # drizzle-kit push
npm run db:migrate       # drizzle-kit migrate
npm run db:studio        # drizzle-kit studio
npm run db:seed:debates  # tsx lib/db/scripts/seed-debates.ts
```

`drizzle.config.ts` loads `.env` / `.env.local`; exclude from `tsc` via `tsconfig.json`.

## Routing

Next.js App Router with route groups under `app/`: public routes, `(admin)/admin/dashboard`, auth pages, etc.

Admin routing is layered:

- `middleware.ts` checks for a Better Auth session cookie on `/admin/*`; it does not validate roles at the edge.
- `app/(admin)/admin/dashboard/layout.tsx` allows `ADMIN` and `PUBLISHER` into the dashboard shell.
- `app/(admin)/admin/dashboard/(admin-only)/layout.tsx` and `ensureAdminSession()` gate admin-only areas.
- `ensureLibrarySession()` allows `ADMIN` and `PUBLISHER` for library management and upload APIs.

## Security Rules

1. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code.
2. All critical validation must be server-side (Server Actions or API routes).
3. Middleware only checks session presence; role checks must stay in server layouts/helpers/actions/routes.
4. Reuse the shared `db` / pool from `@/lib/db` — do not create new pools per request.
5. Roles are `USER` | `ADMIN` | `PUBLISHER`; keep publisher access limited to library flows unless existing code says otherwise.
6. One registration per user per debate (unique on `userId` + `debateId` in `debate_registration`).

## Domain Rules

- Registration teams use the schema enum values `none` | `red` | `blue` | `public`; public route params `rojo` | `azul` | `publico` map through `@/lib/debate-domain`.
- Chat teams are only `red` | `blue`.
- Summary block teams are `RED` | `BLUE` | `PUBLIC`.
- Reuse helpers from `@/lib/debate-domain`, `@/lib/debates`, and `@/lib/debate-form-helpers` instead of duplicating labels or enum guards.

## Current Status

The app uses Drizzle + Better Auth + Supabase (Postgres + Storage). Keep server-side checks for admin, publisher, upload, and registration rules when changing data access.
