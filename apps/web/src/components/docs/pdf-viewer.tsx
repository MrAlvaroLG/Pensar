"use client"

import { useState, useCallback } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { Download, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, delay, ease: "easeOut" as const },
})

interface PdfViewerProps {
    url: string
    title: string
    description?: string | null
}

export function PdfViewer({ url, title, description }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [error, setError] = useState(false)

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
    }, [])

    return (
        <div className="flex flex-col gap-4">
            <motion.div {...fadeIn(0)} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground text-sm">{description}</p>
                    )}
                </div>
                <Button asChild variant="outline" size="sm">
                    <a href={url} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-1 size-4" />
                        Descargar PDF
                    </a>
                </Button>
            </motion.div>

            {error ? (
                <motion.div {...fadeIn(0.1)} className="flex flex-col items-center gap-2 py-16 text-center">
                    <p className="text-muted-foreground text-sm">
                        No se pudo cargar el documento. Puedes descargarlo directamente.
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <a href={url} download target="_blank" rel="noopener noreferrer">
                            <Download className="mr-1 size-4" />
                            Descargar PDF
                        </a>
                    </Button>
                </motion.div>
            ) : (
                <motion.div {...fadeIn(0.1)} className="flex flex-col items-center gap-4">
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
                        {numPages &&
                            Array.from({ length: numPages }, (_, i) => (
                                <Page
                                    key={`page_${i + 1}`}
                                    pageNumber={i + 1}
                                    className="mb-4 shadow-md"
                                    width={Math.min(800, typeof window !== "undefined" ? window.innerWidth - 64 : 800)}
                                    loading={<Skeleton className="mb-4 h-[1000px] w-full max-w-[800px]" />}
                                />
                            ))}
                    </Document>
                    {numPages && (
                        <p className="text-muted-foreground text-xs">
                            {numPages} {numPages === 1 ? "página" : "páginas"}
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    )
}
