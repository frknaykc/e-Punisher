"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Twitter,
  Instagram,
  Linkedin,
  Chrome,
  Music,
  Facebook,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Filter,
  Database,
  Loader2,
  HelpCircle,
} from "lucide-react"
import { toast } from "sonner"
import { apiClient, Account as ApiAccount } from "@/lib/api-client"
import { AccountImportModal } from "@/components/account-import-modal"
import { EditAccountDialog } from "@/components/edit-account-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Account {
  id: string
  platform: "twitter" | "instagram" | "linkedin" | "google" | "tiktok" | "facebook"
  username: string
  displayName: string
  avatar: string
  followers: number
  isActive: boolean
  lastActivity: string
  tags: string[]
}

const mockAccounts: Account[] = [
  {
    id: "1",
    platform: "twitter",
    username: "@techinfluencer",
    displayName: "Tech Influencer",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 125000,
    isActive: true,
    lastActivity: "2 hours ago",
    tags: ["tech", "verified"],
  },
  {
    id: "2",
    platform: "twitter",
    username: "@marketingpro",
    displayName: "Marketing Pro",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 89000,
    isActive: true,
    lastActivity: "5 hours ago",
    tags: ["marketing"],
  },
  {
    id: "3",
    platform: "instagram",
    username: "@lifestyle_blogger",
    displayName: "Lifestyle Blogger",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 250000,
    isActive: false,
    lastActivity: "1 day ago",
    tags: ["lifestyle", "verified"],
  },
  {
    id: "4",
    platform: "linkedin",
    username: "john-doe-ceo",
    displayName: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 45000,
    isActive: true,
    lastActivity: "30 minutes ago",
    tags: ["business", "ceo"],
  },
  {
    id: "5",
    platform: "facebook",
    username: "brandpage",
    displayName: "Brand Page",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 180000,
    isActive: true,
    lastActivity: "1 hour ago",
    tags: ["brand"],
  },
  {
    id: "6",
    platform: "tiktok",
    username: "@viral_creator",
    displayName: "Viral Creator",
    avatar: "/placeholder.svg?height=40&width=40",
    followers: 500000,
    isActive: true,
    lastActivity: "15 minutes ago",
    tags: ["entertainment", "verified"],
  },
]

