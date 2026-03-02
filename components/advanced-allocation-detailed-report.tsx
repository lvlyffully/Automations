"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Filter, ArrowLeft, MoreVertical } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdvancedAllocationDetailedReportProps {
  onBack: () => void
  jobId: string
  parentList: string
  automationId: string
}

interface AllocationRecord {
  processedFor: {
    name: string
    email: string
    phone?: string
  }
  leadId: string
  evaluatedFor: string
  ruleMatched: string | null
  ruleType: "if" | "else-if" | "else" | null
  evaluatedAt: string
  conditionEvaluatedAs: boolean
  assignedTo?: string
  allocationStatus: "Assigned" | "Unassigned" | "Fallback" | "Skipped" | "Failed"
  actionMode: "assign" | "unassign"
  failureReason?: string
  elsePathConfigured: boolean
  allocationDetails?: {
    source: string
    quotaStatus?: string
    allocationType?: string
  }
  evaluationSnapshot: {
    configName: string
    result: "TRUE" | "FALSE" | "NOT_EVALUATED"
  }[]
  conditions?: {
    matchType: "all" | "any"
    items: { field: string; operator: string; value: string }[]
  }
}

export function AdvancedAllocationDetailedReport({
  onBack,
  jobId,
  parentList,
  automationId,
}: AdvancedAllocationDetailedReportProps) {
  const [selectedRecord, setSelectedRecord] = useState<AllocationRecord | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showConditionsDetail, setShowConditionsDetail] = useState(false)
  const [searchBy, setSearchBy] = useState("leadId")
  const [searchValue, setSearchValue] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState("10")

  const isOpportunity = parentList.toLowerCase() === "opportunity"
  const columnName = isOpportunity ? "Opportunity ID" : "Lead ID"

  const records: AllocationRecord[] = [
    {
      processedFor: { name: "asasd asdd", email: "*************@yopmail.com", phone: "+91**********" },
      leadId: "4ffd696f92654d42a180d07f0bfae7f4",
      evaluatedFor: "Advanced Allocation",
      ruleMatched: "Rule 1: High Priority Leads",
      ruleType: "if",
      evaluatedAt: "29/12/2025, 11:36 am",
      conditionEvaluatedAs: false,
      allocationStatus: "Failed",
      actionMode: "assign",
      failureReason: "Lead quota exhausted for all eligible users",
      elsePathConfigured: true,
      allocationDetails: { source: "Pool", allocationType: "Lead only" },
      evaluationSnapshot: [
        { configName: "Check Shift Hours", result: "TRUE" },
        { configName: "Check Lead Quota", result: "FALSE" },
        { configName: "Owner Update Policy", result: "NOT_EVALUATED" },
      ],
      conditions: {
        matchType: "all",
        items: [
          { field: "Lead Source", operator: "equals", value: "Website" },
          { field: "Lead Score", operator: "greater than", value: "50" },
        ],
      },
    },
    {
      processedFor: { name: "rahuuh", email: "*************@yopmail.com", phone: "+91**********" },
      leadId: "481cbe636ceb429aa4e5a06ca4ccd58e",
      evaluatedFor: "Advanced Allocation",
      ruleMatched: "Rule 2: Regional Assignment",
      ruleType: "else-if",
      evaluatedAt: "29/12/2025, 11:36 am",
      conditionEvaluatedAs: true,
      assignedTo: "John Doe",
      allocationStatus: "Assigned",
      actionMode: "assign",
      elsePathConfigured: true,
      allocationDetails: { source: "Team: Sales Team A", quotaStatus: "5/10", allocationType: "Lead only" },
      evaluationSnapshot: [
        { configName: "Check Shift Hours", result: "TRUE" },
        { configName: "Check Lead Quota", result: "TRUE" },
        { configName: "Skip Assigned Records", result: "TRUE" },
        { configName: "Owner Update Policy", result: "TRUE" },
      ],
      conditions: {
        matchType: "all",
        items: [
          { field: "Region", operator: "equals", value: "North" },
          { field: "Industry", operator: "contains", value: "Tech" },
        ],
      },
    },
    {
      processedFor: { name: "rahuuh", email: "*************@yopmail.com", phone: "+91**********" },
      leadId: "481cbe636ceb429aa4e5a06ca4ccd58e",
      evaluatedFor: "Advanced Allocation",
      ruleMatched: "Rule 1: High Priority Leads",
      ruleType: "if",
      evaluatedAt: "29/12/2025, 10:59 am",
      conditionEvaluatedAs: true,
      assignedTo: "Jane Smith",
      allocationStatus: "Assigned",
      actionMode: "assign",
      elsePathConfigured: true,
      allocationDetails: { source: "User: Jane Smith", quotaStatus: "3/10", allocationType: "Lead only" },
      evaluationSnapshot: [
        { configName: "Check Shift Hours", result: "TRUE" },
        { configName: "Check Lead Quota", result: "TRUE" },
        { configName: "Skip Assigned Records", result: "NOT_EVALUATED" },
        { configName: "Owner Update Policy", result: "TRUE" },
      ],
      conditions: {
        matchType: "all",
        items: [
          { field: "Lead Source", operator: "equals", value: "Website" },
          { field: "Lead Score", operator: "greater than", value: "50" },
        ],
      },
    },
    {
      processedFor: { name: "rahuuh", email: "*************@yopmail.com", phone: "+91**********" },
      leadId: "481cbe636ceb429aa4e5a06ca4ccd58e",
      evaluatedFor: "Advanced Allocation",
      ruleMatched: "Else (Fallback)",
      ruleType: "else",
      evaluatedAt: "26/12/2025, 11:47 am",
      conditionEvaluatedAs: true,
      assignedTo: "Default User",
      allocationStatus: "Fallback",
      actionMode: "assign",
      elsePathConfigured: true,
      allocationDetails: { source: "Fallback Pool", allocationType: "Lead only" },
      evaluationSnapshot: [
        { configName: "Check Shift Hours", result: "TRUE" },
        { configName: "Check Lead Quota", result: "TRUE" },
        { configName: "Owner Update Policy", result: "TRUE" },
      ],
    },
    {
      processedFor: { name: "asasd asdd", email: "*************@yopmail.com", phone: "+91**********" },
      leadId: "4ffd696f92654d42a180d07f0bfae7f4",
      evaluatedFor: "Advanced Allocation",
      ruleMatched: null,
      ruleType: null,
      evaluatedAt: "24/12/2025, 11:06 am",
      conditionEvaluatedAs: false,
      allocationStatus: "Failed",
      actionMode: "assign",
      failureReason: "No matching rules exist",
      elsePathConfigured: false,
      allocationDetails: { source: "N/A", allocationType: "Lead only" },
      evaluationSnapshot: [
        { configName: "Rule 1: High Priority Leads", result: "FALSE" },
        { configName: "Rule 2: Regional Assignment", result: "FALSE" },
        { configName: "Else Path", result: "NOT_EVALUATED" },
      ],
    },
    {
      processedFor: { name: "testuser", email: "*************@yopmail.com", phone: "+91**********" },
      leadId: "f79e361fe762432b987c2416115360a5",
      evaluatedFor: "Advanced Allocation",
      ruleMatched: "Rule 3: Unassign Inactive",
      ruleType: "else-if",
      evaluatedAt: "24/12/2025, 11:06 am",
      conditionEvaluatedAs: true,
      allocationStatus: "Unassigned",
      actionMode: "unassign",
      elsePathConfigured: true,
      allocationDetails: { source: "Unassign Action", allocationType: "Lead only" },
      evaluationSnapshot: [{ configName: "Unassign Mode", result: "TRUE" }],
      conditions: {
        matchType: "all",
        items: [{ field: "Last Activity", operator: "older than", value: "30 days" }],
      },
    },
    {
      processedFor: { name: "newlead test", email: "*************@yopmail.com", phone: "+91**********" },
      leadId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      evaluatedFor: "Advanced Allocation",
      ruleMatched: null,
      ruleType: null,
      evaluatedAt: "23/12/2025, 09:15 am",
      conditionEvaluatedAs: false,
      allocationStatus: "Failed",
      actionMode: "assign",
      failureReason: "No matching rules exist",
      elsePathConfigured: false,
      allocationDetails: { source: "N/A", allocationType: "Lead only" },
      evaluationSnapshot: [
        { configName: "Rule 1: High Priority Leads", result: "FALSE" },
        { configName: "Rule 2: Regional Assignment", result: "FALSE" },
        { configName: "Else Path", result: "NOT_EVALUATED" },
      ],
    },
  ]

  const handleViewAllocationDetails = (record: AllocationRecord) => {
    setSelectedRecord(record)
    setIsDrawerOpen(true)
  }

  const getStatusBadge = (status: AllocationRecord["allocationStatus"]) => {
    switch (status) {
      case "Assigned":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Assigned</Badge>
      case "Fallback":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Fallback</Badge>
      case "Skipped":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Skipped</Badge>
      case "Unassigned":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Unassigned</Badge>
      case "Failed":
      default:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
    }
  }

  const getConditionBadge = (evaluated: boolean) => {
    return evaluated ? (
      <Badge className="bg-green-500 text-white hover:bg-green-500">True</Badge>
    ) : (
      <Badge className="bg-red-500 text-white hover:bg-red-500">False</Badge>
    )
  }

  const getEvaluationBadge = (result: "TRUE" | "FALSE" | "NOT_EVALUATED") => {
    switch (result) {
      case "TRUE":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">TRUE</Badge>
      case "FALSE":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">FALSE</Badge>
      case "NOT_EVALUATED":
        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 text-xs">Not Evaluated</Badge>
    }
  }

  const getRuleTypeLabel = (ruleType: "if" | "else-if" | "else" | null) => {
    switch (ruleType) {
      case "if":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">IF</Badge>
      case "else-if":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">ELSE IF</Badge>
      case "else":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">ELSE</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">None</Badge>
    }
  }

  const isSuccess = (record: AllocationRecord) => {
    if (record.actionMode === "unassign") {
      return record.allocationStatus === "Unassigned"
    }
    return record.allocationStatus === "Assigned" || record.allocationStatus === "Fallback"
  }

  const getSuccessMessage = (record: AllocationRecord) => {
    if (record.actionMode === "unassign") {
      return record.allocationStatus === "Unassigned"
        ? "Record was successfully unassigned by automation"
        : "Failed to unassign record"
    }
    if (record.allocationStatus === "Assigned") {
      return "Record was successfully assigned by automation"
    }
    if (record.allocationStatus === "Fallback") {
      return "Record was assigned using fallback allocation"
    }
    if (record.failureReason) {
      return record.failureReason
    }
    if (!record.elsePathConfigured && record.ruleMatched === null) {
      return "No matching rules exist"
    }
    return "Allocation failed - no eligible assignee found"
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Communication Logs
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-foreground">Advanced Allocation Detail Report</h1>
            <Badge variant="secondary" className="bg-teal-600 text-white">
              {parentList.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Select value={searchBy} onValueChange={setSearchBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Search By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leadId">Lead Id</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Input
                placeholder="Search by"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-48"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Automation ID - {automationId}</p>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-teal-700 hover:bg-teal-700">
              <TableHead className="font-semibold text-white">Processed For</TableHead>
              <TableHead className="font-semibold text-white">{columnName}</TableHead>
              <TableHead className="font-semibold text-white">Evaluated at</TableHead>
              <TableHead className="font-semibold text-white">Assigned To</TableHead>
              <TableHead className="font-semibold text-white">Status</TableHead>
              <TableHead className="font-semibold text-white w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index} className="hover:bg-muted border-b">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-blue-600 font-medium hover:underline cursor-pointer">
                      {record.processedFor.name}
                    </span>
                    <span className="text-muted-foreground text-xs">{record.processedFor.email}</span>
                    {record.processedFor.phone && (
                      <span className="text-muted-foreground text-xs">{record.processedFor.phone}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-foreground">{record.leadId}</TableCell>
                <TableCell className="text-foreground">{record.evaluatedAt}</TableCell>
                <TableCell className="text-foreground">{record.assignedTo || "-"}</TableCell>
                <TableCell>{getStatusBadge(record.allocationStatus)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewAllocationDetails(record)}>
                        View Allocation Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" size="sm">
            Show Total Records
          </Button>
          <span className="text-sm text-muted-foreground">Show Rows</span>
          <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="p-1 h-8 w-8 bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="p-1 h-8 w-8 bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Allocation Details Drawer */}
      {isDrawerOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => {
              setIsDrawerOpen(false)
              setShowConditionsDetail(false)
            }}
          />
          <div className="ml-auto w-[500px] bg-white h-full shadow-xl flex flex-col relative z-10">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Allocation Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsDrawerOpen(false)
                  setShowConditionsDetail(false)
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Advanced Allocation Status */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase">Advanced Allocation Status</h3>
                <div
                  className={`border rounded-lg p-4 ${isSuccess(selectedRecord) ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        isSuccess(selectedRecord)
                          ? "bg-green-600 text-white hover:bg-green-600"
                          : "bg-red-600 text-white hover:bg-red-600"
                      }
                    >
                      {isSuccess(selectedRecord) ? "Success" : "Fail"}
                    </Badge>
                    <span className="text-sm font-medium">{getSuccessMessage(selectedRecord)}</span>
                  </div>
                  {!isSuccess(selectedRecord) &&
                    !selectedRecord.elsePathConfigured &&
                    selectedRecord.ruleMatched === null && (
                      <div className="mt-3 p-3 bg-red-100 rounded text-sm text-red-800">
                        <strong>Note:</strong> No rules matched the record conditions and the Else path was not
                        configured. Consider adding an Else path to handle records that don't match any rules.
                      </div>
                    )}
                </div>
              </div>

              {/* Assigned Owner (only if assigned) */}
              {selectedRecord.assignedTo && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">Assigned Owner</h3>
                  <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {selectedRecord.assignedTo
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{selectedRecord.assignedTo}</p>
                        <p className="text-xs text-muted-foreground">Owner assigned by automation</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Allocation Details */}
              {selectedRecord.allocationDetails && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">Additional Details</h3>
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Action Mode</span>
                      <Badge
                        variant="outline"
                        className={
                          selectedRecord.actionMode === "assign"
                            ? "border-green-300 text-green-700"
                            : "border-orange-300 text-orange-700"
                        }
                      >
                        {selectedRecord.actionMode === "assign" ? "Assign" : "Unassign"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Source</span>
                      <span className="font-medium">{selectedRecord.allocationDetails.source}</span>
                    </div>
                    {selectedRecord.allocationDetails.quotaStatus && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Quota Status</span>
                        <span className="font-medium">{selectedRecord.allocationDetails.quotaStatus}</span>
                      </div>
                    )}
                    {selectedRecord.allocationDetails.allocationType && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Allocation Type</span>
                        <span className="font-medium">{selectedRecord.allocationDetails.allocationType}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rule Evaluated */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase">Rule Evaluated</h3>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rule Type</span>
                    {selectedRecord.ruleType ? (
                      getRuleTypeLabel(selectedRecord.ruleType)
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">No Match</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rule Name</span>
                    <span className="font-medium text-sm">
                      {selectedRecord.ruleMatched ||
                        (selectedRecord.elsePathConfigured
                          ? "No rule matched"
                          : "No matching rules (Else not configured)")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Else Path Configured</span>
                    <Badge
                      className={
                        selectedRecord.elsePathConfigured
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }
                    >
                      {selectedRecord.elsePathConfigured ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {selectedRecord.conditions && (
                    <div className="pt-2 border-t">
                      <button
                        onClick={() => setShowConditionsDetail(!showConditionsDetail)}
                        className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                      >
                        {showConditionsDetail ? "Hide Conditions" : "View Conditions"}
                      </button>
                      {showConditionsDetail && (
                        <div className="mt-3 p-3 bg-gray-50 rounded space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Match:{" "}
                              {selectedRecord.conditions.matchType === "all" ? "All Conditions" : "Any Condition"}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            {selectedRecord.conditions.items.map((cond, idx) => (
                              <div key={idx} className="text-xs flex items-center gap-2">
                                <span className="text-muted-foreground">{idx + 1}.</span>
                                <span className="font-medium">{cond.field}</span>
                                <span className="text-muted-foreground">{cond.operator}</span>
                                <span className="bg-blue-100 px-2 py-0.5 rounded">{cond.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Rule Details (Allocation Action) - Evaluation Snapshot */}
              {selectedRecord.evaluationSnapshot.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                    Rule Details (Allocation Action)
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-2">
                            Configuration
                          </th>
                          <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-2">
                            Evaluation Result
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.evaluationSnapshot.map((snapshot, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-4 py-3 text-sm">{snapshot.configName}</td>
                            <td className="px-4 py-3 text-right">{getEvaluationBadge(snapshot.result)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
