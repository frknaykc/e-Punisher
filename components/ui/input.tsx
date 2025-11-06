import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-sm outline-none",
        "border-2 border-primary/30 bg-card/50",
        "transition-[color,box-shadow,border-color,background-color] duration-200",
        "hover:border-primary/50 hover:bg-card/70 hover:shadow-md",
        "focus-visible:border-primary focus-visible:ring-primary/30 focus-visible:ring-4 focus-visible:bg-card",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
