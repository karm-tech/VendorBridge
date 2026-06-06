import { Receipt } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"

export function InvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Generate, print and email GST invoices for your purchase orders."
      />
      <EmptyState
        icon={Receipt}
        title="Invoicing is coming up"
        description="Invoice generation with GST breakdown, PDF download, print and email arrives in the next version."
      />
    </div>
  )
}
