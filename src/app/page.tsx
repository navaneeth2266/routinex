import { HabitDashboard } from "@/components/habit-dashboard"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-4 px-4 sm:py-8 sm:px-0">
          <HabitDashboard />
        </div>
      </main>
    </div>
  )
}

