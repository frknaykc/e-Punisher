"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { LoginScreen } from "./login-screen"

interface AuthContextType {
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem("epunisher_auth")
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    localStorage.setItem("epunisher_auth", "authenticated")
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("epunisher_auth")
    setIsAuthenticated(false)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Show main app if authenticated
  return <AuthContext.Provider value={{ logout: handleLogout }}>{children}</AuthContext.Provider>
}
