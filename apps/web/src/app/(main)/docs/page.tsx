import { BookOpen } from "lucide-react"

export default function DocsPage() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <BookOpen className="text-muted-foreground size-12" />
            <h1 className="text-2xl font-semibold">Biblioteca</h1>
            <p className="text-muted-foreground max-w-md text-sm">
                Selecciona un documento del panel lateral para comenzar a leer.
                Puedes buscar por título o explorar las categorías disponibles.
            </p>
        </div>
    )
}