"use client"

import { useState, useEffect } from "react"
import { HabitList } from "@/components/habit-list"
import { NewHabitForm } from "@/components/new-habit-form"
import { HabitStats } from "@/components/habit-stats"
import { MobileNav } from "@/components/mobile-nav"
import { Achievements } from "@/components/achievements"
import { Settings } from "@/components/settings"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Habit, Achievement } from "@/lib/types"
import { AnimatePresence, motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { calculateAchievements } from "@/lib/achievements"
import { initializeNotifications, scheduleNotification, clearScheduledNotification } from "@/lib/notifications"

export function HabitDashboard() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [activeTab, setActiveTab] = useState("habits")
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState("20:00")
  const { toast } = useToast()
  const isMobile = useMobile()

  // Load habits and settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedHabits = localStorage.getItem("habits")
      const savedAchievements = localStorage.getItem("achievements")
      const savedSettings = localStorage.getItem("habitSettings")

      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits)
        console.log("Loaded habits from localStorage:", parsedHabits)
        setHabits(parsedHabits)
      } else {
        console.log("No habits found in localStorage")
      }

      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements))
      }

      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setReminderEnabled(settings.reminderEnabled || false)
        setReminderTime(settings.reminderTime || "20:00")
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      // Initialize with empty state if there's an error
      setHabits([])
      setAchievements([])
    }
  }, [])

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))

    // Check for new achievements
    const newAchievements = calculateAchievements(habits, achievements)
    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements]
      setAchievements(updatedAchievements)
      localStorage.setItem("achievements", JSON.stringify(updatedAchievements))

      // Show toast for new achievements
      newAchievements.forEach((achievement) => {
        toast({
          title: "🏆 New Achievement Unlocked!",
          description: achievement.name,
          duration: 5000,
        })
      })
    }
  }, [habits, achievements, toast])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "habitSettings",
      JSON.stringify({
        reminderEnabled,
        reminderTime,
      }),
    )
  }, [reminderEnabled, reminderTime])

  // Initialize notifications on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize notifications based on current settings
      initializeNotifications()
    }
  }, [])

  const addHabit = (habit: Habit) => {
    console.log("Adding habit:", habit);
    try {
      // Create a new array to avoid reference issues
      const updatedHabits = [...habits, habit];
      
      // Update state
      setHabits(updatedHabits);
      
      // Save to localStorage immediately
      localStorage.setItem("habits", JSON.stringify(updatedHabits));
      
      // Show success toast
      toast({
        title: "Habit created",
        description: `${habit.name} has been added to your habits.`,
      });
      
      console.log("Updated habits:", updatedHabits);
    } catch (error) {
      console.error("Error adding habit:", error);
      toast({
        title: "Error",
        description: "There was a problem adding your habit. Please try again.",
        variant: "destructive",
      });
    }
  }

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const completedDates = new Set(habit.completedDates)
          const wasCompleted = completedDates.has(date)

          if (wasCompleted) {
            completedDates.delete(date)
          } else {
            completedDates.add(date)
            // Only show toast when marking as complete, not when unmarking
            toast({
              title: "Habit completed! 🎉",
              description: `You've completed "${habit.name}" for today.`,
              duration: 3000,
            })
          }

          return {
            ...habit,
            completedDates: Array.from(completedDates),
          }
        }
        return habit
      }),
    )
  }

  const deleteHabit = (habitId: string) => {
    const habitToDelete = habits.find((h) => h.id === habitId)
    setHabits(habits.filter((habit) => habit.id !== habitId))

    if (habitToDelete) {
      toast({
        title: "Habit deleted",
        description: `${habitToDelete.name} has been removed.`,
        variant: "destructive",
      })
    }
  }

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit)))

    toast({
      title: "Habit updated",
      description: `${updatedHabit.name} has been updated.`,
    })
  }

  const updateSettings = (enabled: boolean, time: string) => {
    setReminderEnabled(enabled)
    setReminderTime(time)

    toast({
      title: "Settings saved",
      description: enabled ? `Reminders set for ${time}` : "Reminders disabled",
    })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "habits":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {habits.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4 text-muted-foreground"
              >
                Welcome to <span className="font-bold text-primary">RoutineX</span>! Add your first habit to get
                started.
              </motion.div>
            )}
            <NewHabitForm onAddHabit={addHabit} />
            <HabitList
              habits={habits}
              onToggleCompletion={toggleHabitCompletion}
              onDeleteHabit={deleteHabit}
              onUpdateHabit={updateHabit}
            />
          </motion.div>
        )
      case "stats":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HabitStats habits={habits} />
          </motion.div>
        )
      case "achievements":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Achievements achievements={achievements} />
          </motion.div>
        )
      case "settings":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Settings reminderEnabled={reminderEnabled} reminderTime={reminderTime} onUpdateSettings={updateSettings} />
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {isMobile ? (
        <>
          <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
          <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="habits">My Habits</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
        </Tabs>
      )}
    </div>
  )
}

