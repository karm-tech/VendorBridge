import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Sparkles, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/common/StatusBadge"
import { StatCard } from "@/features/dashboard/components/StatCard"
import { HeroBanner } from "@/features/dashboard/components/HeroBanner"
import { SpendTrendChart } from "@/features/dashboard/components/SpendTrendChart"
import { CategoryDonut } from "@/features/dashboard/components/CategoryDonut"
import { formatINR } from "@/lib/utils"

const spark = (values) => values.map((v, i) => ({ i, v }))

const kpis = [
  { label: "Active RFQs", value: 12, delta: "+3", money: false, data: spark([6, 8, 7, 9, 10, 12]) },
  { label: "Pending Approvals", value: 5, delta: "2 for you", money: false, data: spark([3, 4, 6, 5, 4, 5]) },
  { label: "Spend · Month", value: 231000, delta: "+8%", money: true, data: spark([142, 168, 151, 189, 212, 231]) },
  { label: "Purchase Orders", value: 38, delta: "+5", money: false, data: spark([22, 26, 29, 31, 34, 38]) },
]

const spendTrend = [
  { m: "Dec", v: 142000 },
  { m: "Jan", v: 168000 },
  { m: "Feb", v: 151000 },
  { m: "Mar", v: 189000 },
  { m: "Apr", v: 212000 },
  { m: "May", v: 231000 },
]

const categories = [
  { name: "IT Hardware", value: 460000 },
  { name: "Furniture", value: 220000 },
  { name: "Logistics", value: 210000 },
  { name: "Stationery", value: 120000 },
]

const orders = [
  { id: "PO-2025-0068", vendor: "Infra Supplies Pvt Ltd", amount: 200010, status: "pending" },
  { id: "PO-2025-0067", vendor: "TechCore Ltd", amount: 142500, status: "approved" },
  { id: "PO-2025-0066", vendor: "FastLog Logistics", amount: 89000, status: "paid" },
  { id: "PO-2025-0065", vendor: "OfficePlus Traders", amount: 53200, status: "draft" },
]

const comparison = [
  { vendor: "OfficePlus Traders", price: 162500, delivery: 15, rating: 3.9, best: true },
  { vendor: "Infra Supplies", price: 167000, delivery: 12, rating: 4.5, best: false },
  { vendor: "TechCore Ltd", price: 172500, delivery: 10, rating: 4.2, best: false },
]

function SectionCard({ children, className }) {
  return <Card className={className}>{children}</Card>
}

export function DashboardPage() {
  return (
    <div className="space-y-5">
      <HeroBanner dateLabel="Today" spend={231000} deltaLabel="+8% vs last month" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => (
          <StatCard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }} className="lg:col-span-3">
          <SectionCard className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-foreground">Spend Trend</h2>
              <span className="text-xs font-medium text-muted-foreground">Last 6 months</span>
            </div>
            <SpendTrendChart data={spendTrend} />
          </SectionCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.45 }} className="lg:col-span-2">
          <SectionCard className="p-6">
            <h2 className="mb-1 font-serif text-xl font-semibold text-foreground">Spend by Category</h2>
            <CategoryDonut data={categories} />
          </SectionCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.45 }} className="lg:col-span-3">
          <SectionCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-foreground">Recent Purchase Orders</h2>
              <Link to="/purchase-orders" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
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
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 font-num text-[13px] font-medium text-foreground">{o.id}</td>
                      <td className="py-2.5 text-muted-foreground">{o.vendor}</td>
                      <td className="py-2.5 text-right font-num font-medium text-foreground">{formatINR(o.amount)}</td>
                      <td className="py-2.5 text-right">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.45 }} className="lg:col-span-2">
          <SectionCard className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-serif text-xl font-semibold text-foreground">Best Quote</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" /> Smart pick
              </span>
            </div>
            <div className="space-y-2.5">
              {comparison.map((c) => (
                <div
                  key={c.vendor}
                  className={
                    c.best
                      ? "rounded-xl border-[1.5px] border-primary bg-accent p-3"
                      : "rounded-xl border border-border bg-card p-3"
                  }
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{c.vendor}</p>
                    {c.best && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Pick
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-end justify-between">
                    <p className="font-num text-lg font-semibold text-foreground">{formatINR(c.price)}</p>
                    <span className="text-xs text-muted-foreground">
                      {c.delivery}d · ★{c.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>
      </div>
    </div>
  )
}
