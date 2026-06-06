import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"
import { validate } from "../middleware/validate.js"
import { emitEvent } from "../lib/socket.js"
import { logActivity } from "../lib/activity.js"

const router = Router()
const WRITE_ROLES = ["admin", "procurement_officer"]

router.use(authenticate)

router.get("/", async (req, res, next) => {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vendor: true,
        quotation: { include: { rfq: { select: { title: true } } } },
        invoice: { select: { id: true, invoiceNumber: true, status: true } },
      },
    })
    res.json({ purchaseOrders })
  } catch (err) {
    next(err)
  }
})

router.get("/available", async (req, res, next) => {
  try {
    const quotations = await prisma.quotation.findMany({
      where: { status: "approved", purchaseOrder: null },
      include: { vendor: true, rfq: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    })
    res.json({ quotations })
  } catch (err) {
    next(err)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id },
      include: {
        vendor: true,
        invoice: true,
        quotation: { include: { items: true, rfq: true } },
      },
    })
    if (!po) return res.status(404).json({ error: "Purchase order not found" })
    res.json({ purchaseOrder: po })
  } catch (err) {
    next(err)
  }
})

const createSchema = z.object({ quotationId: z.string().min(1) })

router.post("/", requireRole(...WRITE_ROLES), validate(createSchema), async (req, res, next) => {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: req.body.quotationId },
      include: { purchaseOrder: true },
    })
    if (!quotation) return res.status(404).json({ error: "Quotation not found" })
    if (quotation.status !== "approved") return res.status(400).json({ error: "Quotation must be approved first" })
    if (quotation.purchaseOrder) return res.status(409).json({ error: "Purchase order already exists" })

    const count = await prisma.purchaseOrder.count()
    const poNumber = `PO-2025-${String(68 + count + 1).padStart(4, "0")}`
    const po = await prisma.purchaseOrder.create({
      data: { poNumber, quotationId: quotation.id, vendorId: quotation.vendorId, status: "issued" },
      include: { vendor: true },
    })
    await logActivity({ type: "po", message: `Purchase order ${po.poNumber} generated`, userId: req.user.id, entityType: "purchaseOrder", entityId: po.id })
    emitEvent("po:created", { id: po.id, poNumber })
    res.status(201).json({ purchaseOrder: po })
  } catch (err) {
    next(err)
  }
})

export default router
