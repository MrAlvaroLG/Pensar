"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <header className="fixed top-0 left-0 z-50 w-full bg-background border-b shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <button 
                        className="md:hidden p-2 pr-5 text-foreground focus:outline-none relative w-10 h-10 flex items-center justify-center" 
                        onClick={toggleMenu}
                        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <X size={24} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <Menu size={24} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                    <Image
                        src="logo/Logo Negro.svg"
                        width={30}
                        height={30}
                        alt="Pensar"
                        priority
                    />
                </div>

                <div className="hidden md:flex flex-1">
                    <NavigationMenu className="flex-1">
                        <NavigationMenuList className="flex flex-1 justify-start px-5 gap-5">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/">Inicio</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/debate">Debates</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/docs">Biblioteca</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div>
                    <Link href="/login">
                        <Button size="sm" className="md:inline-flex">
                            Iniciar Sesión
                        </Button>
                    </Link>
                </div>
            </div>

            <div 
                className={`md:hidden overflow-hidden transition-all duration-700 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100 border-t" : "max-h-0 opacity-0"
                }`}
            >
                <NavigationMenu className="max-w-full w-full bg-background shadow-lg py-4 flex flex-col items-stretch">
                    <NavigationMenuList className="flex-col w-full space-x-0 space-y-2 gap-0">
                        <NavigationMenuItem className="w-full">
                            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} w-full h-12 text-lg justify-start px-8 bg-transparent rounded-none`}>
                                <Link href="/" onClick={closeMenu}>Inicio</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="w-full">
                            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} w-full h-12 text-lg justify-start px-8 bg-transparent rounded-none`}>
                                <Link href="/debate" onClick={closeMenu}>Debates</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem className="w-full">
                            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} w-full h-12 text-lg justify-start px-8 bg-transparent rounded-none`}>
                                <Link href="/docs" onClick={closeMenu}>Biblioteca</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </header>
    );
}