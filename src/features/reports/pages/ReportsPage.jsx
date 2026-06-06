import { Download } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SpendTrendChart } from "@/features/dashboard/components/SpendTrendChart"
import { CategoryDonut } from "@/features/dashboard/components/CategoryDonut"
import { useReportSummary } from "@/features/reports/hooks"
import { formatINR } from "@/lib/utils"

function Kpi({ label, value }) {
  return (
    <Card className="p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-num text-2xl font-semibold text-foreground">{value}</p>
    </Card>
  )
}

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function ReportsPage() {
  const { data: summary, isLoading } = useReportSummary()

  function handleExport() {
    if (!summary) return
    const rows = [
      ["VendorBridge Procurement Report"],
      [],
      ["Spend by Category"],
      ["Category", "Spend (INR)"],
      ...summary.spendByCategory.map((c) => [c.name, c.value]),
      [],
      ["Top Vendors"],
      ["Vendor", "Spend (INR)", "Orders"],
      ...summary.topVendors.map((v) => [v.name, v.value, v.orders]),
    ]
    downloadCsv("vendorbridge-report.csv", rows)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" description="Procurement insights, spend summaries and vendor performance.">
        <Button variant="outline" onClick={handleExport} disabled={!summary}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </PageHeader>

      {isLoading || !summary ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Total Spend" value={formatINR(summary.totalSpend)} />
            <Kpi label="Active Vendors" value={summary.activeVendors} />
            <Kpi label="Fulfilment" value={`${summary.fulfillment}%`} />
            <Kpi label="Purchase Orders" value={summary.totalPurchaseOrders} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            <Card className="p-6 lg:col-span-3">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-foreground">Monthly Spend Trend</h2>
              </div>
              <SpendTrendChart data={summary.monthlyTrend} />
            </Card>
            <Card className="p-6 lg:col-span-2">
              <h2 className="mb-1 font-serif text-xl font-semibold text-foreground">Spend by Category</h2>
              <CategoryDonut data={summary.spendByCategory} />
            </Card>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-border px-6 py-4">
              <h2 className="font-serif text-xl font-semibold text-foreground">Top Vendors by Spend</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    <th className="px-6 py-3 font-semibold">Vendor</th>
                    <th className="px-6 py-3 text-right font-semibold">Spend</th>
                    <th className="px-6 py-3 text-right font-semibold">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topVendors.map((v) => (
                    <tr key={v.name} className="border-b border-border/60 last:border-0">
                      <td className="px-6 py-3 font-medium text-foreground">{v.name}</td>
                      <td className="px-6 py-3 text-right font-num text-foreground">{formatINR(v.value)}</td>
                      <td className="px-6 py-3 text-right font-num text-muted-foreground">{v.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
