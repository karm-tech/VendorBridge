import { Info } from "lucide-react"
import { useAuth } from "@/features/auth/AuthContext"
import { ROLE_LABELS } from "@/constants/roles"

export function DemoBanner() {
  const { user } = useAuth()
  if (!user || !user.email?.endsWith("@vendorbridge.app")) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground print:hidden">
      <Info className="h-3.5 w-3.5" />
      <span>
        Demo mode — signed in as <strong>{ROLE_LABELS[user.role] || user.role}</strong>.
      </span>
      <span className="text-primary-foreground/80">Sample data only; nothing here affects a real system.</span>
    </div>
  )
}
