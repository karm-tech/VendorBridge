import { Link, useNavigate } from "react-router-dom"
import { ScrollText, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRfqs } from "@/features/rfq/hooks"

export function QuotationsPage() {
  const navigate = useNavigate()
  const { data: rfqs, isLoading, isError, error } = useRfqs()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Review vendor quotations and compare them side by side."
      />

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
            icon={ScrollText}
            title="No RFQs to quote on"
            description="Create an RFQ first, then vendor quotations will appear here for comparison."
            action={
              <Button asChild>
                <Link to="/rfqs/new">Create RFQ</Link>
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
                  <th className="px-5 py-3 text-center font-semibold">Invited</th>
                  <th className="px-5 py-3 text-center font-semibold">Quotations</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/quotations/${r.id}`)}
                    className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">{r.title}</td>
                    <td className="px-5 py-3 text-center font-num text-muted-foreground">{r._count.invitations}</td>
                    <td className="px-5 py-3 text-center font-num text-muted-foreground">{r._count.quotations}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Compare <ArrowRight className="h-3.5 w-3.5" />
                      </span>
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
