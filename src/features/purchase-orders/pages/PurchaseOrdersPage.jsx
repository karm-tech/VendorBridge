import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ShoppingCart, Plus, Loader2, FileText } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatINR, formatDate } from "@/lib/utils"
import {
  usePurchaseOrders,
  useAvailableQuotations,
  useGeneratePurchaseOrder,
} from "@/features/purchase-orders/hooks"
import { useGenerateInvoice } from "@/features/invoices/hooks"

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function PurchaseOrdersPage() {
  const navigate = useNavigate()
  const { data: pos, isLoading } = usePurchaseOrders()
  const { data: available } = useAvailableQuotations()
  const genPO = useGeneratePurchaseOrder()
  const genInvoice = useGenerateInvoice()
  const [selectedQ, setSelectedQ] = useState("")
  const [busyPo, setBusyPo] = useState("")

  async function generatePO() {
    if (!selectedQ) return
    await genPO.mutateAsync(selectedQ)
    setSelectedQ("")
  }

  async function createInvoice(poId) {
    setBusyPo(poId)
    try {
      const r = await genInvoice.mutateAsync(poId)
      navigate(`/invoices/${r.invoice.id}`)
    } finally {
      setBusyPo("")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Orders" description="Generate purchase orders from approved quotations." />

      {available && available.length > 0 && (
        <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="po-quote" className="text-sm font-medium text-foreground">
              Approved quotation
            </label>
            <select id="po-quote" value={selectedQ} onChange={(e) => setSelectedQ(e.target.value)} className={selectClass}>
              <option value="">Select an approved quotation</option>
              {available.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.vendor.name} — {q.rfq.title} ({formatINR(q.total)})
                </option>
              ))}
            </select>
          </div>
          <Button onClick={generatePO} disabled={!selectedQ || genPO.isPending}>
            {genPO.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Generate PO
          </Button>
        </Card>
      )}

      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : pos.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="No purchase orders yet"
            description="Approve a quotation, then generate a purchase order here."
            className="border-0 bg-transparent"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">PO Number</th>
                  <th className="px-5 py-3 font-semibold">Vendor</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 text-right font-semibold">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {pos.map((po) => (
                  <tr key={po.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-num font-medium text-foreground">{po.poNumber}</td>
                    <td className="px-5 py-3 text-muted-foreground">{po.vendor.name}</td>
                    <td className="px-5 py-3 text-right font-num text-foreground">{formatINR(po.quotation.total)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDate(po.poDate)}</td>
                    <td className="px-5 py-3 text-right">
                      {po.invoice ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/invoices/${po.invoice.id}`}>
                            <FileText className="h-3.5 w-3.5" /> View invoice
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => createInvoice(po.id)} disabled={busyPo === po.id}>
                          {busyPo === po.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                          Create invoice
                        </Button>
                      )}
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
