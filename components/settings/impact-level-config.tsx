"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Save, RotateCcw } from "lucide-react"

export function ImpactLevelConfig() {
  const [safeConfig, setSafeConfig] = useState({
    minDelay: 30,
    maxDelay: 60,
    actionsPerHour: 20,
    randomization: 80,
  })

  const [fastConfig, setFastConfig] = useState({
    minDelay: 10,
    maxDelay: 20,
    actionsPerHour: 60,
    randomization: 50,
  })

  const [slowEffectiveConfig, setSlowEffectiveConfig] = useState({
    minDelay: 60,
    maxDelay: 120,
    actionsPerHour: 10,
    randomization: 90,
  })

  const resetToDefaults = (level: string) => {
    switch (level) {
      case "safe":
        setSafeConfig({ minDelay: 30, maxDelay: 60, actionsPerHour: 20, randomization: 80 })
        break
      case "fast":
        setFastConfig({ minDelay: 10, maxDelay: 20, actionsPerHour: 60, randomization: 50 })
        break
      case "slow-effective":
        setSlowEffectiveConfig({ minDelay: 60, maxDelay: 120, actionsPerHour: 10, randomization: 90 })
        break
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Impact Level Configuration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Configure timing, speed, and safety parameters for each impact level used in Booster and Attack operations.
        </p>
      </div>

      <Tabs defaultValue="safe" className="space-y-6">
        <TabsList className="glass-card p-1.5">
          <TabsTrigger
            value="safe"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_20px_rgba(239,68,68,0.5)] data-[state=active]:border data-[state=active]:border-primary/50 px-6 py-2.5 font-medium transition-all duration-300"
          >
            Safe
          </TabsTrigger>
          <TabsTrigger
            value="fast"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_20px_rgba(239,68,68,0.5)] data-[state=active]:border data-[state=active]:border-primary/50 px-6 py-2.5 font-medium transition-all duration-300"
          >
            Fast
          </TabsTrigger>
          <TabsTrigger
            value="slow-effective"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_20px_rgba(239,68,68,0.5)] data-[state=active]:border data-[state=active]:border-primary/50 px-6 py-2.5 font-medium transition-all duration-300"
          >
            Slow but Effective
          </TabsTrigger>
        </TabsList>

        <TabsContent value="safe">
          <Card className="glass-card">
            <CardHeader className="gradient-overlay">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Safe Mode Configuration
              </CardTitle>
              <CardDescription>Longer delays between actions, minimal risk detection</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[safeConfig.minDelay]}
                      onValueChange={([value]) => setSafeConfig({ ...safeConfig, minDelay: value })}
                      min={10}
                      max={120}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={safeConfig.minDelay}
                      onChange={(e) => setSafeConfig({ ...safeConfig, minDelay: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[safeConfig.maxDelay]}
                      onValueChange={([value]) => setSafeConfig({ ...safeConfig, maxDelay: value })}
                      min={20}
                      max={180}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={safeConfig.maxDelay}
                      onChange={(e) => setSafeConfig({ ...safeConfig, maxDelay: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Actions Per Hour</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[safeConfig.actionsPerHour]}
                      onValueChange={([value]) => setSafeConfig({ ...safeConfig, actionsPerHour: value })}
                      min={5}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={safeConfig.actionsPerHour}
                      onChange={(e) => setSafeConfig({ ...safeConfig, actionsPerHour: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timing Randomization (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[safeConfig.randomization]}
                      onValueChange={([value]) => setSafeConfig({ ...safeConfig, randomization: value })}
                      min={0}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={safeConfig.randomization}
                      onChange={(e) => setSafeConfig({ ...safeConfig, randomization: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Higher randomization makes actions appear more human-like
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] smooth-transition border-2 border-primary/50 hover:border-primary">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => resetToDefaults("safe")}
                  className="gap-2 glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fast">
          <Card className="glass-card">
            <CardHeader className="gradient-overlay">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Fast Mode Configuration
              </CardTitle>
              <CardDescription>Moderate speed with balanced safety</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[fastConfig.minDelay]}
                      onValueChange={([value]) => setFastConfig({ ...fastConfig, minDelay: value })}
                      min={5}
                      max={60}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={fastConfig.minDelay}
                      onChange={(e) => setFastConfig({ ...fastConfig, minDelay: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[fastConfig.maxDelay]}
                      onValueChange={([value]) => setFastConfig({ ...fastConfig, maxDelay: value })}
                      min={10}
                      max={120}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={fastConfig.maxDelay}
                      onChange={(e) => setFastConfig({ ...fastConfig, maxDelay: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Actions Per Hour</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[fastConfig.actionsPerHour]}
                      onValueChange={([value]) => setFastConfig({ ...fastConfig, actionsPerHour: value })}
                      min={20}
                      max={200}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={fastConfig.actionsPerHour}
                      onChange={(e) => setFastConfig({ ...fastConfig, actionsPerHour: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timing Randomization (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[fastConfig.randomization]}
                      onValueChange={([value]) => setFastConfig({ ...fastConfig, randomization: value })}
                      min={0}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={fastConfig.randomization}
                      onChange={(e) => setFastConfig({ ...fastConfig, randomization: Number(e.target.value) })}
                      className="w-20 glass-card"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] smooth-transition border-2 border-primary/50 hover:border-primary">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => resetToDefaults("fast")}
                  className="gap-2 glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slow-effective">
          <Card className="glass-card">
            <CardHeader className="gradient-overlay">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Slow but Effective Configuration
              </CardTitle>
              <CardDescription>Maximum effectiveness with careful timing</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[slowEffectiveConfig.minDelay]}
                      onValueChange={([value]) => setSlowEffectiveConfig({ ...slowEffectiveConfig, minDelay: value })}
                      min={30}
                      max={180}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={slowEffectiveConfig.minDelay}
                      onChange={(e) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, minDelay: Number(e.target.value) })
                      }
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Delay Between Actions (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[slowEffectiveConfig.maxDelay]}
                      onValueChange={([value]) => setSlowEffectiveConfig({ ...slowEffectiveConfig, maxDelay: value })}
                      min={60}
                      max={300}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={slowEffectiveConfig.maxDelay}
                      onChange={(e) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, maxDelay: Number(e.target.value) })
                      }
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Actions Per Hour</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[slowEffectiveConfig.actionsPerHour]}
                      onValueChange={([value]) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, actionsPerHour: value })
                      }
                      min={5}
                      max={50}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={slowEffectiveConfig.actionsPerHour}
                      onChange={(e) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, actionsPerHour: Number(e.target.value) })
                      }
                      className="w-20 glass-card"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Timing Randomization (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[slowEffectiveConfig.randomization]}
                      onValueChange={([value]) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, randomization: value })
                      }
                      min={0}
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={slowEffectiveConfig.randomization}
                      onChange={(e) =>
                        setSlowEffectiveConfig({ ...slowEffectiveConfig, randomization: Number(e.target.value) })
                      }
                      className="w-20 glass-card"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] smooth-transition border-2 border-primary/50 hover:border-primary">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
                <Button
                  variant="outline"
                  onClick={() => resetToDefaults("slow-effective")}
                  className="gap-2 glass-card hover:bg-primary/10 border-primary/30 hover:border-primary/50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
