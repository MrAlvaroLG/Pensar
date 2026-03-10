export function parseDateField(value: FormDataEntryValue | null, label: string) {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`El campo ${label} es obligatorio`)
    }

    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`El campo ${label} no tiene una fecha válida`)
    }

    return parsed
}

export function parseBibliography(rawValue: FormDataEntryValue | null) {
    if (typeof rawValue !== "string" || rawValue.trim().length === 0) {
        return []
    }

    return rawValue
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
            const [rawLabel, rawUrl] = line.includes("|")
                ? line.split("|", 2)
                : [`Referencia ${index + 1}`, line]

            const label = rawLabel.trim()
            const url = rawUrl.trim()

            try {
                const validUrl = new URL(url)
                return {
                    label,
                    url: validUrl.toString(),
                }
            } catch {
                throw new Error(`La referencia ${index + 1} no tiene una URL válida`)
            }
        })
}
