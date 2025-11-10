"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Edit, Trash2, Check, X, Layers } from "lucide-react"
import { toast } from "sonner"
import type { ScrapingTemplate } from "@/lib/api-client"

interface TemplateManagementPanelProps {
  isOpen: boolean
  onClose: () => void
  templates: ScrapingTemplate[]
  onSelectTemplate: (templateId: string) => void
  onRefreshTemplates: () => void
  selectedTemplateId: string
}

export function TemplateManagementPanel({
  isOpen,
  onClose,
  templates,
  onSelectTemplate,
  onRefreshTemplates,
  selectedTemplateId,
}: TemplateManagementPanelProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<ScrapingTemplate>>({})

  const handleEdit = (template: ScrapingTemplate) => {
    setEditingId(template.id)
    setEditForm(template)
  }

  const handleSaveEdit = () => {
    // TODO: Call API to update template
    toast.success("Template updated")
    setEditingId(null)
    setEditForm({})
    onRefreshTemplates()
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = (templateId: number) => {
    // TODO: Call API to delete template
    toast.success("Template deleted")
    onRefreshTemplates()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[600px] sm:w-[700px] p-0">
        <SheetHeader className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-6">
          <SheetTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Template Management
          </SheetTitle>
          <p className="text-sm text-muted-foreground">Select, edit, or delete scraping templates</p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] p-6">
          <div className="space-y-3">
            {/* No Template Option */}
            <div
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedTemplateId === "none"
                  ? "border-primary bg-primary/5"
                  : "border-primary/10 hover:border-primary/30 bg-background/50"
              }`}
              onClick={() => {
                onSelectTemplate("none")
                toast.info("No template selected", {
                  description: "Using manual scraping settings",
                })
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">No Template</h3>
                  <p className="text-xs text-muted-foreground">Use manual settings for scraping</p>
                </div>
                {selectedTemplateId === "none" && <Check className="h-5 w-5 text-primary" />}
              </div>
            </div>

            {/* Templates List */}
            {templates.length === 0 ? (
              <div className="text-center py-12">
                <Layers className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">No templates yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Create templates to save scraping configurations
                </p>
              </div>
            ) : (
              templates.map((template) => {
                const isEditing = editingId === template.id
                const isSelected = selectedTemplateId === template.id.toString()

                return (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-primary/10 hover:border-primary/30 bg-background/50"
                    }`}
                  >
                    {isEditing ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <Input
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Template name"
                          className="font-semibold"
                        />
                        <Input
                          value={editForm.description || ""}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Description"
                          className="text-sm"
                        />
                        <Input
                          value={editForm.target_domain || ""}
                          onChange={(e) => setEditForm({ ...editForm, target_domain: e.target.value })}
                          placeholder="Target domain (optional)"
                          className="text-xs"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Check className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div
                          className="flex items-start justify-between mb-3 cursor-pointer"
                          onClick={() => {
                            onSelectTemplate(template.id.toString())
                            toast.success(`Template selected: ${template.name}`)
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm">{template.name}</h3>
                              {isSelected && <Check className="h-4 w-4 text-primary" />}
                            </div>
                            {template.description && (
                              <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                            )}
                            {template.target_domain && (
                              <p className="text-xs text-muted-foreground/70">Domain: {template.target_domain}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {template.format.toUpperCase()}
                            </Badge>
                            {template.css_selectors && Object.keys(template.css_selectors).length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {Object.keys(template.css_selectors).length} Field
                                {Object.keys(template.css_selectors).length > 1 ? "s" : ""}
                              </Badge>
                            )}
                            {template.description?.includes("Advanced Extractor") && (
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                Schema-based
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(template)
                              }}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(template.id)
                              }}
                              className="h-7 w-7 p-0 hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Template Details */}
                        {template.css_selectors && Object.keys(template.css_selectors).length > 0 && (
                          <div className="mt-3 p-2 rounded bg-background/50 border border-primary/10">
                            <p className="text-xs font-medium mb-1">CSS Selectors:</p>
                            <div className="space-y-1">
                              {Object.entries(template.css_selectors).map(([key, value]) => (
                                <div key={key} className="text-xs text-muted-foreground flex gap-2">
                                  <span className="font-mono text-primary">{key}:</span>
                                  <span className="font-mono">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
