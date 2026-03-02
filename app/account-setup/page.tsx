"use client"

import { AccountSetupPage } from "@/components/account-setup-page"
import { Sidebar } from "@/components/sidebar"

export default function AccountSetup() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <AccountSetupPage />
      </div>
    </div>
  )
}
