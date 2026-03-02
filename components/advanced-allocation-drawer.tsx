"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { X, ChevronDown, ChevronUp, Edit, Trash2, Plus, AlertCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { EditConditionOverlay } from "@/components/edit-condition-overlay"
import { EditAllocationActionOverlay } from "@/components/edit-allocation-action-overlay"


type TriggerCategory = "lead-application" | "opportunity" | "activity"
type ActivitySubType = "lead-activity" | "opportunity-activity" | null

interface TriggerInfo {
  category: TriggerCategory
  activitySubType: ActivitySubType
  selectedTrigger: string
  selectedOpportunities: string[]
}

interface RuleFallback {
  type: "pool" | "user" | "none"
  poolConfig?: any
  fallbackUserId?: string
}

interface AllocationRule {
  id: string
  name: string
  conditions: any[]
  conditionMatchType?: "all" | "any"
  allocationAction?: any
  fallback?: RuleFallback
}

interface ElseRouting {
  enabled: boolean
  allocationAction?: any
}

interface AdvancedAllocationDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  triggerInfo: TriggerInfo | null
  existingConfig?: any
}

const getConditionSummary = (rule: AllocationRule): string => {
  console.log("[v0] Getting condition summary for rule:", rule.id, "conditions:", rule.conditions)
  if (!rule.conditions || rule.conditions.length === 0) {
    return "Not configured"
  }

  const matchText = rule.conditionMatchType === "all" ? "All" : "Any"
  const count = rule.conditions.length
  return `${matchText} of ${count} condition${count > 1 ? "s" : ""}`
}

const getActionSummary = (action: any): string => {
  console.log("[v0] Getting action summary:", action)
  if (!action) return "Not configured"

  if (action.allocationMode === "unassign") {
    return "Unassign owner"
  }

  const parts: string[] = []

  // Assignment source
  if (action.assignmentSource === "activity-owner") {
    parts.push("Activity Owner")
  } else if (action.assignmentSource === "record-previous-owner") {
    parts.push("Previous Owner")
  } else if (action.assignmentSource === "previous-opportunity-owner") {
    parts.push("Prev Opp Owner")
  } else if (action.assignmentSource === "pool" && action.poolConfig) {
    const pool = action.poolConfig
    if (pool.allocateToType === "users" && pool.selectedUsers?.length > 0) {
      parts.push(`${pool.selectedUsers.length} user(s)`)
    } else if (pool.allocateToType === "teams" && pool.selectedTeams?.length > 0) {
      parts.push(`${pool.selectedTeams.length} team(s)`)
    } else if (pool.allocateToType === "attrs" && pool.userAttributeConditions?.length > 0) {
      parts.push(
        `User attrs (${pool.userAttributeConditions.length} condition${pool.userAttributeConditions.length > 1 ? "s" : ""})`,
      )
    } else {
      parts.push("Pool configured")
    }
  }

  // Allocation type
  if (action.allocationType) {
    parts.push(action.allocationType)
  }

  return parts.length > 0 ? parts.join(" → ") : "Configured"
}

const getFallbackSummary = (action: any): string => {
  if (!action?.fallbackConfig?.enabled) return "Disabled"
  const pool = action.fallbackConfig.poolConfig
  if (!pool) return "Enabled"
  if (pool.allocateToType === "users" && pool.selectedUsers?.length > 0) return `Fallback: ${pool.selectedUsers.length} user(s)`
  if (pool.allocateToType === "teams" && pool.selectedTeams?.length > 0) return `Fallback: ${pool.selectedTeams.length} team(s)`
  if (pool.allocateToType === "attrs") return "Fallback: User attributes"
  return "Enabled"
}

