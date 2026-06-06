import { BarChart3 } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Procurement insights, spend summaries and vendor performance."
      />
      <EmptyState
        icon={BarChart3}
        title="Analytics are coming up"
        description="Spend by category, top vendors, monthly trends and exportable reports arrive in the next version."
      />
    </div>
  )
}
