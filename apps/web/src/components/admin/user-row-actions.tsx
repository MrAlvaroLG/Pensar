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
    canMakeAdmin?: boolean
    canMakePublisher?: boolean
    canMakeUser?: boolean
    onDelete: (formData: FormData) => Promise<void>
    onMakeAdmin?: (formData: FormData) => Promise<void>
    onMakePublisher?: (formData: FormData) => Promise<void>
    onMakeUser?: (formData: FormData) => Promise<void>
}

export function UserRowActions({
    userId,
    userName,
    canMakeAdmin = false,
    canMakePublisher = false,
    canMakeUser = false,
    onDelete,
    onMakeAdmin,
    onMakePublisher,
    onMakeUser,
}: UserRowActionsProps) {
    return (
        <div className="inline-flex items-center gap-2">
            {canMakeAdmin && onMakeAdmin && (
                <form action={onMakeAdmin} className="inline-flex">
                    <input type="hidden" name="userId" value={userId} />
                    <SubmitButton label="Hacer admin" variant="outline" />
                </form>
            )}

            {canMakePublisher && onMakePublisher && (
                <form action={onMakePublisher} className="inline-flex">
                    <input type="hidden" name="userId" value={userId} />
                    <SubmitButton label="Hacer publisher" variant="outline" />
                </form>
            )}

            {canMakeUser && onMakeUser && (
                <form action={onMakeUser} className="inline-flex">
                    <input type="hidden" name="userId" value={userId} />
                    <SubmitButton label="Hacer user" variant="outline" />
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