const platformIcons = {
  twitter: { icon: Twitter, color: "text-[#1DA1F2]", bg: "bg-[#1DA1F2]/10", name: "Twitter" },
  instagram: { icon: Instagram, color: "text-[#E4405F]", bg: "bg-[#E4405F]/10", name: "Instagram" },
  linkedin: { icon: Linkedin, color: "text-[#0A66C2]", bg: "bg-[#0A66C2]/10", name: "LinkedIn" },
  google: { icon: Chrome, color: "text-[#4285F4]", bg: "bg-[#4285F4]/10", name: "Google" },
  tiktok: { icon: Music, color: "text-foreground", bg: "bg-foreground/10", name: "TikTok" },
  facebook: { icon: Facebook, color: "text-[#1877F2]", bg: "bg-[#1877F2]/10", name: "Facebook" },
  unknown: { icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted", name: "Unknown" },
}

interface AccountManagementProps {
  searchQuery?: string
  demoMode: boolean
}

export function AccountManagement({ searchQuery = "", demoMode }: AccountManagementProps) {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [platformFilter, setPlatformFilter] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isBackendConnected, setIsBackendConnected] = useState(false)
  const [editingAccount, setEditingAccount] = useState<ApiAccount | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Backend'den hesapları çek
  useEffect(() => {
    if (demoMode) {
      loadAccountsFromBackend()
    }
  }, [demoMode])

  const loadAccountsFromBackend = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.getAccounts()
      
      // Backend hesaplarını frontend formatına çevir
      const backendAccounts: Account[] = response.accounts.map((acc: ApiAccount) => ({
        id: acc.id.toString(),
        platform: acc.platform as Account["platform"],
        username: acc.username,
        displayName: acc.display_name || acc.username,
        avatar: "/placeholder.svg?height=40&width=40",
        followers: 0, // Backend'den gelmiyor şimdilik
        isActive: acc.is_active,
        lastActivity: acc.last_used_at ? new Date(acc.last_used_at).toLocaleString() : "Hiç kullanılmadı",
        tags: acc.is_verified ? ["verified"] : [],
      }))

      setAccounts(backendAccounts)
      setIsBackendConnected(true)
      toast.success(`${backendAccounts.length} hesap yüklendi`)
    } catch (error: any) {
      console.error("Backend'den hesaplar yüklenemedi:", error)
      toast.warning("Backend'e bağlanılamadı", {
        description: "Demo veriler gösteriliyor",
      })
      setAccounts(mockAccounts)
      setIsBackendConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (accountId: string) => {
    if (!isBackendConnected) {
      toast.error("Backend bağlantısı yok")
      return
    }

    try {
      const updated = await apiClient.toggleAccountStatus(parseInt(accountId))
      
      // Local state güncelle
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === accountId
            ? { ...acc, isActive: updated.is_active }
            : acc
        )
      )
      
      toast.success("Hesap durumu güncellendi")
    } catch (error: any) {
      toast.error("İşlem başarısız", { description: error.message })
    }
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (!isBackendConnected) {
      toast.error("Backend bağlantısı yok")
      return
    }

    if (!confirm("Bu hesabı silmek istediğinizden emin misiniz?")) return

    try {
      await apiClient.deleteAccount(parseInt(accountId))
      setAccounts((prev) => prev.filter((acc) => acc.id !== accountId))
      toast.success("Hesap silindi")
    } catch (error: any) {
      toast.error("Silme başarısız", { description: error.message })
    }
  }

  const handleEditAccount = async (accountId: string) => {
    if (!isBackendConnected) {
      toast.error("Backend bağlantısı yok")
      return
    }

    try {
      const account = await apiClient.getAccount(parseInt(accountId))
      setEditingAccount(account)
      setIsEditDialogOpen(true)
    } catch (error: any) {
      toast.error("Hesap bilgileri alınamadı", { description: error.message })
    }
  }

  const handleEditSuccess = () => {
    loadAccountsFromBackend()
  }

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPlatform = platformFilter.size === 0 || platformFilter.has(account.platform)

    return matchesSearch && matchesPlatform
  })

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const togglePlatformFilter = (platform: string) => {
    const newFilter = new Set(platformFilter)
    if (newFilter.has(platform)) {
      newFilter.delete(platform)
    } else {
      newFilter.add(platform)
    }
    setPlatformFilter(newFilter)
  }

  if (!demoMode) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-6 rounded-full bg-muted">
          <Database className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">No Accounts Available</h3>
          <p className="text-muted-foreground max-w-md">
            Demo data is currently disabled. Enable demo mode in Settings to view sample accounts and test the platform.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isBackendConnected && (
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              Backend Bağlı
            </Badge>
          )}
          {isLoading && (
            <Badge variant="outline" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Yükleniyor...
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter by Platform
                {platformFilter.size > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {platformFilter.size}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Select Platforms</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(platformIcons).map(([key, config]) => {
                const Icon = config.icon
                return (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={platformFilter.has(key)}
                    onCheckedChange={() => togglePlatformFilter(key)}
                  >
                    <Icon className={`h-4 w-4 mr-2 ${config.color}`} />
                    {config.name}
                  </DropdownMenuCheckboxItem>
                )
              })}
              {platformFilter.size > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPlatformFilter(new Set())}>Clear Filters</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </p>
          {isBackendConnected && <AccountImportModal onImportComplete={loadAccountsFromBackend} />}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage all your social media accounts in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => {
                const platformConfig = platformIcons[account.platform as keyof typeof platformIcons] || platformIcons.unknown
                const PlatformIcon = platformConfig.icon

                return (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${platformConfig.bg}`}>
                          <PlatformIcon className={`h-4 w-4 ${platformConfig.color}`} />
                        </div>
                        <span className="font-medium">{platformConfig.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{account.displayName}</p>
                        <p className="text-sm text-muted-foreground">{account.username}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatFollowers(account.followers)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {account.isActive ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-green-500 font-medium text-sm">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium text-sm">Inactive</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{account.lastActivity}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {account.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditAccount(account.id)}>
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(account.id)}>
                            {account.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Analytics</DropdownMenuItem>
                          <DropdownMenuItem>Manage Tags</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            Remove Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredAccounts.length === 0 && (
            <div className="flex items-center justify-center h-32 border border-dashed border-border rounded-lg mt-4">
              <p className="text-muted-foreground">No accounts found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Account Dialog */}
      <EditAccountDialog
        account={editingAccount}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}
