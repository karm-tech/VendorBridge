import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useReportSummary() {
  return useQuery({
    queryKey: ["report-summary"],
    queryFn: () => api("/reports/summary").then((d) => d.summary),
  })
}
