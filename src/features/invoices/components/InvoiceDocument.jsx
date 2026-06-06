import { Logo } from "@/components/brand/Logo"
import { StatusBadge } from "@/components/common/StatusBadge"
import { ORG } from "@/constants/org"
import { formatINR, formatDate } from "@/lib/utils"

function Meta({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-num text-sm text-foreground">{value}</p>
    </div>
  )
}

export function InvoiceDocument({ invoice }) {
  const vendor = invoice.vendor
  const po = invoice.purchaseOrder

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
      <div className="flex items-start justify-between gap-6">
        <div>
          <Logo />
          <p className="mt-2 text-xs text-muted-foreground">{ORG.address}</p>
          <p className="text-xs text-muted-foreground">GSTIN: {ORG.gstin}</p>
        </div>
        <div className="text-right">
          <p className="font-serif text-2xl font-semibold text-foreground">Tax Invoice</p>
          <p className="font-num text-sm text-muted-foreground">{invoice.invoiceNumber}</p>
          <div className="mt-2 flex justify-end">
            <StatusBadge status={invoice.status} />
          </div>
        </div>
      </div>

      <div className="my-6 grid grid-cols-1 gap-6 border-y border-border py-5 text-sm sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Bill To</p>
          <p className="mt-1 font-medium text-foreground">{ORG.name}</p>
          <p className="text-muted-foreground">{ORG.address}</p>
          <p className="text-muted-foreground">GSTIN: {ORG.gstin}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Vendor</p>
          <p className="mt-1 font-medium text-foreground">{vendor.name}</p>
          <p className="text-muted-foreground">{vendor.address || "—"}</p>
          <p className="text-muted-foreground">GSTIN: {vendor.gstNo || "—"}</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Meta label="PO Number" value={po?.poNumber || "—"} />
        <Meta label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
        <Meta label="Due Date" value={invoice.dueDate ? formatDate(invoice.dueDate) : "—"} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="rounded-l-md px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 text-right font-semibold">Qty</th>
              <th className="px-3 py-2 text-right font-semibold">Unit Price</th>
              <th className="rounded-r-md px-3 py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it) => (
              <tr key={it.id} className="border-b border-border/60">
                <td className="px-3 py-2.5 text-foreground">{it.name}</td>
                <td className="px-3 py-2.5 text-right font-num text-muted-foreground">{it.quantity}</td>
                <td className="px-3 py-2.5 text-right font-num text-muted-foreground">{formatINR(it.unitPrice)}</td>
                <td className="px-3 py-2.5 text-right font-num text-foreground">{formatINR(it.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ml-auto mt-5 w-full max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-num text-foreground">{formatINR(invoice.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CGST (9%)</span>
          <span className="font-num text-foreground">{formatINR(invoice.cgst)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">SGST (9%)</span>
          <span className="font-num text-foreground">{formatINR(invoice.sgst)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-foreground">
          <span>Grand Total</span>
          <span className="font-num">{formatINR(invoice.total)}</span>
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">This is a computer-generated invoice.</p>
    </div>
  )
}
