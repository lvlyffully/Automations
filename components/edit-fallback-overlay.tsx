"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { X, Settings, Plus, Minus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface UserAttributeCondition {
  id: string
  field: string
  operator: string
  value: string
}

interface FallbackPoolConfig {
  allocateToType: "users" | "teams" | "attrs"
  selectedUsers: string[]
  selectedTeams: string[]
  userAttributeConditions?: UserAttributeCondition[]
  userAttributeMatchType?: "all" | "any"
  selectionStrategy: string
}

interface RuleFallback {
  type: "pool" | "none"
  poolConfig?: FallbackPoolConfig
}

interface EditFallbackOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fallback: RuleFallback) => void
  existingFallback?: RuleFallback
}

const MOCK_USERS = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Tom Brown"]
const MOCK_TEAMS = ["Sales Team", "Support Team", "Marketing Team", "Operations Team"]

const USER_ATTRIBUTE_FIELDS = [
  { value: "region", label: "Region" },
  { value: "experience", label: "Experience Level" },
  { value: "language", label: "Language" },
  { value: "department", label: "Department" },
  { value: "role", label: "Role" },
  { value: "country", label: "Country" },
  { value: "city", label: "City" },
]

const ATTRIBUTE_OPERATORS = [
  { value: "equals", label: "Equal" },
  { value: "not-equals", label: "Not Equal" },
  { value: "contains", label: "Contains" },
  { value: "not-contains", label: "Does Not Contain" },
  { value: "is-empty", label: "Is Empty" },
  { value: "is-not-empty", label: "Is Not Empty" },
]

