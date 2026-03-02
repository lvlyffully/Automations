"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Loader2, Play, CheckCircle2, AlertCircle } from "lucide-react"

interface TestCallModalProps {
  isOpen: boolean
  onClose: () => void
}

const countryCodes = [
  { code: "+91", name: "India", enabled: true, digitCount: 10, placeholder: "Enter 10-digit Indian mobile number" },
  { code: "+1", name: "USA", enabled: false, digitCount: 10, placeholder: "Enter 10-digit number" },
  { code: "+44", name: "UK", enabled: false, digitCount: 10, placeholder: "Enter phone number" },
  { code: "+61", name: "Australia", enabled: false, digitCount: 9, placeholder: "Enter phone number" },
  { code: "+971", name: "UAE", enabled: false, digitCount: 9, placeholder: "Enter phone number" },
]

type TestCallStatus = "idle" | "initiating" | "ringing" | "connected" | "completed" | "failed"

export function TestCallModal({ isOpen, onClose }: TestCallModalProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91")
  const [testPhoneNumber, setTestPhoneNumber] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [testCallStatus, setTestCallStatus] = useState<TestCallStatus>("idle")
  const [testCallSummary, setTestCallSummary] = useState<{
    duration: string
    recording?: string
    transcript?: string
  } | null>(null)

  const validatePhoneNumber = (phone: string, countryCode: string): string => {
    const country = countryCodes.find((c) => c.code === countryCode)
    if (!country) return "Invalid country code"

    if (!phone) return "Phone number is required"
    if (!/^\d+$/.test(phone)) return "Only digits allowed"
    if (phone.length !== country.digitCount) return `Must be exactly ${country.digitCount} digits`

    if (countryCode === "+91") {
      if (phone.startsWith("0")) return "Cannot start with 0"
      if (/^(\d)\1{9}$/.test(phone)) return "Invalid repeated pattern"
    }

    return ""
  }

  const handlePhoneNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "")
    const country = countryCodes.find((c) => c.code === selectedCountryCode)
    const maxLength = country?.digitCount || 10
    const trimmedValue = digitsOnly.slice(0, maxLength)

    setTestPhoneNumber(trimmedValue)

    if (trimmedValue) {
      const error = validatePhoneNumber(trimmedValue, selectedCountryCode)
      setPhoneError(error)
    } else {
      setPhoneError("")
    }
  }

  const handleStartTestCall = async () => {
    const error = validatePhoneNumber(testPhoneNumber, selectedCountryCode)
    if (error) {
      setPhoneError(error)
      return
    }

    console.log("[v0] Starting test call to:", selectedCountryCode + testPhoneNumber)

    setTestCallStatus("initiating")
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setTestCallStatus("ringing")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setTestCallStatus("connected")
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setTestCallStatus("completed")

    setTestCallSummary({
      duration: "26 seconds",
      recording: "mock-recording-url",
      transcript:
        "Agent: Hello! This is a test call from the AI Calling Agent.\nUser: Yes, I can hear you clearly.\nAgent: Great! The test is working perfectly. Thank you!\nUser: You're welcome!",
    })
  }

  const handleRetry = () => {
    setTestCallStatus("idle")
    setTestCallSummary(null)
    setTestPhoneNumber("")
    setPhoneError("")
  }

  const handleClose = () => {
    setTestCallStatus("idle")
    setTestCallSummary(null)
    setTestPhoneNumber("")
    setPhoneError("")
    setSelectedCountryCode("+91")
    onClose()
  }

  const currentCountry = countryCodes.find((c) => c.code === selectedCountryCode)!

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Test This Node</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {testCallStatus === "idle" && (
            <>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Phone Number</Label>

                <div className="flex gap-3">
                  <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem
                          key={country.code}
                          value={country.code}
                          disabled={!country.enabled}
                          className={!country.enabled ? "opacity-50" : ""}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>
                              {country.code} — {country.name}
                            </span>
                            {!country.enabled && (
                              <span className="text-xs text-muted-foreground ml-2">Coming soon</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex-1">
                    <Input
                      type="tel"
                      placeholder={currentCountry.placeholder}
                      value={testPhoneNumber}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      className={phoneError ? "border-destructive" : ""}
                    />
                  </div>
                </div>

                {phoneError && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {phoneError}
                  </p>
                )}
              </div>

              <Button onClick={handleStartTestCall} disabled={!testPhoneNumber || !!phoneError} className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Start Test Call
              </Button>
            </>
          )}

          {(testCallStatus === "initiating" || testCallStatus === "ringing" || testCallStatus === "connected") && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <div>
                  <p className="font-medium">
                    {testCallStatus === "initiating" && "Initiating call..."}
                    {testCallStatus === "ringing" && "Ringing..."}
                    {testCallStatus === "connected" && "Connected"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Calling {selectedCountryCode} {testPhoneNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {testCallStatus === "completed" && testCallSummary && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900 dark:text-green-100">Test call completed</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Call Duration: {testCallSummary.duration}
                    </p>
                  </div>
                </div>
              </div>

              {testCallSummary.recording && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Recording</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Button size="sm" variant="ghost">
                      <Play className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 h-1 bg-muted-foreground/20 rounded-full">
                      <div className="h-full w-0 bg-primary rounded-full" />
                    </div>
                    <span className="text-xs text-muted-foreground">0:00 / 0:26</span>
                  </div>
                </div>
              )}

              {testCallSummary.transcript && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Transcript</Label>
                  <Textarea value={testCallSummary.transcript} readOnly className="min-h-[120px] text-sm" />
                </div>
              )}

              <Button variant="outline" onClick={handleRetry} className="w-full bg-transparent">
                Retry Test Call
              </Button>
            </div>
          )}

          {testCallStatus === "failed" && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive">Test call failed</p>
                    <p className="text-sm text-destructive/80 mt-1">
                      Unable to complete the test call. Please try again.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRetry} className="flex-1 bg-transparent">
                  Retry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTestCallStatus("idle")
                    setTestPhoneNumber("")
                    setPhoneError("")
                  }}
                  className="flex-1"
                >
                  Edit Number
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
