"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { X, ArrowLeft, Search } from "lucide-react"
import { getOpportunityLists } from "@/lib/opportunity-store"

interface CreateAutomationDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (triggerInfo: {
    category: string
    activitySubType: string
    selectedTrigger: string
    selectedOpportunities: string[]
  }) => void
}

type TriggerCategory = "lead-application" | "opportunity" | "activity"
type ActivitySubType = "lead-activity" | "opportunity-activity" | null
type ViewState = "category-selection" | "activity-type-selection" | "activity-configuration"

export function CreateAutomationDrawer({ isOpen, onClose, onSave }: CreateAutomationDrawerProps) {
  const [selectedTrigger, setSelectedTrigger] = useState("on-lead-creation")
  const [automationLimit, setAutomationLimit] = useState([1336])

  const [activeTab, setActiveTab] = useState<TriggerCategory>("lead-application")
  const [selectedCategory, setSelectedCategory] = useState<TriggerCategory>("lead-application")
  const [activitySubType, setActivitySubType] = useState<ActivitySubType>(null)
  const [viewState, setViewState] = useState<ViewState>("category-selection")

  // Activity configuration state
  const [activityTrigger, setActivityTrigger] = useState("")
  const [dynamicActivity, setDynamicActivity] = useState("")
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([])
  const [opportunityDropdownOpen, setOpportunityDropdownOpen] = useState(false)
  const [opportunitySearchQuery, setOpportunitySearchQuery] = useState("")

  // Mock data for dynamic activities
  const dynamicActivities = [
    "Testing Date Fields",
    "HELLO",
    "Webina",
    "devvvvvvvvvvvvvvvvvvv",
    "new data",
    "Payment Installment",
    "liveeeeeeee",
    "dfghjkl",
    "sdfghjkl",
  ]

  const opportunityLists = getOpportunityLists()
    .filter((list) => list.status === "Active")
    .map((list) => list.title)

  const handleCategoryClick = (category: TriggerCategory) => {
    setActiveTab(category)
    setSelectedCategory(category)
    if (category === "activity") {
      setViewState("activity-type-selection")
    } else {
      setViewState("category-selection")
    }
  }

  const handleActivitySubTypeSelect = (subType: ActivitySubType) => {
    setActivitySubType(subType)
  }

  const handleActivitySubTypeNext = () => {
    if (activitySubType) {
      setViewState("activity-configuration")
    }
  }

  const handleBackToActivitySelection = () => {
    setViewState("activity-type-selection")
    setActivityTrigger("")
    setDynamicActivity("")
  }

  const handleBackToCategorySelection = () => {
    setViewState("category-selection")
    setActiveTab("lead-application")
    setSelectedCategory("lead-application")
    setActivitySubType(null)
    setActivityTrigger("")
    setDynamicActivity("")
  }

  const handleAddOpportunity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && opportunitySearchQuery.trim()) {
      setSelectedOpportunities([...selectedOpportunities, opportunitySearchQuery.trim()])
      setOpportunitySearchQuery("")
    }
  }

  const handleOpportunitySelect = (opportunity: string) => {
    if (!selectedOpportunities.includes(opportunity)) {
      setSelectedOpportunities([...selectedOpportunities, opportunity])
    }
    setOpportunitySearchQuery("")
  }

  const handleRemoveOpportunity = (opportunityToRemove: string) => {
    setSelectedOpportunities(selectedOpportunities.filter((opp) => opp !== opportunityToRemove))
  }

  const filteredOpportunities = opportunityLists.filter((opp) =>
    opp.toLowerCase().includes(opportunitySearchQuery.toLowerCase()),
  )

  const showDynamicActivityField =
    activityTrigger === "dynamic-activity-created" || activityTrigger === "dynamic-activity-updated"

  const isOpportunityBasedTrigger = selectedCategory === "opportunity" || activitySubType === "opportunity-activity"
  const canSave = !isOpportunityBasedTrigger || selectedOpportunities.length > 0

  if (!isOpen) return null

  const handleSave = () => {
    if (!canSave) return

    onSave({
      category: selectedCategory,
      activitySubType: activitySubType,
      selectedTrigger: selectedTrigger,
      selectedOpportunities: selectedOpportunities,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="ml-auto w-1/2 min-w-96 bg-white h-full shadow-xl flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {viewState !== "category-selection" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={
                  viewState === "activity-type-selection"
                    ? handleBackToCategorySelection
                    : handleBackToActivitySelection
                }
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">
              {viewState === "activity-configuration"
                ? activitySubType === "lead-activity"
                  ? "Leads Activity"
                  : "Opportunity Activity"
                : selectedCategory === "opportunity"
                  ? "On Opportunity Creation"
                  : "Create Automation"}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Automation Limit */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Automation Limit</Label>
              <span className="text-sm text-gray-500">89/100</span>
            </div>
            <Slider
              value={automationLimit}
              onValueChange={setAutomationLimit}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {viewState === "category-selection" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <button
                  onClick={() => handleCategoryClick("lead-application")}
                  className={`text-left w-full ${
                    activeTab === "lead-application" ? "opacity-100" : "opacity-50 hover:opacity-75"
                  } transition-opacity`}
                >
                  <h3 className="font-medium text-gray-900 mb-1">Lead/Application Triggers</h3>
                  <p className="text-sm text-gray-500">
                    On lead creation, lead/application field update, specific dates and regular intervals
                  </p>
                </button>

                <button
                  onClick={() => handleCategoryClick("opportunity")}
                  className={`text-left w-full ${
                    activeTab === "opportunity" ? "opacity-100" : "opacity-50 hover:opacity-75"
                  } transition-opacity`}
                >
                  <h3 className="font-medium text-gray-900 mb-1">Opportunity Triggers</h3>
                  <p className="text-sm text-gray-500">On opportunity create and update</p>
                </button>

                <button
                  onClick={() => handleCategoryClick("activity")}
                  className={`text-left w-full ${
                    activeTab === "activity" ? "opacity-100" : "opacity-50 hover:opacity-75"
                  } transition-opacity`}
                >
                  <h3 className="font-medium text-gray-900 mb-1">Activity Triggers</h3>
                  <p className="text-sm text-gray-500">On activity create and update</p>
                </button>
              </div>

              <div className="space-y-4">
                <RadioGroup value={selectedTrigger} onValueChange={setSelectedTrigger}>
                  {activeTab === "lead-application" && (
                    <>
                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                        <RadioGroupItem value="on-lead-creation" id="on-lead-creation" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="on-lead-creation" className="font-medium cursor-pointer">
                            On Lead Creation
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            The automation will trigger once the lead gets created in the system
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                        <RadioGroupItem value="on-field-update" id="on-field-update" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="on-field-update" className="font-medium cursor-pointer">
                            On Lead/Application Field Update
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            The automation will trigger once the selected lead/Application field gets updated
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                        <RadioGroupItem value="on-specific-date" id="on-specific-date" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="on-specific-date" className="font-medium cursor-pointer">
                            On Specific Date
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            The automation gets triggered on the selected lead/application level date
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                        <RadioGroupItem value="at-regular-intervals" id="at-regular-intervals" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="at-regular-intervals" className="font-medium cursor-pointer">
                            At Regular Intervals
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            The automation gets triggered based the defined intervals
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "opportunity" && (
                    <>
                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                        <RadioGroupItem value="on-opportunity-creation" id="on-opportunity-creation" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="on-opportunity-creation" className="font-medium cursor-pointer">
                            On Opportunity Creation
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            The automation gets triggered on opportunity creation in the selected opportunity lists
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                        <RadioGroupItem
                          value="on-opportunity-field-update"
                          id="on-opportunity-field-update"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="on-opportunity-field-update" className="font-medium cursor-pointer">
                            On Opportunity Field Update
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            The automation gets triggered on opportunity field update from the selected opportunity
                            lists
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "activity" && (
                    <>
                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                        <RadioGroupItem value="leads-activity" id="leads-activity" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="leads-activity" className="font-medium cursor-pointer">
                            Leads Activity
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">On Leads activity update</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                        <RadioGroupItem value="opportunity-activity" id="opportunity-activity" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="opportunity-activity" className="font-medium cursor-pointer">
                            Opportunity Activity
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">On Opportunity activity update</p>
                        </div>
                      </div>
                    </>
                  )}
                </RadioGroup>
              </div>
            </div>
          )}

          {viewState === "category-selection" && isOpportunityBasedTrigger && (
            <>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Select the opportunity list from where the journey will begin once opportunity fields are updated in
                  the selected list
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Eg. If an entity has multiple opportunity lists like BBA, BCA, Analytics then it can be selected here.
                  Only when opportunity are created within selected lists, the automation will get triggered.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opportunity-select" className="text-sm font-medium">
                  Select Opportunity <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div
                    className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer"
                    onClick={() => setOpportunityDropdownOpen(!opportunityDropdownOpen)}
                  >
                    {selectedOpportunities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedOpportunities.map((opp) => (
                          <span
                            key={opp}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                          >
                            {opp}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveOpportunity(opp)
                              }}
                              className="hover:text-blue-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select Opportunity</span>
                    )}
                  </div>

                  {opportunityDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-hidden">
                      <div className="p-2 border-b">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search opportunity..."
                            value={opportunitySearchQuery}
                            onChange={(e) => setOpportunitySearchQuery(e.target.value)}
                            className="pl-8"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredOpportunities.map((opp) => (
                          <div
                            key={opp}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                              selectedOpportunities.includes(opp) ? "bg-blue-50 text-blue-700" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpportunitySelect(opp)
                            }}
                          >
                            {opp}
                          </div>
                        ))}
                        {filteredOpportunities.length === 0 && (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No opportunities found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Activity Type Selection View */}
          {viewState === "activity-type-selection" && (
            <RadioGroup
              value={activitySubType || ""}
              onValueChange={(value) => handleActivitySubTypeSelect(value as ActivitySubType)}
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                  <RadioGroupItem value="lead-activity" id="lead-activity" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="lead-activity" className="font-medium cursor-pointer">
                      Leads Activity
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">On Leads activity update</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg hover:border-gray-300 transition-colors">
                  <RadioGroupItem value="opportunity-activity" id="opportunity-activity" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="opportunity-activity" className="font-medium cursor-pointer">
                      Opportunity Activity
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">On Opportunity activity update</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          )}

          {/* Activity Configuration View */}
          {viewState === "activity-configuration" && (
            <div className="space-y-6">
              {activitySubType === "opportunity-activity" && (
                <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Select the opportunity list from where the journey will begin once opportunity fields are updated in
                    the selected list
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Eg. If an entity has multiple opportunity lists like BBA, BCA, Analytics then it can be selected
                    here. Only when opportunity are created within selected lists, the automation will get triggered.
                  </p>
                </div>
              )}

              {/* Select Activity Trigger */}
              <div className="space-y-2">
                <Label htmlFor="activity-trigger" className="text-sm font-medium">
                  Select Activity trigger <span className="text-red-500">*</span>
                </Label>
                <Select value={activityTrigger} onValueChange={setActivityTrigger}>
                  <SelectTrigger id="activity-trigger">
                    <SelectValue placeholder="Select Activity Trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select-activity-trigger" disabled>
                      Select Activity Trigger
                    </SelectItem>
                    <SelectGroup>
                      <SelectLabel>Telephony Activity</SelectLabel>
                      <SelectItem value="inbound-call-activity">Inbound Call Activity</SelectItem>
                      <SelectItem value="outbound-call-activity">Outbound Call Activity</SelectItem>
                      <SelectItem value="campaign-call-activity">Campaign Call Activity</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Dynamic Activity</SelectLabel>
                      <SelectItem value="dynamic-activity-created">Dynamic Activity Created</SelectItem>
                      <SelectItem value="dynamic-activity-updated">Dynamic Activity Updated</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Select Dynamic Activity - Conditional */}
              {showDynamicActivityField && (
                <div className="space-y-2">
                  <Label htmlFor="dynamic-activity" className="text-sm font-medium">
                    Select Dynamic Activity <span className="text-red-500">*</span>
                  </Label>
                  <Select value={dynamicActivity} onValueChange={setDynamicActivity}>
                    <SelectTrigger id="dynamic-activity">
                      <SelectValue placeholder="Select Dynamic Activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select-dynamic-activity" disabled>
                        Select Dynamic Activity
                      </SelectItem>
                      {dynamicActivities.map((activity) => (
                        <SelectItem key={activity} value={activity.toLowerCase().replace(/\s+/g, "-")}>
                          {activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activitySubType === "opportunity-activity" && (
                <div className="space-y-2">
                  <Label htmlFor="opportunity-select-activity" className="text-sm font-medium">
                    Select Opportunity <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div
                      className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer"
                      onClick={() => setOpportunityDropdownOpen(!opportunityDropdownOpen)}
                    >
                      {selectedOpportunities.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedOpportunities.map((opp) => (
                            <span
                              key={opp}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                            >
                              {opp}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveOpportunity(opp)
                                }}
                                className="hover:text-blue-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Select Opportunity</span>
                      )}
                    </div>

                    {opportunityDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-hidden">
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search opportunity..."
                              value={opportunitySearchQuery}
                              onChange={(e) => setOpportunitySearchQuery(e.target.value)}
                              className="pl-8"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredOpportunities.map((opp) => (
                            <div
                              key={opp}
                              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                                selectedOpportunities.includes(opp) ? "bg-blue-50 text-blue-700" : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpportunitySelect(opp)
                              }}
                            >
                              {opp}
                            </div>
                          ))}
                          {filteredOpportunities.length === 0 && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">No opportunities found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {viewState === "activity-type-selection" ? (
            <Button
              onClick={handleActivitySubTypeNext}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!activitySubType}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={!canSave}>
              {viewState === "activity-configuration" ? "Save" : "Next"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
