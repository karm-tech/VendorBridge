import { ClipboardCheck } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"

export function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Approvals"
        description="Approve or reject procurement requests through a structured workflow."
      />
      <EmptyState
        icon={ClipboardCheck}
        title="Approval workflow is coming up"
        description="Multi-stage approvals with remarks, timeline and status transitions arrive in the next version."
      />
    </div>
  )
}
