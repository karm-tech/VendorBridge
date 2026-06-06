import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, Plus, Sparkles, CheckCircle2, Loader2, ScrollText } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatINR } from "@/lib/utils"
import { useRfq } from "@/features/rfq/hooks"
import { rfqStage, PIPELINE_STAGES } from "@/features/rfq/stage"
import { StageTracker } from "@/components/common/StageTracker"
import { useQuotations, useSelectQuotation } from "@/features/quotations/hooks"
import { scoreQuotations } from "@/features/quotations/scoring"
import { SubmitQuotationDialog } from "@/features/quotations/components/SubmitQuotationDialog"
import { useAuth } from "@/features/auth/AuthContext"

function Row({ label, scored, render, emphasize }) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className={cn("px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground", emphasize && "text-foreground")}>
        {label}
      </td>
      {scored.map((q) => (
        <td key={q.id} className={cn("px-5 py-3", q.recommended && "bg-accent")}>
          {render(q)}
        </td>
      ))}
    </tr>
  )
}

function ScoreBar({ value, highlight }) {
  const pct = Math.round((value || 0) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", highlight ? "bg-primary" : "bg-muted-foreground/50")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-num text-xs text-muted-foreground">{pct}</span>
    </div>
  )
}

export function ComparisonPage() {
  const { rfqId } = useParams()
  const { data: rfq } = useRfq(rfqId)
  const { data: quotations, isLoading } = useQuotations(rfqId)
  const select = useSelectQuotation()
  const { can } = useAuth()
  const canSubmit = can("quotation:submit")
  const canSelect = can("quotation:select")
  const [dialogOpen, setDialogOpen] = useState(false)

  const scored = scoreQuotations(quotations || [])
  const recommended = scored.find((q) => q.recommended)
  const selectedQuote = scored.find((q) => q.status === "selected")

  return (
    <div className="space-y-6">
      <div>
        <Link to="/quotations" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to quotations
        </Link>
        <PageHeader title="Quotation Comparison" description={rfq?.title || "Compare vendor quotations side by side"}>
          {canSubmit && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Submit quotation
            </Button>
          )}
        </PageHeader>
      </div>

      {rfq && (
        <Card className="p-5">
          <StageTracker stages={PIPELINE_STAGES} current={rfqStage(rfq)} />
        </Card>
      )}

      {selectedQuote && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-accent px-4 py-3">
          <p className="text-sm text-foreground">
            <span className="font-medium">{selectedQuote.vendor.name}</span> is selected — proceed to approval.
          </p>
          <Button asChild size="sm">
            <Link to={`/approvals/${selectedQuote.id}`}>
              Go to approval <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-72 w-full rounded-xl" />
      ) : scored.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No quotations yet"
          description="Submit the first quotation for this RFQ to start comparing."
          action={
            canSubmit ? (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Submit quotation
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr>
                  <th className="w-44 border-b border-border px-5 py-4" />
                  {scored.map((q) => (
                    <th key={q.id} className={cn("border-b border-border px-5 py-4 text-left align-bottom", q.recommended && "bg-accent")}>
                      <div className="space-y-1.5">
                        {q.recommended && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                            <Sparkles className="h-3 w-3" /> Recommended
                          </span>
                        )}
                        <div className="font-serif text-base font-semibold text-foreground">{q.vendor.name}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row
                  label="Total"
                  emphasize
                  scored={scored}
                  render={(q) => (
                    <span className={cn("font-num text-lg font-semibold", q.recommended ? "text-primary" : "text-foreground")}>
                      {formatINR(q.total)}
                    </span>
                  )}
                />
                <Row label="Subtotal" scored={scored} render={(q) => <span className="font-num text-muted-foreground">{formatINR(q.subtotal)}</span>} />
                <Row label="GST" scored={scored} render={(q) => <span className="font-num text-muted-foreground">{formatINR(q.taxAmount)}</span>} />
                <Row label="Delivery" scored={scored} render={(q) => <span className="text-foreground">{q.deliveryDays} days</span>} />
                <Row label="Vendor rating" scored={scored} render={(q) => <span className="text-foreground">★ {(q.vendor.rating || 0).toFixed(1)}</span>} />
                <Row label="Payment terms" scored={scored} render={(q) => <span className="text-muted-foreground">{q.paymentTerms || "—"}</span>} />
                <Row label="Match score" scored={scored} render={(q) => <ScoreBar value={q.score} highlight={q.recommended} />} />
                <tr>
                  <td className="px-5 py-4" />
                  {scored.map((q) => (
                    <td key={q.id} className={cn("px-5 py-4 align-top", q.recommended && "bg-accent")}>
                      {q.status === "selected" ? (
                        <Button size="sm" variant="secondary" disabled className="gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Selected
                        </Button>
                      ) : canSelect ? (
                        <Button
                          size="sm"
                          variant={q.recommended ? "default" : "outline"}
                          onClick={() => select.mutate(q.id)}
                          disabled={select.isPending}
                        >
                          {select.isPending && select.variables === q.id && <Loader2 className="h-4 w-4 animate-spin" />}
                          Select
                        </Button>
                      ) : null}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          {recommended && recommended.savings > 0 && (
            <div className="border-t border-border bg-accent/40 px-5 py-3 text-sm">
              <span className="font-medium text-primary">{recommended.vendor.name}</span> is the smart pick — saves{" "}
              <span className="font-num font-semibold text-foreground">{formatINR(recommended.savings)}</span> vs the highest quote, balancing price, delivery and rating.
            </div>
          )}
        </Card>
      )}

      <SubmitQuotationDialog open={dialogOpen} onOpenChange={setDialogOpen} rfq={rfq} />
    </div>
  )
}
