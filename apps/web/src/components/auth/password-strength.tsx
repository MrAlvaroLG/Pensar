"use client"

import { useMemo } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordRule {
    key: string
    label: string
    test: (pw: string) => boolean
}

const PASSWORD_RULES: PasswordRule[] = [
    {
        key: "length",
        label: "Al menos 8 caracteres",
        test: (pw) => pw.length >= 8,
    },
    {
        key: "uppercase",
        label: "Una letra mayúscula",
        test: (pw) => /[A-Z]/.test(pw),
    },
    {
        key: "lowercase",
        label: "Una letra minúscula",
        test: (pw) => /[a-z]/.test(pw),
    },
    {
        key: "number",
        label: "Un número",
        test: (pw) => /\d/.test(pw),
    },
    {
        key: "symbol",
        label: "Un símbolo especial",
        test: (pw) => /[^A-Za-z0-9]/.test(pw),
    },
]

interface PasswordStrengthProps {
    password: string
    className?: string
}

export function validatePassword(password: string): boolean {
    return PASSWORD_RULES.every((rule) => rule.test(password))
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
    const results = useMemo(
        () =>
            PASSWORD_RULES.map((rule) => ({
                ...rule,
                passed: rule.test(password),
            })),
        [password],
    )

    const passedCount = results.filter((r) => r.passed).length
    const totalRules = PASSWORD_RULES.length

    // Strength bar color
    const strengthPercent = (passedCount / totalRules) * 100
    const barColor =
        strengthPercent <= 20
            ? "bg-destructive"
            : strengthPercent <= 60
                ? "bg-amber-500"
                : strengthPercent < 100
                    ? "bg-amber-400"
                    : "bg-emerald-500"

    if (!password) return null

    return (
        <div className={cn("space-y-3", className)}>
            {/* Strength bar */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                        Seguridad de la contraseña
                    </span>
                    <span
                        className={cn(
                            "text-xs font-semibold",
                            strengthPercent <= 20
                                ? "text-destructive"
                                : strengthPercent <= 60
                                    ? "text-amber-500"
                                    : strengthPercent < 100
                                        ? "text-amber-400"
                                        : "text-emerald-500",
                        )}
                    >
                        {strengthPercent <= 20
                            ? "Muy débil"
                            : strengthPercent <= 40
                                ? "Débil"
                                : strengthPercent <= 60
                                    ? "Regular"
                                    : strengthPercent < 100
                                        ? "Buena"
                                        : "Fuerte"}
                    </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-500 ease-out",
                            barColor,
                        )}
                        style={{ width: `${strengthPercent}%` }}
                    />
                </div>
            </div>

            {/* Rules checklist */}
            <ul className="grid grid-cols-1 gap-1.5">
                {results.map(({ key, label, passed }) => (
                    <li
                        key={key}
                        className={cn(
                            "flex items-center gap-2 text-xs transition-colors duration-200",
                            passed
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-muted-foreground",
                        )}
                    >
                        {passed ? (
                            <Check className="size-3.5 shrink-0" />
                        ) : (
                            <X className="size-3.5 shrink-0" />
                        )}
                        <span>{label}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
