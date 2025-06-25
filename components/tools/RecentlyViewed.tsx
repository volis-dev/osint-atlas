import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

// Tool interface
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

// Review interface
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

interface RecentlyViewedProps {
  recentTools: (Tool | undefined)[]
  compareMode: boolean
  handleToolClick: (url: string, toolId: number) => void
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

export default function RecentlyViewed({
  recentTools,
  compareMode,
  handleToolClick,
  userReviews,
  mockReviews,
}: RecentlyViewedProps) {
  if (recentTools.length === 0 || compareMode) return null

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recently Viewed</h2>
        <span className="text-sm text-gray-500">{recentTools.length} items</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 px-1">
        {recentTools.map((tool) => (
          <Card
            key={`recent-${tool!.id}`}
            className="min-w-80 cursor-pointer bg-white border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-200 hover:-translate-y-1"
            onClick={() => handleToolClick(tool!.url, tool!.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(tool!.status)}`} />
                    {tool!.status === "online" && (
                      <div className="absolute w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900">{tool!.name}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gray-50 text-gray-700 border-gray-200 rounded-md px-2.5 py-1 text-xs font-medium">
                    {tool!.category}
                  </Badge>
                  <Badge className={`rounded-md px-2.5 py-1 text-xs ${getPricingColor(tool!.pricing)}`}>
                    {tool!.pricing}
                  </Badge>
                </div>
              </div>
              {(getToolReviews(tool!.id, userReviews) || mockReviews[tool!.id]) && (
                <div className="mb-2">
                  <StarRating
                    rating={
                      getToolReviews(tool!.id, userReviews)?.rating || 
                      mockReviews[tool!.id]?.rating || 0
                    }
                    count={
                      getToolReviews(tool!.id, userReviews)?.count || 
                      mockReviews[tool!.id]?.count || 0
                    }
                  />
                </div>
              )}
              <p className="text-sm text-gray-600 line-clamp-2">{tool!.description.split(".")[0]}.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 