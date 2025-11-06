"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
      {/* Header */}
      <Card className="glass-card border-primary/20">
        <CardHeader className="text-center space-y-2 pb-8">
          <h2 className="text-5xl font-bold text-foreground">e-Miner</h2>
          <p className="text-muted-foreground text-lg">API, Docs and Playground - all in one place</p>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className="glass-card border-primary/20">
        <CardContent className="p-6 space-y-6">
          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass-card border border-primary/20 p-1 h-auto">
              <TabsTrigger
                value="scrape"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:glow-red-md smooth-transition px-6 py-3"
              >
                <Database className="h-4 w-4 mr-2" />
                Scrape
              </TabsTrigger>
              <TabsTrigger
                value="search"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:glow-red-md smooth-transition px-6 py-3"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:glow-red-md smooth-transition px-6 py-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                New
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:glow-red-md smooth-transition px-6 py-3"
              >
                <Map className="h-4 w-4 mr-2" />
                Map
              </TabsTrigger>
              <TabsTrigger
                value="crawl"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:glow-red-md smooth-transition px-6 py-3"
              >
                <Globe className="h-4 w-4 mr-2" />
                Crawl
              </TabsTrigger>
            </TabsList>

            {/* Scrape Tab Content */}
            <TabsContent value="scrape" className="space-y-6 mt-6">
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
                <Card className="glass-card border-primary/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Scraping Results</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-background/50 border border-primary/10">
                        <p className="text-sm text-muted-foreground">Demo: Results will appear here after scraping</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Other Tabs */}
            <TabsContent value="search" className="mt-6">
              <Card className="glass-card border-primary/20">
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Search Functionality</h3>
                  <p className="text-muted-foreground">Search through scraped data and saved results</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="new" className="mt-6">
              <Card className="glass-card border-primary/20">
                <CardContent className="p-12 text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Create New Project</h3>
                  <p className="text-muted-foreground">Start a new scraping or crawling project</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="map" className="mt-6">
              <Card className="glass-card border-primary/20">
                <CardContent className="p-12 text-center">
                  <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Site Mapping</h3>
                  <p className="text-muted-foreground">Visualize and map website structure</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crawl" className="mt-6">
              <Card className="glass-card border-primary/20">
                <CardContent className="p-12 text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Web Crawling</h3>
                  <p className="text-muted-foreground">Crawl multiple pages and follow links automatically</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
