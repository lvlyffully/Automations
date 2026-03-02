"use client"

import { Button } from "@/components/ui/button"
import { Search, Filter, Download, ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { AppliedConditionsDrawer } from "./applied-conditions-drawer"

interface FieldUpdateDetailedReportProps {
  onBack: () => void
  jobId: string
  parentList: string
}

export function FieldUpdateDetailedReport({ onBack, jobId, parentList }: FieldUpdateDetailedReportProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string>("")
  const [isElsePath, setIsElsePath] = useState(false)

  const pathConditionsMap: Record<string, any> = {
    "Condition For Path 1": {
      logic: "all" as const,
      conditions: [
        {
          id: "1",
          module: "Lead Manager",
          field: "LM Text Type Field",
          operator: "Equals",
          value: "Hello",
        },
        {
          id: "2",
          module: "Lead Manager",
          field: "LM Numeric Type Field",
          operator: "Is Not Empty",
        },
        {
          id: "3",
          module: "Opportunity Manager",
          subModule: "Opportunity List 1",
          field: "OM1 Numeric Type Field",
          operator: "Between",
          value: "23 - 666",
        },
      ],
    },
    "Condition For Path 3": {
      logic: "all" as const,
      conditions: [
        {
          id: "1",
          module: "Lead Manager",
          field: "LM Text Type Field",
          operator: "Contains",
          value: "test",
        },
      ],
    },
    "Condition For Path 4": {
      logic: "any" as const,
      conditions: [
        {
          id: "1",
          module: "Telephony",
          field: "Call Duration",
          operator: "Greater Than",
          value: "300",
        },
      ],
    },
    "Condition For Path 6": {
      logic: "all" as const,
      conditions: [
        {
          id: "1",
          module: "Dynamic Activity",
          field: "Activity Type",
          operator: "Equals",
          value: "Email",
        },
      ],
    },
  }

  const handlePathClick = (pathName: string) => {
    if (pathName !== "-") {
      setSelectedPath(pathName)
      setIsElsePath(pathName === "Else Path")
      setIsDrawerOpen(true)
    }
  }

  const isOpportunity = parentList.toLowerCase() === "opportunity"
  const columnName = isOpportunity ? "Opportunity ID" : "Lead ID"
  const updateType = isOpportunity ? "Opportunity" : "Lead"

  const records = [
    {
      automationId: "6482",
      jobId: "3973598",
      leadOpportunityId: "3772bf28db8343c7be4910a05e4ef0f1",
      processedFor: { name: "Test", email: "********@gmailinator.com" },
      pathEvaluated: "Condition For Path 1",
      updateType: updateType,
      updateTime: "04/11/2025, 07:54 pm",
      status: "Success",
    },
    {
      automationId: "6482",
      jobId: "3973598",
      leadOpportunityId: "3772bf28db8343c7be4910a05e4ef0f1",
      processedFor: { name: "testingone", email: "**********@yogmail.com" },
      pathEvaluated: "-",
      updateType: updateType,
      updateTime: "04/11/2025, 07:54 pm",
      status: "Failed",
    },
    {
      automationId: "6482",
      jobId: "3973598",
      leadOpportunityId: "3772bf28db8343c7be4910a05e4ef0f1",
      processedFor: { name: "test", email: "********@yogmail.com" },
      pathEvaluated: "Condition For Path 3",
      updateType: updateType,
      updateTime: "04/11/2025, 07:49 pm",
      status: "Success",
    },
    {
      automationId: "6482",
      jobId: "3973598",
      leadOpportunityId: "3772bf28db8343c7be4910a05e4ef0f1",
      processedFor: { name: "Applicant", email: "****@yogmail.com" },
      pathEvaluated: "Condition For Path 4",
      updateType: updateType,
      updateTime: "04/11/2025, 07:49 pm",
      status: "Success",
    },
    {
      automationId: "6482",
      jobId: "3973598",
      leadOpportunityId: "3772bf28db8343c7be4910a05e4ef0f1",
      processedFor: { name: "testingone", email: "**********@yogmail.com" },
      pathEvaluated: "-",
      updateType: updateType,
      updateTime: "04/11/2025, 06:34 pm",
      status: "Failed",
    },
    {
      automationId: "6482",
      jobId: "3973598",
      leadOpportunityId: "3772bf28db8343c7be4910a05e4ef0f1",
      processedFor: { name: "Test", email: "********@gmailinator.com" },
      pathEvaluated: "Condition For Path 6",
      updateType: updateType,
      updateTime: "04/11/2025, 06:34 pm",
      status: "Success",
    },
    {
      automationId: "6482",
      jobId: "3973598",
      leadOpportunityId: "3772bf28db8343c7be4910a05e4ef0f1",
      processedFor: { name: "test", email: "********@yogmail.com" },
      pathEvaluated: "Else Path",
      updateType: updateType,
      updateTime: "04/11/2025, 05:19 pm",
      status: "Success",
    },
  ]

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
          <h1 className="text-lg font-semibold text-foreground">Conditional Paths Evaluation Report</h1>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Download className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="font-semibold text-foreground">Automation ID</TableHead>
              <TableHead className="font-semibold text-foreground">Job ID</TableHead>
              <TableHead className="font-semibold text-foreground">{columnName}</TableHead>
              <TableHead className="font-semibold text-foreground">Processed For</TableHead>
              <TableHead className="font-semibold text-foreground">Evaluated Path </TableHead>
              <TableHead className="font-semibold text-foreground">Update Type</TableHead>
              <TableHead className="font-semibold text-foreground">Update Time</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index} className="hover:bg-muted">
                <TableCell className="text-foreground">{record.automationId}</TableCell>
                <TableCell className="text-foreground">{record.jobId}</TableCell>
                <TableCell className="text-foreground font-mono text-xs">{record.leadOpportunityId}</TableCell>
                <TableCell>
                  {record.processedFor ? (
                    <div className="flex flex-col">
                      <span className="text-primary font-medium">{record.processedFor.name}</span>
                      <span className="text-muted-foreground text-xs">{record.processedFor.email}</span>
                    </div>
                  ) : (
                    <span className="text-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {record.pathEvaluated === "-" ? (
                    <span className="text-foreground">-</span>
                  ) : (
                    <button
                      onClick={() => handlePathClick(record.pathEvaluated)}
                      className="text-primary font-medium hover:underline cursor-pointer"
                    >
                      {record.pathEvaluated}
                    </button>
                  )}
                </TableCell>
                <TableCell className="text-foreground">{record.updateType}</TableCell>
                <TableCell className="text-foreground">{record.updateTime}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      record.status === "Success"
                        ? "bg-success/10 text-success-foreground"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {record.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center justify-end space-x-4">
          <span className="text-sm text-muted-foreground">Show Total Records</span>
          <span className="text-sm text-muted-foreground">Show Rows</span>
          <Select defaultValue="10">
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

      <AppliedConditionsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        pathName={selectedPath}
        conditions={pathConditionsMap[selectedPath]?.conditions || []}
        logic={pathConditionsMap[selectedPath]?.logic || "all"}
        isElsePath={isElsePath}
      />
    </div>
  )
}
