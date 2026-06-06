import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, light = false }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm",
          light && "bg-white/15"
        )}
        style={light ? undefined : { background: "linear-gradient(135deg,#818CF8,#4338CA)" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 17.5h20" />
          <path d="M5 17.5V8" />
          <path d="M19 17.5V8" />
          <path d="M5 8.5c4.5 4 9.5 4 14 0" />
          <path d="M9 17.5v-3" />
          <path d="M12 17.5v-3.6" />
          <path d="M15 17.5v-3" />
        </svg>
      </div>
      {showText && (
        <span
          className={cn(
            "font-serif text-lg font-semibold tracking-tight",
            light ? "text-white" : "text-foreground"
          )}
        >
          VendorBridge
        </span>
      )}
    </div>
  )
}
