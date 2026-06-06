import { Router } from "express"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"
import { validate } from "../middleware/validate.js"
import { logActivity } from "../lib/activity.js"

const router = Router()
const ROLES = ["admin", "procurement_officer", "manager", "vendor"]

const createSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(ROLES),
  vendorId: z.string().optional().nullable(),
})

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(ROLES).optional(),
  password: z.string().min(6).optional().or(z.literal("")),
  vendorId: z.string().optional().nullable(),
})

function toPublic(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    vendorId: user.vendorId,
    createdAt: user.createdAt,
  }
}

router.use(authenticate, requireRole("admin"))

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { vendor: { select: { name: true } } } })
    res.json({ users: users.map((u) => ({ ...toPublic(u), vendorName: u.vendor?.name || null })) })
  } catch (err) {
    next(err)
  }
})

router.post("/", validate(createSchema), async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, vendorId } = req.body
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: "Email already registered" })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { firstName, lastName, email, passwordHash, role, vendorId: vendorId || null },
    })
    await logActivity({ type: "user", message: `User ${firstName} ${lastName} added (${role})`, userId: req.user.id, entityType: "user", entityId: user.id })
    res.status(201).json({ user: toPublic(user) })
  } catch (err) {
    next(err)
  }
})

router.patch("/:id", validate(updateSchema), async (req, res, next) => {
  try {
    const data = { ...req.body }
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 10)
    }
    delete data.password
    if (data.vendorId === "") data.vendorId = null
    const user = await prisma.user.update({ where: { id: req.params.id }, data })
    await logActivity({ type: "user", message: `User ${user.firstName} ${user.lastName} updated`, userId: req.user.id, entityType: "user", entityId: user.id })
    res.json({ user: toPublic(user) })
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "User not found" })
    next(err)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ error: "You cannot delete your own account" })
    const user = await prisma.user.delete({ where: { id: req.params.id } })
    await logActivity({ type: "user", message: `User ${user.firstName} ${user.lastName} removed`, userId: req.user.id, entityType: "user", entityId: user.id })
    res.json({ ok: true })
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "User not found" })
    next(err)
  }
})

export default router
