// apps/web/app/page.tsx
import { Hero } from "@/components/hero"; // Ajusta la ruta a donde guardaste el hero.tsx

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      {/* Aquí abajo irán el resto de secciones (Features, Footer, etc.) */}
    </main>
  );
}