"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { X, Calendar, Info } from "lucide-react"
import { SingleDateTimePicker } from "./single-date-time-picker"

interface PublishAutomationDialogProps {
  isOpen: boolean
  onClose: () => void
  onPublish: (data: PublishData) => void
}

export interface PublishData {
  title: string
  description: string
  tags: string[]
  startTime: Date | null
  endTime: Date | null
  triggerOnImport: boolean
  triggerOnApiPush: boolean
  triggerOnLeadImportOpportunities: boolean
}

export function PublishAutomationDialog({ isOpen, onClose, onPublish }: PublishAutomationDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false)
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false)
  const [triggerOnImport, setTriggerOnImport] = useState(true)
  const [triggerOnApiPush, setTriggerOnApiPush] = useState(true)
  const [triggerOnLeadImportOpportunities, setTriggerOnLeadImportOpportunities] = useState(false)

  if (!isOpen) return null

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() && tags.length < 10) {
      e.preventDefault()
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  const handlePublish = () => {
    onPublish({
      title,
      description,
      tags,
      startTime,
      endTime,
      triggerOnImport,
      triggerOnApiPush,
      triggerOnLeadImportOpportunities,
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">Publish Automation</h2>
          <button onClick={onClose} className="hover:bg-muted p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 flex-1 overflow-y-auto">
          {/* Automation Title */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <label className="text-sm font-medium pt-2">
              Automation Title <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Automation List Title*"
              className="w-full"
            />
          </div>

          {/* Automation Description */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <label className="text-sm font-medium pt-2">Automation Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please use this space to describe what your automation is about."
              className="w-full min-h-[120px] resize-none"
            />
          </div>

          {/* Tags */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <label className="text-sm font-medium pt-2">Tags</label>
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(index)} className="hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type your tag and press enter(max 10 tag allowed)"
                className="w-full"
                disabled={tags.length >= 10}
              />
            </div>
          </div>

          {/* Start Time */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <label className="text-sm font-medium pt-2">
              Start Time <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setIsStartTimePickerOpen(true)}
                className="w-full px-3 py-2 border border-border rounded-md text-left flex items-center justify-between hover:border-muted-foreground"
              >
                <span className={startTime ? "text-foreground" : "text-muted-foreground"}>
                  {startTime ? startTime.toLocaleString() : "Automation Starts On"}
                </span>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </button>
              {isStartTimePickerOpen && (
                <div className="absolute top-full left-0 mt-2 z-50">
                  <SingleDateTimePicker
                    date={startTime || new Date()}
                    onDateChange={(date) => {
                      setStartTime(date)
                      setIsStartTimePickerOpen(false)
                    }}
                    onCancel={() => setIsStartTimePickerOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* End Time */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
            <label className="text-sm font-medium pt-2">
              End Time <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setIsEndTimePickerOpen(true)}
                className="w-full px-3 py-2 border border-border rounded-md text-left flex items-center justify-between hover:border-muted-foreground"
              >
                <span className={endTime ? "text-foreground" : "text-muted-foreground"}>
                  {endTime ? endTime.toLocaleString() : "Automation Ends On"}
                </span>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </button>
              {isEndTimePickerOpen && (
                <div className="absolute top-full left-0 mt-2 z-50">
                  <SingleDateTimePicker
                    date={endTime || new Date()}
                    onDateChange={(date) => {
                      setEndTime(date)
                      setIsEndTimePickerOpen(false)
                    }}
                    onCancel={() => setIsEndTimePickerOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Informational Note */}
          <div className="bg-info/10 border border-info/30 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-info-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-info-foreground leading-relaxed">
              <p className="font-medium mb-1">Note on Automation Triggers</p>
              <p>
                All single-record actions and dashboard-based bulk updates always trigger automations, regardless of
                toggle states. These are treated as direct in-system user actions and therefore bypass origin-level
                exclusions.
              </p>
            </div>
          </div>

          {/* Trigger Options */}
          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Trigger on Import</label>
            <div className="flex items-center">
              <Switch checked={triggerOnImport} onCheckedChange={setTriggerOnImport} />
            </div>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Trigger on API push</label>
            <div className="flex items-center">
              <Switch checked={triggerOnApiPush} onCheckedChange={setTriggerOnApiPush} />
            </div>
          </div>

          <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Trigger if Lead Import creates Opportunities</label>
            <div className="flex items-center">
              <Switch
                checked={triggerOnLeadImportOpportunities}
                onCheckedChange={setTriggerOnLeadImportOpportunities}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={!title || !startTime || !endTime}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save & Publish
          </Button>
        </div>
      </div>
    </>
  )
}
