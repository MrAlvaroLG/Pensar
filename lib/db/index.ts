import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

function getDatabaseUrl() {
    const url = process.env.DATABASE_URL ?? process.env.DIRECT_URL

    if (typeof url !== "string" || url.trim().length === 0) {
        throw new Error(
            "Missing database connection string. Set DATABASE_URL (or DIRECT_URL) in /home/alvarolg/Work/Pensar/.env.local"
        )
    }

    return url.trim()
}

const prismaClientSingleton = () => {
    const connectionString = getDatabaseUrl()
    const pool = new pg.Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma

export * from "@prisma/client"