import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CollectionsModalProps {
  showCollections: boolean
  setShowCollections: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CollectionsModal({ showCollections, setShowCollections }: CollectionsModalProps) {
  return (
    <Dialog open={showCollections} onOpenChange={setShowCollections}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My Collections</DialogTitle>
        </DialogHeader>
        <div className="py-8 text-center">
          <div className="text-4xl mb-4 opacity-30">📚</div>
          <p className="text-gray-500 mb-2">Feature coming soon!</p>
          <p className="text-sm text-gray-400">Create and manage your custom tool collections.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 