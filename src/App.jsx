import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppProviders } from "@/app/providers"
import { AppLayout } from "@/components/layout/AppLayout"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { VendorsPage } from "@/features/vendors/pages/VendorsPage"
import { RfqsPage } from "@/features/rfq/pages/RfqsPage"
import { QuotationsPage } from "@/features/quotations/pages/QuotationsPage"
import { ApprovalsPage } from "@/features/approvals/pages/ApprovalsPage"
import { PurchaseOrdersPage } from "@/features/purchase-orders/pages/PurchaseOrdersPage"
import { InvoicesPage } from "@/features/invoices/pages/InvoicesPage"
import { ReportsPage } from "@/features/reports/pages/ReportsPage"
import { ActivityPage } from "@/features/activity/pages/ActivityPage"

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/rfqs" element={<RfqsPage />} />
            <Route path="/quotations" element={<QuotationsPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/activity" element={<ActivityPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
