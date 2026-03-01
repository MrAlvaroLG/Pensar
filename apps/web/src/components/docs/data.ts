import {
    BookOpen,
    Atom,
    Church,
    type LucideIcon,
} from "lucide-react"

export interface Document {
    id: string
    title: string
    description?: string
}

export interface DocumentGroup {
    label: string
    icon: LucideIcon
    documents: Document[]
}

export const DOCUMENT_GROUPS: DocumentGroup[] = [
    {
        label: "Filosofía",
        icon: BookOpen,
        documents: [
        {
            id: "fil-1",
            title: "La República",
            description: "Platón — Diálogos sobre justicia y el Estado ideal",
        },
        {
            id: "fil-2",
            title: "Ética a Nicómaco",
            description: "Aristóteles — Tratado sobre la virtud y la felicidad",
        },
        {
            id: "fil-3",
            title: "Meditaciones Metafísicas",
            description: "Descartes — Fundamentos del pensamiento moderno",
        },
        {
            id: "fil-4",
            title: "Crítica de la Razón Pura",
            description: "Kant — Límites y alcance del conocimiento humano",
        },
        ],
    },
    {
        label: "Religión",
        icon: Church,
        documents: [
        {
            id: "rel-1",
            title: "Summa Theologica",
            description: "Tomás de Aquino — Síntesis de teología cristiana",
        },
        {
            id: "rel-2",
            title: "El Bhagavad Gita",
            description: "Texto sagrado del hinduismo",
        },
        {
            id: "rel-3",
            title: "El Corán",
            description: "Libro sagrado del islam",
        },
        ],
    },
    {
        label: "Ciencia",
        icon: Atom,
        documents: [
        {
            id: "sci-1",
            title: "El Origen de las Especies",
            description: "Darwin — Teoría de la evolución por selección natural",
        },
        {
            id: "sci-2",
            title: "Principia Mathematica",
            description: "Newton — Leyes del movimiento y gravitación",
        },
        {
            id: "sci-3",
            title: "Sobre la Relatividad",
            description: "Einstein — Teoría especial y general de la relatividad",
        },
        {
            id: "sci-4",
            title: "La Estructura de las Revoluciones Científicas",
            description: "Kuhn — Paradigmas y cambio científico",
        },
        ],
    },
]
