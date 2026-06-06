import { useState } from "react"
import { Outlet } from "react-router-dom"
import { SidebarNav } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { DemoBanner } from "@/components/layout/DemoBanner"
import { useRealtime } from "@/lib/realtime"

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  useRealtime()

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border lg:block print:hidden">
        <SidebarNav />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-border shadow-elevated animate-in slide-in-from-left duration-200">
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64 print:pl-0">
        <DemoBanner />
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
