import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useActivity(type) {
  return useQuery({
    queryKey: ["activity", type],
    queryFn: () => api(`/activity${type && type !== "all" ? `?type=${type}` : ""}`).then((d) => d.activities),
  })
}
