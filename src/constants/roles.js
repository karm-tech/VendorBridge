export const ROLES = {
  ADMIN: "admin",
  OFFICER: "procurement_officer",
  MANAGER: "manager",
  VENDOR: "vendor",
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.OFFICER]: "Procurement Officer",
  [ROLES.MANAGER]: "Manager / Approver",
  [ROLES.VENDOR]: "Vendor",
}

export const ROLE_OPTIONS = [
  { value: ROLES.OFFICER, label: ROLE_LABELS[ROLES.OFFICER] },
  { value: ROLES.MANAGER, label: ROLE_LABELS[ROLES.MANAGER] },
  { value: ROLES.VENDOR, label: ROLE_LABELS[ROLES.VENDOR] },
  { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
]

export const PERMISSIONS = {
  "rfq:write": [ROLES.OFFICER, ROLES.ADMIN],
  "quotation:submit": [ROLES.VENDOR, ROLES.OFFICER, ROLES.ADMIN],
  "quotation:select": [ROLES.OFFICER, ROLES.ADMIN],
  "approval:decide": [ROLES.MANAGER, ROLES.ADMIN],
  "po:write": [ROLES.OFFICER, ROLES.ADMIN],
  "invoice:write": [ROLES.OFFICER, ROLES.ADMIN],
  "vendor:write": [ROLES.OFFICER, ROLES.ADMIN],
  "vendor:delete": [ROLES.ADMIN],
  "user:manage": [ROLES.ADMIN],
}

export function can(role, action) {
  const allowed = PERMISSIONS[action]
  return Array.isArray(allowed) && allowed.includes(role)
}

export const ROLE_CAPABILITIES = {
  [ROLES.OFFICER]: [
    "Create and edit RFQs",
    "Compare quotations and select vendors",
    "Generate purchase orders",
    "Generate and email invoices",
    "Manage vendor profiles",
  ],
  [ROLES.VENDOR]: [
    "Submit quotations to RFQs",
    "Track RFQ status",
    "View purchase orders",
  ],
  [ROLES.MANAGER]: [
    "Approve or reject procurement requests",
    "Monitor procurement workflows",
    "View reports and analytics",
  ],
  [ROLES.ADMIN]: [
    "Manage users and assign roles",
    "Manage vendor profiles",
    "View procurement analytics",
    "Full access to every module",
  ],
}
