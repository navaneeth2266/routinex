"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if already installed or if banner was dismissed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches
    const wasDismissed = localStorage.getItem("pwaInstallDismissed")
    
    if (isInstalled || wasDismissed === "true") {
      return
    }

    const handler = (e: Event) => {
      // Prevent the default browser mini-infobar
      e.preventDefault()
      // Save the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent)
      // Show our custom banner
      setShowBanner(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    
    // If iOS Safari, show banner with different instructions
    if (isIOS && isSafari) {
      setShowBanner(true)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) {
      // For iOS devices or if installPrompt is not available
      toast({
        title: "Install Instructions",
        description: "Tap the share button and select 'Add to Home Screen'",
        duration: 5000,
      })
      return
    }

    // Show the install prompt
    await installPrompt.prompt()
    
    // Wait for user choice
    const choiceResult = await installPrompt.userChoice
    
    if (choiceResult.outcome === "accepted") {
      toast({
        title: "Installation Started",
        description: "RoutineX is being installed on your device",
        duration: 3000,
      })
    }
    
    // Clear the saved prompt
    setInstallPrompt(null)
    setShowBanner(false)
  }

  const dismissBanner = () => {
    setShowBanner(false)
    // Remember the user's preference
    localStorage.setItem("pwaInstallDismissed", "true")
  }

  const resetDismissed = () => {
    localStorage.removeItem("pwaInstallDismissed")
    setShowBanner(true)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-16 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80 bg-card border rounded-lg shadow-lg p-4 z-50"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Install RoutineX
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={dismissBanner}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Install RoutineX on your device for quick access even when offline.
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={dismissBanner}>
            Maybe Later
          </Button>
          <Button variant="default" size="sm" onClick={handleInstall}>
            Install Now
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 