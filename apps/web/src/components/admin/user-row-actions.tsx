"use client"

import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/admin/submit-button"
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
    canDemote?: boolean
    onDelete: (formData: FormData) => Promise<void>
    onPromote: (formData: FormData) => Promise<void>
    onDemote?: (formData: FormData) => Promise<void>
}

export function UserRowActions({
    userId,
    userName,
    canPromote,
    canDemote = false,
    onDelete,
    onPromote,
    onDemote,
}: UserRowActionsProps) {
    return (
        <div className="inline-flex items-center gap-2">
            {canPromote && (
                <form action={onPromote} className="inline-flex">
                    <input type="hidden" name="userId" value={userId} />
                    <SubmitButton label="Hacer admin" variant="outline" />
                </form>
            )}

            {canDemote && onDemote && (
                <form action={onDemote} className="inline-flex">
                    <input type="hidden" name="userId" value={userId} />
                    <SubmitButton label="Quitar admin" variant="outline" />
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
