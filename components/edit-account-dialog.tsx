"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { apiClient, Account } from "@/lib/api-client"

interface EditAccountDialogProps {
  account: Account | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditAccountDialog({ account, open, onOpenChange, onSuccess }: EditAccountDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    platform: "",
    username: "",
    display_name: "",
    email: "",
    password: "",
    is_active: true,
  })

  // Account değiştiğinde formu güncelle
  useEffect(() => {
    if (account) {
      setFormData({
        platform: account.platform,
        username: account.username,
        display_name: account.display_name || "",
        email: account.email || "",
        password: account.password || "",
        is_active: account.is_active,
      })
    }
  }, [account])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!account) return

    setIsSubmitting(true)
    try {
      await apiClient.updateAccount(account.id, {
        display_name: formData.display_name || undefined,
        email: formData.email || undefined,
        password: formData.password || undefined,
        is_active: formData.is_active,
      })

      toast.success("Hesap güncellendi", {
        description: "Hesap bilgileri başarıyla güncellendi",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Güncelleme başarısız", {
        description: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!account) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hesap Düzenle</DialogTitle>
          <DialogDescription>Hesap bilgilerini güncelleyin</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Platform - Sadece gösterim */}
            <div className="space-y-2">
              <Label>Platform</Label>
              <div className="flex items-center gap-2">
                <Input value={formData.platform} disabled className="flex-1 capitalize" />
                <Badge variant="secondary" className="capitalize">
                  {formData.platform}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Platform değiştirilemez</p>
            </div>

            {/* Username - Sadece gösterim */}
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={formData.username} disabled />
              <p className="text-xs text-muted-foreground">Username değiştirilemez</p>
            </div>

            {/* Display Name - Düzenlenebilir */}
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Görünen ad"
              />
            </div>

            {/* Email - Düzenlenebilir */}
            <div className="space-y-2">
              <Label htmlFor="email">Email / Phone</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com or +123456789"
              />
            </div>

            {/* Password - Düzenlenebilir */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">
                Playwright otomasyonu için gerekli (plain text saklanır)
              </p>
            </div>

            {/* Active Status - Düzenlenebilir */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Aktif Durum</Label>
                <p className="text-xs text-muted-foreground">
                  {formData.is_active ? "Hesap aktif ve kullanılabilir" : "Hesap devre dışı"}
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            {/* Meta Bilgiler */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Oluşturma:</span>
                <span>{new Date(account.created_at).toLocaleString("tr-TR")}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Son Güncelleme:</span>
                <span>{new Date(account.updated_at).toLocaleString("tr-TR")}</span>
              </div>
              {account.last_used_at && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Son Kullanım:</span>
                  <span>{new Date(account.last_used_at).toLocaleString("tr-TR")}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span>Doğrulanmış:</span>
                <Badge variant={account.is_verified ? "default" : "secondary"} className="text-xs">
                  {account.is_verified ? "Evet" : "Hayır"}
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Kaydet"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

