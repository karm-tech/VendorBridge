import nodemailer from "nodemailer"
import { prisma } from "./prisma.js"

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

export const emailEnabled = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)

let transporter = null
if (emailEnabled) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

export async function sendEmail({ to, subject, text, relatedType, relatedId }) {
  let status = "simulated"
  let error = null

  if (emailEnabled && transporter) {
    try {
      await transporter.sendMail({ from: SMTP_USER, to, subject, text })
      status = "sent"
    } catch (err) {
      status = "failed"
      error = err.message
    }
  }

  const log = await prisma.emailLog
    .create({
      data: { to, subject, body: text || "", status, relatedType: relatedType || null, relatedId: relatedId || null },
    })
    .catch(() => null)

  return { id: log?.id || null, status, simulated: status === "simulated", error }
}
