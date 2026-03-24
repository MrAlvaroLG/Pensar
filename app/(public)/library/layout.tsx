import { AppSidebar } from "@/components/docs/app-sidebar"
import { db } from "@/lib/db"
import { libraryCategory, libraryDocument } from "@/lib/db/schema"
import { Separator } from "@/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/ui/sidebar"
import { asc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
    const categories = await db.query.libraryCategory.findMany({
        orderBy: [asc(libraryCategory.order)],
        with: {
            documents: {
                columns: { id: true, title: true, description: true },
                orderBy: [asc(libraryDocument.title)],
            },
        },
    })

    return (
        <SidebarProvider>
            <AppSidebar categories={categories} />
            <SidebarInset className="pt-16">
                <header className="bg-background/95 sticky top-16 z-20 flex h-12 items-center gap-2 border-b px-4 backdrop-blur supports-backdrop-filter:bg-background/75">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4!" />
                    <span className="text-sm font-medium">Biblioteca</span>
                </header>
                <main className="flex-1 p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
