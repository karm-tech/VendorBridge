import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ShieldCheck, BarChart3, Workflow, Sparkles, Loader2, AlertCircle } from "lucide-react"
import { Logo } from "@/components/brand/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/AuthContext"
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/features/auth/demo"

const highlights = [
  { icon: Workflow, text: "End-to-end procurement workflow in one place" },
  { icon: ShieldCheck, text: "Role-based access for officers, vendors & approvers" },
  { icon: BarChart3, text: "Real-time spend analytics and reporting" },
]

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState("")
  const [demoLoading, setDemoLoading] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } })

  if (user) return <Navigate to="/dashboard" replace />
  const from = location.state?.from || "/dashboard"

  async function onSubmit(values) {
    setFormError("")
    try {
      await login(values.email, values.password)
      navigate(from, { replace: true })
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function demoLogin(email) {
    setFormError("")
    setDemoLoading(email)
    try {
      await login(email, DEMO_PASSWORD)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setFormError(err.message)
      setDemoLoading("")
    }
  }

  const anyDemoLoading = Boolean(demoLoading)

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{
          backgroundColor: "#4F46E5",
          backgroundImage:
            "radial-gradient(at 80% 0%, rgba(129,140,248,0.6), transparent 50%), radial-gradient(at 0% 100%, rgba(99,102,241,0.55), transparent 45%), linear-gradient(135deg,#4338CA,#4F46E5)",
        }}
      >
        <Logo light />
        <div className="space-y-6">
          <h1 className="max-w-md font-serif text-[40px] font-semibold leading-[1.1]">
            Procurement, simplified from RFQ to invoice.
          </h1>
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-primary-foreground/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/65">VendorBridge · Procurement &amp; Vendor Management ERP</p>
      </div>

      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm space-y-7">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to your VendorBridge workspace.</p>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/login" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || anyDemoLoading}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="space-y-3">
            <div className="relative flex items-center">
              <div className="h-px flex-1 bg-border" />
              <span className="px-3 text-center text-xs text-muted-foreground">or open a demo account</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => demoLogin(acc.email)}
                  disabled={anyDemoLoading || isSubmitting}
                  className="flex flex-col items-start gap-0.5 rounded-xl border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent disabled:opacity-60"
                >
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {demoLoading === acc.email ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    )}
                    {acc.role}
                  </span>
                  <span className="text-[11px] leading-tight text-muted-foreground">{acc.desc}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              These are <span className="font-medium text-foreground">demo accounts</span> preloaded with sample data — nothing here affects a real system. One click, no signup. Admin sees everything.
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            New to VendorBridge?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
