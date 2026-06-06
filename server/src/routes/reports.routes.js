import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

router.use(authenticate)

router.get("/summary", async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({ include: { vendor: true } })

    const totalSpend = invoices.reduce((sum, inv) => sum + inv.total, 0)
    const paidCount = invoices.filter((inv) => inv.status === "paid").length
    const fulfillment = invoices.length ? Math.round((paidCount / invoices.length) * 100) : 0

    const activeVendors = await prisma.vendor.count({ where: { status: "active" } })
    const openRfqs = await prisma.rfq.count({ where: { status: "open" } })
    const pendingApprovals = await prisma.quotation.count({
      where: { status: "selected", approvals: { some: { status: "pending" } } },
    })
    const totalPurchaseOrders = await prisma.purchaseOrder.count()

    const categoryMap = {}
    for (const inv of invoices) {
      const cat = inv.vendor.category || "Other"
      categoryMap[cat] = (categoryMap[cat] || 0) + inv.total
    }
    const spendByCategory = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const vendorMap = {}
    for (const inv of invoices) {
      if (!vendorMap[inv.vendorId]) vendorMap[inv.vendorId] = { name: inv.vendor.name, value: 0, orders: 0 }
      vendorMap[inv.vendorId].value += inv.total
      vendorMap[inv.vendorId].orders += 1
    }
    const topVendors = Object.values(vendorMap).sort((a, b) => b.value - a.value).slice(0, 5)

    const monthMap = {}
    for (const inv of invoices) {
      const d = new Date(inv.invoiceDate)
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`
      if (!monthMap[key]) monthMap[key] = { sortKey: d.getFullYear() * 12 + d.getMonth(), m: MONTHS[d.getMonth()], v: 0 }
      monthMap[key].v += inv.total
    }
    const monthlyTrend = Object.values(monthMap)
      .sort((a, b) => a.sortKey - b.sortKey)
      .slice(-6)
      .map((entry) => ({ m: entry.m, v: entry.v }))

    res.json({
      summary: {
        totalSpend,
        activeVendors,
        fulfillment,
        openRfqs,
        pendingApprovals,
        totalPurchaseOrders,
        invoiceCount: invoices.length,
        spendByCategory,
        topVendors,
        monthlyTrend,
      },
    })
  } catch (err) {
    next(err)
  }
})

export default router
