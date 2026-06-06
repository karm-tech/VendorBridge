import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useVendors(filters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set("search", filters.search)
  if (filters.category) params.set("category", filters.category)
  if (filters.status) params.set("status", filters.status)
  const qs = params.toString()
  return useQuery({
    queryKey: ["vendors", filters],
    queryFn: () => api(`/vendors${qs ? `?${qs}` : ""}`).then((d) => d.vendors),
  })
}

export function useSaveVendor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) =>
      id
        ? api(`/vendors/${id}`, { method: "PATCH", body: data })
        : api("/vendors", { method: "POST", body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendors"] }),
  })
}

export function useDeleteVendor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api(`/vendors/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendors"] }),
  })
}
