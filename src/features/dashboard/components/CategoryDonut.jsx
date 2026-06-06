import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { formatINR, formatINRCompact } from "@/lib/utils"

const COLORS = ["hsl(245 57% 51%)", "hsl(243 76% 59%)", "hsl(234 89% 74%)", "hsl(230 50% 85%)"]

export function CategoryDonut({ data }) {
  const total = data.reduce((sum, c) => sum + c.value, 0)
  return (
    <div className="relative">
      <div className="h-[170px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none">
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 }}
              formatter={(val) => formatINR(val)}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Total</span>
          <span className="font-num text-lg font-semibold text-foreground">{formatINRCompact(total)}</span>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {data.map((c, i) => (
          <div key={c.name} className="flex items-center gap-1.5 text-xs text-foreground/80">
            <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            {c.name}
          </div>
        ))}
      </div>
    </div>
  )
}