export function EditFallbackOverlay({ isOpen, onClose, onSave, existingFallback }: EditFallbackOverlayProps) {
  const [isFallbackEnabled, setIsFallbackEnabled] = useState(existingFallback?.type === "pool")
  const [allocateToType, setAllocateToType] = useState<"users" | "teams" | "attrs">(
    existingFallback?.poolConfig?.allocateToType || "users",
  )
  const [selectedUsers, setSelectedUsers] = useState<string[]>(existingFallback?.poolConfig?.selectedUsers || [])
  const [selectedTeams, setSelectedTeams] = useState<string[]>(existingFallback?.poolConfig?.selectedTeams || [])
  const [userAttributeConditions, setUserAttributeConditions] = useState<UserAttributeCondition[]>(
    existingFallback?.poolConfig?.userAttributeConditions || [],
  )
  const [userAttributeMatchType, setUserAttributeMatchType] = useState<"all" | "any">(
    existingFallback?.poolConfig?.userAttributeMatchType || "all",
  )

  const handleAddAttributeCondition = () => {
    const newCondition: UserAttributeCondition = {
      id: `attr_${Date.now()}`,
      field: "",
      operator: "",
      value: "",
    }
    setUserAttributeConditions([...userAttributeConditions, newCondition])
  }

  const handleRemoveAttributeCondition = (id: string) => {
    setUserAttributeConditions(userAttributeConditions.filter((c) => c.id !== id))
  }

  const handleUpdateAttributeCondition = (id: string, updates: Partial<UserAttributeCondition>) => {
    setUserAttributeConditions(userAttributeConditions.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const handleSave = () => {
    const fallback: RuleFallback = {
      type: isFallbackEnabled ? "pool" : "none",
    }

    if (isFallbackEnabled) {
      fallback.poolConfig = {
        allocateToType,
        selectedUsers,
        selectedTeams,
        userAttributeConditions,
        userAttributeMatchType,
        selectionStrategy: "round-robin",
      }
    }

    onSave(fallback)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Rule Fallback Routing</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              Used when the rule condition is TRUE but no eligible assignee is found (empty pool, quota hit, etc.)
            </p>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Fallback Users</Label>
              <p className="text-xs text-muted-foreground">Use a fallback pool when no eligible assignee is found</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFallbackEnabled}
                onChange={(e) => setIsFallbackEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          {isFallbackEnabled && (
            <div className="border rounded-lg">
              <div className="px-4 py-3 bg-gray-50 border-b flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="font-medium">Define fallback pool</span>
              </div>
              <div className="px-4 py-4 space-y-4">
                {/* Pool Type Tabs */}
                <div className="flex gap-2">
                  <Button
                    variant={allocateToType === "users" ? "default" : "outline"}
                    className={allocateToType === "users" ? "bg-teal-600 hover:bg-teal-700 flex-1" : "flex-1"}
                    onClick={() => setAllocateToType("users")}
                    size="sm"
                  >
                    Selected Users
                  </Button>
                  <Button
                    variant={allocateToType === "teams" ? "default" : "outline"}
                    className={allocateToType === "teams" ? "bg-teal-600 hover:bg-teal-700 flex-1" : "flex-1"}
                    onClick={() => setAllocateToType("teams")}
                    size="sm"
                  >
                    Selected Teams
                  </Button>
                  <Button
                    variant={allocateToType === "attrs" ? "default" : "outline"}
                    className={allocateToType === "attrs" ? "bg-teal-600 hover:bg-teal-700 flex-1" : "flex-1"}
                    onClick={() => setAllocateToType("attrs")}
                    size="sm"
                  >
                    User Attributes
                  </Button>
                </div>

                {/* Selected Users */}
                {allocateToType === "users" && (
                  <div className="space-y-2">
                    <Label className="text-sm">Select Users (Multiple)</Label>
                    <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-1">
                      {MOCK_USERS.map((user) => (
                        <label
                          key={user}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user])
                              } else {
                                setSelectedUsers(selectedUsers.filter((u) => u !== user))
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{user}</span>
                        </label>
                      ))}
                    </div>
                    {selectedUsers.length > 0 && (
                      <div className="text-xs text-muted-foreground">{selectedUsers.length} user(s) selected</div>
                    )}
                  </div>
                )}

                {/* Selected Teams */}
                {allocateToType === "teams" && (
                  <div className="space-y-2">
                    <Label className="text-sm">Select Teams (Multiple)</Label>
                    <div className="border rounded-md p-2 max-h-48 overflow-y-auto space-y-1">
                      {MOCK_TEAMS.map((team) => (
                        <label
                          key={team}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTeams.includes(team)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTeams([...selectedTeams, team])
                              } else {
                                setSelectedTeams(selectedTeams.filter((t) => t !== team))
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{team}</span>
                        </label>
                      ))}
                    </div>
                    {selectedTeams.length > 0 && (
                      <div className="text-xs text-muted-foreground">{selectedTeams.length} team(s) selected</div>
                    )}
                  </div>
                )}

                {/* User Attributes */}
                {allocateToType === "attrs" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Filter users by attributes</Label>
                      <p className="text-xs text-muted-foreground">
                        Define conditions to dynamically select users based on their attributes
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Match</Label>
                      <RadioGroup
                        value={userAttributeMatchType}
                        onValueChange={(v) => setUserAttributeMatchType(v as "all" | "any")}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="all" id="match-all" />
                          <Label htmlFor="match-all" className="text-sm font-normal cursor-pointer">
                            All Criteria
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="any" id="match-any" />
                          <Label htmlFor="match-any" className="text-sm font-normal cursor-pointer">
                            Any Criteria
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      {userAttributeConditions.map((condition, index) => (
                        <div key={condition.id} className="flex gap-2 items-start">
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <Select
                              value={condition.field}
                              onValueChange={(v) => handleUpdateAttributeCondition(condition.id, { field: v })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent className="z-[160]">
                                {USER_ATTRIBUTE_FIELDS.map((field) => (
                                  <SelectItem key={field.value} value={field.value}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={condition.operator}
                              onValueChange={(v) => handleUpdateAttributeCondition(condition.id, { operator: v })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent className="z-[160]">
                                {ATTRIBUTE_OPERATORS.map((op) => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder="Value"
                              value={condition.value}
                              onChange={(e) => handleUpdateAttributeCondition(condition.id, { value: e.target.value })}
                              disabled={condition.operator === "is-empty" || condition.operator === "is-not-empty"}
                            />
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAttributeCondition(condition.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddAttributeCondition}
                        className="w-full bg-transparent"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Condition
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save fallback
          </Button>
        </div>
      </div>
    </div>
  )
}
