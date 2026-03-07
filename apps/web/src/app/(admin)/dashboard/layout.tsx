import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { CurrentItemTitle } from "@/components/admin/current-item-title"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect("/login")
    }

    if (session.user.role !== "ADMIN") {
        redirect("/")
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-12 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4!" />
                    <CurrentItemTitle />
                </header>
                <main className="flex-1 p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}