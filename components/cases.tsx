"use client"

import {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
  StatsCard,
} from "@/components/ui/themed-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Clock, CheckCircle2, UserCircle } from "lucide-react"
import { useState } from "react"

interface Case {
  id: string
  title: string
  description: string
  status: "open" | "closed" | "assigned"
  assignedTo?: string
  priority: "low" | "medium" | "high"
  createdAt: string
  platform: string
}

const Cases = ({ demoMode = true }: { demoMode?: boolean }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const mockCases: Case[] = demoMode
    ? [
        {
          id: "1",
          title: "Twitter Campaign Setup",
          description: "Set up automated posting campaign for product launch",
          status: "assigned",
          assignedTo: "John Doe",
          priority: "high",
          createdAt: "2024-01-15",
          platform: "Twitter",
        },
        {
          id: "2",
          title: "Instagram Content Review",
          description: "Review and approve pending Instagram posts",
          status: "open",
          priority: "medium",
          createdAt: "2024-01-14",
          platform: "Instagram",
        },
        {
          id: "3",
          title: "LinkedIn Analytics Report",
          description: "Generate monthly analytics report for LinkedIn accounts",
          status: "closed",
          assignedTo: "Jane Smith",
          priority: "low",
          createdAt: "2024-01-10",
          platform: "LinkedIn",
        },
        {
          id: "4",
          title: "Facebook Ad Campaign",
          description: "Create and schedule Facebook ad campaign for Q1",
          status: "assigned",
          assignedTo: "Mike Johnson",
          priority: "high",
          createdAt: "2024-01-12",
          platform: "Facebook",
        },
        {
          id: "5",
          title: "TikTok Video Schedule",
          description: "Plan and schedule TikTok video content for next week",
          status: "open",
          priority: "medium",
          createdAt: "2024-01-13",
          platform: "TikTok",
        },
      ]
    : []

  const filteredCases = mockCases.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter
    const matchesPriority = priorityFilter === "all" || caseItem.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: Case["status"]) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4" />
      case "closed":
        return <CheckCircle2 className="h-4 w-4" />
      case "assigned":
        return <UserCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Case["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "closed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "assigned":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }

  const getPriorityColor = (priority: Case["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      case "medium":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-border/50 bg-background/50 focus:glow-red-sm smooth-transition"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px] border-border/50 bg-background/50 smooth-transition">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[140px] border-border/50 bg-background/50 smooth-transition">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2 hover-glow-red glow-red-sm shadow-lg smooth-transition">
            <Plus className="h-4 w-4" />
            New Case
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard value={mockCases.length.toString()} label="Total Cases" />
        <StatsCard
          value={mockCases.filter((c) => c.status === "open").length.toString()}
          label="Open"
          valueColor="text-blue-500"
        />
        <StatsCard
          value={mockCases.filter((c) => c.status === "assigned").length.toString()}
          label="Assigned"
          valueColor="text-yellow-500"
        />
        <StatsCard
          value={mockCases.filter((c) => c.status === "closed").length.toString()}
          label="Closed"
          valueColor="text-green-500"
        />
      </div>

      <div className="grid gap-4">
        {!demoMode ? (
          <ThemedCard className="border-glow-red">
            <ThemedCardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">
                Demo data is currently disabled. Enable demo mode in Settings to view sample cases.
              </p>
            </ThemedCardContent>
          </ThemedCard>
        ) : filteredCases.length === 0 ? (
          <ThemedCard className="border-glow-red">
            <ThemedCardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No cases found matching your filters.</p>
            </ThemedCardContent>
          </ThemedCard>
        ) : (
          filteredCases.map((caseItem) => (
            <ThemedCard key={caseItem.id} variant="glass">
              <ThemedCardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ThemedCardTitle size="lg">{caseItem.title}</ThemedCardTitle>
                      <Badge variant="outline" className={getPriorityColor(caseItem.priority)}>
                        {caseItem.priority}
                      </Badge>
                    </div>
                    <ThemedCardDescription>{caseItem.description}</ThemedCardDescription>
                  </div>
                  <Badge variant="outline" className={getStatusColor(caseItem.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(caseItem.status)}
                      {caseItem.status}
                    </span>
                  </Badge>
                </div>
              </ThemedCardHeader>
              <ThemedCardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Platform:</span>
                    <span>{caseItem.platform}</span>
                  </div>
                  {caseItem.assignedTo && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Assigned to:</span>
                      <span>{caseItem.assignedTo}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Created:</span>
                    <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="ml-auto">
                    <Button variant="outline" size="sm" className="hover-glow-red bg-transparent smooth-transition">
                      View Details
                    </Button>
                  </div>
                </div>
              </ThemedCardContent>
            </ThemedCard>
          ))
        )}
      </div>
    </div>
  )
}

export { Cases }
export default Cases
