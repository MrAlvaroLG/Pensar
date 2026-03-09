"use client"

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { Camera, LoaderCircle } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { isPosturaValue, POSTURA_OPTIONS, type PosturaValue } from "@/lib/debate-domain"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ProfileDialogUser {
    name?: string | null
    email?: string | null
    image?: string | null
    postura?: PosturaValue | null
    phoneNumber?: string | null
}

interface ProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: ProfileDialogUser
}

const E164_PHONE_REGEX = /^\+[1-9]\d{1,14}$/

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
}

export default function ProfileDialog({ open, onOpenChange, user }: ProfileDialogProps) {
    const [name, setName] = useState(user.name ?? "")
    const [postura, setPostura] = useState<PosturaValue>(user.postura ?? "OTRO")
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "")
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(user.image ?? null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
    const imageInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (!open) return

        setName(user.name ?? "")
        setPostura(user.postura ?? "OTRO")
        setPhoneNumber(user.phoneNumber ?? "")
        setImageDataUrl(user.image ?? null)
        setSaveError(null)
        setSaveSuccess(null)
    }, [open, user])

    const initials = useMemo(() => {
        const displayName = name.trim() || user.name || "Usuario"
        return getInitials(displayName)
    }, [name, user.name])

    const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            setSaveError("Selecciona un archivo de imagen valido")
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setImageDataUrl(reader.result)
                setSaveError(null)
            }
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        const displayName = name.trim()
        const normalizedPhoneNumber = phoneNumber.trim()

        if (!displayName) {
            setSaveError("El nombre es obligatorio")
            return
        }

        if (normalizedPhoneNumber && !E164_PHONE_REGEX.test(normalizedPhoneNumber)) {
            setSaveError("El numero telefonico debe usar formato E.164 (ej: +5355286169)")
            return
        }

        setIsSaving(true)
        setSaveError(null)
        setSaveSuccess(null)

        try {
            const client = authClient as unknown as {
                updateUser?: (input: unknown) => Promise<unknown>
            }

            if (!client.updateUser) {
                throw new Error("No se pudo actualizar el perfil en este entorno")
            }

            await client.updateUser({
                name: displayName,
                image: imageDataUrl,
                postura,
                phoneNumber: normalizedPhoneNumber || null,
            })

            setSaveSuccess("Perfil actualizado correctamente")
            onOpenChange(false)
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo actualizar el perfil"
            setSaveError(message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-xl" showCloseButton>
                <DialogHeader className="border-b px-6 pt-6 pb-4">
                    <DialogTitle>Mi Perfil</DialogTitle>
                    <DialogDescription>
                        Actualiza tus datos personales y tu postura para personalizar tu experiencia.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 px-6 py-4">
                    <section className="flex flex-col items-center gap-3 bg-card px-6">
                        <div className="relative">
                            <Avatar
                            onClick={() => imageInputRef.current?.click()}
                            className="size-32 md:size-40 border-4 border-background shadow-md">
                                <AvatarImage src={imageDataUrl ?? undefined} alt={name || "Usuario"} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                type="button"
                                aria-label="Subir foto de perfil"
                                onClick={() => imageInputRef.current?.click()}
                                className="absolute right-0 bottom-0 inline-flex size-7 md:size-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <Camera className="size-4" />
                            </button>
                        </div>

                        <div className="space-y-1 text-center">
                            <p className="text-sm font-medium">Foto de perfil</p>
                            <p className="text-xs text-muted-foreground">
                                Toca el icono de camara para subir una imagen.
                            </p>
                        </div>
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
                        />
                    </section>

                    <section className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="profile-name">Nombre</Label>
                            <Input
                                id="profile-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="profile-email">Email</Label>
                            <Input
                                id="profile-email"
                                value={user.email ?? ""}
                                disabled
                                readOnly
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="profile-postura">Postura</Label>
                            <Select
                                value={postura}
                                onValueChange={(value) => {
                                    if (isPosturaValue(value)) {
                                        setPostura(value)
                                    }
                                }}
                            >
                                <SelectTrigger id="profile-postura" className="w-full">
                                    <SelectValue placeholder="Selecciona tu postura" />
                                </SelectTrigger>
                                <SelectContent>
                                    {POSTURA_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="profile-phone">Numero telefónico</Label>
                            <Input
                                id="profile-phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={(event) => {
                                    setPhoneNumber(event.target.value)
                                    if (saveError) {
                                        setSaveError(null)
                                    }
                                }}
                                placeholder="+53********"
                                inputMode="tel"
                                autoComplete="tel"
                                pattern="^\+[1-9]\d{1,14}$"
                                aria-invalid={
                                    Boolean(phoneNumber.trim()) &&
                                    !E164_PHONE_REGEX.test(phoneNumber.trim())
                                }
                            />
                        </div>
                    </section>

                    {saveError && (
                        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {saveError}
                        </p>
                    )}
                    {saveSuccess && (
                        <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
                            {saveSuccess}
                        </p>
                    )}
                </div>

                <DialogFooter className="border-t px-6 py-4">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={isSaving}>
                        {isSaving && <LoaderCircle className="size-4 animate-spin" />}
                        Guardar cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
