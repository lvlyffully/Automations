"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { X, Settings, Plus, Minus, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AllocationPoolConfig {
  allocateToType: "users" | "teams" | "attrs"
  selectedUsers: string[]
  selectedTeams: string[]
  userAttributeConditions?: UserAttributeCondition[]
  userAttributeMatchType?: "all" | "any"
  selectionStrategy: string
}

interface QuotaConfig {
  quotaScope: "global" | "rule-specific"
  checkLeadQuota: boolean
  leadQuotaLimit?: number
  checkApplicationQuota: boolean
  applicationQuotaLimit?: number
  checkOpportunityQuota: boolean
  opportunityQuotaLimit?: number
}

interface FallbackPoolConfig {
  allocateToType: "users" | "teams" | "attrs"
  selectedUsers: string[]
  selectedTeams: string[]
  userAttributeConditions?: UserAttributeCondition[]
  userAttributeMatchType?: "all" | "any"
  selectionStrategy: string
}

interface FallbackConfig {
  enabled: boolean
  poolConfig?: FallbackPoolConfig
}

interface AllocationActionConfig {
  allocationMode: "assign" | "unassign"
  allocationType: string
  ownerUpdate: "assign-if-unassigned" | "allow-reassignment"
  assignmentSource: "allocation-pool" | "activity-owner" | "record-previous-owner" | "previous-opportunity-owner"
  poolConfig?: AllocationPoolConfig
  quotaConfig: QuotaConfig
  checkShiftHours?: boolean
  fallbackConfig?: FallbackConfig
  unassignTargets?: string[]
}

interface TriggerInfo {
  category: string
  activitySubType: string | null
  selectedTrigger: string
  selectedOpportunities: string[]
}

interface EditAllocationActionOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: AllocationActionConfig) => void
  existingConfig?: Partial<AllocationActionConfig>
  triggerInfo: TriggerInfo | null
  isElseAction?: boolean
}

interface UserAttributeCondition {
  id: string
  field: string
  operator: string
  value: string
}

const MOCK_USERS = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Tom Brown"]
const MOCK_TEAMS = ["Sales Team", "Support Team", "Marketing Team", "Operations Team"]

const USER_ATTRIBUTE_FIELDS = [
  { value: "region", label: "Region" },
  { value: "experience", label: "Experience Level" },
  { value: "language", label: "Language" },
  { value: "department", label: "Department" },
  { value: "role", label: "Role" },
  { value: "country", label: "Country" },
  { value: "city", label: "City" },
]

const ATTRIBUTE_OPERATORS = [
  { value: "equals", label: "Equal" },
  { value: "not-equals", label: "Not Equal" },
  { value: "contains", label: "Contains" },
  { value: "not-contains", label: "Does Not Contain" },
  { value: "is-empty", label: "Is Empty" },
  { value: "is-not-empty", label: "Is Not Empty" },
]

