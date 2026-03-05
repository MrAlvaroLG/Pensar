"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import {
    LogOut,
    Settings,
    User,
    LayoutDashboard,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
}

export default function UserMenu() {
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()

    if (isPending) {
        return <Skeleton className="size-8 rounded-full" />
    }

    if (!session?.user) {
        return null
    }

    const { user } = session
    const displayName = user.name || "Usuario"
    const initials = getInitials(displayName)
    const userRole = (user as { role?: string }).role

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                    router.refresh()
                },
            },
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative flex size-8 items-center justify-center rounded-full ring-2 ring-transparent transition-all hover:ring-ring/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Avatar size="default">
                        <AvatarImage
                            src={user.image ?? undefined}
                            alt={displayName}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56"
                align="end"
                sideOffset={8}
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 py-0.5">
                        <Avatar size="default">
                            <AvatarImage
                                src={user.image ?? undefined}
                                alt={displayName}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold leading-tight">
                                {displayName}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {userRole === "ADMIN" && (
                            <DropdownMenuItem
                                onClick={() => router.push("/dashboard")}
                                className="cursor-pointer"
                            >
                                <LayoutDashboard />
                                <span>Administrador</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={() => router.push("/perfil")}
                            className="cursor-pointer"
                        >
                            <User />
                            <span>Mi Perfil</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleSignOut}
                        variant="destructive"
                        className="cursor-pointer"
                    >
                        <LogOut />
                        <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
