import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"
import { ensureAdminSession } from "@/lib/admin-auth"
import {
    isDebateRegistrationStatus,
    isDebateTeam,
} from "@/lib/debate-domain"
import { getHighlightedDebate } from "@/lib/debates"
import {
    RegistrationsClient,
    type RegistrationRow,
} from "./registrations-client"
import { DashboardHeader } from "@/components/admin/dashboard-header"

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

    const current = await prisma.debateRegistration.findUnique({
        where: {
            id: registrationId,
        },
    })

    if (!current) {
        throw new Error("Registro no encontrado")
    }

    await prisma.debateRegistration.update({
        where: {
            id: registrationId,
        },
        data: {
            team: nextTeam,
            status: nextTeam === "public" ? "participant" : current.status,
        },
    })

    revalidatePath("/dashboard/debate-registrations")
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

    const registration = await prisma.debateRegistration.findUnique({
        where: {
            id: registrationId,
        },
    })

    if (!registration) {
        throw new Error("Registro no encontrado")
    }

    if (registration.team === "public" && nextStatus !== "participant") {
        throw new Error("Los usuarios en público solo pueden quedar como participant")
    }

    if (nextStatus === "orator" || nextStatus === "reserve") {
        const maxAllowed = nextStatus === "orator" ? 3 : 2

        const sameRoleCount = await prisma.debateRegistration.count({
            where: {
                debateId: registration.debateId,
                team: registration.team,
                status: nextStatus,
                id: {
                    not: registration.id,
                },
            },
        })

        if (sameRoleCount >= maxAllowed) {
            throw new Error(
                nextStatus === "orator"
                    ? "Cada equipo puede tener máximo 3 titulares"
                    : "Cada equipo puede tener máximo 2 reservas",
            )
        }
    }

    await prisma.debateRegistration.update({
        where: {
            id: registration.id,
        },
        data: {
            status: nextStatus,
        },
    })

    revalidatePath("/dashboard/debate-registrations")
    revalidatePath("/debates")
}

async function deleteRegistrationAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const registrationId = formData.get("registrationId")

    if (typeof registrationId !== "string" || registrationId.length === 0) {
        throw new Error("Registro inválido")
    }

    const registration = await prisma.debateRegistration.findUnique({
        where: { id: registrationId },
    })

    if (!registration) {
        throw new Error("Registro no encontrado")
    }

    await prisma.debateRegistration.delete({
        where: { id: registrationId },
    })

    revalidatePath("/dashboard/debate-registrations")
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

    const registrations = await prisma.debateRegistration.findMany({
        where: {
            debateId: highlightedDebate.id,
            team: {
                in: ["red", "blue", "public"],
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                    postura: true,
                },
            },
        },
        orderBy: [
            {
                createdAt: "asc",
            },
            {
                user: {
                    name: "asc",
                },
            },
        ],
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
