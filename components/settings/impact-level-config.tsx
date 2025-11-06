"use client"

import { useState, useEffect } from "react"
import {
  ThemedCard,
  ThemedCardContent,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardHeader,
} from "@/components/ui/themed-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import { Settings, Save, RotateCcw, Database, Trash2, Edit2, Power, PowerOff, Clock, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ConfiguredEndpoint {
  id: number
  url: string
  method: string
  action_type: string
  platform: string
  configured_at: string
  usage_description: string
  is_active: boolean
}

function parseUrl(url: string) {
  try {
    const urlObj = new URL(url)
    return {
      protocol: urlObj.protocol.replace(":", ""),
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
    }
  } catch {
    return null
  }
}

function UrlHighlight({ url }: { url: string }) {
  const parsed = parseUrl(url)
  if (!parsed) return <span className="font-mono text-sm">{url}</span>

  return (
    <div className="font-mono text-sm break-all">
      <span className="text-yellow-500">{parsed.protocol}</span>
      <span className="text-muted-foreground">://</span>
      <span className="text-blue-400">{parsed.hostname}</span>
      <span className="text-green-400">{parsed.path}</span>
      {parsed.search && <span className="text-purple-400">{parsed.search}</span>}
      {parsed.hash && <span className="text-orange-400">{parsed.hash}</span>}
    </div>
  )
}

