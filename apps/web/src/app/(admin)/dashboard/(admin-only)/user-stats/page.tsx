import Link from "next/link"
import { ChevronLeft, ChevronRight, UsersRound } from "lucide-react"
import prisma from "@pensar/db"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { UserCreationChart } from "./user-creation-chart"

interface UserStatsPageProps {
    searchParams?: Promise<{ month?: string }>
}

function getMonthFromQuery(monthQuery?: string) {
    const now = new Date()

    if (!monthQuery || !/^\d{4}-\d{2}$/.test(monthQuery)) {
        return {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth(),
        }
    }

    const [yearPart, monthPart] = monthQuery.split("-")
    const year = Number(yearPart)
    const month = Number(monthPart)

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
        return {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth(),
        }
    }

    return {
        year,
        month: month - 1,
    }
}

function formatMonthQuery(date: Date) {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
}

function capitalizeFirstLetter(value: string) {
    if (!value.length) {
        return value
    }

    return `${value[0].toUpperCase()}${value.slice(1)}`
}

export default async function UserStatsPage({ searchParams }: UserStatsPageProps) {
    const resolvedSearchParams = searchParams ? await searchParams : undefined
    const { year, month } = getMonthFromQuery(resolvedSearchParams?.month)

    const monthStart = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
    const nextMonthStart = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0))

    const users = await prisma.user.findMany({
        where: {
            createdAt: {
                gte: monthStart,
                lt: nextMonthStart,
            },
        },
        select: {
            createdAt: true,
        },
    })

    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    const countsByDay = Array.from({ length: daysInMonth }, () => 0)

    for (const user of users) {
        const day = user.createdAt.getUTCDate()
        countsByDay[day - 1] += 1
    }

    const chartData = countsByDay.map((count, index) => ({
        day: String(index + 1),
        users: count,
    }))

    const totalUsers = chartData.reduce((accumulator, item) => accumulator + item.users, 0)
    const monthLabel = capitalizeFirstLetter(
        monthStart.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        })
    )

    const prevMonth = new Date(Date.UTC(year, month - 1, 1))
    const nextMonth = new Date(Date.UTC(year, month + 1, 1))

    return (
        <section className="space-y-4">
            <DashboardHeader
                title="Usuarios creados por día"
                actions={
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/user-stats?month=${formatMonthQuery(prevMonth)}`}>
                                <ChevronLeft className="size-4" />
                                <span>Mes anterior</span>
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/user-stats?month=${formatMonthQuery(nextMonth)}`}>
                                <span>Mes siguiente</span>
                                <ChevronRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>{monthLabel}</CardTitle>
                    <CardDescription>
                        Evolución diaria de cuentas creadas durante el mes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UsersRound className="size-4" />
                        <span>{totalUsers} cuentas creadas en este mes</span>
                    </div>
                    <UserCreationChart data={chartData} />
                </CardContent>
            </Card>
        </section>
    )
}
