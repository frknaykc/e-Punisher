"use client"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Save, Trash2, Check, X } from "lucide-react"
import { toast } from "sonner"

interface ExtractedField {
  id: string
  name: string
  pattern: string
  matchedElements: string[]
  color: string
}

interface ExtractionSchema {
  name: string
  fields: ExtractedField[]
}

interface AdvancedDataExtractorProps {
  rawData: string
  format: "html" | "json"
  onSaveSchema?: (schema: ExtractionSchema) => void
}

const HIGHLIGHT_COLORS = [
  { bg: "bg-yellow-200", border: "border-yellow-500", text: "text-yellow-900" },
  { bg: "bg-blue-200", border: "border-blue-500", text: "text-blue-900" },
  { bg: "bg-green-200", border: "border-green-500", text: "text-green-900" },
  { bg: "bg-purple-200", border: "border-purple-500", text: "text-purple-900" },
  { bg: "bg-pink-200", border: "border-pink-500", text: "text-pink-900" },
  { bg: "bg-orange-200", border: "border-orange-500", text: "text-orange-900" },
  { bg: "bg-cyan-200", border: "border-cyan-500", text: "text-cyan-900" },
  { bg: "bg-red-200", border: "border-red-500", text: "text-red-900" },
]

export function AdvancedDataExtractor({ rawData, format, onSaveSchema }: AdvancedDataExtractorProps) {
  const [selectedContent, setSelectedContent] = useState<string>("")
  const [showContentDialog, setShowContentDialog] = useState(false)
  const [schema, setSchema] = useState<ExtractionSchema>({
    name: "Untitled Schema",
    fields: [],
  })
  const [fieldName, setFieldName] = useState("")
  const [matchedElements, setMatchedElements] = useState<string[]>([])
  const rawDataRef = useRef<HTMLPreElement>(null)
  const [colorIndex, setColorIndex] = useState(0)
  const [pendingMatches, setPendingMatches] = useState<string[]>([])

  const findSimilarPatterns = (selectedText: string): string[] => {
    console.log("[v0] Finding patterns for:", selectedText.substring(0, 100))

    const parser = new DOMParser()
    const doc = parser.parseFromString(rawData, "text/html")

    // Find the element containing selected text
    const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null)
    let targetElement: Element | null = null
    let node: Node | null

    while ((node = walker.nextNode())) {
      if (node.textContent?.includes(selectedText.trim())) {
        targetElement = node.parentElement
        break
      }
    }

    if (!targetElement) {
      console.log("[v0] Could not find element containing selected text")
      return [selectedText]
    }

    console.log("[v0] Found target element:", targetElement.tagName, targetElement.className)

    // Generate a structural pattern based on tag hierarchy (ignore CSS classes)
    const getTagPath = (elem: Element): string[] => {
      const path: string[] = []
      let current: Element | null = elem

      while (current && current.tagName !== "BODY" && path.length < 5) {
        path.unshift(current.tagName.toLowerCase())
        current = current.parentElement
      }

      return path
    }

    const targetPath = getTagPath(targetElement)
    console.log("[v0] Target tag path:", targetPath.join(" > "))

    // Find all elements with the same tag structure
    const matches: string[] = []
    const allElements = doc.body.getElementsByTagName("*")

    for (let i = 0; i < allElements.length; i++) {
      const elem = allElements[i]
      const elemPath = getTagPath(elem)

      // Check if tag paths match
      if (elemPath.length === targetPath.length && elemPath.every((tag, idx) => tag === targetPath[idx])) {
        const text = elem.textContent?.trim()
        if (text && text.length > 0 && !matches.includes(text)) {
          matches.push(text)
        }
      }
    }

    console.log("[v0] Found", matches.length, "matching elements by structure")
    return matches.length > 0 ? matches : [selectedText]
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    const selectedText = selection?.toString().trim()

    if (selectedText && selectedText.length > 3) {
      console.log("[v0] Selected text:", selectedText.substring(0, 100))

      // Find similar patterns
      const matches = findSimilarPatterns(selectedText)
      console.log("[v0] Found matches:", matches.length)

      setMatchedElements(matches)
      setPendingMatches(matches)
      setSelectedContent(selectedText)
      setShowContentDialog(true)
    }
  }

  const handleAddField = () => {
    if (!fieldName.trim()) {
      toast.error("Please give a name to this data field")
      return
    }

    const currentColor = HIGHLIGHT_COLORS[colorIndex % HIGHLIGHT_COLORS.length]

    const newField: ExtractedField = {
      id: Date.now().toString(),
      name: fieldName,
      pattern: selectedContent.substring(0, 100) + (selectedContent.length > 100 ? "..." : ""),
      matchedElements: matchedElements,
      color: `${currentColor.bg} ${currentColor.border}`,
    }

    setSchema((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }))

    toast.success(`"${fieldName}" added - ${matchedElements.length} elements found`, {
      description: "Pattern saved successfully",
    })

    setColorIndex((prev) => prev + 1)
    setShowContentDialog(false)
    setFieldName("")
    setSelectedContent("")
    setMatchedElements([])
    setPendingMatches([])
  }

  const handleCancelSelection = () => {
    setShowContentDialog(false)
    setFieldName("")
    setSelectedContent("")
    setMatchedElements([])
    setPendingMatches([])
  }

  const handleRemoveField = (id: string) => {
    setSchema((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }))
    toast.success("Field removed")
  }

  const handleSaveSchema = () => {
    if (schema.fields.length === 0) {
      toast.error("No patterns to save", {
        description: "Add at least one pattern before saving",
      })
      return
    }

    if (!schema.name.trim() || schema.name === "Untitled Schema") {
      toast.error("Please name your schema", {
        description: "Give your extraction schema a meaningful name",
      })
      return
    }

    if (onSaveSchema) {
      onSaveSchema(schema)
      console.log("[v0] Schema saved:", schema)
    }
  }

  const renderHighlightedData = () => {
    let content = rawData
    const allMatches: Array<{ text: string; color: string }> = []

    // Add confirmed fields
    schema.fields.forEach((field) => {
      field.matchedElements.forEach((match) => {
        allMatches.push({ text: match, color: field.color })
      })
    })

    // Add pending matches
    if (pendingMatches.length > 0) {
      const currentColor = HIGHLIGHT_COLORS[colorIndex % HIGHLIGHT_COLORS.length]
      pendingMatches.forEach((match) => {
        allMatches.push({ text: match, color: `${currentColor.bg} ${currentColor.border}` })
      })
    }

    // Sort by length (longest first) to avoid nested replacement issues
    allMatches.sort((a, b) => b.text.length - a.text.length)

    // Replace matches with highlighted spans
    allMatches.forEach((match, idx) => {
      const escapedText = match.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(escapedText, "g")
      const replacement = `<mark class="${match.color} border-2 rounded px-1 inline-block" data-match="${idx}">${match.text}</mark>`
      content = content.replace(regex, replacement)
    })

    return content
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[800px]">
      {/* Left Panel: Raw Data with Pattern Highlighting */}
      <div className="col-span-5 border border-primary/20 rounded-lg overflow-hidden flex flex-col">
        <div className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-3">
          <h3 className="font-semibold text-sm">Raw Data Preview</h3>
          <p className="text-xs text-muted-foreground">Select text to find similar patterns</p>
        </div>
        <ScrollArea className="flex-1">
          <pre
            ref={rawDataRef}
            className="p-4 text-xs font-mono whitespace-pre-wrap break-words select-text cursor-text"
            onMouseUp={handleTextSelection}
          >
            {rawData}
          </pre>
        </ScrollArea>
      </div>

      {/* Middle Panel: Extracted Fields */}
      <div className="col-span-4 border border-primary/20 rounded-lg overflow-hidden flex flex-col">
        <div className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-3">
          <h3 className="font-semibold text-sm">Extracted Patterns</h3>
          <Input
            value={schema.name}
            onChange={(e) => setSchema({ ...schema, name: e.target.value })}
            className="mt-2 h-8 text-xs"
            placeholder="Name your extraction schema"
          />
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {schema.fields.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground">No patterns extracted</p>
                <p className="text-xs text-muted-foreground/60">Select text to find similar elements</p>
              </div>
            ) : (
              schema.fields.map((field) => (
                <div
                  key={field.id}
                  className="p-3 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${field.color} border-2`} />
                      <Badge variant="outline" className="text-xs">
                        {field.name}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveField(field.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    <strong>{field.matchedElements.length}</strong> elements found
                  </p>
                  <p className="text-xs text-muted-foreground/70 line-clamp-2">{field.pattern}</p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="border-t border-primary/20 p-3">
          <Button className="w-full" onClick={handleSaveSchema} disabled={schema.fields.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save Schema
          </Button>
        </div>
      </div>

      {/* Right Panel: Preview All Extracted Data */}
      <div className="col-span-3 border border-primary/20 rounded-lg overflow-hidden flex flex-col">
        <div className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-3">
          <h3 className="font-semibold text-sm">Extracted Data</h3>
          <p className="text-xs text-muted-foreground">
            {schema.fields.reduce((sum, f) => sum + f.matchedElements.length, 0)} total items
          </p>
        </div>
        <ScrollArea className="flex-1 p-4">
          {schema.fields.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">No data extracted</p>
              <p className="text-xs text-muted-foreground/60">Add patterns to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schema.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded ${field.color} border`} />
                    <Label className="text-xs font-semibold">{field.name}</Label>
                  </div>
                  {field.matchedElements.slice(0, 5).map((element, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg ${field.color.split(" ")[0]} border ${field.color.split(" ")[1]} text-xs`}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: element.replace(/<[^>]+>/g, ""),
                        }}
                      />
                    </div>
                  ))}
                  {field.matchedElements.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{field.matchedElements.length - 5} more items
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Dialog for naming selected pattern */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pattern Found - Name This Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-green-600 dark:text-green-400">
                  Found {matchedElements.length} similar element(s)
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                All elements with the same HTML structure will be extracted
              </p>
            </div>

            <div>
              <Label>What is this data?</Label>
              <Input
                placeholder='e.g., "Announcement Title", "Date", "Link", "Description"'
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddField()
                  }
                }}
                autoFocus
              />
            </div>

            <div>
              <Label>Preview of matched elements:</Label>
              <ScrollArea className="h-48 mt-2 p-3 rounded-lg bg-background/50 border border-primary/10">
                <div className="space-y-2">
                  {matchedElements.slice(0, 3).map((element, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg ${HIGHLIGHT_COLORS[colorIndex % HIGHLIGHT_COLORS.length]} border-2 text-xs`}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: element.replace(/<[^>]+>/g, ""),
                        }}
                      />
                    </div>
                  ))}
                  {matchedElements.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      ... and {matchedElements.length - 3} more
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancelSelection}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleAddField}>
                <Check className="h-4 w-4 mr-2" />
                Add to Schema
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
