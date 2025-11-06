"use client"

import { cn } from "@/lib/utils"
import {
  X,
  ChevronRight,
  User,
  Bell,
  Users,
  Building2,
  Shield,
  Lock,
  Globe,
  Link2,
  Brain,
  Wrench,
  FileText,
  Archive,
  ScrollText,
  CreditCard,
  Receipt,
  Code,
  Webhook,
  Settings2,
  Palette,
  HelpCircle,
  UserCog,
  Key,
  Network,
  Zap,
  ImageIcon,
  DollarSign,
  BookOpen,
  Video,
  MessageSquare,
  LifeBuoy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  mainSidebarExpanded: boolean
  selectedSetting: string
  onSelectSetting: (setting: string) => void
}

interface SettingsSection {
  id: string
  label: string
  icon: any
  items?: { id: string; label: string; icon: any }[]
}

const settingsSections: SettingsSection[] = [
  {
    id: "user-profile",
    label: "User & Profile Settings",
    icon: User,
    items: [
      { id: "profile-info", label: "Profile Information", icon: UserCog },
      { id: "notifications", label: "Notification Preferences", icon: Bell },
    ],
  },
  {
    id: "account-access",
    label: "Account & Access Management",
    icon: Users,
    items: [
      { id: "team-members", label: "Team Members / Roles", icon: Users },
      { id: "organization", label: "Organization / Workspace", icon: Building2 },
    ],
  },
  {
    id: "security",
    label: "Security & Access",
    icon: Shield,
    items: [
      { id: "account-security", label: "Account Security", icon: Lock },
      { id: "ip-proxy", label: "IP & Proxy Policies", icon: Globe },
    ],
  },
  {
    id: "integrations",
    label: "Connections & Integrations",
    icon: Link2,
    items: [
      { id: "social-networks", label: "Social Network Connections", icon: Network },
      { id: "ai-services", label: "AI & External Services", icon: Brain },
      { id: "third-party", label: "Third-Party Integrations", icon: Wrench },
    ],
  },
  {
    id: "reporting",
    label: "Reporting & Data Management",
    icon: FileText,
    items: [
      { id: "data-export", label: "Data Export / Archiving", icon: Archive },
      { id: "logs-audit", label: "Logs & Audit Trails", icon: ScrollText },
    ],
  },
  {
    id: "billing",
    label: "Billing & Subscription",
    icon: CreditCard,
    items: [
      { id: "subscription", label: "Subscription Plan", icon: DollarSign },
      { id: "payment-history", label: "Payment History", icon: Receipt },
    ],
  },
  {
    id: "developer",
    label: "Developer & API Area",
    icon: Code,
    items: [
      { id: "api-keys", label: "API Keys", icon: Key },
      { id: "webhooks", label: "Webhook Management", icon: Webhook },
    ],
  },
  {
    id: "system",
    label: "System & Advanced Settings",
    icon: Settings2,
    items: [
      { id: "automation", label: "Automation Engine", icon: Zap },
      { id: "customization", label: "Platform Customization", icon: Palette },
      { id: "demo-data", label: "Demo Data", icon: ImageIcon },
    ],
  },
  {
    id: "support",
    label: "Support & Help",
    icon: HelpCircle,
    items: [
      { id: "documentation", label: "Documentation & API", icon: BookOpen },
      { id: "tutorials", label: "Tutorial Videos", icon: Video },
      { id: "faq", label: "Frequently Asked Questions", icon: MessageSquare },
      { id: "support-ticket", label: "Submit Support Ticket", icon: LifeBuoy },
    ],
  },
]

export function SettingsSidebar({
  isOpen,
  onClose,
  mainSidebarExpanded,
  selectedSetting,
  onSelectSetting,
}: SettingsSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["system"])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const sidebarWidth = mainSidebarExpanded ? "16rem" : "4rem"

  return (
    <aside
      className={cn(
        "fixed top-0 h-screen w-64 bg-card border-r border-border transition-all duration-300 z-30 overflow-y-auto shadow-2xl",
      )}
      style={{
        left: isOpen ? sidebarWidth : "-16rem",
      }}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
        <h2 className="text-lg font-semibold">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-accent">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="p-3 space-y-1">
        {settingsSections.map((section) => {
          const SectionIcon = section.icon
          const isExpanded = expandedSections.includes(section.id)
          const hasItems = section.items && section.items.length > 0

          return (
            <div key={section.id}>
              <button
                onClick={() => (hasItems ? toggleSection(section.id) : onSelectSetting(section.id))}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all",
                  selectedSetting === section.id && !hasItems
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-accent/50",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <SectionIcon className="h-4 w-4" />
                  <span>{section.label}</span>
                </div>
                {hasItems && <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />}
              </button>

              {hasItems && isExpanded && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {section.items?.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectSetting(item.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all",
                          selectedSetting === item.id
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                        )}
                      >
                        <ItemIcon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
