import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/AuthContext"
import { Spinner } from "@/components/common/Spinner"

export function RequireAuth() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="h-7 w-7" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
