"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  RefreshCw,
  X,
  Clock,
  BookOpen,
  Puzzle,
  Cog,
  Brain,
  MessageSquare,
  FileText,
  Edit,
  Repeat,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import { useState } from "react"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger } from "@/components/ui/themed-tabs"

interface CalendarPlanningProps {
  demoMode?: boolean
}

type ViewMode = "month" | "week" | "day" | "timeline" | "gantt"
type EventType = "project" | "case" | "automation" | "scan" | "post" | "report"
type EventStatus = "active" | "completed" | "failed" | "scheduled"

interface CalendarEvent {
  id: string
  title: string
  type: EventType
  status: EventStatus
  date: string
  time?: string
  platform?: string
  linkedProject?: string
  description?: string
  owner?: string
  tags?: string[]
  progress?: number
}

const eventTypeConfig = {
  project: { color: "bg-blue-500/20 border-blue-500/50 text-blue-400", icon: BookOpen, label: "Project" },
  case: { color: "bg-orange-500/20 border-orange-500/50 text-orange-400", icon: Puzzle, label: "Case" },
  automation: { color: "bg-red-500/20 border-red-500/50 text-red-400", icon: Cog, label: "Automation" },
  scan: { color: "bg-purple-500/20 border-purple-500/50 text-purple-400", icon: Brain, label: "OSINT Scan" },
  post: { color: "bg-green-500/20 border-green-500/50 text-green-400", icon: MessageSquare, label: "Post" },
  report: { color: "bg-gray-500/20 border-gray-500/50 text-gray-400", icon: FileText, label: "Report" },
}

