"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Info, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type FormulaToken = {
  type: "field" | "text"
  value: string
  id: string
}

interface FieldMapping {
  id: string
  sourceField: string
  operator: string
  targetField: string
  capturedOn: string
  validationError?: string
  formulaTokens?: FormulaToken[]
}

interface FieldUpdateDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

const fieldTypes: Record<string, string> = {
  OL1_Field_Date_Time_1: "Date/Time",
  OL1_Field_Date_Time_2: "Date/Time",
  OL1_Field_Text_1: "Text",
  OL1_Field_Text_2: "Text",
  OL1_Field_Drop_1: "Dropdown",
  OL1_Field_Drop_2: "Dropdown",
  OL1_Field_Numeric_1: "Numeric",
  OL1_Field_Numeric_2: "Numeric",
  OL2_Field_Date_Time_1: "Date/Time",
  OL2_Field_Date_Time_2: "Date/Time",
  OL2_Field_Text_1: "Text",
  OL2_Field_Text_2: "Text",
  OL2_Field_Drop_1: "Dropdown",
  OL2_Field_Drop_2: "Dropdown",
  OL2_Field_Numeric_1: "Numeric",
  OL2_Field_Numeric_2: "Numeric",
  OL3_Field_Date_Time_1: "Date/Time",
  OL3_Field_Date_Time_2: "Date/Time",
  OL3_Field_Text_1: "Text",
  OL3_Field_Text_2: "Text",
  OL3_Field_Drop_1: "Dropdown",
  OL3_Field_Drop_2: "Dropdown",
  OL3_Field_Numeric_1: "Numeric",
  OL3_Field_Numeric_2: "Numeric",
  OL4_Field_Date_Time_1: "Date/Time",
  OL4_Field_Date_Time_2: "Date/Time",
  OL4_Field_Text_1: "Text",
  OL4_Field_Text_2: "Text",
  OL4_Field_Drop_1: "Dropdown",
  OL4_Field_Drop_2: "Dropdown",
  OL4_Field_Numeric_1: "Numeric",
  OL4_Field_Numeric_2: "Numeric",
}

const leadFieldTypes: Record<string, string> = {
  Lead_Field_Date_Time_1: "Date/Time",
  Lead_Field_Date_Time_2: "Date/Time",
  Lead_Field_Text_1: "Text",
  Lead_Field_Text_2: "Text",
  Lead_Field_Drop_1: "Dropdown",
  Lead_Field_Drop_2: "Dropdown",
  Lead_Field_Numeric_1: "Numeric",
  Lead_Field_Numeric_2: "Numeric",
}

const formulaTokensToString = (tokens: FormulaToken[]): string => {
  return tokens.map((token) => (token.type === "field" ? `@${token.value}` : token.value)).join("")
}

