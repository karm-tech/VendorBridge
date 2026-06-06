import { cn } from "@/lib/utils"

export function DefaultAvatar({ className }) {
  return (
    <div className={cn("flex items-center justify-center overflow-hidden rounded-full bg-muted", className)}>
      <svg viewBox="0 0 24 24" className="h-[80%] w-[80%]" fill="hsl(var(--muted-foreground))" aria-hidden="true">
        <circle cx="12" cy="9" r="3.7" />
        <path d="M5.4 19.6c0-3.7 2.95-6.1 6.6-6.1s6.6 2.4 6.6 6.1z" />
      </svg>
    </div>
  )
}
