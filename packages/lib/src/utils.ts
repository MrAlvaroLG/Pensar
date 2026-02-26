/**
 * Utility para combinar classNames condicionalmente.
 * Alternativa ligera a clsx/tailwind-merge.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
