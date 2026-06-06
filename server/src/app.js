import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import healthRoutes from "./routes/health.routes.js"
import vendorRoutes from "./routes/vendors.routes.js"
import rfqRoutes from "./routes/rfqs.routes.js"
import quotationRoutes from "./routes/quotations.routes.js"
import approvalRoutes from "./routes/approvals.routes.js"
import purchaseOrderRoutes from "./routes/purchaseOrders.routes.js"
import invoiceRoutes from "./routes/invoices.routes.js"
import reportRoutes from "./routes/reports.routes.js"
import activityRoutes from "./routes/activity.routes.js"
import emailRoutes from "./routes/emails.routes.js"
import userRoutes from "./routes/users.routes.js"
import { notFound, errorHandler } from "./middleware/error.js"

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use("/api/health", healthRoutes)
  app.use("/api/auth", authRoutes)
  app.use("/api/vendors", vendorRoutes)
  app.use("/api/rfqs", rfqRoutes)
  app.use("/api/quotations", quotationRoutes)
  app.use("/api/approvals", approvalRoutes)
  app.use("/api/purchase-orders", purchaseOrderRoutes)
  app.use("/api/invoices", invoiceRoutes)
  app.use("/api/reports", reportRoutes)
  app.use("/api/activity", activityRoutes)
  app.use("/api/emails", emailRoutes)
  app.use("/api/users", userRoutes)

  app.use("/api", notFound)
  app.use(errorHandler)

  return app
}
