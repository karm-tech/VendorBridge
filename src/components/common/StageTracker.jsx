import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function StageTracker({ stages, current }) {
  return (
    <div className="flex items-center overflow-x-auto pb-1">
      {stages.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex shrink-0 items-center">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "border-2 border-primary text-primary"
                      : "border border-border text-muted-foreground"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-sm",
                  active ? "font-semibold text-foreground" : done ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <span className={cn("mx-2 h-px w-6 shrink-0 sm:w-10", done ? "bg-primary" : "bg-border")} />
            )}
          </div>
        )
      })}
    </div>
  )
}
