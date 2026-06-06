import {
  LayoutDashboard,
  Building2,
  FileText,
  ScrollText,
  ClipboardCheck,
  ShoppingCart,
  Receipt,
  BarChart3,
  Activity,
  Mail,
  Users,
} from "lucide-react"
import { ROLES } from "@/constants/roles"

const STAFF = [ROLES.OFFICER, ROLES.MANAGER, ROLES.ADMIN]
const OFFICE = [ROLES.OFFICER, ROLES.ADMIN]

export const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Vendors", to: "/vendors", icon: Building2, roles: STAFF },
  { label: "RFQs", to: "/rfqs", icon: FileText },
  { label: "Quotations", to: "/quotations", icon: ScrollText },
  { label: "Approvals", to: "/approvals", icon: ClipboardCheck, roles: STAFF },
  { label: "Purchase Orders", to: "/purchase-orders", icon: ShoppingCart },
  { label: "Invoices", to: "/invoices", icon: Receipt, roles: STAFF },
  { label: "Reports", to: "/reports", icon: BarChart3, roles: STAFF },
  { label: "Sent Emails", to: "/emails", icon: Mail, roles: OFFICE },
  { label: "Activity", to: "/activity", icon: Activity, roles: STAFF },
  { label: "Users", to: "/users", icon: Users, roles: [ROLES.ADMIN] },
]
