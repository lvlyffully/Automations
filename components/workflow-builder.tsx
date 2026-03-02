"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Users,
  Settings,
  Plus,
  GitBranch,
  Clock,
  Mail,
  MessageSquare,
  UserPlus,
  Edit,
  MessageCircle,
  Calendar,
  Phone,
  FileText,
} from "lucide-react"
import { ConditionEditorDrawer } from "./condition-editor-drawer"
import { FieldUpdateDrawer } from "./field-update-drawer"
import { ManageEventDrawer } from "./manage-event-drawer"
import { MioAiCallingDrawer } from "./mio-ai-calling-drawer"
import { AllocateUserDrawer } from "./allocate-user-drawer"
import { AdvancedAllocationDrawer } from "./advanced-allocation-drawer"
import { PublishAutomationDialog, type PublishData } from "./publish-automation-dialog"
import { DryRunModal } from "./dry-run-modal"

type TriggerCategory = "lead-application" | "opportunity" | "activity"
type ActivitySubType = "lead-activity" | "opportunity-activity" | null

interface TriggerInfo {
  category: TriggerCategory
  activitySubType: ActivitySubType
  selectedTrigger: string
  selectedOpportunities: string[]
}

interface WorkflowBuilderProps {
  onBackToList: () => void
  triggerInfo: TriggerInfo | null
}

