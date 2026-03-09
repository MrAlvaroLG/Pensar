import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { UserRowActions } from "../../../../components/admin/user-row-actions"
import { ensureAdminSession } from "@/lib/admin-auth"
import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"

interface UserRow {
    id: string
    name: string
    email: string
    postura: string | null
    phoneNumber: string | null
    role: "USER" | "ADMIN"
}

async function deleteUserAction(formData: FormData) {
    "use server"

    const session = await ensureAdminSession()

    const userId = formData.get("userId")

    if (typeof userId !== "string" || userId.length === 0) {
        throw new Error("ID de usuario inválido")
    }

    if (userId === session.user.id) {
        throw new Error("No puedes eliminar tu propia cuenta")
    }

    await prisma.user.delete({
        where: {
            id: userId,
        },
    })

    revalidatePath("/dashboard/users")
}

async function makeUserAdminAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const userId = formData.get("userId")

    if (typeof userId !== "string" || userId.length === 0) {
        throw new Error("ID de usuario inválido")
    }

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            role: "ADMIN",
        },
    })

    revalidatePath("/dashboard/users")
}

function UsersSectionTable({
    users,
    title,
    emptyMessage,
    canPromote,
}: {
    users: UserRow[]
    title: string
    emptyMessage: string
    canPromote: boolean
}) {
    return (
        <section className="space-y-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Table>
                <TableCaption>{title}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Postura</TableHead>
                        <TableHead>Número</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.postura ?? "-"}</TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell className="text-right">
                                <UserRowActions
                                    userId={user.id}
                                    userName={user.name}
                                    canPromote={canPromote}
                                    onDelete={deleteUserAction}
                                    onPromote={makeUserAdminAction}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    )
}

export default async function DashboardUsersPage() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            postura: true,
            phoneNumber: true,
            role: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const adminUsers: UserRow[] = users.filter((user) => user.role === "ADMIN")
    const standardUsers: UserRow[] = users.filter((user) => user.role === "USER")

    return (
        <section className="space-y-8">
            <UsersSectionTable
                users={adminUsers}
                title="Administradores"
                emptyMessage="No hay administradores registrados."
                canPromote={false}
            />
            <UsersSectionTable
                users={standardUsers}
                title="Usuarios"
                emptyMessage="No hay usuarios con rol USER."
                canPromote
            />
        </section>
    )
}
