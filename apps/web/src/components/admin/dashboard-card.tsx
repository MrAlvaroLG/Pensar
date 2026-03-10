import { cn } from "@/lib/utils"

interface DashboardCardProps {
    children: React.ReactNode
    className?: string
}

export function DashboardCard({ children, className }: DashboardCardProps) {
    return (
        <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
            {children}
        </div>
    )
}
