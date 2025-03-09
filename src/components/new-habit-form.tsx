"use client"

import type React from "react"

import { useState } from "react"
import type { Habit } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PlusCircle, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getCategoryIcon } from "@/lib/category-icons"

interface NewHabitFormProps {
  onAddHabit: (habit: Habit) => void
}

export function NewHabitForm({ onAddHabit }: NewHabitFormProps) {
  const [habitName, setHabitName] = useState("")
  const [habitCategory, setHabitCategory] = useState("health")
  const [habitPriority, setHabitPriority] = useState(1)
  const [habitNote, setHabitNote] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with values:", { habitName, habitCategory, habitPriority, habitNote })

    if (!habitName.trim()) {
      console.log("Habit name is empty, form submission cancelled")
      return
    }

    try {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: habitName.trim(),
        category: habitCategory,
        priority: habitPriority,
        note: habitNote.trim(),
        createdAt: new Date().toISOString(),
        completedDates: [],
      }
      
      console.log("Calling onAddHabit with new habit:", newHabit)
      onAddHabit(newHabit)
      
      // Reset form fields
      setHabitName("")
      setHabitNote("")
      setHabitPriority(1)
      setIsExpanded(false)
    } catch (error) {
      console.error("Error creating habit:", error)
      // You could add error handling UI here
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Add New Habit</span>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 px-2">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                id="habit-name"
                placeholder="Enter habit name"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="shrink-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid gap-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="habit-category">Category</Label>
                      <Select value={habitCategory} onValueChange={setHabitCategory}>
                        <SelectTrigger id="habit-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="health">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon("health")}
                              <span>Health</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="fitness">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon("fitness")}
                              <span>Fitness</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="productivity">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon("productivity")}
                              <span>Productivity</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="learning">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon("learning")}
                              <span>Learning</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="mindfulness">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon("mindfulness")}
                              <span>Mindfulness</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="finance">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon("finance")}
                              <span>Finance</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="social">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon("social")}
                              <span>Social</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="other">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon("other")}
                              <span>Other</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <RadioGroup
                        value={habitPriority.toString()}
                        onValueChange={(value) => setHabitPriority(Number.parseInt(value))}
                        className="flex space-x-2"
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="1" id="priority-low" />
                          <Label htmlFor="priority-low" className="text-xs">
                            Low
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="2" id="priority-medium" />
                          <Label htmlFor="priority-medium" className="text-xs">
                            Medium
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="3" id="priority-high" />
                          <Label htmlFor="priority-high" className="text-xs">
                            High
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="habit-note">Note (optional)</Label>
                    <Input
                      id="habit-note"
                      placeholder="Add a note about this habit"
                      value={habitNote}
                      onChange={(e) => setHabitNote(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
    </Card>
  )
}

