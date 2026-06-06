import { Activity } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"

export function ActivityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity & Logs"
        description="A full audit trail of every procurement action."
      />
      <EmptyState
        icon={Activity}
        title="Activity log is coming up"
        description="A filterable timeline of RFQs, approvals, invoices and updates arrives in the next version."
      />
    </div>
  )
}