const validateFormula = (
  formula: string,
  availableFields: string[],
  isDateField: boolean,
): { isValid: boolean; error: string } => {
  if (!formula.trim()) {
    return { isValid: false, error: "Formula cannot be empty" }
  }

  // Check for mismatched parentheses
  let openParens = 0
  for (const char of formula) {
    if (char === "(") openParens++
    if (char === ")") openParens--
    if (openParens < 0) {
      return { isValid: false, error: "Mismatched parentheses: closing ')' without opening '('" }
    }
  }
  if (openParens > 0) {
    return { isValid: false, error: "Mismatched parentheses: unclosed '('" }
  }

  // Extract field tokens - match @ followed by letters, numbers, underscores, and spaces
  // Stop at operators, parentheses, or end of string
  const fieldTokenRegex = /@([A-Za-z0-9_][A-Za-z0-9_\s]*?)(?=\s*[+\-*/()]|$)/g
  const fieldTokens = [...formula.matchAll(fieldTokenRegex)].map((match) => match[1].trim())

  // Validate field tokens exist
  for (const token of fieldTokens) {
    // Replace spaces with underscores for comparison (e.g., "Automation Execution Time" -> "Automation_Execution_Time")
    const normalizedToken = token.replace(/\s+/g, "_")
    const normalizedFields = availableFields.map((f) => f.replace(/\s+/g, "_"))

    if (!normalizedFields.includes(normalizedToken) && normalizedToken !== "Automation_Execution_Time") {
      return { isValid: false, error: `Field '@${token}' does not exist` }
    }
  }

  // Check for invalid operator sequences
  const invalidSequences = ["++", "--", "**", "//", "+-", "-+", "*+", "/+", "+*", "+/", "-*", "-/", "*/", "/*"]
  for (const seq of invalidSequences) {
    if (formula.includes(seq)) {
      return { isValid: false, error: `Invalid operator sequence: '${seq}'` }
    }
  }

  // Check for division by zero (explicit)
  if (/\/\s*0(?!\d)/.test(formula)) {
    return { isValid: false, error: "Division by zero detected" }
  }

  // For date fields, check only + and - are used
  if (isDateField) {
    if (formula.includes("*") || formula.includes("/")) {
      return { isValid: false, error: "Date fields only support + and - operations" }
    }
  }

  // Count values and operators
  const operators = formula.match(/[+\-*/]/g) || []
  const numbers = formula.match(/\b\d+\.?\d*\b/g) || []
  const totalValues = fieldTokens.length + numbers.length

  if (totalValues > 10) {
    return { isValid: false, error: "Maximum 10 values (fields + numbers) allowed" }
  }

  if (operators.length > 8) {
    return { isValid: false, error: "Maximum 8 operators allowed" }
  }

  // Check operators have values on both sides (basic check)
  const operatorRegex = /[+\-*/]/g
  let match
  while ((match = operatorRegex.exec(formula)) !== null) {
    const index = match.index
    const before = formula.substring(0, index).trim()
    const after = formula.substring(index + 1).trim()

    // Check if there's something before (allow unary minus at start or after opening paren)
    if (before.length === 0 || before.endsWith("(")) {
      if (match[0] !== "-") {
        return { isValid: false, error: `Operator '${match[0]}' at position ${index + 1} is missing left operand` }
      }
    }

    // Check if there's something after
    if (after.length === 0 || after.startsWith(")")) {
      return { isValid: false, error: `Operator '${match[0]}' at position ${index + 1} is missing right operand` }
    }
  }

  return { isValid: true, error: "" }
}

const getFieldsForMention = (fieldType: string, fieldUpdateType: string): string[] => {
  // Determine which field set to use based on Field Update Type
  // For "Lead to Opportunity" and "Lead to Lead", source is Lead fields
  // For "Opportunity to Lead" and "Opportunity to Opportunity", source is Opportunity fields
  const useLeadFields = fieldUpdateType === "Lead to Opportunity" || fieldUpdateType === "Lead to Lead"
  const sourceFieldTypes = useLeadFields ? leadFieldTypes : fieldTypes

  // Filter fields by type
  const fields = Object.keys(sourceFieldTypes).filter((field) => sourceFieldTypes[field] === fieldType)

  // Add "Automation Execution Time" for Date/Time fields
  if (fieldType === "Date/Time") {
    return ["Automation Execution Time", ...fields]
  }

  return fields
}

