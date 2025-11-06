"use client"

import {
  ThemedCard,
  ThemedCardContent,
  ThemedCardDescription,
  ThemedCardHeader,
  ThemedCardTitle,
  StatsCard,
} from "@/components/ui/themed-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import { Calendar, CheckCircle2, Clock, AlertCircle, TrendingUp, Users, Target } from "lucide-react"

interface ProjectTask {
  id: string
  title: string
  status: "completed" | "in-progress" | "pending"
  completedAt?: string
}

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  progress: number
  startDate: string
  endDate?: string
  team: string[]
  tasks: ProjectTask[]
  platforms: string[]
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Q1 Social Media Campaign",
    description: "Comprehensive social media campaign across all platforms for Q1 2024",
    status: "active",
    progress: 65,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    team: ["John Doe", "Jane Smith", "Mike Johnson"],
    platforms: ["Twitter", "Instagram", "LinkedIn", "Facebook"],
    tasks: [
      { id: "1", title: "Content calendar creation", status: "completed", completedAt: "2024-01-05" },
      { id: "2", title: "Design assets preparation", status: "completed", completedAt: "2024-01-10" },
      { id: "3", title: "Campaign launch on Twitter", status: "in-progress" },
      { id: "4", title: "Instagram stories series", status: "in-progress" },
      { id: "5", title: "LinkedIn article publication", status: "pending" },
      { id: "6", title: "Facebook ad campaign", status: "pending" },
    ],
  },
  {
    id: "2",
    name: "Brand Awareness Initiative",
    description: "Increase brand visibility and engagement across social platforms",
    status: "active",
    progress: 40,
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    team: ["Sarah Wilson", "Tom Brown"],
    platforms: ["Twitter", "TikTok", "Instagram"],
    tasks: [
      { id: "1", title: "Influencer partnerships", status: "completed", completedAt: "2024-01-20" },
      { id: "2", title: "TikTok content strategy", status: "in-progress" },
      { id: "3", title: "User-generated content campaign", status: "in-progress" },
      { id: "4", title: "Analytics dashboard setup", status: "pending" },
    ],
  },
  {
    id: "3",
    name: "Customer Support Enhancement",
    description: "Improve response times and customer satisfaction on social media",
    status: "completed",
    progress: 100,
    startDate: "2023-11-01",
    endDate: "2023-12-31",
    team: ["Emily Davis", "Chris Lee"],
    platforms: ["Twitter", "Facebook"],
    tasks: [
      { id: "1", title: "Automated response system", status: "completed", completedAt: "2023-11-15" },
      { id: "2", title: "Team training program", status: "completed", completedAt: "2023-11-30" },
      { id: "3", title: "Response template library", status: "completed", completedAt: "2023-12-10" },
      { id: "4", title: "Performance metrics tracking", status: "completed", completedAt: "2023-12-20" },
    ],
  },
]

interface ProjectsProps {
  demoMode?: boolean
}

