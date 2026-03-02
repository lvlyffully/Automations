"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface TimelineActivity {
  id: string
  type: "call_initiated" | "conversation" | "note_added" | "field_update"
  timestamp: string
  data: {
    agentName?: string
    automationId?: string
    jobId?: string
    leadName?: string
    duration?: number
    transcript?: string
    recordingUrl?: string
    summary?: string
    fields?: Array<{ name: string; oldValue: string; newValue: string }>
  }
}

interface TimelineProps {
  activities: TimelineActivity[]
  onViewTranscript?: (transcript: string, recordingUrl?: string) => void
  onViewActivity?: (fields: Array<{ name: string; oldValue: string; newValue: string }>) => void
}

export function Timeline({ activities, onViewTranscript, onViewActivity }: TimelineProps) {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const renderActivity = (activity: TimelineActivity) => {
    switch (activity.type) {
      case "call_initiated":
        return (
          <div className="space-y-1">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Call Initiated
              </Badge>
            </div>
            <p className="text-sm text-foreground">
              Mio AI Call initiated with Agent "{activity.data.agentName}" via System Automation (Automation ID:{" "}
              {activity.data.automationId}, Job ID: {activity.data.jobId}) at {formatDateTime(activity.timestamp)}
            </p>
          </div>
        )

      case "conversation":
        return (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                Conversation
              </Badge>
            </div>
            <p className="text-sm text-foreground">
              {activity.data.leadName} had a conversation for {activity.data.duration} seconds on{" "}
              {formatDateTime(activity.timestamp)} with Mio AI.{" "}
              {activity.data.transcript && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary"
                  onClick={() => onViewTranscript?.(activity.data.transcript!, activity.data.recordingUrl)}
                >
                  View Transcript
                </Button>
              )}
            </p>
            {activity.data.recordingUrl && (
              <div className="mt-2">
                <audio
                  controls
                  className="w-full h-10"
                  preload="none"
                  onPlay={() => setPlayingAudio(activity.id)}
                  onPause={() => setPlayingAudio(null)}
                >
                  <source src={activity.data.recordingUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )

      case "note_added":
        return (
          <div className="space-y-1">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                Note Added
              </Badge>
            </div>
            <p className="text-sm text-foreground">
              Mio AI added Note: <span className="text-muted-foreground italic">{activity.data.summary}</span>
            </p>
          </div>
        )

      case "field_update":
        return (
          <div className="space-y-1">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                Field Updated
              </Badge>
            </div>
            <p className="text-sm text-foreground">
              Mio AI updated Lead Profile Field{" "}
              {activity.data.fields && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary"
                  onClick={() => onViewActivity?.(activity.data.fields!)}
                >
                  View Activity
                </Button>
              )}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No activities yet</p>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {/* Activities */}
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-border">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>

                {/* Activity card */}
                <Card className="flex-1 p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    {renderActivity(activity)}
                    <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
