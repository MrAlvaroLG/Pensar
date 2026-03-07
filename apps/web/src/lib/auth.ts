import { betterAuth } from "better-auth"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { emailOTP } from "better-auth/plugins"
import { Resend } from "resend"
import prisma from "@pensar/db"

const resend = new Resend(process.env.RESEND_API_KEY)

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
    },
    plugins: [
        emailOTP({
            expiresIn: 600, // 10 minutos
            async sendVerificationOTP({ email, otp, type }) {
                if (type !== "forget-password") return
                try {
                    const { data, error } = await resend.emails.send({
                        from: "Pensar <onboarding@resend.dev>",
                        to: email,
                        subject: "Código para recuperar tu contraseña",
                        html: `
                            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fafafa;border-radius:12px">
                                <h2 style="font-size:22px;font-weight:700;margin:0 0 8px">Recupera tu contraseña</h2>
                                <p style="color:#555;margin:0 0 20px;line-height:1.6">
                                    Usa este código para restablecer tu contraseña. Expira en <strong>10 minutos</strong>.
                                </p>
                                <div style="display:inline-block;background:#000;color:#fff;padding:14px 32px;border-radius:8px;font-size:28px;font-weight:700;letter-spacing:8px;margin-bottom:24px">
                                    ${otp}
                                </div>
                                <p style="color:#999;font-size:13px;margin:0;line-height:1.5">
                                    Si no solicitaste este cambio, ignora este correo.
                                </p>
                            </div>
                        `,
                    })
                    if (error) {
                        console.error("[Auth] Error enviando OTP con Resend:", error)
                    } else {
                        console.log("[Auth] OTP enviado correctamente. ID:", data?.id)
                    }
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
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60
        }
    }
})