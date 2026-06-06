import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"
import { requireRole } from "../middleware/requireRole.js"
import { validate } from "../middleware/validate.js"
import { emitEvent } from "../lib/socket.js"
import { logActivity } from "../lib/activity.js"

const router = Router()
const DECIDE_ROLES = ["admin", "manager"]

router.use(authenticate)

router.get("/", async (req, res, next) => {
  try {
    const quotations = await prisma.quotation.findMany({
      where: { status: "selected", approvals: { some: { status: "pending" } } },
      include: {
        vendor: true,
        rfq: { select: { id: true, title: true } },
        approvals: { orderBy: { stage: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    })
    res.json({ approvals: quotations })
  } catch (err) {
    next(err)
  }
})

router.get("/:quotationId", async (req, res, next) => {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: req.params.quotationId },
      include: {
        vendor: true,
        items: true,
        rfq: true,
        purchaseOrder: { include: { invoice: true } },
        approvals: {
          orderBy: { stage: "asc" },
          include: { approver: { select: { firstName: true, lastName: true } } },
        },
      },
    })
    if (!quotation) return res.status(404).json({ error: "Quotation not found" })
    res.json({ quotation })
  } catch (err) {
    next(err)
  }
})

const decideSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  remarks: z.string().optional(),
})

router.patch("/:approvalId/decide", requireRole(...DECIDE_ROLES), validate(decideSchema), async (req, res, next) => {
  try {
    const { decision, remarks } = req.body
    const approval = await prisma.approval.findUnique({
      where: { id: req.params.approvalId },
      include: { quotation: true },
    })
    if (!approval) return res.status(404).json({ error: "Approval not found" })
    if (approval.status !== "pending") return res.status(400).json({ error: "This stage is already decided" })

    const lowestPending = await prisma.approval.findFirst({
      where: { quotationId: approval.quotationId, status: "pending" },
      orderBy: { stage: "asc" },
    })
    if (lowestPending && lowestPending.id !== approval.id) {
      return res.status(400).json({ error: "Earlier stages must be decided first" })
    }

    const updated = await prisma.approval.update({
      where: { id: approval.id },
      data: { status: decision, remarks, approverId: req.user.id, decidedAt: new Date() },
    })

    if (decision === "rejected") {
      await prisma.quotation.update({ where: { id: approval.quotationId }, data: { status: "rejected" } })
      await prisma.rfq.update({ where: { id: approval.quotation.rfqId }, data: { status: "open" } }).catch(() => {})
    } else {
      const remaining = await prisma.approval.count({
        where: { quotationId: approval.quotationId, status: "pending" },
      })
      if (remaining === 0) {
        await prisma.quotation.update({ where: { id: approval.quotationId }, data: { status: "approved" } })
      }
    }

    await logActivity({
      type: "approval",
      message: `Approval ${decision} at stage ${approval.stage}`,
      userId: req.user.id,
      entityType: "quotation",
      entityId: approval.quotationId,
    })
    emitEvent("approval:decided", { quotationId: approval.quotationId, decision })
    res.json({ approval: updated })
  } catch (err) {
    next(err)
  }
})

export default router
