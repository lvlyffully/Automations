"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronDown, Plus, Eye, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { CreateStickinessRuleDrawer } from "@/components/create-stickiness-rule-drawer"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { NavHeader } from "@/components/nav-header"
import { isOpportunityListActive } from "@/lib/opportunity-store"
import { getStickinessRules, type StickinessRule } from "@/lib/stickiness-store"

const AccountSetupPage = () => {
  const [activeTab, setActiveTab] = useState("allocation-stickiness")
  const [leadLimitType, setLeadLimitType] = useState("permission")
  const [applicationLimitType, setApplicationLimitType] = useState("permission")
  const [isLeadExpanded, setIsLeadExpanded] = useState(false)
  const [isApplicationExpanded, setIsApplicationExpanded] = useState(false)
  const [isOpportunityStickinessExpanded, setIsOpportunityStickinessExpanded] = useState(true)
  const [isStickinessDrawerOpen, setIsStickinessDrawerOpen] = useState(false)

  const [stickinessRules, setStickinessRules] = useState<StickinessRule[]>([])

  const [hoveredRuleId, setHoveredRuleId] = useState<string | null>(null)
  const [viewingRule, setViewingRule] = useState<StickinessRule | null>(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)

  useEffect(() => {
    const rules = getStickinessRules()
    setStickinessRules(rules)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("stickinessRules", JSON.stringify(stickinessRules))
    }
  }, [stickinessRules])

  useEffect(() => {
    setStickinessRules((prev) =>
      prev.map((rule) => ({
        ...rule,
        isActive: isOpportunityListActive(rule.opportunityListId),
      })),
    )
  }, [])

  const usedOpportunityLists = stickinessRules.map((rule) => rule.opportunityListId)

  const handleSaveStickinessRule = (ruleData: {
    ruleName: string
    selectedOpportunityListId: string
    selectedOpportunityListName: string
    stickyFields: string[]
    conflictResolution: string
  }) => {
    const newRule: StickinessRule = {
      id: Date.now().toString(),
      name: ruleData.ruleName,
      opportunityListId: ruleData.selectedOpportunityListId,
      opportunityListName: ruleData.selectedOpportunityListName,
      stickyFields: ruleData.stickyFields,
      conflictResolution: ruleData.conflictResolution as "recent" | "earliest",
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    setStickinessRules((prev) => [...prev, newRule])
    setIsStickinessDrawerOpen(false)
  }

  const handleDeleteRule = (ruleId: string) => {
    setStickinessRules((prev) => prev.filter((rule) => rule.id !== ruleId))
  }

  const handleViewRule = (rule: StickinessRule) => {
    setViewingRule(rule)
    setIsViewDrawerOpen(true)
  }

  const getOpportunityListName = (value: string) => {
    const lists: Record<string, string> = {
      "Sales Pipeline Q1": "Sales Pipeline Q1",
      "Partner Opportunities": "Partner Opportunities",
      "Enterprise Leads": "Enterprise Leads",
      "opp-list-1": "Sales Pipeline Opportunities",
      "opp-list-2": "Marketing Qualified Opportunities",
      "opp-list-3": "Enterprise Deals",
      "opp-list-4": "SMB Opportunities",
      "6": "Exam Category",
      "exam-category-sample": "Exam Category",
    }
    return lists[value] || value
  }

  const getStickyFieldName = (value: string) => {
    const fields: Record<string, string> = {
      lead_source: "Lead Source",
      campaign: "Campaign",
      product_interest: "Product Interest",
      region: "Region",
      industry: "Industry",
      company_size: "Company Size",
      "Exam Category": "Exam Category",
    }
    return fields[value] || value
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <NavHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Sidebar */}
        <SettingsSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden max-w-5xl">
          {/* Breadcrumb */}
          <div className="px-6 py-3 bg-white border-b flex-shrink-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="cursor-pointer hover:text-gray-900">🏠</span>
              <span>›</span>
              <button onClick={() => (window.location.href = "/account-setup")} className="hover:text-gray-900">
                Account Setup
              </button>
              <span>›</span>
              <span className="text-gray-900">
                {activeTab === "allocation-quota" ? "Allocation Quota" : "Allocation Stickiness"}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b flex-shrink-0">
            <div className="px-6 overflow-x-auto">
              <div className="flex items-center space-x-8 whitespace-nowrap">
                <button className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 flex-shrink-0">API Keys</button>
                <button className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 flex-shrink-0">
                  Check-In / Check-Out
                </button>
                <button className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 flex-shrink-0">
                  Notifications Settings
                </button>
                <button className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 flex-shrink-0">
                  Business Hours
                </button>
                <button
                  onClick={() => setActiveTab("allocation-quota")}
                  className={cn(
                    "px-4 py-3 text-sm flex-shrink-0",
                    activeTab === "allocation-quota"
                      ? "text-primary font-medium border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  Allocation Quota
                </button>
                <button
                  onClick={() => setActiveTab("allocation-stickiness")}
                  className={cn(
                    "px-4 py-3 text-sm flex-shrink-0",
                    activeTab === "allocation-stickiness"
                      ? "text-primary font-medium border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  Allocation Stickiness
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === "allocation-quota" ? (
              <>
                {/* Lead Allocation Quota Section */}
                <div className="bg-white rounded-lg border border-gray-200 mb-6">
                  <button
                    onClick={() => setIsLeadExpanded(!isLeadExpanded)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="text-left">
                      <h3 className="text-base font-semibold text-gray-900">Lead Allocation Quota</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        You can set limits on the number of leads that can be assigned to users based on flow defined at
                        the user permission group or individual user level.
                      </p>
                    </div>
                    <ChevronDown
                      className={cn("w-5 h-5 text-gray-400 transition-transform", isLeadExpanded && "rotate-180")}
                    />
                  </button>

                  {isLeadExpanded && (
                    <div className="px-6 py-6 border-t">
                      {/* Info Banner */}
                      <div className="bg-accent border border-accent rounded-lg px-4 py-3 mb-6">
                        <p className="text-sm text-gray-800">
                          This feature will be applied to the "Allocate User" Action through Automation.
                        </p>
                      </div>

                      {/* Limit Type Selection */}
                      <div className="mb-8">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Select Type of Lead Allocation Limit</h4>
                        <RadioGroup value={leadLimitType} onValueChange={setLeadLimitType}>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="user" id="lead-user-level" />
                              <Label htmlFor="lead-user-level" className="text-sm font-normal cursor-pointer">
                                User Level Limit
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="permission" id="lead-permission-level" />
                              <Label htmlFor="lead-permission-level" className="text-sm font-normal cursor-pointer">
                                Permission Level Limit
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Empty State */}
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="mb-6">
                          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-gray-300">
                            <rect x="20" y="30" width="50" height="60" rx="4" fill="currentColor" opacity="0.3" />
                            <rect x="50" y="40" width="50" height="60" rx="4" fill="currentColor" opacity="0.5" />
                            <circle cx="85" cy="55" r="15" fill="white" stroke="currentColor" strokeWidth="2" />
                            <path d="M85 50v10M80 55h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="text-center text-gray-700 mb-6 max-w-2xl">
                          You don't have any Lead Allocation Flow created yet, please click on Create Lead Allocation
                          Flow to get started.
                        </p>
                        <Button className="bg-primary hover:bg-primary/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Lead Allocation Flow
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Application Allocation Quota Section */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <button
                    onClick={() => setIsApplicationExpanded(!isApplicationExpanded)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="text-left">
                      <h3 className="text-base font-semibold text-gray-900">Application Allocation Quota</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        You can set limits on the number of applications that can be assigned to users based on flow
                        defined at the user permission group or individual user level.
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-gray-400 transition-transform",
                        isApplicationExpanded && "rotate-180",
                      )}
                    />
                  </button>

                  {isApplicationExpanded && (
                    <div className="px-6 py-6 border-t">
                      {/* Info Banner */}
                      <div className="bg-accent border border-accent rounded-lg px-4 py-3 mb-6">
                        <p className="text-sm text-gray-800">
                          This feature will be applied to the "Allocate User" Action through Automation.
                        </p>
                      </div>

                      {/* Limit Type Selection */}
                      <div className="mb-8">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Select Type of Application Allocation Limit
                        </h4>
                        <RadioGroup value={applicationLimitType} onValueChange={setApplicationLimitType}>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="user" id="user-level" />
                              <Label htmlFor="user-level" className="text-sm font-normal cursor-pointer">
                                User Level Limit
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="permission" id="permission-level" />
                              <Label htmlFor="permission-level" className="text-sm font-normal cursor-pointer">
                                Permission Level Limit
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Empty State */}
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="mb-6">
                          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-gray-300">
                            <rect x="20" y="30" width="50" height="60" rx="4" fill="currentColor" opacity="0.3" />
                            <rect x="50" y="40" width="50" height="60" rx="4" fill="currentColor" opacity="0.5" />
                            <circle cx="85" cy="55" r="15" fill="white" stroke="currentColor" strokeWidth="2" />
                            <path d="M85 50v10M80 55h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="text-center text-gray-700 mb-6 max-w-2xl">
                          You don't have any Application Allocation Flow created yet, please click on Create Application
                          Allocation Flow to get started.
                        </p>
                        <Button className="bg-primary hover:bg-primary/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Application Allocation Flow
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setIsOpportunityStickinessExpanded(!isOpportunityStickinessExpanded)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="text-left">
                    <h3 className="text-base font-semibold text-gray-900">Opportunity Allocation Stickiness</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Configure stickiness rules for opportunity allocation to maintain consistent assignment patterns
                      and improve workflow efficiency.
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-gray-400 transition-transform",
                      isOpportunityStickinessExpanded && "rotate-180",
                    )}
                  />
                </button>

                {isOpportunityStickinessExpanded && (
                  <div className="px-6 py-6 border-t">
                    {/* Info Banner */}
                    <div className="bg-accent border border-accent rounded-lg px-4 py-3 mb-6">
                      <p className="text-sm text-gray-800">
                        This feature will be applied to the "Allocate User" Action through Automation.
                      </p>
                    </div>

                    {stickinessRules.length > 0 && (
                      <div className="flex items-center justify-end mb-6">
                        <Button
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => setIsStickinessDrawerOpen(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Stickiness Rule
                        </Button>
                      </div>
                    )}

                    {stickinessRules.length > 0 ? (
                      <div className="space-y-2">
                        {stickinessRules.map((rule) => (
                          <div
                            key={rule.id}
                            className="border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                            onMouseEnter={() => setHoveredRuleId(rule.id)}
                            onMouseLeave={() => setHoveredRuleId(null)}
                          >
                            <div className="flex items-center justify-between px-6 py-4">
                              <div className="flex-1 flex items-center gap-3">
                                <h4 className="text-sm font-medium text-gray-900">{rule.name}</h4>
                                {!rule.isActive && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {hoveredRuleId === rule.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteRule(rule.id)}
                                    className="text-muted-foreground hover:text-destructive"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewRule(rule)}
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <Eye className="w-5 h-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="mb-6">
                          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-gray-300">
                            <rect x="20" y="30" width="50" height="60" rx="4" fill="currentColor" opacity="0.3" />
                            <rect x="50" y="40" width="50" height="60" rx="4" fill="currentColor" opacity="0.5" />
                            <circle cx="85" cy="55" r="15" fill="white" stroke="currentColor" strokeWidth="2" />
                            <path d="M85 50v10M80 55h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="text-center text-gray-700 mb-6 max-w-2xl">
                          You don't have any Opportunity Allocation Stickiness rules created yet, please click on Create
                          Stickiness Rule to get started.
                        </p>
                        <Button
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => setIsStickinessDrawerOpen(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Stickiness Rule
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateStickinessRuleDrawer
        isOpen={isStickinessDrawerOpen}
        onClose={() => {
          setIsStickinessDrawerOpen(false)
        }}
        onSave={handleSaveStickinessRule}
        usedOpportunityLists={usedOpportunityLists}
      />

      <Drawer open={isViewDrawerOpen} onOpenChange={setIsViewDrawerOpen} direction="right">
        <DrawerContent className="fixed right-0 top-0 bottom-0 w-[500px] rounded-none border-l">
          <div className="flex flex-col h-full">
            <DrawerHeader className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-lg font-semibold">View Stickiness Rule</DrawerTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsViewDrawerOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto p-6">
              {viewingRule && (
                <div className="space-y-6">
                  {!viewingRule.isActive && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                      <p className="text-sm text-destructive font-medium">
                        This rule is inactive because the associated opportunity list is no longer active.
                      </p>
                    </div>
                  )}

                  {/* Rule Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Rule Name</Label>
                    <p className="text-sm text-foreground">{viewingRule.name}</p>
                  </div>

                  {/* Opportunity List */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Opportunity List</Label>
                    <p className="text-sm text-foreground">{getOpportunityListName(viewingRule.opportunityListId)}</p>
                  </div>

                  {/* Sticky Fields */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Stickiness Fields</Label>
                    <div className="flex flex-wrap gap-2">
                      {viewingRule.stickyFields.map((field) => (
                        <span
                          key={field}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                        >
                          {getStickyFieldName(field)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Conflict Resolution */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Conflict Resolution</Label>
                    <p className="text-sm text-foreground">
                      {viewingRule.conflictResolution === "recent"
                        ? "Use Most Recent Opportunity"
                        : "Use Earliest Opportunity"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export { AccountSetupPage }
export default AccountSetupPage
