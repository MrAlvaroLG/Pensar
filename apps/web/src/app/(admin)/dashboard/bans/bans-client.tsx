"use client"

import { useState, useTransition, useRef } from "react"
import { useReactTable, getCoreRowModel, type ColumnDef } from "@tanstack/react-table"
import { DashboardCard } from "@/components/admin/dashboard-card"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ShieldBan, ShieldOff, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import type { RegistrationWithBan, ReportRow } from "./page"

const DURATION_OPTIONS = [
    { value: "1", label: "1 hora" },
    { value: "6", label: "6 horas" },
    { value: "24", label: "24 horas" },
    { value: "72", label: "3 días" },
    { value: "0", label: "Hasta fin del debate" },
]

function BanDialog({
    open,
    onClose,
    userId,
    debateId,
    userName,
    action,
}: {
    open: boolean
    onClose: () => void
    userId: string
    debateId: string
    userName: string
    action: (formData: FormData) => Promise<void>
}) {
    const formRef = useRef<HTMLFormElement>(null)
    const [pending, startTransition] = useTransition()

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Banear a {userName}</DialogTitle>
                </DialogHeader>
                <form
                    ref={formRef}
                    action={(fd) =>
                        startTransition(async () => {
                            await action(fd)
                            onClose()
                        })
                    }
                    className="space-y-3"
                >
                    <input type="hidden" name="userId" value={userId} />
                    <input type="hidden" name="debateId" value={debateId} />

                    <div className="space-y-1">
                        <Label htmlFor="reason">Motivo (opcional)</Label>
                        <textarea
                            id="reason"
                            name="reason"
                            rows={2}
                            maxLength={500}
                            placeholder="Describe la infracción…"
                            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="durationHours">Duración</Label>
                        <select
                            id="durationHours"
                            name="durationHours"
                            defaultValue="24"
                            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                        >
                            {DURATION_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <DialogFooter className="gap-2 pt-1">
                        <Button type="button" variant="outline" size="sm" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            variant="destructive"
                            disabled={pending}
                        >
                            <ShieldBan className="mr-1.5 size-4" />
                            Banear
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function ReportActionDialog({
    open,
    onClose,
    report,
    debateId,
    action,
}: {
    open: boolean
    onClose: () => void
    report: ReportRow | null
    debateId: string
    action: (formData: FormData) => Promise<void>
}) {
    const [pending, startTransition] = useTransition()

    if (!report) return null

    const submit = (reportAction: "banAuthor" | "dismiss") => {
        const fd = new FormData()
        fd.append("reportId", report.reportId)
        fd.append("action", reportAction)
        fd.append("debateId", debateId)
        fd.append("messageId", report.message.id)
        fd.append("authorId", report.message.authorId)
        fd.append("durationHours", "24")
        fd.append("reason", report.reason ?? "")
        startTransition(async () => {
            await action(fd)
            onClose()
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Reporte — Tomar acción</DialogTitle>
                </DialogHeader>
                <div className="max-h-48 space-y-3 overflow-y-auto text-sm">
                    <div className="rounded-md border bg-muted/50 p-3">
                        <p className="mb-1 text-xs text-muted-foreground">
                            Mensaje de{" "}
                            <strong>{report.message.authorName}</strong> (
                            {report.message.team === "red" ? "Rojo" : "Azul"})
                        </p>
                        <p className="break-words whitespace-pre-wrap">{report.message.content || "(archivo adjunto)"}</p>
                    </div>
                    {report.reason && (
                        <p className="text-xs text-muted-foreground">
                            Motivo del reporte: {report.reason}
                        </p>
                    )}
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-col">
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={pending}
                        onClick={() => submit("banAuthor")}
                    >
                        <ShieldBan className="mr-1.5 size-4" />
                        Banear autor (24h) y eliminar mensaje
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onClick={() => submit("dismiss")}
                    >
                        <XCircle className="mr-1.5 size-4" />
                        Desestimar reporte
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onClose} disabled={pending}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface BansClientProps {
    debateId: string
    debateTitle: string
    rows: RegistrationWithBan[]
    reports: ReportRow[]
    banUserAction: (fd: FormData) => Promise<void>
    unbanUserAction: (fd: FormData) => Promise<void>
    handleReportAction: (fd: FormData) => Promise<void>
}

function BanStatusCell({
    row,
    debateId,
    banUserAction,
    unbanUserAction,
}: {
    row: RegistrationWithBan
    debateId: string
    banUserAction: (fd: FormData) => Promise<void>
    unbanUserAction: (fd: FormData) => Promise<void>
}) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [pending, startTransition] = useTransition()

    const isBanned = !!row.ban

    const handleUnban = () => {
        const fd = new FormData()
        fd.append("userId", row.userId)
        fd.append("debateId", debateId)
        startTransition(async () => {
            await unbanUserAction(fd)
        })
    }

    return (
        <>
            <div className="flex items-center gap-2">
                {isBanned ? (
                    <>
                        <Badge variant="destructive" className="text-xs">
                            <ShieldBan className="mr-1 size-3" />
                            Baneado
                        </Badge>
                        {row.ban?.expiresAt && (
                            <span className="text-xs text-muted-foreground">
                                hasta{" "}
                                {new Date(row.ban.expiresAt).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            disabled={pending}
                            onClick={handleUnban}
                        >
                            <ShieldOff className="mr-1 size-3" />
                            Quitar ban
                        </Button>
                    </>
                ) : (
                    <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        onClick={() => setDialogOpen(true)}
                    >
                        <ShieldBan className="mr-1 size-3" />
                        Banear
                    </Button>
                )}
            </div>

            <BanDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                userId={row.userId}
                debateId={debateId}
                userName={row.userName}
                action={banUserAction}
            />
        </>
    )
}

function UsersTable({
    title,
    teamColor,
    rows,
    debateId,
    banUserAction,
    unbanUserAction,
}: {
    title: string
    teamColor: string
    rows: RegistrationWithBan[]
    debateId: string
    banUserAction: (fd: FormData) => Promise<void>
    unbanUserAction: (fd: FormData) => Promise<void>
}) {
    const columns: ColumnDef<RegistrationWithBan>[] = [
        {
            accessorKey: "userName",
            header: "Nombre",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.userName}</span>
            ),
        },
        {
            accessorKey: "userEmail",
            header: "Correo",
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.userEmail}
                </span>
            ),
        },
        {
            id: "banStatus",
            header: "Baneo",
            cell: ({ row }) => (
                <BanStatusCell
                    row={row.original}
                    debateId={debateId}
                    banUserAction={banUserAction}
                    unbanUserAction={unbanUserAction}
                />
            ),
        },
    ]

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <DashboardCard>
            <h2 className={`mb-3 font-semibold ${teamColor}`}>{title}</h2>
            <DataTable
                table={table}
                columns={columns}
                emptyMessage="Sin participantes inscritos"
            />
        </DashboardCard>
    )
}

function ReportsTable({
    reports,
    debateId,
    handleReportAction,
}: {
    reports: ReportRow[]
    debateId: string
    handleReportAction: (fd: FormData) => Promise<void>
}) {
    const [selectedReport, setSelectedReport] = useState<ReportRow | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const columns: ColumnDef<ReportRow>[] = [
        {
            id: "author",
            header: "Autor del mensaje",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium text-sm">{row.original.message.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                        Equipo {row.original.message.team === "red" ? "Rojo" : "Azul"}
                    </p>
                </div>
            ),
        },
        {
            id: "message",
            header: "Mensaje",
            cell: ({ row }) => (
                <p className="max-w-xs break-words text-sm line-clamp-3">
                    {row.original.message.content || "(archivo adjunto)"}
                </p>
            ),
        },
        {
            accessorKey: "reportedBy",
            header: "Reportado por",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.reportedBy}
                </span>
            ),
        },
        {
            accessorKey: "reason",
            header: "Motivo",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.reason ?? "—"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => (
                <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs"
                    onClick={() => {
                        setSelectedReport(row.original)
                        setDialogOpen(true)
                    }}
                >
                    <AlertTriangle className="size-3" />
                    Tomar acción
                </Button>
            ),
        },
    ]

    const table = useReactTable({
        data: reports,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <>
            <DashboardCard>
                <div className="mb-3 flex items-center gap-2">
                    <h2 className="font-semibold">Reportes Pendientes</h2>
                    {reports.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                            {reports.length}
                        </Badge>
                    )}
                </div>
                <DataTable
                    table={table}
                    columns={columns}
                    emptyMessage="Sin reportes pendientes"
                />
            </DashboardCard>

            <ReportActionDialog
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false)
                    setSelectedReport(null)
                }}
                report={selectedReport}
                debateId={debateId}
                action={handleReportAction}
            />
        </>
    )
}

export function BansClient({
    debateId,
    debateTitle,
    rows,
    reports,
    banUserAction,
    unbanUserAction,
    handleReportAction,
}: BansClientProps) {
    const redRows = rows.filter((r) => r.team === "red")
    const blueRows = rows.filter((r) => r.team === "blue")

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-xl font-semibold">Baneos y Reportes</h1>
                <Badge variant="outline" className="shrink-0">
                    {debateTitle}
                </Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <UsersTable
                    title="Equipo Rojo"
                    teamColor="text-red-500"
                    rows={redRows}
                    debateId={debateId}
                    banUserAction={banUserAction}
                    unbanUserAction={unbanUserAction}
                />
                <UsersTable
                    title="Equipo Azul"
                    teamColor="text-blue-500"
                    rows={blueRows}
                    debateId={debateId}
                    banUserAction={banUserAction}
                    unbanUserAction={unbanUserAction}
                />
            </div>

            <ReportsTable
                reports={reports}
                debateId={debateId}
                handleReportAction={handleReportAction}
            />
        </div>
    )
}
