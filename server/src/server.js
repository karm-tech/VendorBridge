import { createServer } from "node:http"
import { createApp } from "./app.js"
import { initSocket } from "./lib/socket.js"
import { PORT } from "./lib/env.js"

const app = createApp()
const httpServer = createServer(app)
initSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`VendorBridge API running on http://localhost:${PORT}`)
})
