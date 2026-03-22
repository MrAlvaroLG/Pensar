"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, delay, ease: "easeOut" as const },
})

export default function DocsPage() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <motion.div {...fadeIn(0)}>
                <BookOpen className="text-muted-foreground size-12" />
            </motion.div>
            <motion.h1 {...fadeIn(0.1)} className="text-2xl font-semibold">
                Biblioteca
            </motion.h1>
            <motion.p {...fadeIn(0.2)} className="text-muted-foreground max-w-md text-sm">
                Selecciona un documento del panel lateral para comenzar a leer.
                Puedes buscar por título o explorar las categorías disponibles.
            </motion.p>
        </div>
    )
}