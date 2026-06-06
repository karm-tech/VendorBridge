export function notFound(req, res) {
  res.status(404).json({ error: "Route not found" })
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500
  if (status >= 500) console.error(err)
  res.status(status).json({ error: err.message || "Internal server error" })
}
