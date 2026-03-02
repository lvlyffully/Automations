"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Info, Calendar } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type TriggerCategory = "lead-application" | "opportunity" | "activity"
type ActivitySubType = "lead-activity" | "opportunity-activity" | null

interface TriggerInfo {
  category: TriggerCategory
  activitySubType: ActivitySubType
  selectedTrigger: string
  selectedOpportunities: string[]
}

interface ManageEventDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (eventData: any) => void
  triggerInfo: TriggerInfo | null
}

export function ManageEventDrawer({ isOpen, onClose, onSave, triggerInfo }: ManageEventDrawerProps) {
  const getEventApplicableFor = (): string => {
    if (!triggerInfo) return "Lead"

    // Lead-based triggers
    if (triggerInfo.category === "lead-application") {
      return "Lead"
    }

    // Opportunity-based triggers
    if (triggerInfo.category === "opportunity") {
      return "Opportunity"
    }

    // Activity triggers - depends on sub-type
    if (triggerInfo.category === "activity") {
      if (triggerInfo.activitySubType === "lead-activity") {
        return "Lead"
      }
      if (triggerInfo.activitySubType === "opportunity-activity") {
        return "Opportunity"
      }
    }

    return "Lead" // default
  }

  const [selectedOpportunityList, setSelectedOpportunityList] = useState<string>("")

  const [formData, setFormData] = useState({
    blockName: "",
    eventApplicableFor: getEventApplicableFor(),
    actionType: "",
    assignToLeadOwner: false,
    assignOwner: "",
    computeStartFrom: "Automation Execution Time",
    startDateUnit: "minute(s)",
    startDateValue: "60",
    durationUnit: "minute(s)",
    durationValue: "15",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateTimeField = (value: string, unit: string, fieldType: "startDate" | "duration"): string | null => {
    const numValue = Number.parseInt(value, 10)

    // Check if it's a natural number (positive integer)
    if (!value || isNaN(numValue) || numValue < 1 || !Number.isInteger(Number(value))) {
      return "Please enter a valid positive integer"
    }

    if (fieldType === "startDate") {
      // Set Start Date After: 1 minute to 90 days
      if (unit === "minute(s)") {
        const maxMinutes = 24 * 60 * 90 // 129,600 minutes
        if (numValue < 1 || numValue > maxMinutes) {
          return `Value must be between 1 and ${maxMinutes.toLocaleString()} minutes`
        }
      } else if (unit === "hour(s)") {
        const maxHours = 24 * 90 // 2,160 hours
        if (numValue < 1 || numValue > maxHours) {
          return `Value must be between 1 and ${maxHours.toLocaleString()} hours`
        }
      } else if (unit === "day(s)") {
        if (numValue < 1 || numValue > 90) {
          return "Value must be between 1 and 90 days"
        }
      }
    } else if (fieldType === "duration") {
      // Set Duration: 15 minutes to 24 hours
      if (unit === "minute(s)") {
        const maxMinutes = 24 * 60 // 1,440 minutes
        if (numValue < 15 || numValue > maxMinutes) {
          return `Value must be between 15 and ${maxMinutes.toLocaleString()} minutes`
        }
      } else if (unit === "hour(s)") {
        if (numValue < 1 || numValue > 24) {
          return "Value must be between 1 and 24 hours"
        }
      }
    }

    return null
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.blockName) {
      errors.blockName = "Block Name is required"
    }

    if (!formData.actionType) {
      errors.actionType = "Action Type is required"
    }

    if (formData.actionType === "Create Event" && !formData.assignOwner) {
      errors.assignOwner = "Assign Owner is required"
    }

    if (formData.actionType === "Create Event") {
      if (!formData.startDateValue) {
        errors.startDateValue = "Start Date Value is required"
      } else {
        const startDateError = validateTimeField(formData.startDateValue, formData.startDateUnit, "startDate")
        if (startDateError) {
          errors.startDateValue = startDateError
        }
      }

      if (!formData.durationValue) {
        errors.durationValue = "Duration Value is required"
      } else {
        const durationError = validateTimeField(formData.durationValue, formData.durationUnit, "duration")
        if (durationError) {
          errors.durationValue = durationError
        }
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      eventApplicableFor: getEventApplicableFor(),
    }))

    // Auto-select first opportunity list if available
    if (triggerInfo?.selectedOpportunities && triggerInfo.selectedOpportunities.length > 0) {
      setSelectedOpportunityList(triggerInfo.selectedOpportunities[0])
    }
  }, [triggerInfo])

  useEffect(() => {
    if (!formData.computeStartFrom.startsWith("OL")) {
      // Keep the selected opportunity list even when compute start from changes
    }
  }, [formData.computeStartFrom])

  const shouldShowOpportunityFields = (): boolean => {
    if (!triggerInfo) return false
    // Show for opportunity-based triggers OR opportunity activity triggers
    return triggerInfo.category === "opportunity" || triggerInfo.activitySubType === "opportunity-activity"
  }

  const shouldShowDynamicActivityFields = (): boolean => {
    if (!triggerInfo) return false
    // Show only for Activity Triggers (both lead and opportunity level)
    return triggerInfo.category === "activity"
  }

  const shouldShowOpportunityListField = (): boolean => {
    // Show only for Create Event + opportunity-based triggers
    return formData.actionType === "Create Event" && shouldShowOpportunityFields()
  }

  const getOpportunityDateFields = () => {
    if (!selectedOpportunityList) return []

    // Convert opportunity list name to a short code (e.g., "A&N" -> "OL1", "test ivr" -> "OL2")
    const opportunityIndex = triggerInfo?.selectedOpportunities?.indexOf(selectedOpportunityList) ?? -1
    const olCode = `OL${opportunityIndex + 1}`

    return [
      { value: `${olCode}_Cust_DDMMYYY_Field 1`, label: `${olCode}_Cust_DDMMYYY_Field 1` },
      { value: `${olCode}_Cust_DDMMYYY_Field 2`, label: `${olCode}_Cust_DDMMYYY_Field 2` },
      { value: `${olCode}_Cust_DDMMYYY_Field 3`, label: `${olCode}_Cust_DDMMYYY_Field 3` },
      { value: `${olCode}_Cust_DDMMYYY_Field 4`, label: `${olCode}_Cust_DDMMYYY_Field 4` },
    ]
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    onSave(formData)
  }

  const handleClose = () => {
    setFormData({
      blockName: "",
      eventApplicableFor: getEventApplicableFor(),
      actionType: "",
      assignToLeadOwner: false,
      assignOwner: "",
      computeStartFrom: "Automation Execution Time",
      startDateUnit: "minute(s)",
      startDateValue: "60",
      durationUnit: "minute(s)",
      durationValue: "15",
    })
    setValidationErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed inset-0 z-50 flex">
        <div className="fixed inset-0 bg-black/60" onClick={handleClose} />
        <div className="ml-auto w-1/2 min-w-96 bg-white h-full shadow-xl flex flex-col relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Manage Event</h2>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Informational Text */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-sm text-gray-700">
                The Manage Event node allows you to either create automated events or mark all existing events as
                complete when a record reaches a certain stage in its journey.
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Point To Note:</span>
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">If Create Event</span> is selected:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                  <li>Only the default "Follow-Up" type event will be created.</li>
                  <li>
                    If your event configuration does not allow conflicting events, Automation will not create a new
                    event.
                  </li>
                  <li>All event start dates will be calculated based on the date and time your record is processed.</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2">
                  <span className="font-semibold">If Complete All Events</span> is selected:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                  <li>All events created against the record will be marked as complete.</li>
                </ul>
              </div>
            </div>

            {/* Block Name */}
            <div className="space-y-2">
              <Label htmlFor="blockName" className="text-sm font-medium">
                Block Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="blockName"
                placeholder="Enter Block Name"
                value={formData.blockName}
                onChange={(e) => setFormData({ ...formData, blockName: e.target.value })}
                className={validationErrors.blockName ? "border-red-500" : ""}
              />
              {validationErrors.blockName && <p className="text-xs text-red-500">{validationErrors.blockName}</p>}
            </div>

            {/* Event Applicable For - Made disabled and auto-populated based on trigger */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Event Applicable For</Label>
              <Select
                value={formData.eventApplicableFor}
                onValueChange={(value) => setFormData({ ...formData, eventApplicableFor: value })}
                disabled
              >
                <SelectTrigger className="bg-gray-50 cursor-not-allowed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Application">Application</SelectItem>
                  <SelectItem value="Opportunity">Opportunity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Action Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.actionType}
                onValueChange={(value) => setFormData({ ...formData, actionType: value })}
              >
                <SelectTrigger className={validationErrors.actionType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Create Event">Create Event</SelectItem>
                  <SelectItem value="Complete All Events">Complete All Events</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.actionType && <p className="text-xs text-red-500">{validationErrors.actionType}</p>}
            </div>

            {formData.actionType === "Complete All Events" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700">
                  This action will mark all events created against the user as complete.
                </p>
              </div>
            )}

            {formData.actionType === "Create Event" && (
              <>
                {/* Assign to Lead Owner */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">Assign to Lead Owner</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">
                          When enabled, the event will be automatically assigned to the lead owner.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch
                    checked={formData.assignToLeadOwner}
                    onCheckedChange={(checked) => setFormData({ ...formData, assignToLeadOwner: checked })}
                  />
                </div>

                {/* Assign Owner */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Assign Owner <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.assignOwner}
                    onValueChange={(value) => setFormData({ ...formData, assignOwner: value })}
                  >
                    <SelectTrigger className={validationErrors.assignOwner ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admission Counselor">Admission Counselor</SelectItem>
                      <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                      <SelectItem value="Team Lead">Team Lead</SelectItem>
                      <SelectItem value="Support Staff">Support Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.assignOwner && (
                    <p className="text-xs text-red-500">{validationErrors.assignOwner}</p>
                  )}
                </div>

                {shouldShowOpportunityListField() &&
                  triggerInfo?.selectedOpportunities &&
                  triggerInfo.selectedOpportunities.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Select Opportunity List <span className="text-red-500">*</span>
                      </Label>
                      <Select value={selectedOpportunityList} onValueChange={setSelectedOpportunityList}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Opportunity List" />
                        </SelectTrigger>
                        <SelectContent>
                          {triggerInfo.selectedOpportunities.map((opp) => (
                            <SelectItem key={opp} value={opp}>
                              {opp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">
                      Compute Start From <span className="text-red-500">*</span>
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">
                          Select the reference point from which the event start date will be calculated.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={formData.computeStartFrom}
                    onValueChange={(value) => setFormData({ ...formData, computeStartFrom: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* First option - always available */}
                      <SelectItem value="Automation Execution Time">Automation Execution Time</SelectItem>

                      {/* Lead Fields section - always shown */}
                      <SelectGroup>
                        <SelectLabel>Lead Fields</SelectLabel>
                        <SelectItem value="LM_Cust_DDMMYYY_Field 1">LM_Cust_DDMMYYY_Field 1</SelectItem>
                        <SelectItem value="LM_Cust_DDMMYYY_Field 2">LM_Cust_DDMMYYY_Field 2</SelectItem>
                        <SelectItem value="LM_Cust_DDMMYYY_Field 3">LM_Cust_DDMMYYY_Field 3</SelectItem>
                        <SelectItem value="LM_Cust_DDMMYYY_Field 4">LM_Cust_DDMMYYY_Field 4</SelectItem>
                      </SelectGroup>

                      {/* Opportunity Fields section - shown for opportunity-based triggers */}
                      {shouldShowOpportunityFields() && selectedOpportunityList && (
                        <SelectGroup>
                          <SelectLabel>Opportunity Fields</SelectLabel>
                          {getOpportunityDateFields().map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}

                      {/* Dynamic Activity Fields section - shown only for Activity Triggers */}
                      {shouldShowDynamicActivityFields() && (
                        <SelectGroup>
                          <SelectLabel>Dynamic Activity Fields</SelectLabel>
                          <SelectItem value="DA_Cust_DDMMYYY_Field 1">DA_Cust_DDMMYYY_Field 1</SelectItem>
                          <SelectItem value="DA_Cust_DDMMYYY_Field 2">DA_Cust_DDMMYYY_Field 2</SelectItem>
                          <SelectItem value="DA_Cust_DDMMYYY_Field 3">DA_Cust_DDMMYYY_Field 3</SelectItem>
                          <SelectItem value="DA_Cust_DDMMYYY_Field 4">DA_Cust_DDMMYYY_Field 4</SelectItem>
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Set Start Date After */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">
                      Set Start Date After <span className="text-red-500">*</span>
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">
                          Specify how long after the computed start time the event should begin. Range: 1 minute to 90
                          days.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex space-x-2">
                    <Select
                      value={formData.startDateUnit}
                      onValueChange={(value) => {
                        setFormData({ ...formData, startDateUnit: value })
                        // Clear validation error when unit changes
                        if (validationErrors.startDateValue) {
                          const newErrors = { ...validationErrors }
                          delete newErrors.startDateValue
                          setValidationErrors(newErrors)
                        }
                      }}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minute(s)">minute(s)</SelectItem>
                        <SelectItem value="hour(s)">hour(s)</SelectItem>
                        <SelectItem value="day(s)">day(s)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={formData.startDateValue}
                      onChange={(e) => setFormData({ ...formData, startDateValue: e.target.value })}
                      onBlur={() => {
                        const error = validateTimeField(formData.startDateValue, formData.startDateUnit, "startDate")
                        if (error) {
                          setValidationErrors({ ...validationErrors, startDateValue: error })
                        } else {
                          const newErrors = { ...validationErrors }
                          delete newErrors.startDateValue
                          setValidationErrors(newErrors)
                        }
                      }}
                      className={`flex-1 ${validationErrors.startDateValue ? "border-red-500" : ""}`}
                      placeholder="60"
                    />
                  </div>
                  {validationErrors.startDateValue && (
                    <p className="text-xs text-red-500">{validationErrors.startDateValue}</p>
                  )}
                </div>

                {/* Set Duration */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">
                      Set Duration <span className="text-red-500">*</span>
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">Specify the duration of the event. Range: 15 minutes to 24 hours.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex space-x-2">
                    <Select
                      value={formData.durationUnit}
                      onValueChange={(value) => {
                        setFormData({ ...formData, durationUnit: value })
                        // Clear validation error when unit changes
                        if (validationErrors.durationValue) {
                          const newErrors = { ...validationErrors }
                          delete newErrors.durationValue
                          setValidationErrors(newErrors)
                        }
                      }}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minute(s)">minute(s)</SelectItem>
                        <SelectItem value="hour(s)">hour(s)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={formData.durationValue}
                      onChange={(e) => setFormData({ ...formData, durationValue: e.target.value })}
                      onBlur={() => {
                        const error = validateTimeField(formData.durationValue, formData.durationUnit, "duration")
                        if (error) {
                          setValidationErrors({ ...validationErrors, durationValue: error })
                        } else {
                          const newErrors = { ...validationErrors }
                          delete newErrors.durationValue
                          setValidationErrors(newErrors)
                        }
                      }}
                      className={`flex-1 ${validationErrors.durationValue ? "border-red-500" : ""}`}
                      placeholder="15"
                    />
                  </div>
                  {validationErrors.durationValue && (
                    <p className="text-xs text-red-500">{validationErrors.durationValue}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
