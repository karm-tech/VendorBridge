import { Link } from "react-router-dom"
import { FileText, ClipboardCheck, IndianRupee, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/common/StatusBadge"
import { StatCard } from "@/features/dashboard/components/StatCard"
import { HeroBanner } from "@/features/dashboard/components/HeroBanner"
import { SpendTrendChart } from "@/features/dashboard/components/SpendTrendChart"
import { CategoryDonut } from "@/features/dashboard/components/CategoryDonut"
import { useReportSummary } from "@/features/reports/hooks"
import { usePurchaseOrders } from "@/features/purchase-orders/hooks"
import { formatINR } from "@/lib/utils"

export function DashboardPage() {
  const { data: summary, isLoading } = useReportSummary()
  const { data: pos } = usePurchaseOrders()

  if (isLoading || !summary) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    )
  }

  const trend = summary.monthlyTrend || []
  const last = trend[trend.length - 1]?.v || 0
  const prev = trend[trend.length - 2]?.v || 0
  const deltaPct = prev ? Math.round(((last - prev) / prev) * 100) : 0
  const spendSpark = trend.map((t) => ({ v: t.v }))
  const recentPos = (pos || []).slice(0, 5)

  return (
    <div className="space-y-5">
      <HeroBanner
        dateLabel="Today"
        spend={summary.totalSpend}
        deltaLabel={`${deltaPct >= 0 ? "+" : ""}${deltaPct}% vs last month`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open RFQs" value={summary.openRfqs} icon={FileText} index={0} />
        <StatCard label="Pending Approvals" value={summary.pendingApprovals} icon={ClipboardCheck} index={1} />
        <StatCard label="Total Spend" value={summary.totalSpend} money delta={`${deltaPct >= 0 ? "+" : ""}${deltaPct}%`} data={spendSpark} index={2} />
        <StatCard label="Purchase Orders" value={summary.totalPurchaseOrders} icon={ShoppingCart} index={3} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-foreground">Spend Trend</h2>
            <span className="text-xs font-medium text-muted-foreground">Last 6 months</span>
          </div>
          <SpendTrendChart data={summary.monthlyTrend} />
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-1 font-serif text-xl font-semibold text-foreground">Spend by Category</h2>
          <CategoryDonut data={summary.spendByCategory} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-foreground">Recent Purchase Orders</h2>
            <Link to="/purchase-orders" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentPos.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No purchase orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="pb-2.5 font-semibold">PO Number</th>
                    <th className="pb-2.5 font-semibold">Vendor</th>
                    <th className="pb-2.5 text-right font-semibold">Amount</th>
                    <th className="pb-2.5 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPos.map((po) => (
                    <tr key={po.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 font-num text-[13px] font-medium text-foreground">{po.poNumber}</td>
                      <td className="py-2.5 text-muted-foreground">{po.vendor.name}</td>
                      <td className="py-2.5 text-right font-num text-foreground">{formatINR(po.quotation.total)}</td>
                      <td className="py-2.5 text-right">
                        <StatusBadge status={po.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Top Vendors</h2>
          <div className="space-y-3">
            {summary.topVendors.map((v) => (
              <div key={v.name} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.orders} order(s)</p>
                </div>
                <span className="font-num text-sm font-semibold text-foreground">{formatINR(v.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
