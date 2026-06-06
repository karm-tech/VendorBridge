import { Router } from "express"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { signToken } from "../lib/jwt.js"
import { authenticate } from "../middleware/auth.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const ROLES = ["admin", "procurement_officer", "manager", "vendor"]

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(ROLES).default("procurement_officer"),
})

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    vendorId: user.vendorId,
  }
}

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, country, role } = req.body
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: "Email already registered" })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, phone, country, role },
    })
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    res.status(201).json({ token, user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
})

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: "Invalid credentials" })
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: "Invalid credentials" })
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    res.json({ token, user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
})

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) return res.status(404).json({ error: "User not found" })
    res.json({ user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
})

export default router
