import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api("/users").then((d) => d.users),
  })
}

export function useSaveUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) =>
      id ? api(`/users/${id}`, { method: "PATCH", body: data }) : api("/users", { method: "POST", body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api(`/users/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}
