import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ACCENTS = {
  primary: "bg-primary/10 text-primary",
  amber: "bg-amber-100 text-amber-600",
  sky: "bg-sky-100 text-sky-600",
  violet: "bg-violet-100 text-violet-600",
}

export function StatCard({ label, value, icon: Icon, trend, accent = "primary" }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            ACCENTS[accent]
          )}
        >
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {trend && <p className="mt-0.5 text-xs text-muted-foreground">{trend}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
