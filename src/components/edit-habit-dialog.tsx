"use client"

import { useState } from "react"
import type { Habit } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { getCategoryIcon } from "@/lib/category-icons"

interface EditHabitDialogProps {
  habit: Habit
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (habit: Habit) => void
}

export function EditHabitDialog({ habit, open, onOpenChange, onSave }: EditHabitDialogProps) {
  const [name, setName] = useState(habit.name)
  const [category, setCategory] = useState(habit.category)
  const [priority, setPriority] = useState(habit.priority)
  const [note, setNote] = useState(habit.note || "")

  const handleSave = () => {
    if (!name.trim()) return

    onSave({
      ...habit,
      name: name.trim(),
      category,
      priority,
      note: note.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
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

          <div className="grid gap-2">
            <Label>Priority</Label>
            <RadioGroup
              value={priority.toString()}
              onValueChange={(value) => setPriority(Number.parseInt(value))}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="1" id="edit-priority-low" />
                <Label htmlFor="edit-priority-low">Low</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="2" id="edit-priority-medium" />
                <Label htmlFor="edit-priority-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="3" id="edit-priority-high" />
                <Label htmlFor="edit-priority-high">High</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note about this habit"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

