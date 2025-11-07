"use client"

import { Select } from "@/components/ui/select"

import { SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import { useState } from "react"
import { ThemedCard, ThemedCardContent, HeaderCard } from "@/components/ui/themed-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import { Database, Search, Plus, Map, Globe, Settings, Table, Code, Loader2, CheckCircle2, AlertCircle, Trash2, Eye, RefreshCw } from "lucide-react"
import { apiClient, type ScrapeResponse, type ScrapingSession } from "@/lib/api-client"
import { toast } from "sonner"
import { useEffect } from "react"

interface EMinerProps {
  demoMode: boolean
}

export function EMiner({ demoMode }: EMinerProps) {
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState<"markdown" | "json" | "html" | "text" | "csv">("markdown")
  const [activeTab, setActiveTab] = useState("scrape")
  const [isLoading, setIsLoading] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<ScrapeResponse | null>(null)
  
  // History
  const [sessions, setSessions] = useState<ScrapingSession[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [selectedSession, setSelectedSession] = useState<ScrapingSession | null>(null)

  // Load scraping sessions
  const loadSessions = async () => {
    setIsLoadingSessions(true)
    try {
      const response = await apiClient.getScrapingSessions(0, 50)
      setSessions(response.sessions)
    } catch (error: any) {
      toast.error("Failed to load sessions", {
        description: error.message,
      })
    } finally {
      setIsLoadingSessions(false)
    }
  }

  // Load sessions on mount
  useEffect(() => {
    loadSessions()
  }, [])

  const handleStartScraping = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL")
      return
    }

    setIsLoading(true)
    setScrapeResult(null)

    try {
      const result = await apiClient.scrapeWebsite({
        url: url,
        format: format,
      })

      setScrapeResult(result)
      toast.success("Scraping completed!", {
        description: `${result.metadata.links_count} links, ${result.metadata.headings_count} headings found`,
      })
      
      // Reload sessions to show the new one
      loadSessions()
    } catch (error: any) {
      toast.error("Scraping failed", {
        description: error.message || "Failed to scrape the website",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: number) => {
    try {
      await apiClient.deleteScrapingSession(sessionId)
      toast.success("Session deleted")
      loadSessions()
    } catch (error: any) {
      toast.error("Failed to delete session", {
        description: error.message,
      })
    }
  }

  const handleViewSession = async (sessionId: number) => {
    try {
      const session = await apiClient.getScrapingSession(sessionId)
      setSelectedSession(session)
      setScrapeResult({
        url: session.url,
        format: session.format,
        content: session.content || "",
        metadata: session.metadata || {},
        scraped_at: session.scraped_at,
        session_id: session.id,
      })
    } catch (error: any) {
      toast.error("Failed to load session", {
        description: error.message,
      })
    }
  }

  return (
    <div className="space-y-6">
      <HeaderCard title="e-Miner" description="API, Docs and Playground - all in one place" />

      <ThemedCard variant="glass">
        <ThemedCardContent spacing="lg">
          <ThemedTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ThemedTabsList variant="glass">
              <ThemedTabsTrigger value="scrape" variant="glow">
                <Database className="h-4 w-4 mr-2" />
                Scrape
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="search" variant="glow">
                <Search className="h-4 w-4 mr-2" />
                Search
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="new" variant="glow">
                <Plus className="h-4 w-4 mr-2" />
                New
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="map" variant="glow">
                <Map className="h-4 w-4 mr-2" />
                Map
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="crawl" variant="glow">
                <Globe className="h-4 w-4 mr-2" />
                Crawl
              </ThemedTabsTrigger>
            </ThemedTabsList>

            {/* Scrape Tab Content */}
            <ThemedTabsContent value="scrape" className="space-y-6 mt-6">
              {/* URL Input */}
              <div className="glass-card border border-primary/20 p-6 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium">https://</span>
                  <Input
                    placeholder="example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                  />
                </div>
              </div>

              {/* Action Bar */}
              <div className="glass-card border border-primary/20 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:glow-red-sm smooth-transition"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:glow-red-sm smooth-transition"
                  >
                    <Table className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-2 ml-4">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Format:</span>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger className="w-[140px] border-primary/20 bg-background/50 hover:glow-red-sm smooth-transition">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="text">Plain Text</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10 hover:glow-red-sm smooth-transition bg-transparent"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Get code
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 glow-red-md smooth-transition px-6"
                    onClick={handleStartScraping}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scraping...
                      </>
                    ) : (
                      "Start scraping"
                    )}
                  </Button>
                </div>
              </div>

              {/* Results Area */}
              {scrapeResult && (
                <ThemedCard className="glass-card border-primary/20">
                  <HeaderCard title="Scraping Results" />
                  <ThemedCardContent spacing="lg">
                    <div className="space-y-4">
                      {/* Metadata */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Database className="h-4 w-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Title</span>
                          </div>
                          <p className="text-sm font-medium truncate">{scrapeResult.metadata.title}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Code className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-muted-foreground">Links</span>
                          </div>
                          <p className="text-sm font-medium">{scrapeResult.metadata.links_count}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Table className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-muted-foreground">Headings</span>
                          </div>
                          <p className="text-sm font-medium">{scrapeResult.metadata.headings_count}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="h-4 w-4 text-purple-500" />
                            <span className="text-xs text-muted-foreground">Images</span>
                          </div>
                          <p className="text-sm font-medium">{scrapeResult.metadata.images_count}</p>
                        </div>
                      </div>

                      {/* Content Display */}
                      <div className="p-4 rounded-lg bg-background/50 border border-primary/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Content ({format.toUpperCase()})</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(scrapeResult.content)
                              toast.success("Copied to clipboard!")
                            }}
                          >
                            <Code className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <pre className="text-xs overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap break-words p-3 rounded bg-black/20 border border-primary/5">
                          {scrapeResult.content}
                        </pre>
                      </div>
                    </div>
                  </ThemedCardContent>
                </ThemedCard>
              )}

              {/* Demo/Empty State */}
              {!scrapeResult && !isLoading && (
                <ThemedCard className="glass-card border-primary/20">
                  <ThemedCardContent spacing="lg">
                    <div className="text-center py-12">
                      <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Enter a URL and click "Start scraping" to begin</p>
                    </div>
                  </ThemedCardContent>
                </ThemedCard>
              )}

              {/* Loading State */}
              {isLoading && (
                <ThemedCard className="glass-card border-primary/20">
                  <ThemedCardContent spacing="lg">
                    <div className="text-center py-12">
                      <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
                      <p className="text-muted-foreground">Scraping website...</p>
                      <p className="text-sm text-muted-foreground/60 mt-2">This may take a few seconds</p>
                    </div>
                  </ThemedCardContent>
                </ThemedCard>
              )}

              {/* Scraping History */}
              <ThemedCard className="glass-card border-primary/20 mt-6">
                <div className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Scraping History</h3>
                      <span className="text-sm text-muted-foreground">
                        ({sessions.length} session{sessions.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadSessions}
                      disabled={isLoadingSessions}
                      className="border-primary/30 hover:bg-primary/10"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingSessions ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
                <ThemedCardContent spacing="lg">
                  {isLoadingSessions ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground">Loading sessions...</p>
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No scraping sessions yet</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">
                        Start scraping a website to see it here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-sm font-medium truncate">
                                  {session.title || session.url}
                                </h4>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  session.format === 'markdown' ? 'bg-blue-500/20 text-blue-400' :
                                  session.format === 'json' ? 'bg-green-500/20 text-green-400' :
                                  session.format === 'html' ? 'bg-orange-500/20 text-orange-400' :
                                  session.format === 'text' ? 'bg-gray-500/20 text-gray-400' :
                                  'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {session.format.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-2">
                                {session.url}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {session.metadata && (
                                  <>
                                    <span>🔗 {session.metadata.links_count || 0} links</span>
                                    <span>📝 {session.metadata.headings_count || 0} headings</span>
                                    <span>🖼️ {session.metadata.images_count || 0} images</span>
                                  </>
                                )}
                                <span className="ml-auto">
                                  {new Date(session.scraped_at).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewSession(session.id)}
                                className="border-primary/30 hover:bg-primary/10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSession(session.id)}
                                className="border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ThemedCardContent>
              </ThemedCard>
            </ThemedTabsContent>

            {/* Other Tabs */}
            <ThemedTabsContent value="search" className="mt-6">
              <ThemedCard variant="glass">
                <ThemedCardContent spacing="lg" className="text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Search Functionality</h3>
                  <p className="text-muted-foreground">Search through scraped data and saved results</p>
                </ThemedCardContent>
              </ThemedCard>
            </ThemedTabsContent>

            <ThemedTabsContent value="new" className="mt-6">
              <ThemedCard variant="glass">
                <ThemedCardContent spacing="lg" className="text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Create New Project</h3>
                  <p className="text-muted-foreground">Start a new scraping or crawling project</p>
                </ThemedCardContent>
              </ThemedCard>
            </ThemedTabsContent>

            <ThemedTabsContent value="map" className="mt-6">
              <ThemedCard variant="glass">
                <ThemedCardContent spacing="lg" className="text-center">
                  <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Site Mapping</h3>
                  <p className="text-muted-foreground">Visualize and map website structure</p>
                </ThemedCardContent>
              </ThemedCard>
            </ThemedTabsContent>

            <ThemedTabsContent value="crawl" className="mt-6">
              <ThemedCard variant="glass">
                <ThemedCardContent spacing="lg" className="text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Web Crawling</h3>
                  <p className="text-muted-foreground">Crawl multiple pages and follow links automatically</p>
                </ThemedCardContent>
              </ThemedCard>
            </ThemedTabsContent>
          </ThemedTabs>
        </ThemedCardContent>
      </ThemedCard>
    </div>
  )
}
