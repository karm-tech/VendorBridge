import { useState } from "react"
import { Building2, Plus, Search, Pencil, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { VendorFormDialog } from "@/features/vendors/components/VendorFormDialog"
import { useVendors, useDeleteVendor } from "@/features/vendors/hooks"
import { useAuth } from "@/features/auth/AuthContext"
import { VENDOR_STATUSES } from "@/features/vendors/constants"

export function VendorsPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { can } = useAuth()
  const canWrite = can("vendor:write")
  const canDelete = can("vendor:delete")
  const remove = useDeleteVendor()

  const { data: vendors, isLoading, isError, error } = useVendors({ search, status })

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(vendor) {
    setEditing(vendor)
    setDialogOpen(true)
  }

  function handleDelete(vendor) {
    if (window.confirm(`Delete ${vendor.name}? This cannot be undone.`)) {
      remove.mutate(vendor.id)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        description="Manage supplier profiles, categories, GST and contact details."
      >
        {canWrite && (
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Vendor
          </Button>
        )}
      </PageHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, GST or email..."
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30 sm:w-44"
        >
          <option value="">All statuses</option>
          {VENDOR_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
        ) : vendors.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No vendors found"
            description="Add your first supplier, or adjust your search and filters."
            action={
              canWrite ? (
                <Button onClick={openAdd}>
                  <Plus className="h-4 w-4" /> Add Vendor
                </Button>
              ) : undefined
            }
            className="border-0 bg-transparent"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Vendor</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">GST No</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-medium text-foreground">{v.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{v.category || "—"}</td>
                    <td className="px-5 py-3 font-num text-[13px] text-muted-foreground">{v.gstNo || "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{v.phone || v.email || "—"}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        {canWrite && (
                          <Button variant="ghost" size="sm" onClick={() => openEdit(v)}>
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={remove.isPending}
                            onClick={() => handleDelete(v)}
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </Button>
                        )}
                        {!canWrite && !canDelete && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <VendorFormDialog open={dialogOpen} onOpenChange={setDialogOpen} vendor={editing} />
    </div>
  )
}
