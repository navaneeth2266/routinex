"use client"

import type { Achievement } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { AVAILABLE_ACHIEVEMENTS } from "@/lib/achievements"

interface AchievementsProps {
  achievements: Achievement[]
}

export function Achievements({ achievements }: AchievementsProps) {
  // Combine unlocked achievements with locked ones
  const allAchievements = AVAILABLE_ACHIEVEMENTS.map((achievement) => {
    const unlocked = achievements.find((a) => a.id === achievement.id)
    return unlocked || { ...achievement, unlockedAt: null }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={cn("overflow-hidden", achievement.unlockedAt ? "bg-primary/5" : "bg-muted/50")}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-full text-2xl",
                          achievement.unlockedAt
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {achievement.unlockedAt ? achievement.icon : <Lock className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={cn("font-semibold", !achievement.unlockedAt && "text-muted-foreground")}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.unlockedAt && (
                          <p className="text-xs text-primary mt-1">
                            Unlocked on {format(new Date(achievement.unlockedAt), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

