"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CallDetailsDrawer } from "@/components/call-details-drawer"

interface CallRecord {
  automationId: string
  jobId: string
  leadId: string
  opportunityList?: string
  applicationForm?: string
  processedFor: {
    name: string
    email: string
    phone: string
  }
  callStartTime: string
  callDuration: number
  status: "pending" | "failed" | "not_answered" | "success"
  metsUsed: number
  failureReason?: string
}

interface CampaignStats {
  totalCalls: number
  pending: number
  failed: number
  answered: number
  notAnswered: number
  avgDuration: string
  totalCost: number
  metsUsed: number
}

const STATS: CampaignStats = {
  totalCalls: 15,
  pending: 2,
  failed: 6,
  answered: 5,
  notAnswered: 2,
  avgDuration: "1m 35s",
  totalCost: 18.5,
  metsUsed: 18.5,
}

const LMS_RECORDS: CallRecord[] = [
  {
    automationId: "6482",
    jobId: "Job-3973598",
    leadId: "3772bf28db8343c7be4910a05e4ef0f1",
    processedFor: {
      name: "Mira",
      email: "mira@gmailinator.com",
      phone: "+91-99******00",
    },
    callStartTime: "20/11/2025 10.50.26 AM",
    callDuration: 20,
    status: "success",
    metsUsed: 2.0,
  },
  {
    automationId: "6483",
    jobId: "Job-3973599",
    leadId: "4882cf39ec9453d8ce5a20b16f5gef1f2",
    processedFor: {
      name: "Rajesh Kumar",
      email: "rajesh.k@example.com",
      phone: "+91-98******45",
    },
    callStartTime: "20/11/2025 11.15.42 AM",
    callDuration: 0,
    status: "failed",
    metsUsed: 0.3,
    failureReason: "Invalid phone number",
  },
  {
    automationId: "6484",
    jobId: "Job-3973600",
    leadId: "5993dg40fd0564e9df6b31c27g6hfg2g3",
    processedFor: {
      name: "Priya Sharma",
      email: "priya.sharma@test.com",
      phone: "+91-97******88",
    },
    callStartTime: "20/11/2025 11.32.18 AM",
    callDuration: 0,
    status: "not_answered",
    metsUsed: 0.5,
  },
]

const OPPORTUNITY_RECORDS: CallRecord[] = [
  {
    automationId: "7501",
    jobId: "Job-4083701",
    leadId: "8001ab12cd3456ef78gh90ij12kl34mn56",
    opportunityList: "MBA Admissions 2025",
    processedFor: {
      name: "Amit Verma",
      email: "amit.v@business.com",
      phone: "+91-95******23",
    },
    callStartTime: "21/11/2025 09.15.30 AM",
    callDuration: 145,
    status: "success",
    metsUsed: 2.2,
  },
  {
    automationId: "7502",
    jobId: "Job-4083702",
    leadId: "8002bc23de4567fg89hi01jk23lm45no67",
    opportunityList: "Engineering Programs",
    processedFor: {
      name: "Sneha Joshi",
      email: "sneha.joshi@tech.com",
      phone: "+91-94******56",
    },
    callStartTime: "21/11/2025 10.42.18 AM",
    callDuration: 0,
    status: "failed",
    metsUsed: 0.3,
    failureReason: "Network connection timeout",
  },
  {
    automationId: "7503",
    jobId: "Job-4083703",
    leadId: "8003cd34ef5678gh90ij12kl34mn56op78",
    opportunityList: "MBA Admissions 2025",
    processedFor: {
      name: "Rahul Desai",
      email: "rahul.d@corporate.in",
      phone: "+91-93******89",
    },
    callStartTime: "21/11/2025 11.28.45 AM",
    callDuration: 0,
    status: "not_answered",
    metsUsed: 0.5,
  },
]

