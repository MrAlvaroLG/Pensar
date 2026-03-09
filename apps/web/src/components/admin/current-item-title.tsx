"use client"

import { usePathname } from "next/navigation"

const ADMIN_TITLE_BY_ROUTE: Array<{ route: string; title: string }> = [
    { route: "/dashboard/current-debate", title: "Debate Actual" },
    { route: "/dashboard/upcoming-debate", title: "Debate Próximo" },
    { route: "/dashboard/debate-registrations", title: "Usuarios Inscritos" },
    { route: "/dashboard/user-stats", title: "Estadísticas de Usuarios" },
    { route: "/dashboard/users", title: "Lista de Usuarios" },
    { route: "/dashboard/library", title: "Bibliografía" },
    { route: "/dashboard/roles", title: "Roles" },
    { route: "/dashboard", title: "Dashboard" },
]

export function CurrentItemTitle() {
    const pathname = usePathname()

    const currentTitle =
        ADMIN_TITLE_BY_ROUTE.find(({ route }) =>
            pathname === route || pathname.startsWith(`${route}/`)
        )?.title ?? "Dashboard"

    return <span className="text-sm font-medium">{currentTitle}</span>
}
