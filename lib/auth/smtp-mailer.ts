import nodemailer from "nodemailer"

const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const emailFrom = process.env.EMAIL_FROM

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !emailFrom) {
    throw new Error("Faltan variables de entorno SMTP para enviar correos.")
}

export const smtpTransport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: true, // true para 465, false para otros puertos
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
})

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
    const info = await smtpTransport.sendMail({
        from: emailFrom,
        to,
        subject,
        html,
    })
    return info
}
