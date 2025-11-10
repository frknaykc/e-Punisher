"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface ElementFilterEditorProps {
  filters: { include_tags?: string[]; exclude_tags?: string[] }
  onChange: (filters: { include_tags?: string[]; exclude_tags?: string[] }) => void
}

export function ElementFilterEditor({ filters, onChange }: ElementFilterEditorProps) {
  const [includeTag, setIncludeTag] = useState("")
  const [excludeTag, setExcludeTag] = useState("")

  const commonTags = {
    include: ["article", "main", "section", "div", "p", "span"],
    exclude: ["nav", "footer", "aside", "script", "style", "iframe"],
  }

  const handleAddInclude = (tag?: string) => {
    const tagToAdd = tag || includeTag.trim()
    if (!tagToAdd) return

    onChange({
      ...filters,
      include_tags: [...(filters.include_tags || []), tagToAdd],
    })
    setIncludeTag("")
  }

  const handleAddExclude = (tag?: string) => {
    const tagToAdd = tag || excludeTag.trim()
    if (!tagToAdd) return

    onChange({
      ...filters,
      exclude_tags: [...(filters.exclude_tags || []), tagToAdd],
    })
    setExcludeTag("")
  }

  const handleRemoveInclude = (tag: string) => {
    onChange({
      ...filters,
      include_tags: filters.include_tags?.filter((t) => t !== tag),
    })
  }

  const handleRemoveExclude = (tag: string) => {
    onChange({
      ...filters,
      exclude_tags: filters.exclude_tags?.filter((t) => t !== tag),
    })
  }

  return (
    <div className="space-y-6">
      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
        <p className="text-sm text-purple-400">Element Filters: HTML tag'lerine göre içeriği filtrele</p>
      </div>

      {/* Include Tags */}
      <div className="space-y-2">
        <Label className="text-green-400">Include Tags</Label>
        <p className="text-xs text-muted-foreground">Bu HTML elementlerini AL</p>

        <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border rounded bg-background/50">
          {filters.include_tags && filters.include_tags.length > 0 ? (
            filters.include_tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-green-500/10">
                {tag}
                <button onClick={() => handleRemoveInclude(tag)} className="ml-2 hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No include tags</span>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={includeTag}
            onChange={(e) => setIncludeTag(e.target.value)}
            placeholder="article, main, section..."
            onKeyDown={(e) => e.key === "Enter" && handleAddInclude()}
          />
          <Button onClick={() => handleAddInclude()} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs text-muted-foreground">Quick add:</span>
          {commonTags.include.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              onClick={() => handleAddInclude(tag)}
              className="h-6 text-xs"
              disabled={filters.include_tags?.includes(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Exclude Tags */}
      <div className="space-y-2">
        <Label className="text-red-400">Exclude Tags</Label>
        <p className="text-xs text-muted-foreground">Bu HTML elementlerini ATLA</p>

        <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border rounded bg-background/50">
          {filters.exclude_tags && filters.exclude_tags.length > 0 ? (
            filters.exclude_tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-red-500/10">
                {tag}
                <button onClick={() => handleRemoveExclude(tag)} className="ml-2 hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No exclude tags</span>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={excludeTag}
            onChange={(e) => setExcludeTag(e.target.value)}
            placeholder="nav, footer, aside..."
            onKeyDown={(e) => e.key === "Enter" && handleAddExclude()}
          />
          <Button onClick={() => handleAddExclude()} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs text-muted-foreground">Quick add:</span>
          {commonTags.exclude.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              onClick={() => handleAddExclude(tag)}
              className="h-6 text-xs"
              disabled={filters.exclude_tags?.includes(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
