import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Star } from "lucide-react"

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

// User interface
interface OsintUser {
  id: string
  email: string
  name: string
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

interface ReviewModalProps {
  showAddReview: boolean
  setShowAddReview: React.Dispatch<React.SetStateAction<boolean>>
  selectedToolForReview: number | null
  tools: Tool[]
  user: OsintUser | null
  userReviews: Review[]
  setUserReviews: React.Dispatch<React.SetStateAction<Review[]>>
}

// Helper: localStorage safe set
const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`Failed to save to localStorage key "${key}":`, error)
    return false
  }
}

// Helper: sanitize review text
const sanitizeReviewText = (text: string): string => {
  return text.trim().replace(/[<>]/g, '').slice(0, 500)
}

// Interactive star rating component
const InteractiveStarRating = ({ 
  rating, 
  onRatingChange 
}: { 
  rating: number
  onRatingChange: (rating: number) => void 
}) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 transition-colors duration-200 ${
              star <= rating
                ? "fill-white text-white"
                : "text-gray-300 hover:text-gray-400"
            }`}
          />
        </button>
      ))}
      <span className="text-sm text-gray-600 ml-2">
        {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
      </span>
    </div>
  )
}

export default function ReviewModal({
  showAddReview,
  setShowAddReview,
  selectedToolForReview,
  tools,
  user,
  userReviews,
  setUserReviews,
}: ReviewModalProps) {
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewError, setReviewError] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)

  // Reset form when modal opens/closes or tool changes
  useEffect(() => {
    setReviewText("")
    setReviewRating(0)
    setReviewError("")
    setReviewLoading(false)
  }, [showAddReview, selectedToolForReview])

  const handleSubmitReview = async () => {
    if (!user || !selectedToolForReview) return

    setReviewError("")
    setReviewLoading(true)

    // Validation
    if (reviewRating === 0) {
      setReviewError("Please select a rating")
      setReviewLoading(false)
      return
    }
    if (!reviewText.trim() || reviewText.trim().length < 20) {
      setReviewError("Please enter a comment (minimum 20 characters)")
      setReviewLoading(false)
      return
    }
    if (reviewText.trim().length > 500) {
      setReviewError("Comment must be less than 500 characters")
      setReviewLoading(false)
      return
    }
    // Check for existing review by same user for same tool
    const existingReview = userReviews.find(
      (review) => review.toolId === selectedToolForReview && review.userId === user.id
    )
    if (existingReview) {
      setReviewError("You have already reviewed this tool")
      setReviewLoading(false)
      return
    }
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Create new review
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      toolId: selectedToolForReview,
      userId: user.id,
      userEmail: user.email,
      rating: reviewRating,
      comment: sanitizeReviewText(reviewText.trim()),
      date: new Date().toISOString(),
      helpful: 0,
    }
    // Add to reviews
    setUserReviews((prev) => {
      const updatedReviews = [...prev, newReview]
      // Attempt to save immediately to validate
      const saveSuccess = safeLocalStorageSet('osint-reviews', JSON.stringify(updatedReviews))
      if (!saveSuccess) {
        setReviewError("Failed to save review. Please try again.")
        setReviewLoading(false)
        return prev // Don't update state if save failed
      }
      return updatedReviews
    })
    // Reset form and close modal
    setReviewText("")
    setReviewRating(0)
    setReviewError("")
    setReviewLoading(false)
    setShowAddReview(false)
  }

  const toolName = selectedToolForReview ? tools.find(t => t.id === selectedToolForReview)?.name : 'Tool'

  return (
    <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add Review for {toolName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Rating *</Label>
            <InteractiveStarRating 
              rating={reviewRating} 
              onRatingChange={setReviewRating} 
            />
          </div>
          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment" className="text-gray-700 font-medium">
              Comment *
            </Label>
            <Textarea
              id="review-comment"
              placeholder="Share your experience with this tool (minimum 20 characters)..."
              value={reviewText}
              onChange={(e) => setReviewText(sanitizeReviewText(e.target.value))}
              rows={4}
              maxLength={500}
              className="bg-white border-gray-200 focus:border-gray-300 focus:ring-gray-200 focus:ring-1 placeholder:text-gray-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Minimum 20 characters</span>
              <span>{reviewText.length}/500</span>
            </div>
          </div>
          {/* Error Message */}
          {reviewError && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
              {reviewError}
            </p>
          )}
          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddReview(false)
                setReviewText("")
                setReviewRating(0)
                setReviewError("")
              }}
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={reviewLoading || reviewRating === 0 || reviewText.trim().length < 20}
              className="bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-400/20"
            >
              {reviewLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 