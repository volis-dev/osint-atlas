import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SubmitToolModalProps {
  showSubmitTool: boolean
  setShowSubmitTool: React.Dispatch<React.SetStateAction<boolean>>
  categories: string[]
}

export default function SubmitToolModal({
  showSubmitTool,
  setShowSubmitTool,
  categories,
}: SubmitToolModalProps) {
  return (
    <Dialog open={showSubmitTool} onOpenChange={setShowSubmitTool}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit New Tool</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tool-name">Tool Name</Label>
              <Input id="tool-name" placeholder="Enter tool name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tool-category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-url">URL</Label>
            <Input id="tool-url" placeholder="https://example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-description">Description</Label>
            <Textarea
              id="tool-description"
              placeholder="Describe what this tool does and how it's useful for OSINT..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tool-pricing">Pricing</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Freemium">Freemium</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Registration Required</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="tool-registration" />
                <label htmlFor="tool-registration" className="text-sm">
                  Requires user registration
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowSubmitTool(false)}>
              Cancel
            </Button>
            <Button>Submit Tool</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 