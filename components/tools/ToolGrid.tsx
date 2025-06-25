import React from "react"
import ToolCard from "./ToolCard"

// Interfaces
interface Tool {
  id: number
  name: string
  description: string
  category: string
  status: "online" | "offline" | "warning"
  url: string
  pricing: "Free" | "Freemium" | "Paid"
  registration: boolean
  created_at?: string
  updated_at?: string
}

interface OsintUser {
  id: string
  email: string
  name: string
}

interface Review {
  id: string
  toolId: number
  userId: string
  userEmail: string
  rating: number
  comment: string
  date: string
  helpful: number
}

interface ToolGridProps {
  tools: Tool[]
  onToolClick: (url: string, toolId: number) => void
  onFavorite: (toolId: number, e: React.MouseEvent) => void
  onCompareSelection: (toolId: number, e: React.MouseEvent) => void
  onAddReview: (toolId: number, e: React.MouseEvent) => void
  favorites: number[]
  compareMode: boolean
  selectedForComparison: number[]
  user: OsintUser | null
  userReviews: Review[]
  mockReviews: Record<number, { rating: number; count: number }>
}

export default function ToolGrid({
  tools,
  onToolClick,
  onFavorite,
  onCompareSelection,
  onAddReview,
  favorites,
  compareMode,
  selectedForComparison,
  user,
  userReviews,
  mockReviews,
}: ToolGridProps) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          onToolClick={onToolClick}
          onFavorite={onFavorite}
          onCompareSelection={onCompareSelection}
          onAddReview={onAddReview}
          isFavorited={favorites.includes(tool.id)}
          compareMode={compareMode}
          isSelected={selectedForComparison.includes(tool.id)}
          isCompareDisabled={!selectedForComparison.includes(tool.id) && selectedForComparison.length >= 3}
          user={user}
          userReviews={userReviews}
          mockReviews={mockReviews}
        />
      ))}
    </div>
  )
} 