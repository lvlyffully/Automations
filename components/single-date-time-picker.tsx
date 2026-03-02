"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react"

interface SingleDateTime {
  date: Date
  time: string
}

interface SingleDateTimePickerProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (singleDate: SingleDateTime) => void
  initialDate?: SingleDateTime
}

export function SingleDateTimePicker({ isOpen, onClose, onConfirm, initialDate }: SingleDateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate?.date || new Date())
  const [selectedTime, setSelectedTime] = useState(initialDate?.time || "12:00")
  const [currentMonth, setCurrentMonth] = useState(initialDate?.date || new Date())

  const handleConfirm = () => {
    onConfirm({
      date: selectedDate,
      time: selectedTime,
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
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected = isSameDay(date, selectedDate)
      const isToday = isSameDay(date, new Date())

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`w-10 h-10 text-sm rounded-md hover:bg-accent transition-colors ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : isToday
                ? "bg-info text-info-foreground font-medium"
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
            <div key={day} className="w-10 h-10 text-xs font-medium text-gray-500 flex items-center justify-center">
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">Select Date & Time</h3>
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
                <CalendarIcon className="w-5 h-5 text-primary" />
                <span className="font-medium">Select Date</span>
              </div>

              {renderCalendar()}
            </div>

            {/* Time & Summary Section */}
            <div className="space-y-6">
              {/* Time Selection */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">Select Time</span>
                </div>

                <div>
                  <Label htmlFor="selected-time" className="text-sm font-medium">
                    Time
                  </Label>
                  <Input
                    id="selected-time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Selected Date Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Selected Date & Time</h4>
                <div className="text-sm">
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    at {formatTime(selectedTime)}
                  </span>
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
