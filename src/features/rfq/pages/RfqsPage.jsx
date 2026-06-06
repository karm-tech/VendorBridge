import { FileText, Plus } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"

export function RfqsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Requests for Quotation"
        description="Create and track RFQs sent to your vendors."
      >
        <Button>
          <Plus className="h-4 w-4" /> Create RFQ
        </Button>
      </PageHeader>
      <EmptyState
        icon={FileText}
        title="RFQ workspace is coming up"
        description="The multi-step RFQ builder with line items, deadlines and vendor assignment arrives in the next version."
      />
    </div>
  )
}
