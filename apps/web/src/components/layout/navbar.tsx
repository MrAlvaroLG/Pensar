"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import UserMenu from "@/components/layout/user-menu";

const NAV_ITEMS = [
    { href: "/", label: "Inicio" },
    { href: "/debates", label: "Debates" },
    { href: "/chat", label: "Chat" },
    { href: "/docs", label: "Biblioteca" },
] as const;

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();
    const isLoggedIn = !!session?.user;

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        if (isOpen) setIsOpen(false);
    }

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <>
            <header className="fixed top-0 left-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
                <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
                    >
                        <Image
                            src="/logo/logo-negro.svg"
                            width={28}
                            height={28}
                            alt="Pensar"
                            priority
                        />
                        <span className="text-lg font-semibold tracking-tight">
                            Pensar
                        </span>
                    </Link>

                    <ul className="hidden items-center gap-1 md:flex">
                        {NAV_ITEMS.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "inline-flex h-9 items-center rounded-md px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        isActive(href)
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        {isPending ? (
                            <div className="size-8 animate-pulse rounded-full bg-muted" />
                        ) : isLoggedIn ? (
                            <UserMenu />
                        ) : (
                            <Button asChild size="sm">
                                <Link href="/login">Iniciar Sesión</Link>
                            </Button>
                        )}

                        <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
                            onClick={() => setIsOpen((prev) => !prev)}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                <div
                    id="mobile-menu"
                    role="navigation"
                    aria-label="Menú principal"
                    className={cn(
                        "overflow-hidden bg-background transition-[max-height,opacity] duration-300 ease-in-out md:hidden",
                        isOpen
                            ? "max-h-80 border-t border-border/40 opacity-100"
                            : "max-h-0 opacity-0"
                    )}
                >
                    <ul className="space-y-1 px-4 py-3">
                        {NAV_ITEMS.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex h-11 items-center rounded-md px-3 text-[0.938rem] font-medium transition-colors",
                                        isActive(href)
                                            ? "bg-accent text-accent-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>

            <div
                className={cn(
                    "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                )}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
        </>
    );
}