export function CalendarPlanning({ demoMode = true }: CalendarPlanningProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())

  if (!demoMode) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-6 rounded-full bg-muted">
          <Calendar className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">No Events Available</h3>
          <p className="text-muted-foreground max-w-md">
            Demo data is currently disabled. Enable demo mode in Settings to view sample events and test the calendar
            features.
          </p>
        </div>
      </div>
    )
  }

  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "CyberPulse Campaign",
      type: "project",
      status: "active",
      date: "2024-11-02",
      platform: "Twitter",
      linkedProject: "CyberPulse",
      description: "Main campaign for Q4 2024",
      owner: "Team Alpha",
      tags: ["campaign", "priority"],
      progress: 65,
    },
    {
      id: "2",
      title: "Bot Sweep v3",
      type: "automation",
      status: "completed",
      date: "2024-11-02",
      time: "14:00",
      linkedProject: "CyberPulse",
      description: "Automated engagement sweep",
      owner: "Bot Manager",
    },
    {
      id: "3",
      title: "OSINT Scan: #BlackSunday",
      type: "scan",
      status: "active",
      date: "2024-11-03",
      time: "09:00",
      description: "Hashtag monitoring and analysis",
      owner: "Intel Team",
      tags: ["osint", "trending"],
    },
    {
      id: "4",
      title: "Content Drop",
      type: "post",
      status: "scheduled",
      date: "2024-11-04",
      time: "10:00",
      platform: "Instagram",
      linkedProject: "BrandOps",
      description: "Weekly content release",
    },
    {
      id: "5",
      title: "Fix Credential Leak",
      type: "case",
      status: "active",
      date: "2024-11-05",
      linkedProject: "eSentinel",
      description: "Security incident response",
      owner: "Security Team",
      tags: ["urgent", "security"],
      progress: 40,
    },
    {
      id: "6",
      title: "Weekly Analytics Report",
      type: "report",
      status: "scheduled",
      date: "2024-11-06",
      time: "16:00",
      description: "Generate and export weekly metrics",
      owner: "Analytics",
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)

  const getEventsForDate = (day: number) => {
    const dateStr = `2024-11-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.date === dateStr)
  }

  return (
    <div className="flex h-full gap-4">
      {/* Main Calendar Area */}
      <div className="flex-1 space-y-4">
        <Card className="glass-card border-2 border-primary/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left Side - View and Filters */}
              <div className="flex items-center gap-3 flex-1">
                {/* View Mode Selector */}
                <ThemedTabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                  <ThemedTabsList variant="glass">
                    <ThemedTabsTrigger value="month" variant="glow">
                      Month
                    </ThemedTabsTrigger>
                    <ThemedTabsTrigger value="week" variant="glow">
                      Week
                    </ThemedTabsTrigger>
                    <ThemedTabsTrigger value="day" variant="glow">
                      Day
                    </ThemedTabsTrigger>
                    <ThemedTabsTrigger value="timeline" variant="glow">
                      Timeline
                    </ThemedTabsTrigger>
                    <ThemedTabsTrigger value="gantt" variant="glow">
                      Gantt
                    </ThemedTabsTrigger>
                  </ThemedTabsList>
                </ThemedTabs>

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks, cases, projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2 glass-card border-2 border-primary/40 hover:border-primary/60 hover:bg-primary/10"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Right Side - Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 glass-card border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400 bg-transparent"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Suggest
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 glass-card border-2 border-primary/40 hover:border-primary/60 hover:bg-primary/10 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4" />
                  Sync
                </Button>
                <Button
                  size="sm"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-primary/50"
                >
                  <Plus className="h-4 w-4" />
                  New Event
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-primary/20 grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                  <select className="w-full px-3 py-1.5 text-sm rounded-lg glass-card border-2 border-primary/30 focus:border-primary/50 outline-none">
                    <option>All Types</option>
                    <option>Post</option>
                    <option>Project</option>
                    <option>Case</option>
                    <option>Automation</option>
                    <option>Scan</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <select className="w-full px-3 py-1.5 text-sm rounded-lg glass-card border-2 border-primary/30 focus:border-primary/50 outline-none">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Completed</option>
                    <option>Failed</option>
                    <option>Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Platform</label>
                  <select className="w-full px-3 py-1.5 text-sm rounded-lg glass-card border-2 border-primary/30 focus:border-primary/50 outline-none">
                    <option>All Platforms</option>
                    <option>Twitter</option>
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Owner</label>
                  <select className="w-full px-3 py-1.5 text-sm rounded-lg glass-card border-2 border-primary/30 focus:border-primary/50 outline-none">
                    <option>All Owners</option>
                    <option>Team Alpha</option>
                    <option>Security Team</option>
                    <option>Intel Team</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-2 border-primary/40">
          <CardHeader className="gradient-overlay">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {viewMode === "month" && "Month View"}
                {viewMode === "week" && "Week View"}
                {viewMode === "day" && "Day View"}
                {viewMode === "timeline" && "Timeline View"}
                {viewMode === "gantt" && "Gantt View"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/30"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/30"
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {viewMode === "month" && (
              <div className="space-y-2">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-xs font-semibold text-center py-2 text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dayEvents = getEventsForDate(day)
                    return (
                      <div
                        key={day}
                        className="aspect-square rounded-lg glass-card border-2 border-primary/30 hover:border-primary/50 smooth-transition p-2 flex flex-col"
                      >
                        <div className="text-sm font-medium mb-1">{day}</div>
                        <div className="flex-1 space-y-1 overflow-hidden">
                          {dayEvents.slice(0, 3).map((event) => {
                            const config = eventTypeConfig[event.type]
                            const Icon = config.icon
                            return (
                              <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className={`text-xs px-1.5 py-0.5 rounded border cursor-pointer hover:scale-105 smooth-transition ${config.color} flex items-center gap-1`}
                              >
                                <Icon className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate text-[10px]">{event.title}</span>
                              </div>
                            )
                          })}
                          {dayEvents.length > 3 && (
                            <div className="text-[10px] text-muted-foreground text-center">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {viewMode === "timeline" && (
              <div className="space-y-4">
                {events.map((event) => {
                  const config = eventTypeConfig[event.type]
                  const Icon = config.icon
                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`p-4 rounded-lg border cursor-pointer hover:scale-[1.02] smooth-transition ${config.color}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-0.5" />
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span>{event.date}</span>
                              {event.time && <span>{event.time}</span>}
                              {event.linkedProject && <span>→ {event.linkedProject}</span>}
                            </div>
                          </div>
                        </div>
                        <Badge variant={event.status === "active" ? "default" : "secondary"}>{event.status}</Badge>
                      </div>
                      {event.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{event.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full smooth-transition"
                              style={{ width: `${event.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {(viewMode === "week" || viewMode === "day" || viewMode === "gantt") && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} view coming soon</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedEvent && (
        <Card className="w-96 glass-card border-2 border-primary/40 flex flex-col">
          <CardHeader className="gradient-overlay">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const config = eventTypeConfig[selectedEvent.type]
                    const Icon = config.icon
                    return (
                      <>
                        <Icon className="h-5 w-5 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {config.label}
                        </Badge>
                      </>
                    )
                  })()}
                </div>
                <CardTitle className="text-lg">{selectedEvent.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mt-1 -mr-1"
                onClick={() => setSelectedEvent(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant={selectedEvent.status === "active" ? "default" : "secondary"} className="w-fit">
              {selectedEvent.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6 flex-1 overflow-auto space-y-4">
            {/* Description */}
            {selectedEvent.description && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>
            )}

            {/* Details */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Details</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{selectedEvent.date}</span>
                </div>
                {selectedEvent.time && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>{selectedEvent.time}</span>
                  </div>
                )}
                {selectedEvent.owner && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Owner</span>
                    <span>{selectedEvent.owner}</span>
                  </div>
                )}
                {selectedEvent.platform && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Platform</span>
                    <span>{selectedEvent.platform}</span>
                  </div>
                )}
                {selectedEvent.linkedProject && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Linked Project</span>
                    <span className="text-primary">{selectedEvent.linkedProject}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {selectedEvent.tags && selectedEvent.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Progress */}
            {selectedEvent.progress !== undefined && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-semibold">{selectedEvent.progress}%</span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full smooth-transition"
                      style={{ width: `${selectedEvent.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Timeline</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Created 2 days ago</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Updated 1 hour ago</span>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Actions */}
          <div className="p-4 border-t border-primary/20 space-y-2">
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-primary/50">
              <Edit className="h-4 w-4" />
              Edit Event
            </Button>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 glass-card border-primary/20 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
              >
                <Repeat className="h-3 w-3" />
                Reschedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 glass-card border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 text-green-400 bg-transparent"
              >
                <CheckCircle className="h-3 w-3" />
                Complete
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 glass-card border-primary/20 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
              >
                <ExternalLink className="h-3 w-3" />
                Open
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
