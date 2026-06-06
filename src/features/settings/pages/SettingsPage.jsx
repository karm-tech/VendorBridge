import { useState } from "react"
import { Sun, Moon } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  )
}

function Row({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function setTheme(dark) {
  document.documentElement.classList.toggle("dark", dark)
  localStorage.setItem("vb_theme", dark ? "dark" : "light")
}

export function SettingsPage() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"))
  const [emailApprovals, setEmailApprovals] = useState(true)
  const [rfqUpdates, setRfqUpdates] = useState(true)
  const [invoiceAlerts, setInvoiceAlerts] = useState(false)

  function toggleTheme(value) {
    setDark(value)
    setTheme(value)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your preferences." />

      <Card className="p-6">
        <h2 className="mb-2 font-serif text-lg font-semibold text-foreground">Appearance</h2>
        <Row title="Theme" description="Switch between light and dark mode.">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sun className="h-4 w-4" />
            <Toggle checked={dark} onChange={toggleTheme} />
            <Moon className="h-4 w-4" />
          </div>
        </Row>
      </Card>

      <Card className="p-6">
        <h2 className="mb-2 font-serif text-lg font-semibold text-foreground">Notifications</h2>
        <Row title="Approval requests" description="Get notified when an approval needs your decision.">
          <Toggle checked={emailApprovals} onChange={setEmailApprovals} />
        </Row>
        <Row title="RFQ updates" description="Notify me about new quotations on my RFQs.">
          <Toggle checked={rfqUpdates} onChange={setRfqUpdates} />
        </Row>
        <Row title="Invoice alerts" description="Alert me about due and overdue invoices.">
          <Toggle checked={invoiceAlerts} onChange={setInvoiceAlerts} />
        </Row>
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">About</h2>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">VendorBridge</span> — Procurement &amp; Vendor Management ERP</p>
          <p>Version 3.0.0</p>
          <p>React · Vite · Express · Prisma · SQLite</p>
          <p>Built by <span className="font-medium text-foreground">Karm Chauhan</span></p>
        </div>
      </Card>
    </div>
  )
}
