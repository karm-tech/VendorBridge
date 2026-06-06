import { Badge } from "@/components/ui/badge"

const STATUS_VARIANTS = {
  active: "success",
  approved: "success",
  paid: "success",
  completed: "success",
  selected: "success",
  awarded: "success",
  open: "default",
  responded: "default",
  issued: "default",
  submitted: "default",
  pending: "warning",
  awaiting: "warning",
  invited: "warning",
  draft: "muted",
  rejected: "destructive",
  blocked: "destructive",
  overdue: "destructive",
}

const STATUS_LABELS = {
  pending: "Pending",
  awaiting: "Awaiting",
}

export function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase()
  const variant = STATUS_VARIANTS[key] || "secondary"
  const label =
    STATUS_LABELS[key] || (key ? key.charAt(0).toUpperCase() + key.slice(1) : "—")
  return <Badge variant={variant}>{label}</Badge>
}
