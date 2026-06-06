import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn, formatINR, formatDate } from "@/lib/utils"
import { useApprovalDetail, useDecideApproval } from "@/features/approvals/hooks"
import { stageName } from "@/features/approvals/constants"

function SummaryRow({ label, value, mono }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-foreground", mono && "font-num")}>{value}</span>
    </div>
  )
}

export function ApprovalDetailPage() {
  const { quotationId } = useParams()
  const { data: q, isLoading } = useApprovalDetail(quotationId)
  const decide = useDecideApproval()
  const [remarks, setRemarks] = useState("")
  const [error, setError] = useState("")

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl" />
  if (!q) return <p className="text-sm text-muted-foreground">Quotation not found.</p>

  const approvals = q.approvals || []
  const active = approvals.find((a) => a.status === "pending")

  async function handle(decision) {
    setError("")
    try {
      await decide.mutateAsync({ approvalId: active.id, decision, remarks })
      setRemarks("")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/approvals" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to approvals
        </Link>
        <PageHeader title="Approval Workflow" description={q.rfq?.title} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="space-y-5 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-foreground">Approval Timeline</h2>
            <StatusBadge status={q.status} />
          </div>

          <ol className="space-y-1">
            {approvals.map((a, i) => {
              const isActive = active && a.id === active.id
              return (
                <li key={a.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        a.status === "approved"
                          ? "bg-success/15 text-success"
                          : a.status === "rejected"
                            ? "bg-destructive/15 text-destructive"
                            : isActive
                              ? "bg-warning/15 text-amber-600"
                              : "bg-muted text-muted-foreground"
                      )}
                    >
                      {a.status === "approved" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : a.status === "rejected" ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </span>
                    {i < approvals.length - 1 && <span className="my-1 w-px flex-1 bg-border" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{stageName(a.stage)}</p>
                      <StatusBadge status={a.status} />
                    </div>
                    {a.decidedAt && (
                      <p className="text-xs text-muted-foreground">
                        {a.approver ? `${a.approver.firstName} ${a.approver.lastName} · ` : ""}
                        {formatDate(a.decidedAt)}
                      </p>
                    )}
                    {a.remarks && <p className="mt-1 text-sm italic text-muted-foreground">“{a.remarks}”</p>}

                    {isActive && (
                      <div className="mt-3 space-y-3 rounded-lg border border-border bg-muted/30 p-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="remarks">Remarks (optional)</Label>
                          <Textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add a note for this decision..."
                          />
                        </div>
                        {error && <p className="text-xs text-destructive">{error}</p>}
                        <div className="flex gap-2">
                          <Button onClick={() => handle("approved")} disabled={decide.isPending}>
                            {decide.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handle("rejected")}
                            disabled={decide.isPending}
                            className="text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>

          {!active && (
            <div className="rounded-lg bg-accent/40 px-4 py-3 text-sm text-muted-foreground">
              This workflow is complete — the quotation is now <span className="font-medium text-foreground">{q.status}</span>.
            </div>
          )}
        </Card>

        <Card className="space-y-3 p-6">
          <h2 className="font-serif text-lg font-semibold text-foreground">Quotation Summary</h2>
          <div className="space-y-2 text-sm">
            <SummaryRow label="Vendor" value={q.vendor.name} />
            <SummaryRow label="Total" value={formatINR(q.total)} mono />
            <SummaryRow label="Subtotal" value={formatINR(q.subtotal)} mono />
            <SummaryRow label="GST" value={formatINR(q.taxAmount)} mono />
            <SummaryRow label="Delivery" value={`${q.deliveryDays} days`} />
            <SummaryRow label="Rating" value={`★ ${(q.vendor.rating || 0).toFixed(1)}`} />
          </div>
          <div className="border-t border-border pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</p>
            <ul className="space-y-1 text-sm">
              {q.items.map((it) => (
                <li key={it.id} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {it.name} × {it.quantity}
                  </span>
                  <span className="font-num text-foreground">{formatINR(it.total)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
