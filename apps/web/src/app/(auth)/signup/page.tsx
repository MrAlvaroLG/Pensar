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
import { OAuthDivider, OAuthButtons } from "@/components/auth/oauth-buttons"
import { AuthLink } from "@/components/auth/auth-link"
import Image from "next/image"

export default function SignUpPage() {
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
                <CardTitle>Únete a la comunidad</CardTitle>
                <CardDescription>Cree su cuenta y comience a debatir hoy mismo</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="signup-name">Nombre</Label>
                            <Input
                                id="signup-name"
                                type="text"
                                placeholder="Carlos Perez"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="signup-email">Correo Electrónico</Label>
                            <Input
                                id="signup-email"
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
                            <Label htmlFor="signup-password">Contraseña</Label>
                            <Input id="signup-password" type="password" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="signup-confirm-password">Confirmar Contraseña</Label>
                            <Input id="signup-confirm-password" type="password" required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full">Registrarse</Button>
                <OAuthDivider />
                <OAuthButtons />
                <AuthLink
                    text="Ya tienes una cuenta?"
                    href="/login"
                    linkText="Inicia Sesión"
                />
            </CardFooter>
        </Card>
    )
}