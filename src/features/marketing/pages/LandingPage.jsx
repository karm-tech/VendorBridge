import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Building2,
  FileText,
  ScrollText,
  ClipboardCheck,
  ShoppingCart,
  Receipt,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { Logo } from "@/components/brand/Logo"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/AuthContext"
import { DEMO_PRIMARY, DEMO_PASSWORD } from "@/features/auth/demo"

const features = [
  { icon: Building2, title: "Vendor Management", desc: "Supplier profiles with GST, categories and status." },
  { icon: FileText, title: "RFQs", desc: "Multi-step requests with line items and vendor invites." },
  { icon: ScrollText, title: "Smart Comparison", desc: "Best-quote scoring with savings insights." },
  { icon: ClipboardCheck, title: "Approvals", desc: "Multi-stage workflow with a full audit trail." },
  { icon: ShoppingCart, title: "Purchase Orders", desc: "Auto-generated from approved quotations." },
  { icon: Receipt, title: "GST Invoices", desc: "CGST/SGST invoices with PDF, print and email." },
]

const workflow = ["Vendor", "RFQ", "Quotation", "Compare", "Approve", "PO", "Invoice"]

export function LandingPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  async function openDemo() {
    setLoading(true)
    try {
      await login(DEMO_PRIMARY.email, DEMO_PASSWORD)
      navigate("/dashboard")
    } catch {
      navigate("/login")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button onClick={openDemo} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Live demo
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96"
          style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(79,70,229,0.10), transparent 70%)" }}
        />
        <div className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Procurement &amp; Vendor Management ERP
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
              Procurement, simplified from <span className="text-primary">RFQ to invoice</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
              Manage vendors, run RFQs, compare quotations, approve, and issue GST invoices — all in one fast,
              role-based platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={openDemo} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Open the live demo <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs">
              {workflow.map((w, i) => (
                <span key={w} className="flex items-center gap-2">
                  <span className="rounded-full bg-accent px-3 py-1 font-medium text-primary">{w}</span>
                  {i < workflow.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div
          className="overflow-hidden rounded-3xl p-10 text-center text-white"
          style={{
            backgroundColor: "#4F46E5",
            backgroundImage:
              "radial-gradient(at 80% 0%, rgba(129,140,248,0.6), transparent 50%), linear-gradient(135deg,#4338CA,#4F46E5)",
          }}
        >
          <h2 className="font-serif text-3xl font-semibold">See the full workflow in action</h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">
            Open the demo — no signup needed. Pre-loaded with sample vendors, RFQs, approvals and invoices.
          </p>
          <Button size="lg" variant="secondary" className="mt-6" onClick={openDemo} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-primary" />}
            Open the live demo
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        VendorBridge · Procurement &amp; Vendor Management ERP
      </footer>
    </div>
  )
}
