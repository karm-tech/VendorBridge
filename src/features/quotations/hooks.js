import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useQuotations(rfqId) {
  return useQuery({
    queryKey: ["quotations", rfqId],
    queryFn: () => api(`/quotations?rfqId=${rfqId}`).then((d) => d.quotations),
    enabled: Boolean(rfqId),
  })
}

export function useSubmitQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api("/quotations", { method: "POST", body: data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotations", variables.rfqId] })
      queryClient.invalidateQueries({ queryKey: ["rfqs"] })
    },
  })
}

export function useSelectQuotation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api(`/quotations/${id}/select`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] })
      queryClient.invalidateQueries({ queryKey: ["rfqs"] })
    },
  })
}
