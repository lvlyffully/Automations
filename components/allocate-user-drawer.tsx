"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type TriggerCategory = "lead-application" | "opportunity" | "activity"
type ActivitySubType = "lead-activity" | "opportunity-activity" | null

interface TriggerInfo {
  category: TriggerCategory
  activitySubType: ActivitySubType
  selectedTrigger: string
  selectedOpportunities: string[]
}

interface AllocateUserDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  triggerInfo: TriggerInfo | null
  existingConfig?: any
}

export function AllocateUserDrawer({ isOpen, onClose, onSave, triggerInfo, existingConfig }: AllocateUserDrawerProps) {
  const [blockName, setBlockName] = useState(existingConfig?.blockName || "")
  const [allocationRole, setAllocationRole] = useState<"assign" | "unassign">(
    existingConfig?.allocationRole || "assign",
  )
  const [excludeManuallyAllocated, setExcludeManuallyAllocated] = useState(
    existingConfig?.excludeManuallyAllocated ? "yes" : "no",
  )
  const [enableOpportunityStickiness, setEnableOpportunityStickiness] = useState(
    existingConfig?.enableOpportunityStickiness || false,
  )
  const [checkOpportunityQuota, setCheckOpportunityQuota] = useState(existingConfig?.checkOpportunityQuota || false)
  const [enableLeadToOpportunityAllocation, setEnableLeadToOpportunityAllocation] = useState(
    existingConfig?.enableLeadToOpportunityAllocation || false,
  )

  const [checkedInAllocationType, setCheckedInAllocationType] = useState<"users" | "teams" | "user-attributes">("users")
  const [checkedInSelectedUsers, setCheckedInSelectedUsers] = useState<string[]>(existingConfig?.checkedInUsers || [])

  const [defaultAllocationType, setDefaultAllocationType] = useState<"users" | "teams" | "user-attributes">("users")
  const [defaultSelectedUsers, setDefaultSelectedUsers] = useState<string[]>(existingConfig?.defaultUsers || [])

  const [blockNameError, setBlockNameError] = useState("")

  const handleSubmit = () => {
    setBlockNameError("")

    if (!blockName.trim()) {
      setBlockNameError("Block Name is required")
      return
    }

    const configData = {
      blockName: blockName.trim(),
      allocationRole,
      excludeManuallyAllocated: excludeManuallyAllocated === "yes",
      enableOpportunityStickiness,
      checkOpportunityQuota,
      enableLeadToOpportunityAllocation,
      checkedInAllocationType,
      checkedInSelectedUsers,
      defaultAllocationType,
      defaultSelectedUsers,
    }

    onSave(configData)
    handleClose()
  }

  const handleClose = () => {
    setBlockName(existingConfig?.blockName || "")
    setAllocationRole(existingConfig?.allocationRole || "assign")
    setExcludeManuallyAllocated(existingConfig?.excludeManuallyAllocated ? "yes" : "no")
    setEnableOpportunityStickiness(existingConfig?.enableOpportunityStickiness || false)
    setCheckOpportunityQuota(existingConfig?.checkOpportunityQuota || false)
    setEnableLeadToOpportunityAllocation(existingConfig?.enableLeadToOpportunityAllocation || false)
    setBlockNameError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/60" onClick={handleClose} />
      <div className="ml-auto w-1/2 min-w-[600px] max-w-[800px] bg-white h-full shadow-xl flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Edit Allocate User</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <TooltipProvider>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="block-name">
                  Block Name <span className="text-red-500">*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Give this allocation block a unique name</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="block-name"
                placeholder="Block Name"
                value={blockName}
                onChange={(e) => {
                  setBlockName(e.target.value)
                  setBlockNameError("")
                }}
                className={blockNameError ? "border-destructive" : ""}
              />
              {blockNameError && <p className="text-xs text-destructive">{blockNameError}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Allocation Role</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose whether to assign or unassign users</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <RadioGroup value={allocationRole} onValueChange={(v) => setAllocationRole(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="assign" id="assign" />
                  <Label htmlFor="assign" className="font-normal cursor-pointer">
                    Assign
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unassign" id="unassign" />
                  <Label htmlFor="unassign" className="font-normal cursor-pointer">
                    Unassign
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="exclude-manual">Exclude Manually Allocated Audience?</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Skip users who were manually assigned</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={excludeManuallyAllocated} onValueChange={setExcludeManuallyAllocated}>
                <SelectTrigger id="exclude-manual">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="enable-stickiness">Enable Opportunity Stickiness</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Apply stickiness rules to maintain consistent opportunity ownership</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="enable-stickiness"
                checked={enableOpportunityStickiness}
                onCheckedChange={(checked) => {
                  setEnableOpportunityStickiness(checked)
                  if (checked) {
                    setEnableLeadToOpportunityAllocation(false)
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="check-opp-quota">Check Opportunity&apos;s Allocation Quota</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verify if opportunity allocation quota is available</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch id="check-opp-quota" checked={checkOpportunityQuota} onCheckedChange={setCheckOpportunityQuota} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="enable-lead-opp" className={enableOpportunityStickiness ? "text-muted-foreground" : ""}>
                  Enable Lead to opportunity Allocation Type
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {enableOpportunityStickiness
                        ? "Cannot be enabled when Opportunity Stickiness is active"
                        : "Track allocation across lead and opportunity records"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch
                id="enable-lead-opp"
                checked={enableLeadToOpportunityAllocation}
                onCheckedChange={(checked) => {
                  setEnableLeadToOpportunityAllocation(checked)
                  if (checked) {
                    setEnableOpportunityStickiness(false)
                  }
                }}
                disabled={enableOpportunityStickiness}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Allocate to checked-in</Label>
              <RadioGroup value={checkedInAllocationType} onValueChange={(v) => setCheckedInAllocationType(v as any)}>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="users" id="checked-in-users" />
                    <Label htmlFor="checked-in-users" className="font-normal cursor-pointer">
                      Users
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teams" id="checked-in-teams" />
                    <Label htmlFor="checked-in-teams" className="font-normal cursor-pointer">
                      Teams
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user-attributes" id="checked-in-attributes" />
                    <Label htmlFor="checked-in-attributes" className="font-normal cursor-pointer">
                      User Attributes
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Select Users</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose users who are currently checked in</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select Users" />
                  </SelectTrigger>
                  <SelectContent>
                    {["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Tom Brown"].map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Allocate to default</Label>
                <span className="text-red-500">*</span>
              </div>
              <RadioGroup value={defaultAllocationType} onValueChange={(v) => setDefaultAllocationType(v as any)}>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="users" id="default-users" />
                    <Label htmlFor="default-users" className="font-normal cursor-pointer">
                      Users
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teams" id="default-teams" />
                    <Label htmlFor="default-teams" className="font-normal cursor-pointer">
                      Teams
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user-attributes" id="default-attributes" />
                    <Label htmlFor="default-attributes" className="font-normal cursor-pointer">
                      User Attributes
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Select Users</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose default users for allocation</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select Users" />
                  </SelectTrigger>
                  <SelectContent>
                    {["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Tom Brown"].map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TooltipProvider>
        </div>

        <div className="border-t px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
