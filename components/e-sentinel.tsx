"use client"

import { SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { useState } from "react"
import {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
  StatsCard,
  SessionCard,
} from "@/components/ui/themed-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Music,
  Chrome,
  Shield,
  Eye,
  AlertTriangle,
  TrendingUp,
  Plus,
} from "lucide-react"

interface ESentinelProps {
  demoMode?: boolean
}

type SocialPlatform = "twitter" | "instagram" | "linkedin" | "facebook" | "tiktok" | "google"
type MonitorType = "keyword" | "hashtag" | "user" | "mention" | "competitor"

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  tiktok: Music,
  google: Chrome,
}

const monitorTypes: Record<MonitorType, string> = {
  keyword: "Keywords",
  hashtag: "Hashtags",
  user: "User Activity",
  mention: "Brand Mentions",
  competitor: "Competitor Tracking",
}

export function ESentinel({ demoMode = true }: ESentinelProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>("twitter")
  const [selectedMonitorType, setSelectedMonitorType] = useState<MonitorType>("keyword")

  const monitors = demoMode
    ? [
        {
          id: 1,
          name: "Brand Mention Tracking",
          platform: "twitter" as SocialPlatform,
          type: "mention" as MonitorType,
          target: "@yourbrand",
          alerts: 23,
          status: "active",
        },
        {
          id: 2,
          name: "Competitor Analysis",
          platform: "instagram" as SocialPlatform,
          type: "competitor" as MonitorType,
          target: "@competitor",
          alerts: 15,
          status: "active",
        },
        {
          id: 3,
          name: "Industry Keywords",
          platform: "linkedin" as SocialPlatform,
          type: "keyword" as MonitorType,
          target: "AI, Machine Learning",
          alerts: 47,
          status: "active",
        },
      ]
    : []

  const PlatformIcon = platformIcons[selectedPlatform]

  return (
    <div className="space-y-6">
      <div></div>

      <ThemedTabs defaultValue="monitors" className="space-y-6">
        <ThemedTabsList variant="glass">
          <ThemedTabsTrigger value="monitors" variant="glow">
            Active Monitors
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="create" variant="glow">
            Create Monitor
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="alerts" variant="glow">
            Alerts
          </ThemedTabsTrigger>
        </ThemedTabsList>

        <ThemedTabsContent value="monitors" className="space-y-6">
          {!demoMode ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <div className="p-6 rounded-full bg-muted">
                <Shield className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">No Monitors Available</h3>
                <p className="text-muted-foreground max-w-md">
                  Demo data is currently disabled. Enable demo mode in Settings to view sample monitors.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-4">
                <StatsCard icon={Shield} value={monitors.length.toString()} label="Active Monitors" />
                <StatsCard icon={Eye} value="24/7" label="Real-time Tracking" />
                <StatsCard icon={AlertTriangle} value="85" label="Total Alerts" />
                <StatsCard icon={TrendingUp} value="+32%" label="Activity Increase" />
              </div>

              <div className="space-y-4">
                {monitors.map((monitor) => {
                  const Icon = platformIcons[monitor.platform]
                  return (
                    <ThemedCard key={monitor.id} variant="glass">
                      <ThemedCardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <div>
                              <ThemedCardTitle size="lg">{monitor.name}</ThemedCardTitle>
                              <ThemedCardDescription className="capitalize">
                                {monitor.platform} • {monitorTypes[monitor.type]}
                              </ThemedCardDescription>
                            </div>
                          </div>
                          <Badge>{monitor.status}</Badge>
                        </div>
                      </ThemedCardHeader>
                      <ThemedCardContent>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Target: {monitor.target}</p>
                            <p className="text-sm font-medium">{monitor.alerts} new alerts</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/50 text-foreground hover:text-primary smooth-transition shadow-sm hover:shadow-md"
                          >
                            View Details
                          </Button>
                        </div>
                      </ThemedCardContent>
                    </ThemedCard>
                  )
                })}
              </div>
            </>
          )}
        </ThemedTabsContent>

        <ThemedTabsContent value="create" className="space-y-6">
          <SessionCard>
            <ThemedCardHeader>
              <ThemedCardTitle size="xl">Create New Monitor</ThemedCardTitle>
              <ThemedCardDescription>Set up real-time monitoring for social media activity</ThemedCardDescription>
            </ThemedCardHeader>
            <ThemedCardContent spacing="lg">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Select Platform</Label>
                  <Select
                    value={selectedPlatform}
                    onValueChange={(value) => setSelectedPlatform(value as SocialPlatform)}
                  >
                    <SelectTrigger className="glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(platformIcons).map((platform) => {
                        const Icon = platformIcons[platform as SocialPlatform]
                        return (
                          <SelectItem key={platform} value={platform}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span className="capitalize">{platform}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Monitor Type</Label>
                  <Select
                    value={selectedMonitorType}
                    onValueChange={(value) => setSelectedMonitorType(value as MonitorType)}
                  >
                    <SelectTrigger className="glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(monitorTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Monitor Name</Label>
                <Input placeholder="Enter monitor name" className="glass-card" />
              </div>

              <div className="space-y-2">
                <Label>Target</Label>
                <Input
                  placeholder={
                    selectedMonitorType === "keyword"
                      ? "e.g., AI, technology"
                      : selectedMonitorType === "hashtag"
                        ? "e.g., #trending"
                        : selectedMonitorType === "user"
                          ? "e.g., @username"
                          : selectedMonitorType === "mention"
                            ? "e.g., @yourbrand"
                            : "e.g., @competitor"
                  }
                  className="glass-card"
                />
              </div>

              <div className="space-y-2">
                <Label>Alert Threshold</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger className="glass-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Summary</SelectItem>
                    <SelectItem value="daily">Daily Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <PlatformIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium capitalize">
                    {selectedPlatform} - {monitorTypes[selectedMonitorType]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Monitor {monitorTypes[selectedMonitorType].toLowerCase()} on {selectedPlatform}
                  </p>
                </div>
              </div>

              <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 smooth-transition border border-primary/30 hover:border-primary/50">
                <Plus className="h-4 w-4" />
                Create Monitor
              </Button>
            </ThemedCardContent>
          </SessionCard>
        </ThemedTabsContent>

        <ThemedTabsContent value="alerts" className="space-y-4">
          <ThemedCard variant="glass">
            <ThemedCardHeader>
              <ThemedCardTitle size="lg">Recent Alerts</ThemedCardTitle>
              <ThemedCardDescription>Latest activity detected by your monitors</ThemedCardDescription>
            </ThemedCardHeader>
            <ThemedCardContent spacing="lg">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 border border-border rounded-lg hover:bg-accent/50 smooth-transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Twitter</Badge>
                      <Badge variant="secondary">Brand Mention</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{i * 5} min ago</span>
                  </div>
                  <p className="text-sm mb-2">
                    New mention detected: "Just tried @yourbrand and it's amazing! Highly recommend #product"
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>@user{i}234</span>
                    <span>•</span>
                    <span>1.2K followers</span>
                    <span>•</span>
                    <span>High engagement</span>
                  </div>
                </div>
              ))}
            </ThemedCardContent>
          </ThemedCard>
        </ThemedTabsContent>
      </ThemedTabs>
    </div>
  )
}
