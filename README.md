# VendorBridge

> **A role-based Procurement & Vendor Management ERP** that digitizes the full vendor lifecycle:
> **RFQs → Quotation Comparison → Approvals → Purchase Orders → PDF/Email Invoicing**, with real-time analytics.

VendorBridge simplifies and digitizes procurement operations for organizations through a centralized
platform that manages vendors, RFQs, quotations, approvals, purchase orders, and invoice generation —
reducing manual procurement inefficiencies with structured workflows and real-time tracking.

---

## ✨ Key Features

- **🔐 Authentication & Roles** — Email/password login, signup, forgot password, session handling, and role-based access.
- **📊 Dashboard** — Pending approvals, active RFQs, recent POs & invoices, analytics cards, and quick actions.
- **🏢 Vendor Management** — Registration, status tracking, categories, GST & contact details, search & filtering.
- **📝 RFQ Creation** — Title, product/service details, quantity, attachments, deadlines, and vendor assignment.
- **💬 Quotation Submission** — Vendors submit pricing, delivery timelines, notes, and editable quotations.
- **⚖️ Quotation Comparison** — Side-by-side comparison, lowest-price highlighting, delivery & vendor-rating indicators.
- **✅ Approval Workflow** — Approve/reject with remarks, approval timeline, status tracking, and state transitions.
- **🧾 Purchase Orders & Invoices** — Auto-generated PO numbers, tax & total calculations, PDF download, print, and email.
- **🔔 Activity Logs & Notifications** — RFQ/approval/invoice alerts, activity timeline, and audit logs.
- **📈 Reports & Analytics** — Vendor performance, procurement statistics, spending summaries, and monthly trends.

---

## 👥 User Roles

| Role | Capabilities |
|------|--------------|
| **Procurement Officer** | Create RFQs, compare quotations, generate purchase orders & invoices |
| **Vendor** | Submit quotations, track RFQ status, view purchase orders |
| **Manager / Approver** | Approve or reject procurement requests, monitor workflows |
| **Admin** | Manage users & vendors, view procurement analytics |

---

## 🔄 Procurement Workflow

```
1. Procurement Officer creates an RFQ
2. Vendors receive invitations and submit quotations
3. Procurement team compares quotations
4. Approval workflow is initiated
5. Approved quotations generate Purchase Orders
6. Invoice is generated from the Purchase Order
7. Invoice is printed or emailed directly
8. Activities tracked through logs and analytics
```

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite · Tailwind CSS + shadcn/ui · React Router · TanStack Query · React Hook Form + Zod · Recharts · Framer Motion
- **Backend:** Node.js + Express REST API
- **Database:** SQLite (local, no install) via Prisma ORM
- **Auth:** JWT + bcrypt, role-based access (4 roles)
- **Real-time:** Socket.io
- **Invoices:** `@react-pdf/renderer` (PDF) · Nodemailer (email)

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/karm-tech/VendorBridge.git
cd VendorBridge

# 2. Install dependencies (also creates & seeds the local SQLite database)
npm install

# 3. Run the app (Express API + React frontend together)
npm run dev
```

Open **http://localhost:5173** and sign in with the **1-click demo logins**. No database server or cloud account needed — everything runs locally. See [docs/SETUP.md](docs/SETUP.md) for details.

---

## 📁 Project Structure

```
VendorBridge/
├── src/         # React frontend (features, components, lib)
├── server/      # Express + Prisma backend (routes, prisma/schema)
├── docs/        # Documentation
└── README.md
```

---

## 🎨 Mockups

Design reference: [Excalidraw Mockup](https://app.excalidraw.com/l/65VNwvy7c4X/5ywnm0v3qhK)

---

## 👨‍💻 Team

> _Add team members here._

---

## 📄 License

> _Add a license (e.g. MIT) if applicable._

---

<p align="center"><i>Built for the Odoo Hackathon 🚀</i></p>
