"use client"

import { usePathname } from "next/navigation"

const ADMIN_TITLE_BY_ROUTE: Array<{ route: string; title: string }> = [
    { route: "/admin/dashboard/current-debate", title: "Debate Actual" },
    { route: "/admin/dashboard/upcoming-debate", title: "Debate Próximo" },
    { route: "/admin/dashboard/debate-registrations", title: "Usuarios Inscritos" },
    { route: "/admin/dashboard/user-stats", title: "Estadísticas de Usuarios" },
    { route: "/admin/dashboard/suggestions", title: "Peticiones de Usuarios" },
    { route: "/admin/dashboard/users", title: "Lista de Usuarios" },
    { route: "/admin/dashboard/library", title: "Bibliografía" },
    { route: "/admin/dashboard/roles", title: "Roles" },
    { route: "/admin/dashboard", title: "Dashboard" },
]

export function CurrentItemTitle() {
    const pathname = usePathname()

    const currentTitle =
        ADMIN_TITLE_BY_ROUTE.find(({ route }) =>
            pathname === route || pathname.startsWith(`${route}/`)
        )?.title ?? "Dashboard"

    return <span className="text-sm font-medium">{currentTitle}</span>
}