export function AdvancedAllocationDrawer({
  isOpen,
  onClose,
  onSave,
  triggerInfo,
  existingConfig,
}: AdvancedAllocationDrawerProps) {
  const [nodeName, setNodeName] = useState(existingConfig?.nodeName || "")
  const [nodeNameError, setNodeNameError] = useState("")

  const [rules, setRules] = useState<AllocationRule[]>(existingConfig?.rules || [])
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)
  const [editingRuleName, setEditingRuleName] = useState("")

  const [elseRouting, setElseRouting] = useState<ElseRouting>(existingConfig?.elseRouting || { enabled: false })

  const [isBasicDetailsOpen, setIsBasicDetailsOpen] = useState(true)
  const [isRulesOpen, setIsRulesOpen] = useState(true)
  const [isElseRoutingOpen, setIsElseRoutingOpen] = useState(false)

  const [isConditionOverlayOpen, setIsConditionOverlayOpen] = useState(false)
  const [isAllocationActionOverlayOpen, setIsAllocationActionOverlayOpen] = useState(false)

  const [isElseActionOverlayOpen, setIsElseActionOverlayOpen] = useState(false)

  const handleAddNewRule = () => {
    if (rules.length >= 15) {
      return
    }

    const newRule: AllocationRule = {
      id: `rule_${Date.now()}`,
      name: `Rule ${rules.length + 1}`,
      conditions: [],
      fallback: { type: "none" },
    }

    setRules([...rules, newRule])
    setEditingRuleId(newRule.id)
    setEditingRuleName(newRule.name)
  }

  const handleEditRule = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId)
    if (rule) {
      setEditingRuleId(ruleId)
      setEditingRuleName(rule.name)
    }
  }

  const handleSaveRule = () => {
    if (!editingRuleId) return

    const currentRule = rules.find((r) => r.id === editingRuleId)
    if (!currentRule) return

    if (!editingRuleName.trim()) {
      alert("Please enter a rule name")
      return
    }

    if (!currentRule.conditions || currentRule.conditions.length === 0) {
      alert("Please add at least one condition")
      return
    }

    if (!currentRule.allocationAction) {
      alert("Please configure the allocation action")
      return
    }

    setRules(
      rules.map((rule) =>
        rule.id === editingRuleId
          ? {
              ...rule,
              name: editingRuleName,
            }
          : rule,
      ),
    )

    handleCancelRuleEdit()
  }

  const handleSaveAndAddNew = () => {
    handleSaveRule()
    if (rules.length < 15) {
      setTimeout(() => handleAddNewRule(), 100)
    }
  }

  const handleCancelRuleEdit = () => {
    setEditingRuleId(null)
    setEditingRuleName("")
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId))
  }

  const handleSaveConditions = (conditions: any[], matchType: "all" | "any") => {
    console.log("[v0] handleSaveConditions called")
    console.log("[v0] editingRuleId:", editingRuleId)
    console.log("[v0] conditions received:", conditions)
    console.log("[v0] matchType:", matchType)

    if (!editingRuleId) {
      console.log("[v0] ERROR: editingRuleId is null, returning early!")
      return
    }

    setRules(
      rules.map((rule) =>
        rule.id === editingRuleId
          ? {
              ...rule,
              conditions,
              conditionMatchType: matchType,
            }
          : rule,
      ),
    )
    console.log("[v0] Conditions saved successfully for rule:", editingRuleId)
  }

  const handleSaveAllocationAction = (config: any) => {
    if (!editingRuleId) return

    setRules(
      rules.map((rule) =>
        rule.id === editingRuleId
          ? {
              ...rule,
              allocationAction: config,
            }
          : rule,
      ),
    )
  }

  const handleSaveElseAction = (config: any) => {
    setElseRouting({
      ...elseRouting,
      allocationAction: config,
    })
  }

  const handleSubmit = () => {
    setNodeNameError("")

    if (!nodeName.trim()) {
      setNodeNameError("Node Name is required")
      return
    }

    const configData = {
      nodeName: nodeName.trim(),
      rules,
      elseRouting,
    }

    onSave(configData)
    handleClose()
  }

  const handleClose = () => {
    setNodeName(existingConfig?.nodeName || "")
    setNodeNameError("")
    setRules(existingConfig?.rules || [])
    setElseRouting(existingConfig?.elseRouting || { enabled: false })
    handleCancelRuleEdit()
    onClose()
  }

  const currentEditingRule = editingRuleId ? rules.find((r) => r.id === editingRuleId) : null

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div className="fixed inset-0 bg-black/60" onClick={handleClose} />
        <div className="ml-auto w-1/2 min-w-[700px] max-w-[900px] bg-white h-full shadow-xl flex flex-col relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Advanced Allocation Node</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {/* Basic Details Section */}
            <Collapsible open={isBasicDetailsOpen} onOpenChange={setIsBasicDetailsOpen}>
              <div className="border rounded-lg">
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
                  <span className="font-medium">Basic Details</span>
                  {isBasicDetailsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 py-4 border-t space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="node-name">
                        Block Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="node-name"
                        placeholder="Enter node name"
                        value={nodeName}
                        onChange={(e) => {
                          setNodeName(e.target.value)
                          setNodeNameError("")
                        }}
                        className={nodeNameError ? "border-destructive" : ""}
                      />
                      {nodeNameError && <p className="text-xs text-destructive">{nodeNameError}</p>}
                    </div>

                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Rules Section */}
            <Collapsible open={isRulesOpen} onOpenChange={setIsRulesOpen}>
              <div className="border rounded-lg">
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Rules</span>
                    <span className="text-xs text-muted-foreground">({rules.length}/15)</span>
                  </div>
                  {isRulesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 py-4 border-t">
                    {editingRuleId ? (
                      /* Rule Editor View */
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>
                            Rule Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Enter rule name (max 80 characters)"
                            value={editingRuleName}
                            onChange={(e) => setEditingRuleName(e.target.value)}
                            maxLength={80}
                          />
                        </div>

                        {/* Define Conditions */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">Define Conditions</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {getConditionSummary(currentEditingRule)}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsConditionOverlayOpen(true)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Define Allocation Action */}
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">Define Allocation Action</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {getActionSummary(currentEditingRule?.allocationAction)}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsAllocationActionOverlayOpen(true)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>

                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                          <Button variant="outline" onClick={handleCancelRuleEdit}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveRule}>Save</Button>
                          <Button onClick={handleSaveAndAddNew} disabled={rules.length >= 15}>
                            Save & Add New
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Rules List View */
                      <div className="space-y-3">
                        {rules.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-900 font-medium">Rules are evaluated top to bottom.</p>
                            <p className="text-xs text-blue-700 mt-1">
                              First matching rule is executed. If it fails, its fallback routing applies.
                            </p>
                          </div>
                        )}

                        {rules.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-muted-foreground mb-4">No Rules Defined</p>
                            <Button onClick={handleAddNewRule} className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Add a new rule
                            </Button>
                          </div>
                        ) : (
                          <>
                            {rules.map((rule, index) => (
                              <div key={rule.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                      {index === 0 ? "IF" : "ELSE IF"}
                                    </span>
                                    <span className="font-semibold">{rule.name}</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditRule(rule.id)}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1 ml-2">
                                  <div>
                                    <strong>Conditions:</strong> {getConditionSummary(rule)}
                                  </div>
                                  <div>
                                    <strong>Action:</strong> {getActionSummary(rule.allocationAction)}
                                  </div>
                                  <div>
                                    <strong>Fallback:</strong> {getFallbackSummary(rule.allocationAction)}
                                  </div>
                                </div>
                              </div>
                            ))}

                            {rules.length < 15 && (
                              <Button
                                onClick={handleAddNewRule}
                                variant="outline"
                                className="w-full mt-2 bg-transparent"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add another rule
                              </Button>
                            )}

                            {rules.length >= 15 && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>Maximum 15 rules allowed</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Else Routing Section */}
            <Collapsible open={isElseRoutingOpen} onOpenChange={setIsElseRoutingOpen}>
              <div className="border rounded-lg">
                <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Else (no rules matched)</span>
                    {elseRouting.enabled && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Enabled</span>
                    )}
                  </div>
                  {isElseRoutingOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 py-4 border-t space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="enable-else">Enable Else routing</Label>
                        <p className="text-xs text-muted-foreground mt-1">Assigns records that don't match any rule</p>
                      </div>
                      <Switch
                        id="enable-else"
                        checked={elseRouting.enabled}
                        onCheckedChange={(checked) => setElseRouting({ ...elseRouting, enabled: checked })}
                      />
                    </div>

                    {elseRouting.enabled && (
                      <>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-xs text-amber-900">
                            <strong>Warning:</strong> Else routing assigns records that don't match any rule. For
                            multi-step branching, consider using Conditional blocks above this node.
                          </p>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">Else Allocation Action</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {elseRouting.allocationAction
                                  ? getActionSummary(elseRouting.allocationAction)
                                  : "Not configured"}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsElseActionOverlayOpen(true)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex items-center justify-end gap-3 bg-gray-50">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {currentEditingRule && (
        <>
          <EditConditionOverlay
            isOpen={isConditionOverlayOpen}
            onClose={() => setIsConditionOverlayOpen(false)}
            onSave={handleSaveConditions}
            existingConditions={currentEditingRule?.conditions || []}
            existingMatchType={currentEditingRule?.conditionMatchType || "all"}
            triggerInfo={triggerInfo}
          />

          <EditAllocationActionOverlay
            isOpen={isAllocationActionOverlayOpen}
            onClose={() => setIsAllocationActionOverlayOpen(false)}
            onSave={handleSaveAllocationAction}
            existingConfig={currentEditingRule.allocationAction}
            triggerInfo={triggerInfo}
          />
        </>
      )}

      <EditAllocationActionOverlay
        isOpen={isElseActionOverlayOpen}
        onClose={() => setIsElseActionOverlayOpen(false)}
        onSave={handleSaveElseAction}
        existingConfig={elseRouting.allocationAction}
        triggerInfo={triggerInfo}
        isElseAction={true}
      />
    </>
  )
}
