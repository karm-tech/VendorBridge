import { Lock } from "lucide-react"
import { ROLE_LABELS } from "@/constants/roles"

export function AccessDenied({ roles = [] }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Lock className="h-7 w-7 text-muted-foreground" />
      </div>
      <h1 className="mt-5 font-serif text-2xl font-semibold text-foreground">You don't have access</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Your role doesn't have permission to open this page. Sign in with an account that has the right role to continue.
      </p>
      {roles.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Available to</span>
          {roles.map((r) => (
            <span key={r} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {ROLE_LABELS[r] || r}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
