# Themed Card System Documentation

## Overview
The themed card system provides consistent, reusable card components across the entire application. All card styling is centralized in `components/ui/themed-card.tsx` and `components/ui/themed-tabs.tsx`.

## Components

### ThemedCard
Base card component with variant support.

**Variants:**
- `default` - Standard card
- `glass` - Glass morphism effect with primary border
- `elevated` - Card with shadow elevation
- `glow` - Card with red glow effect

**Usage:**
\`\`\`tsx
<ThemedCard variant="glass">
  <ThemedCardHeader>
    <ThemedCardTitle size="lg">Title</ThemedCardTitle>
  </ThemedCardHeader>
</ThemedCard>
\`\`\`

### Specialized Cards

#### SessionCard
For session setup and configuration sections.
\`\`\`tsx
<SessionCard>
  <ThemedCardHeader>
    <ThemedCardTitle size="lg">Session Setup</ThemedCardTitle>
  </ThemedCardHeader>
  <ThemedCardContent spacing="default">
    {/* Content */}
  </ThemedCardContent>
</SessionCard>
\`\`\`

#### StatsCard
For statistics and metrics display.
\`\`\`tsx
<StatsCard>
  <ThemedCardHeader>
    <ThemedCardTitle size="sm">Stats</ThemedCardTitle>
  </ThemedCardHeader>
  <ThemedCardContent spacing="sm">
    {/* Stats content */}
  </ThemedCardContent>
</StatsCard>
\`\`\`

#### ContentCard
For main content areas with tabs or lists.
\`\`\`tsx
<ContentCard>
  <ThemedCardHeader>
    <ThemedCardTitle size="lg">Content Title</ThemedCardTitle>
    <ThemedCardDescription>Description</ThemedCardDescription>
  </ThemedCardHeader>
  <ThemedCardContent>
    {/* Content */}
  </ThemedCardContent>
</ContentCard>
\`\`\`

#### HeaderCard
For page headers and hero sections.
\`\`\`tsx
<HeaderCard>
  <ThemedCardHeader>
    <ThemedCardTitle size="2xl">Page Title</ThemedCardTitle>
    <ThemedCardDescription>Page description</ThemedCardDescription>
  </ThemedCardHeader>
</HeaderCard>
\`\`\`

## ThemedCardTitle Sizes
- `sm` - Small text (text-sm)
- `default` - Base text (text-base)
- `lg` - Large text (text-lg)
- `xl` - Extra large (text-xl)
- `2xl` - 2X large (text-2xl)

## ThemedCardContent Spacing
- `none` - No spacing (space-y-0)
- `sm` - Small spacing (space-y-2)
- `default` - Default spacing (space-y-4)
- `lg` - Large spacing (space-y-6)

## Themed Tabs

### ThemedTabsList
Tab list with variant support.

**Variants:**
- `default` - Standard tabs
- `glass` - Glass morphism effect

**Usage:**
\`\`\`tsx
<ThemedTabs defaultValue="tab1">
  <ThemedTabsList variant="glass">
    <ThemedTabsTrigger value="tab1">Tab 1</ThemedTabsTrigger>
    <ThemedTabsTrigger value="tab2">Tab 2</ThemedTabsTrigger>
  </ThemedTabsList>
  <ThemedTabsContent value="tab1">
    {/* Content */}
  </ThemedTabsContent>
</ThemedTabs>
\`\`\`

## Customization

To modify card styles globally:
1. Edit `components/ui/themed-card.tsx`
2. Update variant styles in the `variantStyles` object
3. Changes will apply to all cards using that variant

To create a new card variant:
1. Add new variant to the `variant` type union
2. Add corresponding styles to `variantStyles`
3. Use the new variant: `<ThemedCard variant="yourVariant">`

## Migration Guide

To migrate existing cards:

**Before:**
\`\`\`tsx
<Card className="glass-card border-primary/20">
  <CardHeader>
    <CardTitle className="text-lg">Title</CardTitle>
  </CardHeader>
</Card>
\`\`\`

**After:**
\`\`\`tsx
<SessionCard>
  <ThemedCardHeader>
    <ThemedCardTitle size="lg">Title</ThemedCardTitle>
  </ThemedCardHeader>
</SessionCard>
