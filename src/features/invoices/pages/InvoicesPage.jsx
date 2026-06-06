import { Link } from "react-router-dom"
import { Receipt, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatINR, formatDate } from "@/lib/utils"
import { useInvoices } from "@/features/invoices/hooks"

export function InvoicesPage() {
  const { data: invoices, isLoading, isError, error } = useInvoices()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Generate, print and email GST invoices for your purchase orders."
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
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No invoices yet"
            description="Create an invoice from a purchase order to see it here."
            action={
              <Button asChild>
                <Link to="/purchase-orders">Go to Purchase Orders</Link>
              </Button>
            }
            className="border-0 bg-transparent"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Invoice</th>
                  <th className="px-5 py-3 font-semibold">Vendor</th>
                  <th className="px-5 py-3 font-semibold">PO</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-num font-medium text-foreground">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3 text-muted-foreground">{inv.vendor.name}</td>
                    <td className="px-5 py-3 font-num text-muted-foreground">{inv.purchaseOrder?.poNumber || "—"}</td>
                    <td className="px-5 py-3 text-right font-num text-foreground">{formatINR(inv.total)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/invoices/${inv.id}`}>
                          View <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
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
