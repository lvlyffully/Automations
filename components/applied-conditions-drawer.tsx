"use client"

import { X, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Condition {
  id: string
  module: string
  subModule?: string
  field: string
  operator: string
  value?: string
}

interface AppliedConditionsDrawerProps {
  isOpen: boolean
  onClose: () => void
  pathName: string
  conditions: Condition[]
  logic: "all" | "any"
  isElsePath?: boolean
}

export function AppliedConditionsDrawer({
  isOpen,
  onClose,
  pathName,
  conditions,
  logic,
  isElsePath = false,
}: AppliedConditionsDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[500px] bg-background shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Applied Conditions for {pathName}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-8 w-8">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {isElsePath ? (
            <div className="bg-info/10 border border-info/30 rounded-lg p-6">
              <h3 className="text-base font-semibold text-info-foreground mb-2">Else Path</h3>
              <p className="text-sm text-info-foreground/80">
                This is the default path that executes when none of the conditions from Path 1, Path 2, Path 3, Path 4,
                Path 5, or Path 6 are met. No specific conditions are required for this path.
              </p>
            </div>
          ) : (
            <>
              {/* ALL/ANY Toggle */}
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant={logic === "all" ? "default" : "outline"}
                  size="sm"
                  className={logic === "all" ? "bg-primary hover:bg-primary/90" : ""}
                >
                  ALL
                </Button>
                <Button variant={logic === "any" ? "default" : "outline"} size="sm">
                  ANY
                </Button>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6">
                {logic === "all"
                  ? "Every condition must match — AND logic is applied to all conditions."
                  : "At least one condition must match — OR logic is applied to all conditions."}
              </p>

              {/* Conditions */}
              <div className="space-y-4">
                {conditions.map((condition, index) => (
                  <div key={condition.id}>
                    {/* Condition Pill */}
                    <div className="bg-muted border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                          {/* Module - bg-blue-100 text-blue-700 -> bg-primary/10 text-primary */}
                          <span className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                            {condition.module}
                          </span>

                          <span className="text-muted-foreground">→</span>

                          {/* Sub-module (if exists) - bg-purple-100 text-purple-700 -> bg-accent text-accent-foreground */}
                          {condition.subModule && (
                            <>
                              <span className="inline-flex items-center px-3 py-1 rounded-md bg-accent text-accent-foreground text-sm font-medium">
                                {condition.subModule}
                              </span>
                              <span className="text-muted-foreground">→</span>
                            </>
                          )}

                          {/* Field - bg-gray-200 text-gray-700 -> bg-secondary text-secondary-foreground */}
                          <span className="inline-flex items-center px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm">
                            <span className="mr-1">≡</span> {condition.field}
                          </span>

                          <span className="text-muted-foreground">→</span>

                          {/* Operator */}
                          <span className="inline-flex items-center px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm font-medium">
                            {condition.operator}
                          </span>

                          {/* Value (if exists) - bg-green-100 text-green-700 -> bg-success/10 text-success-foreground */}
                          {condition.value && (
                            <>
                              <span className="text-muted-foreground">→</span>
                              <span className="inline-flex items-center px-3 py-1 rounded-md bg-success/10 text-success-foreground text-sm font-medium">
                                {condition.value}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* AND separator - text-blue-600 -> text-primary */}
                    {index < conditions.length - 1 && logic === "all" && (
                      <div className="flex justify-center my-3">
                        <span className="text-primary font-semibold text-sm">AND</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
