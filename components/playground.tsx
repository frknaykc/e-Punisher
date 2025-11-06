"use client"

import { useState } from "react"
import { PlaygroundReverseEngineering } from "@/components/playground-reverse-engineering"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Square,
  Save,
  Upload,
  Sparkles,
  Brain,
  Cog,
  Search,
  FileText,
  Workflow,
  Terminal,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Copy,
  Zap,
} from "lucide-react"

interface PlaygroundProps {
  demoMode?: boolean
}

export function Playground({ demoMode = true }: PlaygroundProps) {
  const [activeTab, setActiveTab] = useState("reverse-engineering")
  const [environment, setEnvironment] = useState("sandbox")
  const [mode, setMode] = useState("ai")
  const [isRunning, setIsRunning] = useState(false)
  const [selectedView, setSelectedView] = useState("console")

  const logs = [
    { time: "14:32:01", type: "success", message: "Workflow initialized successfully" },
    { time: "14:32:03", type: "info", message: "Connecting to Twitter API..." },
    { time: "14:32:05", type: "success", message: "Authentication successful" },
    { time: "14:32:07", type: "warning", message: "Rate limit: 180/180 requests remaining" },
    { time: "14:32:09", type: "info", message: "Processing 15 accounts..." },
  ]

  const aiNotes = [
    "Consider adding a 2-3 second delay between actions to avoid rate limits",
    "Current engagement pattern shows 85% success rate",
    "Recommended: Switch to 'Safe' mode for production deployment",
  ]

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Tab Navigation */}
      <ThemedTabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <ThemedTabsList variant="glass">
          <ThemedTabsTrigger value="reverse-engineering" variant="glow">
            <Workflow className="h-4 w-4 mr-2" />
            Reverse Engineering
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="automation-test" variant="glow">
            <Terminal className="h-4 w-4 mr-2" />
            Automation Testing
          </ThemedTabsTrigger>
        </ThemedTabsList>

        {/* Reverse Engineering Tab */}
        <ThemedTabsContent value="reverse-engineering">
          <PlaygroundReverseEngineering demoMode={demoMode} />
        </ThemedTabsContent>

        {/* Automation Testing Tab */}
        <ThemedTabsContent value="automation-test">
          <Card className="glass-card border-2 border-primary/40">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Left side - Environment and Mode */}
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Environment</Label>
                    <Select value={environment} onValueChange={setEnvironment}>
                      <SelectTrigger className="w-[180px] bg-background/50 border-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Local Sandbox</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production Shadow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Mode</Label>
                    <Select value={mode} onValueChange={setMode}>
                      <SelectTrigger className="w-[180px] bg-background/50 border-primary/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            AI Mode
                          </div>
                        </SelectItem>
                        <SelectItem value="automation">
                          <div className="flex items-center gap-2">
                            <Cog className="h-4 w-4" />
                            Automation Mode
                          </div>
                        </SelectItem>
                        <SelectItem value="osint">
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            OSINT Mode
                          </div>
                        </SelectItem>
                        <SelectItem value="content">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Content Mode
                          </div>
                        </SelectItem>
                        <SelectItem value="mixed">
                          <div className="flex items-center gap-2">
                            <Workflow className="h-4 w-4" />
                            Mixed Mode
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
                  >
                    <Upload className="h-4 w-4" />
                    Import Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
                  >
                    <Save className="h-4 w-4" />
                    Save Preset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 bg-transparent"
                  >
                    <Sparkles className="h-4 w-4" />
                    Optimize with AI
                  </Button>
                  {isRunning ? (
                    <Button
                      size="sm"
                      className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30"
                      onClick={() => setIsRunning(false)}
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                      onClick={() => setIsRunning(true)}
                    >
                      <Play className="h-4 w-4" />
                      Run Simulation
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
            {/* Left Panel - Editor/Builder */}
            <Card className="glass-card border-2 border-primary/40 flex flex-col">
              <CardHeader className="gradient-overlay border-b border-primary/10">
                <CardTitle className="text-lg flex items-center gap-2">
                  {mode === "ai" && (
                    <>
                      <Brain className="h-5 w-5 text-primary" /> AI Prompt Editor
                    </>
                  )}
                  {mode === "automation" && (
                    <>
                      <Cog className="h-5 w-5 text-primary" /> Workflow Builder
                    </>
                  )}
                  {mode === "osint" && (
                    <>
                      <Search className="h-5 w-5 text-primary" /> Query Builder
                    </>
                  )}
                  {mode === "content" && (
                    <>
                      <FileText className="h-5 w-5 text-primary" /> Content Creator
                    </>
                  )}
                  {mode === "mixed" && (
                    <>
                      <Workflow className="h-5 w-5 text-primary" /> Flow Designer
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 overflow-auto">
                {/* AI Mode */}
                {mode === "ai" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>AI Model</Label>
                      <Select defaultValue="gpt4">
                        <SelectTrigger className="bg-background/50 border-primary/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt4">GPT-4</SelectItem>
                          <SelectItem value="claude">Claude 3</SelectItem>
                          <SelectItem value="gemini">Gemini Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prompt</Label>
                      <Textarea
                        placeholder="Enter your AI prompt here..."
                        className="min-h-[300px] bg-background/50 border-primary/30 font-mono text-sm"
                        defaultValue="Generate a viral tweet about AI technology that includes trending hashtags and engaging call-to-action."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-primary/30 hover:border-primary/50 bg-transparent"
                      >
                        Compare Models
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-primary/30 hover:border-primary/50 bg-transparent"
                      >
                        Version History
                      </Button>
                    </div>
                  </div>
                )}

                {/* Automation Mode */}
                {mode === "automation" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-background/50 border border-primary/20 rounded-lg space-y-3">
                      <div className="text-sm font-medium text-muted-foreground">Workflow Steps</div>
                      {[
                        { icon: "🔐", label: "Login to Twitter", status: "completed" },
                        { icon: "📥", label: "Fetch Posts (Hashtag: #AI)", status: "completed" },
                        { icon: "❤️", label: "Like Posts (15 items)", status: "running" },
                        { icon: "💬", label: "Comment with Template", status: "pending" },
                        { icon: "⏱️", label: "Wait (30 seconds)", status: "pending" },
                      ].map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-background/30 border border-primary/10 rounded hover:border-primary/30 smooth-transition"
                        >
                          <span className="text-xl">{step.icon}</span>
                          <span className="flex-1 text-sm">{step.label}</span>
                          <Badge
                            variant={
                              step.status === "completed"
                                ? "default"
                                : step.status === "running"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {step.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30">
                      <Zap className="h-4 w-4" />
                      Add New Step
                    </Button>
                  </div>
                )}

                {/* OSINT Mode */}
                {mode === "osint" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Search Query</Label>
                      <Input
                        placeholder="@username or #hashtag or keyword"
                        className="bg-background/50 border-primary/30"
                        defaultValue="#darkmarket"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Range</Label>
                      <Select defaultValue="48h">
                        <SelectTrigger className="bg-background/50 border-primary/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">Last 24 hours</SelectItem>
                          <SelectItem value="48h">Last 48 hours</SelectItem>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Data Sources</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Twitter", "Reddit", "Telegram", "Pastebin", "Discord", "4chan"].map((source) => (
                          <Button
                            key={source}
                            variant="outline"
                            size="sm"
                            className="justify-start border-primary/30 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
                          >
                            <input type="checkbox" className="mr-2" defaultChecked={source === "Twitter"} />
                            {source}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Mode */}
                {mode === "content" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select defaultValue="twitter">
                        <SelectTrigger className="bg-background/50 border-primary/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Content Type</Label>
                      <Select defaultValue="text">
                        <SelectTrigger className="bg-background/50 border-primary/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Post</SelectItem>
                          <SelectItem value="image">Image + Caption</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>AI Prompt for Content</Label>
                      <Textarea
                        placeholder="Describe the content you want to create..."
                        className="min-h-[200px] bg-background/50 border-primary/30"
                        defaultValue="Create an engaging post about the future of AI in social media marketing"
                      />
                    </div>
                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                      <Sparkles className="h-4 w-4" />
                      Generate Content
                    </Button>
                  </div>
                )}

                {/* Mixed Mode */}
                {mode === "mixed" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-background/50 border border-primary/20 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground mb-3">Flow Nodes</div>
                      <div className="space-y-2">
                        {[
                          { type: "OSINT", label: "Scan Hashtag", color: "purple" },
                          { type: "AI", label: "Analyze Sentiment", color: "blue" },
                          { type: "Bot", label: "Auto Engage", color: "red" },
                          { type: "Output", label: "Send to Discord", color: "green" },
                        ].map((node, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${node.color}-500`} />
                            <div className="flex-1 p-2 bg-background/30 border border-primary/10 rounded text-sm">
                              <span className="font-medium">{node.type}:</span> {node.label}
                            </div>
                            {idx < 3 && <div className="text-muted-foreground">→</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30">
                      <Workflow className="h-4 w-4" />
                      Add Node
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Panel - Output/Monitor */}
            <Card className="glass-card border-2 border-primary/40 flex flex-col">
              <ThemedTabs value={selectedView} onValueChange={setSelectedView} className="flex flex-col h-full">
                <CardHeader className="gradient-overlay border-b border-primary/10">
                  <ThemedTabsList variant="glass">
                    <ThemedTabsTrigger value="console" variant="glow">
                      <Terminal className="h-4 w-4 mr-2" />
                      Console
                    </ThemedTabsTrigger>
                    <ThemedTabsTrigger value="graph" variant="glow">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Graph
                    </ThemedTabsTrigger>
                    <ThemedTabsTrigger value="preview" variant="glow">
                      <FileText className="h-4 w-4 mr-2" />
                      Preview
                    </ThemedTabsTrigger>
                  </ThemedTabsList>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-auto">
                  <ThemedTabsContent value="console" className="mt-0 space-y-2 h-full">
                    {logs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-2 rounded text-sm font-mono ${
                          log.type === "success"
                            ? "bg-green-500/10 text-green-400"
                            : log.type === "warning"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : log.type === "error"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {log.type === "success" && <CheckCircle className="h-4 w-4 mt-0.5" />}
                        {log.type === "warning" && <AlertCircle className="h-4 w-4 mt-0.5" />}
                        {log.type === "info" && <Clock className="h-4 w-4 mt-0.5" />}
                        <div className="flex-1">
                          <span className="text-muted-foreground">[{log.time}]</span> {log.message}
                        </div>
                      </div>
                    ))}
                  </ThemedTabsContent>
                  <ThemedTabsContent value="graph" className="mt-0 h-full">
                    <div className="h-full flex items-center justify-center border border-primary/20 rounded-lg bg-background/30">
                      <div className="text-center text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Execution graph will appear here</p>
                      </div>
                    </div>
                  </ThemedTabsContent>
                  <ThemedTabsContent value="preview" className="mt-0 h-full">
                    <div className="space-y-4">
                      <div className="p-4 bg-background/50 border border-primary/20 rounded-lg">
                        <div className="text-sm font-medium mb-2">Generated Output</div>
                        <div className="text-sm text-muted-foreground">
                          Preview of generated content or simulation results will appear here
                        </div>
                      </div>
                    </div>
                  </ThemedTabsContent>
                </CardContent>
              </ThemedTabs>
            </Card>
          </div>

          <Card className="glass-card border-2 border-primary/40">
            <CardContent className="p-4">
              <ThemedTabs defaultValue="logs" className="w-full">
                <div className="flex items-center justify-between mb-3">
                  <ThemedTabsList variant="glass">
                    <ThemedTabsTrigger value="logs" variant="glow">
                      Console Logs
                    </ThemedTabsTrigger>
                    <ThemedTabsTrigger value="ai" variant="glow">
                      AI Notes
                    </ThemedTabsTrigger>
                  </ThemedTabsList>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                <ThemedTabsContent value="logs" className="mt-0 max-h-[150px] overflow-auto">
                  <div className="space-y-1 font-mono text-xs">
                    {logs.map((log, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-muted-foreground">[{log.time}]</span>
                        <span
                          className={
                            log.type === "success"
                              ? "text-green-400"
                              : log.type === "warning"
                                ? "text-yellow-400"
                                : log.type === "error"
                                  ? "text-red-400"
                                  : "text-blue-400"
                          }
                        >
                          [{log.type.toUpperCase()}]
                        </span>
                        <span>{log.message}</span>
                      </div>
                    ))}
                  </div>
                </ThemedTabsContent>
                <ThemedTabsContent value="ai" className="mt-0 max-h-[150px] overflow-auto">
                  <div className="space-y-2">
                    {aiNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded text-sm"
                      >
                        <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-purple-200">{note}</span>
                      </div>
                    ))}
                  </div>
                </ThemedTabsContent>
              </ThemedTabs>
            </CardContent>
          </Card>
        </ThemedTabsContent>
      </ThemedTabs>
    </div>
  )
}
