import { CheckCircle2 } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DefaultAvatar } from "@/components/common/DefaultAvatar"
import { useAuth } from "@/features/auth/AuthContext"
import { ROLE_LABELS, ROLE_CAPABILITIES } from "@/constants/roles"

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value || "—"}</p>
    </div>
  )
}

export function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  const name = `${user.firstName} ${user.lastName}`.trim()
  const isDemo = user.email?.endsWith("@vendorbridge.app")

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account details." />

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <DefaultAvatar className="h-16 w-16" />
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">{name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-1.5">
              <Badge>{ROLE_LABELS[user.role] || user.role}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <Field label="First name" value={user.firstName} />
          <Field label="Last name" value={user.lastName} />
          <Field label="Email" value={user.email} />
          <Field label="Role" value={ROLE_LABELS[user.role] || user.role} />
        </div>

        {isDemo && (
          <p className="mt-6 rounded-lg bg-accent px-3 py-2 text-xs text-muted-foreground">
            This is a demo account. Profile editing is disabled in the demo.
          </p>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="font-serif text-lg font-semibold text-foreground">What you can do</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          As a <span className="font-medium text-foreground">{ROLE_LABELS[user.role] || user.role}</span>, your account can:
        </p>
        <ul className="mt-4 space-y-2.5">
          {(ROLE_CAPABILITIES[user.role] || []).map((cap) => (
            <li key={cap} className="flex items-start gap-2.5 text-sm text-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {cap}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
