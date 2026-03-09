import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"
import { ensureAdminSession } from "@/lib/admin-auth"
import {
    isDebateRegistrationStatus,
    isDebateTeam,
    STATUS_OPTIONS,
    TEAM_OPTIONS,
} from "@/lib/debate-domain"
import { getHighlightedDebate } from "@/lib/debates"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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

export default async function DebateRegistrationsPage() {
    const highlightedDebate = await getHighlightedDebate()

    if (!highlightedDebate) {
        return (
            <section className="space-y-2">
                <h1 className="text-2xl font-semibold">Usuarios Inscritos</h1>
                <p className="text-sm text-muted-foreground">
                    No hay un debate activo o programado para administrar inscripciones.
                </p>
            </section>
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

    const redTeam = registrations.filter((item) => item.team === "red")
    const blueTeam = registrations.filter((item) => item.team === "blue")

    return (
        <section className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Usuarios Inscritos</h1>
                <p className="text-sm text-muted-foreground">
                    Debate actual: {highlightedDebate.subtitle}
                </p>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Rojo: {redTeam.length}</Badge>
                    <Badge variant="secondary">Azul: {blueTeam.length}</Badge>
                    <Badge variant="secondary">Publico: {registrations.filter((item) => item.team === "public").length}</Badge>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-3 text-lg font-semibold">Listado general</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>Numero</TableHead>
                            <TableHead>Posicion filosofica</TableHead>
                            <TableHead>Equipo</TableHead>
                            <TableHead className="text-right">Rol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {registrations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No hay usuarios inscritos en este debate.
                                </TableCell>
                            </TableRow>
                        )}
                        {registrations.map((registration) => (
                            <TableRow key={registration.id}>
                                <TableCell className="font-medium">{registration.user.name}</TableCell>
                                <TableCell>{registration.user.email}</TableCell>
                                <TableCell>{registration.user.phoneNumber ?? "-"}</TableCell>
                                <TableCell>{registration.user.postura ?? "-"}</TableCell>
                                <TableCell>
                                    <form action={updateRegistrationTeamAction} className="flex items-center gap-2">
                                        <input type="hidden" name="registrationId" value={registration.id} />
                                        <select
                                            name="team"
                                            defaultValue={registration.team}
                                            className="h-9 min-w-32 rounded-md border border-input bg-background px-2 text-sm"
                                        >
                                            {TEAM_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="submit"
                                            className="h-9 rounded-md border border-input px-3 text-xs font-medium hover:bg-accent"
                                        >
                                            Guardar
                                        </button>
                                    </form>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline">{registration.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="mb-1 text-lg font-semibold">Equipo Rojo</h3>
                    <p className="mb-3 text-xs text-muted-foreground">Selecciona 3 titulares y 2 reservas.</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Rol</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {redTeam.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        Sin inscritos en rojo.
                                    </TableCell>
                                </TableRow>
                            )}
                            {redTeam.map((registration) => (
                                <TableRow key={registration.id}>
                                    <TableCell>{registration.user.name}</TableCell>
                                    <TableCell>
                                        <form action={updateRegistrationStatusAction} className="flex items-center gap-2">
                                            <input type="hidden" name="registrationId" value={registration.id} />
                                            <select
                                                key={`${registration.id}-${registration.status}`}
                                                name="status"
                                                defaultValue={registration.status}
                                                className="h-9 min-w-36 rounded-md border border-input bg-background px-2 text-sm"
                                            >
                                                {STATUS_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                className="h-9 rounded-md border border-input px-3 text-xs font-medium hover:bg-accent"
                                            >
                                                Guardar
                                            </button>
                                        </form>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline">{registration.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="mb-1 text-lg font-semibold">Equipo Azul</h3>
                    <p className="mb-3 text-xs text-muted-foreground">Selecciona 3 titulares y 2 reservas.</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Rol</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blueTeam.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        Sin inscritos en azul.
                                    </TableCell>
                                </TableRow>
                            )}
                            {blueTeam.map((registration) => (
                                <TableRow key={registration.id}>
                                    <TableCell>{registration.user.name}</TableCell>
                                    <TableCell>
                                        <form action={updateRegistrationStatusAction} className="flex items-center gap-2">
                                            <input type="hidden" name="registrationId" value={registration.id} />
                                            <select
                                                key={`${registration.id}-${registration.status}`}
                                                name="status"
                                                defaultValue={registration.status}
                                                className="h-9 min-w-36 rounded-md border border-input bg-background px-2 text-sm"
                                            >
                                                {STATUS_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="submit"
                                                className="h-9 rounded-md border border-input px-3 text-xs font-medium hover:bg-accent"
                                            >
                                                Guardar
                                            </button>
                                        </form>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline">{registration.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    )
}
