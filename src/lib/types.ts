export interface Habit {
  id: string
  name: string
  category: string
  priority: number // 1 = low, 2 = medium, 3 = high
  note?: string
  createdAt: string
  completedDates: string[] // Array of dates in format "YYYY-MM-DD"
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string | null
}

