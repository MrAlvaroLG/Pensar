"use client"

import { useState, useCallback, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
    url: string
    title: string
    description?: string | null
}

export function PdfViewer({ url, title, description }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [error, setError] = useState(false)
    const [pageInput, setPageInput] = useState("")
    const pagesScrollRef = useRef<HTMLDivElement>(null)

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages((prev) => (prev === numPages ? prev : numPages))
    }, [])

    const goToPage = () => {
        if (!numPages) return

        const page = Number(pageInput)
        if (!Number.isFinite(page)) return

        const targetPage = Math.max(1, Math.min(numPages, Math.floor(page)))
        const target = document.getElementById(`pdf-page-${targetPage}`)
        const container = pagesScrollRef.current
        if (!target || !container) return

        const offset = 8
        const targetTop = target.offsetTop - offset

        container.scrollTo({ top: targetTop, behavior: "smooth" })
        setPageInput(String(targetPage))
    }

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
                    {numPages && (
                        <>
                            <Input
                                type="number"
                                min={1}
                                max={numPages}
                                value={pageInput}
                                onChange={(e) => setPageInput(e.target.value)}
                                placeholder={`1-${numPages}`}
                                className="h-8 w-24"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={goToPage}>
                                Ir
                            </Button>
                        </>
                    )}

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
                <div className="flex flex-col gap-4">
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={() => setError(true)}
                        loading={
                            <div className="flex items-center gap-2 py-16">
                                <Loader2 className="text-muted-foreground size-5 animate-spin" />
                                <span className="text-muted-foreground text-sm">Cargando documento...</span>
                            </div>
                        }
                    >
                        <div
                            ref={pagesScrollRef}
                            className="max-h-[calc(100svh-15rem)] overflow-y-auto pr-2 [scrollbar-width:auto] [&::-webkit-scrollbar]:w-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent"
                        >
                            {numPages &&
                                Array.from({ length: numPages }, (_, i) => (
                                    <div
                                        id={`pdf-page-${i + 1}`}
                                        key={`page_${i + 1}`}
                                        className="mb-4 flex w-full justify-center"
                                    >
                                        <Page
                                            pageNumber={i + 1}
                                            className="shadow-md"
                                            width={Math.min(800, typeof window !== "undefined" ? window.innerWidth - 64 : 800)}
                                            loading={
                                                <Skeleton
                                                    className="w-full"
                                                    style={{ height: 1000, maxWidth: 800 }}
                                                />
                                            }
                                        />
                                    </div>
                                ))}
                        </div>
                    </Document>
                    {numPages && (
                        <p className="text-muted-foreground text-xs">
                            {numPages} {numPages === 1 ? "página" : "páginas"}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
