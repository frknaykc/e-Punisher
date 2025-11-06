"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Square,
  Radio,
  Save,
  Trash2,
  Copy,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Code2,
  Network,
  Activity,
} from "lucide-react"
import { toast } from "sonner"
import { apiClient, type Account, type PlaygroundStatusResponse, type CapturedEndpoint } from "@/lib/api-client"
import { AccountSelector } from "@/components/account-selector"

interface PlaygroundReverseEngineeringProps {
  demoMode: boolean
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
        account_id: parseInt(selectedAccounts[0]),
        platform: selectedPlatform,
        headless: false,
      })
      
      setSessionId(response.session_id)
      setIsRecording(true)
      setSessionStatus({
        session_id: response.session_id,
        status: "recording",
        platform: selectedPlatform,
        account_id: parseInt(selectedAccounts[0]),
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
});
`.trim()

    navigator.clipboard.writeText(code)
    toast.success("Code copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Reverse Engineering Lab</CardTitle>
              <CardDescription>
                Capture API endpoints by performing manual actions
              </CardDescription>
            </div>
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <Radio className="h-3 w-3 mr-1" />
                Recording
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Session Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  className="w-full justify-between"
                  onClick={() => setShowAccountSelector(!showAccountSelector)}
                  disabled={isRecording}
                >
                  <span>
                    {selectedAccounts.length > 0
                      ? `Account ${selectedAccounts[0]} selected`
                      : "Select an account"}
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
                  <Button
                    onClick={handleStopRecording}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
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
                <Button
                  onClick={handleSaveEndpoints}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save {sessionStatus.captured_endpoints_count} Endpoints
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Session Stats */}
          {sessionStatus && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={sessionStatus.status === "recording" ? "default" : "secondary"}>
                    {sessionStatus.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Requests:</span>
                  <span className="font-medium">{sessionStatus.captured_endpoints_count}</span>
                </div>
                <div className="flex justify-between items-center">
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
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="live" className="space-y-4">
            <TabsList className="glass-card">
              <TabsTrigger value="live">
                <Activity className="h-4 w-4 mr-2" />
                Live Capture
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Save className="h-4 w-4 mr-2" />
                Saved Endpoints
              </TabsTrigger>
              <TabsTrigger value="logs">
                <Network className="h-4 w-4 mr-2" />
                Logs
              </TabsTrigger>
            </TabsList>

            {/* Live Capture Tab */}
            <TabsContent value="live" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Live Network Capture</CardTitle>
                  <CardDescription>
                    {isRecording
                      ? "Performing actions in the browser will capture API requests here"
                      : "Start recording to begin capturing network requests"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sessionStatus && (sessionStatus.logs.length > 0 || sessionStatus.actions_performed.length > 0) ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {/* Actions ve Logs'u birleştir ve sırala */}
                      {[...sessionStatus.actions_performed.map(a => ({...a, type: 'action'})), 
                        ...sessionStatus.logs.map(l => ({...l, type: 'log'}))]
                        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                        .map((item, idx) => {
                          if (item.type === 'action') {
                            const action = item as any
                            return (
                              <div key={`action-${idx}`} className="p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
                                <div className="flex items-start gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-primary uppercase">{action.action_type}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {action.endpoint_count || 0} endpoints
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                      {new Date(action.timestamp).toLocaleTimeString()}
                                    </div>
                                    {action.related_endpoints && action.related_endpoints.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        <div className="text-xs font-medium text-primary">Captured Endpoints:</div>
                                        {action.related_endpoints.slice(0, 3).map((endpoint: any, eIdx: number) => (
                                          <div key={eIdx} className="text-xs font-mono text-muted-foreground pl-2 border-l-2 border-primary/30">
                                            <span className="text-primary font-semibold">{endpoint.method}</span> {endpoint.url.substring(0, 80)}...
                                          </div>
                                        ))}
                                        {action.related_endpoints.length > 3 && (
                                          <div className="text-xs text-muted-foreground pl-2">
                                            +{action.related_endpoints.length - 3} more endpoints
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
                              <div
                                key={`log-${idx}`}
                                className="p-3 rounded-lg bg-background/50 border border-border text-sm font-mono"
                              >
                                <div className="flex items-start gap-2">
                                  {log.level === "error" ? (
                                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(log.timestamp).toLocaleTimeString()}
                                    </div>
                                    <div className={log.level === "error" ? "text-destructive" : ""}>
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
                      {isRecording ? "Waiting for network activity..." : "No active session"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Saved Endpoints Tab */}
            <TabsContent value="saved" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Saved Endpoints</CardTitle>
                      <CardDescription>
                        {capturedEndpoints.length} endpoint(s) available for {selectedPlatform}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadSavedEndpoints}>
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {capturedEndpoints.length > 0 ? (
                    <div className="space-y-3">
                      {capturedEndpoints.map((endpoint) => (
                        <div
                          key={endpoint.id}
                          className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{endpoint.method}</Badge>
                              <span className="font-medium capitalize">{endpoint.action_type}</span>
                              <Badge variant="secondary" className="text-xs">
                                {endpoint.platform}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyEndpointCode(endpoint)}
                                className="h-7 w-7"
                                title="Copy code"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                title="Delete endpoint"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground font-mono break-all mb-3">
                            {endpoint.url}
                          </div>
                          {endpoint.description && (
                            <details className="mt-3 p-3 rounded bg-background/50 border border-border">
                              <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80">
                                📖 Kullanım Kılavuzu ve Kod Örnekleri
                              </summary>
                              <div className="mt-3 text-xs text-muted-foreground whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                                {endpoint.description}
                              </div>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Code2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No saved endpoints yet</p>
                      <p className="text-xs mt-1">Start recording to capture API endpoints</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Session Activity Log</CardTitle>
                      <CardDescription>Detailed timeline of all actions and events</CardDescription>
                    </div>
                    {sessionStatus && (
                      <Badge variant="outline">
                        {sessionStatus.actions_performed.length} actions • {sessionStatus.logs.length} events
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {sessionStatus && sessionStatus.actions_performed.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {sessionStatus.actions_performed.map((action, idx) => (
                        <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary uppercase text-sm">
                              {action.action_type}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(action.timestamp).toLocaleString()}
                            </span>
                          </div>
                          
                          {action.description && (
                            <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                          )}
                          
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="secondary" className="text-xs">
                              {action.endpoint_count || 0} endpoints captured
                            </Badge>
                          </div>
                          
                          {action.related_endpoints && action.related_endpoints.length > 0 && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-xs text-primary hover:text-primary/80">
                                View captured endpoints ({action.related_endpoints.length})
                              </summary>
                              <div className="mt-2 space-y-1 pl-2">
                                {action.related_endpoints.map((endpoint: any, eIdx: number) => (
                                  <div key={eIdx} className="font-mono text-xs p-2 bg-background/50 rounded border border-border">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs">{endpoint.method}</Badge>
                                      <span className="text-muted-foreground">
                                        {new Date(endpoint.timestamp).toLocaleTimeString()}
                                      </span>
                                    </div>
                                    <div className="text-muted-foreground break-all">
                                      {endpoint.url}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      ))}
                      
                      {/* System logs */}
                      {sessionStatus.logs.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">System Events</h4>
                          <div className="space-y-1 font-mono text-xs">
                            {sessionStatus.logs.map((log, idx) => (
                              <div key={idx} className="flex gap-2">
                                <span className="text-muted-foreground">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                <span className={log.level === "error" ? "text-destructive" : "text-muted-foreground"}>
                                  [{log.level}]
                                </span>
                                <span className="text-muted-foreground">{log.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No actions recorded yet</p>
                      <p className="text-xs mt-1">
                        Perform actions in the browser and click the action buttons
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Account Selector Modal */}
      {showAccountSelector && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Select Account</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAccountSelector(false)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AccountSelector
                platform={selectedPlatform as any}
                selectedAccounts={selectedAccounts}
                onAccountsChange={(accounts) => {
                  setSelectedAccounts(accounts.slice(0, 1)) // Sadece 1 hesap seç
                  setShowAccountSelector(false)
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

