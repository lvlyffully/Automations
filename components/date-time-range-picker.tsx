"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react"

interface DateTimeRange {
  startDate: Date
  startTime: string
  endDate: Date
  endTime: string
}

interface DateTimeRangePickerProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (dateRange: DateTimeRange) => void
  initialRange?: DateTimeRange
}

export function DateTimeRangePicker({ isOpen, onClose, onConfirm, initialRange }: DateTimeRangePickerProps) {
  const [startDate, setStartDate] = useState<Date>(initialRange?.startDate || new Date())
  const [endDate, setEndDate] = useState<Date>(initialRange?.endDate || new Date())
  const [startTime, setStartTime] = useState(initialRange?.startTime || "12:00")
  const [endTime, setEndTime] = useState(initialRange?.endTime || "12:00")
  const [selectingStart, setSelectingStart] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleDateSelect = (date: Date) => {
    if (selectingStart) {
      setStartDate(date)
      setSelectingStart(false)
    } else {
      setEndDate(date)
    }
  }

  const handleConfirm = () => {
    onConfirm({
      startDate,
      startTime,
      endDate,
      endTime,
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected = isSameDay(date, selectingStart ? startDate : endDate)
      const isStartDate = isSameDay(date, startDate)
      const isEndDate = isSameDay(date, endDate)

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          className={`w-8 h-8 text-sm rounded-md hover:bg-accent transition-colors ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : isStartDate
                ? "bg-success text-success-foreground"
                : isEndDate
                  ? "bg-destructive/10 text-destructive"
                  : "hover:bg-muted"
          }`}
        >
          {day}
        </button>,
      )
    }

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="w-8 h-8 text-xs font-medium text-gray-500 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Select Date & Time Range</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Select {selectingStart ? "Start" : "End"} Date</span>
              </div>

              {renderCalendar()}

              <div className="flex space-x-2">
                <Button
                  variant={selectingStart ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectingStart(true)}
                  className="flex-1"
                >
                  Start Date
                </Button>
                <Button
                  variant={!selectingStart ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectingStart(false)}
                  className="flex-1"
                >
                  End Date
                </Button>
              </div>
            </div>

            {/* Time & Summary Section */}
            <div className="space-y-6">
              {/* Time Selection */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">Select Times</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="start-time" className="text-sm font-medium">
                      Start Time
                    </Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="end-time" className="text-sm font-medium">
                      End Time
                    </Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Selected Range Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Selected Range</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start:</span>
                    <span className="font-medium">
                      {startDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      at {formatTime(startTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End:</span>
                    <span className="font-medium">
                      {endDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      at {formatTime(endTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-primary hover:bg-primary/90">
            Confirm Selection
          </Button>
        </div>
      </div>
    </div>
  )
}
