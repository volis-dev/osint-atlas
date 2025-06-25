import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

interface ComparisonModalProps {
  showComparison: boolean
  setShowComparison: React.Dispatch<React.SetStateAction<boolean>>
  comparisonTools: (Tool | undefined)[]
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

// Star rating display
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

// Helper to get review stats for a tool
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

export default function ComparisonModal({
  showComparison,
  setShowComparison,
  comparisonTools,
  userReviews,
  mockReviews,
}: ComparisonModalProps) {
  return (
    <Dialog open={showComparison} onOpenChange={setShowComparison}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tool Comparison</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-900">Feature</th>
                  {comparisonTools.map((tool) => (
                    <th key={tool?.id} className="text-left p-3 font-medium text-gray-900">
                      {tool?.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Category</td>
                  {comparisonTools.map((tool) => (
                    <td key={tool?.id} className="p-3 text-gray-600">
                      {tool?.category}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Pricing</td>
                  {comparisonTools.map((tool) => (
                    <td key={tool?.id} className="p-3">
                      <Badge className={`${getPricingColor(tool?.pricing ?? "")} text-xs`}>{tool?.pricing}</Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Registration</td>
                  {comparisonTools.map((tool) => (
                    <td key={tool?.id} className="p-3 text-gray-600">
                      {tool?.registration ? "Required" : "Not required"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Status</td>
                  {comparisonTools.map((tool) => (
                    <td key={tool?.id} className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(tool?.status ?? "")}`} />
                        <span className="text-gray-600 capitalize">{tool?.status}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium text-gray-700">Rating</td>
                  {comparisonTools.map((tool) => (
                    <td key={tool?.id} className="p-3">
                      {(getToolReviews(tool?.id ?? 0, userReviews) || mockReviews[tool?.id ?? 0]) ? (
                        <StarRating
                          rating={
                            getToolReviews(tool?.id ?? 0, userReviews)?.rating || 
                            mockReviews[tool?.id ?? 0]?.rating || 0
                          }
                          count={
                            getToolReviews(tool?.id ?? 0, userReviews)?.count || 
                            mockReviews[tool?.id ?? 0]?.count || 0
                          }
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No reviews</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-medium text-gray-700">Description</td>
                  {comparisonTools.map((tool) => (
                    <td key={tool?.id} className="p-3 text-gray-600 text-sm leading-relaxed">
                      {tool?.description}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            {comparisonTools.map((tool) => (
              <Button
                key={tool?.id}
                variant="outline"
                size="sm"
                onClick={() => tool?.url && window.open(tool.url, "_blank")}
                className="text-slate-700 border-slate-300 hover:bg-slate-50"
              >
                Visit {tool?.name}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 