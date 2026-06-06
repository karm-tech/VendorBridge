import { ShoppingCart } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"

export function PurchaseOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Auto-generated purchase orders from approved quotations."
      />
      <EmptyState
        icon={ShoppingCart}
        title="Purchase orders are coming up"
        description="Auto-numbered POs with line items and status tracking arrive in the next version."
      />
    </div>
  )
}
