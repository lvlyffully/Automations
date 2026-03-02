"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CallDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  callSummary: string
  recordingUrl?: string
  transcript?: string
  duration: number
}

export function CallDetailsDrawer({
  isOpen,
  onClose,
  callSummary,
  recordingUrl,
  transcript,
  duration,
}: CallDetailsDrawerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false)

  if (!isOpen) return null

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 bottom-0 w-1/2 bg-background shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Call Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-8 w-8">
            ×
          </Button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Call Summary Note</h3>
              <div className="bg-accent border border-accent/30 rounded-lg p-4">
                <p className="text-sm text-foreground leading-relaxed">{callSummary}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Call Recording</h3>
              {recordingUrl ? (
                <div className="bg-background rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={togglePlay}>
                      {isPlaying ? "⏸" : "▶"}
                    </Button>
                    <div className="flex-1 h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-accent-foreground rounded-full transition-all duration-300"
                        style={{ width: isPlaying ? "45%" : "0%" }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">{duration}s</div>
                    <div className="text-muted-foreground">🔊</div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted rounded-lg border border-border p-4 text-sm text-muted-foreground">
                  No recording available for this call.
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Transcript</h3>
                {transcript && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                    className="text-primary hover:text-primary/80"
                  >
                    {isTranscriptExpanded ? <>Hide Transcript ▲</> : <>View Transcript ▼</>}
                  </Button>
                )}
              </div>
              {isTranscriptExpanded && transcript && (
                <div className="bg-background rounded-lg border border-border p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                    {transcript}
                  </pre>
                </div>
              )}
              {!transcript && (
                <div className="bg-muted rounded-lg border border-border p-4 text-sm text-muted-foreground">
                  Transcript not available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
