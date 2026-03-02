"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, ChevronDown, Mail, Shuffle, Settings, Phone, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

interface PerformancePageProps {
  onBackToList: () => void
  automationName: string
  parentList: string
  onViewDetailedReport: (jobId: string, reportType?: string) => void
}

export function PerformancePage({
  onBackToList,
  automationName,
  parentList,
  onViewDetailedReport,
}: PerformancePageProps) {
  const router = useRouter()

  const logs = [
    {
      id: "Job-3974662",
      preview: "conditional-paths",
      templateName: "-",
      status: "In Progress",
      startDate: "6 NOV, 25 7:23 PM",
      listName: "1",
      segmentName: "-",
      targetedAudience: "2",
      deliveredTo: "-",
      automationId: "6559",
      campaignName: "NA",
      campaignType: "NA",
      type: "automation",
    },
    {
      id: "Job-3974663",
      preview: "advanced-allocation",
      templateName: "Advanced Allocation Node",
      status: "Completed",
      startDate: "29 DEC, 25 11:36 AM",
      listName: "1",
      segmentName: "-",
      targetedAudience: "15",
      deliveredTo: "12",
      automationId: "6559",
      campaignName: "Lead Assignment",
      campaignType: "Allocation",
      type: "advanced-allocation",
    },
    {
      id: "Job-3974661",
      preview: "email",
      templateName: "Automation Template",
      status: "In Progress",
      startDate: "6 NOV, 25 7:23 PM",
      listName: "1",
      segmentName: "-",
      targetedAudience: "2",
      deliveredTo: "-",
      automationId: "6559",
      campaignName: "NA",
      campaignType: "NA",
      type: "email",
    },
    {
      id: "Job-3973598",
      preview: "mio-ai-calling",
      templateName: "AI Calling Agent",
      status: "Completed",
      startDate: "20 NOV, 25 10:50 AM",
      listName: "1",
      segmentName: "-",
      targetedAudience: "1",
      deliveredTo: "1",
      automationId: "6559",
      campaignName: "lead qualification to Mira",
      campaignType: "AI Calling",
      type: "mio-ai-calling",
    },
    {
      id: "Job-3973597",
      preview: "mio-ai-calling",
      templateName: "Sales Outreach Agent",
      status: "In Progress",
      startDate: "21 NOV, 25 4:12 PM",
      listName: "1",
      segmentName: "-",
      targetedAudience: "5",
      deliveredTo: "3",
      automationId: "6559",
      campaignName: "Product Demo Scheduling",
      campaignType: "AI Calling",
      type: "mio-ai-calling",
    },
    {
      id: "Job-3973596",
      preview: "mio-ai-calling",
      templateName: "Customer Support Agent",
      status: "Completed",
      startDate: "19 NOV, 25 2:30 PM",
      listName: "2",
      segmentName: "-",
      targetedAudience: "8",
      deliveredTo: "7",
      automationId: "6559",
      campaignName: "Follow-up Campaign",
      campaignType: "AI Calling",
      type: "mio-ai-calling",
    },
    {
      id: "Job-3974660",
      preview: "automation",
      templateName: "Automation Allocate",
      status: "In Progress",
      startDate: "6 NOV, 25 7:23 PM",
      listName: "1",
      segmentName: "-",
      targetedAudience: "-",
      deliveredTo: "-",
      automationId: "6559",
      campaignName: "NA",
      campaignType: "NA",
      type: "automation",
    },
  ]

  const handleJobIdClick = (log: (typeof logs)[0]) => {
    if (log.type === "mio-ai-calling") {
      sessionStorage.setItem("reportParentList", parentList)
      sessionStorage.setItem("reportJobId", log.id)
      router.push(`/report?jobId=${log.id}`)
    } else if (log.type === "advanced-allocation") {
      onViewDetailedReport(log.id, "advanced-allocation")
    } else {
      onViewDetailedReport(log.id)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-muted">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToList}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Manage Automation List</span>
            </Button>
          </div>
        </div>

        {/* Page Title and Actions */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Manage Communication Logs</h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by Job Id, Subject"
                className="pl-10 pr-4 py-2 w-80 border-border"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
              <span>Action</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Record Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Total {logs.length} Records</p>
        </div>

        {/* Data Table */}
        <div className="bg-background rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead className="font-semibold text-foreground">Job ID</TableHead>
                <TableHead className="font-semibold text-foreground">Preview</TableHead>
                <TableHead className="font-semibold text-foreground">Template Name</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Communication Start Date</TableHead>
                <TableHead className="font-semibold text-foreground">List Name</TableHead>
                <TableHead className="font-semibold text-foreground">Segment Name</TableHead>
                <TableHead className="font-semibold text-foreground">Targeted Audience</TableHead>
                <TableHead className="font-semibold text-foreground">
                  <div className="flex items-center space-x-1">
                    <span>Delivered To</span>
                    <span className="text-muted-foreground cursor-help" title="Information">
                      ⓘ
                    </span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-foreground">Automation ID</TableHead>
                <TableHead className="font-semibold text-foreground">Campaign Name</TableHead>
                <TableHead className="font-semibold text-foreground">Campaign Type</TableHead>
                <TableHead className="font-semibold text-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={index} className="hover:bg-muted">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <button className="text-primary hover:underline font-medium" onClick={() => handleJobIdClick(log)}>
                      {log.id}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {log.preview === "email" ? (
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      ) : log.preview === "mio-ai-calling" ? (
                        <Phone className="w-4 h-4 text-accent-foreground" />
                      ) : log.preview === "advanced-allocation" ? (
                        <Users className="w-4 h-4 text-teal-600" />
                      ) : (
                        <Shuffle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="underline cursor-pointer">
                        {log.preview === "email"
                          ? "Email"
                          : log.preview === "mio-ai-calling"
                            ? "Mio AI Calling"
                            : log.preview === "conditional-paths"
                              ? "Conditional Paths"
                              : log.preview === "advanced-allocation"
                                ? "Advanced Allocation"
                                : "Automation Allocate"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{log.templateName}</TableCell>
                  <TableCell>
                    <span
                      className={
                        log.status === "Completed"
                          ? "text-success-foreground font-medium"
                          : "text-warning-foreground font-medium"
                      }
                    >
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground">{log.startDate}</TableCell>
                  <TableCell>
                    <button className="text-primary hover:underline">{log.listName}</button>
                  </TableCell>
                  <TableCell className="text-foreground">{log.segmentName}</TableCell>
                  <TableCell className="text-foreground">{log.targetedAudience}</TableCell>
                  <TableCell className="text-foreground">{log.deliveredTo}</TableCell>
                  <TableCell className="text-foreground">{log.automationId}</TableCell>
                  <TableCell className="text-foreground">{log.campaignName}</TableCell>
                  <TableCell className="text-foreground">{log.campaignType}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Load More Button */}
          <div className="flex justify-center py-4 border-t border-border">
            <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
              <span>⟳</span>
              <span>Load More Logs</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-background border-t px-6 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Copyright © 2025 NoPaperForms Solutions Limited. All Rights Reserved | Location (IP address) : 14.99.39.146
          </div>
          <div className="flex items-center space-x-3">
            <span className="cursor-pointer hover:text-foreground">in</span>
            <span className="cursor-pointer hover:text-foreground">𝕏</span>
            <span className="cursor-pointer hover:text-foreground">f</span>
            <span className="cursor-pointer hover:text-foreground">📷</span>
          </div>
        </div>
      </div>
    </div>
  )
}
