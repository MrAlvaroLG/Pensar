"use client"

import { useRef, useCallback } from "react"
import { ImageIcon, Mic, FileText, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatFileUploadProps {
    onFile: (file: File) => void
    disabled?: boolean
}

export function ChatFileUpload({ onFile, disabled }: ChatFileUploadProps) {
    const imageRef = useRef<HTMLInputElement>(null)
    const audioRef = useRef<HTMLInputElement>(null)
    const docRef = useRef<HTMLInputElement>(null)

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                onFile(file)
                e.target.value = ""
            }
        },
        [onFile]
    )

    return (
        <div className="flex items-center gap-0.5">
            <input
                ref={imageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />
            <input
                ref={audioRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleChange}
            />
            <input
                ref={docRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                className="hidden"
                onChange={handleChange}
            />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                disabled={disabled}
                onClick={() => imageRef.current?.click()}
                title="Adjuntar imagen"
            >
                <ImageIcon className="size-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                disabled={disabled}
                onClick={() => audioRef.current?.click()}
                title="Adjuntar audio"
            >
                <Mic className="size-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                disabled={disabled}
                onClick={() => docRef.current?.click()}
                title="Adjuntar documento"
            >
                <FileText className="size-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                disabled={disabled}
                onClick={() => docRef.current?.click()}
                title="Adjuntar archivo"
            >
                <Paperclip className="size-4" />
            </Button>
        </div>
    )
}
