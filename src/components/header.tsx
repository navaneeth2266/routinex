"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function Header() {
  const isMobile = useMobile()

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container mx-auto py-3 px-4 sm:px-0">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="bg-primary text-primary-foreground p-1.5 rounded-lg"
            >
              <Activity className="h-5 w-5" />
            </motion.div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-primary">Routine</span>
              <span className="text-foreground">X</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-2">
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                Build better habits, one day at a time
              </motion.div>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

