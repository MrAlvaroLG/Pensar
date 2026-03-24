# Project Guidelines — PENSAR Debate Platform

## Architecture

Single Next.js 16 app at the repository root (not a published npm workspaces monorepo):

- **App** — Public site + admin panel (`/admin/dashboard`): landing, debates, library/docs, auth, admin. Port 3000 in dev.
- **Database** — [`lib/db/schema.ts`](lib/db/schema.ts) (Drizzle ORM) + [`lib/db/index.ts`](lib/db/index.ts) exports `db` using a shared `pg` pool (singleton in development).
- **Auth** — Better Auth with `@better-auth/drizzle-adapter`, PostgreSQL provider `pg`, `camelCase: true`, optional `experimental.joins`.

Path alias `@/*` maps to the project root (see `tsconfig.json`).

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
- **shadcn/ui** — components under `@/components/ui/*` and `@/ui/*` as used in the repo.

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

## Security Rules

1. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code.
2. All critical validation must be server-side (Server Actions or API routes).
3. Admin routes must be protected by middleware (`role === "ADMIN"`).
4. Reuse the shared `db` / pool from `@/lib/db` — do not create new pools per request.
5. Chat/debate teams for participants are `red` | `blue` (see schema enums).
6. One registration per user per debate (unique on `userId` + `debateId` in `debate_registration`).

## Current Status

The app uses Drizzle + Better Auth + Supabase (Postgres + Storage). Keep server-side checks for admin and registration rules when changing data access.
