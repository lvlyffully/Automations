"use client"

import { useState } from "react"
import { Users, Target, Activity, SettingsIcon, BarChart3, FileText, Zap, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { icon: Users, label: "Manage Leads", href: "/leads" },
    { icon: Target, label: "Manage Opportunities", href: "/opportunities" },
    { icon: Activity, label: "Manage Dynamic Activities", href: "/activities" },
    { icon: SettingsIcon, label: "Manage Dynamic Activities Config", href: "/activities-config" },
    { icon: BarChart3, label: "View Communication Performance", href: "/communication-logs" },
    { icon: FileText, label: "View Detailed Report", href: "/detailed-report" },
    { icon: Zap, label: "Manage Automations", href: "/" },
    { icon: Wallet, label: "METS Wallet", href: "/wallet" },
  ]

  return (
    <div
      className={`bg-slate-900 h-screen transition-all duration-300 ease-in-out flex flex-col ${
        isExpanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        {isExpanded && (
          <span className="text-white font-semibold text-lg whitespace-nowrap overflow-hidden">meritto</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        <div className="flex flex-col space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
