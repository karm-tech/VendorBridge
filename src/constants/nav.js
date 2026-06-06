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
} from "lucide-react"

export const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Vendors", to: "/vendors", icon: Building2 },
  { label: "RFQs", to: "/rfqs", icon: FileText },
  { label: "Quotations", to: "/quotations", icon: ScrollText },
  { label: "Approvals", to: "/approvals", icon: ClipboardCheck },
  { label: "Purchase Orders", to: "/purchase-orders", icon: ShoppingCart },
  { label: "Invoices", to: "/invoices", icon: Receipt },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Activity", to: "/activity", icon: Activity },
]
