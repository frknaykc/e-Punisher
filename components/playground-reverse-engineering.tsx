"use client"

import { useState, useEffect } from "react"
import {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
  SessionCard,
  StatsCard,
  ContentCard,
  HeaderCard,
} from "@/components/ui/themed-card"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Play,
  Square,
  Radio,
  Save,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Code2,
  Network,
  Activity,
  Lock,
  LogOut,
  UserPlus,
  MessageSquare,
  Heart,
  Share2,
  Upload,
  User,
  Search,
  Rss,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import { apiClient, type PlaygroundStatusResponse, type CapturedEndpoint } from "@/lib/api-client"
import { AccountSelector } from "@/components/account-selector"

interface PlaygroundReverseEngineeringProps {
  demoMode: boolean
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
    return {
      protocol: "",
      hostname: "",
      path: url,
      search: "",
      hash: "",
    }
  }
}

function detectEndpointType(url: string, method: string): string {
  const lowerUrl = url.toLowerCase()
  const lowerMethod = method.toLowerCase()

  if (lowerUrl.includes("login") || lowerUrl.includes("signin") || lowerUrl.includes("auth/session")) return "login"
  if (lowerUrl.includes("logout") || lowerUrl.includes("signout")) return "logout"
  if (lowerUrl.includes("register") || lowerUrl.includes("signup")) return "register"
  if (lowerUrl.includes("tweet") && lowerMethod === "post") return "tweet"
  if (lowerUrl.includes("post") && lowerMethod === "post") return "post"
  if (lowerUrl.includes("like") || lowerUrl.includes("favorite")) return "like"
  if (lowerUrl.includes("retweet") || lowerUrl.includes("share")) return "share"
  if (lowerUrl.includes("follow")) return "follow"
  if (lowerUrl.includes("comment") || lowerUrl.includes("reply")) return "comment"
  if (lowerUrl.includes("upload") || lowerUrl.includes("media")) return "upload"
  if (lowerUrl.includes("profile") || lowerUrl.includes("user")) return "profile"
  if (lowerUrl.includes("search")) return "search"
  if (lowerUrl.includes("timeline") || lowerUrl.includes("feed")) return "feed"

  return "api"
}

function getEndpointIcon(type: string) {
  const icons: Record<string, any> = {
    login: Lock,
    logout: LogOut,
    register: UserPlus,
    post: MessageSquare,
    tweet: MessageSquare,
    like: Heart,
    share: Share2,
    follow: User,
    comment: MessageSquare,
    upload: Upload,
    profile: User,
    search: Search,
    feed: Rss,
    api: Network,
  }
  return icons[type] || Network
}

function getEndpointColor(type: string): string {
  const colors: Record<string, string> = {
    login: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    logout: "bg-gray-500/10 text-gray-500 border-gray-500/30",
    register: "bg-green-500/10 text-green-500 border-green-500/30",
    post: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    tweet: "bg-sky-500/10 text-sky-500 border-sky-500/30",
    like: "bg-pink-500/10 text-pink-500 border-pink-500/30",
    share: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    follow: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
    comment: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    upload: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    profile: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
    search: "bg-violet-500/10 text-violet-500 border-violet-500/30",
    feed: "bg-teal-500/10 text-teal-500 border-teal-500/30",
    api: "bg-primary/10 text-primary border-primary/30",
  }
  return colors[type] || colors.api
}

function UrlHighlight({ url }: { url: string }) {
  const parsed = parseUrl(url)

  return (
    <div className="font-mono text-xs break-all leading-relaxed">
      <span className="text-yellow-500 font-semibold">{parsed.protocol}</span>
      <span className="text-muted-foreground">://</span>
      <span className="text-blue-400 font-semibold">{parsed.hostname}</span>
      <span className="text-green-400">{parsed.path}</span>
      {parsed.search && <span className="text-purple-400">{parsed.search}</span>}
      {parsed.hash && <span className="text-orange-400">{parsed.hash}</span>}
    </div>
  )
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    POST: "bg-green-500/10 text-green-500 border-green-500/30",
    PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    DELETE: "bg-red-500/10 text-red-500 border-red-500/30",
    PATCH: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  }

  return (
    <Badge variant="outline" className={`${colors[method.toUpperCase()] || ""} font-mono text-xs`}>
      {method.toUpperCase()}
    </Badge>
  )
}

