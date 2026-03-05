import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({children,}: {children: React.ReactNode;}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {redirect("/login");}
    if (session.user.role !== "ADMIN") {redirect("/"); }

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-slate-900 text-white p-4">
                Admin Menu
            </aside>
            <main className="flex-1 p-8 bg-slate-50">
                {children}
            </main>
        </div>
    );
}