# VendorBridge — Setup & Run Guide

A full-stack ERP that runs **entirely on your machine** — React frontend, an Express REST API, and a **local SQLite database** (no database server to install, works offline).

## 1. Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 18 (tested on 22.9) | https://nodejs.org |
| npm | ≥ 9 | ships with Node.js |
| A modern browser | — | Chrome, Edge or Firefox |

> No database to install — **SQLite is bundled** and created automatically with seed data.

## 2. Install & run

```bash
git clone https://github.com/karm-tech/VendorBridge.git
cd VendorBridge
npm install        # installs frontend + backend deps and seeds the local database
npm run dev        # runs the API and the web app together
```

Open **http://localhost:5173** and use the **1-click role logins** (Procurement Officer, Vendor, Manager, Admin).

## 3. Production build (optional)

```bash
npm run build
npm run preview
```

## Architecture

```
React (Vite)  ──HTTP──►  Express REST API  ──►  Prisma ORM  ──►  SQLite (local file)
      ▲                        │
      └────── Socket.io ───────┘   (real-time updates)
```

- **Frontend** calls the API through a Vite dev proxy (no CORS hassle).
- **Backend** exposes REST endpoints for vendors, RFQs, quotations, approvals, purchase orders, invoices and auth.
- **Auth** is JWT-based with role checks on protected routes.
- **Real-time** updates (new quotations, approvals) are pushed over Socket.io.

## Optional — real outgoing email

Invoice emailing is **simulated by default**. To send real emails, add SMTP credentials in `server/.env` (see `.env.example`).

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run backend API + frontend together |
| `npm run build` | Build the optimized production bundle |
| `npm run preview` | Preview the production build locally |

## Tech stack

React + Vite · Tailwind CSS + shadcn/ui · Express · Prisma + SQLite · Socket.io · JWT · TanStack Query · React Hook Form + Zod · Recharts · Framer Motion · `@react-pdf/renderer`.

## Project structure

```
VendorBridge/
├─ src/                 frontend (React)
│  ├─ app/  components/  features/  constants/  lib/
├─ server/              backend (Express + Prisma)
│  ├─ src/ routes/ controllers/ middleware/ lib/
│  └─ prisma/ schema.prisma  seed.js
└─ package.json         root scripts (run both together)
```
