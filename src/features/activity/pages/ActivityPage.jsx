import { useState } from "react"
import {
  Activity,
  FileText,
  ScrollText,
  ClipboardCheck,
  ShoppingCart,
  Receipt,
  Building2,
} from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatDateTime } from "@/lib/utils"
import { useActivity } from "@/features/activity/hooks"

const TYPES = {
  rfq: { label: "RFQ", icon: FileText, color: "bg-sky-100 text-sky-600" },
  quotation: { label: "Quotation", icon: ScrollText, color: "bg-violet-100 text-violet-600" },
  approval: { label: "Approval", icon: ClipboardCheck, color: "bg-amber-100 text-amber-600" },
  po: { label: "Purchase Order", icon: ShoppingCart, color: "bg-primary/10 text-primary" },
  invoice: { label: "Invoice", icon: Receipt, color: "bg-emerald-100 text-emerald-600" },
  vendor: { label: "Vendor", icon: Building2, color: "bg-slate-100 text-slate-600" },
}

const DEFAULT_TYPE = { label: "Update", icon: Activity, color: "bg-muted text-muted-foreground" }

const FILTERS = [
  { key: "all", label: "All" },
  { key: "rfq", label: "RFQs" },
  { key: "quotation", label: "Quotations" },
  { key: "approval", label: "Approvals" },
  { key: "po", label: "Purchase Orders" },
  { key: "invoice", label: "Invoices" },
  { key: "vendor", label: "Vendors" },
]

export function ActivityPage() {
  const [filter, setFilter] = useState("all")
  const { data: activities, isLoading } = useActivity(filter)

  return (
    <div className="space-y-6">
      <PageHeader title="Activity & Logs" description="A full audit trail of every procurement action." />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" description="Actions you take will appear here as an audit trail." className="border-0 bg-transparent" />
        ) : (
          <ol>
            {activities.map((a, i) => {
              const cfg = TYPES[a.type] || DEFAULT_TYPE
              const Icon = cfg.icon
              return (
                <li key={a.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", cfg.color)}>
                      <Icon className="h-4 w-4" />
                    </span>
                    {i < activities.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
                  </div>
                  <div className="flex-1 pb-5">
                    <p className="text-sm text-foreground">{a.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cfg.label}
                      {a.user ? ` · ${a.user.firstName} ${a.user.lastName}` : ""} · {formatDateTime(a.createdAt)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </Card>
    </div>
  )
}
