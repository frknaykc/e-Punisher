"use client"

import type React from "react"

import {
  UserCog,
  Languages,
  Mail,
  Smartphone,
  Clock,
  Users,
  Building2,
  Lock,
  Globe,
  Network,
  Brain,
  Wrench,
  FileDown,
  ScrollText,
  DollarSign,
  Receipt,
  Key,
  Webhook,
  Zap,
  Palette,
  BookOpen,
  Video,
  MessageSquare,
  LifeBuoy,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ImpactLevelConfig } from "./impact-level-config"

interface SettingsContentProps {
  selectedSetting: string
  demoMode: boolean
  onDemoModeChange: (enabled: boolean) => void
}

export function SettingsContent({ selectedSetting, demoMode, onDemoModeChange }: SettingsContentProps) {
  const handleDemoModeToggle = (checked: boolean) => {
    onDemoModeChange(checked)
  }

  const handleSwitchClick = (e: React.MouseEvent) => {
    console.log("[v0] SettingsContent: Switch CLICKED (onClick event)!", e)
  }

  const renderContent = () => {
    switch (selectedSetting) {
      // User & Profile Settings
      case "profile-info":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage your personal information, username, language preferences, and time zone settings.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <UserCog className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Personal Details</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• First Name, Last Name, Email</li>
                  <li>• Profile Picture</li>
                  <li>• Username / User ID</li>
                </ul>
              </div>
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Languages className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Regional Settings</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Language & Region</li>
                  <li>• Time Zone (for post scheduling)</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure how and when you receive notifications from the platform.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Email Notifications</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Reports, mention alerts, trend updates</li>
                </ul>
              </div>
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Push Notifications</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Mobile / Web notifications</li>
                </ul>
              </div>
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Notification Frequency</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Instant / Daily summary / Weekly digest</li>
                </ul>
              </div>
            </div>
          </div>
        )

      // Account & Access Management
      case "team-members":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Team Members / Roles</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage team members, assign roles, and configure permissions for your workspace.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Team Management</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Team member list</li>
                  <li>• Roles: admin, editor, analyst, bot-operator, viewer</li>
                  <li>• Permission settings: content creation, publishing, OSINT access</li>
                  <li>• Invite users (via email or link)</li>
                  <li>• Two-step approval for restricted tasks</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "organization":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Organization / Workspace Settings</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure your organization details, branding, and workspace structure.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Organization Details</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Brand or Agency Name</li>
                  <li>• Workspace Logos / Theme Colors</li>
                  <li>• Billing Address / Company Details</li>
                  <li>• Sub-brands / Client Workspaces</li>
                </ul>
              </div>
            </div>
          </div>
        )

      // Security & Access
      case "account-security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Security</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Protect your account with advanced security features and monitor active sessions.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Security Features</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Two-Factor Authentication (2FA)</li>
                  <li>• Active Sessions (IP, device, last access time)</li>
                  <li>• Change Password / Renew API Tokens</li>
                  <li>• Session Timeout Settings</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "ip-proxy":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">IP & Proxy Policies</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure IP whitelisting, proxy settings, and geo-restrictions for enhanced security.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Network Security</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Whitelisted IP ranges</li>
                  <li>• Proxy assignments (for automation/bot tasks)</li>
                  <li>• Geo-restrictions (location-based access control)</li>
                  <li>• Suspicious login alert logs</li>
                </ul>
              </div>
            </div>
          </div>
        )

      // Connections & Integrations
      case "social-networks":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Social Network Connections</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Connect and manage your social media accounts across multiple platforms.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Network className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Connected Platforms</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Instagram, X (Twitter), TikTok, LinkedIn</li>
                  <li>• Facebook, Reddit, YouTube, Telegram</li>
                  <li>• OAuth Token Status / Refresh Date</li>
                  <li>• Connection History</li>
                  <li>• API Key Errors, Rate Limits</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "ai-services":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">AI & External Service Integrations</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure AI models, API keys, and generation settings for enhanced automation.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">AI Configuration</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• OpenAI / Claude / Gemini API Keys</li>
                  <li>• Visual Generation Engine (DALL·E, Stable Diffusion, Midjourney)</li>
                  <li>• AI Model Settings: tone, accuracy, creativity level</li>
                  <li>• Custom Prompt Templates</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "third-party":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Third-Party Integrations</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Connect with analytics, collaboration tools, and automation platforms.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">External Services</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Google Analytics / GA4 / Meta Pixel</li>
                  <li>• Slack / Discord / Teams / Notion / Trello</li>
                  <li>• Zapier / Make (Integromat)</li>
                  <li>• Webhooks (trigger on trend detection)</li>
                </ul>
              </div>
            </div>
          </div>
        )

      // Reporting & Data Management
      case "data-export":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Data Export / Archiving</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Export your data in multiple formats and configure automatic archiving policies.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <FileDown className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Export Options</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Export Formats: CSV, JSON, PDF, XLSX</li>
                  <li>• Auto-Archiving (30 / 90 / 180 days)</li>
                  <li>• Report Scheduler (weekly / monthly auto email)</li>
                  <li>• Data Exports (OSINT results, bot activities, logs)</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "logs-audit":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Logs & Audit Trails</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Track all activities, bot tasks, API calls, and system events for compliance and debugging.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <ScrollText className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Activity Tracking</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Who did what, and when (audit trail)</li>
                  <li>• Bot Task History</li>
                  <li>• API Call Logs</li>
                  <li>• Error / Exception / Warning Reports</li>
                </ul>
              </div>
            </div>
          </div>
        )

      // Billing & Subscription
      case "subscription":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Subscription Plan</h3>
              <p className="text-sm text-muted-foreground mb-6">
                View your current plan, usage limits, and upgrade options.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Plan Details</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Plan Type (Free / Pro / Enterprise)</li>
                  <li>• Limits: accounts, OSINT scans, bot quotas</li>
                  <li>• Usage Chart (e.g., "82 OSINT scans this month")</li>
                  <li>• Upgrade / Cancel / Renew Options</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "payment-history":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment History</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Access your invoices, payment records, and billing information.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Receipt className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Billing Records</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Invoice History</li>
                  <li>• Tax ID, Company Details</li>
                  <li>• E-invoice / PDF Download</li>
                </ul>
              </div>
            </div>
          </div>
        )

      // Developer & API Area
      case "api-keys":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">API Keys</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Create and manage personal access tokens for API integration.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Token Management</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Create Personal Access Tokens</li>
                  <li>• Permissions: read / write / analyze</li>
                  <li>• Token Renewal / Revocation</li>
                  <li>• Rate Limits & Usage Stats</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "webhooks":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Webhook Management</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure webhooks for event-driven integrations with external services.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Webhook className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Webhook Configuration</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Webhook URLs (event-driven integrations)</li>
                  <li>• Test / Retry / Error Logs</li>
                </ul>
              </div>
            </div>
          </div>
        )

      // System & Advanced Settings
      case "automation":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Automation Engine Settings</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure task queues, speed limits, and automation priorities.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Automation Controls</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Task Queue Size, Speed Limits, Retry Policies</li>
                  <li>• Scheduler Frequency (OSINT re-scan interval)</li>
                  <li>• Bot Task Priorities</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "customization":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Platform Customization</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Personalize your dashboard appearance, layout, and interaction preferences.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Interface Customization</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Theme: Dark / Light / Custom Colors</li>
                  <li>• Dashboard Layout: module order, visible widgets</li>
                  <li>• Keyboard Shortcuts</li>
                  <li>• Language / Translation Options</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "configuration":
        return <ImpactLevelConfig />

      case "demo-data":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Demo Data</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Enable or disable demo data to test the application with sample data.
              </p>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50">
              <div className="space-y-0.5">
                <Label htmlFor="demo-mode-settings" className="text-sm font-medium cursor-pointer">
                  Demo Mode
                </Label>
                <p className="text-xs text-muted-foreground">Toggle demo data throughout the application</p>
              </div>
              <Switch
                id="demo-mode-settings"
                checked={demoMode}
                onCheckedChange={handleDemoModeToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        )

      // Support & Help
      case "documentation":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Documentation & API Reference</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Access comprehensive guides, API documentation, and technical references.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Resources</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Complete API Reference</li>
                  <li>• Integration Guides</li>
                  <li>• Best Practices</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "tutorials":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Tutorial Videos</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Watch step-by-step video tutorials to master platform features.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Video Library</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Getting Started</li>
                  <li>• Advanced Features</li>
                  <li>• Integration Tutorials</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "faq":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Find quick answers to common questions about the platform.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Common Questions</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Account & Billing</li>
                  <li>• Technical Issues</li>
                  <li>• Feature Usage</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case "support-ticket":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Submit Support Ticket</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Get personalized help from our support team for complex issues.
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-card/50">
                <div className="flex items-center gap-3 mb-4">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Contact Support</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• Create New Ticket</li>
                  <li>• Track Existing Tickets</li>
                  <li>• Priority Support (Enterprise)</li>
                </ul>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground text-sm">Select a setting from the sidebar</p>
          </div>
        )
    }
  }

  return <div className="space-y-6">{renderContent()}</div>
}
