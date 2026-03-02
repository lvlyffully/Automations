"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Timeline } from "@/components/timeline"
import { TranscriptDrawer } from "@/components/transcript-drawer"
import { ActivityDetailDrawer } from "@/components/activity-detail-drawer"

interface LeadData {
  id: string
  name: string
  email: string
  mobile: string
  stage: string
  leadScore: number
  addedOn: string
  lastActive: string
  communicationStatus: {
    emailSent: number
    smsSent: number
  }
  telephonyStatus: {
    inboundCall: number
    outboundCall: number
    campaignCall: number
  }
  assignedOwner: string | null
  assignedRA: string | null
  leadSource: string
  timeline: TimelineEntry[]
}

interface TimelineEntry {
  id: string
  type: "call" | "note" | "update" | "email" | "sms"
  title: string
  description: string
  timestamp: string
  icon: string
  details?: {
    campaignName?: string
    phoneNumber?: string
    duration?: string
    status?: string
  }
}

interface Activity {
  id: string
  type: "field_update" | "note_added" | "conversation" | "call_initiated"
  timestamp: string
  data: {
    fields?: Array<{ name: string; oldValue: string; newValue: string }>
    summary?: string
    leadName?: string
    duration?: number
    transcript?: string
    recordingUrl?: string
    agentName?: string
    automationId?: string
    jobId?: string
  }
}

