import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/features/auth/AuthContext"
import { AccessDenied } from "@/features/auth/AccessDenied"

export function RequireRole({ roles }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <AccessDenied roles={roles} />

  return <Outlet />
}
