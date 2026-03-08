"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLink } from "@/components/auth/auth-link"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordStrength, validatePassword } from "@/components/auth/password-strength"

const POSTURA_OPTIONS = [
    { value: "TEISTA", label: "Teísta" },
    { value: "ATEO", label: "Ateo" },
    { value: "AGNOSTICO", label: "Agnóstico" },
    { value: "DEISTA", label: "Deísta" },
    { value: "PANTEISTA", label: "Panteísta" },
    { value: "OTRO", label: "Otra / Prefiero no decir" },
] as const

export default function SignUpPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [postura, setPostura] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        if (!validatePassword(password)) {
            setError("La contraseña no cumple todos los requisitos de seguridad")
            return
        }

        if (!postura) {
            setError("Debes seleccionar una postura filosófica")
            return
        }

        setLoading(true)

        await authClient.signUp.email(
            {
                email,
                password,
                name,
                postura,
            } as Parameters<typeof authClient.signUp.email>[0],
            {
                onSuccess: () => {
                    router.push("/")
                },
                onError: (ctx) => {
                    setError(ctx.error.message)
                    setLoading(false)
                },
            },
        )
    }

    return (
        <Card className="m-5 w-full max-w-sm">
            <CardHeader className="flex flex-col items-center text-center">
                <Image
                    className="pb-3"
                    src="/logo/logo-negro.svg"
                    alt="Pensar"
                    width={50}
                    height={50}
                    priority
                />
                <CardTitle>Únete a la comunidad</CardTitle>
                <CardDescription>Cree su cuenta y comience a debatir hoy mismo</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignUp} className="flex flex-col gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="signup-name">Nombre</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="signup-name"
                            type="text"
                            placeholder="Carlos Perez"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="signup-email">Correo Electrónico</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="signup-email"
                            type="email"
                            placeholder="m@ejemplo.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="signup-postura">Postura Filosófica</Label>
                        <Select onValueChange={setPostura} required>
                            <SelectTrigger id="signup-postura" className="w-full">
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {POSTURA_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="signup-password">Contraseña</Label>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="signup-password"
                            required
                        />
                        <PasswordStrength password={password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="signup-confirm-password">Confirmar Contraseña</Label>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            id="signup-confirm-password"
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <AuthLink
                    text="Ya tienes una cuenta?"
                    href="/login"
                    linkText="Inicia Sesión"
                />
            </CardFooter>
        </Card>
    )
}