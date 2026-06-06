import { Building2, Plus } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Button } from "@/components/ui/button"

export function VendorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        description="Manage supplier profiles, categories, GST and contact details."
      >
        <Button>
          <Plus className="h-4 w-4" /> Add Vendor
        </Button>
      </PageHeader>
      <EmptyState
        icon={Building2}
        title="Vendor management is coming up"
        description="Registration, status tracking, categories, GST details and search land in the next version."
      />
    </div>
  )
}
