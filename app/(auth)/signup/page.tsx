"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { POSTURA_OPTIONS } from "@/lib/debate-domain"
import { Button } from "@/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { AuthLink } from "@/components/auth/auth-link"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordStrength, validatePassword } from "@/components/auth/password-strength"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/ui/input-otp"
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react"

const RESEND_COOLDOWN = 60
const isSignupOtpEnabled = process.env.NEXT_PUBLIC_AUTH_SIGNUP_OTP_ENABLED === "true"

type Step = "signup" | "verify"

export default function SignUpPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>("signup")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [postura, setPostura] = useState("")
    const [otp, setOtp] = useState("")
    const [countdown, setCountdown] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (countdown <= 0) return
        const intervalId = setInterval(() => {
            setCountdown((value) => {
                if (value <= 1) {
                    clearInterval(intervalId)
                    return 0
                }

                return value - 1
            })
        }, 1000)
        return () => clearInterval(intervalId)
    }, [countdown])

    const sendVerificationCode = async () => {
        if (!isSignupOtpEnabled) return

        setError(null)
        setLoading(true)

        await authClient.emailOtp.sendVerificationOtp(
            {
                email,
                type: "email-verification",
            },
            {
                onSuccess: () => {
                    setCountdown(RESEND_COOLDOWN)
                    setLoading(false)
                },
                onError: (ctx) => {
                    setError(ctx.error.message)
                    setLoading(false)
                },
            },
        )
    }

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
                    if (!isSignupOtpEnabled) {
                        router.push("/")
                        return
                    }

                    setStep("verify")
                    setCountdown(RESEND_COOLDOWN)
                    setLoading(false)
                },
                onError: (ctx) => {
                    setError(ctx.error.message)
                    setLoading(false)
                },
            },
        )
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        await authClient.emailOtp.verifyEmail(
            { email, otp },
            {
                onSuccess: () => {
                    router.push("/login?verified=true")
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
            {step === "signup" && (
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
                </>
            )}

            {isSignupOtpEnabled && step === "verify" && (
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
                        <CardTitle>Verifica tu correo</CardTitle>
                        <CardDescription>
                            Enviamos un código de 6 dígitos a <span className="font-medium text-foreground">{email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                            <div className="flex flex-col items-center gap-3">
                                <Label className="self-start">Código de verificación</Label>
                                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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

                                <div className="flex items-center gap-1.5 text-sm">
                                    {countdown > 0 ? (
                                        <span className="text-muted-foreground">
                                            Reenviar en <span className="tabular-nums text-foreground">{countdown}s</span>
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-muted-foreground">¿No recibiste el código?</span>
                                            <button
                                                type="button"
                                                onClick={sendVerificationCode}
                                                disabled={loading}
                                                className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
                                            >
                                                Reenviar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}

                            <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
                                {loading ? "Verificando..." : "Verificar cuenta"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setStep("signup")
                                setOtp("")
                                setError(null)
                            }}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            <ArrowLeft className="size-3.5" />
                            Cambiar datos
                        </button>
                    </CardFooter>
                </>
            )}
        </Card>
    )
}