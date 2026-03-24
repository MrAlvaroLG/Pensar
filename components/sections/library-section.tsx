import { asc } from "drizzle-orm"

import LibrarySectionClient from "@/components/sections/library-section-client"
import { db } from "@/lib/db"
import { libraryCategory, libraryDocument } from "@/lib/db/schema"

export default async function LibrarySection() {
    const categories = await db.query.libraryCategory.findMany({
        orderBy: [asc(libraryCategory.order)],
        with: {
            documents: {
                columns: {
                    id: true,
                    title: true,
                    description: true,
                },
                orderBy: [asc(libraryDocument.title)],
            },
        },
    })

    const categoriesWithCount = categories.map((c) => ({
        ...c,
        _count: { documents: c.documents.length },
    }))

    return <LibrarySectionClient categories={categoriesWithCount} />
}
