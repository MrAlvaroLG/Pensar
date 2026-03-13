"use client"

import { useState, useMemo } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfViewerProps {
    url: string
    title: string
    description?: string | null
}

export function PdfViewer({ url, title, description }: PdfViewerProps) {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    const viewerUrl = useMemo(() => `${url}#toolbar=0&navpanes=0&view=FitH`, [url])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground text-sm">{description}</p>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <a href={url} download target="_blank" rel="noopener noreferrer">
                            <Download className="mr-1 size-4" />
                            Descargar PDF
                        </a>
                    </Button>
                </div>
            </div>

            {error ? (
                <div className="flex flex-col items-center gap-2 py-16 text-center">
                    <p className="text-muted-foreground text-sm">
                        No se pudo cargar el documento. Puedes descargarlo directamente.
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <a href={url} download target="_blank" rel="noopener noreferrer">
                            <Download className="mr-1 size-4" />
                            Descargar PDF
                        </a>
                    </Button>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-lg border bg-muted/20">
                    {!loaded && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
                            <div className="flex items-center gap-2">
                                <Loader2 className="text-muted-foreground size-5 animate-spin" />
                                <span className="text-muted-foreground text-sm">Cargando documento...</span>
                            </div>
                        </div>
                    )}

                    <iframe
                        title={`Visor de PDF: ${title}`}
                        src={viewerUrl}
                        className="min-h-[76svh] w-full"
                        onLoad={() => setLoaded(true)}
                        onError={() => setError(true)}
                    />
                </div>
            )}
        </div>
    )
}
