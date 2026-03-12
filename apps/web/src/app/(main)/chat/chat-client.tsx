"use client"

import {
    useState,
    useEffect,
    useRef,
    useCallback,
    type KeyboardEvent,
} from "react"
import { createClient } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { ChatFileUpload } from "./chat-file-upload"
import {
    Check,
    Clock,
    Trash2,
    Flag,
    Send,
    X,
    FileText,
    Music,
    ChevronUp,
    Mic,
    Square,
} from "lucide-react"
import type { ChatFileType } from "@prisma/client"

interface MessageUser {
    id: string
    name: string
    image: string | null
}

export interface ChatMessageData {
    id: string
    content: string
    fileUrl: string | null
    fileType: ChatFileType | null
    fileName: string | null
    createdAt: string
    user: MessageUser
}

type MessageStatus = "queued" | "sent"

interface LocalMessage extends ChatMessageData {
    status: MessageStatus
    localId?: string
}

interface ChatClientProps {
    debate: { id: string; title: string; question: string }
    team: "red" | "blue"
    currentUser: { id: string; name: string; image: string | null }
    initialMessages: ChatMessageData[]
}

const TEAM_LABEL = { red: "Equipo Rojo", blue: "Equipo Azul" }
const TEAM_COLOR = {
    red: "text-red-500 border-red-500/30 bg-red-500/5",
    blue: "text-blue-500 border-blue-500/30 bg-blue-500/5",
}
const TEAM_SEND_BTN = {
    red: "bg-red-600 hover:bg-red-700 text-white",
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    })
}

async function compressImage(file: File): Promise<File> {
    const MAX_SIDE = 1280
    const QUALITY = 0.82
    return new Promise((resolve) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            let { naturalWidth: w, naturalHeight: h } = img
            if (w <= MAX_SIDE && h <= MAX_SIDE) {
                resolve(file)
                return
            }
            const ratio = Math.min(MAX_SIDE / w, MAX_SIDE / h)
            w = Math.round(w * ratio)
            h = Math.round(h * ratio)
            const canvas = document.createElement("canvas")
            canvas.width = w
            canvas.height = h
            const ctx = canvas.getContext("2d")
            if (!ctx) { resolve(file); return }
            ctx.drawImage(img, 0, 0, w, h)
            canvas.toBlob(
                (blob) => {
                    if (!blob) { resolve(file); return }
                    const baseName = file.name.replace(/\.[^.]+$/, "")
                    resolve(new File([blob], `${baseName}.jpg`, { type: "image/jpeg" }))
                },
                "image/jpeg",
                QUALITY
            )
        }
        img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file) }
        img.src = objectUrl
    })
}

function FilePreview({
    file,
    onRemove,
}: {
    file: File
    onRemove: () => void
}) {
    const isImage = file.type.startsWith("image/")
    const isAudio = file.type.startsWith("audio/")
    const previewUrl = isImage ? URL.createObjectURL(file) : null

    return (
        <div className="relative flex items-center gap-2 rounded-lg border bg-muted/50 p-2 pr-8 text-sm">
            {isImage && previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-12 w-12 rounded object-cover"
                />
            ) : isAudio ? (
                <Music className="size-8 text-muted-foreground" />
            ) : (
                <FileText className="size-8 text-muted-foreground" />
            )}
            <span className="max-w-[200px] truncate text-muted-foreground">
                {file.name}
            </span>
            <button
                type="button"
                onClick={onRemove}
                className="absolute right-1 top-1 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            >
                <X className="size-3" />
            </button>
        </div>
    )
}

