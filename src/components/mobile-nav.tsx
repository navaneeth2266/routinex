"use client"

import { motion } from "framer-motion"
import { CheckSquare, BarChart2, Award, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs = [
    { id: "habits", label: "Habits", icon: <CheckSquare className="h-5 w-5" /> },
    { id: "stats", label: "Stats", icon: <BarChart2 className="h-5 w-5" /> },
    { id: "achievements", label: "Badges", icon: <Award className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 pb-safe"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground",
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="relative">
              {tab.icon}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full"
                  layoutId="activeTabIndicator"
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

