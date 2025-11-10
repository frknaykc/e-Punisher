"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"

interface CssSelectorEditorProps {
  selectors: Record<string, string>
  onChange: (selectors: Record<string, string>) => void
}

export function CssSelectorEditor({ selectors, onChange }: CssSelectorEditorProps) {
  const [selectorType, setSelectorType] = useState<string>("headings")
  const [selectorValue, setSelectorValue] = useState<string>("")
  const [customKey, setCustomKey] = useState<string>("")

  const presetTypes = [
    { value: "headings", label: "Headings", placeholder: "h1, h2.title" },
    { value: "links", label: "Links", placeholder: "a.article-link" },
    { value: "content", label: "Main Content", placeholder: ".article-body, main" },
    { value: "images", label: "Images", placeholder: "img.product-image" },
    { value: "custom", label: "Custom", placeholder: "Enter custom key" },
  ]

  const handleAdd = () => {
    if (!selectorValue.trim()) return

    const key = selectorType === "custom" ? customKey.trim() : selectorType
    if (!key) {
      return
    }

    onChange({
      ...selectors,
      [key]: selectorValue.trim(),
    })
    setSelectorValue("")
    setCustomKey("")
  }

  const handleRemove = (key: string) => {
    const newSelectors = { ...selectors }
    delete newSelectors[key]
    onChange(newSelectors)
  }

  const currentPreset = presetTypes.find((p) => p.value === selectorType)

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
        <p className="text-sm text-blue-400">CSS Selectors: Sayfa içinden belirli öğeleri seçmek için kullanılır</p>
        <p className="text-xs text-muted-foreground mt-1">
          Örnek: <code>h1.title</code>, <code>.product-price</code>, <code>a[href*="github"]</code>
        </p>
      </div>

      {/* Mevcut Selectors */}
      <div className="space-y-2">
        <Label>Active Selectors:</Label>
        {Object.keys(selectors).length === 0 ? (
          <div className="text-sm text-muted-foreground p-3 border border-dashed rounded text-center">
            No selectors added yet
          </div>
        ) : (
          Object.entries(selectors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 p-2 bg-background/50 rounded border">
              <Badge variant="outline">{key}</Badge>
              <code className="text-xs flex-1 break-all">{value}</code>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(key)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Add New Selector */}
      <div className="space-y-3 p-4 border rounded bg-background/50">
        <Label>Add New Selector:</Label>

        <div className="grid gap-3">
          <div>
            <Label className="text-xs">Selector Type</Label>
            <Select value={selectorType} onValueChange={setSelectorType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {presetTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectorType === "custom" && (
            <div>
              <Label className="text-xs">Custom Key</Label>
              <Input
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="price, title, author..."
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label className="text-xs">CSS Selector</Label>
            <Input
              value={selectorValue}
              onChange={(e) => setSelectorValue(e.target.value)}
              placeholder={currentPreset?.placeholder || "Enter CSS selector"}
              className="mt-1"
            />
          </div>

          <Button onClick={handleAdd} size="sm" className="w-full">
            <Plus className="h-3 w-3 mr-1" />
            Add Selector
          </Button>
        </div>
      </div>
    </div>
  )
}
