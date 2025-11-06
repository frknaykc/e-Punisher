"use client"

import { useState } from "react"
import {
  ThemedCard,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
  SessionCard,
} from "@/components/ui/themed-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import {
  Send,
  Heart,
  UserPlus,
  MessageCircle,
  Repeat2,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Flag,
  Database,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TwitterActionsProps {
  selectedAccounts: string[]
  demoMode: boolean
}

type ActionType = "post" | "like" | "follow" | "reply" | "retweet" | "report" | "spam"
type ActionStatus = "pending" | "scheduled" | "completed" | "failed"

interface Action {
  id: string
  type: ActionType
  content?: string
  targetUrl?: string
  targetUsername?: string
  accountCount: number
  status: ActionStatus
  scheduledFor?: Date
  createdAt: Date
}

export function TwitterActions({ selectedAccounts, demoMode }: TwitterActionsProps) {
  const [postContent, setPostContent] = useState("")
  const [targetUsername, setTargetUsername] = useState("")
  const [tweetUrl, setTweetUrl] = useState("")
  const [replyContent, setReplyContent] = useState("")
  const [reportReason, setReportReason] = useState("")
  const [spamType, setSpamType] = useState("")

  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [actions, setActions] = useState<Action[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDisabled = selectedAccounts.length === 0

  const handleSubmitAction = async (type: ActionType) => {
    setIsSubmitting(true)

    const newAction: Action = {
      id: Date.now().toString(),
      type,
      content:
        type === "post"
          ? postContent
          : type === "reply"
            ? replyContent
            : type === "report"
              ? reportReason
              : type === "spam"
                ? spamType
                : undefined,
      targetUrl: ["like", "reply", "retweet", "report", "spam"].includes(type) ? tweetUrl : undefined,
      targetUsername: type === "follow" ? targetUsername : undefined,
      accountCount: selectedAccounts.length,
      status: isScheduled ? "scheduled" : "pending",
      scheduledFor:
        isScheduled && scheduledDate && scheduledTime ? new Date(`${scheduledDate}T${scheduledTime}`) : undefined,
      createdAt: new Date(),
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    newAction.status = "completed"
    setActions([newAction, ...actions])

    setPostContent("")
    setReplyContent("")
    setTweetUrl("")
    setTargetUsername("")
    setReportReason("")
    setSpamType("")
    setIsScheduled(false)
    setScheduledDate("")
    setScheduledTime("")
    setIsSubmitting(false)
  }

  const getStatusBadge = (status: ActionStatus) => {
    const variants = {
      pending: { variant: "secondary" as const, icon: Loader2, text: "Pending" },
      scheduled: { variant: "outline" as const, icon: Clock, text: "Scheduled" },
      completed: { variant: "default" as const, icon: CheckCircle2, text: "Completed" },
      failed: { variant: "destructive" as const, icon: XCircle, text: "Failed" },
    }
    const config = variants[status]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const getActionDescription = (action: Action) => {
    const typeLabels = {
      post: "Posted tweet",
      like: "Liked tweet",
      follow: `Followed ${action.targetUsername}`,
      reply: "Replied to tweet",
      retweet: "Retweeted",
      report: "Reported tweet",
      spam: "Marked as spam",
    }
    return typeLabels[action.type]
  }

  if (!demoMode) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-6 rounded-full bg-muted">
          <Database className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">No Data Available</h3>
          <p className="text-muted-foreground max-w-md">
            Demo data is currently disabled. Enable demo mode in Settings to view and test Twitter actions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ThemedTabs defaultValue="post" className="space-y-4">
        <ThemedTabsList variant="glass" className="grid w-full grid-cols-6 h-auto">
          <ThemedTabsTrigger value="post" variant="icon-glow">
            <Send className="h-4 w-4" />
            <span className="text-xs">Send Post</span>
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="like" variant="icon-glow">
            <Heart className="h-4 w-4" />
            <span className="text-xs">Like</span>
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="follow" variant="icon-glow">
            <UserPlus className="h-4 w-4" />
            <span className="text-xs">Follow</span>
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="reply" variant="icon-glow">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">Reply</span>
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="retweet" variant="icon-glow">
            <Repeat2 className="h-4 w-4" />
            <span className="text-xs">Retweet</span>
          </ThemedTabsTrigger>
          <ThemedTabsTrigger value="attack" variant="icon-glow">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs">Attack</span>
          </ThemedTabsTrigger>
        </ThemedTabsList>

        <ThemedTabsContent value="post">
          <SessionCard>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <ThemedCardTitle size="lg">Send Post</ThemedCardTitle>
                <ThemedCardDescription>Create and send a tweet from selected accounts</ThemedCardDescription>
              </div>
            </div>
            <ThemedCardContent spacing="lg">
              <div className="space-y-2">
                <Label htmlFor="post-content">Tweet Content</Label>
                <Textarea
                  id="post-content"
                  placeholder="What's happening?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-32 resize-none"
                  maxLength={280}
                />
                <p className="text-xs text-muted-foreground text-right">{postContent.length} / 280</p>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule-toggle">Schedule for later</Label>
                  <p className="text-xs text-muted-foreground">Set a specific time to send this tweet</p>
                </div>
                <Switch id="schedule-toggle" checked={isScheduled} onCheckedChange={setIsScheduled} />
              </div>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">Date</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button
                disabled={
                  isDisabled ||
                  !postContent.trim() ||
                  isSubmitting ||
                  (isScheduled && (!scheduledDate || !scheduledTime))
                }
                className="w-full"
                onClick={() => handleSubmitAction("post")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {isScheduled ? "Schedule" : "Send"} Tweet from {selectedAccounts.length} account(s)
                  </>
                )}
              </Button>
            </ThemedCardContent>
          </SessionCard>
        </ThemedTabsContent>

        <ThemedTabsContent value="like">
          <SessionCard>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-pink-500/10">
                <Heart className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <ThemedCardTitle size="lg">Like Tweets</ThemedCardTitle>
                <ThemedCardDescription>Like tweets from selected accounts</ThemedCardDescription>
              </div>
            </div>
            <ThemedCardContent spacing="lg">
              <div className="space-y-2">
                <Label htmlFor="tweet-url">Tweet URL</Label>
                <Input
                  id="tweet-url"
                  placeholder="https://twitter.com/username/status/..."
                  value={tweetUrl}
                  onChange={(e) => setTweetUrl(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule-toggle-like">Schedule for later</Label>
                  <p className="text-xs text-muted-foreground">Set a specific time to like this tweet</p>
                </div>
                <Switch id="schedule-toggle-like" checked={isScheduled} onCheckedChange={setIsScheduled} />
              </div>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date-like">Date</Label>
                    <Input
                      id="schedule-date-like"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time-like">Time</Label>
                    <Input
                      id="schedule-time-like"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button
                disabled={
                  isDisabled || !tweetUrl.trim() || isSubmitting || (isScheduled && (!scheduledDate || !scheduledTime))
                }
                className="w-full"
                onClick={() => handleSubmitAction("like")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    {isScheduled ? "Schedule" : "Like"} from {selectedAccounts.length} account(s)
                  </>
                )}
              </Button>
            </ThemedCardContent>
          </SessionCard>
        </ThemedTabsContent>

        <ThemedTabsContent value="follow">
          <SessionCard>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10">
                <UserPlus className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <ThemedCardTitle size="lg">Follow Users</ThemedCardTitle>
                <ThemedCardDescription>Follow users from selected accounts</ThemedCardDescription>
              </div>
            </div>
            <ThemedCardContent spacing="lg">
              <div className="space-y-2">
                <Label htmlFor="target-username">Target Username</Label>
                <Input
                  id="target-username"
                  placeholder="@username"
                  value={targetUsername}
                  onChange={(e) => setTargetUsername(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule-toggle-follow">Schedule for later</Label>
                  <p className="text-xs text-muted-foreground">Set a specific time to follow this user</p>
                </div>
                <Switch id="schedule-toggle-follow" checked={isScheduled} onCheckedChange={setIsScheduled} />
              </div>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date-follow">Date</Label>
                    <Input
                      id="schedule-date-follow"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time-follow">Time</Label>
                    <Input
                      id="schedule-time-follow"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button
                disabled={
                  isDisabled ||
                  !targetUsername.trim() ||
                  isSubmitting ||
                  (isScheduled && (!scheduledDate || !scheduledTime))
                }
                className="w-full"
                onClick={() => handleSubmitAction("follow")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isScheduled ? "Schedule" : "Follow"} from {selectedAccounts.length} account(s)
                  </>
                )}
              </Button>
            </ThemedCardContent>
          </SessionCard>
        </ThemedTabsContent>

        <ThemedTabsContent value="reply">
          <SessionCard>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <MessageCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <ThemedCardTitle size="lg">Reply to Tweet</ThemedCardTitle>
                <ThemedCardDescription>Reply to a tweet from selected accounts</ThemedCardDescription>
              </div>
            </div>
            <ThemedCardContent spacing="lg">
              <div className="space-y-2">
                <Label htmlFor="reply-tweet-url">Tweet URL</Label>
                <Input
                  id="reply-tweet-url"
                  placeholder="https://twitter.com/username/status/..."
                  value={tweetUrl}
                  onChange={(e) => setTweetUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply-content">Reply Content</Label>
                <Textarea
                  id="reply-content"
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-24 resize-none"
                  maxLength={280}
                />
                <p className="text-xs text-muted-foreground text-right">{replyContent.length} / 280</p>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule-toggle-reply">Schedule for later</Label>
                  <p className="text-xs text-muted-foreground">Set a specific time to send this reply</p>
                </div>
                <Switch id="schedule-toggle-reply" checked={isScheduled} onCheckedChange={setIsScheduled} />
              </div>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date-reply">Date</Label>
                    <Input
                      id="schedule-date-reply"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time-reply">Time</Label>
                    <Input
                      id="schedule-time-reply"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button
                disabled={
                  isDisabled ||
                  !tweetUrl.trim() ||
                  !replyContent.trim() ||
                  isSubmitting ||
                  (isScheduled && (!scheduledDate || !scheduledTime))
                }
                className="w-full"
                onClick={() => handleSubmitAction("reply")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {isScheduled ? "Schedule" : "Send"} Reply from {selectedAccounts.length} account(s)
                  </>
                )}
              </Button>
            </ThemedCardContent>
          </SessionCard>
        </ThemedTabsContent>

        <ThemedTabsContent value="retweet">
          <SessionCard>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Repeat2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <ThemedCardTitle size="lg">Retweet</ThemedCardTitle>
                <ThemedCardDescription>Retweet from selected accounts</ThemedCardDescription>
              </div>
            </div>
            <ThemedCardContent spacing="lg">
              <div className="space-y-2">
                <Label htmlFor="retweet-url">Tweet URL</Label>
                <Input
                  id="retweet-url"
                  placeholder="https://twitter.com/username/status/..."
                  value={tweetUrl}
                  onChange={(e) => setTweetUrl(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule-toggle-retweet">Schedule for later</Label>
                  <p className="text-xs text-muted-foreground">Set a specific time to retweet</p>
                </div>
                <Switch id="schedule-toggle-retweet" checked={isScheduled} onCheckedChange={setIsScheduled} />
              </div>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date-retweet">Date</Label>
                    <Input
                      id="schedule-date-retweet"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time-retweet">Time</Label>
                    <Input
                      id="schedule-time-retweet"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button
                disabled={
                  isDisabled || !tweetUrl.trim() || isSubmitting || (isScheduled && (!scheduledDate || !scheduledTime))
                }
                className="w-full"
                onClick={() => handleSubmitAction("retweet")}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Repeat2 className="h-4 w-4 mr-2" />
                    {isScheduled ? "Schedule" : "Retweet"} from {selectedAccounts.length} account(s)
                  </>
                )}
              </Button>
            </ThemedCardContent>
          </SessionCard>
        </ThemedTabsContent>

        <ThemedTabsContent value="attack">
          <div className="grid gap-4 md:grid-cols-2">
            <SessionCard variant="elevated">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Flag className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <ThemedCardTitle size="lg">Report Tweet</ThemedCardTitle>
                  <ThemedCardDescription>Report a tweet for violating Twitter rules</ThemedCardDescription>
                </div>
              </div>
              <ThemedCardContent spacing="lg">
                <div className="space-y-2">
                  <Label htmlFor="report-tweet-url">Tweet URL</Label>
                  <Input
                    id="report-tweet-url"
                    placeholder="https://twitter.com/username/status/..."
                    value={tweetUrl}
                    onChange={(e) => setTweetUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-reason">Report Reason</Label>
                  <Select value={reportReason} onValueChange={setReportReason}>
                    <SelectTrigger id="report-reason">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spam">Spam</SelectItem>
                      <SelectItem value="harassment">Harassment</SelectItem>
                      <SelectItem value="hate-speech">Hate Speech</SelectItem>
                      <SelectItem value="violence">Violence or Threats</SelectItem>
                      <SelectItem value="misinformation">Misinformation</SelectItem>
                      <SelectItem value="impersonation">Impersonation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="schedule-toggle-report">Schedule for later</Label>
                    <p className="text-xs text-muted-foreground">Set a specific time to report</p>
                  </div>
                  <Switch id="schedule-toggle-report" checked={isScheduled} onCheckedChange={setIsScheduled} />
                </div>

                {isScheduled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-date-report">Date</Label>
                      <Input
                        id="schedule-date-report"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-time-report">Time</Label>
                      <Input
                        id="schedule-time-report"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button
                  disabled={
                    isDisabled ||
                    !tweetUrl.trim() ||
                    !reportReason ||
                    isSubmitting ||
                    (isScheduled && (!scheduledDate || !scheduledTime))
                  }
                  variant="destructive"
                  className="w-full glow-red-sm"
                  onClick={() => handleSubmitAction("report")}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Flag className="h-4 w-4 mr-2" />
                      {isScheduled ? "Schedule" : "Report"} from {selectedAccounts.length} account(s)
                    </>
                  )}
                </Button>
              </ThemedCardContent>
            </SessionCard>

            <SessionCard variant="elevated">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <ThemedCardTitle size="lg">Mark as Spam</ThemedCardTitle>
                  <ThemedCardDescription>Mark a tweet or account as spam</ThemedCardDescription>
                </div>
              </div>
              <ThemedCardContent spacing="lg">
                <div className="space-y-2">
                  <Label htmlFor="spam-tweet-url">Tweet URL</Label>
                  <Input
                    id="spam-tweet-url"
                    placeholder="https://twitter.com/username/status/..."
                    value={tweetUrl}
                    onChange={(e) => setTweetUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spam-type">Spam Type</Label>
                  <Select value={spamType} onValueChange={setSpamType}>
                    <SelectTrigger id="spam-type">
                      <SelectValue placeholder="Select spam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial Spam</SelectItem>
                      <SelectItem value="bot">Bot Activity</SelectItem>
                      <SelectItem value="scam">Scam or Fraud</SelectItem>
                      <SelectItem value="malicious">Malicious Links</SelectItem>
                      <SelectItem value="repetitive">Repetitive Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="schedule-toggle-spam">Schedule for later</Label>
                    <p className="text-xs text-muted-foreground">Set a specific time to mark as spam</p>
                  </div>
                  <Switch id="schedule-toggle-spam" checked={isScheduled} onCheckedChange={setIsScheduled} />
                </div>

                {isScheduled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-date-spam">Date</Label>
                      <Input
                        id="schedule-date-spam"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-time-spam">Time</Label>
                      <Input
                        id="schedule-time-spam"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button
                  disabled={
                    isDisabled ||
                    !tweetUrl.trim() ||
                    !spamType ||
                    isSubmitting ||
                    (isScheduled && (!scheduledDate || !scheduledTime))
                  }
                  variant="destructive"
                  className="w-full glow-red-sm"
                  onClick={() => handleSubmitAction("spam")}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {isScheduled ? "Schedule" : "Mark"} from {selectedAccounts.length} account(s)
                    </>
                  )}
                </Button>
              </ThemedCardContent>
            </SessionCard>
          </div>
        </ThemedTabsContent>
      </ThemedTabs>

      {actions.length > 0 && (
        <ThemedCard variant="glass">
          <ThemedCardTitle size="lg">Action History</ThemedCardTitle>
          <ThemedCardDescription>Recent actions performed on your accounts</ThemedCardDescription>
          <ThemedCardContent spacing="lg">
            <div className="space-y-3">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{getActionDescription(action)}</p>
                      {getStatusBadge(action.status)}
                    </div>
                    {action.content && <p className="text-sm text-muted-foreground line-clamp-2">{action.content}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{action.accountCount} accounts</span>
                      {action.scheduledFor ? (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {action.scheduledFor.toLocaleString()}
                        </span>
                      ) : (
                        <span>{action.createdAt.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ThemedCardContent>
        </ThemedCard>
      )}
    </div>
  )
}
