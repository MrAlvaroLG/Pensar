# 📦 Proyecto: PENSAR – Debate Platform

## 1️⃣ Tipo de proyecto

Single app basado en:

* **Next.js 16 (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Drizzle ORM + PostgreSQL (Supabase)**
* **BetterAuth para autenticación**
* **Deploy en Vercel**

---

# 🏗 Estructura del repositorio

```text
pensar/
│
├── app/            → Next.js App Router (público + /admin/dashboard)
├── components/     → UI compartida
├── lib/            → Utilidades, auth, DB
│   └── db/         → Esquema Drizzle (`schema.ts`), migraciones, scripts
├── drizzle.config.ts
├── package.json
└── .env / .env.local
```

---

# ⚙️ Configuración de Workspaces

No aplica: este repo es una sola aplicación (sin `npm workspaces` ni Turborepo).

---

# 🧠 Arquitectura funcional

## app/

Responsable de:

* Landing page
* Página de debates
* Registro de usuario
* Login
* Inscripción a debates
* Descarga de bibliografía
* Panel de administración (`/admin/dashboard`, protegido por rol ADMIN):
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

## lib/db

Contiene:

* [`lib/db/schema.ts`](lib/db/schema.ts) — tablas, enums y relaciones Drizzle
* [`lib/db/index.ts`](lib/db/index.ts) — cliente `db` (pool `pg` singleton) y re-export del esquema
* [`lib/db/migrations/`](lib/db/migrations/) — migraciones generadas con `drizzle-kit`
* Modelos principales: `user`, `debate`, `debate_registration`, biblioteca, chat, etc.

Regla crítica: restricción única compuesta `(userId, debateId)` en `debate_registration` para evitar doble inscripción.

---

## ui/

Contiene:

* Componentes reutilizables
* Botones
* Tablas
* Layouts
* Formularios estilizados

Usado por:

* app/

---

## lib/

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
* Adapter Drizzle (`@better-auth/drizzle-adapter`)
* Roles:
  * USER
  * ADMIN

Protección:

* Middleware en rutas `/admin/*` + validación por rol en layouts server-side
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
* Proyecto → app/

Root directory en Vercel: raíz del repositorio (donde está `package.json` de la app), salvo que uses un subdirectorio distinto en tu proyecto.

---

# 📌 Reglas importantes del proyecto

1. No permitir múltiples inscripciones por usuario por debate.
2. Toda validación crítica debe ser server-side.
3. Nunca exponer SERVICE_ROLE_KEY en frontend.
4. Middleware debe proteger rutas `/admin/dashboard` (role = ADMIN).
5. El pool de Postgres / cliente Drizzle debe reutilizarse (singleton en desarrollo, ver `lib/db/index.ts`).
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
| Frontend | Next.js 16             |
| Estilos  | Tailwind               |
| Backend  | Next.js Server Actions |
| DB       | PostgreSQL (Supabase)  |
| ORM      | Drizzle                |
| Auth     | BetterAuth             |
| Monorepo | No aplica (app única)  |
| Build    | —                      |
| Hosting  | Vercel                 |
