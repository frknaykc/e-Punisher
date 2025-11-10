"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ThemedCard,
  ThemedCardContent,
  ThemedCardDescription,
  ThemedCardHeader,
  ThemedCardTitle,
} from "@/components/ui/themed-card"
import { Eye, EyeOff, Shield } from "lucide-react"

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-background via-background to-background flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <Image
            src="/world-map-radar.png"
            alt="World Map Radar"
            width={700}
            height={500}
            className="object-contain"
            style={{ filter: "drop-shadow(0 0 20px rgba(220, 38, 38, 0.3))" }}
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(220,38,38,0.04),transparent_50%)]" />

        <div className="relative z-10 text-center space-y-8 px-8 max-w-lg">
          <div className="flex justify-center mb-8 relative">
            <div className="relative group">
              {/* Single hexagon ring */}
              <div className="absolute inset-[-35px]" style={{ animation: "spin 12s linear infinite" }}>
                <svg className="w-full h-full opacity-50" viewBox="0 0 100 100">
                  <polygon
                    points="50,5 85,25 85,65 50,85 15,65 15,25"
                    fill="none"
                    stroke="rgba(220,38,38,0.3)"
                    strokeWidth="0.5"
                    className="drop-shadow-[0_0_6px_rgba(220,38,38,0.4)]"
                  />
                </svg>
              </div>
              {/* Reduced orbital particles */}
              <div className="absolute inset-[-35px] opacity-30" style={{ animation: "spin 10s linear infinite" }}>
                <div className="absolute top-0 left-1/2 w-0.5 h-6 bg-gradient-to-b from-primary to-transparent -translate-x-1/2" />
              </div>
              <div className="absolute inset-[-35px] animate-spin" style={{ animationDuration: "10s" }}>
                <div className="absolute top-0 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2 shadow-[0_0_6px_rgba(220,38,38,0.7)]" />
              </div>
              <div
                className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl animate-pulse"
                style={{ animationDuration: "3s" }}
              />
              <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 via-background to-primary/10 flex items-center justify-center border border-primary/40 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(220,38,38,0.03)_50%)] bg-[length:100%_4px] rounded-2xl" />
                <Image
                  src="/logo.png"
                  alt="ePunisher Logo"
                  width={90}
                  height={90}
                  className="object-contain relative z-10 drop-shadow-[0_0_10px_rgba(220,38,38,0.6)]"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-16">
            <p className="text-3xl font-bold text-foreground tracking-tight">
              Advanced Social Media Management Platform
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Manage multiple accounts, automate operations, and analyze your social media presence with powerful tools
            </p>
            <div className="flex justify-center pt-12">
              <Image
                src="/bestyuztarama.png"
                alt="Face Scanning"
                width={180}
                height={180}
                className="object-contain animate-pulse opacity-40"
                style={{
                  filter: "drop-shadow(0 0 12px rgba(220, 38, 38, 0.4))",
                  animationDuration: "2s",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background p-4 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-[-30px]" style={{ animation: "spin 8s linear infinite" }}>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <polygon
                      points="50,5 85,25 85,65 50,85 15,65 15,25"
                      fill="none"
                      stroke="rgba(220,38,38,0.4)"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
                <div className="absolute inset-[-38px]" style={{ animation: "spin 12s linear infinite reverse" }}>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <polygon
                      points="50,5 85,25 85,65 50,85 15,65 15,25"
                      fill="none"
                      stroke="rgba(220,38,38,0.3)"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
                <div className="absolute inset-[-30px] animate-spin" style={{ animationDuration: "8s" }}>
                  <div className="absolute top-0 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2 shadow-[0_0_8px_rgba(220,38,38,0.9)]">
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping" />
                  </div>
                </div>
                <div
                  className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl animate-pulse"
                  style={{ animationDuration: "3s" }}
                />
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 via-background to-primary/10 flex items-center justify-center border border-primary/40 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(220,38,38,0.03)_50%)] bg-[length:100%_4px] rounded-2xl" />
                  <Image
                    src="/logo.png"
                    alt="ePunisher Logo"
                    width={70}
                    height={70}
                    className="object-contain relative z-10 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                  />
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">Social Media Management Platform</p>
          </div>

          <ThemedCard>
            <ThemedCardHeader>
              <ThemedCardTitle className="text-2xl text-center">Welcome Back</ThemedCardTitle>
              <ThemedCardDescription className="text-center">
                Enter your credentials to access your account
              </ThemedCardDescription>
            </ThemedCardHeader>
            <ThemedCardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@epunisher.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 text-base">
                  Sign In
                </Button>
                <div className="text-center space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Don't have an account?</span>
                    </div>
                  </div>
                  <Button type="button" variant="outline" className="w-full h-11 text-base bg-transparent">
                    Sign Up
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
                  <Shield className="w-4 h-4" />
                  <span>Secured with end-to-end encryption</span>
                </div>
              </form>
            </ThemedCardContent>
          </ThemedCard>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Button variant="link" className="h-auto p-0 text-xs">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="h-auto p-0 text-xs">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
