export function scoreQuotations(quotations) {
  if (!quotations || quotations.length === 0) return []

  const totals = quotations.map((q) => q.total)
  const deliveries = quotations.map((q) => q.deliveryDays || 0).filter((d) => d > 0)
  const minTotal = Math.min(...totals)
  const maxTotal = Math.max(...totals)
  const minDelivery = deliveries.length ? Math.min(...deliveries) : 0

  const scored = quotations.map((q) => {
    const priceScore = q.total ? minTotal / q.total : 0
    const deliveryScore = q.deliveryDays && minDelivery ? minDelivery / q.deliveryDays : 1
    const ratingScore = (q.vendor?.rating || 0) / 5
    const score = priceScore * 0.6 + deliveryScore * 0.25 + ratingScore * 0.15
    return { ...q, score, savings: maxTotal - q.total }
  })

  const best = scored.reduce((a, b) => (b.score > a.score ? b : a))
  return scored.map((q) => ({ ...q, recommended: q.id === best.id }))
}
