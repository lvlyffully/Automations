"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { AutomationList } from "@/components/automation-list"
import { CreateAutomationDrawer } from "@/components/create-automation-drawer"
import { FieldUpdateDrawer } from "@/components/field-update-drawer"
import { WorkflowBuilder } from "@/components/workflow-builder"
import { PerformancePage } from "@/components/performance-page"
import { FieldUpdateDetailedReport } from "@/components/field-update-detailed-report"
import { AdvancedAllocationDetailedReport } from "@/components/advanced-allocation-detailed-report"
import { AccountSetupPage } from "@/components/account-setup-page"

type TriggerCategory = "lead-application" | "opportunity" | "activity"
type ActivitySubType = "lead-activity" | "opportunity-activity" | null

interface TriggerInfo {
  category: TriggerCategory
  activitySubType: ActivitySubType
  selectedTrigger: string
  selectedOpportunities: string[]
}

export default function AutomationDashboard() {
  const [currentView, setCurrentView] = useState<
    "list" | "workflow" | "performance" | "detailed-report" | "advanced-allocation-report" | "allocation-quota"
  >("list")
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [isFieldUpdateDrawerOpen, setIsFieldUpdateDrawerOpen] = useState(false)
  const [triggerInfo, setTriggerInfo] = useState<TriggerInfo | null>(null)
  const [selectedAutomationName, setSelectedAutomationName] = useState<string>("")
  const [selectedJobId, setSelectedJobId] = useState<string>("")
  const [selectedParentList, setSelectedParentList] = useState<string>("")

  const handleCreateAutomation = (info: TriggerInfo) => {
    setTriggerInfo(info)
    setIsCreateDrawerOpen(false)
    setCurrentView("workflow")
  }

  const handleFieldUpdateSave = () => {
    setIsFieldUpdateDrawerOpen(false)
  }

  const handleViewPerformance = (automationName: string, parentList: string) => {
    setSelectedAutomationName(automationName)
    setSelectedParentList(parentList)
    setCurrentView("performance")
  }

  const handleViewDetailedReport = (jobId: string, reportType?: string) => {
    setSelectedJobId(jobId)
    if (reportType === "advanced-allocation") {
      setCurrentView("advanced-allocation-report")
    } else {
      setCurrentView("detailed-report")
    }
  }

  const handleAllocationQuotaClick = () => {
    setCurrentView("allocation-quota")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {currentView === "list" ? (
          <AutomationList
            onCreateClick={() => setIsCreateDrawerOpen(true)}
            onFieldUpdateClick={() => setIsFieldUpdateDrawerOpen(true)}
            onViewPerformance={handleViewPerformance}
            onAllocationQuotaClick={handleAllocationQuotaClick}
          />
        ) : currentView === "performance" ? (
          <PerformancePage
            onBackToList={() => setCurrentView("list")}
            automationName={selectedAutomationName}
            parentList={selectedParentList}
            onViewDetailedReport={handleViewDetailedReport}
          />
        ) : currentView === "detailed-report" ? (
          <FieldUpdateDetailedReport
            onBack={() => setCurrentView("performance")}
            jobId={selectedJobId}
            parentList={selectedParentList}
          />
        ) : currentView === "advanced-allocation-report" ? (
          <AdvancedAllocationDetailedReport
            onBack={() => setCurrentView("performance")}
            jobId={selectedJobId}
            parentList={selectedParentList}
            automationId="6559"
          />
        ) : currentView === "allocation-quota" ? (
          <AccountSetupPage onBackToList={() => setCurrentView("list")} />
        ) : (
          <WorkflowBuilder onBackToList={() => setCurrentView("list")} triggerInfo={triggerInfo} />
        )}
      </div>

      <CreateAutomationDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSave={handleCreateAutomation}
      />

      <FieldUpdateDrawer
        isOpen={isFieldUpdateDrawerOpen}
        onClose={() => setIsFieldUpdateDrawerOpen(false)}
        onSave={handleFieldUpdateSave}
      />
    </div>
  )
}
