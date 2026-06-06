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
