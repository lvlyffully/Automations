"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ActivityDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  fields: Array<{ name: string; oldValue: string; newValue: string }>
}

export function ActivityDetailDrawer({ isOpen, onClose, fields }: ActivityDetailDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-1/2 bg-background border-l shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Field Update Activity</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The following fields were updated by Mio AI based on the call conversation:
            </p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {field.oldValue || <span className="italic">Empty</span>}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">{field.newValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
