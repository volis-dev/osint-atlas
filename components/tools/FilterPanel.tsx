import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface FilterPanelProps {
  showFilters: boolean
  pricingFilters: {
    Free: boolean
    Freemium: boolean
    Paid: boolean
  }
  setPricingFilters: React.Dispatch<React.SetStateAction<{
    Free: boolean
    Freemium: boolean
    Paid: boolean
  }>>
  noRegistrationFilter: boolean
  setNoRegistrationFilter: React.Dispatch<React.SetStateAction<boolean>>
  statusFilters: {
    online: boolean
    warning: boolean
    offline: boolean
  }
  setStatusFilters: React.Dispatch<React.SetStateAction<{
    online: boolean
    warning: boolean
    offline: boolean
  }>>
  clearAllFilters: () => void
}

export default function FilterPanel({
  showFilters,
  pricingFilters,
  setPricingFilters,
  noRegistrationFilter,
  setNoRegistrationFilter,
  statusFilters,
  setStatusFilters,
  clearAllFilters,
}: FilterPanelProps) {
  if (!showFilters) return null

  return (
    <Card className="mb-8 bg-white border-gray-200">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Pricing Filters */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Pricing</h3>
            <div className="space-y-2">
              {Object.entries(pricingFilters).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pricing-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setPricingFilters((prev) => ({ ...prev, [key]: checked as boolean }))
                    }
                  />
                  <label htmlFor={`pricing-${key}`} className="text-sm text-gray-700">
                    {key}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Filter */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Registration</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="no-registration"
                checked={noRegistrationFilter}
                onCheckedChange={(checked) => setNoRegistrationFilter(checked as boolean)}
              />
              <label htmlFor="no-registration" className="text-sm text-gray-700">
                No registration required
              </label>
            </div>
          </div>

          {/* Status Filters */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Status</h3>
            <div className="space-y-2">
              {Object.entries(statusFilters).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setStatusFilters((prev) => ({ ...prev, [key]: checked as boolean }))
                    }
                  />
                  <label htmlFor={`status-${key}`} className="text-sm text-gray-700 capitalize">
                    {key}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="text-gray-600">
            Clear all filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 