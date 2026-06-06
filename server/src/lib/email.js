import nodemailer from "nodemailer"

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

export async function sendEmail({ to, subject, text }) {
  if (!emailEnabled || !transporter) {
    return { simulated: true }
  }
  await transporter.sendMail({ from: SMTP_USER, to, subject, text })
  return { simulated: false }
}
