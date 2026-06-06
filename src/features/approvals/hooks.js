import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function usePendingApprovals() {
  return useQuery({
    queryKey: ["approvals"],
    queryFn: () => api("/approvals").then((d) => d.approvals),
  })
}

export function useApprovalDetail(quotationId) {
  return useQuery({
    queryKey: ["approval", quotationId],
    queryFn: () => api(`/approvals/${quotationId}`).then((d) => d.quotation),
    enabled: Boolean(quotationId),
  })
}

export function useDecideApproval() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ approvalId, decision, remarks }) =>
      api(`/approvals/${approvalId}/decide`, { method: "PATCH", body: { decision, remarks } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] })
      queryClient.invalidateQueries({ queryKey: ["approval"] })
    },
  })
}
