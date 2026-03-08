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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLink } from "@/components/auth/auth-link"
import { PasswordInput } from "@/components/auth/password-input"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        await authClient.signIn.email(
            { email, password },
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
                <CardTitle>Bienvenido de Nuevo!</CardTitle>
                <CardDescription>Por favor, introduzca sus datos para acceder</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="login-email">Correo Electrónico</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="login-email"
                            type="email"
                            placeholder="m@ejemplo.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="login-password">Contraseña</Label>
                            <a
                                href="/forgot-password"
                                className="ml-auto inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                            >
                                Olvidaste tu contraseña?
                            </a>
                        </div>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="login-password"
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <AuthLink
                    text="No tienes una cuenta?"
                    href="/signup"
                    linkText="Regístrate"
                />
            </CardFooter>
        </Card>
    )
}