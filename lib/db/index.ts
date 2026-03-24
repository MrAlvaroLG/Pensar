import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"

import { schema } from "./schema"

function getDatabaseUrl() {
    const url = process.env.DATABASE_URL ?? process.env.DIRECT_URL

    if (typeof url !== "string" || url.trim().length === 0) {
        throw new Error(
            "Missing database connection string. Set DATABASE_URL (or DIRECT_URL) in .env.local"
        )
    }

    return url.trim()
}

const poolSingleton = () => {
    const connectionString = getDatabaseUrl()
    return new pg.Pool({ connectionString })
}

declare global {
    var dbPoolGlobal: undefined | pg.Pool
}

const pool = globalThis.dbPoolGlobal ?? poolSingleton()

export const db = drizzle(pool, { schema })

export default db

if (process.env.NODE_ENV !== "production") {
    globalThis.dbPoolGlobal = pool
}

export * from "./schema"
