# VendorBridge — User Guide

A walkthrough for first-time users. VendorBridge takes a purchase from a vendor all the way to a paid GST invoice.

---

## 1. Getting started

1. Open the app. On the landing page, click **"Open the live demo"** (or go to **Login** and click **"Click here to open the demo"**).
2. You are signed in instantly with sample data — no signup needed.
3. To sign in as a specific role, use these accounts (password `demo1234`):

| Role | Email | Can do |
|------|-------|--------|
| Procurement Officer | officer@vendorbridge.app | Create RFQs, compare quotations, generate POs & invoices |
| Manager / Approver | manager@vendorbridge.app | Approve or reject quotations |
| Vendor | vendor@vendorbridge.app | Submit quotations, track RFQs |
| Admin | admin@vendorbridge.app | Manage users & vendors, view analytics |

---

## 2. The workflow at a glance

```
 Vendor ──▶ RFQ ──▶ Quotations ──▶ Compare & Select ──▶ Approve ──▶ Purchase Order ──▶ Invoice
            (invite      (vendors        (best-quote        (multi-      (auto PO#)       (GST, PDF,
            vendors)     submit)         scoring)           stage)                        print, email)
```

Each step unlocks the next. The most important rule: **a quotation must be _approved_ before you can generate a Purchase Order — selecting it is not enough.**

---

## 3. Step-by-step

### Step 1 — Add a vendor (optional; samples already exist)
- **Vendors** in the sidebar → **Add Vendor** → fill name, category, GST, contact → **Add vendor**.
- You can search and filter by status. Click any row to view details.

### Step 2 — Create an RFQ
- **RFQs** → **Create RFQ**.
- Enter a title, category and deadline; add **line items** (item, quantity, unit); tick the **vendors** to invite.
- **Send to Vendors** (or **Save as Draft**).
- Tip: click an RFQ row to open its detail view. You can **Edit** an RFQ until a quotation is confirmed.

### Step 3 — Receive / submit quotations
- **Quotations** → click the RFQ row to open its comparison view.
- Click **Submit quotation** → choose a vendor, enter a unit price for each line item, delivery days and terms → **Submit**.
- Submit a few (from different vendors) so there is something to compare.

### Step 4 — Compare and select
- On the comparison screen, quotations are shown side by side (total, GST, delivery, rating, match score).
- The **Recommended** quotation is highlighted with a savings note.
- Click **Select** on your chosen quotation. This starts the approval workflow (and locks the RFQ).

### Step 5 — Approve
- **Approvals** → **Review** the RFQ.
- Approve each stage (**Procurement Lead**, then **Finance Approval**), adding remarks if you like. You can also **Reject**.
- Once all stages are approved, the quotation status becomes **approved**.

### Step 6 — Generate the Purchase Order
- **Purchase Orders** → the **Generate PO** box at the top lists approved quotations → select it → **Generate PO**.
- An auto-numbered PO is created.

### Step 7 — Generate and send the Invoice
- On the PO row → **Create invoice** (auto-numbered, with CGST + SGST).
- On the invoice → **Download PDF**, **Print**, **Email**, or **Mark as Paid**.

### Step 8 — Track everything
- **Dashboard** — live KPIs, spend trend, recent POs and top vendors.
- **Reports** — spend by category, monthly trend, top vendors, and **Export CSV**.
- **Activity** — a filterable audit trail of every action.

---

## 4. Screen reference

| Screen | What it's for |
|--------|---------------|
| Dashboard | Live overview: KPIs, charts, recent POs, top vendors |
| Vendors | Manage supplier profiles (GST, category, status) |
| RFQs | Create and track requests for quotation |
| Quotations | Submit and compare vendor quotations |
| Approvals | Approve or reject selected quotations |
| Purchase Orders | Generate POs from approved quotations |
| Invoices | GST invoices with PDF, print, email |
| Reports | Analytics and CSV export |
| Activity | Audit trail of all actions |

---

## 5. Tips and gotchas

- **Selected is not approved.** After you select a quotation, approve it in **Approvals** before it appears under **Generate PO**.
- **RFQs lock after a quotation is confirmed.** Edit an RFQ only while it is *open* or *draft*.
- **Real-time:** the app updates live — submit a quotation in one place and lists/dashboard refresh automatically.
- **Search & filter** are available on the Vendors list; status filters help narrow long lists.
- **Demo data resets** to a clean state if the database is re-seeded.

---

## 6. Running it locally

See [SETUP.md](SETUP.md) — clone, `npm install`, `npm run dev`. No database server needed (SQLite is bundled).
