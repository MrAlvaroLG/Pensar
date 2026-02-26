import Link from "next/link";
import Image from "next/image"; // Importante para optimización
import { Button } from "@/components/ui/button"; // Botón de shadcn
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function NavBar(){
    return(
        <header className="relative w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-8">
                <NavigationMenu>
                    <NavigationMenuList>
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
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="logo/Logo Negro.svg"
                            alt="Pensar"
                            width={40}
                            height={40}
                            priority
                        />
                    </Link>
                </div>
                <Link href="/login">
                    <Button>Iniciar Sesión</Button>
                </Link>
            </div>
        </header >
    );
}
