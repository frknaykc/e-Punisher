import type * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

export function ThemedTabs({ className, ...props }: React.ComponentProps<typeof Tabs>) {
  return <Tabs className={cn("space-y-4", className)} {...props} />
}

export function ThemedTabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsList> & {
  variant?: "default" | "glass" | "elevated"
}) {
  const variantStyles = {
    default: "bg-card/80 border-2 border-border/60 shadow-md",
    glass: "glass-card border-2 border-primary/50 p-1.5 shadow-lg shadow-primary/10",
    elevated: "elevated-card border-2 border-primary/60 p-1 shadow-xl",
  }

  return <TabsList className={cn(variantStyles[variant], className)} {...props} />
}

export function ThemedTabsTrigger({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsTrigger> & {
  variant?: "default" | "glow" | "icon-glow"
}) {
  const variantStyles = {
    default: "data-[state=active]:border-primary/30 data-[state=active]:text-primary",
    glow: "tab-glow-hover data-[state=active]:tab-glow-active px-6 py-2.5 font-medium",
    "icon-glow":
      "tab-glow-hover data-[state=active]:icon-tab-glow-active data-[state=active]:text-primary flex flex-col items-center gap-1.5 py-3",
  }

  return <TabsTrigger className={cn(variantStyles[variant], className)} {...props} />
}

export function ThemedTabsContent({ className, ...props }: React.ComponentProps<typeof TabsContent>) {
  return <TabsContent className={cn("space-y-4", className)} {...props} />
}
