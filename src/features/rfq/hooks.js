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

export function useRfq(id) {
  return useQuery({
    queryKey: ["rfq", id],
    queryFn: () => api(`/rfqs/${id}`).then((d) => d.rfq),
    enabled: Boolean(id),
  })
}

export function useCreateRfq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api("/rfqs", { method: "POST", body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rfqs"] }),
  })
}

export function useUpdateRfq() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api(`/rfqs/${id}`, { method: "PATCH", body: data }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] })
      queryClient.invalidateQueries({ queryKey: ["rfq", vars.id] })
    },
  })
}
