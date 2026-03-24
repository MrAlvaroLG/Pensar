import "server-only"

type RateLimitEntry = {
    count: number
    resetAt: number
}

type RateLimitCheck = {
    allowed: boolean
    retryAfterMs: number | null
}

function getRateLimitStore(): Map<string, RateLimitEntry> {
    const g = globalThis as unknown as { __pensarRateLimitStore?: Map<string, RateLimitEntry> }
    if (!g.__pensarRateLimitStore) {
        g.__pensarRateLimitStore = new Map()
    }
    return g.__pensarRateLimitStore
}

export function getClientIp(request: Request): string {
    const xff = request.headers.get("x-forwarded-for")
    if (xff) return xff.split(",")[0]?.trim() || "unknown"

    const xRealIp = request.headers.get("x-real-ip")
    if (xRealIp) return xRealIp.trim()

    return request.headers.get("cf-connecting-ip") ?? "unknown"
}

export function checkRateLimit(params: {
    key: string
    windowMs: number
    limit: number
}): RateLimitCheck {
    const { key, windowMs, limit } = params

    const store = getRateLimitStore()
    const now = Date.now()

    // Limpieza oportunista.
    if (store.size > 20000) {
        for (const [k, v] of store.entries()) {
            if (v.resetAt <= now) store.delete(k)
        }
    }

    const existing = store.get(key)
    if (!existing || existing.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + windowMs })
        return { allowed: true, retryAfterMs: null }
    }

    if (existing.count >= limit) {
        return { allowed: false, retryAfterMs: Math.max(0, existing.resetAt - now) }
    }

    store.set(key, { ...existing, count: existing.count + 1 })
    return { allowed: true, retryAfterMs: null }
}

