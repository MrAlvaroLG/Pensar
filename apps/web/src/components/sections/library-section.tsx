import prisma from "@pensar/db"

import LibrarySectionClient from "@/components/sections/library-section-client"

export default async function LibrarySection() {
    const categories = await prisma.libraryCategory.findMany({
        include: {
            documents: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                },
                orderBy: { title: "asc" },
            },
            _count: {
                select: {
                    documents: true,
                },
            },
        },
        orderBy: { order: "asc" },
    })

    return <LibrarySectionClient categories={categories} />
}