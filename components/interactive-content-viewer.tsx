"use client"

interface InteractiveContentViewerProps {
  content: string
  format: string
  onAddCSSSelector?: (selector: string) => void
  onAddKeywordFilter?: (keyword: string, type: "include" | "exclude") => void
  onAddElementFilter?: (element: string) => void
}

export function InteractiveContentViewer({ content, format }: InteractiveContentViewerProps) {
  return (
    <div className="relative">
      <pre className="text-xs overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap break-words p-3 rounded bg-black/20 border border-primary/5">
        {content}
      </pre>
    </div>
  )
}
