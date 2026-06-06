import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => api("/invoices").then((d) => d.invoices),
  })
}

export function useInvoice(id) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => api(`/invoices/${id}`).then((d) => d.invoice),
    enabled: Boolean(id),
  })
}

export function useGenerateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (purchaseOrderId) => api("/invoices", { method: "POST", body: { purchaseOrderId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
    },
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => api(`/invoices/${id}`, { method: "PATCH", body: { status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      queryClient.invalidateQueries({ queryKey: ["invoice"] })
    },
  })
}

export function useEmailInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api(`/invoices/${id}/email`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] })
    },
  })
}
