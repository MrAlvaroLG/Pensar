# PENSAR

Plataforma web para gestionar debates mensuales.

Este repositorio ahora es una sola aplicacion Next.js (sin monorepo).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Drizzle ORM + PostgreSQL (Supabase)
- Better Auth
- Vercel

## Estructura Del Repositorio

```text
.
├── app/                    # App Router (public, auth, admin, api)
├── components/             # Componentes de negocio
├── ui/                     # Componentes UI base (shadcn)
├── lib/
│   ├── db/                 # Drizzle schema + migrations + scripts
│   ├── auth/               # Auth server/client helpers
│   └── utils/              # Utilidades de dominio
├── hooks/
├── types/
├── middleware.ts
├── ARCHITECTURE.md
├── README.md
└── package.json
```

## Requisitos

- Node.js 20+
- npm 10+
- Base de datos PostgreSQL (recomendado: Supabase)

## Instalacion

```bash
npm install
```

## Variables De Entorno

Crea un archivo `.env` en la raíz del proyecto con valores como estos:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Email / OTP
AUTH_EMAIL_DELIVERY_ENABLED="true"
NEXT_PUBLIC_AUTH_SIGNUP_OTP_ENABLED="true"
NEXT_PUBLIC_AUTH_PASSWORD_RESET_OTP_ENABLED="true"

# Cron
CRON_SECRET="..."
```

Notas importantes:

- Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` en el cliente.
- `BETTER_AUTH_URL` y `NEXT_PUBLIC_BETTER_AUTH_URL` deben apuntar al dominio correcto por entorno.

## Comandos Principales

Desde la raiz del repo:

```bash
npm run dev
npm run build
npm run lint
```

### Comandos De Base De Datos

```bash
# Generar migraciones (drizzle-kit)
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Alternativa para desarrollo (sin migraciones)
npm run db:push

# Drizzle Studio
npm run db:studio

# Seed de debates
npm run db:seed:debates
```

## App Web (Rutas Principales)

- Publico:
	- `/`
	- `/debates`
	- `/docs`
	- `/formato-y-reglas`
	- `/chat`
- Auth:
	- `/login`
	- `/signup`
	- `/forgot-password`
- Admin:
	- `/admin/dashboard` (protegido por middleware y rol `ADMIN`)

## Reglas De Dominio

- Un usuario no puede registrarse dos veces al mismo debate (`@@unique([userId, debateId])`).
- Equipos permitidos: `RED` y `BLUE`.
- Validaciones criticas siempre en servidor.
- Rutas admin protegidas por middleware.
- El pool de DB se reutiliza (singleton en dev) para evitar exceso de conexiones (ver `lib/db/index.ts`).

## Flujo De Trabajo Recomendado

1. Configurar `.env`.
2. Ejecutar `npm install`.
3. Generar migraciones con `npm run db:generate`.
4. Aplicar migraciones con `npm run db:migrate` (o `npm run db:push` para dev).
5. Levantar entorno local con `npm run dev`.

## Deploy

- Plataforma objetivo: Vercel
- Proyecto desplegado: repositorio raiz
- Root directory en Vercel: `.`

## Documentacion Adicional

- Arquitectura extendida: `ARCHITECTURE.md`
