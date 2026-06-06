const STAGE_NAMES = { 1: "Procurement Lead", 2: "Finance Approval" }

export function stageName(stage) {
  return STAGE_NAMES[stage] || `Stage ${stage}`
}
