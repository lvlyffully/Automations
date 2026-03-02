"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Phone, CheckCircle2, Loader2, AlertCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MioAiCallingDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  existingConfig?: any
}

const countryCodes = [
  { code: "+91", name: "India", enabled: true, digitCount: 10, placeholder: "Enter 10-digit Indian mobile number" },
  { code: "+1", name: "USA/Canada", enabled: false, digitCount: 10, placeholder: "Enter 10-digit number" },
  { code: "+44", name: "UK", enabled: false, digitCount: 10, placeholder: "Enter phone number" },
  { code: "+61", name: "Australia", enabled: false, digitCount: 9, placeholder: "Enter phone number" },
  { code: "+65", name: "Singapore", enabled: false, digitCount: 8, placeholder: "Enter phone number" },
  { code: "+971", name: "UAE", enabled: false, digitCount: 9, placeholder: "Enter phone number" },
]

type TestCallStatus = "idle" | "initiating" | "ringing" | "connected" | "completed" | "failed"

export function MioAiCallingDrawer({ isOpen, onClose, onSave, existingConfig }: MioAiCallingDrawerProps) {
  const { toast } = useToast()

  const [blockName, setBlockName] = useState(existingConfig?.blockName || "")
  const [blockNameError, setBlockNameError] = useState("")

  // Section 1: Choose AI Agent
  const [selectedAgent, setSelectedAgent] = useState(existingConfig?.selectedAgent || "")
  const [agentError, setAgentError] = useState("")

  // Section 2: Add Campaign Details (moved up from step 3)
  const [campaignName, setCampaignName] = useState(existingConfig?.campaignName || "")
  const [campaignType, setCampaignType] = useState(existingConfig?.campaignType || "")
  const [isCreatingNewCampaignType, setIsCreatingNewCampaignType] = useState(false)
  const [newCampaignType, setNewCampaignType] = useState("")
  const [campaignNameError, setCampaignNameError] = useState("")
  const [campaignTypeError, setCampaignTypeError] = useState("")

  // Section 3: Test Call (Optional - moved down from step 2)
  const [selectedCountryCode, setSelectedCountryCode] = useState(existingConfig?.countryCode || "+91")
  const [testPhoneNumber, setTestPhoneNumber] = useState(existingConfig?.testPhoneNumber || "")
  const [phoneError, setPhoneError] = useState("")
  const [testCallStatus, setTestCallStatus] = useState<TestCallStatus>("idle")
  const [callStatusHistory, setCallStatusHistory] = useState<string[]>([])
  const [testCallSummary, setTestCallSummary] = useState<{
    duration: string
    recording?: string
    transcript?: string
  } | null>(null)

  const [saveError, setSaveError] = useState("")

  const predefinedAgents = ["Lead Qualification Agent", "Sales Agent", "Support Agent"]

  const [existingCampaignTypes, setExistingCampaignTypes] = useState(["Automation", "Follow-up", "Re-engagement"])

  const [isBlockNameComplete, setIsBlockNameComplete] = useState(!!existingConfig?.blockName)
  const [isAgentComplete, setIsAgentComplete] = useState(!!existingConfig?.selectedAgent)
  const [isCampaignComplete, setIsCampaignComplete] = useState(
    !!(existingConfig?.campaignName && existingConfig?.campaignType),
  )
  const [isTestCallSkipped, setIsTestCallSkipped] = useState(false)

  const validatePhoneNumber = (phone: string, countryCode: string): string => {
    const country = countryCodes.find((c) => c.code === countryCode)
    if (!country) return "Invalid country code"

    if (!phone) return "Enter a valid phone number"
    if (!/^\d+$/.test(phone)) return "Phone number must contain digits only"
    if (phone.length !== country.digitCount) return `Enter a valid ${country.digitCount}-digit phone number`

    // India-specific validation
    if (countryCode === "+91") {
      if (phone.startsWith("0")) return "Number cannot start with 0"
      // Check for repeated sequences
      if (/^(\d)\1{9}$/.test(phone)) return "This does not appear to be a valid mobile number"
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

    setCallStatusHistory([])

    setTestCallStatus("initiating")
    setCallStatusHistory((prev) => [...prev, "Initiating call..."])
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setTestCallStatus("connected")
    setCallStatusHistory((prev) => [...prev, "Connected"])
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setTestCallStatus("completed")
    setCallStatusHistory((prev) => [...prev, "Call completed"])

    setTestCallSummary({
      duration: "2 seconds",
      recording: "mock-recording-url",
      transcript: "Test call completed successfully.",
    })

    toast({
      title: "Test Call Successful",
      description: "Your agent configuration has been verified.",
    })
  }

  const handleRetryTestCall = () => {
    setTestCallStatus("idle")
    setTestCallSummary(null)
    setCallStatusHistory([])
  }

  const handleAddCampaignType = () => {
    if (!newCampaignType.trim()) {
      setCampaignTypeError("Campaign Type cannot be empty")
      return
    }

    if (existingCampaignTypes.includes(newCampaignType.trim())) {
      setCampaignTypeError("This type already exists")
      return
    }

    setExistingCampaignTypes((prev) => [...prev, newCampaignType.trim()])
    setCampaignType(newCampaignType.trim())
    setIsCreatingNewCampaignType(false)
    setNewCampaignType("")
    setCampaignTypeError("")
  }

  const handleSave = async () => {
    let hasError = false

    if (!blockName.trim()) {
      setBlockNameError("Block Name cannot be empty")
      hasError = true
    }

    if (!selectedAgent) {
      setAgentError("Please select an AI Agent")
      hasError = true
    }

    if (!campaignName.trim()) {
      setCampaignNameError("Campaign Name is required")
      hasError = true
    }

    const finalCampaignType = isCreatingNewCampaignType ? newCampaignType : campaignType
    if (!finalCampaignType.trim()) {
      setCampaignTypeError("Please select a Campaign Type")
      hasError = true
    }

    if (isCreatingNewCampaignType && existingCampaignTypes.includes(newCampaignType.trim())) {
      setCampaignTypeError("This type already exists")
      hasError = true
    }

    if (hasError) return

    try {
      const configData = {
        blockName: blockName.trim(),
        selectedAgent,
        countryCode: selectedCountryCode,
        testPhoneNumber: testPhoneNumber || undefined,
        testCallPerformed: testCallStatus === "completed",
        campaignName: campaignName.trim(),
        campaignType: finalCampaignType.trim(),
        dryRunData:
          testCallStatus === "completed"
            ? {
                phoneNumber: selectedCountryCode + testPhoneNumber,
                duration: testCallSummary?.duration,
                transcript: testCallSummary?.transcript,
                recording: testCallSummary?.recording,
              }
            : undefined,
      }

      onSave(configData)

      toast({
        title: "Success",
        description: existingConfig
          ? "Mio AI Calling node updated successfully"
          : "Mio AI Calling node configured successfully",
      })

      handleClose()
    } catch (error: any) {
      setSaveError(error.message || "Could not save node. Please try again.")
    }
  }

  const handleClose = () => {
    // Reset all state
    setBlockName(existingConfig?.blockName || "")
    setBlockNameError("")
    setSelectedAgent(existingConfig?.selectedAgent || "")
    setAgentError("")
    setSelectedCountryCode(existingConfig?.countryCode || "+91")
    setTestPhoneNumber(existingConfig?.testPhoneNumber || "")
    setPhoneError("")
    setTestCallStatus("idle")
    setCallStatusHistory([])
    setTestCallSummary(null)
    setCampaignName(existingConfig?.campaignName || "")
    setCampaignType(existingConfig?.campaignType || "")
    setIsCreatingNewCampaignType(false)
    setNewCampaignType("")
    setCampaignNameError("")
    setCampaignTypeError("")
    setSaveError("")
    onClose()
  }

  const handleCountryCodeChange = (newCode: string) => {
    if (newCode !== selectedCountryCode) {
      setTestPhoneNumber("")
      setPhoneError("")
      setTestCallStatus("idle")
      setTestCallSummary(null)
      setCallStatusHistory([])
    }
    setSelectedCountryCode(newCode)
  }

  const handleBlockNameChange = (value: string) => {
    setBlockName(value)
    setBlockNameError("")
    setIsBlockNameComplete(value.trim().length > 0)
  }

  const handleAgentChange = (value: string) => {
    setSelectedAgent(value)
    setAgentError("")
    setIsAgentComplete(true)
  }

  const handleCampaignNameChange = (value: string) => {
    setCampaignName(value)
    setCampaignNameError("")
    checkCampaignCompletion(value, campaignType)
  }

  const handleCampaignTypeChange = (value: string) => {
    if (value === "__create_new__") {
      setIsCreatingNewCampaignType(true)
      setCampaignType("")
      setCampaignTypeError("")
    } else {
      setCampaignType(value)
      setCampaignTypeError("")
      checkCampaignCompletion(campaignName, value)
    }
  }

  const checkCampaignCompletion = (name: string, type: string) => {
    setIsCampaignComplete(name.trim().length > 0 && type.trim().length > 0)
  }

  const handleSkipTestCall = () => {
    setIsTestCallSkipped(true)
  }

  if (!isOpen) return null

  const steps = [
    { label: "Agent", completed: isAgentComplete },
    { label: "Campaign", completed: isCampaignComplete },
    { label: "Test Call", completed: testCallStatus === "completed" || isTestCallSkipped },
  ]

  const currentCountry = countryCodes.find((c) => c.code === selectedCountryCode)!

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/60" onClick={handleClose} />
      <div className="ml-auto w-1/2 min-w-[600px] max-w-[800px] bg-white h-full shadow-xl flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">MIO AI Calling Agent</h2>
              <p className="text-sm text-muted-foreground">Automate Your Calls with MIO calling Agent</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.completed
                        ? "bg-green-600 text-white"
                        : index === 0 && !isBlockNameComplete
                          ? "bg-green-600 text-white"
                          : index === 1 && isAgentComplete && !isCampaignComplete
                            ? "bg-green-600 text-white"
                            : index === 2 && isCampaignComplete
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && <div className="h-0.5 bg-green-600 flex-1 mx-3" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div className="flex-1">
                <h3 className="text-base font-semibold">Add Block Name</h3>
                <Input
                  placeholder="Enter block name"
                  value={blockName}
                  onChange={(e) => handleBlockNameChange(e.target.value)}
                  className={`mt-2 ${blockNameError ? "border-destructive" : ""}`}
                />
                {blockNameError && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {blockNameError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isBlockNameComplete && (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1 space-y-3">
                  <h3 className="text-base font-semibold">Step 1: Choose AI Agent</h3>
                  <Select value={selectedAgent} onValueChange={handleAgentChange}>
                    <SelectTrigger className={agentError ? "border-destructive" : ""}>
                      <SelectValue placeholder="Search..." />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedAgents.map((agent) => (
                        <SelectItem key={agent} value={agent}>
                          {agent}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {agentError && (
                    <p className="text-sm text-destructive flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {agentError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {isAgentComplete && (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1 space-y-4">
                  <h3 className="text-base font-semibold">Step 2: Add Campaign Details</h3>

                  <div className="space-y-2">
                    <Input
                      placeholder="Enter campaign name"
                      value={campaignName}
                      onChange={(e) => handleCampaignNameChange(e.target.value)}
                      className={campaignNameError ? "border-destructive" : ""}
                    />
                    {campaignNameError && (
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {campaignNameError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {!isCreatingNewCampaignType ? (
                      <>
                        <Select value={campaignType} onValueChange={handleCampaignTypeChange}>
                          <SelectTrigger className={campaignTypeError ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select Campaign Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__create_new__" className="text-primary font-medium">
                              + Create New Campaign Type
                            </SelectItem>
                            {existingCampaignTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {campaignTypeError && (
                          <p className="text-sm text-destructive flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {campaignTypeError}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="space-y-3">
                        <Input
                          placeholder="Enter new campaign type"
                          value={newCampaignType}
                          onChange={(e) => {
                            setNewCampaignType(e.target.value)
                            setCampaignTypeError("")
                          }}
                          className={campaignTypeError ? "border-destructive" : ""}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleAddCampaignType}>
                            Add
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsCreatingNewCampaignType(false)
                              setNewCampaignType("")
                              setCampaignTypeError("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                        {campaignTypeError && (
                          <p className="text-sm text-destructive flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {campaignTypeError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCampaignComplete && (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-base font-semibold">Step 3: Test Call</h3>
                    <p className="text-sm text-muted-foreground mt-1">Try your selected agent to verify your setup</p>
                  </div>

                  {isTestCallSkipped && testCallStatus === "idle" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      <p className="text-sm text-green-700">Test call skipped</p>
                    </div>
                  )}

                  {testCallStatus === "completed" && testCallSummary && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      <p className="text-sm text-green-700">Test call completed successfully</p>
                    </div>
                  )}

                  {!isTestCallSkipped && testCallStatus === "idle" && (
                    <>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <Select value={selectedCountryCode} onValueChange={handleCountryCodeChange}>
                            <SelectTrigger className="w-[120px]">
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
                                  {country.code} {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Input
                            type="tel"
                            placeholder="Enter test phone number"
                            value={testPhoneNumber}
                            onChange={(e) => handlePhoneNumberChange(e.target.value)}
                            className={phoneError ? "border-destructive" : ""}
                          />
                        </div>

                        {phoneError && (
                          <p className="text-sm text-destructive flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {phoneError}
                          </p>
                        )}
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
                        <p className="text-sm text-yellow-800">Test call will be chargeable</p>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handleSkipTestCall} className="flex-1 bg-transparent">
                          Skip Test Call
                        </Button>
                        <Button
                          onClick={handleStartTestCall}
                          disabled={!testPhoneNumber || !!phoneError}
                          className="flex-1"
                        >
                          Start Test Call
                        </Button>
                      </div>
                    </>
                  )}

                  {(testCallStatus === "initiating" || testCallStatus === "connected") && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      {callStatusHistory.map((status, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {index === callStatusHistory.length - 1 ? (
                            <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                          )}
                          <p className="text-sm font-medium">{status}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-6">
          {saveError && (
            <p className="text-sm text-destructive flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4" />
              {saveError}
            </p>
          )}
          <Button
            onClick={handleSave}
            disabled={
              !blockName.trim() || !selectedAgent || !campaignName.trim() || (!campaignType && !newCampaignType.trim())
            }
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  )
}
