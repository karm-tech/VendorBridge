import { Link } from "react-router-dom"
import { ShieldCheck, BarChart3, Workflow } from "lucide-react"
import { Logo } from "@/components/brand/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const highlights = [
  { icon: Workflow, text: "End-to-end procurement workflow in one place" },
  { icon: ShieldCheck, text: "Role-based access for officers, vendors & approvers" },
  { icon: BarChart3, text: "Real-time spend analytics and reporting" },
]

export function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Logo light />
        <div className="space-y-6">
          <h1 className="max-w-md text-4xl font-bold leading-tight">
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
        <p className="text-sm text-primary-foreground/70">
          VendorBridge · Procurement & Vendor Management ERP
        </p>
      </div>

      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 lg:hidden">
            <Logo />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your VendorBridge workspace.
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/login" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>
            <Button asChild className="w-full" size="lg">
              <Link to="/dashboard">Sign in</Link>
            </Button>
          </form>

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
