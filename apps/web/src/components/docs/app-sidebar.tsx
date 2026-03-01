"use client"

import { useState, useMemo } from "react"
import { ChevronDown, FileText, Search } from "lucide-react"

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
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

import { DOCUMENT_GROUPS, type Document } from "@/components/docs/data"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    selectedDocId?: string | null
    onSelectDocument?: (doc: Document) => void
}

export function AppSidebar({
    selectedDocId,
    onSelectDocument,
    ...props
}: AppSidebarProps) {
    const [search, setSearch] = useState("")

    const filteredGroups = useMemo(() => {
        if (!search.trim()) return DOCUMENT_GROUPS

        const query = search.toLowerCase()
        return DOCUMENT_GROUPS.map((group) => ({
        ...group,
        documents: group.documents.filter((doc) =>
            doc.title.toLowerCase().includes(query)
        ),
        })).filter((group) => group.documents.length > 0)
    }, [search])

    return (
        <Sidebar className="top-16 h-[calc(100svh-4rem)]!" {...props}>
        <SidebarHeader className="p-3">
            <InputGroup className="w-full">
            <InputGroupAddon>
                <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
                placeholder="Buscar documento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            </InputGroup>
        </SidebarHeader>

        <SidebarContent>
            {filteredGroups.length === 0 && (
            <div className="text-muted-foreground px-4 py-6 text-center text-sm">
                No se encontraron documentos.
            </div>
            )}

            {filteredGroups.map((group) => (
            <Collapsible key={group.label} defaultOpen className="group/collapsible">
                <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center gap-2">
                    <group.icon className="size-4" />
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent className="pl-4">
                    <SidebarGroupContent>
                    <SidebarMenu>
                        {group.documents.map((doc) => (
                        <SidebarMenuItem key={doc.id}>
                            <SidebarMenuButton
                            isActive={selectedDocId === doc.id}
                            tooltip={doc.description ?? doc.title}
                            onClick={() => onSelectDocument?.(doc)}
                            >
                            <FileText className="size-4" />
                                <span>{doc.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
            ))}
        </SidebarContent>

        <SidebarRail />
        </Sidebar>
    )
}