export default function LeadProfilePage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.leadId as string

  const [loading, setLoading] = useState(true)
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const [activeTab, setActiveTab] = useState<"timeline" | "details" | "notes" | "logs">("timeline")
  const [parentList, setParentList] = useState<"Lms" | "Opportunity" | "Application">("Lms")

  const [transcriptDrawer, setTranscriptDrawer] = useState<{
    isOpen: boolean
    transcript: string
    recordingUrl?: string
  }>({ isOpen: false, transcript: "" })

  const [activityDrawer, setActivityDrawer] = useState<{
    isOpen: boolean
    fields: Array<{ name: string; oldValue: string; newValue: string }>
  }>({ isOpen: false, fields: [] })

  const [timelineActivities, setTimelineActivities] = useState<Activity[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedParentList = sessionStorage.getItem("profileParentList") as "Lms" | "Opportunity" | "Application"
      if (storedParentList) {
        setParentList(storedParentList)
      }
    }

    setTimeout(() => {
      const activities: Activity[] = [
        {
          id: "4",
          type: "field_update",
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          data: {
            fields: [
              { name: "Lead Stage", oldValue: "Untouched", newValue: "Contacted" },
              { name: "Interest Level", oldValue: "", newValue: "High" },
              { name: "Preferred Course", oldValue: "", newValue: "MBA Marketing" },
            ],
          },
        },
        {
          id: "3",
          type: "note_added",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          data: {
            summary:
              "Lead expressed strong interest in MBA program. Prefers Marketing specialization. Wants to start in January 2026 batch. Budget comfortable with fee structure. Requested callback for campus tour.",
          },
        },
        {
          id: "2",
          type: "conversation",
          timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          data: {
            leadName: "MIRA",
            duration: 186,
            transcript:
              "Agent: Hello, this is Ria from Gitam University. Am I speaking with Mira?\n\nMira: Yes, speaking.\n\nAgent: Great! I'm calling to discuss our MBA program. Do you have a few minutes?\n\nMira: Yes, I'm interested. Tell me more about the Marketing specialization.\n\nAgent: Excellent! Our MBA Marketing program is designed to...\n\n[Full conversation transcript continues...]",
            recordingUrl: "/placeholder-audio.mp3",
          },
        },
        {
          id: "1",
          type: "call_initiated",
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          data: {
            agentName: "Sales Agent",
            automationId: "AUTO-1234",
            jobId: "JOB-***567",
          },
        },
      ]

      setTimelineActivities(activities)

      setLeadData({
        id: leadId,
        name: "MIRA",
        email: "NA",
        mobile: "+91**********77",
        stage: "Untouched",
        leadScore: 3,
        addedOn: "30 Oct 2025 01:38 PM",
        lastActive: "NA",
        communicationStatus: {
          emailSent: 0,
          smsSent: 0,
        },
        telephonyStatus: {
          inboundCall: 0,
          outboundCall: 0,
          campaignCall: 0,
        },
        assignedOwner: null,
        assignedRA: null,
        leadSource: "Offline: Blank",
        timeline: [],
      })
      setLoading(false)
    }, 800)
  }, [leadId])

  const handleBack = () => {
    router.push("/")
  }

  const getPageTitle = () => {
    if (parentList === "Opportunity") return "Opportunity Details"
    if (parentList === "Application") return "Application Details"
    return "Lead Details"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading lead profile...</p>
        </div>
      </div>
    )
  }

  if (!leadData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium mb-2">Lead not found</p>
          <Button onClick={handleBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              ← Back to Automation List
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>

          {/* Lead Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left: Avatar and Basic Info */}
              <div className="col-span-3">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xl font-semibold">
                      {leadData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{leadData.name}</h2>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">Lead Stage:</span>
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        {leadData.stage}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>📧 {leadData.email}</div>
                      <div>📞 {leadData.mobile}</div>
                      <div>📅 Added On: {leadData.addedOn}</div>
                      <div>🕒 Last Active: {leadData.lastActive}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle: Lead Score */}
              <div className="col-span-2 flex flex-col items-center justify-center border-x border-gray-200">
                <div className="text-5xl font-bold text-gray-900 mb-2">{leadData.leadScore}</div>
                <div className="text-sm text-gray-500 mb-3">Lead Score</div>
                <Button variant="outline" size="sm" className="w-full bg-transparent text-xs">
                  % Generate Lead Strength
                </Button>
              </div>

              {/* Right: Stats Grid */}
              <div className="col-span-7 grid grid-cols-3 gap-4">
                {/* Communication Status */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Communication Status</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Email Sent - {leadData.communicationStatus.emailSent}</div>
                    <div>SMS Sent - {leadData.communicationStatus.smsSent}</div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Upcoming Followup</h3>
                    <div className="text-sm text-gray-600">NA</div>
                  </div>
                </div>

                {/* Telephony Status */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Telephony Status</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Inbound Call - {leadData.telephonyStatus.inboundCall}</div>
                    <div>Outbound Call - {leadData.telephonyStatus.outboundCall}</div>
                    <div>Campaign Call - {leadData.telephonyStatus.campaignCall}</div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Lead Source</h3>
                    <div className="text-sm text-gray-600">{leadData.leadSource}</div>
                  </div>
                </div>

                {/* Assigned */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Assigned Owner</h3>
                  <div className="text-sm text-gray-600 mb-3">{leadData.assignedOwner || "NA"}</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Assigned RA</h3>
                  <div className="text-sm text-gray-600">{leadData.assignedRA || "NA"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Tabs */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setActiveTab("details")}
                className={`w-full px-4 py-3 text-left text-sm font-medium border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  activeTab === "details" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                }`}
              >
                👤 Lead Details
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`w-full px-4 py-3 text-left text-sm font-medium border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  activeTab === "timeline" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                }`}
              >
                🕒 Timeline
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`w-full px-4 py-3 text-left text-sm font-medium border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  activeTab === "notes" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                }`}
              >
                📝 Notes
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                  activeTab === "logs" ? "bg-purple-50 text-purple-700" : "text-gray-700"
                }`}
              >
                📞 Call Logs
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="col-span-9">
            {activeTab === "timeline" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
                </div>

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
            )}

            {activeTab === "details" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Details</h2>
                <div className="text-sm text-gray-600">Detailed lead information will appear here.</div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
                <div className="text-sm text-gray-600">Lead notes will appear here.</div>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Logs</h2>
                <div className="text-sm text-gray-600">Call logs will appear here.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawers */}
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
