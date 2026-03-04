"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PasswordInputProps
    extends Omit<React.ComponentProps<"input">, "type"> {
    wrapperClassName?: string
}

export function PasswordInput({
    className,
    wrapperClassName,
    ...props
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false)

    return (
        <div className={cn("relative", wrapperClassName)}>
            <Input
                type={visible ? "text" : "password"}
                className={cn("pr-10", className)}
                {...props}
            />
            <button
                type="button"
                tabIndex={-1}
                onClick={() => setVisible((v) => !v)}
                className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
                {visible ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </button>
        </div>
    )
}
