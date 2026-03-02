"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react"
import { NavHeader } from "@/components/nav-header"

interface AutomationListProps {
  onCreateClick: () => void
  onFieldUpdateClick: () => void
  onViewPerformance: (automationName: string, parentList: string) => void
  onAllocationQuotaClick: () => void
}

export function AutomationList({
  onCreateClick,
  onFieldUpdateClick,
  onViewPerformance,
  onAllocationQuotaClick,
}: AutomationListProps) {
  const [activeTab, setActiveTab] = useState("active")

  const automations = [
    {
      id: "50219",
      name: "Automation 1754892341",
      parentList: "Lms",
      createdOn: "11/08/2025 11:35 AM",
      createdBy: "System (Tanish nagpal)",
      status: "Active",
      startDate: "11/08/2025 11:36 AM",
      endDate: "18/08/2025 11:36 AM",
      tags: "",
      hasFieldUpdate: true,
    },
    {
      id: "50217",
      name: "Automation 1754892048",
      parentList: "Lms",
      createdOn: "11/08/2025 11:30 AM",
      createdBy: "System (Tanish nagpal)",
      status: "Active",
      startDate: "11/08/2025 11:31 AM",
      endDate: "18/08/2025 11:31 AM",
      tags: "",
      hasFieldUpdate: false,
    },
    {
      id: "50215",
      name: "Automation 1754890178",
      parentList: "Lms",
      createdOn: "11/08/2025 10:59 AM",
      createdBy: "System (Tanish nagpal)",
      status: "Active",
      startDate: "11/08/2025 11:21 AM",
      endDate: "18/08/2025 11:21 AM",
      tags: "",
      hasFieldUpdate: true,
    },
    {
      id: "50181",
      name: "Testing Dates",
      parentList: "Opportunity",
      createdOn: "07/08/2025 11:29 AM",
      createdBy: "System (Parul Verma)",
      status: "Active",
      startDate: "07/08/2025 11:35 AM",
      endDate: "31/08/2025 11:35 AM",
      tags: "",
      hasFieldUpdate: false,
    },
    {
      id: "50118",
      name: "Automation 1754293211",
      parentList: "Opportunity",
      createdOn: "04/08/2025 01:10 PM",
      createdBy: "System (Tanish nagpal)",
      status: "Active",
      startDate: "04/08/2025 01:10 PM",
      endDate: "18/08/2025 01:10 PM",
      tags: "",
      hasFieldUpdate: true,
    },
    {
      id: "50220",
      name: "Application Review Automation",
      parentList: "Application",
      createdOn: "12/08/2025 02:15 PM",
      createdBy: "System (Tanish nagpal)",
      status: "Active",
      startDate: "12/08/2025 02:20 PM",
      endDate: "26/08/2025 02:20 PM",
      tags: "",
      hasFieldUpdate: true,
    },
    {
      id: "50221",
      name: "Application Follow-up",
      parentList: "Application",
      createdOn: "12/08/2025 03:45 PM",
      createdBy: "System (Parul Verma)",
      status: "Active",
      startDate: "12/08/2025 04:00 PM",
      endDate: "30/08/2025 04:00 PM",
      tags: "",
      hasFieldUpdate: false,
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <NavHeader />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold">Manage Automation List</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground text-xs">ℹ</span>
              </span>
              <span>Total Automation - 1336/1562</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
            <Button onClick={onCreateClick} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
            <TabsTrigger value="active" className="data-[state=active]:bg-white">
              Active (11)
            </TabsTrigger>
            <TabsTrigger value="draft" className="data-[state=active]:bg-white">
              Draft (409)
            </TabsTrigger>
            <TabsTrigger value="pause" className="data-[state=active]:bg-white">
              Pause (192)
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white">
              Completed (438)
            </TabsTrigger>
            <TabsTrigger value="stopped" className="data-[state=active]:bg-white">
              Stopped (286)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Automation List Name</TableHead>
                    <TableHead>Parent List</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automations.map((automation) => (
                    <TableRow key={automation.id}>
                      <TableCell className="font-medium">{automation.id}</TableCell>
                      <TableCell>
                        <span className="text-primary hover:underline cursor-pointer">{automation.name}</span>
                        {automation.hasFieldUpdate && (
                          <div className="mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={onFieldUpdateClick}
                              className="text-xs text-primary hover:text-primary/80 p-0 h-auto font-normal"
                            >
                              Field Update
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{automation.parentList}</TableCell>
                      <TableCell>{automation.createdOn}</TableCell>
                      <TableCell>{automation.createdBy}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-chart-2 text-foreground">
                          {automation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{automation.startDate}</TableCell>
                      <TableCell>{automation.endDate}</TableCell>
                      <TableCell>{automation.tags}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewPerformance(automation.name, automation.parentList)}>
                              View Performance
                            </DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="p-4 border-t">
                <Button variant="outline" size="sm">
                  📄 Load More Lists
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
