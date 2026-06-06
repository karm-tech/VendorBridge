import { useState } from "react"
import { Users, Plus, Pencil, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatDateTime } from "@/lib/utils"
import { ROLE_LABELS } from "@/constants/roles"
import { useAuth } from "@/features/auth/AuthContext"
import { UserFormDialog } from "@/features/users/components/UserFormDialog"
import { useUsers, useDeleteUser } from "@/features/users/hooks"

const ROLE_PILL = {
  admin: "bg-primary/10 text-primary",
  procurement_officer: "bg-sky-100 text-sky-700",
  manager: "bg-amber-100 text-amber-700",
  vendor: "bg-emerald-100 text-emerald-700",
}

export function UsersPage() {
  const { user: me } = useAuth()
  const { data: users, isLoading, isError, error } = useUsers()
  const remove = useDeleteUser()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(user) {
    setEditing(user)
    setDialogOpen(true)
  }

  function handleDelete(user) {
    if (window.confirm(`Remove ${user.firstName} ${user.lastName}? This cannot be undone.`)) {
      remove.mutate(user.id)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Create accounts, assign roles, and manage access. Admin only.">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </PageHeader>

      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users yet"
            description="Add your first account to get started."
            action={
              <Button onClick={openAdd}>
                <Plus className="h-4 w-4" /> Add User
              </Button>
            }
            className="border-0 bg-transparent"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-medium text-foreground">
                      {u.firstName} {u.lastName}
                      {u.id === me?.id && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">You</span>}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", ROLE_PILL[u.role] || "bg-muted text-muted-foreground")}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDateTime(u.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={u.id === me?.id || remove.isPending}
                          onClick={() => handleDelete(u)}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <UserFormDialog open={dialogOpen} onOpenChange={setDialogOpen} user={editing} />
    </div>
  )
}
