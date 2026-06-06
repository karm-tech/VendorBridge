import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ResponsiveContainer, LineChart, Line } from "recharts"
import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatINR } from "@/lib/utils"

function useCountUp(target, duration = 950) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    let start
    const tick = (t) => {
      if (!start) start = t
      const p = Math.min((t - start) / duration, 1)
      setValue(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export function StatCard({ label, value, delta, money = false, data = [], index = 0 }) {
  const v = useCountUp(value)
  const shown = money ? formatINR(v) : Math.round(v).toLocaleString("en-IN")
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.45, ease: "easeOut" }}
    >
      <Card className="p-4 transition-transform hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
          {delta && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[10.5px] font-semibold text-primary">
              <ArrowUpRight className="h-3 w-3" />
              {delta}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="font-num text-[26px] font-semibold tracking-tight text-foreground">{shown}</div>
          {data.length > 0 && (
            <div className="h-9 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
