"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface KeywordFilterEditorProps {
  filters: { include?: string[]; exclude?: string[] }
  onChange: (filters: { include?: string[]; exclude?: string[] }) => void
}

export function KeywordFilterEditor({ filters, onChange }: KeywordFilterEditorProps) {
  const [includeKeyword, setIncludeKeyword] = useState("")
  const [excludeKeyword, setExcludeKeyword] = useState("")

  const handleAddInclude = () => {
    if (!includeKeyword.trim()) return

    onChange({
      ...filters,
      include: [...(filters.include || []), includeKeyword.trim()],
    })
    setIncludeKeyword("")
  }

  const handleAddExclude = () => {
    if (!excludeKeyword.trim()) return

    onChange({
      ...filters,
      exclude: [...(filters.exclude || []), excludeKeyword.trim()],
    })
    setExcludeKeyword("")
  }

  const handleRemoveInclude = (keyword: string) => {
    onChange({
      ...filters,
      include: filters.include?.filter((k) => k !== keyword),
    })
  }

  const handleRemoveExclude = (keyword: string) => {
    onChange({
      ...filters,
      exclude: filters.exclude?.filter((k) => k !== keyword),
    })
  }

  return (
    <div className="space-y-6">
      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
        <p className="text-sm text-green-400">Keyword Filters: İçeriği anahtar kelimelere göre filtrele</p>
      </div>

      {/* Include Keywords */}
      <div className="space-y-2">
        <Label className="text-green-400">Include Keywords</Label>
        <p className="text-xs text-muted-foreground">Bu kelimeleri içeren içerikleri AL</p>

        <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border rounded bg-background/50">
          {filters.include && filters.include.length > 0 ? (
            filters.include.map((keyword) => (
              <Badge key={keyword} variant="outline" className="bg-green-500/10">
                {keyword}
                <button onClick={() => handleRemoveInclude(keyword)} className="ml-2 hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No include keywords</span>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={includeKeyword}
            onChange={(e) => setIncludeKeyword(e.target.value)}
            placeholder="typescript, react..."
            onKeyDown={(e) => e.key === "Enter" && handleAddInclude()}
          />
          <Button onClick={handleAddInclude} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Exclude Keywords */}
      <div className="space-y-2">
        <Label className="text-red-400">Exclude Keywords</Label>
        <p className="text-xs text-muted-foreground">Bu kelimeleri içeren içerikleri ATLA</p>

        <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 border rounded bg-background/50">
          {filters.exclude && filters.exclude.length > 0 ? (
            filters.exclude.map((keyword) => (
              <Badge key={keyword} variant="outline" className="bg-red-500/10">
                {keyword}
                <button onClick={() => handleRemoveExclude(keyword)} className="ml-2 hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No exclude keywords</span>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={excludeKeyword}
            onChange={(e) => setExcludeKeyword(e.target.value)}
            placeholder="deprecated, archived..."
            onKeyDown={(e) => e.key === "Enter" && handleAddExclude()}
          />
          <Button onClick={handleAddExclude} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
