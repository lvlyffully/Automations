"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Code,
  Trash2,
  Users,
  History,
  ArrowLeft,
  X,
  ChevronRight,
  ArrowUpDown,
  Columns,
  Clock,
  Minus,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { NavHeader } from "@/components/nav-header"
import { Sidebar } from "@/components/sidebar"
import { type OpportunityList, getOpportunityLists, saveOpportunityLists } from "@/lib/opportunity-store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Lead {
  id: string
  name: string
  email: string
  mobile: string
  stage: string
  capturedOn: string
}

const leadsData: Lead[] = [
  {
    id: "1",
    name: "Rahul",
    email: "**********@gmail.com",
    mobile: "*************",
    stage: "No Response",
    capturedOn: "02/06/2025, 12:27 PM",
  },
  {
    id: "2",
    name: "Mohneesh",
    email: "***************@gmail.com",
    mobile: "*************",
    stage: "Not Reachable",
    capturedOn: "27/05/2025, 01:36 PM",
  },
  {
    id: "3",
    name: "Pranav Gehlot",
    email: "***************@gmail.com",
    mobile: "*************",
    stage: "No Response",
    capturedOn: "27/05/2025, 01:36 PM",
  },
  {
    id: "4",
    name: "Nishita Agarwal",
    email: "******************@gmail.com",
    mobile: "*************",
    stage: "Closed",
    capturedOn: "27/05/2025, 01:36 PM",
  },
  {
    id: "5",
    name: "P RUDRA NARAYAN",
    email: "***************@gmail.com",
    mobile: "*************",
    stage: "Closed",
    capturedOn: "27/05/2025, 01:36 PM",
  },
  {
    id: "6",
    name: "Hitakshi",
    email: "***********@gmail.com",
    mobile: "*************",
    stage: "No Response",
    capturedOn: "27/05/2025, 01:36 PM",
  },
  {
    id: "7",
    name: "Tanishka Gaware",
    email: "****************@gmail.com",
    mobile: "*************",
    stage: "No Response",
    capturedOn: "27/05/2025, 01:36 PM",
  },
  {
    id: "8",
    name: "Vedant Saraswat",
    email: "******************@gmail.com",
    mobile: "*************",
    stage: "Closed",
    capturedOn: "27/05/2025, 01:36 PM",
  },
  {
    id: "9",
    name: "Charisma Akurathi",
    email: "******************@gmail.com",
    mobile: "*************",
    stage: "No Response",
    capturedOn: "27/05/2025, 01:36 PM",
  },
  {
    id: "10",
    name: "Swasti Kwatra",
    email: "***************@gmail.com",
    mobile: "*************",
    stage: "Cold",
    capturedOn: "27/05/2025, 01:36 PM",
  },
]

