"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { ModeToggle } from "@/components/mode-toggle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Save, Bell, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Add BeforeInstallPromptEvent type
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface SettingsProps {
  reminderEnabled: boolean
  reminderTime: string
  onUpdateSettings: (enabled: boolean, time: string) => void
}

export function Settings({ reminderEnabled, reminderTime, onUpdateSettings }: SettingsProps) {
  const [enabled, setEnabled] = useState(reminderEnabled)
  const [time, setTime] = useState(reminderTime)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isAppInstalled, setIsAppInstalled] = useState(false)
  const { toast } = useToast()

  // Check if the app is already installed as PWA
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if in standalone mode (already installed)
      setIsAppInstalled(window.matchMedia('(display-mode: standalone)').matches)

      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        setInstallPrompt(e as BeforeInstallPromptEvent)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleSaveSettings = () => {
    onUpdateSettings(enabled, time)
  }

  const handleClearData = () => {
    localStorage.clear()
    window.location.reload()
  }

  const handleInstallApp = async () => {
    if (installPrompt) {
      await installPrompt.prompt()
      const result = await installPrompt.userChoice
      
      if (result.outcome === 'accepted') {
        toast({
          title: "Installation Started",
          description: "RoutineX is being installed on your device",
        })
        setInstallPrompt(null)
        setIsAppInstalled(true)
      }
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      
      if (isIOS) {
        toast({
          title: "Install on iOS",
          description: "Tap the share button and select 'Add to Home Screen'",
          duration: 5000,
        })
      } else {
        toast({
          title: "Installation",
          description: "Open in Chrome and look for the install option in the address bar or menu",
          duration: 5000,
        })
      }
    }
  }

  const resetInstallBanner = () => {
    localStorage.removeItem("pwaInstallDismissed")
    toast({
      title: "Install Banner Reset",
      description: "The installation banner will show again on your next visit",
    })
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <ModeToggle />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>App Installation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Install RoutineX as an app on your device for quick access and offline use.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handleInstallApp}
                  disabled={isAppInstalled}
                  variant="default"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isAppInstalled ? "Already Installed" : "Install App"}
                </Button>
                
                <Button 
                  onClick={resetInstallBanner}
                  variant="outline"
                  size="icon"
                  title="Reset installation banner"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminder-toggle">Daily Reminder</Label>
                <p className="text-sm text-muted-foreground">Receive a reminder to complete your habits</p>
              </div>
              <Switch id="reminder-toggle" checked={enabled} onCheckedChange={setEnabled} />
            </div>

            {enabled && (
              <div className="pt-2">
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input id="reminder-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  <Button onClick={handleSaveSettings} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <Bell className="h-3 w-3 inline-block mr-1" />
                  Note: This is a demo feature. In a real app, this would send actual notifications.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your habits, achievements, and
                    settings data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>Yes, clear all data</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

