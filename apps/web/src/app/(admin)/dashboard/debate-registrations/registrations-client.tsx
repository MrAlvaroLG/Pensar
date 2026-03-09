"use client"

import { useRef, useState, useMemo, useCallback, useTransition } from "react"
import {
    type ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    TEAM_OPTIONS,
    STATUS_OPTIONS,
    getStatusLabel,
    type DebateRegistrationStatus,
} from "@/lib/debate-domain"

export interface RegistrationRow {
    id: string
    userName: string
    userEmail: string
    userPhone: string | null
    userPostura: string | null
    team: string
    status: string
}

interface RegistrationCounts {
    red: { orator: number; reserve: number }
    blue: { orator: number; reserve: number }
}

interface RegistrationsClientProps {
    registrations: RegistrationRow[]
    updateTeamAction: (formData: FormData) => Promise<void>
    updateStatusAction: (formData: FormData) => Promise<void>
}

function TeamActionCell({
    registration,
    action,
}: {
    registration: RegistrationRow
    action: (formData: FormData) => Promise<void>
}) {
    const [pending, startTransition] = useTransition()
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <form
            ref={formRef}
            action={(formData) => startTransition(() => action(formData))}
        >
            <input type="hidden" name="registrationId" value={registration.id} />
            <select
                name="team"
                defaultValue={registration.team}
                disabled={pending}
                onChange={() => formRef.current?.requestSubmit()}
                className="h-9 min-w-32 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50"
            >
                {TEAM_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </form>
    )
}

function StatusActionCell({
    registration,
    action,
}: {
    registration: RegistrationRow
    action: (formData: FormData) => Promise<void>
}) {
    const [pending, startTransition] = useTransition()
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <form
            ref={formRef}
            action={(formData) => startTransition(() => action(formData))}
        >
            <input type="hidden" name="registrationId" value={registration.id} />
            <select
                key={`${registration.id}-${registration.status}`}
                name="status"
                defaultValue={registration.status}
                disabled={pending}
                onChange={() => formRef.current?.requestSubmit()}
                className="h-9 min-w-36 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50"
            >
                {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </form>
    )
}

function getColumns(
    updateTeamAction: (formData: FormData) => Promise<void>,
    updateStatusAction: (formData: FormData) => Promise<void>,
): ColumnDef<RegistrationRow>[] {
    return [
        {
            accessorKey: "userName",
            header: "Nombre",
            cell: ({ row }) => (
                <span className="font-medium">{row.getValue("userName")}</span>
            ),
        },
        {
            accessorKey: "userEmail",
            header: "Correo",
        },
        {
            accessorKey: "userPhone",
            header: "Numero",
            cell: ({ row }) => row.getValue("userPhone") ?? "-",
        },
        {
            accessorKey: "userPostura",
            header: "Posicion filosofica",
            cell: ({ row }) => row.getValue("userPostura") ?? "-",
        },
        {
            accessorKey: "team",
            header: "Equipo",
            cell: ({ row }) => (
                <TeamActionCell
                    registration={row.original}
                    action={updateTeamAction}
                />
            ),
            filterFn: (row, columnId, filterValue) => {
                if (filterValue === "all") return true
                return row.getValue(columnId) === filterValue
            },
        },
        {
            accessorKey: "status",
            header: "Rol",
            cell: ({ row }) => (
                <StatusActionCell
                    registration={row.original}
                    action={updateStatusAction}
                />
            ),
        },
    ]
}

export function RegistrationsClient({
    registrations,
    updateTeamAction,
    updateStatusAction,
}: RegistrationsClientProps) {
    const [globalFilter, setGlobalFilter] = useState("")
    const [teamFilter, setTeamFilter] = useState("all")

    const columns = useMemo(
        () => getColumns(updateTeamAction, updateStatusAction),
        [updateTeamAction, updateStatusAction],
    )

    const columnFilters = useMemo(
        () => teamFilter !== "all" ? [{ id: "team", value: teamFilter }] : [],
        [teamFilter],
    )

    const globalFilterFn = useCallback(
        (row: import("@tanstack/react-table").Row<RegistrationRow>, _columnId: string, filterValue: string) => {
            const search = filterValue.toLowerCase()
            const name = (row.getValue("userName") as string).toLowerCase()
            const email = (row.getValue("userEmail") as string).toLowerCase()
            return name.includes(search) || email.includes(search)
        },
        [],
    )

    const table = useReactTable({
        data: registrations,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
            columnFilters,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn,
    })

    const counts = useMemo(() => {
        const result: RegistrationCounts = {
            red: { orator: 0, reserve: 0 },
            blue: { orator: 0, reserve: 0 },
        }
        for (const r of registrations) {
            if (r.team === "red" || r.team === "blue") {
                if (r.status === "orator") result[r.team].orator++
                if (r.status === "reserve") result[r.team].reserve++
            }
        }
        return result
    }, [registrations])

    const redTeam = registrations.filter(
        (r) => r.team === "red" && (r.status === "orator" || r.status === "reserve"),
    )
    const blueTeam = registrations.filter(
        (r) => r.team === "blue" && (r.status === "orator" || r.status === "reserve"),
    )

    const redTeamCount = registrations.filter((r) => r.team === "red").length
    const blueTeamCount = registrations.filter((r) => r.team === "blue").length
    const publicCount = registrations.filter((r) => r.team === "public").length

    return (
        <>
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Rojo: {redTeamCount}</Badge>
                <Badge variant="secondary">Azul: {blueTeamCount}</Badge>
                <Badge variant="secondary">Publico: {publicCount}</Badge>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-3 text-lg font-semibold">Listado general</h2>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o correo..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={teamFilter} onValueChange={setTeamFilter}>
                        <SelectTrigger className="min-w-36">
                            <SelectValue placeholder="Filtrar equipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los equipos</SelectItem>
                            {TEAM_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DataTable
                    table={table}
                    columns={columns}
                    emptyMessage="No hay usuarios inscritos en este debate."
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <TeamCard
                    title="Equipo Rojo"
                    members={redTeam}
                    counts={counts.red}
                    updateStatusAction={updateStatusAction}
                />
                <TeamCard
                    title="Equipo Azul"
                    members={blueTeam}
                    counts={counts.blue}
                    updateStatusAction={updateStatusAction}
                />
            </div>
        </>
    )
}

function TeamCard({
    title,
    members,
    counts,
    updateStatusAction,
}: {
    title: string
    members: RegistrationRow[]
    counts: { orator: number; reserve: number }
    updateStatusAction: (formData: FormData) => Promise<void>
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-1 text-lg font-semibold">{title}</h3>
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Oradores: {counts.orator}/3</span>
                <span>·</span>
                <span>Reservas: {counts.reserve}/2</span>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                Sin oradores ni reservas asignados.
                            </TableCell>
                        </TableRow>
                    )}
                    {members.map((registration) => (
                        <TableRow key={registration.id}>
                            <TableCell>{registration.userName}</TableCell>
                            <TableCell>
                                <StatusActionCell
                                    registration={registration}
                                    action={updateStatusAction}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