export default function OpportunityPlaygroundPage() {
  const [opportunityLists, setOpportunityLists] = useState<OpportunityList[]>([])
  const [activeTab, setActiveTab] = useState<"lists" | "fields" | "tabs">("lists")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityList | null>(null)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [editStep, setEditStep] = useState(1)
  const [editingOpportunity, setEditingOpportunity] = useState<OpportunityList | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [viewingLeads, setViewingLeads] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortField, setSortField] = useState<"createdOn" | "updatedOn">("createdOn")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [warningDialog, setWarningDialog] = useState<{
    isOpen: boolean
    listId: string
    listName: string
    ruleNames: string[]
  }>({
    isOpen: false,
    listId: "",
    listName: "",
    ruleNames: [],
  })

  // Load opportunity lists from shared store
  useEffect(() => {
    setOpportunityLists(getOpportunityLists())
  }, [])

  // Save to shared store when lists change
  useEffect(() => {
    if (opportunityLists.length > 0) {
      saveOpportunityLists(opportunityLists)
    }
  }, [opportunityLists])

  const filteredLists = opportunityLists.filter((list) => list.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSort = (field: "createdOn" | "updatedOn") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleEditClick = (opportunity: OpportunityList) => {
    setEditingOpportunity(opportunity)
    setEditTitle(opportunity.title)
    setEditStep(1)
    setIsEditDrawerOpen(true)
  }

  const handleStatusChange = (id: string) => {
    const list = opportunityLists.find((l) => l.id === id)
    if (!list) return

    // If changing from Active to Inactive, check if used in stickiness rules
    if (list.status === "Active") {
      // Get stickiness rules from localStorage
      const savedRules = typeof window !== "undefined" ? localStorage.getItem("stickinessRules") : null
      if (savedRules) {
        try {
          const rules = JSON.parse(savedRules)
          const usedInRules = rules.filter((rule: any) => rule.opportunityListId === id)

          if (usedInRules.length > 0) {
            // Show warning dialog
            setWarningDialog({
              isOpen: true,
              listId: id,
              listName: list.title,
              ruleNames: usedInRules.map((r: any) => r.name || "Unnamed Rule"),
            })
            return
          }
        } catch (e) {
          console.error("Error reading stickiness rules:", e)
        }
      }
    }

    // No rules found or changing to Active, proceed with status change
    proceedWithStatusChange(id)
  }

  const proceedWithStatusChange = (id: string) => {
    setOpportunityLists((prev) =>
      prev.map((list) =>
        list.id === id ? { ...list, status: list.status === "Active" ? "Inactive" : "Active" } : list,
      ),
    )
  }

  const handleDelete = (id: string) => {
    setOpportunityLists((prev) => prev.filter((list) => list.id !== id))
  }

  const handleViewLeads = (opportunity: OpportunityList) => {
    setSelectedOpportunity(opportunity)
    setViewingLeads(true)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "No Response":
        return "bg-destructive/10 text-destructive"
      case "Not Reachable":
        return "bg-warning/10 text-warning"
      case "Closed":
        return "bg-muted text-muted-foreground"
      case "Cold":
        return "bg-info/10 text-info"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Leads View
  if (viewingLeads && selectedOpportunity) {
    return (
      <div className="flex h-screen bg-muted/30">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <NavHeader />

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setViewingLeads(false)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-xl font-semibold">
                  Opportunity - <span className="text-primary">{selectedOpportunity.title}</span>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Columns className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Clock className="w-4 h-4" />
                </Button>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Default View</span>
              <Checkbox />
            </div>

            <div className="bg-background rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Captured On <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadsData.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="text-primary font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.mobile}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStageColor(lead.stage)}`}>
                          {lead.stage}
                        </span>
                      </TableCell>
                      <TableCell>{lead.capturedOn}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Show Total Records</span>
                <span>Show Rows</span>
                <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}>
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" disabled>
                  {"<"}
                </Button>
                <Button variant="ghost" size="sm">
                  {">"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main List View
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavHeader />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/account-setup")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Opportunity</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mb-6 border-b">
            {["lists", "fields", "tabs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "lists" ? "Lists" : tab === "fields" ? "Fields" : "Tabs"}
              </button>
            ))}
          </div>

          {/* Lists Table */}
          {activeTab === "lists" && (
            <div className="bg-background rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Updated By</TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort("createdOn")}
                        className="flex items-center space-x-1 hover:text-foreground"
                      >
                        <span>Created On</span>
                        {sortField === "createdOn" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <div className="flex flex-col">
                            <ChevronUp className="w-3 h-3 -mb-1" />
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        onClick={() => handleSort("updatedOn")}
                        className="flex items-center space-x-1 hover:text-foreground"
                      >
                        <span>Updated On</span>
                        {sortField === "updatedOn" ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <div className="flex flex-col">
                            <ChevronUp className="w-3 h-3 -mb-1" />
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell>
                        <button
                          onClick={() => handleViewLeads(list)}
                          className="text-primary hover:underline font-medium"
                        >
                          {list.title}
                        </button>
                      </TableCell>
                      <TableCell>{list.createdBy}</TableCell>
                      <TableCell>{list.updatedBy}</TableCell>
                      <TableCell>{list.createdOn}</TableCell>
                      <TableCell>{list.updatedOn}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            list.status === "Active"
                              ? "bg-success/10 text-success border border-success/20"
                              : "bg-destructive/10 text-destructive border border-destructive/20"
                          }`}
                        >
                          {list.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(list)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(list.id)}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Change Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Code className="w-4 h-4 mr-2" />
                              View JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(list.id)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="w-4 h-4 mr-2" />
                              View Activities
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="w-4 h-4 mr-2" />
                              Version History
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "fields" && (
            <div className="bg-background rounded-lg border p-8 text-center text-muted-foreground">
              Fields configuration coming soon...
            </div>
          )}

          {activeTab === "tabs" && (
            <div className="bg-background rounded-lg border p-8 text-center text-muted-foreground">
              Tabs configuration coming soon...
            </div>
          )}
        </div>
      </div>

      {/* Edit Opportunity Sheet - Full Height */}
      <Sheet open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <SheetContent side="right" className="w-[600px] sm:max-w-[600px] p-0 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
            <div className="flex items-center gap-3">
              {editStep > 1 && (
                <Button variant="ghost" size="sm" onClick={() => setEditStep(editStep - 1)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <h2 className="text-lg font-semibold">
                {editStep === 1 && "Edit Opportunity"}
                {editStep === 2 && "Edit Opportunity fields"}
                {editStep === 3 && "Edit Opportunity logic"}
              </h2>
              <span className="text-xs bg-muted px-2 py-1 rounded">Step {editStep} Of 3</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsEditDrawerOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {editStep === 1 && (
              <div className="space-y-6">
                <div className="bg-info/10 border border-info/20 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    Opportunity will empower you to capture multiple interest of a lead and channelise your teams
                    towards higher conversion, customised by you as per your business logic.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Defined Opportunity title will be visible as a header. For Instance, Data Science for Beginners, or
                    IIT Learning Batch etc.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                </div>
              </div>
            )}

            {editStep === 2 && editingOpportunity && (
              <div className="space-y-6">
                <div className="bg-info/10 border border-info/20 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    Opportunity fields can be associated and customised as per your business logic. You can use the
                    associated fields to capture, view and update the data within the List.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For Instance, Course Expiry Date to store and track the course end date of a course.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Fields from Opportunity Logic are automatically added here as read-only
                    system fields and cannot be removed.
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Display Name</TableHead>
                      <TableHead>Field Type</TableHead>
                      <TableHead>Properties</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editingOpportunity.fields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-medium">{field.displayName}</div>
                              <div className="text-xs text-muted-foreground">{field.fieldKey}</div>
                            </div>
                            {field.isSystemGenerated && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">System</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{field.fieldType === "Text Box" ? "T" : "☰"}</span>
                            <span>{field.fieldType}</span>
                          </div>
                          {field.properties && <div className="text-xs text-muted-foreground">{field.properties}</div>}
                        </TableCell>
                        <TableCell>{field.required && <span className="text-destructive text-lg">*</span>}</TableCell>
                        <TableCell>
                          {field.isSystemGenerated ? (
                            <span className="text-xs text-muted-foreground">Required</span>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {editingOpportunity.logic.length >= 3 ? (
                  <div className="flex items-center gap-2 text-sm text-warning">
                    <Info className="w-4 h-4" />
                    Maximum 3 logic fields allowed per opportunity list.
                  </div>
                ) : (
                  <Button variant="outline" className="text-primary border-primary bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Associate New Field
                  </Button>
                )}
              </div>
            )}

            {editStep === 3 && editingOpportunity && (
              <div className="space-y-6">
                <div className="bg-info/10 border border-info/20 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    Opportunity Logic defines filters that match <strong>Lead fields</strong> to automatically create
                    opportunities in this list.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For Instance: When a Lead is created with "Exam Category = UPSC" AND "Course ID = CS101", an
                    opportunity is automatically created. The fields used in logic become read-only fields in the
                    opportunity record.
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    Maximum 3 logic filter fields allowed per opportunity list.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Lead Field Filters (Creates Opportunities)</Label>
                  <p className="text-xs text-muted-foreground">
                    These filters match against Lead fields. When matched, an opportunity is created with these field
                    values.
                  </p>
                </div>

                {/* Locked Logic Row */}
                {editingOpportunity.logic
                  .filter((l) => l.isLocked)
                  .map((logic) => (
                    <div key={logic.id} className="flex items-center gap-3 opacity-60">
                      <Select value={logic.field} disabled>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                      </Select>
                      <Select value={logic.operator} disabled>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                      </Select>
                      <Select value={String(logic.value)} disabled>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                      </Select>
                    </div>
                  ))}

                {/* Editable Logic */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm">All</span>
                    <span className="text-sm text-muted-foreground">Meet All Criteria</span>
                  </div>

                  {editingOpportunity.logic
                    .filter((l) => !l.isLocked)
                    .map((logic, index) => (
                      <div key={logic.id} className="flex items-center gap-3">
                        <span className="text-muted-foreground">▸</span>
                        <Select value={logic.field} disabled>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                        </Select>
                        <Select defaultValue={logic.operator}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Include">Include</SelectItem>
                            <SelectItem value="Exclude">Exclude</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue={Array.isArray(logic.value) ? "multiple" : String(logic.value)}>
                          <SelectTrigger className="flex-1">
                            <SelectValue>
                              {Array.isArray(logic.value) ? `${logic.value.length} items selected` : logic.value}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(logic.value) ? (
                              logic.value.map((v) => (
                                <SelectItem key={v} value={v}>
                                  {v}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value={String(logic.value)}>{logic.value}</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                  {editingOpportunity.logic.length < 3 && (
                    <Button variant="outline" className="text-primary border-primary bg-transparent" disabled>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Condition
                    </Button>
                  )}
                </div>

                {/* Note Section */}
                <div className="bg-info/10 border border-info/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-info" />
                    <span className="font-medium text-sm">Note: Opportunity Logic Editing</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      You can only add or remove <strong>values</strong> from existing filter fields.
                    </p>
                    <p className="text-muted-foreground">
                      Adding new filter fields or changing field names is not allowed.
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Example: If your current logic is Course = Data Science OR Python
                    </p>
                    <p className="text-success flex items-center gap-1">
                      <span>✓</span> You can add/remove Advanced Python, making it Course = Data Science OR Python OR
                      Advanced Python
                    </p>
                    <p className="text-destructive flex items-center gap-1">
                      <span>✗</span> You cannot add a new filter like State = Delhi or change the logic.
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When values are added, new Opportunities will be auto-created for matching leads (if configured).
                    When values are removed, existing Opportunities stay, but new ones will be blocked from creation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex items-center justify-between p-6 border-t bg-muted/20 flex-shrink-0">
            {editStep > 1 ? (
              <Button variant="outline" onClick={() => setEditStep(editStep - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditDrawerOpen(false)}>
                Cancel
              </Button>
            )}
            {editStep < 3 ? (
              <Button onClick={() => setEditStep(editStep + 1)} className="bg-primary hover:bg-primary/90">
                Save & Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (editingOpportunity) {
                    setOpportunityLists((prev) =>
                      prev.map((list) => (list.id === editingOpportunity.id ? { ...list, title: editTitle } : list)),
                    )
                  }
                  setIsEditDrawerOpen(false)
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Save
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Warning Dialog */}
      <AlertDialog
        open={warningDialog.isOpen}
        onOpenChange={(open) => setWarningDialog({ ...warningDialog, isOpen: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opportunity List Used in Stickiness Rules</AlertDialogTitle>
            <div className="text-muted-foreground text-sm space-y-3 pt-2">
              <div>
                The opportunity list <strong>{warningDialog.listName}</strong> is currently being used in the following
                stickiness rule(s):
              </div>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {warningDialog.ruleNames.map((name, idx) => (
                  <li key={idx} className="text-sm">
                    {name}
                  </li>
                ))}
              </ul>
              <div className="text-amber-600 dark:text-amber-500 font-medium">
                Making this opportunity list inactive will cause the associated stickiness rule(s) to become inactive as
                well. Are you sure you want to proceed?
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                proceedWithStatusChange(warningDialog.listId)
                setWarningDialog({ isOpen: false, listId: "", listName: "", ruleNames: [] })
              }}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Proceed Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
