"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { SettingsContent } from "@/components/settings/settings-content"
import { TwitterActions } from "@/components/twitter-actions"
import { AccountDrawer } from "@/components/account-drawer"
import { HomeOverview } from "@/components/home-overview"
import { AccountManagement } from "@/components/account-management"
import { ESentinel } from "@/components/e-sentinel"
import { Cases } from "@/components/cases"
import { Projects } from "@/components/projects"
import { CalendarPlanning } from "@/components/calendar-planning"
import { Playground } from "@/components/playground"
import { Booster } from "@/components/booster"
import { Attack } from "@/components/attack"
import { EMiner } from "@/components/e-miner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search } from "lucide-react"
import { ImpactLevelConfig } from "@/components/settings/impact-level-config"
import { useAuth } from "@/components/auth-provider"

export type Platform = "twitter" | "instagram" | "linkedin" | "google" | "tiktok" | "facebook"

export function Dashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState<
    | Platform
    | "home"
    | "accounts"
    | "sentinel"
    | "cases"
    | "projects"
    | "calendar"
    | "playground"
    | "booster"
    | "attack"
    | "e-miner"
    | "configuration"
  >("home")
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState<string>("demo-data")
  const [searchQuery, setSearchQuery] = useState("")
  const [demoMode, setDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("demoMode")
      return saved !== null ? JSON.parse(saved) : true
    }
    return true
  })
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const { logout } = useAuth()

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("demoMode", JSON.stringify(demoMode))
    }
  }, [demoMode])

  const handleDemoModeChange = (enabled: boolean) => {
    setDemoMode(enabled)
  }

  const getPageInfo = () => {
    if (isSettingsOpen) {
      return { title: "Settings", description: "Configure your application preferences and options" }
    }

    switch (selectedPlatform) {
      case "home":
        return { title: "Dashboard Overview", description: "Monitor all your social media activities" }
      case "calendar":
        return { title: "Calendar & Planning", description: "Schedule and plan your content strategy" }
      case "playground":
        return { title: "Playground", description: "Test and experiment with social media strategies" }
      case "booster":
        return { title: "Booster", description: "Amplify your social media presence and engagement" }
      case "sentinel":
        return { title: "e-Sentinel Monitoring", description: "Monitor keywords, hashtags, and users across platforms" }
      case "attack":
        return { title: "Attack Operations", description: "Strategic offensive social media operations" }
      case "e-miner":
        return { title: "e-Miner", description: "API, Docs and Playground - all in one place" }
      case "cases":
        return { title: "Cases Management", description: "Track and manage project requests, tasks, and assignments" }
      case "projects":
        return { title: "Projects Overview", description: "View active projects, progress, and completed work" }
      case "accounts":
        return { title: "Account Management", description: "Manage all your connected social media accounts" }
      case "configuration":
        return { title: "Configuration", description: "Configure impact levels and operation parameters" }
      default:
        return {
          title: `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} Management`,
          description: `Manage your ${selectedPlatform} accounts and actions`,
        }
    }
  }

  const pageInfo = getPageInfo()
  const isPlatformView =
    selectedPlatform !== "home" &&
    selectedPlatform !== "accounts" &&
    selectedPlatform !== "sentinel" &&
    selectedPlatform !== "cases" &&
    selectedPlatform !== "projects" &&
    selectedPlatform !== "calendar" &&
    selectedPlatform !== "playground" &&
    selectedPlatform !== "booster" &&
    selectedPlatform !== "attack" &&
    selectedPlatform !== "configuration"

  const mainContentMargin = isSettingsOpen ? "16rem" : "0"

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        selectedPlatform={selectedPlatform}
        onSelectPlatform={setSelectedPlatform}
        onSettingsClick={() => setIsSettingsOpen(!isSettingsOpen)}
        onLogout={logout}
        isExpanded={isSidebarExpanded}
        onExpandedChange={setIsSidebarExpanded}
      />

      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        mainSidebarExpanded={isSidebarExpanded}
        selectedSetting={selectedSetting}
        onSelectSetting={setSelectedSetting}
      />

      <main className="flex-1 overflow-auto transition-all duration-300" style={{ marginLeft: mainContentMargin }}>
        <header className="sticky top-0 z-10 border-b border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 h-16 shadow-sm">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts, actions, or platforms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-border/50 bg-background/50 focus:border-primary focus:glow-red-sm smooth-transition"
                />
              </div>
            </div>
            {isPlatformView && (
              <Button
                onClick={() => setIsDrawerOpen(true)}
                variant="outline"
                className="gap-2 hover-glow-red border-border/50 bg-background/50 smooth-transition"
              >
                <Users className="h-4 w-4" />
                Select Accounts ({selectedAccounts.length})
              </Button>
            )}
          </div>
        </header>

        <div className="container mx-auto p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{pageInfo.title}</h1>
            <p className="text-muted-foreground text-base leading-relaxed">{pageInfo.description}</p>
          </div>

          {isSettingsOpen ? (
            <SettingsContent
              selectedSetting={selectedSetting}
              demoMode={demoMode}
              onDemoModeChange={handleDemoModeChange}
            />
          ) : (
            <>
              {selectedPlatform === "home" && <HomeOverview demoMode={demoMode} />}
              {selectedPlatform === "calendar" && <CalendarPlanning demoMode={demoMode} />}
              {selectedPlatform === "playground" && <Playground demoMode={demoMode} />}
              {selectedPlatform === "booster" && <Booster demoMode={demoMode} />}
              {selectedPlatform === "sentinel" && <ESentinel demoMode={demoMode} />}
              {selectedPlatform === "attack" && <Attack demoMode={demoMode} />}
              {selectedPlatform === "e-miner" && <EMiner demoMode={demoMode} />}
              {selectedPlatform === "cases" && <Cases demoMode={demoMode} />}
              {selectedPlatform === "projects" && <Projects demoMode={demoMode} />}
              {selectedPlatform === "accounts" && <AccountManagement searchQuery={searchQuery} demoMode={demoMode} />}
              {selectedPlatform === "configuration" && <ImpactLevelConfig />}
              {selectedPlatform === "twitter" && (
                <TwitterActions selectedAccounts={selectedAccounts} demoMode={demoMode} />
              )}

              {isPlatformView && selectedPlatform !== "twitter" && (
                <div className="flex items-center justify-center h-64 border border-dashed border-border/50 rounded-xl bg-card/30 backdrop-blur-sm">
                  <p className="text-muted-foreground text-lg">
                    {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} actions coming soon...
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {isPlatformView && (
        <AccountDrawer
          platform={selectedPlatform}
          selectedAccounts={selectedAccounts}
          onAccountsChange={setSelectedAccounts}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  )
}
