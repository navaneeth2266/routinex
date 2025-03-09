import type { Achievement, Habit } from "@/lib/types"
import { format, subDays } from "date-fns"

export const AVAILABLE_ACHIEVEMENTS = [
  {
    id: "first-habit",
    name: "First Steps",
    description: "Create your first habit",
    icon: "🌱",
  },
  {
    id: "five-habits",
    name: "Habit Collector",
    description: "Create 5 different habits",
    icon: "🌟",
  },
  {
    id: "perfect-day",
    name: "Perfect Day",
    description: "Complete all habits in a single day",
    icon: "🏆",
  },
  {
    id: "three-day-streak",
    name: "Momentum",
    description: "Complete all habits for 3 days in a row",
    icon: "🔥",
  },
  {
    id: "seven-day-streak",
    name: "Habit Master",
    description: "Complete all habits for 7 days in a row",
    icon: "👑",
  },
  {
    id: "diverse-habits",
    name: "Well-Rounded",
    description: "Create habits in at least 3 different categories",
    icon: "🌈",
  },
  {
    id: "thirty-completions",
    name: "Dedication",
    description: "Complete habits 30 times in total",
    icon: "💪",
  },
  {
    id: "high-priority",
    name: "Prioritizer",
    description: "Create a high priority habit and complete it 5 times",
    icon: "⭐",
  },
]

export function calculateAchievements(habits: Habit[], existingAchievements: Achievement[]): Achievement[] {
  const newAchievements: Achievement[] = []
  const now = new Date().toISOString()

  // Helper function to check if achievement is already unlocked
  const isUnlocked = (id: string) => existingAchievements.some((a) => a.id === id)

  // First habit
  if (habits.length > 0 && !isUnlocked("first-habit")) {
    newAchievements.push({
      id: "first-habit",
      name: "First Steps",
      description: "Create your first habit",
      icon: "🌱",
      unlockedAt: now,
    })
  }

  // 5 habits
  if (habits.length >= 5 && !isUnlocked("five-habits")) {
    newAchievements.push({
      id: "five-habits",
      name: "Habit Collector",
      description: "Create 5 different habits",
      icon: "🌟",
      unlockedAt: now,
    })
  }

  // Perfect day
  const today = format(new Date(), "yyyy-MM-dd")
  const allCompletedToday = habits.length > 0 && habits.every((habit) => habit.completedDates.includes(today))

  if (allCompletedToday && !isUnlocked("perfect-day")) {
    newAchievements.push({
      id: "perfect-day",
      name: "Perfect Day",
      description: "Complete all habits in a single day",
      icon: "🏆",
      unlockedAt: now,
    })
  }

  // Streak achievements
  let currentStreak = 0
  if (habits.length > 0) {
    if (allCompletedToday) {
      currentStreak = 1
      let checkDate = subDays(new Date(), 1)

      while (true) {
        const dateString = format(checkDate, "yyyy-MM-dd")
        const allCompletedOnDate = habits.every((habit) => habit.completedDates.includes(dateString))

        if (!allCompletedOnDate) break

        currentStreak++
        checkDate = subDays(checkDate, 1)
      }
    }
  }

  if (currentStreak >= 3 && !isUnlocked("three-day-streak")) {
    newAchievements.push({
      id: "three-day-streak",
      name: "Momentum",
      description: "Complete all habits for 3 days in a row",
      icon: "🔥",
      unlockedAt: now,
    })
  }

  if (currentStreak >= 7 && !isUnlocked("seven-day-streak")) {
    newAchievements.push({
      id: "seven-day-streak",
      name: "Habit Master",
      description: "Complete all habits for 7 days in a row",
      icon: "👑",
      unlockedAt: now,
    })
  }

  // Diverse habits
  const categories = new Set(habits.map((habit) => habit.category))
  if (categories.size >= 3 && !isUnlocked("diverse-habits")) {
    newAchievements.push({
      id: "diverse-habits",
      name: "Well-Rounded",
      description: "Create habits in at least 3 different categories",
      icon: "🌈",
      unlockedAt: now,
    })
  }

  // 30 completions total
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0)

  if (totalCompletions >= 30 && !isUnlocked("thirty-completions")) {
    newAchievements.push({
      id: "thirty-completions",
      name: "Dedication",
      description: "Complete habits 30 times in total",
      icon: "💪",
      unlockedAt: now,
    })
  }

  // High priority habit completed 5 times
  const highPriorityHabits = habits.filter((habit) => habit.priority === 3)
  const highPriorityCompletions = highPriorityHabits.some((habit) => habit.completedDates.length >= 5)

  if (highPriorityCompletions && !isUnlocked("high-priority")) {
    newAchievements.push({
      id: "high-priority",
      name: "Prioritizer",
      description: "Create a high priority habit and complete it 5 times",
      icon: "⭐",
      unlockedAt: now,
    })
  }

  return newAchievements
}