export function FieldUpdateDrawer({ isOpen, onClose, onSave }: FieldUpdateDrawerProps) {
  const [blockName, setBlockName] = useState("")
  const [fieldUpdateType, setFieldUpdateType] = useState("Lead to Opportunity")
  const [selectedOpportunityList, setSelectedOpportunityList] = useState("OL List 1")
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    {
      id: "1",
      sourceField: "OL1_Field_Date_Time_1",
      operator: "",
      targetField: "Lead_Field_Date_Time_1",
      capturedOn: "Captured On",
    },
  ])

  const [expandedFormulaId, setExpandedFormulaId] = useState<string | null>(null)

  const [mentionState, setMentionState] = useState<{
    isOpen: boolean
    mappingId: string
    position: { top: number; left: number }
    searchTerm: string
  }>({
    isOpen: false,
    mappingId: "",
    position: { top: 0, left: 0 },
    searchTerm: "",
  })
  const inputRefs = useRef<Record<string, HTMLInputElement>>({})
  const chipContainerRefs = useRef<Record<string, HTMLDivElement>>({})
  const mentionDropdownRef = useRef<HTMLDivElement>(null)

  const getHelpText = (updateType: string) => {
    switch (updateType) {
      case "Lead to Opportunity":
        return "You are trying to update Opportunity Fields from Lead Fields or Static Values"
      case "Lead to Lead":
        return "You are trying to update Lead Fields from Static Values"
      case "Opportunity to Lead":
        return "You are trying to update Lead Fields from Opportunity Fields or Static Values"
      case "Opportunity to Opportunity":
        return "You are trying to update Opportunity Fields from Static Values"
      default:
        return "You are trying to update Opportunity Fields from Lead Fields or Static Values"
    }
  }

  const addFieldMapping = () => {
    setExpandedFormulaId(null)

    const newMapping: FieldMapping = {
      id: Date.now().toString(),
      sourceField: "",
      operator: "",
      targetField: "",
      capturedOn: "",
      formulaTokens: [],
    }
    setFieldMappings([...fieldMappings, newMapping])
  }

  const updateFieldMapping = (id: string, field: keyof FieldMapping, value: string) => {
    console.log("[v0] Updating field mapping:", { id, field, value })
    setFieldMappings(fieldMappings.map((mapping) => (mapping.id === id ? { ...mapping, [field]: value } : mapping)))
  }

  const updateMultipleFields = (id: string, updates: Partial<FieldMapping>) => {
    console.log("[v0] Updating multiple fields:", { id, updates })
    setFieldMappings(fieldMappings.map((mapping) => (mapping.id === id ? { ...mapping, ...updates } : mapping)))
  }

  const getOperatorOptions = (targetField: string) => {
    const fieldType =
      fieldUpdateType === "Lead to Lead" || fieldUpdateType === "Opportunity to Lead"
        ? leadFieldTypes[targetField]
        : fieldTypes[targetField]

    console.log("[v0] Getting operator options for target field:", { targetField, fieldType })
    if (!fieldType) return []

    const options = [`Set ${fieldType}`]

    // Add Set Calculations for Numeric and Date/Time fields
    if (fieldType === "Numeric" || fieldType === "Date/Time") {
      options.push("Set Calculations")
    }

    if (
      fieldType !== "Dropdown" &&
      (fieldUpdateType === "Lead to Opportunity" || fieldUpdateType === "Opportunity to Lead")
    ) {
      options.push("Set Field Token")
    }

    console.log("[v0] Generated operator options:", options)
    return options
  }

  const getFieldsForOpportunityList = (listName: string) => {
    const listNumber = listName.replace("OL List ", "")
    return Object.keys(fieldTypes).filter((field) => field.startsWith(`OL${listNumber}_`))
  }

  const getLeadFieldOptions = () => {
    return Object.keys(leadFieldTypes)
  }

  const getFilteredLeadFieldOptions = (sourceField: string) => {
    const sourceFieldType = fieldTypes[sourceField]
    if (!sourceFieldType) return []

    return Object.keys(leadFieldTypes).filter((leadField) => leadFieldTypes[leadField] === sourceFieldType)
  }

  const getRightSideOptions = (operator: string, targetField: string) => {
    if (operator === "Set Field Token") {
      switch (fieldUpdateType) {
        case "Lead to Opportunity":
          return Object.keys(leadFieldTypes)
        case "Opportunity to Lead":
          return getFieldsForOpportunityList(selectedOpportunityList)
        default:
          return []
      }
    }
    return []
  }

  const getRightSidePlaceholder = (operator: string) => {
    if (!operator) return "Select operator first"
    if (operator === "Set Field Token") {
      switch (fieldUpdateType) {
        case "Lead to Opportunity":
          return "Select Lead Field"
        case "Opportunity to Lead":
          return "Select Opportunity Field"
        default:
          return "Select Field"
      }
    }
    return `Enter ${operator.replace("Set ", "").toLowerCase()} value`
  }

  const renderRightSideInput = (mapping: FieldMapping) => {
    console.log("[v0] Rendering right side input for mapping:", {
      id: mapping.id,
      operator: mapping.operator,
      sourceField: mapping.sourceField,
    })

    if (!mapping.operator) {
      return (
        <div className="flex-1 px-3 py-2 text-sm text-gray-400 bg-gray-50 border rounded-md">Select operator first</div>
      )
    }

    if (mapping.operator === "Set Field Token") {
      console.log(
        "[v0] Rendering field token dropdown with options:",
        getRightSideOptions(mapping.operator, mapping.targetField),
      )
      return (
        <Select
          value={mapping.sourceField}
          onValueChange={(value) => {
            console.log("[v0] Field token selected:", { mappingId: mapping.id, value })
            updateFieldMapping(mapping.id, "sourceField", value)
          }}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={getRightSidePlaceholder(mapping.operator)} />
          </SelectTrigger>
          <SelectContent>
            {getRightSideOptions(mapping.operator, mapping.targetField).map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (mapping.operator === "Set Calculations") {
      // Determine if target field is Date/Time or Numeric
      const targetFieldType =
        fieldUpdateType === "Lead to Lead" || fieldUpdateType === "Opportunity to Lead"
          ? leadFieldTypes[mapping.targetField]
          : fieldTypes[mapping.targetField]

      const isDateField = targetFieldType === "Date/Time"
      const isExpanded = expandedFormulaId === mapping.id

      return (
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              {isExpanded ? (
                <div
                  ref={(el) => {
                    if (el) chipContainerRefs.current[mapping.id] = el
                  }}
                  className={`min-h-[40px] w-full px-3 py-2 border rounded-md flex flex-wrap items-center gap-1 cursor-text ${
                    mapping.validationError
                      ? "border-red-500 focus-within:ring-1 focus-within:ring-red-500"
                      : "focus-within:ring-1 focus-within:ring-blue-500"
                  }`}
                  onClick={() => {
                    const input = inputRefs.current[mapping.id]
                    if (input) input.focus()
                  }}
                >
                  {mapping.formulaTokens?.map((token) =>
                    token.type === "field" ? (
                      <Badge
                        key={token.id}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1 px-2 py-0.5"
                      >
                        <span className="text-xs">@{token.value}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFormulaToken(mapping.id, token.id)
                          }}
                          className="hover:bg-blue-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : (
                      <span key={token.id} className="text-sm">
                        {token.value}
                      </span>
                    ),
                  )}
                  <input
                    ref={(el) => {
                      if (el) inputRefs.current[mapping.id] = el
                    }}
                    type="text"
                    className="flex-1 min-w-[100px] outline-none bg-transparent text-sm"
                    placeholder={
                      !mapping.formulaTokens || mapping.formulaTokens.length === 0
                        ? isDateField
                          ? "Type @ to insert fields"
                          : "Type @ to insert fields or enter operators"
                        : ""
                    }
                    onFocus={() => setExpandedFormulaId(mapping.id)}
                    onBlur={() => {
                      // Delay collapse to allow clicking on mention dropdown
                      setTimeout(() => {
                        if (!mentionState.isOpen) {
                          setExpandedFormulaId(null)
                        }
                      }, 200)
                    }}
                    onKeyDown={(e) => {
                      handleFormulaKeyDown(mapping.id, e)
                    }}
                    onChange={(e) => {
                      handleFormulaTextChange(mapping.id, e.target.value)
                    }}
                  />
                </div>
              ) : (
                <div
                  className={`h-[40px] w-full px-3 py-2 border rounded-md flex items-center cursor-text ${
                    mapping.validationError ? "border-red-500" : "border-gray-300"
                  }`}
                  onClick={() => {
                    setExpandedFormulaId(mapping.id)
                    setTimeout(() => {
                      const inputElement = inputRefs.current[mapping.id]
                      if (inputElement) {
                        inputElement.value = ""
                        inputElement.focus()
                      }
                    }, 0)
                  }}
                >
                  <div className="overflow-hidden whitespace-nowrap text-ellipsis text-sm w-full max-w-full">
                    {mapping.sourceField || (
                      <span className="text-gray-400">
                        {isDateField ? "Type @ to insert fields" : "Type @ to insert fields or enter operators"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                  <Info className="h-4 w-4 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs z-[70]">
                <p className="text-sm">
                  {isDateField
                    ? "Enter static value or type @ to enter a field token. You can add operations like +, - to add or subtract whole number of days. Example: (@date_field + 5) adds 5 days."
                    : "Enter static value or type @ to enter a field token. You can add operations like +, -, *, /, (). Example: (@field1 + @field2) / (@field3 - 4)"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          {mapping.validationError && (
            <div className="flex items-start gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
              <span>{mapping.validationError}</span>
            </div>
          )}
        </div>
      )
    }

    if (mapping.operator === "Set Date/Time") {
      console.log("[v0] Rendering datetime input with value:", mapping.sourceField)
      return (
        <Input
          type="datetime-local"
          value={mapping.sourceField}
          onChange={(e) => {
            console.log("[v0] Datetime input changed:", { mappingId: mapping.id, value: e.target.value })
            updateFieldMapping(mapping.id, "sourceField", e.target.value)
          }}
          className="flex-1"
          placeholder="Select date and time"
        />
      )
    }

    if (mapping.operator === "Set Text") {
      console.log("[v0] Rendering text input with value:", mapping.sourceField)
      return (
        <Input
          type="text"
          value={mapping.sourceField}
          onChange={(e) => {
            console.log("[v0] Text input changed:", { mappingId: mapping.id, value: e.target.value })
            updateFieldMapping(mapping.id, "sourceField", e.target.value)
          }}
          className="flex-1"
          placeholder="Enter text value"
        />
      )
    }

    if (mapping.operator === "Set Numeric") {
      console.log("[v0] Rendering numeric input with value:", mapping.sourceField)
      return (
        <Input
          type="number"
          value={mapping.sourceField}
          onChange={(e) => {
            console.log("[v0] Numeric input changed:", { mappingId: mapping.id, value: e.target.value })
            updateFieldMapping(mapping.id, "sourceField", e.target.value)
          }}
          className="flex-1"
          placeholder="Enter numeric value"
        />
      )
    }

    if (mapping.operator === "Set Dropdown") {
      console.log("[v0] Rendering dropdown input with value:", mapping.sourceField)
      return (
        <Select
          value={mapping.sourceField}
          onValueChange={(value) => {
            console.log("[v0] Dropdown value selected:", { mappingId: mapping.id, value })
            updateFieldMapping(mapping.id, "sourceField", value)
          }}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select dropdown value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MD Value 1">MD Value 1</SelectItem>
            <SelectItem value="MD Value 2">MD Value 2</SelectItem>
            <SelectItem value="MD Value 3">MD Value 3</SelectItem>
            <SelectItem value="MD Value 4">MD Value 4</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    return null
  }

  const getSourceFieldOptions = () => {
    switch (fieldUpdateType) {
      case "Lead to Opportunity":
        // Source can be Lead Fields or static values (handled by operators)
        return Object.keys(leadFieldTypes)
      case "Lead to Lead":
        // Source is static values only (no field selection needed, handled by operators)
        return []
      case "Opportunity to Lead":
        // Source can be Opportunity Fields or static values (handled by operators)
        return getFieldsForOpportunityList(selectedOpportunityList)
      case "Opportunity to Opportunity":
        // Source is static values only (no field selection needed, handled by operators)
        return []
      default:
        return []
    }
  }

  const getTargetFieldOptions = () => {
    switch (fieldUpdateType) {
      case "Lead to Opportunity":
      case "Opportunity to Opportunity":
        // Target is Opportunity Fields
        return getFieldsForOpportunityList(selectedOpportunityList)
      case "Lead to Lead":
      case "Opportunity to Lead":
        // Target is Lead Fields
        return Object.keys(leadFieldTypes)
      default:
        return []
    }
  }

  const getTargetFieldHeaderText = () => {
    switch (fieldUpdateType) {
      case "Lead to Opportunity":
      case "Opportunity to Opportunity":
        return "Opportunity Fields"
      case "Lead to Lead":
      case "Opportunity to Lead":
        return "Lead Fields"
      default:
        return "Target Fields"
    }
  }

  const getSourceFieldHeaderText = () => {
    switch (fieldUpdateType) {
      case "Lead to Opportunity":
        return "Lead Fields or Static Values"
      case "Lead to Lead":
        return "Static Values"
      case "Opportunity to Lead":
        return "Opportunity Fields or Static Values"
      case "Opportunity to Opportunity":
        return "Static Values"
      default:
        return "Source Fields"
    }
  }

  const handleFormulaInput = (mappingId: string, value: string, cursorPosition: number) => {
    // Check if @ was just typed
    const textBeforeCursor = value.substring(0, cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf("@")

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1)
      // Check if there's no space after @ (we're still in mention mode)
      if (
        !textAfterAt.includes(" ") &&
        !textAfterAt.includes(")") &&
        !textAfterAt.includes("+") &&
        !textAfterAt.includes("-") &&
        !textAfterAt.includes("*") &&
        !textAfterAt.includes("/")
      ) {
        const inputElement = inputRefs.current[mappingId]
        if (inputElement) {
          const rect = inputElement.getBoundingClientRect()
          setMentionState({
            isOpen: true,
            mappingId,
            position: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },
            searchTerm: textAfterAt.toLowerCase(),
          })
        }
      } else {
        setMentionState((prev) => ({ ...prev, isOpen: false }))
      }
    } else {
      setMentionState((prev) => ({ ...prev, isOpen: false }))
    }

    const mapping = fieldMappings.find((m) => m.id === mappingId)
    if (mapping && value.trim()) {
      const targetFieldType =
        fieldUpdateType === "Lead to Lead" || fieldUpdateType === "Opportunity to Lead"
          ? leadFieldTypes[mapping.targetField]
          : fieldTypes[mapping.targetField]

      const isDateField = targetFieldType === "Date/Time"

      const availableFields = getFieldsForMention(targetFieldType, fieldUpdateType)

      const validation = validateFormula(value, availableFields, isDateField)

      setFieldMappings(
        fieldMappings.map((m) =>
          m.id === mappingId
            ? { ...m, sourceField: value, validationError: validation.isValid ? undefined : validation.error }
            : m,
        ),
      )
    } else {
      updateFieldMapping(mappingId, "sourceField", value)
    }
  }

  const handleFormulaTextChange = (mappingId: string, value: string) => {
    const mapping = fieldMappings.find((m) => m.id === mappingId)
    if (!mapping) return

    // Check if @ was typed to trigger mention dropdown
    if (value.endsWith("@")) {
      const inputElement = inputRefs.current[mappingId]
      if (inputElement) {
        const rect = inputElement.getBoundingClientRect()
        setMentionState({
          isOpen: true,
          mappingId,
          position: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },
          searchTerm: "",
        })
      }
      // Clear the @ from input
      inputElement.value = value.slice(0, -1)
      return
    }

    // If typing continues after @, update search term
    if (mentionState.isOpen && mentionState.mappingId === mappingId) {
      setMentionState((prev) => ({ ...prev, searchTerm: value.toLowerCase() }))
      return
    }

    // Add text token if user types operators/numbers
    if (value.trim()) {
      const tokens = mapping.formulaTokens || []
      const newToken: FormulaToken = {
        type: "text",
        value: value,
        id: Date.now().toString(),
      }
      const updatedTokens = [...tokens, newToken]

      // Validate the formula
      const formulaString = formulaTokensToString(updatedTokens)
      const targetFieldType =
        fieldUpdateType === "Lead to Lead" || fieldUpdateType === "Opportunity to Lead"
          ? leadFieldTypes[mapping.targetField]
          : fieldTypes[mapping.targetField]
      const isDateField = targetFieldType === "Date/Time"
      const availableFields = getFieldsForMention(targetFieldType, fieldUpdateType)
      const validation = validateFormula(formulaString, availableFields, isDateField)

      setFieldMappings(
        fieldMappings.map((m) =>
          m.id === mappingId
            ? {
                ...m,
                formulaTokens: updatedTokens,
                sourceField: formulaString,
                validationError: validation.isValid ? undefined : validation.error,
              }
            : m,
        ),
      )

      // Clear input
      const inputElement = inputRefs.current[mappingId]
      if (inputElement) inputElement.value = ""
    }
  }

  const handleFormulaKeyDown = (mappingId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    const mapping = fieldMappings.find((m) => m.id === mappingId)
    if (!mapping) return

    // Handle Escape to close mention dropdown
    if (e.key === "Escape" && mentionState.isOpen && mentionState.mappingId === mappingId) {
      setMentionState((prev) => ({ ...prev, isOpen: false }))
      e.preventDefault()
      return
    }

    // Handle Backspace to remove last token
    if (e.key === "Backspace") {
      const input = e.currentTarget
      if (input.value === "" && mapping.formulaTokens && mapping.formulaTokens.length > 0) {
        const tokens = [...mapping.formulaTokens]
        tokens.pop()

        const formulaString = formulaTokensToString(tokens)
        const targetFieldType =
          fieldUpdateType === "Lead to Lead" || fieldUpdateType === "Opportunity to Lead"
            ? leadFieldTypes[mapping.targetField]
            : fieldTypes[mapping.targetField]
        const isDateField = targetFieldType === "Date/Time"
        const availableFields = getFieldsForMention(targetFieldType, fieldUpdateType)
        const validation =
          tokens.length > 0
            ? validateFormula(formulaString, availableFields, isDateField)
            : { isValid: true, error: "" }

        setFieldMappings(
          fieldMappings.map((m) =>
            m.id === mappingId
              ? {
                  ...m,
                  formulaTokens: tokens,
                  sourceField: formulaString,
                  validationError: validation.isValid ? undefined : validation.error,
                }
              : m,
          ),
        )
        e.preventDefault()
      }
    }

    // Handle Space or Enter to commit text token
    if ((e.key === " " || e.key === "Enter") && !mentionState.isOpen) {
      const input = e.currentTarget
      if (input.value.trim()) {
        handleFormulaTextChange(mappingId, input.value)
        e.preventDefault()
      }
    }
  }

  const removeFormulaToken = (mappingId: string, tokenId: string) => {
    const mapping = fieldMappings.find((m) => m.id === mappingId)
    if (!mapping || !mapping.formulaTokens) return

    const tokens = mapping.formulaTokens.filter((t) => t.id !== tokenId)
    const formulaString = formulaTokensToString(tokens)

    const targetFieldType =
      fieldUpdateType === "Lead to Lead" || fieldUpdateType === "Opportunity to Lead"
        ? leadFieldTypes[mapping.targetField]
        : fieldTypes[mapping.targetField]
    const isDateField = targetFieldType === "Date/Time"
    const availableFields = getFieldsForMention(targetFieldType, fieldUpdateType)
    const validation =
      tokens.length > 0 ? validateFormula(formulaString, availableFields, isDateField) : { isValid: true, error: "" }

    setFieldMappings(
      fieldMappings.map((m) =>
        m.id === mappingId
          ? {
              ...m,
              formulaTokens: tokens,
              sourceField: formulaString,
              validationError: validation.isValid ? undefined : validation.error,
            }
          : m,
      ),
    )
  }

  const insertFieldToken = (fieldName: string) => {
    const { mappingId } = mentionState
    const mapping = fieldMappings.find((m) => m.id === mappingId)
    if (!mapping) return

    const tokens = mapping.formulaTokens || []
    const newToken: FormulaToken = {
      type: "field",
      value: fieldName,
      id: Date.now().toString(),
    }
    const updatedTokens = [...tokens, newToken]

    // Validate the formula
    const formulaString = formulaTokensToString(updatedTokens)
    const targetFieldType =
      fieldUpdateType === "Lead to Lead" || fieldUpdateType === "Opportunity to Lead"
        ? leadFieldTypes[mapping.targetField]
        : fieldTypes[mapping.targetField]
    const isDateField = targetFieldType === "Date/Time"
    const availableFields = getFieldsForMention(targetFieldType, fieldUpdateType)
    const validation = validateFormula(formulaString, availableFields, isDateField)

    setFieldMappings(
      fieldMappings.map((m) =>
        m.id === mappingId
          ? {
              ...m,
              formulaTokens: updatedTokens,
              sourceField: formulaString,
              validationError: validation.isValid ? undefined : validation.error,
            }
          : m,
      ),
    )

    setMentionState((prev) => ({ ...prev, isOpen: false }))

    // Focus back on input
    setTimeout(() => {
      const inputElement = inputRefs.current[mappingId]
      if (inputElement) {
        inputElement.value = ""
        inputElement.focus()
      }
    }, 0)
  }

  const getFilteredFields = () => {
    const mapping = fieldMappings.find((m) => m.id === mentionState.mappingId)
    if (!mapping) return []

    const targetFieldType =
      fieldUpdateType === "Lead to Lead" || fieldUpdateType === "Opportunity to Lead"
        ? leadFieldTypes[mapping.targetField]
        : fieldTypes[mapping.targetField]

    const fields = getFieldsForMention(targetFieldType, fieldUpdateType)
    if (!mentionState.searchTerm) return fields
    return fields.filter((field) => field.toLowerCase().includes(mentionState.searchTerm))
  }

  const hasValidationErrors = fieldMappings.some(
    (mapping) => mapping.operator === "Set Calculations" && mapping.validationError,
  )

  if (!isOpen) return null

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed inset-0 z-50 flex">
        <div className="fixed inset-0 bg-black/60" onClick={onClose} />
        <div className="ml-auto w-1/2 min-w-96 bg-white h-full shadow-xl flex flex-col relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Edit Field Update</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Field Update Action Description */}
            <div className="space-y-2">
              <h3 className="font-medium">Field Update Action</h3>
              <p className="text-sm text-gray-600">
                This allows you to do logic based automatic updation of field values available in your Manage
                Registration Fields.
              </p>
              <p className="text-sm text-gray-600">Supported Field Types: Text, Date, Dropdown, and Numeric</p>
            </div>

            {/* Block Name */}
            <div className="space-y-2">
              <Label htmlFor="blockName" className="text-sm font-medium">
                Block Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="blockName"
                placeholder="Enter the block name"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
              />
            </div>

            {/* Field Update Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Field Update Type <span className="text-red-500">*</span>
              </Label>
              <Select value={fieldUpdateType} onValueChange={setFieldUpdateType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead to Opportunity">Lead to Opportunity</SelectItem>
                  <SelectItem value="Lead to Lead">Lead to Lead</SelectItem>
                  <SelectItem value="Opportunity to Lead">Opportunity to Lead</SelectItem>
                  <SelectItem value="Opportunity to Opportunity">Opportunity to Opportunity</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">{getHelpText(fieldUpdateType)}</p>
            </div>

            {/* Select Opportunity List */}
            {(fieldUpdateType === "Lead to Opportunity" ||
              fieldUpdateType === "Opportunity to Lead" ||
              fieldUpdateType === "Opportunity to Opportunity") && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Select Opportunity List <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedOpportunityList} onValueChange={setSelectedOpportunityList}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OL List 1">OL List 1</SelectItem>
                      <SelectItem value="OL List 2">OL List 2</SelectItem>
                      <SelectItem value="OL List 3">OL List 3</SelectItem>
                      <SelectItem value="OL List 4">OL List 4</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    The field list is determined by your selected Opportunity List
                  </p>
                </div>

                {/* Selected Opportunity List Badge */}
                <div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedOpportunityList}
                  </Badge>
                </div>
              </>
            )}

            {/* Heads up notice */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Heads up:</span> If you change how dependent fields behave or update the
                Master Data linked to any dropdown-type fields after creating an automation the automation will still
                use the previous (older) values during updates.
              </p>
            </div>

            {/* Field Mappings */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2 text-sm font-medium text-gray-700">
                <div className="flex-1">
                  <div>Target Fields</div>
                  <div className="text-xs text-gray-500 font-normal">({getTargetFieldHeaderText()})</div>
                </div>
                <div className="flex-1">{/* Empty space above operator column */}</div>
                <div className="flex-1">
                  <div>Source Fields</div>
                  <div className="text-xs text-gray-500 font-normal">({getSourceFieldHeaderText()})</div>
                </div>
                <div className="w-10"></div> {/* Spacer for the add button */}
              </div>

              {fieldMappings.map((mapping) => (
                <div key={mapping.id} className="flex items-center space-x-2">
                  <Select
                    value={mapping.targetField}
                    onValueChange={(value) => {
                      updateMultipleFields(mapping.id, {
                        targetField: value,
                        operator: "",
                        sourceField: "",
                      })
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select target field" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTargetFieldOptions().map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={mapping.operator}
                    onValueChange={(value) => {
                      console.log("[v0] Operator selected:", { mappingId: mapping.id, operator: value })
                      updateMultipleFields(mapping.id, {
                        operator: value,
                        sourceField: value === "Set Field Token" ? "" : mapping.sourceField,
                      })
                    }}
                    disabled={!mapping.targetField}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Update Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getOperatorOptions(mapping.targetField).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {renderRightSideInput(mapping)}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addFieldMapping}
                    className="bg-green-50 border-green-200 hover:bg-green-100"
                  >
                    <Plus className="w-4 h-4 text-green-600" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700" disabled={hasValidationErrors}>
              Submit
            </Button>
          </div>

          {mentionState.isOpen && (
            <div
              ref={mentionDropdownRef}
              className="fixed bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[60]"
              style={{
                top: `${mentionState.position.top}px`,
                left: `${mentionState.position.left}px`,
                minWidth: "250px",
              }}
            >
              {getFilteredFields().length > 0 ? (
                <div className="py-1">
                  {getFilteredFields().map((field) => {
                    // Determine field type for display
                    const mapping = fieldMappings.find((m) => m.id === mentionState.mappingId)
                    const targetFieldType = mapping
                      ? fieldUpdateType === "Lead to Lead" || fieldUpdateType === "Opportunity to Lead"
                        ? leadFieldTypes[mapping.targetField]
                        : fieldTypes[mapping.targetField]
                      : ""

                    return (
                      <button
                        key={field}
                        onClick={() => insertFieldToken(field)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        <div className="font-medium">{field}</div>
                        <div className="text-xs text-gray-500">{targetFieldType} Field</div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">No fields found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
