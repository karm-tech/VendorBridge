import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useRfqs(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.set("status", filters.status)
  const qs = params.toString()
  return useQuery({
    queryKey: ["rfqs", filters],
    queryFn: () => api(`/rfqs${qs ? `?${qs}` : ""}`).then((d) => d.rfqs),
  })
}

export function useCreateRfq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api("/rfqs", { method: "POST", body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rfqs"] }),
  })
}
