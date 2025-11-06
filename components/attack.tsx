"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Target,
  Crosshair,
  AlertTriangle,
  Activity,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Music,
  Chrome,
  Zap,
  X,
  Users,
  Shuffle,
  Loader2,
} from "lucide-react"
import { apiClient, Account } from "@/lib/api-client"
import { toast } from "sonner"

interface AttackProps {
  demoMode?: boolean
}

type SocialPlatform = "twitter" | "instagram" | "linkedin" | "facebook" | "tiktok" | "google"
type AttackType = "engagement" | "growth" | "viral" | "competitive" | "defensive"
type ImpactLevel = "safe" | "fast" | "slow-effective"

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  tiktok: Music,
  google: Chrome,
}

const attackTypes: Record<AttackType, { label: string; description: string }> = {
  engagement: { label: "Engagement Attack", description: "Rapid engagement on target content" },
  growth: { label: "Growth Attack", description: "Aggressive follower acquisition" },
  viral: { label: "Viral Push", description: "Amplify content for viral reach" },
  competitive: { label: "Competitive Strike", description: "Counter competitor campaigns" },
  defensive: { label: "Defensive Response", description: "Protect brand reputation" },
}

const impactLevels: Record<ImpactLevel, { label: string; description: string }> = {
  safe: { label: "Safe", description: "Longer delays between actions, minimal risk" },
  fast: { label: "Fast", description: "Moderate speed with balanced safety" },
  "slow-effective": { label: "Slow but Effective", description: "Maximum effectiveness with careful timing" },
}

interface AccountItem {
  id: string
  username: string
  followers: string
  status: string
}

