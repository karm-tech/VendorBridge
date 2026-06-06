import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { formatINR } from "@/lib/utils"

export function SpendTrendChart({ data }) {
  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 6, left: 6, bottom: 0 }}>
          <defs>
            <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.32} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="m"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            dy={6}
          />
          <Tooltip
            cursor={{ stroke: "hsl(var(--border))" }}
            contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }}
            formatter={(val) => [formatINR(val), "Spend"]}
          />
          <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#spendFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
