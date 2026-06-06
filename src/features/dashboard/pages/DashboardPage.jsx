import { Link } from "react-router-dom"
import {
  FileText,
  ClipboardCheck,
  ShoppingCart,
  IndianRupee,
  Plus,
  Building2,
  Receipt,
  BarChart3,
} from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { StatCard } from "@/features/dashboard/components/StatCard"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { formatINR } from "@/lib/utils"

const recentPurchaseOrders = [
  { id: "PO-2025-0068", vendor: "Infra Supplies Pvt Ltd", amount: 200010, status: "pending" },
  { id: "PO-2025-0067", vendor: "TechCore Ltd", amount: 142500, status: "approved" },
  { id: "PO-2025-0066", vendor: "FastLog Logistics", amount: 89000, status: "paid" },
  { id: "PO-2025-0065", vendor: "OfficePlus Traders", amount: 53200, status: "draft" },
]

const spendByCategory = [
  { name: "IT Hardware", value: 460000, pct: 38 },
  { name: "Furniture", value: 220000, pct: 22 },
  { name: "Logistics", value: 210000, pct: 18 },
  { name: "Stationery", value: 120000, pct: 12 },
]

function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-card transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </Link>
  )
}

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back — here's your procurement overview for today."
      >
        <Button asChild>
          <Link to="/rfqs">
            <Plus className="h-4 w-4" /> New RFQ
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active RFQs" value="12" icon={FileText} accent="primary" trend="+3 this week" />
        <StatCard label="Pending Approvals" value="5" icon={ClipboardCheck} accent="amber" trend="2 awaiting you" />
        <StatCard label="Spend this month" value={formatINR(231000)} icon={IndianRupee} accent="sky" trend="+8% vs last month" />
        <StatCard label="Purchase Orders" value="3" icon={ShoppingCart} accent="violet" trend="this week" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>Latest procurement documents</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/purchase-orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 font-medium">PO Number</th>
                    <th className="pb-2 font-medium">Vendor</th>
                    <th className="pb-2 text-right font-medium">Amount</th>
                    <th className="pb-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPurchaseOrders.map((po) => (
                    <tr key={po.id} className="border-b border-border/60 last:border-0">
                      <td className="py-3 font-medium text-foreground">{po.id}</td>
                      <td className="py-3 text-muted-foreground">{po.vendor}</td>
                      <td className="py-3 text-right font-medium">{formatINR(po.amount)}</td>
                      <td className="py-3 text-right">
                        <StatusBadge status={po.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {spendByCategory.map((category) => (
              <div key={category.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{category.name}</span>
                  <span className="text-muted-foreground">{formatINR(category.value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${category.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickAction to="/rfqs" icon={Plus} label="New RFQ" />
        <QuickAction to="/vendors" icon={Building2} label="Add Vendor" />
        <QuickAction to="/invoices" icon={Receipt} label="Invoices" />
        <QuickAction to="/reports" icon={BarChart3} label="Reports" />
      </div>
    </div>
  )
}
