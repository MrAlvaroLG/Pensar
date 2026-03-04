# Project Guidelines — PENSAR Debate Platform

## Architecture

Monorepo (npm workspaces + Turborepo) with two Next.js 16 apps and three shared packages:

- `apps/web` (@pensar/web) — Public app: landing, debates, docs, auth. Port 3000.
- `apps/admin` (@pensar/admin) — Admin panel. Port 3001.
- `packages/db` (@pensar/db) — Prisma schema + client (not yet implemented).
- `packages/ui` (@pensar/ui) — Shared components (`Button`, etc.). Simple `forwardRef` components.
- `packages/lib` (@pensar/lib) — Shared utilities. Exports `cn` (simple class joiner, no `twMerge`).

Internal packages use `"*"` versions and are transpiled via `next.config.ts` → `transpilePackages: ["@pensar/ui", "@pensar/lib"]`.

## Code Style

- **TypeScript strict mode** everywhere. Path alias `@/*` → `./src/*` in both apps.
- **No semicolons** in source files (pages, components, utils). Config files may use them.
- **4-space indentation** in components/pages; 2-space in JSON/config files.
- **Double quotes** for strings and JSX attributes.
- Pages: `export default function PageName()` — Server Components by default.
- Add `"use client"` only when the component uses hooks, event handlers, or browser APIs.
- Props: prefer `interface Props { ... }` over `type`.
- Icons: `lucide-react` primary, `react-icons` only for OAuth brand icons.

## UI & Styling

- **Tailwind CSS v4** — uses `@import "tailwindcss"` (no `tailwind.config.js`). Colors via CSS variables in oklch.
- **shadcn/ui (new-york style)** in `apps/web` — components live in `src/components/ui/`. The `cn` helper at `src/lib/utils.ts` uses `clsx` + `tailwind-merge`.
- **`@pensar/ui`** has its own simpler components — the web app currently uses shadcn's versions locally via `@/components/ui/*`.
- Animations: `framer-motion` with `motion.div` pattern.

## Build & Dev

```bash
npm run dev          # Start all apps (turbo)
npm run build        # Build all (turbo, respects dependsOn: ^build)
npm run lint         # Lint all packages

# Database (from packages/db)
npm run db:generate  # prisma generate
npm run db:push      # prisma db push
npm run db:studio    # prisma studio
```

## Routing (apps/web)

Uses Next.js App Router with route groups:
- `(main)/*` — Pages with `NavBar` (landing `/`, `/debates`, `/docs`)
- `(auth)/*` — Auth pages with centered layout, no navbar (`/login`, `/signup`)
- Static data colocated in `data.ts` alongside pages/components that consume it.

## Security Rules

1. Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code.
2. All critical validation must be server-side (Server Actions or API routes).
3. Admin routes must be protected by middleware (`role === "ADMIN"`).
4. Prisma Client must use singleton pattern (see `packages/db`).
5. Teams are strictly `RED` | `BLUE` — enforce at schema and validation level.
6. One registration per user per debate (`@@unique([userId, debateId])`).

## Current Status

The project is in **early scaffolding** — auth pages are visual mockups without logic. Prisma, NextAuth, and Supabase SDK are not yet installed. Keep this in mind when adding features: infrastructure (DB, auth, middleware) needs to be set up first.
