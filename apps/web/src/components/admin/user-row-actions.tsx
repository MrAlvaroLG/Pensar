"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface UserRowActionsProps {
    userId: string
    userName: string
    canPromote: boolean
    onDelete: (formData: FormData) => Promise<void>
    onPromote: (formData: FormData) => Promise<void>
}

function SubmitButton({
    label,
    variant,
}: {
    label: string
    variant: "destructive" | "outline"
}) {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" size="sm" variant={variant} disabled={pending}>
            {pending ? "Procesando..." : label}
        </Button>
    )
}

export function UserRowActions({
    userId,
    userName,
    canPromote,
    onDelete,
    onPromote,
}: UserRowActionsProps) {
    return (
        <div className="inline-flex items-center gap-2">
            {canPromote && (
                <form action={onPromote} className="inline-flex">
                    <input type="hidden" name="userId" value={userId} />
                    <SubmitButton label="Hacer admin" variant="outline" />
                </form>
            )}

            <Dialog>
                <DialogTrigger asChild>
                    <Button type="button" variant="destructive" size="sm">
                        Eliminar
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Seguro que quieres eliminar a {userName}? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row justify-between">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <form action={onDelete}>
                            <input type="hidden" name="userId" value={userId} />
                            <SubmitButton label="Eliminar" variant="destructive" />
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
