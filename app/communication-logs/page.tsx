"use client"

import { Sidebar } from "@/components/sidebar"
import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, Calendar } from "lucide-react"

export default function CommunicationLogsPage() {
  const sampleLogs = [
    {
      id: "LOG-1001",
      leadName: "bnjhphtj",
      leadEmail: "**********@gmail.com",
      communicationType: "Email",
      template: "Welcome Email",
      status: "Delivered",
      sentBy: "System",
      sentDate: "16/12/2025, 11:45 AM",
      openedDate: "16/12/2025, 12:30 PM",
    },
    {
      id: "LOG-1002",
      leadName: "Bethel",
      leadEmail: "*************@gmail.com",
      communicationType: "SMS",
      template: "Follow-up SMS",
      status: "Delivered",
      sentBy: "Ashish Jha",
      sentDate: "15/12/2025, 09:35 AM",
      openedDate: "-",
    },
    {
      id: "LOG-1003",
      leadName: "Daniel",
      leadEmail: "******************@gmail.com",
      communicationType: "Email",
      template: "Course Information",
      status: "Opened",
      sentBy: "System",
      sentDate: "12/12/2025, 05:00 PM",
      openedDate: "12/12/2025, 05:45 PM",
    },
    {
      id: "LOG-1004",
      leadName: "Tony",
      leadEmail: "*********@yahoo.com",
      communicationType: "WhatsApp",
      template: "Exam Notification",
      status: "Failed",
      sentBy: "Varun Singh",
      sentDate: "10/12/2025, 04:15 PM",
      openedDate: "-",
    },
    {
      id: "LOG-1005",
      leadName: "Gertrude",
      leadEmail: "******************@gmail.com",
      communicationType: "Email",
      template: "Application Reminder",
      status: "Bounced",
      sentBy: "System",
      sentDate: "10/12/2025, 12:40 PM",
      openedDate: "-",
    },
  ]

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
              <div>
                <h1 className="text-3xl font-bold text-foreground">Communication Logs</h1>
                <p className="text-muted-foreground mt-1">Track and monitor all communication sent to leads</p>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>

            {/* Filters */}
            <div className="bg-card border rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search leads..." className="pl-10" />
                </div>

                <Select defaultValue="all-types">
                  <SelectTrigger>
                    <SelectValue placeholder="Communication Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-status">
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="opened">Opened</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input type="date" placeholder="From Date" className="pl-10" />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input type="date" placeholder="To Date" className="pl-10" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filter
                </Button>
                <Button variant="ghost" size="sm">
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Sent</div>
                <div className="text-2xl font-bold">1,247</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Delivered</div>
                <div className="text-2xl font-bold text-green-600">1,156</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Opened</div>
                <div className="text-2xl font-bold text-blue-600">892</div>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Failed/Bounced</div>
                <div className="text-2xl font-bold text-red-600">91</div>
              </div>
            </div>

            {/* Communication Logs Table */}
            <div className="bg-card border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Log ID</TableHead>
                    <TableHead>Lead Name</TableHead>
                    <TableHead>Lead Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent By</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Opened Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>
                        <span className="text-blue-600 hover:underline cursor-pointer">{log.leadName}</span>
                      </TableCell>
                      <TableCell>{log.leadEmail}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.communicationType === "Email"
                              ? "bg-blue-100 text-blue-700"
                              : log.communicationType === "SMS"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {log.communicationType}
                        </span>
                      </TableCell>
                      <TableCell>{log.template}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : log.status === "Opened"
                                ? "bg-blue-100 text-blue-700"
                                : log.status === "Failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell>{log.sentBy}</TableCell>
                      <TableCell>{log.sentDate}</TableCell>
                      <TableCell>{log.openedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">Showing 1-5 of 1,247 logs</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
