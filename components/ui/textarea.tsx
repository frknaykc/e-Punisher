import type * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base shadow-sm outline-none",
        "border-2 border-primary/30 bg-card/50",
        "transition-[color,box-shadow,border-color,background-color] duration-200",
        "hover:border-primary/50 hover:bg-card/70 hover:shadow-md",
        "focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-4 focus-visible:bg-card",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
