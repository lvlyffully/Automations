"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar } from "lucide-react"
import { getLeadStickinessReferences, type LeadStickinessReference } from "@/lib/stickiness-store"

interface Lead {
  id: string
  name: string
  email: string
  mobile: string
  state: string
  registrationDate: string
  stage: string
}

// Sample lead data without hardcoded stickiness references
const sampleLeads: Lead[] = [
  {
    id: "lead-1",
    name: "bnjhphlj",
    email: "**********@gmail.com",
    mobile: "+1684*******45",
    state: "State Not Available",
    registrationDate: "16/12/2025, 11:42:20 AM",
    stage: "Closed",
  },
  {
    id: "lead-2",
    name: "Bethel",
    email: "*************@gmail.com",
    mobile: "+234********98",
    state: "State Not Available",
    registrationDate: "15/12/2025, 09:30:12 PM",
    stage: "Warm",
  },
  {
    id: "lead-3",
    name: "Daniel",
    email: "*****************@gmail.com",
    mobile: "+225********46",
    state: "State Not Available",
    registrationDate: "12/12/2025, 04:55:04 PM",
    stage: "Warm",
  },
  {
    id: "lead-4",
    name: "Tony",
    email: "*********@yahoo.com",
    mobile: "+233********83",
    state: "State Not Available",
    registrationDate: "10/12/2025, 04:10:10 PM",
    stage: "Duplicate Lead",
  },
  {
    id: "lead-5",
    name: "Gertrude",
    email: "****************@gmail.com",
    mobile: "+231********02",
    state: "State Not Available",
    registrationDate: "10/12/2025, 12:37:31 PM",
    stage: "Cold",
  },
  {
    id: "lead-6",
    name: "Vassilisa Israel",
    email: "**************@gmail.com",
    mobile: "+255*******36",
    state: "State Not Available",
    registrationDate: "10/12/2025, 12:48:07 AM",
    stage: "Warm",
  },
  {
    id: "lead-7",
    name: "Philemon",
    email: "*******************@gmail.com",
    mobile: "+264********32",
    state: "State Not Available",
    registrationDate: "10/12/2025, 12:06:51 AM",
    stage: "Offer letter sent",
  },
  {
    id: "lead-8",
    name: "Surjo",
    email: "***************@gmail.com",
    mobile: "+880********36",
    state: "State Not Available",
    registrationDate: "09/12/2025, 11:32:29 PM",
    stage: "Warm",
  },
  {
    id: "lead-9",
    name: "Jackson yer",
    email: "***********@gmail.com",
    mobile: "+675*******98",
    state: "State Not Available",
    registrationDate: "09/12/2025, 07:18:32 PM",
    stage: "Shared with Agent",
  },
  {
    id: "lead-10",
    name: "Simon",
    email: "*************@gmail.com",
    mobile: "+231********24",
    state: "State Not Available",
    registrationDate: "09/12/2025, 04:45:34 PM",
    stage: "Cold",
  },
]

export default function LeadsPage() {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [leadReferences, setLeadReferences] = useState<Record<string, LeadStickinessReference>>({})

  useEffect(() => {
    // Load stickiness references from storage
    const references = getLeadStickinessReferences()
    console.log("[v0] Loaded stickiness references:", references)
    setLeadReferences(references)
  }, [])

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]))
  }

  const toggleAllLeads = () => {
    if (selectedLeads.length === sampleLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(sampleLeads.map((lead) => lead.id))
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavHeader />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold">Lead Manager</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Quick View:</span>
                  <Select defaultValue="system-default">
                    <SelectTrigger className="w-[200px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system-default">System Default View</SelectItem>
                      <SelectItem value="my-leads">My Leads</SelectItem>
                      <SelectItem value="recent-leads">Recent Leads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Select>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="User Registration Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Lead Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="duplicate">Duplicate Lead</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Lead Owner / Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="team-1">Team 1</SelectItem>
                  <SelectItem value="team-2">Team 2</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Campaign Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="link" size="sm" className="ml-auto text-blue-600">
                <Filter className="w-4 h-4 mr-1" />
                Advanced Filter
              </Button>
            </div>

            {/* Table */}
            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedLeads.length === sampleLeads.length}
                        onCheckedChange={toggleAllLeads}
                      />
                    </TableHead>
                    <TableHead>Registered Name</TableHead>
                    <TableHead>Registered Email</TableHead>
                    <TableHead>Registered Mobile</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>User Registration Date</TableHead>
                    <TableHead>Lead Stage</TableHead>
                    <TableHead>Opportunity Stickiness Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleLeads.map((lead) => {
                    const stickinessRef = leadReferences[lead.id]

                    return (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedLeads.includes(lead.id)}
                            onCheckedChange={() => toggleLeadSelection(lead.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-blue-600">{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.mobile}</TableCell>
                        <TableCell className="text-muted-foreground">{lead.state}</TableCell>
                        <TableCell>{lead.registrationDate}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                              lead.stage === "Warm"
                                ? "bg-orange-100 text-orange-700"
                                : lead.stage === "Cold"
                                  ? "bg-blue-100 text-blue-700"
                                  : lead.stage === "Closed"
                                    ? "bg-gray-100 text-gray-700"
                                    : lead.stage === "Duplicate Lead"
                                      ? "bg-purple-100 text-purple-700"
                                      : lead.stage === "Offer letter sent"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-cyan-100 text-cyan-700"
                            }`}
                          >
                            {lead.stage}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {stickinessRef && Object.keys(stickinessRef).length > 0 ? (
                            <div className="space-y-1">
                              {Object.entries(stickinessRef).map(([listName, fieldValues]) => (
                                <div key={listName} className="space-y-0.5">
                                  {Object.entries(fieldValues).map(([fieldValue, oppId]) => (
                                    <div key={`${listName}-${fieldValue}`} className="text-xs">
                                      <span className="font-medium">{listName}</span> ({fieldValue}):{" "}
                                      {oppId ? `Opp #${oppId}` : "-"}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t">
                <Button variant="outline" size="sm">
                  Show More Leads
                </Button>

                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    Show Total Records
                  </Button>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Show Rows</span>
                    <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                      <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
