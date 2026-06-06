import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"
import { validate } from "../middleware/validate.js"
import { emitEvent } from "../lib/socket.js"

const router = Router()
const SELECT_ROLES = ["admin", "procurement_officer", "manager"]

const quotationSchema = z.object({
  rfqId: z.string().min(1, "RFQ is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  deliveryDays: z.coerce.number().int().min(0).default(0),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).default(18),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.coerce.number().min(1),
        unitPrice: z.coerce.number().min(0),
      })
    )
    .min(1, "Add at least one item"),
})

router.use(authenticate)

router.get("/", async (req, res, next) => {
  try {
    const { rfqId } = req.query
    const where = {}
    if (rfqId) where.rfqId = rfqId
    const quotations = await prisma.quotation.findMany({
      where,
      orderBy: { total: "asc" },
      include: { vendor: true, items: true, rfq: { select: { id: true, title: true } } },
    })
    res.json({ quotations })
  } catch (err) {
    next(err)
  }
})

router.post("/", validate(quotationSchema), async (req, res, next) => {
  try {
    const { rfqId, vendorId, deliveryDays, paymentTerms, notes, taxRate, items } = req.body
    const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
    const taxAmount = Math.round((subtotal * taxRate) / 100)
    const total = subtotal + taxAmount
    const quotation = await prisma.quotation.create({
      data: {
        rfqId,
        vendorId,
        deliveryDays,
        paymentTerms,
        notes,
        taxRate,
        subtotal,
        taxAmount,
        total,
        status: "submitted",
        items: {
          create: items.map((it) => ({
            name: it.name,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            total: it.quantity * it.unitPrice,
          })),
        },
      },
      include: { vendor: true, items: true },
    })
    await prisma.rfqInvitation
      .updateMany({ where: { rfqId, vendorId }, data: { status: "responded" } })
      .catch(() => {})
    emitEvent("quotation:submitted", { rfqId, vendorId, total })
    res.status(201).json({ quotation })
  } catch (err) {
    next(err)
  }
})

router.patch("/:id/select", requireRole(...SELECT_ROLES), async (req, res, next) => {
  try {
    const quotation = await prisma.quotation.findUnique({ where: { id: req.params.id } })
    if (!quotation) return res.status(404).json({ error: "Quotation not found" })
    await prisma.quotation.updateMany({ where: { rfqId: quotation.rfqId }, data: { status: "submitted" } })
    const selected = await prisma.quotation.update({ where: { id: quotation.id }, data: { status: "selected" } })
    await prisma.rfq.update({ where: { id: quotation.rfqId }, data: { status: "awarded" } }).catch(() => {})

    const existingApprovals = await prisma.approval.count({ where: { quotationId: quotation.id } })
    if (existingApprovals === 0) {
      await prisma.approval.create({ data: { quotationId: quotation.id, stage: 1, status: "pending" } })
      await prisma.approval.create({ data: { quotationId: quotation.id, stage: 2, status: "pending" } })
    }

    emitEvent("quotation:selected", { id: selected.id, rfqId: quotation.rfqId })
    res.json({ quotation: selected })
  } catch (err) {
    next(err)
  }
})

export default router
