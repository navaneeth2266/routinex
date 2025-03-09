"use client"

import { useState, useEffect } from "react"

import { useToast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

export function ToastContainer() {
  const { toasts } = useToast()

  // Create portal for toasts
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Create container if it doesn't exist
    let toastContainer = document.getElementById("toast-container")

    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.id = "toast-container"
      toastContainer.className = "fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-sm"
      document.body.appendChild(toastContainer)
    }

    setContainer(toastContainer)

    return () => {
      // Clean up if component unmounts
      if (toastContainer && toastContainer.parentNode) {
        toastContainer.parentNode.removeChild(toastContainer)
      }
    }
  }, [])

  if (!container) return null

  return createPortal(
    <AnimatePresence>
      {toasts
        .filter((t) => t.visible)
        .map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={cn(
              "p-4 rounded-lg shadow-lg border",
              "bg-background text-foreground",
              toast.variant === "destructive" && "bg-destructive text-destructive-foreground border-destructive",
            )}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-semibold">{toast.title}</h3>
                {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
              </div>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  // Mark toast as not visible
                  const event = new CustomEvent("toast-dismiss", { detail: { id: toast.id } })
                  document.dispatchEvent(event)
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
    </AnimatePresence>,
    container,
  )
}

