"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
    label: string
    variant: "destructive" | "outline"
}

export function SubmitButton({ label, variant }: SubmitButtonProps) {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" size="sm" variant={variant} disabled={pending}>
            {pending ? "Procesando..." : label}
        </Button>
    )
}
