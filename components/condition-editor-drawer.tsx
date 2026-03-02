"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Trash2, CalendarIcon, ChevronRight, Type, Hash, Upload, FileText, ChevronDown, Search } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"

interface ConditionEditorDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  pathId?: string
  pathLabel?: string
}

interface FilterCondition {
  id: string
  module: string
  subModule?: string
  field: string
  fieldType: "text" | "number" | "date" | "upload" | "paragraph" | "dropdown"
  operator: string
  value: string | string[]
  displayValue?: string
}

const MODULES = [
  { value: "lead-manager", label: "Lead Manager", hasSubModule: false },
  {
    value: "opportunity-manager",
    label: "Opportunity Manager",
    hasSubModule: true,
    subModules: [
      { value: "opportunity-list-1", label: "Opportunity List 1" },
      { value: "opportunity-list-2", label: "Opportunity List 2" },
    ],
  },
  { value: "telephony", label: "Telephony", hasSubModule: false },
  {
    value: "dynamic-activity",
    label: "Dynamic Activity",
    hasSubModule: true,
    subModules: [
      { value: "da-list-1", label: "DA List 1" },
      { value: "da-list-2", label: "DA List 2" },
    ],
  },
]

const getFieldsForModule = (module: string, subModule?: string) => {
  const prefix = subModule ? subModule.split("-")[0].toUpperCase() : module.split("-")[0].toUpperCase()
  return [
    { value: `${module}-${subModule || "main"}-text`, label: `${prefix} Text Type Field`, type: "text" },
    { value: `${module}-${subModule || "main"}-number`, label: `${prefix} Numeric Type Field`, type: "number" },
    { value: `${module}-${subModule || "main"}-date`, label: `${prefix} Date Type Field`, type: "date" },
    { value: `${module}-${subModule || "main"}-upload`, label: `${prefix} Upload Type Field`, type: "upload" },
    { value: `${module}-${subModule || "main"}-paragraph`, label: `${prefix} Paragraph Type Field`, type: "paragraph" },
    { value: `${module}-${subModule || "main"}-dropdown`, label: `${prefix} Dependent Field`, type: "dropdown" },
  ]
}

const OPERATORS = {
  text: [
    { value: "is-empty", label: "Is Empty" },
    { value: "is-not-empty", label: "Is Not Empty" },
    { value: "equals", label: "Equals" },
    { value: "not-equals", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "does-not-contains", label: "Does Not Contains" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "not-equals", label: "Not Equals" },
    { value: "is-empty", label: "Is Empty" },
    { value: "is-not-empty", label: "Is Not Empty" },
    { value: "less-than", label: "Less Than" },
    { value: "less-than-equal", label: "Less Than or Equal To" },
    { value: "greater-than", label: "Greater Than" },
    { value: "greater-than-equal", label: "Greater Than or Equal To" },
    { value: "between", label: "Between" },
  ],
  date: [
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "between", label: "Between" },
    { value: "is-empty", label: "Is Empty" },
    { value: "is-not-empty", label: "Is Not Empty" },
  ],
  paragraph: [
    { value: "is-empty", label: "Is Empty" },
    { value: "is-not-empty", label: "Is Not Empty" },
    { value: "equals", label: "Equals" },
    { value: "not-equals", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "does-not-contains", label: "Does Not Contains" },
  ],
  upload: [
    { value: "is-empty", label: "Is Empty" },
    { value: "is-not-empty", label: "Is Not Empty" },
  ],
  dropdown: [
    { value: "is-empty", label: "Is Empty" },
    { value: "is-not-empty", label: "Is Not Empty" },
    { value: "equals", label: "Equals" },
    { value: "not-equals", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "does-not-contains", label: "Does Not Contains" },
  ],
}

const DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "next-7-days", label: "Next 7 Days" },
  { value: "next-30-days", label: "Next 30 Days" },
  { value: "custom", label: "Custom Date" },
]

