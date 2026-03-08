"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface DailyUserCreationData {
    day: string
    users: number
}

interface UserCreationChartProps {
    data: DailyUserCreationData[]
}

const chartConfig = {
    users: {
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

export function UserCreationChart({ data }: UserCreationChartProps) {
    return (
        <ChartContainer config={chartConfig} className="h-80 w-full">
            <BarChart accessibilityLayer data={data} margin={{ top: 8, left: 4, right: 4 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={12}
                />
                <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    width={28}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            hideIndicator
                            formatter={(value) => {
                                const numericValue = Number(value)
                                return (
                                    <span className="text-sm">
                                        Usuarios registrados: {numericValue.toLocaleString()}
                                    </span>
                                )
                            }}
                            labelFormatter={(_, payload) => {
                                const day = payload?.[0]?.payload?.day
                                return typeof day === "string" ? `Día ${day}` : "Día"
                            }}
                        />
                    }
                />
                <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    )
}