function PoolConfigSection({
  allocateToType,
  setAllocateToType,
  selectedUsers,
  setSelectedUsers,
  selectedTeams,
  setSelectedTeams,
  selectionStrategy,
  setSelectionStrategy,
  userAttributeConditions,
  setUserAttributeConditions,
  userAttributeMatchType,
  setUserAttributeMatchType,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
}: {
  allocateToType: "users" | "teams" | "attrs"
  setAllocateToType: (v: "users" | "teams" | "attrs") => void
  selectedUsers: string[]
  setSelectedUsers: (v: string[]) => void
  selectedTeams: string[]
  setSelectedTeams: (v: string[]) => void
  selectionStrategy: string
  setSelectionStrategy: (v: string) => void
  userAttributeConditions: UserAttributeCondition[]
  setUserAttributeConditions: (v: UserAttributeCondition[]) => void
  userAttributeMatchType: "all" | "any"
  setUserAttributeMatchType: (v: "all" | "any") => void
  onAddCondition: () => void
  onRemoveCondition: (id: string) => void
  onUpdateCondition: (id: string, updates: Partial<UserAttributeCondition>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={allocateToType === "users" ? "default" : "outline"}
          className={allocateToType === "users" ? "bg-teal-600 hover:bg-teal-700 flex-1" : "flex-1"}
          onClick={() => setAllocateToType("users")}
          size="sm"
        >
          Selected Users
        </Button>
        <Button
          variant={allocateToType === "teams" ? "default" : "outline"}
          className={allocateToType === "teams" ? "bg-teal-600 hover:bg-teal-700 flex-1" : "flex-1"}
          onClick={() => setAllocateToType("teams")}
          size="sm"
        >
          Selected Teams
        </Button>
        <Button
          variant={allocateToType === "attrs" ? "default" : "outline"}
          className={allocateToType === "attrs" ? "bg-teal-600 hover:bg-teal-700 flex-1" : "flex-1"}
          onClick={() => setAllocateToType("attrs")}
          size="sm"
        >
          User Attributes
        </Button>
      </div>

      {allocateToType === "users" && (
        <div className="space-y-2">
          <Label className="text-sm">Select Users (Multiple)</Label>
          <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-1">
            {MOCK_USERS.map((user) => (
              <label key={user} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user])
                    } else {
                      setSelectedUsers(selectedUsers.filter((u) => u !== user))
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm">{user}</span>
              </label>
            ))}
          </div>
          {selectedUsers.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {selectedUsers.length} user(s) selected
            </div>
          )}
        </div>
      )}

      {allocateToType === "teams" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Select Teams (Multiple)</Label>
            <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-1">
              {MOCK_TEAMS.map((team) => (
                <label key={team} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTeams.includes(team)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTeams([...selectedTeams, team])
                      } else {
                        setSelectedTeams(selectedTeams.filter((t) => t !== team))
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{team}</span>
                </label>
              ))}
            </div>
            {selectedTeams.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {selectedTeams.length} team(s) selected
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Round-Robin Strategy</Label>
            <RadioGroup value={selectionStrategy} onValueChange={setSelectionStrategy} className="space-y-2">
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="round-robin-users" className="mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Round-Robin Across Users</div>
                  <div className="text-xs text-muted-foreground">
                    Find all active users across selected teams and round-robin between them directly
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="round-robin-teams" className="mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Round-Robin Across Teams</div>
                  <div className="text-xs text-muted-foreground">
                    {"Alternate between teams first, then users within each team (Team 1 User 1 → Team 2 User 1 → Team 1 User 2 → Team 2 User 2...)"}
                  </div>
                </div>
              </label>
            </RadioGroup>
          </div>
        </div>
      )}

      {allocateToType === "attrs" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Filter users by attributes</Label>
            <p className="text-xs text-muted-foreground">
              Define conditions to dynamically select users based on their attributes
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Match</Label>
            <RadioGroup
              value={userAttributeMatchType}
              onValueChange={(v) => setUserAttributeMatchType(v as "all" | "any")}
            >
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id={`attr-all-${allocateToType}`} />
                  <Label htmlFor={`attr-all-${allocateToType}`} className="font-normal cursor-pointer text-sm">
                    All Criteria
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id={`attr-any-${allocateToType}`} />
                  <Label htmlFor={`attr-any-${allocateToType}`} className="font-normal cursor-pointer text-sm">
                    Any Criteria
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            {userAttributeConditions.map((condition) => {
              const needsValue = condition.operator && !["is-empty", "is-not-empty"].includes(condition.operator)
              return (
                <div key={condition.id} className="border rounded-lg p-3 space-y-2 bg-gray-50">
                  <div className="flex gap-2">
                    <Select
                      value={condition.field}
                      onValueChange={(v) => onUpdateCondition(condition.id, { field: v })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent className="z-[120]">
                        {USER_ATTRIBUTE_FIELDS.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={condition.operator}
                      onValueChange={(v) => onUpdateCondition(condition.id, { operator: v })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent className="z-[120]">
                        {ATTRIBUTE_OPERATORS.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Value"
                      value={condition.value}
                      onChange={(e) => onUpdateCondition(condition.id, { value: e.target.value })}
                      disabled={!needsValue}
                      className="flex-1"
                    />

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onRemoveCondition(condition.id)}
                      className="text-red-600 hover:text-red-700 border-red-300"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={onAddCondition}
              className="w-full border-dashed bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Condition
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function EditAllocationActionOverlay({
  isOpen,
  onClose,
  onSave,
  existingConfig,
  triggerInfo,
  isElseAction = false,
}: EditAllocationActionOverlayProps) {
  const [allocationMode, setAllocationMode] = useState<"assign" | "unassign">(
    existingConfig?.allocationMode || "assign",
  )
  const [allocationType, setAllocationType] = useState(existingConfig?.allocationType || "lead-only")
  const [ownerUpdate, setOwnerUpdate] = useState<"assign-if-unassigned" | "allow-reassignment">(
    existingConfig?.ownerUpdate || "assign-if-unassigned",
  )
  const [assignmentSource, setAssignmentSource] = useState<string>(
    existingConfig?.assignmentSource || "allocation-pool",
  )

  // Main pool state
  const [allocateToType, setAllocateToType] = useState<"users" | "teams" | "attrs">(
    existingConfig?.poolConfig?.allocateToType || "users",
  )
  const [selectedUsers, setSelectedUsers] = useState<string[]>(existingConfig?.poolConfig?.selectedUsers || [])
  const [selectedTeams, setSelectedTeams] = useState<string[]>(existingConfig?.poolConfig?.selectedTeams || [])
  const [userAttributeConditions, setUserAttributeConditions] = useState<UserAttributeCondition[]>(
    existingConfig?.poolConfig?.userAttributeConditions || [],
  )
  const [userAttributeMatchType, setUserAttributeMatchType] = useState<"all" | "any">(
    existingConfig?.poolConfig?.userAttributeMatchType || "all",
  )
  const [selectionStrategy, setSelectionStrategy] = useState(
    existingConfig?.poolConfig?.selectionStrategy || "round-robin",
  )

  // Quota state
  const [quotaScope, setQuotaScope] = useState<"global" | "rule-specific">(
    existingConfig?.quotaConfig?.quotaScope || "global",
  )
  const [checkLeadQuota, setCheckLeadQuota] = useState(existingConfig?.quotaConfig?.checkLeadQuota ?? false)
  const [leadQuotaLimit, setLeadQuotaLimit] = useState<number | undefined>(existingConfig?.quotaConfig?.leadQuotaLimit)

  const [checkApplicationQuota, setCheckApplicationQuota] = useState(
    existingConfig?.quotaConfig?.checkApplicationQuota ?? false,
  )
  const [applicationQuotaLimit, setApplicationQuotaLimit] = useState<number | undefined>(
    existingConfig?.quotaConfig?.applicationQuotaLimit,
  )

  const [checkOpportunityQuota, setCheckOpportunityQuota] = useState(
    existingConfig?.quotaConfig?.checkOpportunityQuota ?? false,
  )
  const [opportunityQuotaLimit, setOpportunityQuotaLimit] = useState<number | undefined>(
    existingConfig?.quotaConfig?.opportunityQuotaLimit,
  )

  const [checkShiftHours, setCheckShiftHours] = useState(existingConfig?.checkShiftHours ?? false)

  // Unassign state
  const [unassignTargets, setUnassignTargets] = useState<string[]>(existingConfig?.unassignTargets || [])

  // Fallback state
  const [fallbackEnabled, setFallbackEnabled] = useState(existingConfig?.fallbackConfig?.enabled ?? false)
  const [fbAllocateToType, setFbAllocateToType] = useState<"users" | "teams" | "attrs">(
    existingConfig?.fallbackConfig?.poolConfig?.allocateToType || "users",
  )
  const [fbSelectedUsers, setFbSelectedUsers] = useState<string[]>(
    existingConfig?.fallbackConfig?.poolConfig?.selectedUsers || [],
  )
  const [fbSelectedTeams, setFbSelectedTeams] = useState<string[]>(
    existingConfig?.fallbackConfig?.poolConfig?.selectedTeams || [],
  )
  const [fbUserAttributeConditions, setFbUserAttributeConditions] = useState<UserAttributeCondition[]>(
    existingConfig?.fallbackConfig?.poolConfig?.userAttributeConditions || [],
  )
  const [fbUserAttributeMatchType, setFbUserAttributeMatchType] = useState<"all" | "any">(
    existingConfig?.fallbackConfig?.poolConfig?.userAttributeMatchType || "all",
  )
  const [fbSelectionStrategy, setFbSelectionStrategy] = useState(
    existingConfig?.fallbackConfig?.poolConfig?.selectionStrategy || "round-robin",
  )

  const [isPoolConfigOpen, setIsPoolConfigOpen] = useState(true)
  const [isFallbackPoolOpen, setIsFallbackPoolOpen] = useState(true)

  const isActivityBased = triggerInfo?.category === "activity"
  const isOpportunityContext =
    triggerInfo?.category === "opportunity" || triggerInfo?.activitySubType === "opportunity-activity"

  const getAllocationTypes = () => {
    if (triggerInfo?.category === "opportunity" || triggerInfo?.activitySubType === "opportunity-activity") {
      return [{ value: "opportunity-only", label: "Opportunity only" }]
    }
    return [
      { value: "lead-only", label: "Lead only" },
      { value: "application-only", label: "Application only" },
      { value: "lead-to-application", label: "Lead \u2192 Application" },
      { value: "application-to-lead", label: "Application \u2192 Lead" },
      { value: "lead-to-opportunity", label: "Lead \u2192 Opportunity" },
    ]
  }

  const allocationTypes = getAllocationTypes()

  const showAssignmentSource = allocationMode === "assign"
  const showPoolConfig = showAssignmentSource && assignmentSource === "allocation-pool"

  const getRequiredQuotaChecks = () => {
    switch (allocationType) {
      case "lead-only":
        return { lead: true, application: false, opportunity: false }
      case "application-only":
        return { lead: false, application: true, opportunity: false }
      case "opportunity-only":
        return { lead: false, application: false, opportunity: true }
      case "lead-to-application":
      case "application-to-lead":
        return { lead: true, application: true, opportunity: false }
      case "lead-to-opportunity":
        return { lead: true, application: false, opportunity: true }
      default:
        return { lead: false, application: false, opportunity: false }
    }
  }

  const requiredQuotaChecks = getRequiredQuotaChecks()

  // Parent-child quota relationship based on allocation type direction
  // The "source" in "source -> target" is the parent quota
  const getQuotaParentChild = (): { parent: "lead" | "application" | "opportunity" | null; child: "lead" | "application" | "opportunity" | null } => {
    switch (allocationType) {
      case "lead-only":
        return { parent: "lead", child: null }
      case "application-only":
        return { parent: "application", child: null }
      case "opportunity-only":
        return { parent: "opportunity", child: null }
      case "lead-to-application":
        return { parent: "lead", child: "application" }
      case "lead-to-opportunity":
        return { parent: "lead", child: "opportunity" }
      case "application-to-lead":
        return { parent: "application", child: "lead" }
      default:
        return { parent: null, child: null }
    }
  }
  const quotaRelation = getQuotaParentChild()

  // If parent is OFF, force child OFF
  const isParentCheckEnabled = (quotaType: "lead" | "application" | "opportunity") => {
    if (quotaRelation.child !== quotaType) return true // not a child, always enabled
    if (quotaRelation.parent === "lead") return checkLeadQuota
    if (quotaRelation.parent === "application") return checkApplicationQuota
    if (quotaRelation.parent === "opportunity") return checkOpportunityQuota
    return true
  }

  // Auto-enable parent quota when switching to rule-specific
  const handleQuotaScopeChange = (scope: "global" | "rule-specific") => {
    setQuotaScope(scope)
    if (scope === "rule-specific" && quotaRelation.parent) {
      if (quotaRelation.parent === "lead") setCheckLeadQuota(true)
      else if (quotaRelation.parent === "application") setCheckApplicationQuota(true)
      else if (quotaRelation.parent === "opportunity") setCheckOpportunityQuota(true)
    }
  }

  // Auto-disable child when parent turns off
  const handleParentToggle = (quotaType: "lead" | "application" | "opportunity", checked: boolean) => {
    if (quotaType === "lead") {
      setCheckLeadQuota(checked)
      if (!checked && quotaRelation.parent === "lead") {
        if (quotaRelation.child === "application") setCheckApplicationQuota(false)
        if (quotaRelation.child === "opportunity") setCheckOpportunityQuota(false)
      }
    } else if (quotaType === "application") {
      setCheckApplicationQuota(checked)
      if (!checked && quotaRelation.parent === "application") {
        if (quotaRelation.child === "lead") setCheckLeadQuota(false)
      }
    } else if (quotaType === "opportunity") {
      setCheckOpportunityQuota(checked)
    }
  }

  const handleSave = () => {
    const config: AllocationActionConfig = {
      allocationMode,
      allocationType,
      ownerUpdate,
      assignmentSource,
      quotaConfig: {
        quotaScope,
        checkLeadQuota,
        leadQuotaLimit: quotaScope === "rule-specific" ? leadQuotaLimit : undefined,
        checkApplicationQuota,
        applicationQuotaLimit: quotaScope === "rule-specific" ? applicationQuotaLimit : undefined,
        checkOpportunityQuota,
        opportunityQuotaLimit: quotaScope === "rule-specific" ? opportunityQuotaLimit : undefined,
      },
      checkShiftHours,
      unassignTargets: allocationMode === "unassign" ? unassignTargets : undefined,
      fallbackConfig: {
        enabled: fallbackEnabled,
        poolConfig: fallbackEnabled
          ? {
              allocateToType: fbAllocateToType,
              selectedUsers: fbSelectedUsers,
              selectedTeams: fbSelectedTeams,
              userAttributeConditions: fbUserAttributeConditions,
              userAttributeMatchType: fbUserAttributeMatchType,
              selectionStrategy: fbSelectionStrategy,
            }
          : undefined,
      },
    }

    if (showPoolConfig) {
      config.poolConfig = {
        allocateToType,
        selectedUsers,
        selectedTeams,
        userAttributeConditions,
        userAttributeMatchType,
        selectionStrategy,
      }
    }

    onSave(config)
    onClose()
  }

  const handleAddAttributeCondition = () => {
    setUserAttributeConditions([
      ...userAttributeConditions,
      { id: `attr_${Date.now()}`, field: "", operator: "", value: "" },
    ])
  }

  const handleRemoveAttributeCondition = (id: string) => {
    setUserAttributeConditions(userAttributeConditions.filter((c) => c.id !== id))
  }

  const handleUpdateAttributeCondition = (id: string, updates: Partial<UserAttributeCondition>) => {
    setUserAttributeConditions(userAttributeConditions.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const handleAddFbAttributeCondition = () => {
    setFbUserAttributeConditions([
      ...fbUserAttributeConditions,
      { id: `fb_attr_${Date.now()}`, field: "", operator: "", value: "" },
    ])
  }

  const handleRemoveFbAttributeCondition = (id: string) => {
    setFbUserAttributeConditions(fbUserAttributeConditions.filter((c) => c.id !== id))
  }

  const handleUpdateFbAttributeCondition = (id: string, updates: Partial<UserAttributeCondition>) => {
    setFbUserAttributeConditions(fbUserAttributeConditions.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {isElseAction ? "Else Allocation Action" : "Edit Allocation Action"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* ── Section 1: Action Mode ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background text-xs font-medium shrink-0">1</span>
              <Label className="font-medium">Action Type</Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant={allocationMode === "assign" ? "default" : "outline"}
                className={allocationMode === "assign" ? "bg-teal-600 hover:bg-teal-700 flex-1" : "flex-1"}
                onClick={() => setAllocationMode("assign")}
                size="sm"
              >
                Assign
              </Button>
              <Button
                variant={allocationMode === "unassign" ? "default" : "outline"}
                className={allocationMode === "unassign" ? "bg-teal-600 hover:bg-teal-700 flex-1" : "flex-1"}
                onClick={() => setAllocationMode("unassign")}
                size="sm"
              >
                Unassign
              </Button>
            </div>
          </div>

          <hr />

          {/* ── Section 2: Record Target ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background text-xs font-medium shrink-0">2</span>
              <Label className="font-medium">
                {allocationMode === "assign" ? "Records to Assign" : "Records to Unassign"}
              </Label>
            </div>

            {allocationMode === "assign" ? (
              <Select value={allocationType} onValueChange={setAllocationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[120]">
                  {allocationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              /* Unassign targets */
              <div className="border rounded-lg divide-y">
                {isOpportunityContext ? (
                  <label htmlFor="unassign-opportunity" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      id="unassign-opportunity"
                      checked={unassignTargets.includes("opportunity")}
                      onCheckedChange={(checked) => {
                        if (checked) setUnassignTargets(["opportunity"])
                        else setUnassignTargets([])
                      }}
                    />
                    <div>
                      <span className="text-sm font-medium">Opportunity Owner</span>
                      <p className="text-xs text-muted-foreground">Remove the assigned opportunity owner</p>
                    </div>
                  </label>
                ) : (
                  <>
                    <label htmlFor="unassign-lead" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50">
                      <Checkbox
                        id="unassign-lead"
                        checked={unassignTargets.includes("lead")}
                        onCheckedChange={(checked) => {
                          if (checked) setUnassignTargets([...unassignTargets, "lead"])
                          else setUnassignTargets(unassignTargets.filter((t) => t !== "lead"))
                        }}
                      />
                      <div>
                        <span className="text-sm font-medium">Lead Owner</span>
                        <p className="text-xs text-muted-foreground">Remove the assigned lead owner</p>
                      </div>
                    </label>
                    <label htmlFor="unassign-application" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50">
                      <Checkbox
                        id="unassign-application"
                        checked={unassignTargets.includes("application")}
                        onCheckedChange={(checked) => {
                          if (checked) setUnassignTargets([...unassignTargets, "application"])
                          else setUnassignTargets(unassignTargets.filter((t) => t !== "application"))
                        }}
                      />
                      <div>
                        <span className="text-sm font-medium">Application Owner</span>
                        <p className="text-xs text-muted-foreground">Remove the assigned application owner</p>
                      </div>
                    </label>
                  </>
                )}
              </div>
            )}
            {allocationMode === "unassign" && unassignTargets.length === 0 && (
              <p className="text-xs text-amber-600">Select at least one record type to unassign.</p>
            )}
          </div>

          {allocationMode === "assign" && (
            <>
              <hr />

              {/* ── Section 3: Assignment Type ── */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background text-xs font-medium shrink-0">3</span>
                  <Label className="font-medium">Assignment Type</Label>
                </div>
                <Select value={ownerUpdate} onValueChange={(v) => setOwnerUpdate(v as "assign-if-unassigned" | "allow-reassignment")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[120]">
                    <SelectItem value="assign-if-unassigned">Add to existing owners</SelectItem>
                    <SelectItem value="allow-reassignment">Reassign existing Owner (Override)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <hr />

              {/* ── Section 4: Eligibility Checks ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background text-xs font-medium shrink-0">4</span>
                  <Label className="font-medium">Eligibility Checks</Label>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">
                  Pre-assignment checks to verify user availability and capacity
                </p>

                <div className="border rounded-lg divide-y">
                  {/* Shift Hours */}
                  <div className="flex items-center justify-between px-3 py-3">
                    <div className="space-y-0.5">
                      <span className="text-sm font-medium">Shift Hours</span>
                      <p className="text-xs text-muted-foreground">
                        {checkShiftHours ? "Only assign to users currently on shift" : "Shift hours not checked"}
                      </p>
                    </div>
                    <Switch checked={checkShiftHours} onCheckedChange={setCheckShiftHours} />
                  </div>

                  {/* Quota section header */}
                  <div className="px-3 py-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium">Quota</span>
                        <p className="text-xs text-muted-foreground">
                          {quotaScope === "global" ? "Using global limits" : "Using rule-specific limits"}
                        </p>
                      </div>
                      <Select value={quotaScope} onValueChange={(v) => handleQuotaScopeChange(v as "global" | "rule-specific")}>
                        <SelectTrigger className="w-[160px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[120]">
                          <SelectItem value="global">Global Quota</SelectItem>
                          <SelectItem value="rule-specific">Rule-specific</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Individual quota checks */}
                  {(() => {
                    type QuotaType = "lead" | "application" | "opportunity"
                    const allQuotas: { key: QuotaType; label: string; checked: boolean }[] = [
                      { key: "lead", label: "Lead", checked: checkLeadQuota },
                      { key: "application", label: "Application", checked: checkApplicationQuota },
                      { key: "opportunity", label: "Opportunity", checked: checkOpportunityQuota },
                    ]

                    const required = allQuotas.filter((q) =>
                      q.key === "lead" ? requiredQuotaChecks.lead :
                      q.key === "application" ? requiredQuotaChecks.application :
                      requiredQuotaChecks.opportunity
                    )

                    const sorted = required.sort((a, b) => {
                      if (a.key === quotaRelation.parent) return -1
                      if (b.key === quotaRelation.parent) return 1
                      if (a.key === quotaRelation.child) return 1
                      if (b.key === quotaRelation.child) return -1
                      return 0
                    })

                    const getQuotaLimit = (key: QuotaType) =>
                      key === "lead" ? leadQuotaLimit : key === "application" ? applicationQuotaLimit : opportunityQuotaLimit
                    const setQuotaLimit = (key: QuotaType, val: number | undefined) => {
                      if (key === "lead") setLeadQuotaLimit(val)
                      else if (key === "application") setApplicationQuotaLimit(val)
                      else setOpportunityQuotaLimit(val)
                    }

                    return sorted.map((quota) => {
                      const isChild = quota.key === quotaRelation.child
                      const isDisabledChild = isChild && !isParentCheckEnabled(quota.key)
                      const parentLabel = quotaRelation.parent === "lead" ? "Lead" : quotaRelation.parent === "application" ? "Application" : "Opportunity"

                      return (
                        <div key={quota.key} className={`px-3 py-2.5 ${isDisabledChild ? "opacity-50 bg-gray-50" : ""} ${isChild ? "pl-7" : "pl-7"}`}>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className={`text-sm ${isDisabledChild ? "text-muted-foreground" : ""}`}>
                                {quota.label} Quota
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {isDisabledChild
                                  ? `Requires ${parentLabel} quota to be enabled`
                                  : quota.checked
                                    ? quotaScope === "global"
                                      ? `Checked against global ${quota.label.toLowerCase()} limit`
                                      : `Checked against rule ${quota.label.toLowerCase()} limit`
                                    : "Not evaluated"}
                              </p>
                            </div>
                            <Switch
                              checked={quota.checked}
                              onCheckedChange={(checked) => handleParentToggle(quota.key, checked)}
                              disabled={isDisabledChild}
                            />
                          </div>
                          {quota.checked && quotaScope === "rule-specific" && !isDisabledChild && (
                            <div className="mt-2">
                              <Input
                                type="number"
                                placeholder={`Max ${quota.label.toLowerCase()}s per user`}
                                value={getQuotaLimit(quota.key) || ""}
                                onChange={(e) =>
                                  setQuotaLimit(quota.key, e.target.value ? Number.parseInt(e.target.value) : undefined)
                                }
                                min={0}
                                className="h-8 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>

              <hr />

              {/* ── Section 5: Owner Pool ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background text-xs font-medium shrink-0">5</span>
                  <Label className="font-medium">Owner Pool</Label>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">
                  Define where eligible owners come from and configure fallback behavior
                </p>

                <div className="space-y-2">
                  <Label className="text-sm">Source</Label>
                  <Select value={assignmentSource} onValueChange={setAssignmentSource}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[120]">
                      <SelectItem value="allocation-pool">Allocation pool</SelectItem>
                      {isActivityBased && <SelectItem value="activity-owner">Activity owner</SelectItem>}
                      <SelectItem value="record-previous-owner">Record previous owner</SelectItem>
                      {isOpportunityContext && (
                        <SelectItem value="previous-opportunity-owner">
                          Previous opportunity owner (latest match)
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pool definition */}
                {showPoolConfig && (
                  <Collapsible open={isPoolConfigOpen} onOpenChange={setIsPoolConfigOpen}>
                    <div className="border rounded-lg">
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <span className="text-sm font-medium">Define allocation pool</span>
                            <p className="text-xs text-muted-foreground text-left">Only checked-in users are eligible for assignment</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{isPoolConfigOpen ? "Hide" : "Show"}</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-3 pb-3 pt-1 border-t">
                          <PoolConfigSection
                            allocateToType={allocateToType}
                            setAllocateToType={setAllocateToType}
                            selectedUsers={selectedUsers}
                            setSelectedUsers={setSelectedUsers}
                            selectedTeams={selectedTeams}
                            setSelectedTeams={setSelectedTeams}
                            selectionStrategy={selectionStrategy}
                            setSelectionStrategy={setSelectionStrategy}
                            userAttributeConditions={userAttributeConditions}
                            setUserAttributeConditions={setUserAttributeConditions}
                            userAttributeMatchType={userAttributeMatchType}
                            setUserAttributeMatchType={setUserAttributeMatchType}
                            onAddCondition={handleAddAttributeCondition}
                            onRemoveCondition={handleRemoveAttributeCondition}
                            onUpdateCondition={handleUpdateAttributeCondition}
                          />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                )}

                {/* Fallback */}
                <div className="border rounded-lg">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="space-y-0.5">
                      <span className="text-sm font-medium">Fallback Routing</span>
                      <p className="text-xs text-muted-foreground">
                        Use fallback pool if no eligible assignee found
                      </p>
                    </div>
                    <Switch checked={fallbackEnabled} onCheckedChange={setFallbackEnabled} />
                  </div>

                  {fallbackEnabled && (
                    <Collapsible open={isFallbackPoolOpen} onOpenChange={setIsFallbackPoolOpen}>
                      <div className="border-t">
                        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Define fallback pool</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{isFallbackPoolOpen ? "Hide" : "Show"}</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-3 pb-3 pt-1 border-t">
                            <PoolConfigSection
                              allocateToType={fbAllocateToType}
                              setAllocateToType={setFbAllocateToType}
                              selectedUsers={fbSelectedUsers}
                              setSelectedUsers={setFbSelectedUsers}
                              selectedTeams={fbSelectedTeams}
                              setSelectedTeams={setFbSelectedTeams}
                              selectionStrategy={fbSelectionStrategy}
                              setSelectionStrategy={setFbSelectionStrategy}
                              userAttributeConditions={fbUserAttributeConditions}
                              setUserAttributeConditions={setFbUserAttributeConditions}
                              userAttributeMatchType={fbUserAttributeMatchType}
                              setUserAttributeMatchType={setFbUserAttributeMatchType}
                              onAddCondition={handleAddFbAttributeCondition}
                              onRemoveCondition={handleRemoveFbAttributeCondition}
                              onUpdateCondition={handleUpdateFbAttributeCondition}
                            />
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Continue Workflow
          </Button>
        </div>
      </div>
    </div>
  )
}
