import { betterAuth } from "better-auth"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { emailOTP } from "better-auth/plugins"
import { sendMail } from "@/lib/auth/smtp-mailer"
import prisma from "@/lib/db"

const signupOtpEnabled = process.env.NEXT_PUBLIC_AUTH_SIGNUP_OTP_ENABLED === "true"
const passwordResetOtpEnabled = process.env.NEXT_PUBLIC_AUTH_PASSWORD_RESET_OTP_ENABLED === "true"
const emailDeliveryEnabled = process.env.AUTH_EMAIL_DELIVERY_ENABLED !== "false"

function buildOtpEmailTemplate(otp: string, title: string, description: string) {
    return `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fafafa;border-radius:12px">
            <h2 style="font-size:22px;font-weight:700;margin:0 0 8px">${title}</h2>
            <p style="color:#555;margin:0 0 20px;line-height:1.6">
                ${description}
            </p>
            <div style="display:inline-block;background:#000;color:#fff;padding:14px 32px;border-radius:8px;font-size:28px;font-weight:700;letter-spacing:8px;margin-bottom:24px">
                ${otp}
            </div>
            <p style="color:#999;font-size:13px;margin:0;line-height:1.5">
                Si no solicitaste esta accion, ignora este correo.
            </p>
        </div>
    `
}

async function sendOtpEmail({ email, otp, type }: { email: string; otp: string; type: "email-verification" | "forget-password" | "sign-in" | "change-email" }) {
    const messageByType = {
        "email-verification": {
            subject: "Código para verificar tu cuenta",
            title: "Verifica tu correo",
            description: "Usa este código para activar tu cuenta. Expira en <strong>10 minutos</strong>.",
        },
        "forget-password": {
            subject: "Código para recuperar tu contraseña",
            title: "Recupera tu contraseña",
            description: "Usa este código para restablecer tu contraseña. Expira en <strong>10 minutos</strong>.",
        },
        "sign-in": {
            subject: "Código de acceso",
            title: "Inicia sesion con código",
            description: "Usa este código para iniciar sesion. Expira en <strong>10 minutos</strong>.",
        },
        "change-email": {
            subject: "Código para cambiar tu correo",
            title: "Confirma cambio de correo",
            description: "Usa este código para confirmar el cambio de correo. Expira en <strong>10 minutos</strong>.",
        },
    } as const

    const message = messageByType[type]

    if (!emailDeliveryEnabled) {
        console.log(`[Auth][OTP:DEV] type=${type} email=${email} otp=${otp}`)
        return
    }

    try {
        const info = await sendMail({
            to: email,
            subject: message.subject,
            html: buildOtpEmailTemplate(otp, message.title, message.description),
        })
        console.log("[Auth] OTP enviado correctamente. MessageId:", info.messageId)
    } catch (error) {
        console.error("[Auth] Error enviando OTP con SMTP:", error)
    }
}

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    ],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        requireEmailVerification: signupOtpEnabled,
    },
    plugins: [
        emailOTP({
            expiresIn: 600, // 10 minutos
            sendVerificationOnSignUp: signupOtpEnabled,
            overrideDefaultEmailVerification: signupOtpEnabled,
            async sendVerificationOTP({ email, otp, type }) {
                try {
                    if (type === "email-verification" && !signupOtpEnabled) return
                    if (type === "forget-password" && !passwordResetOtpEnabled) return
                    await sendOtpEmail({ email, otp, type })
                } catch (err) {
                    console.error("[Auth] Excepción al enviar OTP:", err)
                }
            },
        }),
    ],
    user: {
        additionalFields: {
            postura: {
                type: "string",
                required: true,
            },
            phoneNumber: {
                type: "string",
                required: false,
            },
            role: { 
                type: "string", 
                required: false, 
                defaultValue: "USER" 
            }
        },
    },
    // Avoid large cached-session cookies in production (Vercel has strict header limits).
    session: {
        cookieCache: {
            enabled: false,
        },
    },
})