import { Heart, Dumbbell, Brain, BookOpen, Smile, DollarSign, Users, Layers } from "lucide-react"

export function getCategoryIcon(category: string) {
  switch (category) {
    case "health":
      return <Heart className="h-4 w-4" />
    case "fitness":
      return <Dumbbell className="h-4 w-4" />
    case "productivity":
      return <Brain className="h-4 w-4" />
    case "learning":
      return <BookOpen className="h-4 w-4" />
    case "mindfulness":
      return <Smile className="h-4 w-4" />
    case "finance":
      return <DollarSign className="h-4 w-4" />
    case "social":
      return <Users className="h-4 w-4" />
    default:
      return <Layers className="h-4 w-4" />
  }
}

