"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, CheckCircle2, XCircle, RotateCcw, Loader2, Play } from "lucide-react"

interface DryRunModalProps {
  isOpen: boolean
  onClose: () => void
  agentName: string
  blockName: string
}

type CallStatus = "initiating" | "ringing" | "connected" | "completed" | "failed"

interface StatusHistoryItem {
  status: CallStatus
  timestamp: Date
}

interface CallSummary {
  duration: string
  recordingUrl: string
  transcript: string
}

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳", enabled: true },
  { code: "+1", country: "USA", flag: "🇺🇸", enabled: false },
  { code: "+44", country: "UK", flag: "🇬🇧", enabled: false },
  { code: "+61", country: "Australia", flag: "🇦🇺", enabled: false },
]

export function DryRunModal({ isOpen, onClose, agentName, blockName }: DryRunModalProps) {
  const [countryCode, setCountryCode] = useState("+91")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([])
  const [callSummary, setCallSummary] = useState<CallSummary | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isCallInProgress, setIsCallInProgress] = useState(false)

  // Load last used number from session storage
  useEffect(() => {
    if (isOpen) {
      const lastNumber = sessionStorage.getItem("dryRun_lastPhoneNumber")
      const lastCode = sessionStorage.getItem("dryRun_lastCountryCode")
      if (lastNumber) setPhoneNumber(lastNumber)
      if (lastCode) setCountryCode(lastCode)
    }
  }, [isOpen])

  // Validate phone number based on country code
  useEffect(() => {
    if (countryCode === "+91") {
      const valid = /^[6-9]\d{9}$/.test(phoneNumber)
      setIsValidPhone(valid)
    } else {
      setIsValidPhone(phoneNumber.length >= 10)
    }
  }, [phoneNumber, countryCode])

  const currentStatus = statusHistory.length > 0 ? statusHistory[statusHistory.length - 1].status : null

  const handleStartCall = async () => {
    setIsCallInProgress(true)
    setStatusHistory([])
    setCallSummary(null)
    setErrorMessage("")

    // Save to session storage
    sessionStorage.setItem("dryRun_lastPhoneNumber", phoneNumber)
    sessionStorage.setItem("dryRun_lastCountryCode", countryCode)

    try {
      // Simulate status progression
      setStatusHistory([{ status: "initiating", timestamp: new Date() }])

      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStatusHistory((prev) => [...prev, { status: "ringing", timestamp: new Date() }])

      await new Promise((resolve) => setTimeout(resolve, 3000))
      setStatusHistory((prev) => [...prev, { status: "connected", timestamp: new Date() }])

      await new Promise((resolve) => setTimeout(resolve, 5000))
      setStatusHistory((prev) => [...prev, { status: "completed", timestamp: new Date() }])

      // Mock call summary
      setCallSummary({
        duration: "2m 34s",
        recordingUrl: "https://example.com/recording.mp3",
        transcript:
          "Hello, this is a test call from Mio AI. The agent responded professionally and completed the conversation successfully.",
      })
      setIsCallInProgress(false)
    } catch (error) {
      setStatusHistory((prev) => [...prev, { status: "failed", timestamp: new Date() }])
      setErrorMessage("Call failed. Please try again.")
      setIsCallInProgress(false)
    }
  }

  const handleRetry = () => {
    setStatusHistory([])
    setCallSummary(null)
    setErrorMessage("")
    setIsCallInProgress(false)
  }

  const handleClose = () => {
    // Reset state when closing
    setStatusHistory([])
    setCallSummary(null)
    setErrorMessage("")
    setIsCallInProgress(false)
    onClose()
  }

  const getStatusIcon = (status: CallStatus) => {
    switch (status) {
      case "initiating":
      case "ringing":
      case "connected":
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success-foreground" />
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />
    }
  }

  const getStatusLabel = (status: CallStatus) => {
    switch (status) {
      case "initiating":
        return "Initiating call..."
      case "ringing":
        return "Ringing..."
      case "connected":
        return "Call connected"
      case "completed":
        return "Call completed successfully"
      case "failed":
        return "Call failed"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-accent-foreground" />
            Send Test Call
          </DialogTitle>
          <DialogDescription>
            Enter the phone number you want to receive the test call on. This will help you verify the agent&apos;s
            voice and behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Agent Info */}
          <div className="bg-accent border border-accent/30 rounded-lg p-3">
            <div className="text-sm text-accent-foreground">
              <span className="font-medium">Testing Agent:</span> {agentName}
            </div>
            <div className="text-xs text-accent-foreground/70 mt-1">Block: {blockName}</div>
          </div>

          {/* Country Code */}
          <div className="space-y-2">
            <Label htmlFor="country-code">Country Code</Label>
            <Select value={countryCode} onValueChange={setCountryCode} disabled={isCallInProgress}>
              <SelectTrigger id="country-code">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_CODES.map((country) => (
                  <SelectItem key={country.code} value={country.code} disabled={!country.enabled}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.code}</span>
                      <span className="text-muted-foreground">({country.country})</span>
                      {!country.enabled && <span className="text-xs text-muted-foreground ml-auto">Coming soon</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <div className="flex gap-2">
              <div className="bg-muted border border-border rounded-md px-3 py-2 text-sm font-medium">
                {countryCode}
              </div>
              <Input
                id="phone-number"
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                disabled={isCallInProgress}
                className="flex-1"
              />
            </div>
            {phoneNumber && !isValidPhone && (
              <p className="text-sm text-destructive">Please enter a valid 10-digit phone number</p>
            )}
          </div>

          {/* Status History */}
          {statusHistory.length > 0 && (
            <div className="space-y-2 bg-muted border border-border rounded-lg p-4">
              <div className="font-medium text-sm text-foreground mb-3">Call Status</div>
              {statusHistory.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  {getStatusIcon(item.status)}
                  <span className="text-foreground">{getStatusLabel(item.status)}</span>
                  <span className="text-muted-foreground text-xs ml-auto">{item.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* Call Summary */}
          {callSummary && (
            <div className="space-y-3 bg-success/10 border border-success/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-success-foreground font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Test Call Completed Successfully
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Duration:</span>
                  <span className="font-medium">{callSummary.duration}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-foreground">Transcript:</span>
                  <p className="text-muted-foreground text-xs bg-background p-2 rounded border border-success/30">
                    {callSummary.transcript}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  <Play className="w-3 h-3 mr-2" />
                  Play Recording
                </Button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                <XCircle className="w-5 h-5" />
                Call Failed
              </div>
              <p className="text-sm text-destructive/80">{errorMessage}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {currentStatus === "completed" || currentStatus === "failed" ? (
              <>
                <Button onClick={handleRetry} variant="outline" className="flex-1 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Test Again
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  disabled={isCallInProgress}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={handleStartCall} disabled={!isValidPhone || isCallInProgress} className="flex-1">
                  {isCallInProgress ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calling...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Start Test Call
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
