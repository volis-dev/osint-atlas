import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface AuthModalProps {
  showAuthModal: boolean
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>
  authTab: string
  setAuthTab: React.Dispatch<React.SetStateAction<string>>
  authEmail: string
  setAuthEmail: React.Dispatch<React.SetStateAction<string>>
  authPassword: string
  setAuthPassword: React.Dispatch<React.SetStateAction<string>>
  authName: string
  setAuthName: React.Dispatch<React.SetStateAction<string>>
  authError: string
  authLoading: boolean
  handleAuth: () => Promise<void>
}

export default function AuthModal({
  showAuthModal,
  setShowAuthModal,
  authTab,
  setAuthTab,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authName,
  setAuthName,
  authError,
  authLoading,
  handleAuth,
}: AuthModalProps) {
  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Welcome to OSINT Atlas</DialogTitle>
        </DialogHeader>
        <Tabs value={authTab} onValueChange={setAuthTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 text-gray-600">
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 data-[state=active]:font-medium"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 data-[state=active]:font-medium"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="bg-white border-gray-200 focus:border-gray-300 focus:ring-gray-200 focus:ring-1 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="bg-white border-gray-200 focus:border-gray-300 focus:ring-gray-200 focus:ring-1 placeholder:text-gray-500"
              />
            </div>
            {authError && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">{authError}</p>
            )}
            <Button
              onClick={handleAuth}
              disabled={authLoading}
              className="w-full bg-slate-700 text-white hover:bg-slate-800 focus:ring-gray-200 focus:ring-1"
            >
              {authLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Sign In
            </Button>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-gray-700 font-medium">
                Name
              </Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Enter your name"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="bg-white border-gray-200 focus:border-gray-300 focus:ring-gray-200 focus:ring-1 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="bg-white border-gray-200 focus:border-gray-300 focus:ring-gray-200 focus:ring-1 placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="bg-white border-gray-200 focus:border-gray-300 focus:ring-gray-200 focus:ring-1 placeholder:text-gray-500"
              />
            </div>
            {authError && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">{authError}</p>
            )}
            <Button
              onClick={handleAuth}
              disabled={authLoading}
              className="w-full bg-slate-700 text-white hover:bg-slate-800 focus:ring-gray-200 focus:ring-1"
            >
              {authLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Sign Up
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 