export function ImpactLevelConfig() {
  const [safeConfig, setSafeConfig] = useState({
    minDelay: 30,
    maxDelay: 60,
    actionsPerHour: 20,
    randomization: 80,
  })

  const [fastConfig, setFastConfig] = useState({
    minDelay: 10,
    maxDelay: 20,
    actionsPerHour: 60,
    randomization: 50,
  })

  const [slowEffectiveConfig, setSlowEffectiveConfig] = useState({
    minDelay: 60,
    maxDelay: 120,
    actionsPerHour: 10,
    randomization: 90,
  })

  const [configuredEndpoints, setConfiguredEndpoints] = useState<ConfiguredEndpoint[]>([])
  const [editingEndpoint, setEditingEndpoint] = useState<ConfiguredEndpoint | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("configured_endpoints")
    if (stored) {
      try {
        setConfiguredEndpoints(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load configured endpoints:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (configuredEndpoints.length > 0) {
      localStorage.setItem("configured_endpoints", JSON.stringify(configuredEndpoints))
    }
  }, [configuredEndpoints])

  const resetToDefaults = (level: string) => {
    switch (level) {
      case "safe":
        setSafeConfig({ minDelay: 30, maxDelay: 60, actionsPerHour: 20, randomization: 80 })
        break
      case "fast":
        setFastConfig({ minDelay: 10, maxDelay: 20, actionsPerHour: 60, randomization: 50 })
        break
      case "slow-effective":
        setSlowEffectiveConfig({ minDelay: 60, maxDelay: 120, actionsPerHour: 10, randomization: 90 })
        break
    }
  }

  const toggleEndpointActive = (id: number) => {
    setConfiguredEndpoints((prev) => prev.map((ep) => (ep.id === id ? { ...ep, is_active: !ep.is_active } : ep)))
    toast.success("Endpoint status updated")
  }

  const deleteEndpoint = (id: number) => {
    setConfiguredEndpoints((prev) => prev.filter((ep) => ep.id !== id))
    localStorage.setItem("configured_endpoints", JSON.stringify(configuredEndpoints.filter((ep) => ep.id !== id)))
    toast.success("Endpoint removed")
  }

  const updateEndpoint = (id: number, updates: Partial<ConfiguredEndpoint>) => {
    setConfiguredEndpoints((prev) => prev.map((ep) => (ep.id === id ? { ...ep, ...updates } : ep)))
    setEditingEndpoint(null)
    toast.success("Endpoint updated")
  }

  const getEndpointTypeBadge = (type: string) => {
    const config: Record<string, { color: string; label: string }> = {
      login: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Login" },
      logout: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", label: "Logout" },
      post: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Post" },
      tweet: { color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", label: "Tweet" },
      like: { color: "bg-pink-500/20 text-pink-400 border-pink-500/30", label: "Like" },
      share: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Share" },
      follow: { color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", label: "Follow" },
      comment: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "Comment" },
      api: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "API" },
    }
    const { color, label } = config[type] || config.api
    return (
      <Badge variant="outline" className={`${color} text-xs`}>
        <Tag className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Endpoint Management</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Manage endpoints captured from Playground Reverse Engineering. Configure how they will be used in automation.
        </p>

        <ThemedCard variant="glass">
          <ThemedCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <ThemedCardTitle size="lg" className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Configured Endpoints
                </ThemedCardTitle>
                <ThemedCardDescription>
                  {configuredEndpoints.length} endpoint(s) configured •{" "}
                  {configuredEndpoints.filter((e) => e.is_active).length} active
                </ThemedCardDescription>
              </div>
            </div>
          </ThemedCardHeader>
          <ThemedCardContent spacing="lg">
            {configuredEndpoints.length > 0 ? (
              <div className="space-y-4">
                {configuredEndpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className="glass-card border-2 border-primary/30 rounded-lg p-4 space-y-3 hover:border-primary/50 smooth-transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs font-mono">
                            {endpoint.method}
                          </Badge>
                          {getEndpointTypeBadge(endpoint.action_type)}
                          <Badge variant="outline" className="text-xs">
                            {endpoint.platform}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {endpoint.is_active ? (
                              <Power className="h-3 w-3 text-green-500" />
                            ) : (
                              <PowerOff className="h-3 w-3 text-gray-500" />
                            )}
                            {endpoint.is_active ? "Active" : "Inactive"}
                          </div>
                        </div>

                        <UrlHighlight url={endpoint.url} />

                        {editingEndpoint?.id === endpoint.id ? (
                          <div className="space-y-2 pt-2">
                            <Label className="text-xs">Usage Description</Label>
                            <Textarea
                              value={editingEndpoint.usage_description}
                              onChange={(e) =>
                                setEditingEndpoint({ ...editingEndpoint, usage_description: e.target.value })
                              }
                              placeholder="Describe how this endpoint will be used..."
                              className="glass-card text-sm"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateEndpoint(endpoint.id, editingEndpoint)}
                                className="bg-primary hover:bg-primary/90"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingEndpoint(null)}
                                className="glass-card"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">{endpoint.usage_description}</p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Configured: {new Date(endpoint.configured_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleEndpointActive(endpoint.id)}
                          className="h-8 w-8 p-0"
                          title={endpoint.is_active ? "Deactivate" : "Activate"}
                        >
                          {endpoint.is_active ? (
                            <Power className="h-4 w-4 text-green-500" />
                          ) : (
                            <PowerOff className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingEndpoint(endpoint)}
                          className="h-8 w-8 p-0"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteEndpoint(endpoint.id)}
                          className="h-8 w-8 p-0 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No configured endpoints yet</p>
                <p className="text-xs mt-1">Move endpoints from Playground → Reverse Engineering → Saved Endpoints</p>
              </div>
            )}
          </ThemedCardContent>
        </ThemedCard>
      </div>

      {/* Impact Level Configuration section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Impact Level Configuration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Configure timing, speed, and safety parameters for each impact level used in Booster and Attack operations.
        </p>
      </div>

      <ThemedTabs defaultValue="safe" className="space-y-6">
        <ThemedTabsList variant="glass">
          <ThemedTabsTrigger value="safe" variant="glow">
            Safe
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="fast" variant="glow">
            Fast
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="slow-effective" variant="glow">
            Slow but Effective
          </ThemedTabsTrigger>
        </ThemedTabsList>

        <ThemedTabsContent value="safe">
          <ThemedCard variant="glass">
            <div className="p-6 border-b border-primary/10">
              <ThemedCardTitle size="lg" className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Safe Mode Configuration
              </ThemedCardTitle>
              <ThemedCardDescription>Longer delays between actions, minimal risk detection</ThemedCardDescription>
            </div>
            <ThemedCardContent spacing="lg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[safeConfig.minDelay]}
                      onValueChange={([value]) => setSafeConfig({ ...safeConfig, minDelay: value })}
                      min={10}
                      max={120}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={safeConfig.minDelay}
                      onChange={(e) => setSafeConfig({ ...safeConfig, minDelay: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[safeConfig.maxDelay]}
                      onValueChange={([value]) => setSafeConfig({ ...safeConfig, maxDelay: value })}
                      min={20}
                      max={180}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={safeConfig.maxDelay}
                      onChange={(e) => setSafeConfig({ ...safeConfig, maxDelay: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Actions Per Hour</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[safeConfig.actionsPerHour]}
                      onValueChange={([value]) => setSafeConfig({ ...safeConfig, actionsPerHour: value })}
                      min={5}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={safeConfig.actionsPerHour}
                      onChange={(e) => setSafeConfig({ ...safeConfig, actionsPerHour: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timing Randomization (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[safeConfig.randomization]}
                      onValueChange={([value]) => setSafeConfig({ ...safeConfig, randomization: value })}
                      min={0}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={safeConfig.randomization}
                      onChange={(e) => setSafeConfig({ ...safeConfig, randomization: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Higher randomization makes actions appear more human-like
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] smooth-transition border-2 border-primary/50 hover:border-primary">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => resetToDefaults("safe")}
                  className="gap-2 glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </ThemedCardContent>
          </ThemedCard>
        </ThemedTabsContent>

        <ThemedTabsContent value="fast">
          <ThemedCard variant="glass">
            <div className="p-6 border-b border-primary/10">
              <ThemedCardTitle size="lg" className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Fast Mode Configuration
              </ThemedCardTitle>
              <ThemedCardDescription>Moderate speed with balanced safety</ThemedCardDescription>
            </div>
            <ThemedCardContent spacing="lg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[fastConfig.minDelay]}
                      onValueChange={([value]) => setFastConfig({ ...fastConfig, minDelay: value })}
                      min={5}
                      max={60}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={fastConfig.minDelay}
                      onChange={(e) => setFastConfig({ ...fastConfig, minDelay: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[fastConfig.maxDelay]}
                      onValueChange={([value]) => setFastConfig({ ...fastConfig, maxDelay: value })}
                      min={10}
                      max={120}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={fastConfig.maxDelay}
                      onChange={(e) => setFastConfig({ ...fastConfig, maxDelay: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Actions Per Hour</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[fastConfig.actionsPerHour]}
                      onValueChange={([value]) => setFastConfig({ ...fastConfig, actionsPerHour: value })}
                      min={20}
                      max={200}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={fastConfig.actionsPerHour}
                      onChange={(e) => setFastConfig({ ...fastConfig, actionsPerHour: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timing Randomization (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[fastConfig.randomization]}
                      onValueChange={([value]) => setFastConfig({ ...fastConfig, randomization: value })}
                      min={0}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={fastConfig.randomization}
                      onChange={(e) => setFastConfig({ ...fastConfig, randomization: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] smooth-transition border-2 border-primary/50 hover:border-primary">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => resetToDefaults("fast")}
                  className="gap-2 glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </ThemedCardContent>
          </ThemedCard>
        </ThemedTabsContent>

        <ThemedTabsContent value="slow-effective">
          <ThemedCard variant="glass">
            <div className="p-6 border-b border-primary/10">
              <ThemedCardTitle size="lg" className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Slow but Effective Configuration
              </ThemedCardTitle>
              <ThemedCardDescription>Maximum effectiveness with careful timing</ThemedCardDescription>
            </div>
            <ThemedCardContent spacing="lg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[slowEffectiveConfig.minDelay]}
                      onValueChange={([value]) => setSlowEffectiveConfig({ ...slowEffectiveConfig, minDelay: value })}
                      min={30}
                      max={180}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={slowEffectiveConfig.minDelay}
                      onChange={(e) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, minDelay: Number(e.target.value) })
                      }
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[slowEffectiveConfig.maxDelay]}
                      onValueChange={([value]) => setSlowEffectiveConfig({ ...slowEffectiveConfig, maxDelay: value })}
                      min={60}
                      max={300}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={slowEffectiveConfig.maxDelay}
                      onChange={(e) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, maxDelay: Number(e.target.value) })
                      }
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Actions Per Hour</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[slowEffectiveConfig.actionsPerHour]}
                      onValueChange={([value]) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, actionsPerHour: value })
                      }
                      min={5}
                      max={50}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={slowEffectiveConfig.actionsPerHour}
                      onChange={(e) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, actionsPerHour: Number(e.target.value) })
                      }
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timing Randomization (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[slowEffectiveConfig.randomization]}
                      onValueChange={([value]) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, randomization: value })
                      }
                      min={0}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={slowEffectiveConfig.randomization}
                      onChange={(e) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, randomization: Number(e.target.value) })
                      }
                      className="w-20 glass-card"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] smooth-transition border-2 border-primary/50 hover:border-primary">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => resetToDefaults("slow-effective")}
                  className="gap-2 glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </ThemedCardContent>
          </ThemedCard>
        </ThemedTabsContent>
      </ThemedTabs>
    </div>
  )
}
