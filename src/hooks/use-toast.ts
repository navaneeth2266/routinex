"use client"

import { useState, useEffect } from "react"

type ToastProps = {
  title: string
  description?: string
  duration?: number
  variant?: "default" | "destructive"
}

type Toast = ToastProps & {
  id: string
  visible: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    // Clean up toasts that have been dismissed
    const interval = setInterval(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.visible))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const toast = ({ title, description, duration = 3000, variant = "default" }: ToastProps) => {
    const id = crypto.randomUUID()

    // Add the toast
    setToasts((prevToasts) => [...prevToasts, { id, title, description, duration, variant, visible: true }])

    // Set a timeout to dismiss the toast
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, visible: false } : t)))
    }, duration)
  }

  return { toast, toasts }
}

