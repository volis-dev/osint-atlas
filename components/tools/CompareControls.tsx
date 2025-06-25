import React from "react"
import { Button } from "@/components/ui/button"

interface CompareControlsProps {
  compareMode: boolean
  selectedForComparison: number[]
  setShowComparison: React.Dispatch<React.SetStateAction<boolean>>
  setCompareMode: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedForComparison: React.Dispatch<React.SetStateAction<number[]>>
}

export default function CompareControls({
  compareMode,
  selectedForComparison,
  setShowComparison,
  setCompareMode,
  setSelectedForComparison,
}: CompareControlsProps) {
  if (!compareMode) return null

  return (
    <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-blue-800 font-medium">Compare Mode Active</p>
          <p className="text-blue-600 text-sm">
            Select up to 3 tools to compare ({selectedForComparison.length}/3 selected)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedForComparison.length > 0 && (
            <Button
              size="sm"
              onClick={() => setShowComparison(true)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Compare Selected ({selectedForComparison.length})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCompareMode(false)
              setSelectedForComparison([])
            }}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Exit Compare
          </Button>
        </div>
      </div>
    </div>
  )
} 