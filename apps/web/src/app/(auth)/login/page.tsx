import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
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
import Image from "next/image"

export default function LoginPage() {
    return (
        <Card className="w-full max-w-sm m-5">
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
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@ejemplo.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Contraseña</Label>
                                <a href="#" className="ml-auto inline-block text-muted-foreground text-sm underline-offset-4 hover:underline hover:text-foreground">
                                    Olvidaste tu contraseña?
                                </a>
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">Iniciar Sesión</Button>
                
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                    </div>
                </div>

                <div className="grid w-full md:grid-cols-2 gap-2 grid-cols-1">
                    <Button variant="outline" type="button">
                        <FcGoogle className="mr-2 h-4 w-4" /> Google
                    </Button>
                    <Button variant="outline" type="button">
                        <FaApple className="mr-2 h-4 w-4" /> Apple
                    </Button>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                    No tienes una cuenta?
                    <a href="/signup" className="ml-1.5 inline-block text-sm text-foreground underline-offset-4 underline">
                        Regístrate
                    </a>
                </div>
            </CardFooter>
        </Card>
    )
}