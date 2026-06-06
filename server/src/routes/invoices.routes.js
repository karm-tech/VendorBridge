import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"
import { validate } from "../middleware/validate.js"
import { sendEmail } from "../lib/email.js"
import { emitEvent } from "../lib/socket.js"
import { logActivity } from "../lib/activity.js"

const router = Router()
const WRITE_ROLES = ["admin", "procurement_officer", "manager"]

router.use(authenticate)

router.get("/", async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: { vendor: true, purchaseOrder: { select: { poNumber: true } } },
    })
    res.json({ invoices })
  } catch (err) {
    next(err)
  }
})

router.get("/:id", async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        vendor: true,
        items: true,
        purchaseOrder: { include: { quotation: { include: { rfq: { select: { title: true } } } } } },
      },
    })
    if (!invoice) return res.status(404).json({ error: "Invoice not found" })
    res.json({ invoice })
  } catch (err) {
    next(err)
  }
})

const createSchema = z.object({ purchaseOrderId: z.string().min(1) })

router.post("/", requireRole(...WRITE_ROLES), validate(createSchema), async (req, res, next) => {
  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: req.body.purchaseOrderId },
      include: { quotation: { include: { items: true } }, invoice: true },
    })
    if (!po) return res.status(404).json({ error: "Purchase order not found" })
    if (po.invoice) return res.status(409).json({ error: "Invoice already exists for this PO" })

    const subtotal = po.quotation.subtotal
    const cgst = Math.round(subtotal * 0.09)
    const sgst = Math.round(subtotal * 0.09)
    const total = subtotal + cgst + sgst
    const count = await prisma.invoice.count()
    const invoiceNumber = `INV-2025-${String(42 + count + 1).padStart(4, "0")}`
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        purchaseOrderId: po.id,
        vendorId: po.vendorId,
        dueDate,
        subtotal,
        cgst,
        sgst,
        total,
        status: "pending",
        items: {
          create: po.quotation.items.map((it) => ({
            name: it.name,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            total: it.total,
          })),
        },
      },
      include: { vendor: true },
    })
    await logActivity({ type: "invoice", message: `Invoice ${invoice.invoiceNumber} generated`, userId: req.user.id, entityType: "invoice", entityId: invoice.id })
    emitEvent("invoice:created", { id: invoice.id, invoiceNumber })
    res.status(201).json({ invoice })
  } catch (err) {
    next(err)
  }
})

const updateSchema = z.object({ status: z.enum(["pending", "paid"]) })

router.patch("/:id", requireRole(...WRITE_ROLES), validate(updateSchema), async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.update({ where: { id: req.params.id }, data: { status: req.body.status } })
    res.json({ invoice })
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Invoice not found" })
    next(err)
  }
})

router.post("/:id/email", requireRole(...WRITE_ROLES), async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id }, include: { vendor: true } })
    if (!invoice) return res.status(404).json({ error: "Invoice not found" })
    const to = invoice.vendor.email || "vendor@example.com"
    const result = await sendEmail({
      to,
      subject: `Invoice ${invoice.invoiceNumber} from VendorBridge`,
      text: `Dear ${invoice.vendor.name},\n\nPlease find invoice ${invoice.invoiceNumber} for a total of INR ${invoice.total}.\nDue date: ${invoice.dueDate ? invoice.dueDate.toDateString() : "N/A"}.\n\nRegards,\nVendorBridge`,
    })
    emitEvent("invoice:emailed", { id: invoice.id })
    res.json({ ok: true, to, simulated: result.simulated })
  } catch (err) {
    next(err)
  }
})

export default router
