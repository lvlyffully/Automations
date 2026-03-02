import { cn } from "@/lib/utils"

interface SettingsSidebarProps {
  className?: string
}

export function SettingsSidebar({ className }: SettingsSidebarProps) {
  const menuItems = [
    {
      title: "CRM",
      description: "Basic Settings to help you get your CRM up and running",
      isActive: false,
    },
    {
      title: "Opportunity",
      description: "Configure your opportunity",
      isActive: false,
    },
    {
      title: "Account Setup",
      description: "Configure the Client Setup",
      isActive: true,
    },
    {
      title: "Security",
      description: "Enable two factor authentication",
      isActive: false,
    },
    {
      title: "Communication",
      description: "Configure your Email, SMS & Whatsapp Accounts",
      isActive: false,
    },
    {
      title: "Campaign Management",
      description: "Configure your campaign attribution setup",
      isActive: false,
    },
    {
      title: "Query Manager",
      description: "Setup your Candidate Support System",
      isActive: false,
    },
    {
      title: "Application Settings",
      description: "Configure your application Flow",
      isActive: false,
    },
    {
      title: "Post Application",
      description: "Customize your Post application flow",
      isActive: false,
    },
    {
      title: "Mobile Application",
      description: "Configure your NoPaperForms Mobile App",
      isActive: false,
    },
    {
      title: "Agent Module",
      description: "Configure your Agents needs here",
      isActive: false,
    },
  ]

  return (
    <div className={cn("w-64 bg-background border-r h-full overflow-y-auto flex-shrink-0", className)}>
      <div className="py-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "px-6 py-4 cursor-pointer hover:bg-muted border-l-4 border-transparent transition-colors",
              item.isActive && "bg-primary/10 border-primary",
            )}
          >
            <h3 className={cn("text-sm font-medium text-foreground", item.isActive && "text-primary")}>{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-snug">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
