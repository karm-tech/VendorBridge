import { ScrollText } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"

export function QuotationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Review vendor quotations and compare them side by side."
      />
      <EmptyState
        icon={ScrollText}
        title="Quotations are coming up"
        description="Quotation submission and the smart side-by-side comparison with savings insights arrive in the next version."
      />
    </div>
  )
}
