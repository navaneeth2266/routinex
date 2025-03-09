"use client"

import { useMemo } from "react"
import type { Habit } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format, parseISO, startOfToday, subDays } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Award, Calendar, Flame, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

interface HabitStatsProps {
  habits: Habit[]
}

export function HabitStats({ habits }: HabitStatsProps) {
  const today = startOfToday()
  const isMobile = useMobile()

  const stats = useMemo(() => {
    if (habits.length === 0) {
      return {
        totalHabits: 0,
        completedToday: 0,
        completionRate: 0,
        longestStreak: 0,
        currentStreak: 0,
        chartData: [],
        categoryData: [],
      }
    }

    // Calculate habits completed today
    const todayString = format(today, "yyyy-MM-dd")
    const completedToday = habits.filter((habit) => habit.completedDates.includes(todayString)).length

    // Calculate completion rate for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(today, i), "yyyy-MM-dd"))

    const totalPossibleCompletions = habits.length * 7
    const totalCompletions = habits.reduce((sum, habit) => {
      return sum + habit.completedDates.filter((date) => last7Days.includes(date)).length
    }, 0)

    const completionRate =
      totalPossibleCompletions > 0 ? Math.round((totalCompletions / totalPossibleCompletions) * 100) : 0

    // Calculate longest and current streaks
    let longestStreak = 0
    let currentStreak = 0

    // Chart data for the last 7 days
    const chartData = last7Days
      .map((dateString) => {
        const date = parseISO(dateString)
        const completed = habits.filter((habit) => habit.completedDates.includes(dateString)).length

        return {
          date: format(date, "EEE"),
          completed,
          total: habits.length,
          percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
        }
      })
      .reverse()

    // Category data for pie chart
    const categories = new Map()
    habits.forEach((habit) => {
      if (!categories.has(habit.category)) {
        categories.set(habit.category, 0)
      }
      categories.set(habit.category, categories.get(habit.category) + 1)
    })

    const categoryData = Array.from(categories.entries()).map(([name, count]) => ({
      name,
      value: count,
    }))

    // Calculate streaks if we have habits
    if (habits.length > 0) {
      // Check if all habits were completed today
      const allCompletedToday = habits.every((habit) => habit.completedDates.includes(todayString))

      if (allCompletedToday) {
        currentStreak = 1
        let checkDate = subDays(today, 1)

        while (true) {
          const dateString = format(checkDate, "yyyy-MM-dd")
          const allCompletedOnDate = habits.every((habit) => habit.completedDates.includes(dateString))

          if (!allCompletedOnDate) break

          currentStreak++
          checkDate = subDays(checkDate, 1)
        }
      }

      // Calculate longest streak
      for (let i = 0; i < 365; i++) {
        let tempStreak = 0
        let startDate = subDays(today, i)

        while (true) {
          const dateString = format(startDate, "yyyy-MM-dd")
          const allCompletedOnDate = habits.every((habit) => habit.completedDates.includes(dateString))

          if (!allCompletedOnDate) break

          tempStreak++
          startDate = subDays(startDate, 1)
        }

        if (tempStreak > longestStreak) {
          longestStreak = tempStreak
        }

        if (tempStreak === 0) {
          // Skip ahead to next potential streak start
          i += 1
        }
      }
    }

    return {
      totalHabits: habits.length,
      completedToday,
      completionRate,
      longestStreak,
      currentStreak,
      chartData,
      categoryData,
    }
  }, [habits, today])

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Add some habits to see your statistics!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHabits}</div>
              <p className="text-xs text-muted-foreground">Active habits being tracked</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completedToday} / {stats.totalHabits}
              </div>
              <Progress value={(stats.completedToday / stats.totalHabits) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak} days</div>
              <p className="text-xs text-muted-foreground">
                {stats.currentStreak > 0 ? "Keep it going!" : "Complete all habits today to start a streak"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.longestStreak} days</div>
              <p className="text-xs text-muted-foreground">Your personal best</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "h-[200px]" : "h-[300px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={!isMobile} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} of ${stats.chartData.find((d) => d.date === name)?.total || 0}`,
                      "Completed",
                    ]}
                  />
                  <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="text-5xl font-bold">{stats.completionRate}%</div>
              <Progress value={stats.completionRate} className="w-full" />
              <div className="text-sm text-muted-foreground">
                {stats.completionRate >= 80
                  ? "Excellent! Keep up the great work!"
                  : stats.completionRate >= 50
                    ? "Good progress! Try to be more consistent."
                    : "You can do better! Focus on building consistency."}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

