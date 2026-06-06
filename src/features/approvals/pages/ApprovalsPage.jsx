import { Link } from "react-router-dom"
import { ClipboardCheck, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatINR } from "@/lib/utils"
import { usePendingApprovals } from "@/features/approvals/hooks"
import { stageName } from "@/features/approvals/constants"

export function ApprovalsPage() {
  const { data: approvals, isLoading, isError, error } = usePendingApprovals()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approvals"
        description="Approve or reject selected quotations through the workflow."
      />

      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-destructive">{error.message}</div>
        ) : approvals.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No pending approvals"
            description="Selected quotations awaiting a decision will appear here."
            className="border-0 bg-transparent"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">RFQ</th>
                  <th className="px-5 py-3 font-semibold">Vendor</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Awaiting</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((q) => {
                  const active = q.approvals.find((a) => a.status === "pending")
                  return (
                    <tr key={q.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40">
                      <td className="px-5 py-3 font-medium text-foreground">{q.rfq.title}</td>
                      <td className="px-5 py-3 text-muted-foreground">{q.vendor.name}</td>
                      <td className="px-5 py-3 text-right font-num text-foreground">{formatINR(q.total)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{active ? stageName(active.stage) : "—"}</td>
                      <td className="px-5 py-3 text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/approvals/${q.id}`}>
                            Review <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
