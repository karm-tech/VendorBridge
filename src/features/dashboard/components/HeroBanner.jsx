import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Plus, TrendingUp } from "lucide-react"
import { formatINR } from "@/lib/utils"

const GRAIN =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"

export function HeroBanner({ name = "Karm", dateLabel, spend, deltaLabel, canCreateRfq = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl p-7 text-white"
      style={{
        backgroundColor: "#4F46E5",
        backgroundImage:
          "radial-gradient(at 85% 10%, rgba(129,140,248,0.65), transparent 45%), radial-gradient(at 10% 95%, rgba(99,102,241,0.55), transparent 45%), linear-gradient(135deg,#4338CA,#4F46E5)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-white/70">
            Good morning, {name}
            {dateLabel ? ` · ${dateLabel}` : ""}
          </p>
          <h1 className="mt-1 font-serif text-[34px] font-semibold leading-none tracking-tight sm:text-[38px]">
            Procurement Overview
          </h1>
          <div className="mt-5 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/60">Spend this month</p>
              <p className="font-num text-3xl font-semibold">{formatINR(spend)}</p>
            </div>
            {deltaLabel && (
              <div className="flex items-center gap-1.5 pb-1 text-sm font-medium text-emerald-300">
                <TrendingUp className="h-4 w-4" />
                {deltaLabel}
              </div>
            )}
          </div>
        </div>
        {canCreateRfq && (
          <Link
            to="/rfqs/new"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:bg-white/90"
          >
            <Plus className="h-4 w-4" /> New RFQ
          </Link>
        )}
      </div>
    </motion.div>
  )
}
