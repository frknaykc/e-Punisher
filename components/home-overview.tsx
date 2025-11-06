"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  TrendingUp,
  Users,
  Clock,
  Send,
  Heart,
  UserPlus,
  MessageCircle,
  Repeat2,
  CheckCircle2,
  Target,
  Ban,
  Database,
} from "lucide-react"

// Mock data for recent activities
const recentActivities = [
  {
    id: "1",
    platform: "Twitter",
    action: "Posted tweet",
    accounts: 5,
    status: "completed",
    time: "2 minutes ago",
    icon: Send,
  },
  {
    id: "2",
    platform: "Twitter",
    action: "Liked 10 tweets",
    accounts: 3,
    status: "completed",
    time: "15 minutes ago",
    icon: Heart,
  },
  {
    id: "3",
    platform: "Instagram",
    action: "Followed users",
    accounts: 8,
    status: "in-progress",
    time: "30 minutes ago",
    icon: UserPlus,
  },
  {
    id: "4",
    platform: "Twitter",
    action: "Replied to tweets",
    accounts: 2,
    status: "completed",
    time: "1 hour ago",
    icon: MessageCircle,
  },
  {
    id: "5",
    platform: "Twitter",
    action: "Retweeted",
    accounts: 5,
    status: "scheduled",
    time: "Scheduled for 3:00 PM",
    icon: Repeat2,
  },
]

const stats = [
  {
    title: "Total Actions Today",
    value: "247",
    change: "+12.5%",
    icon: Activity,
    trend: "up",
  },
  {
    title: "Active Accounts",
    value: "23",
    change: "+3",
    icon: Users,
    trend: "up",
  },
  {
    title: "Scheduled Actions",
    value: "18",
    change: "5 pending",
    icon: Clock,
    trend: "neutral",
  },
  {
    title: "Success Rate",
    value: "98.2%",
    change: "+2.1%",
    icon: TrendingUp,
    trend: "up",
  },
]

// Mock data for targeted accounts
const targetedAccounts = [
  {
    id: "1",
    username: "@competitor_account",
    platform: "Twitter",
    status: "active",
    lastAction: "Reported 5 posts",
    actionCount: 23,
    successRate: 87,
    lastUpdate: "10 minutes ago",
  },
  {
    id: "2",
    username: "@spam_user_123",
    platform: "Twitter",
    status: "monitoring",
    lastAction: "Monitoring activity",
    actionCount: 45,
    successRate: 92,
    lastUpdate: "1 hour ago",
  },
  {
    id: "3",
    username: "@fake_profile",
    platform: "Instagram",
    status: "suspended",
    lastAction: "Account suspended",
    actionCount: 67,
    successRate: 100,
    lastUpdate: "2 hours ago",
  },
  {
    id: "4",
    username: "@bot_account_99",
    platform: "Twitter",
    status: "active",
    lastAction: "Spam reported",
    actionCount: 12,
    successRate: 75,
    lastUpdate: "30 minutes ago",
  },
]

interface HomeOverviewProps {
  demoMode: boolean
}

export function HomeOverview({ demoMode }: HomeOverviewProps) {
  if (!demoMode) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-6 rounded-full bg-muted">
          <Database className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">No Data Available</h3>
          <p className="text-muted-foreground max-w-md">
            Demo data is currently disabled. Enable demo mode in Settings to view sample data and test the platform.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs ${
                    stat.trend === "up"
                      ? "text-green-600 dark:text-green-400"
                      : stat.trend === "down"
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest actions performed across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{activity.action}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span>{activity.accounts} accounts</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {activity.status === "completed" && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                    {activity.status === "in-progress" && (
                      <Badge variant="secondary" className="gap-1">
                        <Activity className="h-3 w-3" />
                        In Progress
                      </Badge>
                    )}
                    {activity.status === "scheduled" && (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Scheduled
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Targeted Accounts Status */}
      <Card className="border-glow-red">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Targeted Accounts Status
          </CardTitle>
          <CardDescription>Current status of accounts under attack operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {targetedAccounts.map((account) => (
              <div
                key={account.id}
                className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{account.username}</p>
                        <Badge variant="outline" className="text-xs">
                          {account.platform}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{account.lastAction}</p>
                    </div>
                  </div>
                  <div>
                    {account.status === "active" && (
                      <Badge variant="default" className="gap-1 glow-red-sm">
                        <Activity className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                    {account.status === "monitoring" && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Monitoring
                      </Badge>
                    )}
                    {account.status === "suspended" && (
                      <Badge variant="destructive" className="gap-1">
                        <Ban className="h-3 w-3" />
                        Suspended
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Total Actions</p>
                    <p className="font-semibold">{account.actionCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Success Rate</p>
                    <p className="font-semibold text-green-500">{account.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Last Update</p>
                    <p className="font-semibold text-xs">{account.lastUpdate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Actions</CardTitle>
          <CardDescription>Scheduled actions for the next 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Send className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Post scheduled tweets</p>
                  <p className="text-sm text-muted-foreground">15 accounts • Today at 3:00 PM</p>
                </div>
              </div>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                In 2 hours
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-pink-500/10">
                  <Heart className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <p className="font-medium">Like trending posts</p>
                  <p className="text-sm text-muted-foreground">8 accounts • Today at 6:00 PM</p>
                </div>
              </div>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                In 5 hours
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <UserPlus className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Follow target users</p>
                  <p className="text-sm text-muted-foreground">12 accounts • Tomorrow at 9:00 AM</p>
                </div>
              </div>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                In 18 hours
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
