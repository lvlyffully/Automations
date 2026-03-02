"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, Zap, PlayCircle, Settings, HelpCircle, Bell } from "lucide-react"

interface NavHeaderProps {
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
}

export function NavHeader({ showBackButton, backHref, backLabel }: NavHeaderProps) {
  return (
    <div className="bg-background border-b px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && backHref && (
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = backHref)}>
              ← {backLabel || "Back"}
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="font-medium">Demo Institute</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-primary">
            <span className="mr-1">✨</span>
            <span>Ask Mio AI</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
            <Zap className="w-4 h-4 mr-1" />
            <span>Go to Automation</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/opportunity-playground")}>
            <PlayCircle className="w-4 h-4 mr-1" />
            <span>Opportunity List Playground</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/account-setup")}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-medium">PV</span>
          </div>
        </div>
      </div>
    </div>
  )
}
