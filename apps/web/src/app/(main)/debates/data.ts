export interface NextDebate {
    title: string
    subtitle: string
    question: string
    thesis: string
    date: string
}

export interface PastDebate {
    id: number
    title: string
    quote: string
    date: string
}

export const nextDebate: NextDebate = {
    title: "¿Azar o Diseño?",
    subtitle: "El gran debate sobre el origen del universo.",
    question: "¿Es la ciencia incompatible con un Creador?",
    thesis:
        "Este equipo sostiene que existe un creador inteligente detrás del origen y ajuste fino del universo.",
    date: "Hoy, 14:00 – 17:00",
}

export const pastDebates: PastDebate[] = [
    {
        id: 1,
        title: "Evolución y fe: El Eslabón Divino",
        quote:
            "El proceso de evolución incluyó intervención de un ente sobrenatural.",
        date: "12 Oct 2023",
    },
    {
        id: 2,
        title: "El valor de la vida: Límites de la bioética",
        quote:
            "Las decisiones bioéticas deben regirse por principios objetivos.",
        date: "28 Sep 2023",
    },
    {
        id: 3,
        title: "El bien, el mal y el relativismo",
        quote: "La moralidad humana requiere obligatoriamente a Dios.",
        date: "15 Ago 2023",
    },
]
