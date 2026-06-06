import { prisma } from "./prisma.js"

export async function logActivity(data) {
  try {
    await prisma.activityLog.create({ data })
  } catch (err) {
    console.error("activity log failed:", err.message)
  }
}
