import { Menu, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { initials } from "@/lib/utils"
import { ROLE_LABELS, ROLES } from "@/constants/roles"

const currentUser = {
  name: "Procurement Officer",
  email: "officer@vendorbridge.app",
  role: ROLES.OFFICER,
}

export function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search vendors, RFQs, invoices..."
          className="h-9 w-full rounded-md border border-input bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring focus:bg-background"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-1 pr-2.5 transition-colors hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:block">{currentUser.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="font-semibold text-foreground">{currentUser.name}</div>
              <div className="font-normal text-muted-foreground">
                {ROLE_LABELS[currentUser.role]}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