const APPLICATION_RECORDS: CallRecord[] = [
  {
    automationId: "8601",
    jobId: "Job-5194801",
    leadId: "9001de45fg6789hi01jk23lm45no67pq89",
    applicationForm: "Graduate Application Form 2025",
    processedFor: {
      name: "Kavya Iyer",
      email: "kavya.iyer@students.edu",
      phone: "+91-92******34",
    },
    callStartTime: "22/11/2025 08.30.12 AM",
    callDuration: 210,
    status: "success",
    metsUsed: 2.8,
  },
  {
    automationId: "8602",
    jobId: "Job-5194802",
    leadId: "9002ef56gh7890ij12kl34mn56op78qr90",
    applicationForm: "Undergraduate Admission Form",
    processedFor: {
      name: "Arjun Nair",
      email: "arjun.n@college.org",
      phone: "+91-91******67",
    },
    callStartTime: "22/11/2025 09.55.38 AM",
    callDuration: 0,
    status: "failed",
    metsUsed: 0.3,
    failureReason: "AI agent initialization failed",
  },
  {
    automationId: "8603",
    jobId: "Job-5194803",
    leadId: "9003fg67hi8901jk23lm45no67pq89rs01",
    applicationForm: "Graduate Application Form 2025",
    processedFor: {
      name: "Meera Patel",
      email: "meera.patel@university.ac.in",
      phone: "+91-90******12",
    },
    callStartTime: "22/11/2025 11.22.54 AM",
    callDuration: 0,
    status: "pending",
    metsUsed: 0.0,
  },
]

