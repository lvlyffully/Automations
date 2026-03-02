"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Timeline, type TimelineActivity } from "@/components/timeline"
import { TranscriptDrawer } from "@/components/transcript-drawer"
import { ActivityDetailDrawer } from "@/components/activity-detail-drawer"

export default function ApplicationProfilePage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.applicationId as string

  const [transcriptDrawer, setTranscriptDrawer] = useState<{
    isOpen: boolean
    transcript: string
    recordingUrl?: string
  }>({ isOpen: false, transcript: "" })

  const [activityDrawer, setActivityDrawer] = useState<{
    isOpen: boolean
    fields: Array<{ name: string; oldValue: string; newValue: string }>
  }>({ isOpen: false, fields: [] })

  const timelineActivities: TimelineActivity[] = [
    {
      id: "4",
      type: "field_update",
      timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      data: {
        fields: [
          { name: "Application Status", oldValue: "Pending", newValue: "Under Review" },
          { name: "Interview Slot", oldValue: "", newValue: "25 Nov 2025, 2:00 PM" },
        ],
      },
    },
    {
      id: "3",
      type: "note_added",
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      data: {
        summary:
          "Applicant confirmed availability for interview on 25th Nov. Documents verified and complete. Strong academic background with relevant work experience. Recommended for next round.",
      },
    },
    {
      id: "2",
      type: "conversation",
      timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
      data: {
        leadName: "Sneha Patel",
        duration: 156,
        transcript:
          "Agent: Hello Sneha, I'm calling from Gitam University regarding your MBA application.\n\nSneha: Yes, thank you for calling. I wanted to check the status.\n\nAgent: Your application is currently under review. I'd like to schedule your interview...\n\n[Full conversation continues...]",
        recordingUrl: "/placeholder-audio.mp3",
      },
    },
    {
      id: "1",
      type: "call_initiated",
      timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
      data: {
        agentName: "Support Agent",
        automationId: "AUTO-9012",
        jobId: "JOB-***345",
      },
    },
  ]

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Application Details</h1>
              <p className="text-sm text-muted-foreground mt-1">Application ID: {applicationId}</p>
            </div>
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              ← Back to Automation List
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Application Information</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Program Applied</p>
              <p className="text-base font-medium mt-1">MBA - Marketing</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Application Status</p>
              <p className="text-base font-medium mt-1">Under Review</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submission Date</p>
              <p className="text-base font-medium mt-1">15 Nov 2025</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Application Form</p>
              <p className="text-base font-medium mt-1">MBA Admission 2025-26</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Counselor Assigned</p>
              <p className="text-base font-medium mt-1">Priya Sharma</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interview Scheduled</p>
              <p className="text-base font-medium mt-1">25 Nov 2025</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-base font-semibold mb-4">Activity Timeline</h3>
            <Timeline
              activities={timelineActivities}
              onViewTranscript={(transcript, recordingUrl) => {
                setTranscriptDrawer({ isOpen: true, transcript, recordingUrl })
              }}
              onViewActivity={(fields) => {
                setActivityDrawer({ isOpen: true, fields })
              }}
            />
          </div>
        </div>
      </div>

      <TranscriptDrawer
        isOpen={transcriptDrawer.isOpen}
        onClose={() => setTranscriptDrawer({ isOpen: false, transcript: "" })}
        transcript={transcriptDrawer.transcript}
        recordingUrl={transcriptDrawer.recordingUrl}
      />

      <ActivityDetailDrawer
        isOpen={activityDrawer.isOpen}
        onClose={() => setActivityDrawer({ isOpen: false, fields: [] })}
        fields={activityDrawer.fields}
      />
    </div>
  )
}
