import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function clearAll() {
  await prisma.activityLog.deleteMany()
  await prisma.invoiceItem.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.purchaseOrder.deleteMany()
  await prisma.approval.deleteMany()
  await prisma.quotationItem.deleteMany()
  await prisma.quotation.deleteMany()
  await prisma.rfqInvitation.deleteMany()
  await prisma.rfqItem.deleteMany()
  await prisma.rfq.deleteMany()
  await prisma.user.deleteMany()
  await prisma.vendor.deleteMany()
}

async function main() {
  await clearAll()

  const passwordHash = await bcrypt.hash("demo1234", 10)

  const infra = await prisma.vendor.create({
    data: {
      name: "Infra Supplies Pvt Ltd",
      category: "Furniture",
      gstNo: "24AABCI1234A1Z5",
      email: "sales@infrasupplies.in",
      phone: "+91 98250 11111",
      address: "456 Industrial Estate, Surat, Gujarat",
      status: "active",
      rating: 4.5,
    },
  })
  const techcore = await prisma.vendor.create({
    data: {
      name: "TechCore Ltd",
      category: "IT Hardware",
      gstNo: "27AAACT5678B1Z3",
      email: "hello@techcore.in",
      phone: "+91 98200 22222",
      address: "12 Tech Park, Pune, Maharashtra",
      status: "active",
      rating: 4.2,
    },
  })
  const fastlog = await prisma.vendor.create({
    data: {
      name: "FastLog Logistics",
      category: "Logistics",
      gstNo: "29AAFCF9012C1Z1",
      email: "ops@fastlog.in",
      phone: "+91 98860 33333",
      address: "9 Transport Nagar, Bengaluru, Karnataka",
      status: "active",
      rating: 4.0,
    },
  })
  const officeplus = await prisma.vendor.create({
    data: {
      name: "OfficePlus Traders",
      category: "Stationery",
      gstNo: "24AAGCO3456D1Z9",
      email: "care@officeplus.in",
      phone: "+91 99090 44444",
      address: "78 Market Road, Ahmedabad, Gujarat",
      status: "blocked",
      rating: 3.9,
    },
  })

  const admin = await prisma.user.create({
    data: { email: "admin@vendorbridge.app", passwordHash, firstName: "Aanya", lastName: "Sharma", role: "admin", country: "India" },
  })
  const officer = await prisma.user.create({
    data: { email: "officer@vendorbridge.app", passwordHash, firstName: "Karm", lastName: "Chauhan", role: "procurement_officer", country: "India" },
  })
  const manager = await prisma.user.create({
    data: { email: "manager@vendorbridge.app", passwordHash, firstName: "Rahul", lastName: "Mehta", role: "manager", country: "India" },
  })
  await prisma.user.create({
    data: { email: "vendor@vendorbridge.app", passwordHash, firstName: "Infra", lastName: "Supplies", role: "vendor", country: "India", vendorId: infra.id },
  })

  const rfq = await prisma.rfq.create({
    data: {
      title: "Office Furniture Procurement Q2",
      category: "Furniture",
      description: "Ergonomic chairs and standing desks for the 3rd floor.",
      deadline: new Date("2025-06-15"),
      status: "open",
      createdById: officer.id,
      items: {
        create: [
          { name: "Ergonomic chair", quantity: 25, unit: "NOS" },
          { name: "Standing desk", quantity: 10, unit: "NOS" },
        ],
      },
      invitations: {
        create: [
          { vendorId: infra.id, status: "responded" },
          { vendorId: techcore.id, status: "responded" },
          { vendorId: officeplus.id, status: "responded" },
        ],
      },
    },
  })

  const quotationInputs = [
    { vendorId: infra.id, deliveryDays: 12, chair: 3400, desk: 8200 },
    { vendorId: techcore.id, deliveryDays: 10, chair: 3500, desk: 8500 },
    { vendorId: officeplus.id, deliveryDays: 15, chair: 3300, desk: 8000 },
  ]

  const quotations = []
  for (const input of quotationInputs) {
    const chairTotal = 25 * input.chair
    const deskTotal = 10 * input.desk
    const subtotal = chairTotal + deskTotal
    const taxAmount = Math.round(subtotal * 0.18)
    const total = subtotal + taxAmount
    const quotation = await prisma.quotation.create({
      data: {
        rfqId: rfq.id,
        vendorId: input.vendorId,
        deliveryDays: input.deliveryDays,
        paymentTerms: "30 days net",
        notes: "Includes installation and 1-year warranty.",
        taxRate: 18,
        subtotal,
        taxAmount,
        total,
        status: "submitted",
        items: {
          create: [
            { name: "Ergonomic chair", quantity: 25, unitPrice: input.chair, total: chairTotal },
            { name: "Standing desk", quantity: 10, unitPrice: input.desk, total: deskTotal },
          ],
        },
      },
    })
    quotations.push(quotation)
  }

  const selected = quotations.reduce((best, current) => (current.total < best.total ? current : best))
  await prisma.quotation.update({ where: { id: selected.id }, data: { status: "selected" } })

  await prisma.approval.create({
    data: {
      quotationId: selected.id,
      stage: 1,
      status: "approved",
      remarks: "Within approved budget.",
      approverId: officer.id,
      decidedAt: new Date("2025-05-20T10:30:00"),
    },
  })
  await prisma.approval.create({
    data: { quotationId: selected.id, stage: 2, status: "pending", approverId: manager.id },
  })

  const po = await prisma.purchaseOrder.create({
    data: {
      poNumber: "PO-2025-0068",
      quotationId: selected.id,
      vendorId: selected.vendorId,
      status: "issued",
      poDate: new Date("2025-05-21"),
    },
  })

  const subtotal = selected.subtotal
  const cgst = Math.round(subtotal * 0.09)
  const sgst = Math.round(subtotal * 0.09)
  const total = subtotal + cgst + sgst
  const selectedItems = await prisma.quotationItem.findMany({ where: { quotationId: selected.id } })
  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2025-0042",
      purchaseOrderId: po.id,
      vendorId: selected.vendorId,
      invoiceDate: new Date("2025-05-22"),
      dueDate: new Date("2025-06-21"),
      subtotal,
      cgst,
      sgst,
      total,
      status: "pending",
      items: {
        create: selectedItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
      },
    },
  })

  const logs = [
    { type: "rfq", message: "RFQ 'Office Furniture Procurement Q2' published to 3 vendors", userId: officer.id, entityType: "rfq", entityId: rfq.id },
    { type: "quotation", message: "3 quotations received for Office Furniture Procurement Q2", userId: officer.id, entityType: "rfq", entityId: rfq.id },
    { type: "approval", message: "Quotation approved at stage 1 by procurement lead", userId: officer.id, entityType: "quotation", entityId: selected.id },
    { type: "po", message: "Purchase order PO-2025-0068 generated", userId: officer.id, entityType: "purchaseOrder", entityId: po.id },
    { type: "vendor", message: "Vendor TechCore Ltd added to the directory", userId: admin.id, entityType: "vendor", entityId: techcore.id },
  ]
  for (const log of logs) {
    await prisma.activityLog.create({ data: log })
  }

  const history = [
    { v: techcore, t: "Laptops — batch 1", c: "IT Hardware", amt: 180000, d: "2024-12-12", s: "paid" },
    { v: officeplus, t: "Stationery — December", c: "Stationery", amt: 45000, d: "2024-12-20", s: "paid" },
    { v: infra, t: "Workstations", c: "Furniture", amt: 120000, d: "2025-01-15", s: "paid" },
    { v: fastlog, t: "Logistics — Q1", c: "Logistics", amt: 110000, d: "2025-01-30", s: "paid" },
    { v: techcore, t: "Monitors", c: "IT Hardware", amt: 140000, d: "2025-02-08", s: "paid" },
    { v: infra, t: "Storage cabinets", c: "Furniture", amt: 90000, d: "2025-03-22", s: "paid" },
    { v: officeplus, t: "Stationery — March", c: "Stationery", amt: 38000, d: "2025-03-10", s: "paid" },
    { v: techcore, t: "Networking gear", c: "IT Hardware", amt: 150000, d: "2025-04-20", s: "pending" },
    { v: techcore, t: "Servers", c: "IT Hardware", amt: 130000, d: "2025-05-18", s: "pending" },
    { v: fastlog, t: "Logistics — Q2", c: "Logistics", amt: 95000, d: "2025-05-05", s: "pending" },
  ]

  let seq = 1
  for (const rec of history) {
    const rfqH = await prisma.rfq.create({
      data: { title: rec.t, category: rec.c, status: "awarded", createdById: officer.id, deadline: new Date(rec.d) },
    })
    const subtotal = rec.amt
    const tax = Math.round(subtotal * 0.18)
    const quoteH = await prisma.quotation.create({
      data: {
        rfqId: rfqH.id,
        vendorId: rec.v.id,
        deliveryDays: 10,
        taxRate: 18,
        subtotal,
        taxAmount: tax,
        total: subtotal + tax,
        status: "approved",
        items: { create: [{ name: rec.t, quantity: 1, unitPrice: subtotal, total: subtotal }] },
      },
    })
    const poH = await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-H-${String(seq).padStart(3, "0")}`,
        quotationId: quoteH.id,
        vendorId: rec.v.id,
        status: "issued",
        poDate: new Date(rec.d),
      },
    })
    const cg = Math.round(subtotal * 0.09)
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-H-${String(seq).padStart(3, "0")}`,
        purchaseOrderId: poH.id,
        vendorId: rec.v.id,
        invoiceDate: new Date(rec.d),
        dueDate: new Date(rec.d),
        subtotal,
        cgst: cg,
        sgst: cg,
        total: subtotal + cg * 2,
        status: rec.s,
        items: { create: [{ name: rec.t, quantity: 1, unitPrice: subtotal, total: subtotal }] },
      },
    })
    seq++
  }

  console.log(
    `Seed complete: 4 vendors, 4 users, ${quotations.length} quotations, ${history.length + 1} POs, ${history.length + 1} invoices`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
