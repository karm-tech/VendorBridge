import { NavLink } from "react-router-dom"
import { navItems } from "@/constants/nav"
import { Logo } from "@/components/brand/Logo"
import { cn } from "@/lib/utils"

export function SidebarNav({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-muted/60 px-3 py-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">VendorBridge</p>
          <p>Procurement ERP · v1.0</p>
        </div>
      </div>
    </div>
  )
}
