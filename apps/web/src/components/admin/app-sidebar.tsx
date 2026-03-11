"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, House, Users, Gavel, Megaphone, ChartColumnBig, Library, History, MessageSquare, ShieldBan } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

type AppSidebarProps = React.ComponentProps<typeof Sidebar>

const ADMIN_SECTIONS = [
    {
        label: "Usuarios",
        items: [
            { label: "Usuarios y Roles", href: "/dashboard/users", icon: Users },
            { label: "Estadisticas", href: "/dashboard/user-stats", icon: ChartColumnBig },
        ],
        
    },
    {
        label: "Debates",
        items: [
            { label: "Debate Actual", href: "/dashboard/current-debate", icon: Gavel },
            { label: "Debate Proximo", href: "/dashboard/upcoming-debate", icon: Megaphone },
            { label: "Usuarios Inscritos", href: "/dashboard/debate-registrations", icon: Users },
            { label: "Debates Anteriores", href: "/dashboard/past-debates", icon: History },
        ],
        
    },
    {
        label: "Biblioteca",
        items: [
            { label: "Bibliografía", href: "/dashboard/library", icon: Library },
        ],
    },
    {
        label: "Chat",
        items: [
            { label: "Mensajes", href: "/dashboard/chat", icon: MessageSquare },
            { label: "Baneos y Reportes", href: "/dashboard/bans", icon: ShieldBan },
        ],
    },
] as const

export function AppSidebar({ ...props }: AppSidebarProps) {
    const pathname = usePathname()

    const isItemActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

    return (
        <Sidebar className="h-[calc(100svh-4rem)]!" {...props}>
        <SidebarHeader className="p-3">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Administración</span>
                <Button asChild size="sm" variant="outline" className="gap-2">
                    <Link href="/">
                        <House className="size-4" />
                        <span>Inicio</span>
                    </Link>
                </Button>
            </div>
        </SidebarHeader>

        <SidebarContent>
            {ADMIN_SECTIONS.map((section) => {
                const items = (
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {section.items.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isItemActive(item.href)}
                                        tooltip={item.label}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="size-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                )

                return (
                    <Collapsible key={section.label} defaultOpen className="group/collapsible">
                        <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="flex w-full items-center gap-2">
                            <span className="flex-1 text-left">{section.label}</span>
                            <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent className="pl-4">
                            {items}
                        </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                )
            })}
        </SidebarContent>

        <SidebarRail />
        </Sidebar>
    )
}
