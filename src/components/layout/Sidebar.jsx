import { NavLink } from "react-router-dom"
import { Lock } from "lucide-react"
import { navItems } from "@/constants/nav"
import { Logo } from "@/components/brand/Logo"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/AuthContext"

export function SidebarNav({ onNavigate }) {
  const { user } = useAuth()

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const locked = item.roles && user && !item.roles.includes(user.role)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <item.icon className="h-[18px] w-[18px]" />
                  <span className="flex-1">{item.label}</span>
                  {locked && <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
