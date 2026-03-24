import { revalidatePath } from "next/cache"
import { and, asc, count, eq, inArray, ne } from "drizzle-orm"

import { ensureAdminSession } from "@/lib/admin-auth"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import {
    isDebateRegistrationStatus,
    isDebateTeam,
} from "@/lib/debate-domain"
import { getHighlightedDebate } from "@/lib/debates"
import { db } from "@/lib/db"
import { debateRegistration } from "@/lib/db/schema"
import {
    RegistrationsClient,
    type RegistrationRow,
} from "./registrations-client"

async function updateRegistrationTeamAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const registrationId = formData.get("registrationId")
    const nextTeam = formData.get("team")

    if (typeof registrationId !== "string" || registrationId.length === 0) {
        throw new Error("Registro inválido")
    }

    if (!isDebateTeam(nextTeam)) {
        throw new Error("Equipo inválido")
    }

    const current = await db.query.debateRegistration.findFirst({
        where: eq(debateRegistration.id, registrationId),
    })

    if (!current) {
        throw new Error("Registro no encontrado")
    }

    await db
        .update(debateRegistration)
        .set({
            team: nextTeam,
            status: nextTeam === "public" ? "participant" : current.status,
            updatedAt: new Date(),
        })
        .where(eq(debateRegistration.id, registrationId))

    revalidatePath("/admin/dashboard/debate-registrations")
    revalidatePath("/debates")
}

async function updateRegistrationStatusAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const registrationId = formData.get("registrationId")
    const nextStatus = formData.get("status")

    if (typeof registrationId !== "string" || registrationId.length === 0) {
        throw new Error("Registro inválido")
    }

    if (!isDebateRegistrationStatus(nextStatus)) {
        throw new Error("Estado inválido")
    }

    const registration = await db.query.debateRegistration.findFirst({
        where: eq(debateRegistration.id, registrationId),
    })

    if (!registration) {
        throw new Error("Registro no encontrado")
    }

    if (registration.team === "public" && nextStatus !== "participant") {
        throw new Error("Los usuarios en público solo pueden quedar como participant")
    }

    if (nextStatus === "orator" || nextStatus === "reserve") {
        const maxAllowed = nextStatus === "orator" ? 3 : 2

        const [row] = await db
            .select({ n: count() })
            .from(debateRegistration)
            .where(
                and(
                    eq(debateRegistration.debateId, registration.debateId),
                    eq(debateRegistration.team, registration.team),
                    eq(debateRegistration.status, nextStatus),
                    ne(debateRegistration.id, registration.id)
                )
            )

        const sameRoleCount = row?.n ?? 0

        if (sameRoleCount >= maxAllowed) {
            throw new Error(
                nextStatus === "orator"
                    ? "Cada equipo puede tener máximo 3 titulares"
                    : "Cada equipo puede tener máximo 2 reservas",
            )
        }
    }

    await db
        .update(debateRegistration)
        .set({ status: nextStatus, updatedAt: new Date() })
        .where(eq(debateRegistration.id, registration.id))

    revalidatePath("/admin/dashboard/debate-registrations")
    revalidatePath("/debates")
}

async function deleteRegistrationAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const registrationId = formData.get("registrationId")

    if (typeof registrationId !== "string" || registrationId.length === 0) {
        throw new Error("Registro inválido")
    }

    const registration = await db.query.debateRegistration.findFirst({
        where: eq(debateRegistration.id, registrationId),
    })

    if (!registration) {
        throw new Error("Registro no encontrado")
    }

    await db.delete(debateRegistration).where(eq(debateRegistration.id, registrationId))

    revalidatePath("/admin/dashboard/debate-registrations")
    revalidatePath("/debates")
}

export default async function DebateRegistrationsPage() {
    const highlightedDebate = await getHighlightedDebate()

    if (!highlightedDebate) {
        return (
            <DashboardHeader
                title="Usuarios Inscritos"
                description="No hay un debate activo o programado para administrar inscripciones."
            />
        )
    }

    const registrations = await db.query.debateRegistration.findMany({
        where: and(
            eq(debateRegistration.debateId, highlightedDebate.id),
            inArray(debateRegistration.team, ["red", "blue", "public"])
        ),
        orderBy: [asc(debateRegistration.createdAt)],
        with: {
            user: {
                columns: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                    postura: true,
                },
            },
        },
    })

    registrations.sort((a, b) => {
        const byDate = a.createdAt.getTime() - b.createdAt.getTime()
        if (byDate !== 0) return byDate
        return a.user.name.localeCompare(b.user.name)
    })

    const rows: RegistrationRow[] = registrations.map((r) => ({
        id: r.id,
        userName: r.user.name,
        userEmail: r.user.email,
        userPhone: r.user.phoneNumber,
        userPostura: r.user.postura,
        team: r.team,
        status: r.status,
    }))

    return (
        <section className="space-y-8">
            <DashboardHeader
                title="Usuarios Inscritos"
                description={`Debate actual: ${highlightedDebate.subtitle}`}
            />

            <RegistrationsClient
                registrations={rows}
                updateTeamAction={updateRegistrationTeamAction}
                updateStatusAction={updateRegistrationStatusAction}
                deleteAction={deleteRegistrationAction}
            />
        </section>
    )
}