function MessageBubble({
    message,
    isOwn,
    team,
    showHeader,
    onLongPress,
    onImageClick,
}: {
    message: LocalMessage
    isOwn: boolean
    team: "red" | "blue"
    showHeader: boolean
    onLongPress: (msg: LocalMessage) => void
    onImageClick: (url: string) => void
}) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const startPress = useCallback(() => {
        timerRef.current = setTimeout(() => {
            onLongPress(message)
        }, 600)
    }, [message, onLongPress])

    const cancelPress = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
    }, [])

    const isImage = message.fileType === "IMAGE"
    const isAudio = message.fileType === "AUDIO"

    const ownBubbleClass =
        team === "red"
            ? "rounded-tr-sm bg-red-600 text-white"
            : "rounded-tr-sm bg-blue-600 text-white"

    return (
        <div className={cn("flex w-full gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
            {!isOwn && (
                <div className="mt-1 size-7 shrink-0">
                    {showHeader ? (
                        <Avatar className="size-7">
                            <AvatarImage src={message.user.image ?? undefined} />
                            <AvatarFallback className="text-xs">
                                {message.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    ) : null}
                </div>
            )}

            <div
                className={cn(
                    "group flex min-w-0 max-w-[75%] flex-col gap-0.5",
                    isOwn ? "items-end" : "items-start"
                )}
            >
                {!isOwn && showHeader && (
                    <span className="px-1 text-xs text-muted-foreground">
                        {message.user.name}
                    </span>
                )}

                <div
                    onPointerDown={startPress}
                    onPointerUp={cancelPress}
                    onPointerLeave={cancelPress}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        onLongPress(message)
                    }}
                    className={cn(
                        "select-none rounded-2xl px-3 py-2 text-sm shadow-sm",
                        isOwn ? ownBubbleClass : "rounded-tl-sm bg-muted text-foreground"
                    )}
                >
                    {isImage && message.fileUrl && (
                        <button
                            type="button"
                            className="block cursor-zoom-in"
                            onClick={() => onImageClick(message.fileUrl!)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={message.fileUrl}
                                alt={message.fileName ?? "imagen"}
                                className="mb-1 max-h-48 w-full rounded-lg object-cover"
                            />
                        </button>
                    )}
                    {isAudio && message.fileUrl && (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <audio controls src={message.fileUrl} className="mb-1 w-48" />
                    )}
                    {!isImage && !isAudio && message.fileUrl && (
                        <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-1 flex items-center gap-1.5 underline underline-offset-2"
                        >
                            <FileText className="size-4 shrink-0" />
                            <span className="truncate max-w-[200px]">
                                {message.fileName ?? "archivo"}
                            </span>
                        </a>
                    )}
                    {message.content && (
                        <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                            {message.content}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-1 px-1">
                    <span className="text-[10px] text-muted-foreground">
                        {formatTime(message.createdAt)}
                    </span>
                    {isOwn && (
                        <>
                            {message.status === "queued" ? (
                                <Clock className="size-3 opacity-70" />
                            ) : (
                                <Check className="size-3 opacity-70" />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export function ChatClient({
    debate,
    team,
    currentUser,
    initialMessages,
}: ChatClientProps) {
    const [messages, setMessages] = useState<LocalMessage[]>(
        initialMessages.map((m) => ({ ...m, status: "sent" as MessageStatus }))
    )
    const [input, setInput] = useState("")
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const [sending, setSending] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextCursor, setNextCursor] = useState<string | null>(null)
    const [contextMsg, setContextMsg] = useState<LocalMessage | null>(null)
    const [reportDialogOpen, setReportDialogOpen] = useState(false)
    const [reportReason, setReportReason] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingSeconds, setRecordingSeconds] = useState(0)
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

    const bottomRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const localIdCounter = useRef(0)
    const processedIds = useRef(new Set<string>())
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Mark initial messages as known
    useEffect(() => {
        initialMessages.forEach((m) => processedIds.current.add(m.id))
    }, [initialMessages])

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length])

    // Supabase Realtime subscription
    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!url || !key) return

        const supabase = createClient(url, key)

        const channel = supabase
            .channel(`chat:${debate.id}:${team}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_message",
                    filter: `debateId=eq.${debate.id}`,
                },
                (payload) => {
                    const row = payload.new as {
                        id: string
                        content: string
                        file_url: string | null
                        file_type: ChatFileType | null
                        file_name: string | null
                        created_at: string
                        user_id: string
                        team: string
                    }

                    if (row.team !== team) return
                    if (processedIds.current.has(row.id)) {
                        // Upgrade our queued optimistic message to "sent"
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === row.id || (m.status === "queued" && m.content === row.content && m.user.id === currentUser.id)
                                    ? { ...m, id: row.id, status: "sent" }
                                    : m
                            )
                        )
                        processedIds.current.add(row.id)
                        return
                    }
                    processedIds.current.add(row.id)
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: row.id,
                            content: row.content,
                            fileUrl: row.file_url,
                            fileType: row.file_type,
                            fileName: row.file_name,
                            createdAt: row.created_at,
                            status: "sent",
                            user: {
                                id: row.user_id,
                                name: "...",
                                image: null,
                            },
                        },
                    ])
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "chat_message",
                    filter: `debateId=eq.${debate.id}`,
                },
                (payload) => {
                    const row = payload.new as { id: string; deleted: boolean; team: string }
                    if (row.team !== team) return
                    if (row.deleted) {
                        setMessages((prev) => prev.filter((m) => m.id !== row.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [debate.id, team, currentUser.id])

    const loadMore = useCallback(async () => {
        if (loadingMore || !nextCursor) return
        setLoadingMore(true)
        try {
            const res = await fetch(
                `/api/chat/messages?debateId=${debate.id}&team=${team}&cursor=${encodeURIComponent(nextCursor)}`
            )
            if (!res.ok) return
            const data = await res.json()
            setMessages((prev) => [
                ...data.messages.map((m: ChatMessageData) => ({
                    ...m,
                    status: "sent" as MessageStatus,
                })),
                ...prev,
            ])
            setNextCursor(data.nextCursor)
        } finally {
            setLoadingMore(false)
        }
    }, [debate.id, team, nextCursor, loadingMore])

    const sendMessage = useCallback(async () => {
        if (sending) return
        if (!input.trim() && !pendingFile) return

        const tempId = `local-${++localIdCounter.current}`
        const now = new Date().toISOString()

        const optimistic: LocalMessage = {
            id: tempId,
            content: input.trim(),
            fileUrl: pendingFile
                ? URL.createObjectURL(pendingFile)
                : null,
            fileType: pendingFile
                ? pendingFile.type.startsWith("image/")
                    ? "IMAGE"
                    : pendingFile.type.startsWith("audio/")
                    ? "AUDIO"
                    : "DOCUMENT"
                : null,
            fileName: pendingFile?.name ?? null,
            createdAt: now,
            status: "queued",
            user: currentUser,
        }

        setMessages((prev) => [...prev, optimistic])
        setInput("")
        const fileToSend = pendingFile
        setPendingFile(null)
        setSending(true)
        setError(null)

        try {
            let res: Response
            if (fileToSend) {
                const fd = new FormData()
                fd.append("content", optimistic.content)
                fd.append("file", fileToSend)
                res = await fetch("/api/chat/messages", { method: "POST", body: fd })
            } else {
                res = await fetch("/api/chat/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: optimistic.content }),
                })
            }

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                setError(data.error ?? "Error al enviar el mensaje")
                setMessages((prev) => prev.filter((m) => m.id !== tempId))
            } else {
                const data = await res.json()
                processedIds.current.add(data.message.id)
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === tempId
                            ? { ...data.message, status: "sent" as MessageStatus }
                            : m
                    )
                )
            }
        } catch {
            setError("Error de red. Intenta de nuevo.")
            setMessages((prev) => prev.filter((m) => m.id !== tempId))
        } finally {
            setSending(false)
        }
    }, [input, pendingFile, sending, currentUser])

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
            }
        },
        [sendMessage]
    )

    const deleteMessage = useCallback(async (msg: LocalMessage) => {
        setContextMsg(null)
        if (msg.user.id !== currentUser.id) return
        setMessages((prev) => prev.filter((m) => m.id !== msg.id))
        await fetch(`/api/chat/messages/${msg.id}`, { method: "DELETE" }).catch(() => null)
    }, [currentUser.id])

    const submitReport = useCallback(async () => {
        if (!contextMsg) return
        await fetch("/api/chat/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messageId: contextMsg.id, reason: reportReason }),
        }).catch(() => null)
        setReportDialogOpen(false)
        setReportReason("")
        setContextMsg(null)
    }, [contextMsg, reportReason])

    const handleFile = useCallback(async (file: File) => {
        if (file.type.startsWith("image/")) {
            const compressed = await compressImage(file)
            setPendingFile(compressed)
        } else {
            setPendingFile(file)
        }
    }, [])

    const formatRecordingTime = useCallback((s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0")
        const sec = (s % 60).toString().padStart(2, "0")
        return `${m}:${sec}`
    }, [])

    const startRecording = useCallback(async () => {
        if (isRecording) return
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            // Safari only supports audio/mp4; Chrome/Firefox prefer audio/webm
            const preferredTypes = [
                "audio/webm;codecs=opus",
                "audio/webm",
                "audio/ogg;codecs=opus",
                "audio/mp4",
            ]
            const supportedMime = preferredTypes.find(
                (t) => MediaRecorder.isTypeSupported(t)
            ) ?? ""
            const mr = new MediaRecorder(stream, supportedMime ? { mimeType: supportedMime } : undefined)
            audioChunksRef.current = []
            mr.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data)
            }
            mr.start(100)
            mediaRecorderRef.current = mr
            setIsRecording(true)
            setRecordingSeconds(0)
            recordingIntervalRef.current = setInterval(() => {
                setRecordingSeconds((s) => s + 1)
            }, 1000)
        } catch {
            setError("No se pudo acceder al micrófono. Por favor permite el acceso.")
        }
    }, [isRecording])

    const stopRecording = useCallback((send: boolean) => {
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current)
            recordingIntervalRef.current = null
        }
        const mr = mediaRecorderRef.current
        if (!mr || mr.state === "inactive") {
            setIsRecording(false)
            return
        }
        mr.onstop = () => {
            mr.stream.getTracks().forEach((t) => t.stop())
            if (send && audioChunksRef.current.length > 0) {
                const mimeType = mr.mimeType || "audio/webm"
                let ext = "webm"
                if (mimeType.includes("ogg")) ext = "ogg"
                else if (mimeType.includes("mp4")) ext = "mp4"
                const blob = new Blob(audioChunksRef.current, { type: mimeType })
                const file = new File([blob], `audio-${Date.now()}.${ext}`, { type: mimeType })
                setPendingFile(file)
            }
            audioChunksRef.current = []
            mediaRecorderRef.current = null
            setIsRecording(false)
            setRecordingSeconds(0)
        }
        mr.stop()
    }, [])

    return (
        <div className="mt-16 flex h-[calc(100svh-4rem)] flex-col">
            {/* Header */}
            <div
                className={cn(
                    "shrink-0 border-b px-4 py-3",
                    team === "red"
                        ? "border-red-500/20 bg-red-500/5"
                        : "border-blue-500/20 bg-blue-500/5"
                )}
            >
                <div className="mx-auto max-w-3xl">
                    <p
                        className={cn(
                            "text-sm font-semibold",
                            team === "red" ? "text-red-500" : "text-blue-500"
                        )}
                    >
                        {TEAM_LABEL[team]}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                        {debate.question}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={listRef}
                className="flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto px-4 py-4"
            >
                <div className="mx-auto w-full max-w-3xl flex flex-col gap-3">
                    {nextCursor && (
                        <button
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="flex items-center gap-1 self-center rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-accent disabled:opacity-50"
                        >
                            <ChevronUp className="size-3" />
                            {loadingMore ? "Cargando..." : "Cargar más"}
                        </button>
                    )}

                    {messages.map((msg, i) => {
                        const prev = messages[i - 1]
                        const showHeader =
                            !prev ||
                            prev.user.id !== msg.user.id ||
                            new Date(msg.createdAt).getTime() -
                                new Date(prev.createdAt).getTime() >
                                5 * 60 * 1000
                        return (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isOwn={msg.user.id === currentUser.id}
                                team={team}
                                showHeader={showHeader}
                                onLongPress={setContextMsg}
                                onImageClick={setLightboxUrl}
                            />
                        )
                    })}

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mx-auto mb-1 w-full max-w-3xl px-4">
                    <p className="rounded-md bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
                        {error}
                    </p>
                </div>
            )}

            {/* File preview */}
            {pendingFile && (
                <div className="mx-auto w-full max-w-3xl px-4 pb-1">
                    <FilePreview file={pendingFile} onRemove={() => setPendingFile(null)} />
                </div>
            )}

            {/* Input */}
            <div
                className={cn(
                    "shrink-0 border-t px-4 py-3",
                    team === "red" ? "border-red-500/20" : "border-blue-500/20"
                )}
            >
                <div className="mx-auto w-full max-w-3xl">
                    {isRecording ? (
                        <div
                            className={cn(
                                "flex items-center gap-3 rounded-xl border px-4 py-2.5",
                                team === "red"
                                    ? "border-red-500/30 bg-red-500/5"
                                    : "border-blue-500/30 bg-blue-500/5"
                            )}
                        >
                            <span className="size-2.5 shrink-0 animate-pulse rounded-full bg-red-500" />
                            <span className="flex-1 font-mono text-sm font-medium text-red-500">
                                {formatRecordingTime(recordingSeconds)}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 text-muted-foreground hover:text-foreground"
                                onClick={() => stopRecording(false)}
                                title="Cancelar grabación"
                            >
                                <X className="size-4" />
                            </Button>
                            <Button
                                type="button"
                                size="icon"
                                className="size-8 bg-red-600 text-white hover:bg-red-700"
                                onClick={() => stopRecording(true)}
                                title="Detener y enviar"
                            >
                                <Square className="size-3 fill-current" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-end gap-2">
                            <ChatFileUpload onFile={handleFile} disabled={sending} />
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder=""
                                rows={1}
                                disabled={sending}
                                className="flex-1 resize-none rounded-xl border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                style={{ maxHeight: "8rem", overflowY: "auto" }}
                                onInput={(e) => {
                                    const el = e.currentTarget
                                    el.style.height = "auto"
                                    el.style.height = `${el.scrollHeight}px`
                                }}
                            />
                            {!input.trim() && !pendingFile ? (
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "shrink-0",
                                        team === "red"
                                            ? "text-red-500 hover:bg-red-500/10 hover:text-red-600"
                                            : "text-blue-500 hover:bg-blue-500/10 hover:text-blue-600"
                                    )}
                                    onClick={startRecording}
                                    title="Grabar audio"
                                >
                                    <Mic className="size-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    size="icon"
                                    className={cn("shrink-0", TEAM_SEND_BTN[team])}
                                    disabled={sending || (!input.trim() && !pendingFile)}
                                    onClick={sendMessage}
                                >
                                    <Send className="size-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Context menu dialog (long press) */}
            <Dialog
                open={!!contextMsg}
                onOpenChange={(open) => !open && setContextMsg(null)}
            >
                <DialogContent className="max-w-xs p-4">
                    <DialogHeader>
                        <DialogTitle className="text-sm">Opciones del mensaje</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 pt-2">
                        {contextMsg?.user.id === currentUser.id && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="justify-start gap-2"
                                onClick={() => contextMsg && deleteMessage(contextMsg)}
                            >
                                <Trash2 className="size-4" />
                                Eliminar para todos
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="justify-start gap-2"
                            onClick={() => {
                                setReportDialogOpen(true)
                            }}
                        >
                            <Flag className="size-4" />
                            Reportar mensaje
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setContextMsg(null)}
                        >
                            Cancelar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Image lightbox */}
            <Dialog open={!!lightboxUrl} onOpenChange={(open) => !open && setLightboxUrl(null)}>
                <DialogContent className="flex max-w-3xl items-center justify-center bg-black/90 p-2">
                    {lightboxUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={lightboxUrl}
                            alt="imagen"
                            className="max-h-[85vh] max-w-full rounded-lg object-contain"
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Report dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Reportar mensaje</DialogTitle>
                    </DialogHeader>
                    <textarea
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        placeholder="Describe brevemente el problema (opcional)"
                        rows={3}
                        maxLength={500}
                        className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReportDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button size="sm" onClick={submitReport}>
                            Enviar reporte
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
