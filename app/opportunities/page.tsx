"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOpportunityLists } from "@/lib/opportunity-store"
import { addOpportunity, getOpportunities, type Opportunity } from "@/lib/stickiness-store"

export default function OpportunitiesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedListId, setSelectedListId] = useState("")
  const [leadId, setLeadId] = useState("")
  const [leadName, setLeadName] = useState("")
  const [owner, setOwner] = useState("")
  const [examCategory, setExamCategory] = useState("")
  const [courseId, setCourseId] = useState("")
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])

  const opportunityLists = getOpportunityLists().filter((list) => list.status === "Active")

  useEffect(() => {
    const existingOpportunities = getOpportunities()
    setOpportunities(existingOpportunities)
  }, [])

  const handleCreateOpportunity = () => {
    if (!selectedListId || !leadId || !leadName || !owner || !examCategory || !courseId) {
      alert("Please fill in all fields")
      return
    }

    const selectedList = opportunityLists.find((list) => list.id === selectedListId)
    if (!selectedList) return

    const newOpportunity: Opportunity = {
      id: `OPP-${Date.now()}`,
      listId: selectedListId,
      listName: selectedList.title,
      leadId,
      leadName,
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
      owner,
      fieldValues: {
        "Exam Category": examCategory,
        "Course ID": courseId,
      },
    }

    addOpportunity(newOpportunity)

    setOpportunities(getOpportunities())

    setSelectedListId("")
    setLeadId("")
    setLeadName("")
    setOwner("")
    setExamCategory("")
    setCourseId("")
    setIsDialogOpen(false)

    alert(
      `Opportunity created successfully! ID: ${newOpportunity.id}\n\nStickiness references have been updated for ${examCategory}.`,
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavHeader />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Manage Opportunities</h1>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Opportunity</DialogTitle>
                  <DialogDescription>
                    Stickiness references will be automatically updated based on the Exam Category value.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="list">Opportunity List</Label>
                    <Select value={selectedListId} onValueChange={setSelectedListId}>
                      <SelectTrigger id="list">
                        <SelectValue placeholder="Select opportunity list" />
                      </SelectTrigger>
                      <SelectContent>
                        {opportunityLists.map((list) => (
                          <SelectItem key={list.id} value={list.id}>
                            {list.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leadId">Lead ID</Label>
                    <Input
                      id="leadId"
                      placeholder="e.g., lead-1"
                      value={leadId}
                      onChange={(e) => setLeadId(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leadName">Lead Name</Label>
                    <Input
                      id="leadName"
                      placeholder="e.g., John Doe"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner</Label>
                    <Input
                      id="owner"
                      placeholder="e.g., Sales Team A"
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examCategory">Exam Category</Label>
                    <Select value={examCategory} onValueChange={setExamCategory}>
                      <SelectTrigger id="examCategory">
                        <SelectValue placeholder="Select exam category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPSC">UPSC</SelectItem>
                        <SelectItem value="PSC">PSC</SelectItem>
                        <SelectItem value="Banking">Banking</SelectItem>
                        <SelectItem value="Railway">Railway</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseId">Course ID</Label>
                    <Input
                      id="courseId"
                      placeholder="e.g., 123"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateOpportunity}>Create Opportunity</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {opportunities.length > 0 ? (
            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Opportunity ID</TableHead>
                    <TableHead>List Name</TableHead>
                    <TableHead>Lead Name</TableHead>
                    <TableHead>Exam Category</TableHead>
                    <TableHead>Course ID</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell className="font-medium text-blue-600">{opp.id}</TableCell>
                      <TableCell>{opp.listName}</TableCell>
                      <TableCell>{opp.leadName}</TableCell>
                      <TableCell className="font-medium">{opp.fieldValues["Exam Category"] || "-"}</TableCell>
                      <TableCell>{opp.fieldValues["Course ID"] || "-"}</TableCell>
                      <TableCell>{opp.owner}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(opp.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 border rounded-lg bg-card">
              <p className="text-lg">No opportunities created yet</p>
              <p className="text-sm mt-2">Create opportunities to test the stickiness reference system</p>
              <p className="text-sm mt-1">
                Stickiness references are automatically calculated based on your configured rules
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