export function Attack({ demoMode = true }: AttackProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>("twitter")
  const [selectedAttackType, setSelectedAttackType] = useState<AttackType>("engagement")
  const [showAccountSelector, setShowAccountSelector] = useState(false)
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [accounts, setAccounts] = useState<AccountItem[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)

  // Backend'den hesapları çek
  useEffect(() => {
    if (showAccountSelector) {
      loadAccounts()
    }
  }, [selectedPlatform, showAccountSelector])

  const loadAccounts = async () => {
    setIsLoadingAccounts(true)
    try {
      const response = await apiClient.getAccounts(selectedPlatform, true)
      
      const formattedAccounts: AccountItem[] = response.accounts.map((acc: Account) => ({
        id: acc.id.toString(),
        username: acc.username,
        followers: "0",
        status: acc.is_active ? "active" : "inactive",
      }))
      
      setAccounts(formattedAccounts)
    } catch (error: any) {
      console.error("Hesaplar yüklenemedi:", error)
      setAccounts([])
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  const operations = demoMode
    ? [
        {
          id: 1,
          name: "Competitor Analysis Strike",
          platform: "twitter" as SocialPlatform,
          type: "competitive" as AttackType,
          target: "@competitor_brand",
          status: "active",
          impact: "High",
          progress: 75,
        },
        {
          id: 2,
          name: "Viral Content Push",
          platform: "instagram" as SocialPlatform,
          type: "viral" as AttackType,
          target: "#TrendingTopic",
          status: "scheduled",
          impact: "Critical",
          progress: 30,
        },
        {
          id: 3,
          name: "Brand Defense Operation",
          platform: "linkedin" as SocialPlatform,
          type: "defensive" as AttackType,
          target: "Crisis Management",
          status: "standby",
          impact: "Medium",
          progress: 0,
        },
      ]
    : []

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId],
    )
  }

  const handleRandomSelection = (count: number) => {
    const shuffled = [...accounts].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(count, accounts.length)).map((acc) => acc.id)
    setSelectedAccounts(selected)
  }

  const PlatformIcon = platformIcons[selectedPlatform]

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <Tabs defaultValue="operations" className="space-y-6">
          <TabsList className="glass-card p-1.5">
            <TabsTrigger
              value="operations"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_20px_rgba(239,68,68,0.5)] data-[state=active]:border data-[state=active]:border-primary/50 px-6 py-2.5 font-medium transition-all duration-300"
            >
              Active Operations
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_20px_rgba(239,68,68,0.5)] data-[state=active]:border data-[state=active]:border-primary/50 px-6 py-2.5 font-medium transition-all duration-300"
            >
              Create Operation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-6">
            {!demoMode ? (
              <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="p-6 rounded-full bg-muted">
                  <Target className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">No Operations Available</h3>
                  <p className="text-muted-foreground max-w-md">
                    Demo data is currently disabled. Enable demo mode in Settings to view sample operations.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="glass-card hover-glow-red smooth-transition">
                    <CardHeader className="gradient-overlay pb-3">
                      <Crosshair className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-2xl">{operations.length}</CardTitle>
                      <CardDescription>Active Operations</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="glass-card hover-glow-red smooth-transition">
                    <CardHeader className="gradient-overlay pb-3">
                      <Activity className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-2xl">24/7</CardTitle>
                      <CardDescription>Monitoring Status</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="glass-card hover-glow-red smooth-transition">
                    <CardHeader className="gradient-overlay pb-3">
                      <AlertTriangle className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-2xl">0</CardTitle>
                      <CardDescription>Active Threats</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                <div className="space-y-4">
                  {operations.map((operation) => {
                    const Icon = platformIcons[operation.platform]
                    return (
                      <Card key={operation.id} className="glass-card hover-glow-red smooth-transition">
                        <CardHeader className="gradient-overlay">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-primary" />
                              <div>
                                <CardTitle className="text-lg">{operation.name}</CardTitle>
                                <CardDescription className="capitalize">
                                  {operation.platform} • {attackTypes[operation.type].label}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={operation.impact === "Critical" ? "destructive" : "default"}>
                                {operation.impact}
                              </Badge>
                              <Badge
                                variant={
                                  operation.status === "active"
                                    ? "default"
                                    : operation.status === "scheduled"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {operation.status}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Target: {operation.target}</span>
                              <span className="font-medium">{operation.progress}% Complete</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full gap-2 bg-primary/10 hover:bg-primary/20 border-primary/40 hover:border-primary text-foreground hover:text-primary smooth-transition shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] font-medium"
                            >
                              <Target className="h-4 w-4" />
                              Manage Operation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="gradient-overlay">
                <CardTitle>Create New Operation</CardTitle>
                <CardDescription>Launch a strategic social media attack operation</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
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
                    <Label>Operation Type</Label>
                    <Select
                      value={selectedAttackType}
                      onValueChange={(value) => setSelectedAttackType(value as AttackType)}
                    >
                      <SelectTrigger className="glass-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(attackTypes).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Operation Name</Label>
                  <Input placeholder="Enter operation name" className="glass-card" />
                </div>

                <div className="space-y-2">
                  <Label>Select Accounts</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50 bg-transparent"
                    onClick={() => setShowAccountSelector(!showAccountSelector)}
                  >
                    <span>
                      {selectedAccounts.length > 0
                        ? `${selectedAccounts.length} account(s) selected`
                        : "Click to select accounts"}
                    </span>
                    <Users className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Target</Label>
                  <Input placeholder="e.g., @competitor, #hashtag, or URL" className="glass-card" />
                </div>

                <div className="space-y-2">
                  <Label>Impact Level</Label>
                  <Select defaultValue="safe">
                    <SelectTrigger className="glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(impactLevels).map(([key, { label, description }]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex flex-col">
                            <span className="font-medium">{label}</span>
                            <span className="text-xs text-muted-foreground">{description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Execution Time</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger className="glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Execute Immediately</SelectItem>
                      <SelectItem value="scheduled">Schedule for Later</SelectItem>
                      <SelectItem value="standby">Standby Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <PlatformIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium capitalize">
                      {selectedPlatform} - {attackTypes[selectedAttackType].label}
                    </p>
                    <p className="text-sm text-muted-foreground">{attackTypes[selectedAttackType].description}</p>
                  </div>
                </div>

                <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] smooth-transition border-2 border-primary/50 hover:border-primary py-6 text-base">
                  <Zap className="h-5 w-5" />
                  Launch Operation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showAccountSelector && (
        <div className="w-80 space-y-4">
          <Card className="glass-card sticky top-6">
            <CardHeader className="gradient-overlay pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Select Accounts</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAccountSelector(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="capitalize">{selectedPlatform} accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRandomSelection(100)}
                  className="glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50 text-xs"
                >
                  <Shuffle className="h-3 w-3 mr-1" />
                  Random 100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRandomSelection(200)}
                  className="glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50 text-xs"
                >
                  <Shuffle className="h-3 w-3 mr-1" />
                  Random 200
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRandomSelection(500)}
                  className="glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50 text-xs"
                >
                  <Shuffle className="h-3 w-3 mr-1" />
                  Random 500
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRandomSelection(1000)}
                  className="glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50 text-xs"
                >
                  <Shuffle className="h-3 w-3 mr-1" />
                  Random 1000
                </Button>
              </div>

              <ScrollArea className="h-[500px] pr-4">
                {isLoadingAccounts ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Loading {selectedPlatform} accounts...</span>
                  </div>
                ) : accounts.length > 0 ? (
                  <div className="space-y-2">
                    {accounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center space-x-3 p-3 rounded-lg glass-card hover:bg-primary/5 smooth-transition"
                      >
                        <Checkbox
                          id={account.id}
                          checked={selectedAccounts.includes(account.id)}
                          onCheckedChange={() => handleAccountToggle(account.id)}
                          className="border-primary/50"
                        />
                        <label htmlFor={account.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{account.username}</p>
                              {account.followers !== "0" && (
                                <p className="text-xs text-muted-foreground">{account.followers} followers</p>
                              )}
                            </div>
                            <Badge variant={account.status === "active" ? "default" : "secondary"} className="text-xs">
                              {account.status}
                            </Badge>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-2">No {selectedPlatform} accounts available</p>
                    <p className="text-sm text-muted-foreground">Add accounts in Account Management</p>
                  </div>
                )}
              </ScrollArea>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {selectedAccounts.length} of {accounts.length} accounts selected
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
