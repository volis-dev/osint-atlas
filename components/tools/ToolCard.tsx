import React from "react"
import { Heart, Check, Plus, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Tool, OsintUser, Review } from "@/types"

interface ToolCardProps {
  tool: Tool
  onToolClick: (url: string, toolId: number) => void
  onFavorite: (toolId: number, e: React.MouseEvent) => void
  onCompareSelection: (toolId: number, e: React.MouseEvent) => void
  onAddReview: (toolId: number, e: React.MouseEvent) => void
  isFavorited: boolean
  compareMode: boolean
  isSelected: boolean
  isCompareDisabled: boolean
  user: OsintUser | null
  userReviews: Review[]
  mockReviews: Record<number, { rating: number; count: number }>
}

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-emerald-500"
    case "offline":
      return "bg-red-500"
    case "warning":
      return "bg-amber-500"
    default:
      return "bg-gray-400"
  }
}

const getPricingColor = (pricing: string) => {
  switch (pricing) {
    case "Free":
      return "bg-green-50 text-green-700 border-green-200 font-medium"
    case "Freemium":
      return "bg-blue-50 text-blue-700 border-blue-200 font-medium"
    case "Paid":
      return "bg-orange-50 text-orange-700 border-orange-200 font-medium"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 font-medium"
  }
}

// Star rating component
const StarRating = ({ rating, count }: { rating: number; count: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < fullStars
                ? "fill-white text-white"
                : i === fullStars && hasHalfStar
                  ? "fill-white/50 text-white"
                  : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {rating} ({count})
      </span>
    </div>
  )
}

// Helper function to get review statistics for a tool
const getToolReviews = (toolId: number, allReviews: Review[]) => {
  const toolReviews = allReviews.filter((review) => review.toolId === toolId)
  if (toolReviews.length === 0) return null

  const averageRating = toolReviews.reduce((sum, review) => sum + review.rating, 0) / toolReviews.length
  return {
    rating: Math.round(averageRating * 10) / 10,
    count: toolReviews.length,
    reviews: toolReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
  }
}

export default function ToolCard({
  tool,
  onToolClick,
  onFavorite,
  onCompareSelection,
  onAddReview,
  isFavorited,
  compareMode,
  isSelected,
  isCompareDisabled,
  user,
  userReviews,
  mockReviews,
}: ToolCardProps) {
  return (
    <Card
      className={`cursor-pointer bg-white border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-200 hover:-translate-y-1 h-full ${
        compareMode && isSelected ? "ring-2 ring-blue-500 border-blue-300" : ""
      }`}
      onClick={() => onToolClick(tool.url, tool.id)}
    >
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-3 h-3">
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(tool.status)}`} />
              {tool.status === "online" && (
                <div className="absolute w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900">{tool.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {compareMode && (
              <button
                onClick={(e) => onCompareSelection(tool.id, e)}
                className={`p-1.5 rounded-md transition-colors duration-200 ${
                  isSelected
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100 text-gray-400"
                }`}
                disabled={isCompareDisabled}
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            {user && (
              <button
                onClick={(e) => onAddReview(tool.id, e)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
                title="Add Review"
              >
                <Plus className="w-4 h-4 text-gray-400 hover:text-blue-500" />
              </button>
            )}
            <button
              onClick={(e) => onFavorite(tool.id, e)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-200 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-3 flex-wrap">
          <Badge className="bg-gray-50 text-gray-700 border-gray-200 rounded-md px-2.5 py-1 text-xs font-medium">
            {tool.category}
          </Badge>
          <Badge className={`rounded-md px-2.5 py-1 text-xs ${getPricingColor(tool.pricing)}`}>
            {tool.pricing}
          </Badge>
          {tool.registration && (
            <Badge className="bg-gray-50 text-gray-700 border-gray-200 rounded-md px-2.5 py-1 text-xs font-medium">
              Registration Required
            </Badge>
          )}
        </div>
        {(getToolReviews(tool.id, userReviews) || mockReviews[tool.id as keyof typeof mockReviews]) && (
          <div className="mb-3">
            <StarRating
              rating={
                getToolReviews(tool.id, userReviews)?.rating || 
                mockReviews[tool.id as keyof typeof mockReviews]?.rating || 0
              }
              count={
                getToolReviews(tool.id, userReviews)?.count || 
                mockReviews[tool.id as keyof typeof mockReviews]?.count || 0
              }
            />
          </div>
        )}
        <p className="text-gray-600 leading-relaxed text-sm flex-grow">{tool.description}</p>
      </CardContent>
    </Card>
  )
} 