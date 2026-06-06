import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"
import { validate } from "../middleware/validate.js"
import { logActivity } from "../lib/activity.js"

const router = Router()

const WRITE_ROLES = ["admin", "procurement_officer", "manager"]

const vendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  gstNo: z.string().optional(),
  email: z.string().email("Enter a valid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "pending", "blocked"]).default("active"),
  rating: z.coerce.number().min(0).max(5).optional(),
})

router.use(authenticate)

router.get("/", async (req, res, next) => {
  try {
    const { search, category, status } = req.query
    const where = {}
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { gstNo: { contains: search } },
        { email: { contains: search } },
      ]
    }
    if (category) where.category = category
    if (status) where.status = status
    const vendors = await prisma.vendor.findMany({ where, orderBy: { createdAt: "desc" } })
    res.json({ vendors })
  } catch (err) {
    next(err)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id } })
    if (!vendor) return res.status(404).json({ error: "Vendor not found" })
    res.json({ vendor })
  } catch (err) {
    next(err)
  }
})

router.post("/", requireRole(...WRITE_ROLES), validate(vendorSchema), async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.create({ data: req.body })
    await logActivity({ type: "vendor", message: `Vendor ${vendor.name} added`, userId: req.user.id, entityType: "vendor", entityId: vendor.id })
    res.status(201).json({ vendor })
  } catch (err) {
    next(err)
  }
})

router.patch("/:id", requireRole(...WRITE_ROLES), validate(vendorSchema.partial()), async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.update({ where: { id: req.params.id }, data: req.body })
    res.json({ vendor })
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Vendor not found" })
    next(err)
  }
})

router.delete("/:id", requireRole("admin"), async (req, res, next) => {
  try {
    await prisma.vendor.delete({ where: { id: req.params.id } })
    res.status(204).end()
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Vendor not found" })
    next(err)
  }
})

export default router
