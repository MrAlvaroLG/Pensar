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
import Image from "next/image"

export default function SignUpPage() {
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
                <CardTitle>Únete a la comunidad</CardTitle>
                <CardDescription>Cree su cuenta y comience a debatir hoy mismo</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Nombre</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Carlos Perez"
                                required
                            />
                        </div>
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
                            <Label>Postura Filosófica</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectItem value="teista">Teísta</SelectItem>
                                    <SelectItem value="ateo">Ateo</SelectItem>
                                    <SelectItem value="agnostico">Agnóstico</SelectItem>
                                    <SelectItem value="deista">Deísta</SelectItem>
                                    <SelectItem value="panteista">Panteísta</SelectItem>
                                    <SelectItem value="otro">Otra / Prefiero no decir</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Confirmar Contraseña</Label>
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
                <Button type="submit" className="w-full">Registrarse</Button>
                
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

                <div className="flex items-center text-sm text-muted-foreground ">
                    Ya tienes una cuenta?
                    <a href="/login" className="ml-1.5 inline-block text-sm text-foreground underline-offset-4 underline">
                        Inicia Sesión
                    </a>
                </div>
            </CardFooter>
        </Card>
    )
}