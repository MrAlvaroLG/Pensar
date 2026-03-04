"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"

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
    const handleGoogle = () => {
        authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        })
    }

    return (
        <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={handleGoogle}
        >
            <FcGoogle className="mr-2 h-4 w-4" /> Google
        </Button>
    )
}
