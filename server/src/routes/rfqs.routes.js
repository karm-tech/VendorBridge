import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"
import { validate } from "../middleware/validate.js"
import { emitEvent } from "../lib/socket.js"

const router = Router()
const WRITE_ROLES = ["admin", "procurement_officer", "manager"]

const rfqSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().optional(),
  description: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(["draft", "open"]).default("open"),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.coerce.number().int().min(1).default(1),
        unit: z.string().default("NOS"),
      })
    )
    .min(1, "Add at least one line item"),
  vendorIds: z.array(z.string()).default([]),
})

router.use(authenticate)

router.get("/", async (req, res, next) => {
  try {
    const { status } = req.query
    const where = {}
    if (status) where.status = status
    const rfqs = await prisma.rfq.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { quotations: true, invitations: true, items: true } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
    })
    res.json({ rfqs })
  } catch (err) {
    next(err)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const rfq = await prisma.rfq.findUnique({
      where: { id: req.params.id },
      include: {
        items: true,
        invitations: { include: { vendor: true } },
        quotations: { include: { vendor: true } },
      },
    })
    if (!rfq) return res.status(404).json({ error: "RFQ not found" })
    res.json({ rfq })
  } catch (err) {
    next(err)
  }
})

router.post("/", requireRole(...WRITE_ROLES), validate(rfqSchema), async (req, res, next) => {
  try {
    const { title, category, description, deadline, status, items, vendorIds } = req.body
    const rfq = await prisma.rfq.create({
      data: {
        title,
        category,
        description,
        deadline: deadline ? new Date(deadline) : null,
        status,
        createdById: req.user.id,
        items: { create: items.map((it) => ({ name: it.name, quantity: it.quantity, unit: it.unit })) },
        invitations: { create: vendorIds.map((id) => ({ vendorId: id, status: "invited" })) },
      },
      include: { items: true, invitations: true },
    })
    emitEvent("rfq:created", { id: rfq.id, title: rfq.title })
    res.status(201).json({ rfq })
  } catch (err) {
    next(err)
  }
})

export default router
