import type * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

// Base themed card with glass effect and primary border
export function ThemedCard({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof Card> & {
  variant?: "default" | "glass" | "elevated" | "glow"
}) {
  const variantStyles = {
    default: "border-2 border-primary/40 shadow-sm hover:border-primary/60 hover:shadow-md transition-all duration-300",
    glass:
      "glass-card border-2 border-primary/40 shadow-lg hover:border-primary/60 hover:shadow-xl transition-all duration-300",
    elevated:
      "elevated-card border-2 border-primary/40 shadow-xl hover:border-primary/60 hover:shadow-2xl transition-all duration-300",
    glow: "glass-card border-2 border-primary/40 glow-red-sm hover-glow-red shadow-xl",
  }

  return <Card className={cn(variantStyles[variant], className)} {...props} />
}

// Card header with consistent styling
export function ThemedCardHeader({
  className,
  gradient = false,
  ...props
}: React.ComponentProps<typeof CardHeader> & {
  gradient?: boolean
}) {
  return <CardHeader className={cn(gradient && "gradient-overlay", className)} {...props} />
}

// Card title with size variants
export function ThemedCardTitle({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof CardTitle> & {
  size?: "sm" | "default" | "lg" | "xl" | "2xl"
}) {
  const sizeStyles = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  }

  return <CardTitle className={cn(sizeStyles[size], className)} {...props} />
}

// Card description with consistent muted styling
export function ThemedCardDescription({ className, ...props }: React.ComponentProps<typeof CardDescription>) {
  return <CardDescription className={cn("text-muted-foreground", className)} {...props} />
}

// Card content with optional spacing variants
export function ThemedCardContent({
  className,
  spacing = "default",
  ...props
}: React.ComponentProps<typeof CardContent> & {
  spacing?: "none" | "sm" | "default" | "lg"
}) {
  const spacingStyles = {
    none: "space-y-0",
    sm: "space-y-2",
    default: "space-y-4",
    lg: "space-y-6",
  }

  return <CardContent className={cn(spacingStyles[spacing], className)} {...props} />
}

// Specialized card for session/setup sections
export function SessionCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <ThemedCard
      variant="glass"
      className={cn("border-2 border-primary/40 hover:border-primary/60", className)}
      {...props}
    >
      {children}
    </ThemedCard>
  )
}

// Specialized card for stats/metrics
export function StatsCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <ThemedCard
      variant="glass"
      className={cn("border-2 border-primary/40 hover:border-primary/60 transition-all duration-300", className)}
      {...props}
    >
      {children}
    </ThemedCard>
  )
}

// Specialized card for content sections with tabs
export function ContentCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <ThemedCard
      variant="glass"
      className={cn("border-2 border-primary/40 hover:border-primary/60", className)}
      {...props}
    >
      {children}
    </ThemedCard>
  )
}

// Specialized card for header/hero sections
export function HeaderCard({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <ThemedCard
      variant="glass"
      className={cn("border-2 border-primary/40 hover:border-primary/60", className)}
      {...props}
    >
      {children}
    </ThemedCard>
  )
}
