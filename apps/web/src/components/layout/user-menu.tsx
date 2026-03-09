"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import {
    getStatusLabel,
    getTeamLabel,
    type DebateRegistrationStatus,
    type DebateTeam,
    isPosturaValue,
    type PosturaValue,
} from "@/lib/debate-domain"
import {
    LogOut,
    User,
    LayoutDashboard,
} from "lucide-react"
import ProfileDialog from "@/components/layout/profile-dialog"
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
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const { data: session, isPending } = authClient.useSession()
    const userId = session?.user?.id
    const [registration, setRegistration] = useState<{
        debateTitle: string
        team: DebateTeam
        status: DebateRegistrationStatus
    } | null>(null)

    useEffect(() => {
        if (!userId) {
            return
        }

        let isMounted = true

        const loadRegistrationStatus = async () => {
            try {
                const response = await fetch("/api/debates/registration-status", {
                    method: "GET",
                })

                if (!response.ok) {
                    return
                }

                const payload = await response.json() as {
                    registration?: {
                        debateTitle: string
                        team: DebateTeam
                        status: DebateRegistrationStatus
                    } | null
                }

                if (isMounted) {
                    setRegistration(payload.registration ?? null)
                }
            } catch {
                if (isMounted) {
                    setRegistration(null)
                }
            }
        }

        loadRegistrationStatus()

        return () => {
            isMounted = false
        }
    }, [userId])

    if (isPending) {
        return <Skeleton className="size-8 rounded-full" />
    }

    if (!session?.user) {
        return null
    }

    const { user } = session
    const displayName = user.name || "Usuario"
    const initials = getInitials(displayName)
    const userData = user as {
        role?: string
        postura?: PosturaValue | null
        phoneNumber?: string | null
    }
    const userRole = userData.role
    const registrationInfo = userId ? registration : null
    const safePostura = userData.postura && isPosturaValue(userData.postura)
        ? userData.postura
        : null

    const teamLabel = registrationInfo ? getTeamLabel(registrationInfo.team) : ""
    const statusLabel = registrationInfo ? getStatusLabel(registrationInfo.status) : ""

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
        <>
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
                            onClick={() => setIsProfileOpen(true)}
                            className="cursor-pointer"
                        >
                            <User />
                            <span>Mi Perfil</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {registrationInfo && (
                        <>
                            <DropdownMenuLabel className="font-normal">
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Estado en debate</p>
                                    <p className="text-sm font-medium">{statusLabel} - Equipo {teamLabel}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem
                        onClick={handleSignOut}
                        variant="destructive"
                        className="cursor-pointer"
                    >
                        <LogOut />
                        <span>Cerrar Sesion</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProfileDialog
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                user={{
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    postura: safePostura,
                    phoneNumber: userData.phoneNumber,
                }}
            />
        </>
    )
}
