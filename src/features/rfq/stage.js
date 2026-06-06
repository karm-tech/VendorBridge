export const PIPELINE_STAGES = ["RFQ", "Quotation", "Approval", "Purchase Order", "Invoice", "Done"]

export function rfqStage(rfq) {
  let stage = 0
  if (rfq.quotations?.length > 0) stage = 1
  const selected = rfq.quotations?.find((q) => q.status === "selected" || q.status === "approved")
  if (selected) stage = 2
  const po = selected?.purchaseOrder
  if (po) stage = 3
  const invoice = po?.invoice
  if (invoice) stage = 4
  if (invoice?.status === "paid") stage = 5
  return stage
}

export function quotationStage(quotation) {
  let stage = 2
  const po = quotation?.purchaseOrder
  if (po) stage = 3
  const invoice = po?.invoice
  if (invoice) stage = 4
  if (invoice?.status === "paid") stage = 5
  return stage
}

export function invoiceStage(invoice) {
  return invoice?.status === "paid" ? 5 : 4
}
