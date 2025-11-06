"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Shuffle, X, Loader2 } from "lucide-react"
import type { Platform } from "@/components/dashboard"
import { cn } from "@/lib/utils"
import { apiClient, Account } from "@/lib/api-client"
import { toast } from "sonner"

interface AccountDrawerProps {
  platform: Platform
  selectedAccounts: string[]
  onAccountsChange: (accounts: string[]) => void
  isOpen: boolean
  onClose: () => void
}

interface AccountItem {
  id: string
  username: string
  followers: string
  is_active: boolean
}

export function AccountDrawer({ platform, selectedAccounts, onAccountsChange, isOpen, onClose }: AccountDrawerProps) {
  const [accounts, setAccounts] = useState<AccountItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectionMode, setSelectionMode] = useState<"manual" | "all" | "random">("manual")

  // Backend'den hesapları çek
  useEffect(() => {
    if (isOpen) {
      loadAccounts()
    }
  }, [platform, isOpen])

  const loadAccounts = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.getAccounts(platform, true)
      
      // Backend hesaplarını AccountItem formatına çevir
      const formattedAccounts: AccountItem[] = response.accounts.map((acc: Account) => ({
        id: acc.id.toString(),
        username: acc.username,
        followers: "0", // Backend'den gelmiyor şimdilik, sonra eklenebilir
        is_active: acc.is_active,
      }))
      
      setAccounts(formattedAccounts)
    } catch (error: any) {
      console.error("Hesaplar yüklenemedi:", error)
      toast.error("Hesaplar yüklenemedi", {
        description: error.message || "Backend bağlantısı başarısız",
      })
      setAccounts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = () => {
    setSelectionMode("all")
    onAccountsChange(accounts.map((acc) => acc.id))
  }

  const handleSelectRandom = (count: number) => {
    setSelectionMode("random")
    const shuffled = [...accounts].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, Math.min(count, accounts.length))
    onAccountsChange(selected.map((acc) => acc.id))
  }

  const handleToggleAccount = (accountId: string) => {
    setSelectionMode("manual")
    if (selectedAccounts.includes(accountId)) {
      onAccountsChange(selectedAccounts.filter((id) => id !== accountId))
    } else {
      onAccountsChange([...selectedAccounts, accountId])
    }
  }

  const handleClearSelection = () => {
    setSelectionMode("manual")
    onAccountsChange([])
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-96 bg-card border-l border-border z-50 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Account Selection</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Select accounts to perform actions on</p>
              <Badge variant="secondary" className="text-sm">
                {selectedAccounts.length} / {accounts.length}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectionMode === "all" ? "default" : "outline"}
                size="sm"
                onClick={handleSelectAll}
                disabled={accounts.length === 0}
              >
                Select All
              </Button>
              <Button
                variant={selectionMode === "random" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelectRandom(100)}
                disabled={accounts.length === 0}
              >
                <Shuffle className="h-4 w-4 mr-1" />
                Random 100
              </Button>
              <Button
                variant={selectionMode === "random" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelectRandom(200)}
                disabled={accounts.length === 0}
              >
                <Shuffle className="h-4 w-4 mr-1" />
                Random 200
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearSelection} disabled={selectedAccounts.length === 0}>
                Clear
              </Button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Loading {platform} accounts...</span>
              </div>
            ) : accounts.length > 0 ? (
              <div className="space-y-2">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={account.id}
                      checked={selectedAccounts.includes(account.id)}
                      onCheckedChange={() => handleToggleAccount(account.id)}
                    />
                    <Label htmlFor={account.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{account.username}</div>
                      {account.followers !== "0" && (
                        <div className="text-xs text-muted-foreground">{account.followers} followers</div>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No {platform} accounts available</p>
                <p className="text-sm text-muted-foreground">Add accounts in Account Management</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <Button onClick={onClose} className="w-full">
              Apply Selection
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
