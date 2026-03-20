import { revalidatePath } from "next/cache"
import prisma from "@pensar/db"
import { Prisma } from "@prisma/client"

import { ensureAdminSession } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function deleteSuggestionAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const suggestionId = String(formData.get("suggestionId") ?? "").trim()
    if (!suggestionId) {
        throw new Error("ID de sugerencia invalido")
    }

    await prisma.$executeRaw(
        Prisma.sql`DELETE FROM "user_suggestion" WHERE "id" = ${suggestionId}`
    )

    revalidatePath("/dashboard/suggestions")
}

export default async function DashboardSuggestionsPage() {
    await ensureAdminSession()

    const suggestions = await prisma.$queryRaw<
        Array<{
            id: string
            subject: string
            message: string
            createdAt: Date
            userName: string
            userEmail: string
        }>
    >(Prisma.sql`
        SELECT
            s."id",
            s."subject",
            s."message",
            s."createdAt",
            u."name" AS "userName",
            u."email" AS "userEmail"
        FROM "user_suggestion" s
        INNER JOIN "user" u ON u."id" = s."userId"
        ORDER BY s."createdAt" DESC
        LIMIT 200
    `)

    return (
        <section className="space-y-4">
            <div>
                <h1 className="text-xl font-semibold">Peticiones de usuarios</h1>
                <p className="text-sm text-muted-foreground">
                    Revisa sugerencias y consejos enviados por usuarios con cuenta.
                </p>
            </div>

            {suggestions.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                        No hay peticiones registradas.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {suggestions.map((suggestion) => (
                        <Card key={suggestion.id} className="border-border/70 bg-background/90">
                            <CardHeader className="space-y-3">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">{suggestion.userName} · {suggestion.userEmail}</p>
                                        <CardTitle className="text-base md:text-lg">{suggestion.subject}</CardTitle>
                                    </div>

                                    <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:text-right">
                                        <p className="text-xs text-muted-foreground">
                                            {suggestion.createdAt.toLocaleString("es-ES", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <form action={deleteSuggestionAction}>
                                            <input type="hidden" name="suggestionId" value={suggestion.id} />
                                            <Button type="submit" variant="destructive" size="sm">
                                                Eliminar
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="max-h-60 overflow-y-auto rounded-lg border border-border/70 bg-muted/20 p-4">
                                    <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-foreground/90">
                                        {suggestion.message}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    )
}
