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
import { OAuthDivider, OAuthButtons } from "@/components/auth/oauth-buttons"
import { AuthLink } from "@/components/auth/auth-link"
import Image from "next/image"

export default function LoginPage() {
    return (
        <Card className="m-5 w-full max-w-sm">
            <CardHeader className="flex flex-col items-center text-center">
                <Image
                    className="pb-3"
                    src="logo/Logo Negro.svg"
                    alt="Pensar"
                    width={50}
                    height={50}
                    priority
                />
                <CardTitle>Bienvenido de Nuevo!</CardTitle>
                <CardDescription>Por favor, introduzca sus datos para acceder</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="login-email">Correo Electrónico</Label>
                            <Input
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
                                    href="#"
                                    className="ml-auto inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                                >
                                    Olvidaste tu contraseña?
                                </a>
                            </div>
                            <Input id="login-password" type="password" required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">Iniciar Sesión</Button>
                <OAuthDivider />
                <OAuthButtons />
                <AuthLink
                    text="No tienes una cuenta?"
                    href="/signup"
                    linkText="Regístrate"
                />
            </CardFooter>
        </Card>
    )
}