import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect("/login")
    }

    if (session.user.role === "PUBLISHER") {
        redirect("/admin/dashboard/library")
    }

    if (session.user.role === "ADMIN") {
        redirect("/admin/dashboard/users")
    }

    redirect("/")
}