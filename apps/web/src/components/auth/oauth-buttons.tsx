import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaApple } from "react-icons/fa"

export function OAuthDivider() {
    return (
        <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
            </div>
        </div>
    )
}

export function OAuthButtons() {
    return (
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
            <Button variant="outline" type="button">
                <FcGoogle className="mr-2 h-4 w-4" /> Google
            </Button>
            <Button variant="outline" type="button">
                <FaApple className="mr-2 h-4 w-4" /> Apple
            </Button>
        </div>
    )
}
