import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, light = false }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg shadow-sm",
          light ? "bg-white text-primary" : "bg-primary text-primary-foreground"
        )}
      >
        <span className="text-lg font-extrabold">V</span>
      </div>
      {showText && (
        <span
          className={cn(
            "text-lg font-bold tracking-tight",
            light ? "text-white" : "text-foreground"
          )}
        >
          Vendor<span className={light ? "text-white/80" : "text-primary"}>Bridge</span>
        </span>
      )}
    </div>
  )
}
