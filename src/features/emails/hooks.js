import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useEmails() {
  return useQuery({
    queryKey: ["emails"],
    queryFn: () => api("/emails").then((d) => d.emails),
  })
}
