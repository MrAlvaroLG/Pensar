"use client"

import { useState, useEffect, useCallback } from "react"
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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp"
import { AuthLink } from "@/components/auth/auth-link"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordStrength, validatePassword } from "@/components/auth/password-strength"
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react"

const RESEND_COOLDOWN = 60

type Step = "email" | "otp"

export default function ForgotPasswordPage() {
    const router = useRouter()

    const [step, setStep] = useState<Step>("email")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        if (countdown <= 0) return
        const id = setInterval(() => setCountdown((c) => c - 1), 1000)
        return () => clearInterval(id)
    }, [countdown])

    const sendCode = useCallback(async () => {
        setError(null)
        setLoading(true)
        await authClient.emailOtp.requestPasswordReset(
            { email },
            {
                onSuccess: () => {
                    setStep("otp")
                    setCountdown(RESEND_COOLDOWN)
                    setLoading(false)
                },
                onError: (ctx) => {
                    setError(ctx.error.message)
                    setLoading(false)
                },
            },
        )
    }, [email])

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await sendCode()
    }

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }
        if (!validatePassword(password)) {
            setError("La contraseña no cumple los requisitos de seguridad")
            return
        }

        setLoading(true)
        await authClient.emailOtp.resetPassword(
            { email, otp, password },
            {
                onSuccess: () => {
                    router.push("/login?reset=true")
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
            {/* ── PASO 1: EMAIL ── */}
            {step === "email" && (
                <>
                    <CardHeader className="flex flex-col items-center text-center">
                        <Image
                            className="pb-3"
                            src="/logo/logo-negro.svg"
                            alt="Pensar"
                            width={50}
                            height={50}
                            priority
                        />
                        <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-muted">
                            <Mail className="size-5 text-muted-foreground" />
                        </div>
                        <CardTitle>Recuperar contraseña</CardTitle>
                        <CardDescription>
                            Introduce tu correo y te enviaremos un código de verificación
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="forgot-email">Correo Electrónico</Label>
                                <Input
                                    id="forgot-email"
                                    type="email"
                                    placeholder="m@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Enviando..." : "Enviar código"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <AuthLink
                            text="¿Ya tienes tu contraseña?"
                            href="/login"
                            linkText="Inicia Sesión"
                        />
                    </CardFooter>
                </>
            )}

            {/* ── PASO 2: OTP + NUEVA CONTRASEÑA ── */}
            {step === "otp" && (
                <>
                    <CardHeader className="flex flex-col items-center text-center">
                        <Image
                            className="pb-3"
                            src="/logo/logo-negro.svg"
                            alt="Pensar"
                            width={50}
                            height={50}
                            priority
                        />
                        <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-muted">
                            <ShieldCheck className="size-5 text-muted-foreground" />
                        </div>
                        <CardTitle>Verifica tu identidad</CardTitle>
                        <CardDescription>
                            Hemos enviado un código de 6 dígitos a{" "}
                            <span className="font-medium text-foreground">{email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
                            {/* OTP */}
                            <div className="flex flex-col items-center gap-3">
                                <Label className="self-start">Código de verificación</Label>
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={setOtp}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>

                                {/* Reenviar */}
                                <div className="flex items-center gap-1.5 text-sm">
                                    {countdown > 0 ? (
                                        <span className="text-muted-foreground">
                                            Reenviar en{" "}
                                            <span className="tabular-nums text-foreground">
                                                {countdown}s
                                            </span>
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-muted-foreground">
                                                ¿No recibiste el código?
                                            </span>
                                            <button
                                                type="button"
                                                onClick={sendCode}
                                                disabled={loading}
                                                className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
                                            >
                                                Reenviar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Separador visual */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Nueva contraseña
                                    </span>
                                </div>
                            </div>

                            {/* Nueva contraseña */}
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">Contraseña</Label>
                                <PasswordInput
                                    id="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <PasswordStrength password={password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                                <PasswordInput
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || otp.length < 6}
                            >
                                {loading ? "Cambiando contraseña..." : "Cambiar contraseña"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setStep("email")
                                setOtp("")
                                setError(null)
                            }}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            <ArrowLeft className="size-3.5" />
                            Cambiar correo
                        </button>
                    </CardFooter>
                </>
            )}
        </Card>
    )
}

