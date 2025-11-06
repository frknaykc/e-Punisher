"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Shuffle, Loader2 } from "lucide-react"
import type { Platform } from "@/components/dashboard"
import { apiClient, Account } from "@/lib/api-client"
import { toast } from "sonner"

interface AccountSelectorProps {
  platform: Platform
  selectedAccounts: string[]
  onAccountsChange: (accounts: string[]) => void
}

interface AccountItem {
  id: string
  username: string
  followers: string
  is_active: boolean
}

export function AccountSelector({ platform, selectedAccounts, onAccountsChange }: AccountSelectorProps) {
  const [accounts, setAccounts] = useState<AccountItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectionMode, setSelectionMode] = useState<"manual" | "all" | "random">("manual")

  // Backend'den hesapları çek
  useEffect(() => {
    loadAccounts()
  }, [platform])

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Account Selection
            </CardTitle>
            <CardDescription>Select accounts to perform actions on</CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {selectedAccounts.length} / {accounts.length} selected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
            Clear Selection
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading accounts...</span>
          </div>
        ) : accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
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
          <div className="text-center py-8 text-muted-foreground">
            No {platform} accounts available. Add accounts in Account Management.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
