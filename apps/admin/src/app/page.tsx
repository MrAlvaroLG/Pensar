export default function AdminHome() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Pensar Admin
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Panel de administración para gestionar debates, inscripciones y
          bibliografía.
        </p>
        <div className="flex gap-4">
          <a
            href="/debates"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Gestionar debates
          </a>
        </div>
      </main>
    </div>
  );
}
