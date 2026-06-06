import { useEffect } from "react"
import { io } from "socket.io-client"
import { useQueryClient } from "@tanstack/react-query"

const EVENTS = [
  "rfq:created",
  "quotation:submitted",
  "quotation:selected",
  "approval:decided",
  "po:created",
  "invoice:created",
  "invoice:emailed",
]

export function useRealtime() {
  const queryClient = useQueryClient()
  useEffect(() => {
    const socket = io({ path: "/socket.io" })
    const refresh = () => queryClient.invalidateQueries()
    EVENTS.forEach((event) => socket.on(event, refresh))
    return () => socket.disconnect()
  }, [queryClient])
}
