"use client"

import React from "react"

import { useState, useRef } from "react"
import { format, subDays, startOfToday, isToday } from "date-fns"
import type { Habit } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronLeft, ChevronRight, Check, Edit, MoreVertical, Star, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { EditHabitDialog } from "@/components/edit-habit-dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCategoryIcon } from "@/lib/category-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HabitListProps {
  habits: Habit[]
  onToggleCompletion: (habitId: string, date: string) => void
  onDeleteHabit: (habitId: string) => void
  onUpdateHabit: (habit: Habit) => void
}

export function HabitList({ habits, onToggleCompletion, onDeleteHabit, onUpdateHabit }: HabitListProps) {
  const today = startOfToday()
  const [startDate, setStartDate] = useState(today)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Generate the last 7 days from the start date
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(startDate, i)
    return {
      date,
      dateString: format(date, "yyyy-MM-dd"),
      display: format(date, "EEE"),
      day: format(date, "dd"),
      isToday: isToday(date),
    }
  }).reverse()

  const navigateDays = (direction: "forward" | "backward") => {
    if (direction === "forward") {
      // Don't allow navigating past today
      if (format(startDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
        return
      }
      setStartDate(subDays(startDate, -7))
    } else {
      setStartDate(subDays(startDate, 7))
    }
  }

  const handlePullToRefresh = (e: React.TouchEvent) => {
    const touchStart = e.touches[0].clientY

    const handleTouchMove = (e: TouchEvent) => {
      const touchEnd = e.touches[0].clientY
      const diff = touchEnd - touchStart

      // If pulled down more than 100px and we're not already at today
      if (diff > 100 && format(startDate, "yyyy-MM-dd") !== format(today, "yyyy-MM-dd")) {
        setStartDate(today)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
  }

  const sortedHabits = [...habits].sort((a, b) => {
    // Sort by priority first (high to low)
    if (a.priority !== b.priority) {
      return b.priority - a.priority
    }
    // Then by name
    return a.name.localeCompare(b.name)
  })

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          </motion.div>
          <p className="text-center text-muted-foreground">No habits added yet. Add your first habit above!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>Habit Tracker</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => navigateDays("backward")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateDays("forward")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[2fr_repeat(7,1fr)] gap-2" ref={listRef} onTouchStart={handlePullToRefresh}>
            <div className="font-medium">Habit</div>
            {dates.map((date) => (
              <div key={date.dateString} className="text-center">
                <div className={cn("text-xs text-muted-foreground", date.isToday && "font-bold text-primary")}>
                  {date.display}
                </div>
                <div className={cn("font-medium", date.isToday && "text-primary")}>{date.day}</div>
              </div>
            ))}

            <AnimatePresence initial={false}>
              {sortedHabits.map((habit) => (
                <React.Fragment key={habit.id}>
                  <motion.div
                    className="flex items-center justify-between pr-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full",
                                habit.priority === 3 && "bg-red-100 text-red-600",
                                habit.priority === 2 && "bg-amber-100 text-amber-600",
                                habit.priority === 1 && "bg-blue-100 text-blue-600",
                              )}
                            >
                              {getCategoryIcon(habit.category)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{habit.category}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="truncate font-medium">{habit.name}</span>
                      {habit.priority === 3 && (
                        <Badge variant="destructive" className="ml-1 px-1">
                          <Star className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingHabit(habit)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteHabit(habit.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>

                  {dates.map((date) => {
                    const isCompleted = habit.completedDates.includes(date.dateString)
                    return (
                      <div key={`${habit.id}-${date.dateString}`} className="flex justify-center">
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                              "h-8 w-8 rounded-full border-2 transition-all duration-300",
                              isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-background",
                              date.isToday && !isCompleted && "border-primary border-dashed",
                            )}
                            onClick={() => {
                              if (!isCompleted) {
                                // Add confetti animation when completing a habit
                                const button = document.createElement("div")
                                button.className = "fixed inset-0 pointer-events-none z-50"
                                document.body.appendChild(button)

                                // Clean up after animation
                                setTimeout(() => {
                                  if (button.parentNode) {
                                    button.parentNode.removeChild(button)
                                  }
                                }, 2000)
                              }
                              onToggleCompletion(habit.id, date.dateString)
                            }}
                          >
                            <AnimatePresence mode="wait">
                              {isCompleted && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Check className="h-4 w-4" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Button>
                        </motion.div>
                      </div>
                    )
                  })}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {editingHabit && (
        <EditHabitDialog
          habit={editingHabit}
          open={!!editingHabit}
          onOpenChange={(open) => !open && setEditingHabit(null)}
          onSave={(updatedHabit) => {
            onUpdateHabit(updatedHabit)
            setEditingHabit(null)
          }}
        />
      )}
    </>
  )
}