const HIERARCHICAL_DATA = {
  "Level 1 Parent A": Array.from({ length: 10 }, (_, i) => `Value ${i + 1}`),
  "Level 1 Parent B": Array.from({ length: 10 }, (_, i) => `Value ${i + 11}`),
  "Level 1 Parent C": Array.from({ length: 10 }, (_, i) => `Value ${i + 21}`),
}

export function ConditionEditorDrawer({ isOpen, onClose, onSave, pathId, pathLabel }: ConditionEditorDrawerProps) {
  const [logicOperator, setLogicOperator] = useState<"all" | "any">("all")
  const [conditions, setConditions] = useState<FilterCondition[]>([])
  const [blockName, setBlockName] = useState(pathLabel || "")

  const [selectedModule, setSelectedModule] = useState("")
  const [selectedSubModule, setSelectedSubModule] = useState("")
  const [selectedField, setSelectedField] = useState("")
  const [selectedOperator, setSelectedOperator] = useState("")

  const [textValue, setTextValue] = useState("")
  const [rangeMin, setRangeMin] = useState("")
  const [rangeMax, setRangeMax] = useState("")

  const [selectedDateOption, setSelectedDateOption] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [startDateOption, setStartDateOption] = useState("")
  const [endDateOption, setEndDateOption] = useState("")
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)
  const [showSingleCalendar, setShowSingleCalendar] = useState(false)

  const [selectedDropdownValues, setSelectedDropdownValues] = useState<string[]>([])
  const [dropdownSearchTerm, setDropdownSearchTerm] = useState("")
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(Object.keys(HIERARCHICAL_DATA)))
  const [showDropdownPopover, setShowDropdownPopover] = useState(false)

  const currentModule = MODULES.find((m) => m.value === selectedModule)
  const availableFields = selectedModule ? getFieldsForModule(selectedModule, selectedSubModule) : []
  const selectedFieldData = availableFields.find((f) => f.value === selectedField)
  const fieldType = selectedFieldData?.type as FilterCondition["fieldType"] | undefined

  const shouldShowSubModule = currentModule?.hasSubModule
  const needsValueInput = selectedOperator && !["is-empty", "is-not-empty"].includes(selectedOperator)

  const validateDateRange = () => {
    if (!startDate || !endDate) return { valid: false, message: "" }
    if (startDate > endDate) return { valid: false, message: "Start date must be before or equal to end date" }
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff > 90) return { valid: false, message: "Date range cannot exceed 90 days" }
    return { valid: true, message: "" }
  }

  const validateNumberRange = () => {
    if (!rangeMin || !rangeMax) return { valid: false, message: "" }
    const min = Number.parseFloat(rangeMin)
    const max = Number.parseFloat(rangeMax)
    if (min > max) return { valid: false, message: "From value must be less than or equal to To value" }
    return { valid: true, message: "" }
  }

  const handleAddCondition = () => {
    if (conditions.length >= 15) {
      console.log("[v0] Maximum 15 conditions reached")
      return
    }

    if (!selectedModule || !selectedField || !selectedOperator) return
    if (shouldShowSubModule && !selectedSubModule) return

    let value: string | string[] = ""
    let displayValue = ""

    if (needsValueInput) {
      if (fieldType === "text" || fieldType === "paragraph") {
        if (!textValue) return
        value = textValue
        displayValue = textValue
      } else if (fieldType === "number") {
        if (selectedOperator === "between") {
          const validation = validateNumberRange()
          if (!validation.valid || !rangeMin || !rangeMax) return
          value = `${rangeMin} - ${rangeMax}`
          displayValue = value
        } else {
          if (!textValue) return
          value = textValue
          displayValue = textValue
        }
      } else if (fieldType === "date") {
        if (selectedOperator === "between") {
          const validation = validateDateRange()
          if (!validation.valid || !startDate || !endDate) return
          const startLabel =
            startDateOption !== "custom" ? startDateOption : `Custom: ${formatDate(startDate, "MMM dd, yyyy")}`
          const endLabel = endDateOption !== "custom" ? endDateOption : `Custom: ${formatDate(endDate, "MMM dd, yyyy")}`
          value = `${formatDate(startDate, "yyyy-MM-dd")} to ${formatDate(endDate, "yyyy-MM-dd")}`
          displayValue = `${startLabel} to ${endLabel}`
        } else {
          if (!selectedDate) return
          const dateLabel =
            selectedDateOption !== "custom" ? selectedDateOption : `Custom: ${formatDate(selectedDate, "MMM dd, yyyy")}`
          value = formatDate(selectedDate, "yyyy-MM-dd")
          displayValue = dateLabel
        }
      } else if (fieldType === "dropdown") {
        if (selectedDropdownValues.length === 0) return
        value = selectedDropdownValues
        if (selectedDropdownValues.length <= 3) {
          displayValue = selectedDropdownValues.join(", ")
        } else {
          displayValue = `${selectedDropdownValues[0]}, ${selectedDropdownValues[1]}, and ${selectedDropdownValues.length - 2} more`
        }
      }
    }

    const newCondition: FilterCondition = {
      id: Date.now().toString(),
      module: selectedModule,
      subModule: selectedSubModule || undefined,
      field: selectedField,
      fieldType: fieldType!,
      operator: selectedOperator,
      value,
      displayValue,
    }

    setConditions([...conditions, newCondition])
    resetForm()
  }

  const resetForm = () => {
    setSelectedField("")
    setSelectedOperator("")
    setTextValue("")
    setRangeMin("")
    setRangeMax("")
    setSelectedDateOption("")
    setSelectedDate(undefined)
    setStartDate(undefined)
    setEndDate(undefined)
    setStartDateOption("")
    setEndDateOption("")
    setSelectedDropdownValues([])
    setDropdownSearchTerm("")
    setShowDropdownPopover(false)
    setShowStartCalendar(false)
    setShowEndCalendar(false)
    setShowSingleCalendar(false)
  }

  const resetAll = () => {
    setConditions([])
    setSelectedModule("")
    setSelectedSubModule("")
    resetForm()
  }

  const handleDatePresetChange = (preset: string, isStart = false, isSingle = false) => {
    let date: Date
    const today = new Date()
    
    switch (preset) {
      case "today":
        date = today
        break
      case "last-7-days":
        date = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "last-30-days":
        date = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "next-7-days":
        date = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case "next-30-days":
        date = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        break
      default:
        return
    }

    if (isSingle) {
      setSelectedDate(date)
      setSelectedDateOption(preset)
    } else if (isStart) {
      setStartDate(date)
      setStartDateOption(preset)
    } else {
      setEndDate(date)
      setEndDateOption(preset)
    }
  }

  const getFilteredDropdownData = () => {
    if (!dropdownSearchTerm) return HIERARCHICAL_DATA

    const filtered: typeof HIERARCHICAL_DATA = {}
    Object.entries(HIERARCHICAL_DATA).forEach(([parent, children]) => {
      const matchingChildren = children.filter(
        (child) =>
          child.toLowerCase().includes(dropdownSearchTerm.toLowerCase()) ||
          parent.toLowerCase().includes(dropdownSearchTerm.toLowerCase()),
      )
      if (matchingChildren.length > 0) {
        filtered[parent] = matchingChildren
      }
    })
    return filtered
  }

  const toggleNodeExpansion = (parent: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(parent)) {
      newExpanded.delete(parent)
    } else {
      newExpanded.add(parent)
    }
    setExpandedNodes(newExpanded)
  }

  const handleSelectAllParent = (parent: string, children: string[]) => {
    const allSelected = children.every((child) => selectedDropdownValues.includes(`${parent} > ${child}`))
    if (allSelected) {
      setSelectedDropdownValues(selectedDropdownValues.filter((v) => !v.startsWith(`${parent} >`)))
    } else {
      const newValues = children.map((child) => `${parent} > ${child}`)
      setSelectedDropdownValues([...new Set([...selectedDropdownValues, ...newValues])])
    }
  }

  const handleDropdownValueToggle = (parent: string, child: string) => {
    const fullValue = `${parent} > ${child}`
    if (selectedDropdownValues.includes(fullValue)) {
      setSelectedDropdownValues(selectedDropdownValues.filter((v) => v !== fullValue))
    } else {
      setSelectedDropdownValues([...selectedDropdownValues, fullValue])
    }
  }

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="w-3 h-3" />
      case "number":
        return <Hash className="w-3 h-3" />
      case "date":
        return <CalendarIcon className="w-3 h-3" />
      case "upload":
        return <Upload className="w-3 h-3" />
      case "paragraph":
        return <FileText className="w-3 h-3" />
      case "dropdown":
        return <ChevronDown className="w-3 h-3" />
      default:
        return null
    }
  }

  const handleDeleteCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const handleApply = () => {
    if (conditions.length === 0) {
      alert("Please add at least one condition before applying")
      return
    }
    onSave()
    onClose()
  }

  const getModuleLabel = (value: string) => MODULES.find((m) => m.value === value)?.label || value
  const getSubModuleLabel = (moduleValue: string, subValue: string) => {
    const module = MODULES.find((m) => m.value === moduleValue)
    return module?.subModules?.find((s) => s.value === subValue)?.label || subValue
  }
  const getFieldLabel = (value: string) => availableFields.find((f) => f.value === value)?.label || value
  const getOperatorLabel = (type: string, value: string) => {
    const operators = OPERATORS[type as keyof typeof OPERATORS] || []
    return operators.find((o) => o.value === value)?.label || value
  }
  
  const formatDate = (date: Date, formatStr: string) => {
    if (formatStr === "yyyy-MM-dd") {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    if (formatStr === "MMM dd, yyyy") {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`
    }
    return date.toLocaleDateString()
  }

  if (!isOpen) return null

  const dateRangeValidation = selectedOperator === "between" && fieldType === "date" ? validateDateRange() : null
  const numberRangeValidation = selectedOperator === "between" && fieldType === "number" ? validateNumberRange() : null
  const filteredDropdownData = getFilteredDropdownData()
  const maxConditionsReached = conditions.length >= 15

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="ml-auto w-[70vw] bg-white h-full shadow-xl flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{pathLabel || "Add Condition for Path"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Block Name Section - Full Width */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Block Name <span className="text-red-500">*</span>
            </Label>
            <Input placeholder="Enter block name" value={blockName} onChange={(e) => setBlockName(e.target.value)} />
            <p className="text-xs text-gray-500">Custom name to identify this path</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Form */}
          <div className="w-1/2 border-r p-6 space-y-4 overflow-y-auto">
            {/* Module Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Module <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedModule}
                onValueChange={(value) => {
                  setSelectedModule(value)
                  setSelectedSubModule("")
                  resetForm()
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {MODULES.map((module) => (
                    <SelectItem key={module.value} value={module.value}>
                      {module.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Module Selection */}
            {shouldShowSubModule && currentModule?.subModules && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Select Sub-module <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedSubModule}
                  onValueChange={(value) => {
                    setSelectedSubModule(value)
                    resetForm()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-module" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentModule.subModules.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Field Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Field <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedField}
                onValueChange={(value) => {
                  setSelectedField(value)
                  setSelectedOperator("")
                  setTextValue("")
                  setRangeMin("")
                  setRangeMax("")
                }}
                disabled={!selectedModule || (shouldShowSubModule && !selectedSubModule)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operator Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Operator <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedOperator} onValueChange={setSelectedOperator} disabled={!selectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {fieldType &&
                    OPERATORS[fieldType]?.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value Input - Text/Paragraph */}
            {needsValueInput && (fieldType === "text" || fieldType === "paragraph") && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Value</Label>
                {fieldType === "paragraph" ? (
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[80px] text-sm"
                    placeholder="Enter value"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                  />
                ) : (
                  <Input placeholder="Enter value" value={textValue} onChange={(e) => setTextValue(e.target.value)} />
                )}
              </div>
            )}

            {/* Value Input - Number */}
            {needsValueInput && fieldType === "number" && selectedOperator !== "between" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Value</Label>
                <Input
                  type="number"
                  placeholder="Enter number"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                />
              </div>
            )}

            {/* Value Input - Number Range */}
            {needsValueInput && fieldType === "number" && selectedOperator === "between" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Value</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="From"
                    value={rangeMin}
                    onChange={(e) => setRangeMin(e.target.value)}
                    className={numberRangeValidation && !numberRangeValidation.valid ? "border-red-500" : ""}
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="To"
                    value={rangeMax}
                    onChange={(e) => setRangeMax(e.target.value)}
                    className={numberRangeValidation && !numberRangeValidation.valid ? "border-red-500" : ""}
                  />
                </div>
                {numberRangeValidation && !numberRangeValidation.valid && numberRangeValidation.message && (
                  <p className="text-xs text-red-500">{numberRangeValidation.message}</p>
                )}
              </div>
            )}

            {/* Value Input - Date (Single) */}
            {needsValueInput && fieldType === "date" && selectedOperator !== "between" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Value</Label>
                <Select
                  value={selectedDateOption}
                  onValueChange={(value) => {
                    setSelectedDateOption(value)
                    if (value !== "custom") {
                      handleDatePresetChange(value, false, true)
                      setShowSingleCalendar(false)
                    } else {
                      setShowSingleCalendar(true)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDateOption === "custom" && (
                  <div className="border rounded-lg p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date)
                        setShowSingleCalendar(false)
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Value Input - Date Range */}
            {needsValueInput && fieldType === "date" && selectedOperator === "between" && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Value</Label>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Start Date</Label>
                  <Select
                    value={startDateOption}
                    onValueChange={(value) => {
                      setStartDateOption(value)
                      if (value !== "custom") {
                        handleDatePresetChange(value, true, false)
                        setShowStartCalendar(false)
                      } else {
                        setShowStartCalendar(true)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select start date" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_PRESETS.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {startDateOption === "custom" && showStartCalendar && (
                    <div className="border rounded-lg p-3">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date)
                          setShowStartCalendar(false)
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">End Date</Label>
                  <Select
                    value={endDateOption}
                    onValueChange={(value) => {
                      setEndDateOption(value)
                      if (value !== "custom") {
                        handleDatePresetChange(value, false, false)
                        setShowEndCalendar(false)
                      } else {
                        setShowEndCalendar(true)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select end date" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_PRESETS.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {endDateOption === "custom" && showEndCalendar && (
                    <div className="border rounded-lg p-3">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date)
                          setShowEndCalendar(false)
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Validation Message */}
                {dateRangeValidation && !dateRangeValidation.valid && dateRangeValidation.message && (
                  <p className="text-xs text-red-500">{dateRangeValidation.message}</p>
                )}
                {dateRangeValidation &&
                  dateRangeValidation.valid &&
                  startDate &&
                  endDate &&
                  Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) > 0 && (
                    <p className="text-xs text-green-600">
                      {Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days selected
                    </p>
                  )}
              </div>
            )}

            {/* Value Input - Dropdown */}
            {needsValueInput && fieldType === "dropdown" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Value</Label>
                <div className="border rounded-md">
                  <button
                    onClick={() => setShowDropdownPopover(!showDropdownPopover)}
                    className="w-full px-3 py-2 text-left text-sm bg-white hover:bg-gray-50 rounded-md flex items-center justify-between"
                  >
                    <span className="text-gray-600">
                      {selectedDropdownValues.length === 0
                        ? "Select values"
                        : `${selectedDropdownValues.length} values selected`}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showDropdownPopover && (
                    <div className="border-t max-h-64 overflow-y-auto bg-white">
                      {/* Search */}
                      <div className="p-2 border-b sticky top-0 bg-white">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder="Search..."
                            value={dropdownSearchTerm}
                            onChange={(e) => setDropdownSearchTerm(e.target.value)}
                            className="pl-8 h-8 text-sm"
                          />
                        </div>
                      </div>

                      {/* Clear All */}
                      {selectedDropdownValues.length > 0 && (
                        <div className="p-2 border-b">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDropdownValues([])}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Clear All
                          </Button>
                        </div>
                      )}

                      {/* Hierarchical Options */}
                      <div className="p-2 space-y-2">
                        {Object.keys(filteredDropdownData).length === 0 ? (
                          <div className="text-sm text-gray-500 text-center py-4">No results found</div>
                        ) : (
                          Object.entries(filteredDropdownData).map(([parent, children]) => {
                            const allChildrenSelected = children.every((child) =>
                              selectedDropdownValues.includes(`${parent} > ${child}`)
                            )
                            return (
                              <div key={parent} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => toggleNodeExpansion(parent)}
                                    className="flex items-center gap-1 text-sm font-medium hover:text-blue-600"
                                  >
                                    <ChevronRight
                                      className={`w-4 h-4 transition-transform ${
                                        expandedNodes.has(parent) ? "rotate-90" : ""
                                      }`}
                                    />
                                    {parent}
                                  </button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSelectAllParent(parent, children)}
                                    className="text-xs h-6"
                                  >
                                    {allChildrenSelected ? "Deselect All" : "Select All"}
                                  </Button>
                                </div>

                                {expandedNodes.has(parent) && (
                                  <div className="ml-5 space-y-1">
                                    {children.map((child) => {
                                      const fullValue = `${parent} > ${child}`
                                      const isSelected = selectedDropdownValues.includes(fullValue)
                                      return (
                                        <label
                                          key={child}
                                          className="flex items-center gap-2 py-1 hover:bg-gray-50 cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleDropdownValueToggle(parent, child)}
                                            className="rounded"
                                          />
                                          <span className="text-sm">{child}</span>
                                        </label>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selectedDropdownValues.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDropdownValues.map((value) => (
                      <span
                        key={value}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {value.split(" > ")[1]}
                        <button
                          onClick={() => setSelectedDropdownValues(selectedDropdownValues.filter((v) => v !== value))}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add Condition Button */}
            <Button
              onClick={handleAddCondition}
              disabled={
                !selectedModule ||
                (shouldShowSubModule && !selectedSubModule) ||
                !selectedField ||
                !selectedOperator ||
                maxConditionsReached
              }
              className="w-full"
            >
              Add Condition
            </Button>

            {maxConditionsReached && (
              <p className="text-xs text-red-500 text-center">Maximum 15 conditions reached</p>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 p-6 space-y-4 overflow-y-auto bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Conditions Preview</h3>
              <span className="text-xs text-gray-500">{conditions.length} / 15 conditions</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setLogicOperator("all")}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-medium ${
                  logicOperator === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setLogicOperator("any")}
                className={`flex-1 px-3 py-1.5 rounded text-sm font-medium ${
                  logicOperator === "any" ? "bg-orange-500 text-white" : "bg-white text-gray-700 border"
                }`}
              >
                ANY
              </button>
            </div>

            <p className="text-xs text-gray-600">
              {logicOperator === "all"
                ? "Every condition must match — AND logic is applied to all conditions."
                : "At least one condition must match — OR logic is applied to all conditions."}
            </p>

            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div key={condition.id}>
                  <div className="bg-white border rounded-lg p-3 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                        {getModuleLabel(condition.module)}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      {condition.subModule && (
                        <>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
                            {getSubModuleLabel(condition.module, condition.subModule)}
                          </span>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        </>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-medium flex items-center gap-1">
                        {getFieldIcon(condition.fieldType)}
                        {getFieldLabel(condition.field)}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-medium">
                        {getOperatorLabel(condition.fieldType, condition.operator)}
                      </span>
                      {condition.displayValue && (
                        <>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                            {condition.displayValue}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCondition(condition.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {index < conditions.length - 1 && logicOperator === "all" && (
                    <div className="flex justify-center py-1">
                      <span className="text-xs font-semibold text-blue-600">AND</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={resetAll}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </div>
    </div>
  )
}
