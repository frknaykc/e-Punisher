"use client"

import { Select } from "@/components/ui/select"

import { SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import { useState } from "react"
import { ThemedCard, ThemedCardContent, HeaderCard } from "@/components/ui/themed-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import { Database, Search, Plus, Map, Globe, Settings, Table, Code } from "lucide-react"

interface EMinerProps {
  demoMode: boolean
}

export function EMiner({ demoMode }: EMinerProps) {
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState("markdown")
  const [activeTab, setActiveTab] = useState("scrape")

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
                  <Button className="bg-primary hover:bg-primary/90 glow-red-md smooth-transition px-6">
                    Start scraping
                  </Button>
                </div>
              </div>

              {/* Results Area */}
              {demoMode && (
                <ThemedCard className="glass-card border-primary/20">
                  <HeaderCard title="Scraping Results" />
                  <ThemedCardContent spacing="lg">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-background/50 border border-primary/10">
                        <p className="text-sm text-muted-foreground">Demo: Results will appear here after scraping</p>
                      </div>
                    </div>
                  </ThemedCardContent>
                </ThemedCard>
              )}
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
