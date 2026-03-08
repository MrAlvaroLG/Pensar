import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import { config } from "dotenv"

config({ path: new URL("../.env", import.meta.url) })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error("DATABASE_URL no está configurada")
}

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const count = await prisma.debate.count()

    if (count > 0) {
        console.log("Debates ya existentes, seed omitido")
        return
    }

    await prisma.debate.create({
        data: {
            title: "¿Azar o Diseño?",
            subtitle: "El gran debate sobre el origen del universo.",
            question: "¿Es la ciencia incompatible con un Creador?",
            thesis: "Este equipo sostiene que existe un creador inteligente detrás del origen y ajuste fino del universo.",
            startAt: new Date("2026-03-08T14:00:00.000Z"),
            endAt: new Date("2026-03-08T17:00:00.000Z"),
            status: "SCHEDULED",
            bibliography: {
                create: [
                    {
                        label: "Ajuste fino y cosmología",
                        url: "https://example.com/ajuste-fino",
                    },
                ],
            },
        },
    })

    await prisma.debate.createMany({
        data: [
            {
                title: "Evolución y fe: El Eslabón Divino",
                subtitle: "Ciencia, teología y origen de la vida",
                question: "¿La evolución excluye por completo una causa trascendente?",
                thesis: "El proceso de evolución incluyó intervención de un ente sobrenatural.",
                startAt: new Date("2023-10-12T15:00:00.000Z"),
                endAt: new Date("2023-10-12T18:00:00.000Z"),
                status: "FINISHED",
            },
            {
                title: "El valor de la vida: Límites de la bioética",
                subtitle: "Decisiones médicas y fundamentos morales",
                question: "¿La bioética puede sostenerse sin principios objetivos?",
                thesis: "Las decisiones bioéticas deben regirse por principios objetivos.",
                startAt: new Date("2023-09-28T15:00:00.000Z"),
                endAt: new Date("2023-09-28T18:00:00.000Z"),
                status: "FINISHED",
            },
            {
                title: "El bien, el mal y el relativismo",
                subtitle: "Fundamentos de la moral en la vida pública",
                question: "¿Es posible una moral universal sin Dios?",
                thesis: "La moralidad humana requiere obligatoriamente a Dios.",
                startAt: new Date("2023-08-15T15:00:00.000Z"),
                endAt: new Date("2023-08-15T18:00:00.000Z"),
                status: "FINISHED",
            },
        ],
    })

    console.log("Seed de debates completado")
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        await pool.end()
    })
