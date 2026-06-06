import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import healthRoutes from "./routes/health.routes.js"
import { notFound, errorHandler } from "./middleware/error.js"

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use("/api/health", healthRoutes)
  app.use("/api/auth", authRoutes)

  app.use("/api", notFound)
  app.use(errorHandler)

  return app
}
