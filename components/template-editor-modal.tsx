"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CssSelectorEditor } from "./css-selector-editor"
import { KeywordFilterEditor } from "./keyword-filter-editor"
import { ElementFilterEditor } from "./element-filter-editor"
import { apiClient, type ScrapingTemplateCreate } from "@/lib/api-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface TemplateEditorModalProps {
  isOpen: boolean
  onClose: () => void
  templateId?: number
  onSave: () => void
}

export function TemplateEditorModal({ isOpen, onClose, templateId, onSave }: TemplateEditorModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [template, setTemplate] = useState<Partial<ScrapingTemplateCreate>>({
    name: "",
    description: "",
    target_domain: "",
    format: "markdown",
    css_selectors: {},
    keyword_filters: { include: [], exclude: [] },
    element_filters: { include_tags: [], exclude_tags: [] },
  })

  // Load template if editing
  useEffect(() => {
    if (templateId && isOpen) {
      loadTemplate(templateId)
    } else if (!isOpen) {
      // Reset when closed
      setTemplate({
        name: "",
        description: "",
        target_domain: "",
        format: "markdown",
        css_selectors: {},
        keyword_filters: { include: [], exclude: [] },
        element_filters: { include_tags: [], exclude_tags: [] },
      })
    }
  }, [templateId, isOpen])

  const loadTemplate = async (id: number) => {
    setIsLoading(true)
    try {
      const data = await apiClient.getScrapingTemplate(id)
      setTemplate({
        name: data.name,
        description: data.description || "",
        target_domain: data.target_domain || "",
        format: data.format,
        css_selectors: data.css_selectors || {},
        keyword_filters: data.keyword_filters || { include: [], exclude: [] },
        element_filters: data.element_filters || { include_tags: [], exclude_tags: [] },
      })
    } catch (error: any) {
      toast.error("Failed to load template", {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!template.name?.trim()) {
      toast.error("Template name is required")
      return
    }

    setIsSaving(true)
    try {
      if (templateId) {
        await apiClient.updateScrapingTemplate(templateId, template)
        toast.success("Template updated successfully")
      } else {
        await apiClient.createScrapingTemplate(template as ScrapingTemplateCreate)
        toast.success("Template created successfully")
      }
      onSave()
      onClose()
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{templateId ? "Edit Template" : "Create New Template"}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="selectors">CSS Selectors</TabsTrigger>
              <TabsTrigger value="keywords">Keyword Filters</TabsTrigger>
              <TabsTrigger value="elements">Element Filters</TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Info */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div>
                <Label>Template Name *</Label>
                <Input
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  placeholder="GitHub Repos Scraper"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={template.description}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  placeholder="Scrapes GitHub repository information..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Target Domain (Optional)</Label>
                <Input
                  value={template.target_domain}
                  onChange={(e) => setTemplate({ ...template, target_domain: e.target.value })}
                  placeholder="github.com"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-suggest this template when scraping this domain
                </p>
              </div>

              <div>
                <Label>Default Format</Label>
                <Select value={template.format} onValueChange={(val) => setTemplate({ ...template, format: val })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Tab 2: CSS Selectors */}
            <TabsContent value="selectors" className="mt-4">
              <CssSelectorEditor
                selectors={template.css_selectors || {}}
                onChange={(selectors) => setTemplate({ ...template, css_selectors: selectors })}
              />
            </TabsContent>

            {/* Tab 3: Keyword Filters */}
            <TabsContent value="keywords" className="mt-4">
              <KeywordFilterEditor
                filters={template.keyword_filters || { include: [], exclude: [] }}
                onChange={(filters) => setTemplate({ ...template, keyword_filters: filters })}
              />
            </TabsContent>

            {/* Tab 4: Element Filters */}
            <TabsContent value="elements" className="mt-4">
              <ElementFilterEditor
                filters={template.element_filters || { include_tags: [], exclude_tags: [] }}
                onChange={(filters) => setTemplate({ ...template, element_filters: filters })}
              />
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>{templateId ? "Update" : "Create"} Template</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
