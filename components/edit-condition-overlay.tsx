"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X, Plus } from "lucide-react"

interface Condition {
  id: string
  field: string
  operator: string
  value: string
}

interface EditConditionOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSave: (conditions: Condition[], matchType: "all" | "any") => void
  existingConditions?: Condition[]
  existingMatchType?: "all" | "any"
}

const LEAD_FIELDS = [
  { value: "name", label: "Lead Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "source", label: "Lead Source" },
  { value: "status", label: "Status" },
  { value: "score", label: "Lead Score" },
  { value: "city", label: "City" },
  { value: "country", label: "Country" },
]

const OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "not-equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "not-contains", label: "Does Not Contain" },
  { value: "is-empty", label: "Is Empty" },
  { value: "is-not-empty", label: "Is Not Empty" },
]

export function EditConditionOverlay({
  isOpen,
  onClose,
  onSave,
  existingConditions = [],
  existingMatchType = "all",
}: EditConditionOverlayProps) {
  const [matchType, setMatchType] = useState<"all" | "any">(existingMatchType)
  const [conditions, setConditions] = useState<Condition[]>(existingConditions.length > 0 ? existingConditions : [])
  const [currentField, setCurrentField] = useState("")
  const [currentOperator, setCurrentOperator] = useState("")
  const [currentValue, setCurrentValue] = useState("")

  useEffect(() => {
    if (isOpen) {
      console.log("[v0] EditConditionOverlay opened with conditions:", existingConditions)
      setMatchType(existingMatchType)
      setConditions(existingConditions.length > 0 ? existingConditions : [])
    }
  }, [isOpen, existingConditions, existingMatchType])

  const handleAddCondition = () => {
    if (!currentField || !currentOperator) return
    if (!["is-empty", "is-not-empty"].includes(currentOperator) && !currentValue) return

    const newCondition: Condition = {
      id: `cond_${Date.now()}`,
      field: currentField,
      operator: currentOperator,
      value: currentValue,
    }

    setConditions([...conditions, newCondition])
    setCurrentField("")
    setCurrentOperator("")
    setCurrentValue("")
  }

  const handleRemoveCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const handleSave = () => {
    console.log("[v0] EditConditionOverlay handleSave called")

    let finalConditions = [...conditions]

    // If user has filled in a condition but hasn't clicked Plus, add it automatically
    if (currentField && currentOperator) {
      const needsValueForCurrent = !["is-empty", "is-not-empty"].includes(currentOperator)
      if (!needsValueForCurrent || currentValue) {
        const newCondition: Condition = {
          id: `cond_${Date.now()}`,
          field: currentField,
          operator: currentOperator,
          value: currentValue,
        }
        finalConditions = [...finalConditions, newCondition]
      }
    }

    console.log("[v0] Conditions to save:", finalConditions)
    console.log("[v0] Match type:", matchType)
    onSave(finalConditions, matchType)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen) return null

  const needsValue = currentOperator && !["is-empty", "is-not-empty"].includes(currentOperator)

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="fixed inset-0 bg-black/40" onClick={handleCancel} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Edit Condition</h2>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Edit Conditions</h3>
            <p className="text-sm text-muted-foreground">Define which records match this rule.</p>
          </div>

          <div className="space-y-3">
            <Label className="font-medium">Match</Label>
            <RadioGroup value={matchType} onValueChange={(v) => setMatchType(v as "all" | "any")}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-criteria" />
                  <Label htmlFor="all-criteria" className="font-normal cursor-pointer">
                    All conditions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="any-criteria" />
                  <Label htmlFor="any-criteria" className="font-normal cursor-pointer">
                    Any condition
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Condition Builder */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-sm">Select Field</Label>
                <Select value={currentField} onValueChange={setCurrentField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent className="z-[120]">
                    {LEAD_FIELDS.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-sm">Select Operator</Label>
                <Select value={currentOperator} onValueChange={setCurrentOperator}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent className="z-[120]">
                    {OPERATORS.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-sm">Select Value</Label>
                <Input
                  placeholder="Enter value"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  disabled={!needsValue}
                />
              </div>
              <Button size="icon" onClick={handleAddCondition} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Conditions List */}
            {conditions.length > 0 && (
              <div className="space-y-2 pt-2">
                <Label className="text-sm font-medium">Conditions:</Label>
                {conditions.map((condition) => {
                  const fieldLabel = LEAD_FIELDS.find((f) => f.value === condition.field)?.label || condition.field
                  const operatorLabel =
                    OPERATORS.find((o) => o.value === condition.operator)?.label || condition.operator
                  return (
                    <div key={condition.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">
                        {fieldLabel} {operatorLabel} {condition.value && `"${condition.value}"`}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCondition(condition.id)}
                        className="text-red-600 hover:text-red-700 h-7 px-2"
                      >
                        Remove
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Condition
          </Button>
        </div>
      </div>
    </div>
  )
}
