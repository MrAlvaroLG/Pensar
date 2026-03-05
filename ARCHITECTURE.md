# 📦 Proyecto: PENSAR – Debate Platform

## 1️⃣ Tipo de proyecto

Monorepo basado en:

* **npm workspaces**
* **Turborepo**
* **Next.js 14 (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Prisma + PostgreSQL (Supabase)**
* **BetterAuth para autenticación**
* **Deploy en Vercel**

---

# 🏗 Estructura del repositorio

```text
pensar-monorepo/
│
├── apps/
│   └── web/        → Aplicación pública + panel de administración (/dashboard)
│
├── packages/
│   ├── db/         → Prisma schema + Prisma Client
│   ├── ui/         → Componentes reutilizables (botones, tablas, etc.)
│   └── lib/        → Utilidades compartidas (auth helpers, supabase client)
│
├── package.json    → Configuración root con workspaces
├── turbo.json      → Pipeline de build
└── .env            → Variables de entorno
```

---

# ⚙️ Configuración de Workspaces

En el `package.json` raíz:

```json
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Esto permite:

* Importar paquetes internos como `@pensar/db`
* Compartir dependencias
* Build paralelo con turbo

---

# 🧠 Arquitectura funcional

## apps/web

Responsable de:

* Landing page
* Página de debates
* Registro de usuario
* Login
* Inscripción a debates
* Descarga de bibliografía
* Panel de administración (`/dashboard`, protegido por rol ADMIN):
  * Crear debates
  * Activar/desactivar inscripciones
  * Ver inscritos
  * Filtrar por equipo (RED / BLUE)
  * Subir bibliografía
  * Exportar datos

Framework:

* Next.js 16
* App Router
* Tailwind CSS v4

---

## packages/db

Contiene:

* `prisma/schema.prisma`
* Prisma Client exportado
* Modelos:

```text
User
Debate
Registration
Bibliografia
```

Regla crítica:

```prisma
@@unique([userId, debateId])
```

Esto evita doble inscripción.

---

## packages/ui

Contiene:

* Componentes reutilizables
* Botones
* Tablas
* Layouts
* Formularios estilizados

Usado por:

* apps/web

---

## packages/lib

Contiene:

* Cliente Supabase
* Helpers de auth
* Validaciones
* Zod schemas
* Funciones compartidas

---

# 🔐 Autenticación

Sistema:

* BetterAuth
* Adapter Prisma
* Roles:
  * USER
  * ADMIN

Protección:

* Middleware en /dashboard (role = ADMIN)
* Server-side validation en inscripción

---

# 🗄 Base de datos

Proveedor:

* Supabase (PostgreSQL)

Variables necesarias:

```env
DATABASE_URL=
BetterAuth_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

# 📚 Biblioteca

Sistema:

* Supabase Storage
* Bucket: biblioteca
* PDFs subidos por admin
* Descargas públicas o con signed URL

---

# 🚀 Deploy

Hosting:

* Vercel
* Proyecto → apps/web

Root directory en Vercel:

```text
apps/web
```

---

# 📌 Reglas importantes del proyecto

1. No permitir múltiples inscripciones por usuario por debate.
2. Toda validación crítica debe ser server-side.
3. Nunca exponer SERVICE_ROLE_KEY en frontend.
4. Middleware debe proteger rutas `/dashboard` (role = ADMIN).
5. Prisma solo debe inicializarse una vez (singleton pattern).
6. Los equipos posibles son únicamente:

   * RED
   * BLUE

---

# 🎯 Objetivo del sistema

Plataforma de debates mensuales donde:

* Usuarios crean cuenta
* Eligen equipo (Rojo o Azul)
* Se inscriben a una moción específica
* Acceden a bibliografía
* Administradores gestionan el evento

No hay votación ni jueces.

---

# 🧩 Tecnologías principales

| Capa     | Tecnología             |
| -------- | ---------------------- |
| Frontend | Next.js 14             |
| Estilos  | Tailwind               |
| Backend  | Next.js Server Actions |
| DB       | PostgreSQL (Supabase)  |
| ORM      | Prisma                 |
| Auth     | BetterAuth             |
| Monorepo | npm workspaces         |
| Build    | Turborepo              |
| Hosting  | Vercel                 |
