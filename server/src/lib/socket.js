import { Server } from "socket.io"

let io = null

export function initSocket(httpServer) {
  io = new Server(httpServer, { cors: { origin: "*" } })
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {})
  })
  return io
}

export function emitEvent(event, payload) {
  if (io) io.emit(event, payload)
}