export default function ReportPage() {
  const router = useRouter()
  const [parentList, setParentList] = useState<"Lms" | "Opportunity" | "Application">("Lms")
  const [records, setRecords] = useState<CallRecord[]>(LMS_RECORDS)

  const [isCallDetailsOpen, setIsCallDetailsOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<CallRecord | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedParentList = sessionStorage.getItem("reportParentList") as "Lms" | "Opportunity" | "Application"
      if (storedParentList) {
        setParentList(storedParentList)

        // Load appropriate records based on parent list
        if (storedParentList === "Lms") {
          setRecords(LMS_RECORDS)
        } else if (storedParentList === "Opportunity") {
          setRecords(OPPORTUNITY_RECORDS)
        } else if (storedParentList === "Application") {
          setRecords(APPLICATION_RECORDS)
        }
      }
    }
  }, [])

  const handleBackToWorkflow = () => {
    router.push("/")
  }

  const handleViewCallDetails = (record: CallRecord) => {
    setSelectedRecord(record)
    setIsCallDetailsOpen(true)
  }

  const handleViewLeadProfile = (leadId: string) => {
    sessionStorage.setItem("profileParentList", "Lms")
    router.push(`/lead-profile/${leadId}`)
  }

  const handleProcessedForClick = (record: CallRecord) => {
    if (parentList === "Opportunity") {
      router.push(`/opportunity-profile/${record.leadId}`)
    } else if (parentList === "Application") {
      router.push(`/application-profile/${record.leadId}`)
    } else {
      // For LMS, go to lead profile
      sessionStorage.setItem("profileParentList", "Lms")
      router.push(`/lead-profile/${record.leadId}`)
    }
  }

  const getIdColumnLabel = () => {
    if (parentList === "Opportunity") return "Opportunity ID"
    if (parentList === "Application") return "Application ID"
    return "Lead ID"
  }

  const showExtraColumn = parentList === "Opportunity" || parentList === "Application"
  const extraColumnLabel = parentList === "Opportunity" ? "Opportunity List" : "Application Form"

  const renderStatusBadge = (status: CallRecord["status"], failureReason?: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
            Success
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <div className="relative group">
            <Badge variant="default" className="bg-red-100 text-red-700 hover:bg-red-100 cursor-help">
              Failed
            </Badge>
            {failureReason && (
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 w-max max-w-xs">
                <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg">
                  <div className="font-semibold mb-1">Failure Reason:</div>
                  <div>{failureReason}</div>
                </div>
                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        )
      case "not_answered":
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            Not Answered
          </Badge>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToWorkflow}>
                ← Back to Automation List
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Mio AI Calling Detailed Report</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                🔍 Search
              </Button>
              <Button variant="outline" size="sm">
                🔽 Filter
              </Button>
              <Button variant="outline" size="sm">
                ⬇️ Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-sm text-gray-500">Campaign ID</div>
            <div className="font-medium">#459311</div>
            <div className="text-sm text-gray-500 ml-4">AI Agent</div>
            <div className="font-medium">AI Calling Agent</div>
            <div className="text-sm text-gray-500 ml-4">Parent List</div>
            <div className="font-medium">{parentList}</div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-6">
            <StatCard
              icon={<div className="w-5 h-5 text-purple-600">📞</div>}
              label="Total Calls"
              value={STATS.totalCalls}
            />
            <StatCard
              icon={<div className="w-5 h-5 rounded-full bg-yellow-500" />}
              label="Pending"
              value={STATS.pending}
            />
            <StatCard icon={<div className="w-5 h-5 rounded-full bg-red-500" />} label="Failed" value={STATS.failed} />
            <StatCard
              icon={<div className="w-5 h-5 rounded-full bg-green-500" />}
              label="Answered"
              value={STATS.answered}
            />
            <StatCard
              icon={<div className="w-5 h-5 rounded-full bg-gray-500" />}
              label="Not Answered"
              value={STATS.notAnswered}
            />
            <StatCard
              icon={<div className="w-5 h-5 text-blue-600">⏱</div>}
              label="Avg Duration"
              value={STATS.avgDuration}
              isString
            />
            <StatCard
              icon={<div className="w-5 h-5 text-purple-600">💰</div>}
              label="METS Used"
              value={STATS.metsUsed.toFixed(1)}
              isString
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Automation ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Job ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{getIdColumnLabel()}</th>
                {showExtraColumn && (
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{extraColumnLabel}</th>
                )}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Processed For</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Call Start Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Call Duration</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">METS Used</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.jobId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{record.automationId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.jobId}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono text-xs">{record.leadId}</td>
                  {showExtraColumn && (
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {parentList === "Opportunity" ? record.opportunityList : record.applicationForm}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleProcessedForClick(record)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 text-left"
                    >
                      {record.processedFor.name} 🔗
                    </button>
                    <div className="text-xs text-gray-500">{record.processedFor.email}</div>
                    <div className="text-xs text-gray-500">{record.processedFor.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.callStartTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {record.callDuration > 0 ? `${record.callDuration} seconds` : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{record.metsUsed.toFixed(1)}</td>
                  <td className="px-4 py-3">{renderStatusBadge(record.status, record.failureReason)}</td>
                  <td className="px-4 py-3">
                    {record.status !== "not_answered" && (
                      <DropdownMenu modal={true}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <span className="text-lg">⋮</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={8}>
                          <DropdownMenuItem onClick={() => handleViewCallDetails(record)} className="cursor-pointer">
                            View Call Details
                          </DropdownMenuItem>
                          {(parentList === "Opportunity" || parentList === "Application") && (
                            <DropdownMenuItem
                              onClick={() => handleViewLeadProfile(record.leadId)}
                              className="cursor-pointer"
                            >
                              View Lead Details
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCallDetailsOpen && selectedRecord && (
        <CallDetailsDrawer
          isOpen={isCallDetailsOpen}
          onClose={() => setIsCallDetailsOpen(false)}
          callSummary="The conversation was between an agent named Ria from GI Tam University and a user named Mira. Ria initiated the call to inquire about Mira's interest in a course. However, Mira repeatedly expressed that she was not interested in the course as she had already taken admission elsewhere. Ria acknowledged Mira's responses and concluded the conversation politely, suggesting that Mira could reach out in the future if her interest changed."
          recordingUrl="https://example.com/recording.mp3"
          transcript="Agent: Hello, this is Ria from GI Tam University. Am I speaking with Mira?\n\nUser: Yes, this is Mira.\n\nAgent: Great! I'm calling to discuss your interest in our MBA program at the Visakhapatnam campus. Do you have a few minutes to talk?\n\nUser: I appreciate the call, but I've already taken admission elsewhere. I'm not interested in this course anymore.\n\nAgent: I understand. Thank you for letting me know. If your circumstances change in the future, please feel free to reach out to us. Have a great day!\n\nUser: Thank you, you too."
          duration={selectedRecord.callDuration}
        />
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  isString = false,
}: { icon: React.ReactNode; label: string; value: number | string; isString?: boolean }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <div className="text-xs text-gray-500 font-medium">{label}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{isString ? value : value}</div>
    </div>
  )
}