export function PlaygroundReverseEngineering({ demoMode }: PlaygroundReverseEngineeringProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("twitter")
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [isRecording, setIsRecording] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [sessionStatus, setSessionStatus] = useState<PlaygroundStatusResponse | null>(null)
  const [capturedEndpoints, setCapturedEndpoints] = useState<CapturedEndpoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAccountSelector, setShowAccountSelector] = useState(false)
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

  // Polling için session durumunu kontrol et
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording && sessionId) {
      interval = setInterval(async () => {
        try {
          const status = await apiClient.getPlaygroundStatus(sessionId)
          setSessionStatus(status)

          if (status.status === "completed" || status.status === "failed") {
            setIsRecording(false)
            if (status.status === "completed") {
              toast.success("Session completed!", {
                description: `Captured ${status.captured_endpoints_count} endpoints`,
              })
            } else {
              toast.error("Session failed", {
                description: "Check logs for details",
              })
            }
          }
        } catch (error: any) {
          console.error("Failed to fetch session status:", error)
        }
      }, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording, sessionId])

  // Kaydedilmiş endpoint'leri yükle
  const loadSavedEndpoints = async () => {
    try {
      const response = await apiClient.getCapturedEndpoints(selectedPlatform)
      setCapturedEndpoints(response.endpoints)
    } catch (error: any) {
      console.error("Failed to load endpoints:", error)
    }
  }

  // Load configured endpoints from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("configured_endpoints")
    if (stored) {
      try {
        // setConfiguredEndpoints(JSON.parse(stored)) // This line is removed
      } catch (error) {
        console.error("Failed to parse configured endpoints from localStorage:", error)
        localStorage.removeItem("configured_endpoints") // Clear corrupted data
      }
    }
  }, [])

  useEffect(() => {
    if (selectedPlatform) {
      loadSavedEndpoints()
    }
  }, [selectedPlatform])

  const handleStartRecording = async () => {
    if (!selectedAccounts[0]) {
      toast.error("Please select an account")
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.startPlaygroundSession({
        account_id: Number.parseInt(selectedAccounts[0]),
        platform: selectedPlatform,
        headless: false,
      })

      setSessionId(response.session_id)
      setIsRecording(true)
      setSessionStatus({
        session_id: response.session_id,
        status: "recording",
        platform: selectedPlatform,
        account_id: Number.parseInt(selectedAccounts[0]),
        captured_endpoints_count: 0,
        actions_performed: [],
        logs: [],
        started_at: new Date().toISOString(),
      })

      toast.success("Recording started!", {
        description: "Browser opening... Perform your actions manually",
      })
    } catch (error: any) {
      toast.error("Failed to start recording", {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopRecording = async () => {
    if (!sessionId) return

    setIsLoading(true)
    try {
      await apiClient.stopPlaygroundSession(sessionId)
      setIsRecording(false)

      toast.success("Recording stopped")

      // Session durumunu son bir kez çek
      const status = await apiClient.getPlaygroundStatus(sessionId)
      setSessionStatus(status)
    } catch (error: any) {
      toast.error("Failed to stop recording", {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecordAction = async (actionType: string) => {
    if (!sessionId) {
      toast.error("No active session")
      return
    }

    try {
      const result = await apiClient.recordPlaygroundAction(sessionId, {
        action_type: actionType,
        description: `Manual ${actionType} action`,
      })

      const endpointCount = result.endpoint_count || 0

      if (endpointCount > 0) {
        toast.success(`${actionType} action recorded!`, {
          description: `${endpointCount} related endpoint(s) captured`,
        })
      } else {
        toast.warning(`${actionType} action recorded`, {
          description: "No related endpoints found in last 10 seconds",
        })
      }

      // Session durumunu güncelle
      const status = await apiClient.getPlaygroundStatus(sessionId)
      setSessionStatus(status)
    } catch (error: any) {
      toast.error("Failed to record action", {
        description: error.message,
      })
    }
  }

  const handleSaveEndpoints = async () => {
    if (!sessionId || !sessionStatus) {
      toast.error("No session data to save")
      return
    }

    setIsLoading(true)
    try {
      // Backend otomatik olarak captured_requests'leri parse edip endpoint'lere dönüştürür
      const result = await apiClient.savePlaygroundEndpoints(sessionId)

      toast.success(`${result.saved_count} endpoints saved successfully!`)
      loadSavedEndpoints()
    } catch (error: any) {
      toast.error("Failed to save endpoints", {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyEndpointCode = (endpoint: CapturedEndpoint) => {
    const code = `
// ${endpoint.action_type} - ${endpoint.platform}
const response = await fetch("${endpoint.url}", {
  method: "${endpoint.method}",
  headers: ${JSON.stringify(endpoint.headers, null, 2)},
  body: JSON.stringify(${JSON.stringify(endpoint.payload_template, null, 2)})
}).then(res => res.json());
`.trim()

    navigator.clipboard.writeText(code)
    toast.success("Code copied to clipboard!")
  }

  const moveToConfiguration = (endpoint: CapturedEndpoint) => {
    const configured = {
      ...endpoint,
      configured_at: new Date().toISOString(),
      usage_description: endpoint.description || "No usage description provided yet",
      is_active: true,
    }

    const stored = localStorage.getItem("configured_endpoints")
    const existing = stored ? JSON.parse(stored) : []
    const updated = [...existing, configured]
    localStorage.setItem("configured_endpoints", JSON.stringify(updated))

    toast.success("Endpoint moved to configuration", {
      description: `${endpoint.action_type} endpoint is now available in Management → Configuration`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <HeaderCard>
        <ThemedCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <ThemedCardTitle size="2xl">Reverse Engineering Lab</ThemedCardTitle>
              <ThemedCardDescription>Capture API endpoints by performing manual actions</ThemedCardDescription>
            </div>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Radio className="h-3 w-3 mr-1" />
                Recording
              </Badge>
            )}
          </div>
        </ThemedCardHeader>
      </HeaderCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-4">
          <SessionCard>
            <ThemedCardHeader>
              <ThemedCardTitle size="lg">Session Setup</ThemedCardTitle>
            </ThemedCardHeader>
            <ThemedCardContent spacing="default">
              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform} disabled={isRecording}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter / X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Account Selection */}
              <div className="space-y-2">
                <Label>Account</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between bg-transparent"
                  onClick={() => setShowAccountSelector(!showAccountSelector)}
                  disabled={isRecording}
                >
                  <span>
                    {selectedAccounts.length > 0 ? `Account ${selectedAccounts[0]} selected` : "Select an account"}
                  </span>
                </Button>
              </div>

              {/* Record Controls */}
              <div className="space-y-2 pt-4">
                {!isRecording ? (
                  <Button
                    onClick={handleStartRecording}
                    disabled={isLoading || !selectedAccounts[0]}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Recording
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={handleStopRecording} disabled={isLoading} variant="destructive" className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Stopping...
                      </>
                    ) : (
                      <>
                        <Square className="mr-2 h-4 w-4" />
                        Stop Recording
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Manual Actions */}
              {isRecording && (
                <div className="space-y-2 pt-4 border-t">
                  <Label className="text-xs text-muted-foreground">Record Manual Actions:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecordAction("login")}
                      className="hover:bg-primary/10 hover:border-primary hover:text-primary active:scale-95 transition-all duration-150"
                    >
                      🔐 Login
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecordAction("post")}
                      className="hover:bg-primary/10 hover:border-primary hover:text-primary active:scale-95 transition-all duration-150"
                    >
                      📝 Post
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecordAction("like")}
                      className="hover:bg-primary/10 hover:border-primary hover:text-primary active:scale-95 transition-all duration-150"
                    >
                      ❤️ Like
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecordAction("retweet")}
                      className="hover:bg-primary/10 hover:border-primary hover:text-primary active:scale-95 transition-all duration-150"
                    >
                      🔁 Share
                    </Button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {sessionStatus && sessionStatus.captured_endpoints_count > 0 && (
                <Button onClick={handleSaveEndpoints} disabled={isLoading} variant="secondary" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save {sessionStatus.captured_endpoints_count} Endpoints
                </Button>
              )}
            </ThemedCardContent>
          </SessionCard>

          {/* Session Stats */}
          {sessionStatus && (
            <StatsCard>
              <ThemedCardHeader>
                <ThemedCardTitle size="sm">Session Stats</ThemedCardTitle>
              </ThemedCardHeader>
              <ThemedCardContent spacing="sm">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={sessionStatus.status === "recording" ? "default" : "secondary"}>
                    {sessionStatus.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Requests:</span>
                  <span className="font-medium">{sessionStatus.captured_endpoints_count}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Actions Recorded:</span>
                  <Badge variant="outline" className="font-medium">
                    {sessionStatus.actions_performed.length}
                  </Badge>
                </div>
                {sessionStatus.actions_performed.length > 0 && (
                  <div className="pt-2 border-t space-y-1">
                    <div className="text-xs text-muted-foreground font-semibold">Action Breakdown:</div>
                    {sessionStatus.actions_performed.map((action, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="capitalize">{action.action_type}:</span>
                        <span className="text-muted-foreground">{action.endpoint_count || 0} endpoints</span>
                      </div>
                    ))}
                  </div>
                )}
              </ThemedCardContent>
            </StatsCard>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2">
          <ThemedTabs defaultValue="live">
            <ThemedTabsList variant="glass">
              <ThemedTabsTrigger value="live" variant="glow">
                <Activity className="h-4 w-4 mr-2" />
                Live Capture
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="saved" variant="glow">
                <Save className="h-4 w-4 mr-2" />
                Saved Endpoints
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="logs" variant="glow">
                <Network className="h-4 w-4 mr-2" />
                Logs
              </ThemedTabsTrigger>
            </ThemedTabsList>

            {/* Live Capture Tab */}
            <ThemedTabsContent value="live">
              <ContentCard>
                <ThemedCardHeader>
                  <ThemedCardTitle size="lg">Live Network Capture</ThemedCardTitle>
                  <ThemedCardDescription>
                    {isRecording
                      ? "Performing actions in the browser will capture API requests here"
                      : "Start recording to begin capturing network requests"}
                  </ThemedCardDescription>
                </ThemedCardHeader>
                <ThemedCardContent>
                  {sessionStatus && (sessionStatus.logs.length > 0 || sessionStatus.actions_performed.length > 0) ? (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {/* Actions ve Logs'u birleştir ve sırala */}
                      {[
                        ...sessionStatus.actions_performed.map((a) => ({ ...a, type: "action" })),
                        ...sessionStatus.logs.map((l) => ({ ...l, type: "log" })),
                      ]
                        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                        .map((item, idx) => {
                          if (item.type === "action") {
                            const action = item as any
                            return (
                              <div
                                key={`action-${idx}`}
                                className="p-4 rounded-lg bg-primary/10 border-2 border-primary/30 hover:border-primary/50 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-semibold text-primary uppercase text-sm">
                                        {action.action_type}
                                      </span>
                                      <Badge variant="secondary" className="text-xs">
                                        {action.endpoint_count || 0} endpoints
                                      </Badge>
                                      <span className="text-xs text-muted-foreground ml-auto">
                                        {new Date(action.timestamp).toLocaleTimeString()}
                                      </span>
                                    </div>

                                    {action.related_endpoints && action.related_endpoints.length > 0 && (
                                      <div className="space-y-2">
                                        {action.related_endpoints.slice(0, 5).map((endpoint: any, eIdx: number) => {
                                          const endpointType = detectEndpointType(endpoint.url, endpoint.method)
                                          const EndpointIcon = getEndpointIcon(endpointType)

                                          return (
                                            <div
                                              key={eIdx}
                                              className="p-3 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors"
                                            >
                                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <MethodBadge method={endpoint.method} />
                                                <Badge className={`text-xs ${getEndpointColor(endpointType)}`}>
                                                  <EndpointIcon className="h-3 w-3 mr-1" />
                                                  {endpointType}
                                                </Badge>
                                                {endpoint.status && (
                                                  <Badge
                                                    variant={endpoint.status < 400 ? "default" : "destructive"}
                                                    className="text-xs"
                                                  >
                                                    {endpoint.status}
                                                  </Badge>
                                                )}
                                                <span className="text-xs text-muted-foreground ml-auto">
                                                  {new Date(endpoint.timestamp).toLocaleTimeString()}
                                                </span>
                                              </div>
                                              <UrlHighlight url={endpoint.url} />
                                            </div>
                                          )
                                        })}
                                        {action.related_endpoints.length > 5 && (
                                          <div className="text-xs text-muted-foreground text-center py-2">
                                            +{action.related_endpoints.length - 5} more endpoints
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          } else {
                            const log = item as any
                            return (
                              <div key={`log-${idx}`} className="p-3 rounded-lg bg-background/50 border border-border">
                                <div className="flex items-start gap-2">
                                  {log.level === "error" ? (
                                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs">
                                        {log.level}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                      </span>
                                    </div>
                                    <div className={`text-sm ${log.level === "error" ? "text-destructive" : ""}`}>
                                      {log.message}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">
                        {isRecording ? "Waiting for network activity..." : "No active session"}
                      </p>
                      <p className="text-xs mt-1">
                        {isRecording
                          ? "Perform actions in the browser to capture endpoints"
                          : "Click 'Start Recording' to begin"}
                      </p>
                    </div>
                  )}
                </ThemedCardContent>
              </ContentCard>
            </ThemedTabsContent>

            {/* Saved Endpoints Tab */}
            <ThemedTabsContent value="saved">
              <ContentCard>
                <ThemedCardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <ThemedCardTitle size="lg">Saved Endpoints</ThemedCardTitle>
                      <ThemedCardDescription>
                        {capturedEndpoints.length} endpoint(s) available for {selectedPlatform}
                      </ThemedCardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadSavedEndpoints}>
                      Refresh
                    </Button>
                  </div>
                </ThemedCardHeader>
                <ThemedCardContent>
                  {capturedEndpoints.length > 0 ? (
                    <div className="space-y-4">
                      {capturedEndpoints.map((endpoint) => {
                        const endpointType = detectEndpointType(endpoint.url, endpoint.method)
                        const EndpointIcon = getEndpointIcon(endpointType)

                        return (
                          <div
                            key={endpoint.id}
                            className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors bg-background/50"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <MethodBadge method={endpoint.method} />
                                <Badge className={`text-xs ${getEndpointColor(endpointType)}`}>
                                  <EndpointIcon className="h-3 w-3 mr-1" />
                                  {endpointType}
                                </Badge>
                                <span className="font-medium capitalize text-sm">{endpoint.action_type}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {endpoint.platform}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => moveToConfiguration(endpoint)}
                                  className="h-8 w-8 text-primary hover:text-primary"
                                  title="Move to Configuration"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyEndpointCode(endpoint)}
                                  className="h-8 w-8"
                                  title="Copy code"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  title="Delete endpoint"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="mb-3 p-3 rounded-lg bg-background border border-border">
                              <UrlHighlight url={endpoint.url} />
                            </div>

                            {endpoint.description && (
                              <details className="mt-3 p-3 rounded-lg bg-background/50 border border-border">
                                <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-2">
                                  <Code2 className="h-4 w-4" />
                                  Usage Guide & Code Examples
                                </summary>
                                <div className="mt-3 text-xs text-muted-foreground whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                                  {endpoint.description}
                                </div>
                              </details>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Code2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No saved endpoints yet</p>
                      <p className="text-xs mt-1">Start recording to capture API endpoints</p>
                    </div>
                  )}
                </ThemedCardContent>
              </ContentCard>
            </ThemedTabsContent>

            {/* Logs Tab */}
            <ThemedTabsContent value="logs">
              <ContentCard>
                <ThemedCardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <ThemedCardTitle size="lg">Session Activity Log</ThemedCardTitle>
                      <ThemedCardDescription>Detailed timeline of all actions and events</ThemedCardDescription>
                    </div>
                    {sessionStatus && (
                      <Badge variant="outline">
                        {sessionStatus.actions_performed.length} actions • {sessionStatus.logs.length} events
                      </Badge>
                    )}
                  </div>
                </ThemedCardHeader>
                <ThemedCardContent>
                  {sessionStatus && sessionStatus.actions_performed.length > 0 ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {sessionStatus.actions_performed.map((action, idx) => (
                        <div key={idx} className="border-l-4 border-primary pl-4 py-3 bg-primary/5 rounded-r-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary uppercase text-sm">{action.action_type}</span>
                            <Badge variant="secondary" className="text-xs">
                              {action.endpoint_count || 0} endpoints
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(action.timestamp).toLocaleString()}
                            </span>
                          </div>

                          {action.description && (
                            <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                          )}

                          {action.related_endpoints && action.related_endpoints.length > 0 && (
                            <details className="mt-3">
                              <summary className="cursor-pointer text-xs text-primary hover:text-primary/80 font-medium">
                                View captured endpoints ({action.related_endpoints.length})
                              </summary>
                              <div className="mt-2 space-y-2 pl-2">
                                {action.related_endpoints.map((endpoint: any, eIdx: number) => {
                                  const endpointType = detectEndpointType(endpoint.url, endpoint.method)
                                  const EndpointIcon = getEndpointIcon(endpointType)

                                  return (
                                    <div key={eIdx} className="p-3 bg-background rounded-lg border border-border">
                                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <MethodBadge method={endpoint.method} />
                                        <Badge className={`text-xs ${getEndpointColor(endpointType)}`}>
                                          <EndpointIcon className="h-3 w-3 mr-1" />
                                          {endpointType}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground ml-auto">
                                          {new Date(endpoint.timestamp).toLocaleTimeString()}
                                        </span>
                                      </div>
                                      <UrlHighlight url={endpoint.url} />
                                    </div>
                                  )
                                })}
                              </div>
                            </details>
                          )}
                        </div>
                      ))}

                      {/* System logs */}
                      {sessionStatus.logs.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                            <Network className="h-4 w-4" />
                            System Events
                          </h4>
                          <div className="space-y-2">
                            {sessionStatus.logs.map((log, idx) => (
                              <div
                                key={idx}
                                className="flex gap-3 text-xs p-2 rounded-lg bg-background/50 border border-border"
                              >
                                <Badge variant="outline" className="text-xs">
                                  {log.level}
                                </Badge>
                                <span className="text-muted-foreground font-mono">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                <span
                                  className={`flex-1 ${log.level === "error" ? "text-destructive" : "text-muted-foreground"}`}
                                >
                                  {log.message}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">No actions recorded yet</p>
                      <p className="text-xs mt-1">Perform actions in the browser and click the action buttons</p>
                    </div>
                  )}
                </ThemedCardContent>
              </ContentCard>
            </ThemedTabsContent>
          </ThemedTabs>
        </div>
      </div>

      {/* Account Selector Modal */}
      {showAccountSelector && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ThemedCard variant="glass">
            <ThemedCardHeader>
              <div className="flex items-center justify-between">
                <ThemedCardTitle>Select Account</ThemedCardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAccountSelector(false)}>
                  ×
                </Button>
              </div>
            </ThemedCardHeader>
            <ThemedCardContent>
              <AccountSelector
                platform={selectedPlatform as any}
                selectedAccounts={selectedAccounts}
                onAccountsChange={(accounts) => {
                  setSelectedAccounts(accounts.slice(0, 1)) // Sadece 1 hesap seç
                  setShowAccountSelector(false)
                }}
              />
            </ThemedCardContent>
          </ThemedCard>
        </div>
      )}
    </div>
  )
}
