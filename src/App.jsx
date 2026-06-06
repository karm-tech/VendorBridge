import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppProviders } from "@/app/providers"
import { AppLayout } from "@/components/layout/AppLayout"
import { RequireAuth } from "@/features/auth/RequireAuth"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { LandingPage } from "@/features/marketing/pages/LandingPage"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { VendorsPage } from "@/features/vendors/pages/VendorsPage"
import { RfqsPage } from "@/features/rfq/pages/RfqsPage"
import { CreateRfqPage } from "@/features/rfq/pages/CreateRfqPage"
import { QuotationsPage } from "@/features/quotations/pages/QuotationsPage"
import { ComparisonPage } from "@/features/quotations/pages/ComparisonPage"
import { ApprovalsPage } from "@/features/approvals/pages/ApprovalsPage"
import { ApprovalDetailPage } from "@/features/approvals/pages/ApprovalDetailPage"
import { PurchaseOrdersPage } from "@/features/purchase-orders/pages/PurchaseOrdersPage"
import { InvoicesPage } from "@/features/invoices/pages/InvoicesPage"
import { InvoiceDetailPage } from "@/features/invoices/pages/InvoiceDetailPage"
import { ReportsPage } from "@/features/reports/pages/ReportsPage"
import { ActivityPage } from "@/features/activity/pages/ActivityPage"

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/rfqs" element={<RfqsPage />} />
              <Route path="/rfqs/new" element={<CreateRfqPage />} />
              <Route path="/quotations" element={<QuotationsPage />} />
              <Route path="/quotations/:rfqId" element={<ComparisonPage />} />
              <Route path="/approvals" element={<ApprovalsPage />} />
              <Route path="/approvals/:quotationId" element={<ApprovalDetailPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/activity" element={<ActivityPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
