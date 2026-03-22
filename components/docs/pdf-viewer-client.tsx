"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const PdfViewer = dynamic(
    () => import("@/components/docs/pdf-viewer").then(mod => mod.PdfViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center gap-2 py-16">
                <Loader2 className="text-muted-foreground size-5 animate-spin" />
                <span className="text-muted-foreground text-sm">Cargando visor...</span>
            </div>
        ),
    }
)

export { PdfViewer }
