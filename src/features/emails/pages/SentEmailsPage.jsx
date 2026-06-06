import { useEffect, useState } from "react"
import { Mail, Inbox, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatDateTime } from "@/lib/utils"
import { useEmails } from "@/features/emails/hooks"

const STATUS = {
  sent: { label: "Delivered", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700" },
  simulated: { label: "Demo", icon: Clock, className: "bg-amber-100 text-amber-700" },
  failed: { label: "Failed", icon: AlertCircle, className: "bg-destructive/10 text-destructive" },
}

function StatusPill({ status }) {
  const cfg = STATUS[status] || STATUS.simulated
  const Icon = cfg.icon
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", cfg.className)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  )
}

function statusNote(status) {
  if (status === "sent") return "Delivered via SMTP."
  if (status === "failed") return "Delivery failed — check SMTP settings."
  return "Demo mode — captured locally, not actually delivered."
}

export function SentEmailsPage() {
  const { data: emails, isLoading } = useEmails()
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (!selectedId && emails && emails.length > 0) setSelectedId(emails[0].id)
  }, [emails, selectedId])

  const selected = emails?.find((e) => e.id === selectedId) || null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sent Emails"
        description="Every message VendorBridge has sent. In demo mode they are captured here locally — nothing leaves your machine."
      />

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <Card className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </Card>
          <Card className="p-6">
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
      ) : !emails || emails.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={Inbox}
            title="No emails yet"
            description="When you email an invoice, a copy is captured here."
            className="border-0 bg-transparent"
          />
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <Card className="overflow-hidden p-0">
            <ul className="divide-y divide-border">
              {emails.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => setSelectedId(e.id)}
                    className={cn(
                      "flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors hover:bg-accent",
                      e.id === selectedId && "bg-accent"
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{e.subject}</span>
                      <StatusPill status={e.status} />
                    </div>
                    <span className="w-full truncate text-xs text-muted-foreground">To {e.to}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(e.createdAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            {selected ? (
              <div className="space-y-4">
                <div className="space-y-1.5 border-b border-border pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-serif text-xl font-semibold text-foreground">{selected.subject}</h2>
                    <StatusPill status={selected.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    To <span className="text-foreground">{selected.to}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(selected.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  {statusNote(selected.status)}
                </div>
                <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">{selected.body}</pre>
              </div>
            ) : (
              <EmptyState
                icon={Mail}
                title="Select an email"
                description="Choose a message from the list to read it."
                className="border-0 bg-transparent"
              />
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
