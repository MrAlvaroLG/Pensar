import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
    title: string
    description?: string
    badge?: string
    actions?: React.ReactNode
    children?: React.ReactNode
}

export function DashboardHeader({ title, description, badge, actions, children }: DashboardHeaderProps) {
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {badge && <Badge variant="secondary">{badge}</Badge>}
                </div>
                {actions}
            </div>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {children}
        </div>
    )
}
