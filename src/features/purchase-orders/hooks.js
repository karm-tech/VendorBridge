import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function usePurchaseOrders() {
  return useQuery({
    queryKey: ["purchase-orders"],
    queryFn: () => api("/purchase-orders").then((d) => d.purchaseOrders),
  })
}

export function useAvailableQuotations() {
  return useQuery({
    queryKey: ["po-available"],
    queryFn: () => api("/purchase-orders/available").then((d) => d.quotations),
  })
}

export function useGeneratePurchaseOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (quotationId) => api("/purchase-orders", { method: "POST", body: { quotationId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
      queryClient.invalidateQueries({ queryKey: ["po-available"] })
    },
  })
}
