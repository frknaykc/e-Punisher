"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiClient, type ScrapeResponse } from "@/lib/api-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface SaveAsTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  scrapeData: ScrapeResponse | null // Made scrapeData nullable
  onSave: () => void
}

export function SaveAsTemplateDialog({ isOpen, onClose, scrapeData, onSave }: SaveAsTemplateDialogProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSave = async () => {
    if (!scrapeData) {
      toast.error("No scraping data available")
      return
    }

    if (!name.trim()) {
      toast.error("Template name is required")
      return
    }

    setIsSaving(true)
    try {
      // Extract domain from URL
      let targetDomain = ""
      try {
        const url = new URL(scrapeData.url)
        targetDomain = url.hostname
      } catch {}

      await apiClient.createScrapingTemplate({
        name: name.trim(),
        description: description.trim() || undefined,
        target_domain: targetDomain || undefined,
        format: scrapeData.format,
      })

      toast.success("Template saved successfully")
      onSave()
      onClose()
      setName("")
      setDescription("")
    } catch (error: any) {
      toast.error("Failed to save template", {
        description: error.message,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>

        {!scrapeData ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No scraping data available</p>
            <Button variant="outline" onClick={onClose} className="mt-4 bg-transparent">
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Template Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Scraping Template"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this template does..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="p-3 bg-muted rounded text-sm">
                <p className="font-medium mb-1">Template will use:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• URL: {scrapeData.url}</li>
                  <li>• Format: {scrapeData.format.toUpperCase()}</li>
                  <li>
                    • Domain: {(() => {
                      try {
                        return new URL(scrapeData.url).hostname
                      } catch {
                        return "N/A"
                      }
                    })()}
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Template"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