export function Projects({ demoMode = true }: ProjectsProps) {
  const mockProjects: Project[] = demoMode
    ? [
        {
          id: "1",
          name: "Q1 Social Media Campaign",
          description: "Comprehensive social media campaign across all platforms for Q1 2024",
          status: "active",
          progress: 65,
          startDate: "2024-01-01",
          endDate: "2024-03-31",
          team: ["John Doe", "Jane Smith", "Mike Johnson"],
          platforms: ["Twitter", "Instagram", "LinkedIn", "Facebook"],
          tasks: [
            { id: "1", title: "Content calendar creation", status: "completed", completedAt: "2024-01-05" },
            { id: "2", title: "Design assets preparation", status: "completed", completedAt: "2024-01-10" },
            { id: "3", title: "Campaign launch on Twitter", status: "in-progress" },
            { id: "4", title: "Instagram stories series", status: "in-progress" },
            { id: "5", title: "LinkedIn article publication", status: "pending" },
            { id: "6", title: "Facebook ad campaign", status: "pending" },
          ],
        },
        {
          id: "2",
          name: "Brand Awareness Initiative",
          description: "Increase brand visibility and engagement across social platforms",
          status: "active",
          progress: 40,
          startDate: "2024-01-15",
          endDate: "2024-04-15",
          team: ["Sarah Wilson", "Tom Brown"],
          platforms: ["Twitter", "TikTok", "Instagram"],
          tasks: [
            { id: "1", title: "Influencer partnerships", status: "completed", completedAt: "2024-01-20" },
            { id: "2", title: "TikTok content strategy", status: "in-progress" },
            { id: "3", title: "User-generated content campaign", status: "in-progress" },
            { id: "4", title: "Analytics dashboard setup", status: "pending" },
          ],
        },
        {
          id: "3",
          name: "Customer Support Enhancement",
          description: "Improve response times and customer satisfaction on social media",
          status: "completed",
          progress: 100,
          startDate: "2023-11-01",
          endDate: "2023-12-31",
          team: ["Emily Davis", "Chris Lee"],
          platforms: ["Twitter", "Facebook"],
          tasks: [
            { id: "1", title: "Automated response system", status: "completed", completedAt: "2023-11-15" },
            { id: "2", title: "Team training program", status: "completed", completedAt: "2023-11-30" },
            { id: "3", title: "Response template library", status: "completed", completedAt: "2023-12-10" },
            { id: "4", title: "Performance metrics tracking", status: "completed", completedAt: "2023-12-20" },
          ],
        },
      ]
    : []

  const activeProjects = mockProjects.filter((p) => p.status === "active")
  const completedProjects = mockProjects.filter((p) => p.status === "completed")

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "on-hold":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }

  const getTaskStatusIcon = (status: ProjectTask["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {!demoMode ? (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="p-6 rounded-full bg-muted">
            <Target className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">No Projects Available</h3>
            <p className="text-muted-foreground max-w-md">
              Demo data is currently disabled. Enable demo mode in Settings to view sample projects.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard icon={Target} title="Total Projects" value={mockProjects.length.toString()} />
            <StatsCard
              icon={TrendingUp}
              title="Active"
              value={activeProjects.length.toString()}
              valueClassName="text-green-500"
            />
            <StatsCard
              icon={CheckCircle2}
              title="Completed"
              value={completedProjects.length.toString()}
              valueClassName="text-blue-500"
            />
            <StatsCard
              icon={Users}
              title="Team Members"
              value={new Set(mockProjects.flatMap((p) => p.team)).size.toString()}
            />
          </div>

          {/* Projects Tabs */}
          <ThemedTabs defaultValue="active" className="space-y-4">
            <ThemedTabsList variant="glass">
              <ThemedTabsTrigger value="active" variant="glow">
                Active Projects
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="completed" variant="glow">
                Completed
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="all" variant="glow">
                All Projects
              </ThemedTabsTrigger>
            </ThemedTabsList>

            <ThemedTabsContent value="active" className="space-y-4">
              {activeProjects.map((project) => (
                <ThemedCard key={project.id} variant="elevated">
                  <ThemedCardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ThemedCardTitle size="lg">{project.name}</ThemedCardTitle>
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <ThemedCardDescription>{project.description}</ThemedCardDescription>
                      </div>
                    </div>
                  </ThemedCardHeader>
                  <ThemedCardContent spacing="lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-semibold text-primary">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2.5 glow-red-sm" />
                    </div>

                    {/* Project Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Timeline:</span>
                          <span>
                            {new Date(project.startDate).toLocaleDateString()} -{" "}
                            {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Ongoing"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Team:</span>
                          <span>{project.team.join(", ")}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Platforms:</span>
                          <div className="flex gap-1 flex-wrap">
                            {project.platforms.map((platform) => (
                              <Badge key={platform} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Tasks</h4>
                      <div className="space-y-2">
                        {project.tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-sm">
                            {getTaskStatusIcon(task.status)}
                            <span className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                              {task.title}
                            </span>
                            {task.completedAt && (
                              <span className="text-xs text-muted-foreground ml-auto">
                                {new Date(task.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="hover-glow-red bg-transparent smooth-transition">
                        View Details
                      </Button>
                      <Button variant="outline" className="hover-glow-red bg-transparent smooth-transition">
                        Edit Project
                      </Button>
                    </div>
                  </ThemedCardContent>
                </ThemedCard>
              ))}
            </ThemedTabsContent>

            <ThemedTabsContent value="completed" className="space-y-4">
              {completedProjects.map((project) => (
                <ThemedCard key={project.id} variant="glass">
                  <ThemedCardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ThemedCardTitle size="lg">{project.name}</ThemedCardTitle>
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <ThemedCardDescription>{project.description}</ThemedCardDescription>
                      </div>
                    </div>
                  </ThemedCardHeader>
                  <ThemedCardContent spacing="lg">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Completed: {project.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{project.tasks.length} tasks completed</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hover-glow-red bg-transparent">
                      View Summary
                    </Button>
                  </ThemedCardContent>
                </ThemedCard>
              ))}
            </ThemedTabsContent>

            <ThemedTabsContent value="all" className="space-y-4">
              {mockProjects.map((project) => (
                <ThemedCard key={project.id}>
                  <ThemedCardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <ThemedCardTitle size="lg">{project.name}</ThemedCardTitle>
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <ThemedCardDescription>{project.description}</ThemedCardDescription>
                      </div>
                    </div>
                  </ThemedCardHeader>
                  <ThemedCardContent spacing="lg">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Progress:</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Team:</span>
                        <span>{project.team.length} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Tasks:</span>
                        <span>
                          {project.tasks.filter((t) => t.status === "completed").length}/{project.tasks.length}
                        </span>
                      </div>
                    </div>
                  </ThemedCardContent>
                </ThemedCard>
              ))}
            </ThemedTabsContent>
          </ThemedTabs>
        </>
      )}
    </div>
  )
}
