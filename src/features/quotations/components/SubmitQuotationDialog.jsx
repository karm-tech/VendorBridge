import { useEffect, useMemo, useState } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatINR } from "@/lib/utils"
import { useSubmitQuotation } from "@/features/quotations/hooks"
import { useVendors } from "@/features/vendors/hooks"

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function SubmitQuotationDialog({ open, onOpenChange, rfq }) {
  const submit = useSubmitQuotation()
  const { data: vendorList } = useVendors({})
  const vendors = vendorList || []
  const items = rfq?.items || []

  const [vendorId, setVendorId] = useState("")
  const [delivery, setDelivery] = useState(7)
  const [terms, setTerms] = useState("30 days net")
  const [taxRate, setTaxRate] = useState(18)
  const [prices, setPrices] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    setVendorId("")
    setDelivery(7)
    setTerms("30 days net")
    setTaxRate(18)
    setPrices({})
    setError("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, rfq?.id])

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity * (Number(prices[it.id]) || 0), 0),
    [items, prices]
  )
  const tax = Math.round((subtotal * (Number(taxRate) || 0)) / 100)
  const total = subtotal + tax

  const selectedVendor = vendors.find((v) => v.id === vendorId)
  const vendorBlocked = selectedVendor?.status === "blocked"

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!vendorId) return setError("Select a vendor")
    if (vendorBlocked) return setError("This vendor is blocked — please select another vendor")
    if (items.some((it) => !(Number(prices[it.id]) > 0))) return setError("Enter a unit price for every item")
    try {
      await submit.mutateAsync({
        rfqId: rfq.id,
        vendorId,
        deliveryDays: Number(delivery),
        paymentTerms: terms,
        taxRate: Number(taxRate),
        items: items.map((it) => ({ name: it.name, quantity: it.quantity, unitPrice: Number(prices[it.id]) })),
      })
      onOpenChange(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit quotation</DialogTitle>
          <DialogDescription>{rfq?.title}</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q-vendor">Vendor</Label>
            <select id="q-vendor" className={selectClass} value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
              <option value="">Select vendor</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                  {v.status === "blocked" ? " — Blocked" : ""}
                </option>
              ))}
            </select>
            {vendorBlocked && (
              <p className="flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                This vendor is blocked — please select another vendor.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Line item pricing</Label>
            <div className="space-y-2">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <div className="flex-1 text-sm">
                    <span className="text-foreground">{it.name}</span>{" "}
                    <span className="text-muted-foreground">
                      × {it.quantity} {it.unit}
                    </span>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Unit price"
                    className="w-32"
                    value={prices[it.id] || ""}
                    onChange={(e) => setPrices((p) => ({ ...p, [it.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="q-delivery">Delivery (days)</Label>
              <Input id="q-delivery" type="number" min={0} value={delivery} onChange={(e) => setDelivery(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-tax">GST %</Label>
              <Input id="q-tax" type="number" min={0} value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-terms">Payment terms</Label>
              <Input id="q-terms" value={terms} onChange={(e) => setTerms(e.target.value)} />
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-num">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST</span>
              <span className="font-num">{formatINR(tax)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border pt-1 font-semibold text-foreground">
              <span>Total</span>
              <span className="font-num">{formatINR(total)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submit.isPending || vendorBlocked}>
              {submit.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit quotation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
