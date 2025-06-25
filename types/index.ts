// Shared type definitions for OSINT Atlas

export interface Tool {
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

export interface OsintUser {
  id: string
  email: string
  name: string
}

export interface Review {
  id: string
  toolId: number
  userId: string
  userEmail: string
  rating: number
  comment: string
  date: string
  helpful: number
}

// Helper type for mock reviews structure
export type MockReviews = Record<number, { rating: number; count: number }>

// Filter types
export interface PricingFilters {
  Free: boolean
  Freemium: boolean
  Paid: boolean
}

export interface StatusFilters {
  online: boolean
  warning: boolean
  offline: boolean
}

// Component prop types can be imported from here
export interface ToolReviewData {
  rating: number
  count: number
  reviews: Review[]
}
