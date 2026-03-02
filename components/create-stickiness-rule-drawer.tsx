"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { X, AlertCircle, ChevronDown, ChevronUp, Search, Check, Info } from "lucide-react"
import { getActiveOpportunityListsForStickiness } from "@/lib/opportunity-store"

interface StickinessRule {
  id: string
  name: string
  opportunityList: string
  stickyFields: string[]
  conflictResolution: string
  isActive?: boolean
}

interface CreateStickinessRuleDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (ruleData: {
    ruleName: string
    selectedOpportunityListId: string
    selectedOpportunityListName: string
    stickyFields: string[]
    conflictResolution: string
  }) => void
  editingRule?: StickinessRule | null
  usedOpportunityLists?: string[]
}

export function CreateStickinessRuleDrawer({
  isOpen,
  onClose,
  onSave,
  editingRule,
  usedOpportunityLists = [],
}: CreateStickinessRuleDrawerProps) {
  const [ruleName, setRuleName] = useState("")
  const [selectedOpportunityListId, setSelectedOpportunityListId] = useState("")
  const [selectedOpportunityListName, setSelectedOpportunityListName] = useState("")
  const [stickyFields, setStickyFields] = useState<string[]>([])
  const [conflictResolution, setConflictResolution] = useState("latest")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [opportunityListsData, setOpportunityListsData] = useState<
    { id: string; name: string; logicFields: string[]; isActive: boolean }[]
  >([])

  useEffect(() => {
    // Load opportunity lists from shared store
    setOpportunityListsData(getActiveOpportunityListsForStickiness())
  }, [isOpen])

  // Filter to only show active lists with >1 logic field, not already used
  const availableOpportunityLists = opportunityListsData.filter(
    (list) => list.isActive && list.logicFields.length > 1 && !usedOpportunityLists.includes(list.id),
  )

  const selectedListData = opportunityListsData.find((list) => list.id === selectedOpportunityListId)
  const availableLogicFields = selectedListData?.logicFields || []

  // Max selectable = total fields - 1 (at least one must differ for new opportunity)
  const maxSelectableFields = Math.max(availableLogicFields.length - 1, 0)

  const showStep2 = ruleName.trim().length > 0
  const showStep3 = showStep2 && selectedOpportunityListId !== ""
  const showStep3Explanation = showStep3 && stickyFields.length > 0
  const showStep4 = showStep3 && stickyFields.length > 0

  const filteredFields = availableLogicFields.filter((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))

  const canSelectField = (field: string) => {
    if (stickyFields.includes(field)) return true
    return stickyFields.length < maxSelectableFields
  }

  const getExplanationText = () => {
    if (stickyFields.length === 0) return ""
    if (stickyFields.length === 1) {
      return `For the same Lead, if another Opportunity exists in this list with the same ${stickyFields[0]}, the owner will be reused.`
    }
    const allButLast = stickyFields.slice(0, -1).join(", ")
    const last = stickyFields[stickyFields.length - 1]
    return `For the same Lead, if another Opportunity exists in this list with the same ${allButLast} AND ${last}, the owner will be reused.`
  }

  const handleStickyFieldToggle = (field: string) => {
    if (stickyFields.includes(field)) {
      setStickyFields((prev) => prev.filter((f) => f !== field))
    } else if (canSelectField(field)) {
      setStickyFields((prev) => [...prev, field])
    }
    if (errors.stickyFields) {
      setErrors((prev) => ({ ...prev, stickyFields: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!ruleName.trim()) newErrors.ruleName = "Rule name is required"
    if (!selectedOpportunityListId) newErrors.opportunityList = "Please select an opportunity list"
    if (stickyFields.length === 0) newErrors.stickyFields = "Select at least one field"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ruleName,
        selectedOpportunityListId,
        selectedOpportunityListName,
        stickyFields,
        conflictResolution,
      })
      setRuleName("")
      setSelectedOpportunityListId("")
      setSelectedOpportunityListName("")
      setStickyFields([])
      setConflictResolution("latest")
      setErrors({})
      setSearchQuery("")
    }
  }

  useEffect(() => {
    if (editingRule) {
      setRuleName(editingRule.name)
      setSelectedOpportunityListId(editingRule.opportunityList)
      setSelectedOpportunityListName(editingRule.opportunityList)
      setStickyFields(editingRule.stickyFields)
      setConflictResolution(editingRule.conflictResolution)
    } else {
      setRuleName("")
      setSelectedOpportunityListId("")
      setSelectedOpportunityListName("")
      setStickyFields([])
      setConflictResolution("latest")
    }
    setErrors({})
    setSearchQuery("")
  }, [editingRule, isOpen])

  useEffect(() => {
    if (selectedOpportunityListId && !editingRule) {
      setStickyFields([])
    }
  }, [selectedOpportunityListId, editingRule])

  if (!isOpen) return null

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 flex">
        <div className="fixed inset-0 bg-black/60" onClick={onClose} />
        <div className="ml-auto w-1/2 min-w-96 bg-background h-full shadow-xl flex flex-col relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Create Stickiness Rule</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
            {/* STEP 1 - Rule Name */}
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                placeholder="e.g. Same Exam Category → Same Owner"
                value={ruleName}
                onChange={(e) => {
                  setRuleName(e.target.value)
                  if (errors.ruleName) setErrors((prev) => ({ ...prev, ruleName: "" }))
                }}
                className={errors.ruleName ? "border-destructive" : ""}
              />
              {errors.ruleName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.ruleName}
                </p>
              )}
            </div>

            {/* STEP 2 - Select Opportunity List */}
            {showStep2 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="opportunityList">Apply this rule to Opportunity List</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">
                        Only <strong>active</strong> opportunity lists with more than 1 logic field are shown. Each list
                        can only be used in one stickiness rule. Logic fields are limited to max 3 per opportunity.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={selectedOpportunityListId}
                  onValueChange={(value) => {
                    const selectedList = opportunityListsData.find((list) => list.id === value)
                    setSelectedOpportunityListId(value)
                    setSelectedOpportunityListName(selectedList?.name || "")
                    if (errors.opportunityList) setErrors((prev) => ({ ...prev, opportunityList: "" }))
                  }}
                  disabled={selectedOpportunityListId !== ""}
                >
                  <SelectTrigger className={errors.opportunityList ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select Opportunity List" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOpportunityLists.length > 0 ? (
                      availableOpportunityLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name} ({list.logicFields.length} fields)
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No available opportunity lists
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.opportunityList && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.opportunityList}
                  </p>
                )}
              </div>
            )}

            {/* STEP 3 - Select Stickiness Fields */}
            {showStep3 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Keep owner same when these fields match</Label>
                  <span className="text-xs text-muted-foreground">
                    Max {maxSelectableFields} of {availableLogicFields.length} fields
                  </span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg bg-background hover:bg-accent/50 transition-colors ${
                      errors.stickyFields ? "border-destructive" : ""
                    }`}
                  >
                    <span className="text-sm text-foreground">
                      {stickyFields.length > 0
                        ? `${stickyFields.length} item${stickyFields.length !== 1 ? "s" : ""} selected`
                        : "Select fields"}
                    </span>
                    {isDropdownOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="p-3 border-b">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="max-h-64 overflow-y-auto">
                        {filteredFields.map((field) => {
                          const isSelected = stickyFields.includes(field)
                          const isDisabled = !canSelectField(field) && !isSelected

                          const optionElement = (
                            <button
                              key={field}
                              type="button"
                              onClick={() => !isDisabled && handleStickyFieldToggle(field)}
                              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors ${
                                isSelected ? "bg-primary/10" : ""
                              } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                              disabled={isDisabled}
                            >
                              <span className="text-sm text-foreground">{field}</span>
                              <Check
                                className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground/30"}`}
                              />
                            </button>
                          )

                          if (isDisabled) {
                            return (
                              <Tooltip key={field}>
                                <TooltipTrigger asChild>{optionElement}</TooltipTrigger>
                                <TooltipContent side="right" className="max-w-xs">
                                  <p className="text-xs">
                                    Maximum {maxSelectableFields} field{maxSelectableFields !== 1 ? "s" : ""} can be
                                    selected.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )
                          }
                          return optionElement
                        })}

                        {filteredFields.length === 0 && (
                          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No fields found</div>
                        )}
                      </div>

                      <div className="p-3 border-t bg-muted/20">
                        <Button
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {errors.stickyFields && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.stickyFields}
                  </p>
                )}
              </div>
            )}

            {/* Explanation */}
            {showStep3Explanation && (
              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <p className="text-sm text-foreground">{getExplanationText()}</p>
              </div>
            )}

            {/* STEP 4 - Conflict Resolution */}
            {showStep4 && (
              <div className="space-y-4">
                <Label>When more than one matching Opportunity exists for the same Lead</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setConflictResolution("latest")}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all ${
                      conflictResolution === "latest"
                        ? "border-2 border-primary bg-primary/5"
                        : "border border-border bg-background hover:bg-accent/50"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">Recent</span>
                    <span className="text-xs text-primary mt-1">Recommended</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConflictResolution("earliest")}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all ${
                      conflictResolution === "earliest"
                        ? "border-2 border-primary bg-primary/5"
                        : "border border-border bg-background hover:bg-accent/50"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">Earliest</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {conflictResolution === "latest" ? (
                    <>
                      <p className="text-sm font-medium text-foreground">
                        Owner will be reused from the most recent matching Opportunity.
                      </p>
                      <p className="text-sm text-muted-foreground">Recommended when ownership may change over time.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-foreground">
                        Owner will be reused from the earliest matching Opportunity.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Best when ownership should remain fixed from first assignment.
                      </p>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground/70">
                    The system always uses the current owner of the selected Opportunity.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t bg-muted/20">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Save
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
