"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  Briefcase,
  FolderKanban,
  Calendar,
  Zap,
  Rocket,
  Target,
  ChevronDown,
  ChevronUp,
  Sliders,
  Database,
} from "lucide-react"
import type { Platform } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

interface SidebarProps {
  selectedPlatform:
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
    | "configuration" // Added configuration to type
  onSelectPlatform: (
    platform:
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
      | "configuration", // Added configuration to type
  ) => void
  onSettingsClick: () => void
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

export function Sidebar({
  selectedPlatform,
  onSelectPlatform,
  onSettingsClick,
  isExpanded,
  onExpandedChange,
}: SidebarProps) {
  const [isManagementOpen, setIsManagementOpen] = useState(true)

  return (
    <aside
      className={cn(
        "border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-all duration-300 relative flex-shrink-0",
        isExpanded ? "w-64" : "w-16",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onExpandedChange(!isExpanded)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-lg hover:bg-sidebar-accent hover:glow-red-sm smooth-transition"
      >
        {isExpanded ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </Button>

      <div className="flex h-16 items-center border-b border-sidebar-border px-3 justify-center relative gradient-overlay">
        {isExpanded ? (
          <Image src="/logo.png" alt="ePunisher" width={140} height={32} className="object-contain" priority />
        ) : (
          <Image src="/logo.png" alt="ePunisher" width={24} height={24} className="object-contain" priority />
        )}
      </div>

      <nav className="space-y-1 p-2 flex flex-col h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
        <div className="flex-1 space-y-1">
          <button
            onClick={() => onSelectPlatform("home")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 mb-2 smooth-transition",
              selectedPlatform === "home"
                ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
            )}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Home - Dashboard</span>}
          </button>

          <button
            onClick={() => onSelectPlatform("calendar")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
              selectedPlatform === "calendar"
                ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
            )}
          >
            <Calendar className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Calendar</span>}
          </button>

          <button
            onClick={() => onSelectPlatform("playground")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
              selectedPlatform === "playground"
                ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
            )}
          >
            <Zap className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Playground</span>}
          </button>

          <button
            onClick={() => onSelectPlatform("booster")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
              selectedPlatform === "booster"
                ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
            )}
          >
            <Rocket className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Booster</span>}
          </button>

          <button
            onClick={() => onSelectPlatform("sentinel")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
              selectedPlatform === "sentinel"
                ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
            )}
          >
            <Shield className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">e-Sentinel</span>}
          </button>

          <button
            onClick={() => onSelectPlatform("attack")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
              selectedPlatform === "attack"
                ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
            )}
          >
            <Target className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Attack</span>}
          </button>

          <button
            onClick={() => onSelectPlatform("e-miner")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
              selectedPlatform === "e-miner"
                ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
            )}
          >
            <Database className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">e-Miner</span>}
          </button>

          <div className="mt-4">
            {isExpanded && (
              <button
                onClick={() => setIsManagementOpen(!isManagementOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-[0.1em] hover:text-sidebar-foreground/60 smooth-transition"
              >
                <span>Management</span>
                {isManagementOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}

            {(!isExpanded || isManagementOpen) && (
              <div className="space-y-1 mt-1">
                <button
                  onClick={() => onSelectPlatform("cases")}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
                    isExpanded && "pl-6",
                    selectedPlatform === "cases"
                      ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
                  )}
                >
                  <Briefcase className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && <span className="whitespace-nowrap">Cases</span>}
                </button>

                <button
                  onClick={() => onSelectPlatform("projects")}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
                    isExpanded && "pl-6",
                    selectedPlatform === "projects"
                      ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
                  )}
                >
                  <FolderKanban className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && <span className="whitespace-nowrap">Projects</span>}
                </button>

                <button
                  onClick={() => onSelectPlatform("accounts")}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
                    isExpanded && "pl-6",
                    selectedPlatform === "accounts"
                      ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
                  )}
                >
                  <Users className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && <span className="whitespace-nowrap">Account Management</span>}
                </button>

                <button
                  onClick={() => onSelectPlatform("configuration")}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 smooth-transition",
                    isExpanded && "pl-6",
                    selectedPlatform === "configuration"
                      ? "bg-sidebar-primary text-sidebar-primary-foreground glow-red-sm shadow-lg"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm",
                  )}
                >
                  <Sliders className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && <span className="whitespace-nowrap">Configuration</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 border-t border-sidebar-border pt-2">
          <button
            onClick={onSettingsClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:glow-red-sm transition-all duration-300 smooth-transition"
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Settings</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive hover:text-destructive-foreground hover:glow-red-sm transition-all duration-300 smooth-transition">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  )
}