export function WorkflowBuilder({ onBackToList, triggerInfo }: WorkflowBuilderProps) {
  const [isConditionEditorOpen, setIsConditionEditorOpen] = useState(false)
  const [isAddStepDropdownOpen, setIsAddStepDropdownOpen] = useState(false)
  const [isManageEventDrawerOpen, setIsManageEventDrawerOpen] = useState(false)
  const [isFieldUpdateDrawerOpen, setIsFieldUpdateDrawerOpen] = useState(false)
  const [isMioAiCallingDrawerOpen, setIsMioAiCallingDrawerOpen] = useState(false)
  const [isAllocateUserDrawerOpen, setIsAllocateUserDrawerOpen] = useState(false)
  const [isAdvancedAllocationDrawerOpen, setIsAdvancedAllocationDrawerOpen] = useState(false)
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [createdEvents, setCreatedEvents] = useState<any[]>([])
  const [conditionalTreeSettingsOpen, setConditionalTreeSettingsOpen] = useState<string | null>(null)
  const [addPathDropdownOpen, setAddPathDropdownOpen] = useState<string | null>(null)
  const [pathSettingsOpen, setPathSettingsOpen] = useState<string | null>(null)
  const [pathRemovalConfirm, setPathRemovalConfirm] = useState<{
    pathId: string
    parentId: string
    warningType: "last-path" | "last-if-with-else"
  } | null>(null)
  const [editingPathId, setEditingPathId] = useState<string | null>(null)
  const [editingPathLabel, setEditingPathLabel] = useState<string>("")
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [dryRunNodeId, setDryRunNodeId] = useState<string | null>(null)
  const [reportNodeId, setReportNodeId] = useState<string | null>(null)

  const handleConditionSave = () => {
    if (editingPathId) {
      setCreatedEvents((prev) => prev.map((e) => (e.id === editingPathId ? { ...e, hasConditions: true } : e)))
    }
    setIsConditionEditorOpen(false)
    setEditingPathId(null)
    setEditingPathLabel("")
  }

  const handleStepSelect = (stepType: string) => {
    console.log("[v0] Selected step type:", stepType)
    setIsAddStepDropdownOpen(false)

    if (stepType === "conditional-paths") {
      console.log("[v0] Creating Conditional Paths with nested nodes")

      const parentNode = {
        id: `conditional_paths_${Date.now()}`,
        blockName: "Conditional Paths",
        type: "conditional-paths",
        createdAt: new Date().toISOString(),
        paths: [], // Track child path IDs
      }

      const childNode = {
        id: `path_${Date.now()}_1`,
        blockName: "Condition for Path 1",
        type: "path-condition",
        parentId: parentNode.id,
        pathNumber: 1,
        isElse: false,
        createdAt: new Date().toISOString(),
        hasConditions: false,
      }

      parentNode.paths = [childNode.id]

      setCreatedEvents((prev) => [...prev, parentNode, childNode])

      console.log("[v0] Created Conditional Paths nodes:", { parentNode, childNode })
      return
    }

    if (stepType === "schedule-event") {
      setIsManageEventDrawerOpen(true)
    } else if (stepType === "field-update") {
      setIsFieldUpdateDrawerOpen(true)
    } else if (stepType === "mio-ai-calling") {
      console.log("[v0] Adding Mio AI Calling step")
      const newEvent = {
        id: `event_${Date.now()}`,
        blockName: "Mio AI Calling",
        type: "mio-ai-calling",
        config: null, // No config initially
        createdAt: new Date().toISOString(),
      }
      setCreatedEvents((prev) => [...prev, newEvent])
      console.log("[v0] Mio AI Calling event added to workflow:", newEvent)
    } else if (stepType === "allocate-user") {
      console.log("[v0] Adding Allocate User step")
      setIsAllocateUserDrawerOpen(true)
    } else if (stepType === "advanced-allocation") {
      console.log("[v0] Adding Advanced Allocation step")
      setIsAdvancedAllocationDrawerOpen(true)
    }
  }

  const handleAddPath = (parentId: string, isElse: boolean) => {
    const parent = createdEvents.find((e) => e.id === parentId)
    if (!parent) return

    const childPaths = createdEvents.filter((e) => e.parentId === parentId)
    const hasElse = childPaths.some((p) => p.isElse)

    if (childPaths.length >= 15) {
      console.log("[v0] Maximum 15 paths reached")
      return
    }

    if (isElse && hasElse) {
      console.log("[v0] Else path already exists")
      return
    }

    const pathNumber = isElse ? childPaths.length + 1 : childPaths.filter((p) => !p.isElse).length + 1

    const newPath = {
      id: `path_${Date.now()}_${pathNumber}`,
      blockName: isElse ? "Else Path" : `Condition for Path ${pathNumber}`,
      type: "path-condition",
      parentId: parentId,
      pathNumber: pathNumber,
      isElse: isElse,
      createdAt: new Date().toISOString(),
      hasConditions: false,
    }

    if (isElse) {
      setCreatedEvents((prev) => [...prev, newPath])
    } else {
      setCreatedEvents((prev) => {
        const newEvents = [...prev]
        const parentIndex = newEvents.findIndex((e) => e.id === parentId)
        const lastChildIndex = newEvents.reduce((lastIdx, e, idx) => {
          if (e.parentId === parentId && !e.isElse) return idx
          return lastIdx
        }, parentIndex)
        newEvents.splice(lastChildIndex + 1, 0, newPath)
        return newEvents
      })

      setTimeout(() => {
        setEditingPathId(newPath.id)
        setEditingPathLabel(`Add Condition for ${newPath.blockName}`)
        setIsConditionEditorOpen(true)
      }, 100)
    }

    setAddPathDropdownOpen(null)
    console.log("[v0] Added new path:", newPath)
  }

  const handleManageEventSave = async (eventData: any) => {
    console.log("[v0] Saving event:", eventData)
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      let newEvent: any = {
        id: `event_${Date.now()}`,
        blockName: eventData.blockName,
        eventApplicableFor: eventData.eventApplicableFor,
        actionType: eventData.actionType,
        createdAt: new Date().toISOString(),
      }

      if (eventData.actionType === "Create Event") {
        const now = new Date()
        const startDateOffset = Number(eventData.startDateValue)
        const startDate = new Date(now)

        if (eventData.startDateUnit === "Day(s)") {
          startDate.setDate(now.getDate() + startDateOffset)
        } else if (eventData.startDateUnit === "Week(s)") {
          startDate.setDate(now.getDate() + startDateOffset * 7)
        } else if (eventData.startDateUnit === "Month(s)") {
          startDate.setMonth(now.getMonth() + startDateOffset)
        }

        const durationValue = Number(eventData.durationValue)
        const endDate = new Date(startDate)

        if (eventData.durationUnit === "Minute(s)") {
          endDate.setMinutes(startDate.getMinutes() + durationValue)
        } else if (eventData.durationUnit === "Hour(s)") {
          endDate.setHours(startDate.getHours() + durationValue)
        } else if (eventData.durationUnit === "Day(s)") {
          endDate.setDate(startDate.getDate() + durationValue)
        }

        newEvent = {
          ...newEvent,
          type: "Follow-up",
          assignedTo: eventData.assignOwner,
          assignToLeadOwner: eventData.assignToLeadOwner,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          computeStartFrom: eventData.computeStartFrom,
          status: "Scheduled",
        }
      }

      setCreatedEvents((prev) => [...prev, newEvent])
      console.log("[v0] Event added to workflow:", newEvent)
    } catch (error) {
      console.error("[v0] Error creating event:", error)
    } finally {
      setIsSubmitting(false)
      setIsManageEventDrawerOpen(false)
    }
  }

  const handlePublish = (data: PublishData) => {
    console.log("[v0] Publishing automation with data:", data)
    setIsPublishDialogOpen(false)
  }

  const handleRemoveConditionalTree = (parentId: string) => {
    setCreatedEvents((prev) => prev.filter((event) => event.id !== parentId && event.parentId !== parentId))
    setConditionalTreeSettingsOpen(null)
  }

  const handleRemovePath = (pathId: string) => {
    const path = createdEvents.find((e) => e.id === pathId)
    if (!path || !path.parentId) return

    const allPaths = createdEvents.filter((e) => e.parentId === path.parentId)
    const conditionalPaths = allPaths.filter((p) => !p.isElse)
    const hasElsePath = allPaths.some((p) => p.isElse)

    console.log("[v0] Removing path:", {
      totalPaths: allPaths.length,
      conditionalPaths: conditionalPaths.length,
      hasElsePath,
      isRemovingConditional: !path.isElse,
    })

    if (!path.isElse && conditionalPaths.length === 1 && hasElsePath) {
      console.log("[v0] Removing last IF path with ELSE present, showing warning")
      setPathRemovalConfirm({ pathId, parentId: path.parentId, warningType: "last-if-with-else" })
      setPathSettingsOpen(null)
      return
    }

    if (allPaths.length === 1) {
      console.log("[v0] Only 1 path exists, showing removal warning")
      setPathRemovalConfirm({ pathId, parentId: path.parentId, warningType: "last-path" })
      setPathSettingsOpen(null)
      return
    }

    console.log("[v0] More than 1 path, removing only this path")
    setCreatedEvents((prev) => prev.filter((event) => event.id !== pathId))
    setPathSettingsOpen(null)
  }

  const handleConfirmPathRemoval = () => {
    if (!pathRemovalConfirm) return

    const { pathId, parentId } = pathRemovalConfirm

    setCreatedEvents((prev) => prev.filter((event) => event.id !== parentId && event.parentId !== parentId))
    setPathRemovalConfirm(null)
  }

  const handleEditPathCondition = (pathId: string) => {
    const path = createdEvents.find((e) => e.id === pathId)
    if (path) {
      setEditingPathId(pathId)
      setEditingPathLabel(`${path.hasConditions ? "Edit" : "Add"} Condition for ${path.blockName}`)
      setIsConditionEditorOpen(true)
    }
    setPathSettingsOpen(null)
  }

  const handleMioAiCallingSave = (data: any) => {
    console.log("[v0] Saving Mio AI Calling config:", data)

    if (editingNodeId) {
      setCreatedEvents((prev) =>
        prev.map((event) =>
          event.id === editingNodeId ? { ...event, blockName: data.blockName, config: data } : event,
        ),
      )
      setEditingNodeId(null)
    } else {
      const newEvent = {
        id: `event_${Date.now()}`,
        blockName: data.blockName,
        type: "mio-ai-calling",
        config: data,
        createdAt: new Date().toISOString(),
      }
      setCreatedEvents((prev) => [...prev, newEvent])
      console.log("[v0] Mio AI Calling event added to workflow:", newEvent)
    }

    setIsMioAiCallingDrawerOpen(false)
  }

  const handleAllocateUserSave = (data: any) => {
    console.log("[v0] Saving Allocate User config:", data)

    if (editingNodeId) {
      setCreatedEvents((prev) =>
        prev.map((event) =>
          event.id === editingNodeId ? { ...event, blockName: data.blockName, config: data } : event,
        ),
      )
      setEditingNodeId(null)
    } else {
      const newEvent = {
        id: `event_${Date.now()}`,
        blockName: data.blockName,
        type: "allocate-user",
        config: data,
        createdAt: new Date().toISOString(),
      }
      setCreatedEvents((prev) => [...prev, newEvent])
      console.log("[v0] Allocate User event added to workflow:", newEvent)
    }

    setIsAllocateUserDrawerOpen(false)
  }

  const handleAdvancedAllocationSave = (data: any) => {
    console.log("[v0] Saving Advanced Allocation config:", data)

    if (editingNodeId) {
      setCreatedEvents((prev) =>
        prev.map((event) =>
          event.id === editingNodeId ? { ...event, blockName: data.blockName, config: data } : event,
        ),
      )
      setEditingNodeId(null)
    } else {
      const newEvent = {
        id: `event_${Date.now()}`,
        blockName: data.blockName,
        type: "advanced-allocation",
        config: data,
        createdAt: new Date().toISOString(),
      }
      setCreatedEvents((prev) => [...prev, newEvent])
      console.log("[v0] Advanced Allocation event added to workflow:", newEvent)
    }

    setIsAdvancedAllocationDrawerOpen(false)
  }

  const handleNodeSettingsClick = (nodeId: string, nodeType: string) => {
    console.log("[v0] Opening settings for node:", nodeId, nodeType)
    setEditingNodeId(nodeId)

    if (nodeType === "mio-ai-calling") {
      setIsMioAiCallingDrawerOpen(true)
    } else if (nodeType === "allocate-user") {
      setIsAllocateUserDrawerOpen(true)
    } else if (nodeType === "advanced-allocation") {
      setIsAdvancedAllocationDrawerOpen(true)
    }
  }

  const handleViewReport = (nodeId: string) => {
    const parentListType =
      triggerInfo?.category === "opportunity"
        ? "Opportunity"
        : triggerInfo?.category === "activity"
          ? "Application"
          : "Lms"
    sessionStorage.setItem("reportParentList", parentListType)
    sessionStorage.setItem("reportNodeId", nodeId)
    // Navigate to the report page
    window.location.href = "/report"
  }

  const stepOptions = [
    { id: "wait", label: "Wait", icon: Clock },
    { id: "if-else", label: "If/Else", icon: GitBranch },
    { id: "email", label: "Email", icon: Mail },
    { id: "sms", label: "SMS", icon: MessageSquare },
    { id: "allocate-user", label: "Allocate User", icon: UserPlus },
    { id: "advanced-allocation", label: "Advanced Allocation", icon: UserPlus },
    { id: "field-update", label: "Field Update", icon: Edit },
    { id: "whatsapp", label: "Whatsapp Message", icon: MessageCircle },
    { id: "schedule-event", label: "Manage Event", icon: Calendar },
    { id: "conditional-paths", label: "Conditional Paths", icon: GitBranch },
    { id: "mio-ai-calling", label: "Mio AI Calling", icon: Phone },
  ]

  const getDryRunInfo = (nodeId: string) => {
    const node = createdEvents.find((e) => e.id === nodeId)
    if (!node || node.type !== "mio-ai-calling" || !node.config) {
      return null
    }
    return {
      agentName: node.config.selectedAgent || "Unknown Agent",
      blockName: node.config.blockName || "Untitled Block",
    }
  }

  const dryRunInfo = dryRunNodeId ? getDryRunInfo(dryRunNodeId) : null

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBackToList}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">📋</span>
              <span className="font-medium">Testing Institute</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Total Action Nodes</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{createdEvents.length}</span>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 bg-gray-50 overflow-x-auto">
        <div className="max-w-6xl mx-auto min-w-fit">
          <div className="text-center mb-8">
            <h1 className="text-xl font-medium text-gray-600 mb-2">Demo: Your Automation Start Here</h1>
          </div>

          <div className="flex flex-col items-center space-y-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-600 rounded-l-lg"></div>
              <div className="flex items-center p-4 pl-6">
                <div className="bg-slate-600 p-2 rounded mr-4">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Automation 1739183872</div>
                  <div className="text-sm text-gray-500">List: Lms, Starts On: 10/02/2025</div>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>

            {createdEvents.map((event, index) => {
              if (event.type === "path-condition") return null

              return (
                <div key={event.id} className="w-full">
                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-gray-300"></div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-[rgba(89,56,255,1)]"></div>
                      <div className="flex items-center p-4 pl-6">
                        <div className="p-2 rounded mr-4 bg-[rgba(89,56,255,1)]">
                          {event.type === "mio-ai-calling" ? (
                            <Phone className="w-5 h-5 text-white" />
                          ) : event.type === "allocate-user" ? (
                            <UserPlus className="w-5 h-5 text-white" />
                          ) : event.type === "advanced-allocation" ? (
                            <UserPlus className="w-5 h-5 text-white" />
                          ) : (
                            <Calendar className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {event.type === "mio-ai-calling"
                              ? "Mio AI Calling"
                              : event.type === "allocate-user"
                                ? "Allocate User"
                                : event.type === "advanced-allocation"
                                  ? "Advanced Allocation"
                                  : event.blockName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.type === "mio-ai-calling" ? (
                              event.config ? (
                                <>
                                  {event.config.selectedAgent && <span>Agent: {event.config.selectedAgent}</span>}
                                  {event.config.selectedAgent && event.config.campaignName && <span> • </span>}
                                  {event.config.campaignName && <span>Campaign: {event.config.campaignName}</span>}
                                  {!event.config.selectedAgent && !event.config.campaignName && (
                                    <span>Click settings to configure</span>
                                  )}
                                </>
                              ) : (
                                <span>Mio AI Calling</span>
                              )
                            ) : event.type === "allocate-user" ? (
                              event.config ? (
                                <>
                                  {event.config.selectedUser && <span>User: {event.config.selectedUser}</span>}
                                  {event.config.selectedUser && event.config.role && <span> • </span>}
                                  {event.config.role && <span>Role: {event.config.role}</span>}
                                  {!event.config.selectedUser && !event.config.role && (
                                    <span>Click settings to configure</span>
                                  )}
                                </>
                              ) : (
                                <span>Allocate User</span>
                              )
                            ) : event.type === "advanced-allocation" ? (
                              event.config ? (
                                <>
                                  {event.config.rules && event.config.rules.length > 0 && (
                                    <span>{event.config.rules.length} rule(s) configured</span>
                                  )}
                                  {(!event.config.rules || event.config.rules.length === 0) && (
                                    <span>Click settings to configure</span>
                                  )}
                                </>
                              ) : (
                                <span>Advanced Allocation</span>
                              )
                            ) : (
                              <span>{event.blockName}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {event.type === "mio-ai-calling" && event.config && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewReport(event.id)}
                              className="hover:bg-gray-100"
                              title="View Report"
                            >
                              <FileText className="w-4 h-4 text-gray-400" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleNodeSettingsClick(event.id, event.type)}
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      {event.type === "mio-ai-calling" && event.config && event.config.selectedAgent && (
                        <div className="border-t border-gray-200 px-4 py-3 bg-purple-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="w-4 h-4 text-purple-600" />
                              <span className="font-medium">Test This Node</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDryRunNodeId(event.id)}
                              className="bg-white hover:bg-purple-50 border-purple-200"
                            >
                              Send Test Call
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="relative">
              <div
                className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer mb-2"
                onClick={() => setIsAddStepDropdownOpen(!isAddStepDropdownOpen)}
              >
                <Plus className="w-5 h-5 text-gray-400" />
              </div>

              {isAddStepDropdownOpen && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-10">
                  {stepOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleStepSelect(option.id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm text-gray-700"
                      >
                        <IconComponent className="w-4 h-4 text-gray-500" />
                        <span>{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-8">Add Step</div>

            <Button
              onClick={() => setIsPublishDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-12 py-3 text-lg rounded-lg"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      {conditionalTreeSettingsOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setConditionalTreeSettingsOpen(null)} />
      )}
      {addPathDropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setAddPathDropdownOpen(null)} />}
      {pathSettingsOpen && <div className="fixed inset-0 z-0" onClick={() => setPathSettingsOpen(null)} />}
      {isAddStepDropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setIsAddStepDropdownOpen(false)} />}

      {pathRemovalConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setPathRemovalConfirm(null)} />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Conditional Paths?</h3>
              <p className="text-sm text-gray-600 mb-6">
                {pathRemovalConfirm.warningType === "last-if-with-else"
                  ? "Removing this shall remove the Else Path Node and Conditional Paths Node as Else cannot exist without IF paths. Do you want to continue?"
                  : "Removing this shall remove the Conditional Paths Node as well. Do you want to continue?"}
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setPathRemovalConfirm(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmPathRemoval}>
                  Yes
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {dryRunInfo && (
        <DryRunModal
          isOpen={!!dryRunNodeId}
          onClose={() => setDryRunNodeId(null)}
          agentName={dryRunInfo.agentName}
          blockName={dryRunInfo.blockName}
        />
      )}

      <ConditionEditorDrawer
        isOpen={isConditionEditorOpen}
        onClose={() => {
          setIsConditionEditorOpen(false)
          setEditingPathId(null)
          setEditingPathLabel("")
        }}
        onSave={handleConditionSave}
        pathId={editingPathId || undefined}
        pathLabel={editingPathLabel}
      />

      <FieldUpdateDrawer
        isOpen={isFieldUpdateDrawerOpen}
        onClose={() => setIsFieldUpdateDrawerOpen(false)}
        onSave={() => setIsFieldUpdateDrawerOpen(false)}
      />

      <ManageEventDrawer
        isOpen={isManageEventDrawerOpen}
        onClose={() => setIsManageEventDrawerOpen(false)}
        onSave={handleManageEventSave}
        triggerInfo={triggerInfo}
      />

      <MioAiCallingDrawer
        isOpen={isMioAiCallingDrawerOpen}
        onClose={() => {
          setIsMioAiCallingDrawerOpen(false)
          setEditingNodeId(null)
        }}
        onSave={handleMioAiCallingSave}
        editingNodeId={editingNodeId}
        existingConfig={triggerInfo ? triggerInfo.selectedOpportunities : undefined}
        createdEvents={createdEvents}
      />

      <AllocateUserDrawer
        isOpen={isAllocateUserDrawerOpen}
        onClose={() => {
          setIsAllocateUserDrawerOpen(false)
          setEditingNodeId(null)
        }}
        onSave={handleAllocateUserSave}
        triggerInfo={triggerInfo}
        existingConfig={editingNodeId ? createdEvents.find((e) => e.id === editingNodeId)?.config : undefined}
      />

      <AdvancedAllocationDrawer
        isOpen={isAdvancedAllocationDrawerOpen}
        onClose={() => setIsAdvancedAllocationDrawerOpen(false)}
        onSave={handleAdvancedAllocationSave}
        triggerInfo={triggerInfo}
        existingConfig={editingNodeId ? createdEvents.find((e) => e.id === editingNodeId)?.config : undefined}
      />

      <PublishAutomationDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onPublish={handlePublish}
      />
    </div>
  )
}
