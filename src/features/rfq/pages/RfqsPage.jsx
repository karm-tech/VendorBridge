import { Link } from "react-router-dom"
import { FileText, Plus } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRfqs } from "@/features/rfq/hooks"
import { formatDate } from "@/lib/utils"

export function RfqsPage() {
  const { data: rfqs, isLoading, isError, error } = useRfqs()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requests for Quotation"
        description="Create and track RFQs sent to your vendors."
      >
        <Button asChild>
          <Link to="/rfqs/new">
            <Plus className="h-4 w-4" /> Create RFQ
          </Link>
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
        ) : rfqs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No RFQs yet"
            description="Create your first request for quotation to invite vendors."
            action={
              <Button asChild>
                <Link to="/rfqs/new">
                  <Plus className="h-4 w-4" /> Create RFQ
                </Link>
              </Button>
            }
            className="border-0 bg-transparent"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">RFQ Title</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Deadline</th>
                  <th className="px-5 py-3 text-center font-semibold">Items</th>
                  <th className="px-5 py-3 text-center font-semibold">Quotations</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-medium text-foreground">{r.title}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.category || "—"}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.deadline ? formatDate(r.deadline) : "—"}</td>
                    <td className="px-5 py-3 text-center font-num text-muted-foreground">{r._count.items}</td>
                    <td className="px-5 py-3 text-center font-num text-muted-foreground">{r._count.quotations}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
