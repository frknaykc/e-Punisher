"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import {
  Rocket,
  TrendingUp,
  Users,
  Heart,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Music,
  Chrome,
  Plus,
  X,
  Shuffle,
  Loader2,
} from "lucide-react"
import { apiClient, type Account } from "@/lib/api-client"

interface BoosterProps {
  demoMode?: boolean
}

type SocialPlatform = "twitter" | "instagram" | "linkedin" | "facebook" | "tiktok" | "google"
type ActionType = "post" | "like" | "follow" | "reply" | "retweet" | "comment" | "share" | "view"
type ImpactLevel = "safe" | "fast" | "slow-effective"

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  tiktok: Music,
  google: Chrome,
}

const platformActions: Record<SocialPlatform, ActionType[]> = {
  twitter: ["post", "like", "follow", "reply", "retweet"],
  instagram: ["post", "like", "follow", "comment"],
  linkedin: ["post", "like", "follow", "comment", "share"],
  facebook: ["post", "like", "follow", "comment", "share"],
  tiktok: ["post", "like", "follow", "comment", "view"],
  google: ["post", "like", "follow", "comment"],
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

export function Booster({ demoMode = true }: BoosterProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>("twitter")
  const [selectedAction, setSelectedAction] = useState<ActionType>("post")
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

  const campaigns = demoMode
    ? [
        {
          id: 1,
          name: "Follower Growth Campaign",
          platform: "instagram" as SocialPlatform,
          action: "follow" as ActionType,
          progress: 75,
          target: "10K followers",
          current: "7.5K",
          status: "active",
        },
        {
          id: 2,
          name: "Engagement Boost",
          platform: "twitter" as SocialPlatform,
          action: "like" as ActionType,
          progress: 60,
          target: "5K likes",
          current: "3K",
          status: "active",
        },
        {
          id: 3,
          name: "Content Amplification",
          platform: "linkedin" as SocialPlatform,
          action: "share" as ActionType,
          progress: 90,
          target: "1K shares",
          current: "900",
          status: "active",
        },
      ]
    : []

  const PlatformIcon = platformIcons[selectedPlatform]

  const handleRandomSelect = (count: number) => {
    const shuffled = [...accounts].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(count, accounts.length))
    setSelectedAccounts(selected.map((acc) => acc.id))
  }

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

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <ThemedTabs defaultValue="campaigns" className="space-y-6">
          <ThemedTabsList variant="glass">
            <ThemedTabsTrigger value="campaigns" variant="glow">
              Active Campaigns
            </ThemedTabsTrigger>
            <ThemedTabsTrigger value="create" variant="glow">
              Create Campaign
            </ThemedTabsTrigger>
          </ThemedTabsList>

          <ThemedTabsContent value="campaigns" className="space-y-6">
            {!demoMode ? (
              <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="p-6 rounded-full bg-muted">
                  <Rocket className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">No Campaigns Available</h3>
                  <p className="text-muted-foreground max-w-md">
                    Demo data is currently disabled. Enable demo mode in Settings to view sample campaigns.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-4">
                  <Card className="glass-card hover-glow-red smooth-transition">
                    <CardHeader className="gradient-overlay pb-3">
                      <TrendingUp className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-2xl">+245%</CardTitle>
                      <CardDescription>Growth Rate</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="glass-card hover-glow-red smooth-transition">
                    <CardHeader className="gradient-overlay pb-3">
                      <Users className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-2xl">12.5K</CardTitle>
                      <CardDescription>New Followers</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="glass-card hover-glow-red smooth-transition">
                    <CardHeader className="gradient-overlay pb-3">
                      <Heart className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-2xl">8.2K</CardTitle>
                      <CardDescription>Engagements</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="glass-card hover-glow-red smooth-transition">
                    <CardHeader className="gradient-overlay pb-3">
                      <Rocket className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-2xl">{campaigns.length}</CardTitle>
                      <CardDescription>Active Campaigns</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                <div className="space-y-4">
                  {campaigns.map((campaign) => {
                    const Icon = platformIcons[campaign.platform]
                    return (
                      <Card key={campaign.id} className="glass-card hover-glow-red smooth-transition">
                        <CardHeader className="gradient-overlay">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-primary" />
                              <div>
                                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                                <CardDescription className="capitalize">
                                  {campaign.platform} • {campaign.action}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge>{campaign.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {campaign.current} / {campaign.target}
                              </span>
                            </div>
                            <Progress value={campaign.progress} className="h-2" />
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{campaign.progress}% Complete</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-primary/10 hover:bg-primary/20 border-primary/40 hover:border-primary text-foreground hover:text-primary smooth-transition shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] font-medium"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}
          </ThemedTabsContent>

          <ThemedTabsContent value="create" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="gradient-overlay">
                <CardTitle>Create New Boost Campaign</CardTitle>
                <CardDescription>Select platform and action type to amplify your social media presence</CardDescription>
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
                    <Label>Select Action Type</Label>
                    <Select value={selectedAction} onValueChange={(value) => setSelectedAction(value as ActionType)}>
                      <SelectTrigger className="glass-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platformActions[selectedPlatform].map((action) => (
                          <SelectItem key={action} value={action}>
                            <span className="capitalize">{action}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input placeholder="Enter campaign name" className="glass-card" />
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
                  <Label>Target Goal</Label>
                  <Input placeholder="e.g., 10000" type="number" className="glass-card" />
                </div>

                <div className="space-y-2">
                  <Label>Target URL or Hashtag</Label>
                  <Input placeholder="e.g., https://twitter.com/username or #hashtag" className="glass-card" />
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

                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <PlatformIcon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium capitalize">
                      {selectedPlatform} - {selectedAction}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This campaign will boost {selectedAction} actions on {selectedPlatform}
                    </p>
                  </div>
                </div>

                <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] smooth-transition border-2 border-primary/50 hover:border-primary py-6 text-base">
                  <Plus className="h-5 w-5" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          </ThemedTabsContent>
        </ThemedTabs>
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
                        className={`flex items-center space-x-3 p-3 rounded-lg glass-card smooth-transition ${
                          selectedAccounts.includes(account.id)
                            ? "border-2 border-primary bg-primary/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                            : "border-2 border-transparent hover:bg-primary/5 hover:border-primary/30"
                        }`}
                      >
                        <Checkbox
                          id={account.id}
                          checked={selectedAccounts.includes(account.id)}
                          onCheckedChange={() => handleAccountToggle(account.id)}
                          className="border-2 border-primary/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
