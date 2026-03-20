# PENSAR

Plataforma web para gestionar debates mensuales.

Este repositorio es un monorepo con `npm workspaces` y `Turborepo` que contiene:

- App web publica + panel admin (`apps/web`)
- Paquete de base de datos con Prisma (`packages/db`)
- Paquete de UI compartida (`packages/ui`)
- Paquete de utilidades compartidas (`packages/lib`)

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Prisma + PostgreSQL (Supabase)
- Better Auth
- Vercel

## Estructura Del Repositorio

```text
.
├── apps/
│   └── web/                # App principal (public + auth + admin)
├── packages/
│   ├── db/                 # Prisma schema, client y scripts DB
│   ├── ui/                 # Componentes compartidos
│   └── lib/                # Utilidades compartidas
├── ARCHITECTURE.md
├── README.md
├── package.json
└── turbo.json
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

Crea un archivo `.env` en la raiz del monorepo con valores como estos:

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
RESEND_API_KEY="re_..."
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
# Prisma Client
npm run db:generate --workspace @pensar/db

# Sync schema -> DB
npm run db:push --workspace @pensar/db

# Prisma Studio
npm run db:studio --workspace @pensar/db

# Seed de debates
npm run db:seed:debates --workspace @pensar/db
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
	- `/dashboard` (protegido por middleware y rol `ADMIN`)

## Reglas De Dominio

- Un usuario no puede registrarse dos veces al mismo debate (`@@unique([userId, debateId])`).
- Equipos permitidos: `RED` y `BLUE`.
- Validaciones criticas siempre en servidor.
- Rutas admin protegidas por middleware.
- Prisma debe inicializarse con singleton.

## Flujo De Trabajo Recomendado

1. Configurar `.env`.
2. Ejecutar `npm install`.
3. Generar cliente Prisma con `npm run db:generate --workspace @pensar/db`.
4. Aplicar schema con `npm run db:push --workspace @pensar/db`.
5. Levantar entorno local con `npm run dev`.

## Deploy

- Plataforma objetivo: Vercel
- Proyecto desplegado: `apps/web`
- Root directory en Vercel: `apps/web`

## Documentacion Adicional

- Arquitectura extendida: `ARCHITECTURE.md`
