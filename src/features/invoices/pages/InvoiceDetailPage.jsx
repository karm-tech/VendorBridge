import { lazy, Suspense, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Printer, Mail, CheckCircle2, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StageTracker } from "@/components/common/StageTracker"
import { PIPELINE_STAGES, invoiceStage } from "@/features/rfq/stage"
import { InvoiceDocument } from "@/features/invoices/components/InvoiceDocument"
import { useInvoice, useUpdateInvoice, useEmailInvoice } from "@/features/invoices/hooks"
import { useAuth } from "@/features/auth/AuthContext"

const InvoiceDownloadButton = lazy(() =>
  import("@/features/invoices/components/InvoicePdf").then((m) => ({ default: m.InvoiceDownloadButton }))
)

export function InvoiceDetailPage() {
  const { id } = useParams()
  const { data: invoice, isLoading } = useInvoice(id)
  const update = useUpdateInvoice()
  const email = useEmailInvoice()
  const { can } = useAuth()
  const canWrite = can("invoice:write")
  const [emailMsg, setEmailMsg] = useState("")

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl" />
  if (!invoice) return <p className="text-sm text-muted-foreground">Invoice not found.</p>

  async function handleEmail() {
    setEmailMsg("")
    try {
      const r = await email.mutateAsync(invoice.id)
      setEmailMsg(
        r.simulated
          ? `Demo: invoice captured in Sent Emails (to ${r.to}). Configure SMTP to deliver for real.`
          : `Invoice emailed to ${r.to} — saved in Sent Emails.`
      )
    } catch (err) {
      setEmailMsg(err.message)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link to="/invoices" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to invoices
        </Link>
        <div className="flex flex-wrap gap-2">
          <Suspense
            fallback={
              <Button variant="outline" disabled>
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            }
          >
            <InvoiceDownloadButton invoice={invoice} />
          </Suspense>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          {canWrite && (
            <Button variant="outline" onClick={handleEmail} disabled={email.isPending}>
              {email.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Email
            </Button>
          )}
          {canWrite && invoice.status !== "paid" && (
            <Button onClick={() => update.mutate({ id: invoice.id, status: "paid" })} disabled={update.isPending}>
              {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {emailMsg && (
        <div className="rounded-lg bg-accent px-3 py-2 text-sm text-primary print:hidden">{emailMsg}</div>
      )}

      <div className="mx-auto max-w-3xl print:hidden">
        <Card className="p-5">
          <StageTracker stages={PIPELINE_STAGES} current={invoiceStage(invoice)} />
        </Card>
      </div>

      <div className="mx-auto max-w-3xl">
        <InvoiceDocument invoice={invoice} />
      </div>
    </div>
  )
}
