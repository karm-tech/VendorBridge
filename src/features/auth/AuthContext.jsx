import { createContext, useContext, useEffect, useState } from "react"
import { api, getToken, setToken } from "@/lib/api"
import { can as hasPermission } from "@/constants/roles"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await api("/auth/login", { method: "POST", body: { email, password }, auth: false })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  async function register(payload) {
    const data = await api("/auth/register", { method: "POST", body: payload, auth: false })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  function can(action) {
    return hasPermission(user?.role, action)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
