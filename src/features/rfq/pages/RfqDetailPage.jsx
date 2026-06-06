import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, Pencil, Lock } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { StageTracker } from "@/components/common/StageTracker"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { useRfq } from "@/features/rfq/hooks"
import { useAuth } from "@/features/auth/AuthContext"
import { PIPELINE_STAGES, rfqStage } from "@/features/rfq/stage"

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  )
}

export function RfqDetailPage() {
  const { id } = useParams()
  const { data: rfq, isLoading } = useRfq(id)
  const { can } = useAuth()
  const canWrite = can("rfq:write")

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl" />
  if (!rfq) return <p className="text-sm text-muted-foreground">RFQ not found.</p>

  const editable = rfq.status === "open" || rfq.status === "draft"

  return (
    <div className="space-y-6">
      <div>
        <Link to="/rfqs" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to RFQs
        </Link>
        <PageHeader title={rfq.title} description="Request for quotation details">
          <StatusBadge status={rfq.status} />
          {canWrite &&
            (editable ? (
              <Button variant="outline" asChild>
                <Link to={`/rfqs/${rfq.id}/edit`}>
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Locked — quotation confirmed
              </span>
            ))}
        </PageHeader>
      </div>

      <Card className="p-5">
        <StageTracker stages={PIPELINE_STAGES} current={rfqStage(rfq)} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="space-y-5 p-6 lg:col-span-2">
          <h2 className="font-serif text-lg font-semibold text-foreground">Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" value={rfq.category || "—"} />
            <Field label="Deadline" value={rfq.deadline ? formatDate(rfq.deadline) : "—"} />
            <Field label="Created" value={formatDate(rfq.createdAt)} />
            <Field label="Status" value={<StatusBadge status={rfq.status} />} />
          </div>
          {rfq.description && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
              <p className="mt-1 text-sm text-muted-foreground">{rfq.description}</p>
            </div>
          )}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Line Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 font-semibold">Item</th>
                    <th className="pb-2 text-right font-semibold">Qty</th>
                    <th className="pb-2 text-right font-semibold">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {rfq.items.map((it) => (
                    <tr key={it.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 text-foreground">{it.name}</td>
                      <td className="py-2.5 text-right font-num text-muted-foreground">{it.quantity}</td>
                      <td className="py-2.5 text-right text-muted-foreground">{it.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">
              Invited Vendors ({rfq.invitations.length})
            </h2>
            {rfq.invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No vendors invited.</p>
            ) : (
              <ul className="space-y-2.5">
                {rfq.invitations.map((inv) => (
                  <li key={inv.id} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{inv.vendor.name}</span>
                    <StatusBadge status={inv.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">
              Quotations ({rfq.quotations.length})
            </h2>
            {rfq.quotations.length > 0 ? (
              <Button asChild className="w-full">
                <Link to={`/quotations/${rfq.id}`}>
                  Compare quotations <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">No quotations received yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
