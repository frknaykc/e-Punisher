"use client"

import { Dashboard } from "@/components/dashboard"
import { AuthProvider } from "@/components/auth-provider"

export default function Home() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  )
}
