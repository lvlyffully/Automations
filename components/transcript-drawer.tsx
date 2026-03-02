"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TranscriptDrawerProps {
  isOpen: boolean
  onClose: () => void
  transcript: string
  recordingUrl?: string
}

export function TranscriptDrawer({ isOpen, onClose, transcript, recordingUrl }: TranscriptDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-1/2 bg-background border-l shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Call Transcript</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {recordingUrl && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Call Recording</h3>
                <audio controls className="w-full" preload="metadata">
                  <source src={recordingUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-3">Transcript</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{transcript}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
