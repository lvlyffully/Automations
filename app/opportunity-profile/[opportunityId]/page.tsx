"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Timeline, type TimelineActivity } from "@/components/timeline"
import { TranscriptDrawer } from "@/components/transcript-drawer"
import { ActivityDetailDrawer } from "@/components/activity-detail-drawer"

export default function OpportunityProfilePage() {
  const params = useParams()
  const router = useRouter()
  const opportunityId = params.opportunityId as string

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
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      data: {
        fields: [
          { name: "Opportunity Stage", oldValue: "New", newValue: "Qualification" },
          { name: "Next Step", oldValue: "", newValue: "Send proposal" },
        ],
      },
    },
    {
      id: "3",
      type: "note_added",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      data: {
        summary:
          "Lead confirmed budget alignment with our MBA program. Interested in scholarship opportunities. Decision maker identified - needs to consult with family before final commitment.",
      },
    },
    {
      id: "2",
      type: "conversation",
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      data: {
        leadName: "Rajesh Kumar",
        duration: 245,
        transcript:
          "Agent: Hello Rajesh, this is Priya from Gitam University. I'm calling regarding your interest in our MBA program.\n\nRajesh: Yes, I've been looking at your program. Can you tell me about the fee structure?\n\nAgent: Our total program fee is ₹1,50,000...\n\n[Full conversation continues...]",
        recordingUrl: "/placeholder-audio.mp3",
      },
    },
    {
      id: "1",
      type: "call_initiated",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      data: {
        agentName: "Lead Qualification Agent",
        automationId: "AUTO-5678",
        jobId: "JOB-***890",
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
              <h1 className="text-2xl font-semibold text-foreground">Opportunity Details</h1>
              <p className="text-sm text-muted-foreground mt-1">Opportunity ID: {opportunityId}</p>
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
          <h2 className="text-lg font-semibold mb-4">Opportunity Information</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Opportunity Name</p>
              <p className="text-base font-medium mt-1">MBA Program - {opportunityId.slice(0, 8)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stage</p>
              <p className="text-base font-medium mt-1">Qualification</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-base font-medium mt-1">₹1,50,000</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Close Date</p>
              <p className="text-base font-medium mt-1">30 Dec 2025</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Opportunity Owner</p>
              <p className="text-base font-medium mt-1">Rahul Kumar</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="text-base font-medium mt-1">Website</p>
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
