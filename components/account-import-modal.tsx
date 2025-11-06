"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle, AlertCircle, Trash2, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { apiClient, AccountCreate } from "@/lib/api-client"

interface ParsedAccount extends AccountCreate {
  _id: string
  _status: "valid" | "warning" | "error"
  _errors: string[]
}

interface AccountImportModalProps {
  onImportComplete?: () => void
}

export function AccountImportModal({ onImportComplete }: AccountImportModalProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parsedAccounts, setParsedAccounts] = useState<ParsedAccount[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)

  // Dosya formatlarını parse et
  const parseFile = async (file: File) => {
    const text = await file.text()
    const extension = file.name.split(".").pop()?.toLowerCase()

    let accounts: Partial<AccountCreate>[] = []

    try {
      switch (extension) {
        case "json":
          accounts = parseJSON(text)
          break
        case "csv":
          accounts = parseCSV(text)
          break
        case "txt":
        case "md":
          accounts = parseTXT(text)
          break
        default:
          throw new Error("Desteklenmeyen dosya formatı. JSON, CSV, TXT veya MD kullanın.")
      }

      // Validate ve enrich
      const enrichedAccounts: ParsedAccount[] = accounts.map((acc, idx) => {
        const errors: string[] = []
        let status: "valid" | "warning" | "error" = "valid"

        // Validation
        if (!acc.platform) {
          errors.push("Platform eksik")
          status = "error"
        }
        if (!acc.username) {
          errors.push("Username eksik")
          status = "error"
        }
        if (!acc.display_name) {
          errors.push("Display name önerilir")
          status = status === "error" ? "error" : "warning"
        }

        return {
          _id: `${idx}-${Date.now()}`,
          platform: acc.platform || "",
          username: acc.username || "",
          display_name: acc.display_name || acc.username || "",
          email: acc.email || "",
          is_active: acc.is_active !== false,
          _status: status,
          _errors: errors,
        }
      })

      setParsedAccounts(enrichedAccounts)
      toast.success(`${enrichedAccounts.length} hesap yüklendi`)
    } catch (error: any) {
      toast.error("Dosya okunamadı", { description: error.message })
    }
  }

  // JSON Parser
  const parseJSON = (text: string): Partial<AccountCreate>[] => {
    const data = JSON.parse(text)
    if (Array.isArray(data)) return data
    if (data.accounts && Array.isArray(data.accounts)) return data.accounts
    return [data]
  }

  // CSV Parser
  const parseCSV = (text: string): Partial<AccountCreate>[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length === 0) return []

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim())
      const obj: any = {}

      headers.forEach((header, idx) => {
        // Header mapping
        const mapping: Record<string, string> = {
          platform: "platform",
          username: "username",
          user: "username",
          name: "display_name",
          display_name: "display_name",
          displayname: "display_name",
          email: "email",
          mail: "email",
          active: "is_active",
          is_active: "is_active",
          status: "is_active",
        }

        const key = mapping[header] || header
        let value: any = values[idx] || ""

        // is_active conversion
        if (key === "is_active") {
          value = ["true", "1", "yes", "active"].includes(value.toLowerCase())
        }

        obj[key] = value
      })

      return obj
    })
  }

  // TXT/MD Parser (satır satır)
  const parseTXT = (text: string): Partial<AccountCreate>[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    const accounts: Partial<AccountCreate>[] = []

    for (const line of lines) {
      // Skip comments and headers
      if (line.startsWith("#") || line.startsWith("//")) continue

      // Split by colon
      const parts = line.split(":")
      
      // Pattern 1: username:password:phone:hash (4 parts - Twitter accounts format)
      if (parts.length === 4) {
        accounts.push({
          platform: "twitter",
          username: parts[0].trim().startsWith("@") ? parts[0].trim() : `@${parts[0].trim()}`,
          display_name: parts[0].trim(),
          email: parts[2].trim(), // Phone number as email for now
          password: parts[1].trim(), // Password field
        })
        continue
      }

      // Pattern 2: platform:username:display_name:email
      if (parts.length >= 3) {
        const possiblePlatform = parts[0].toLowerCase()
        const knownPlatforms = ["twitter", "linkedin", "instagram", "facebook", "tiktok", "google"]
        
        if (knownPlatforms.includes(possiblePlatform)) {
          accounts.push({
            platform: possiblePlatform,
            username: parts[1].trim(),
            display_name: parts[2]?.trim() || parts[1].trim(),
            email: parts[3]?.trim() || "",
          })
          continue
        }
      }

      // Pattern 3: @username (twitter varsayılan)
      const pattern2 = /^@([\w-]+)$/
      const match2 = line.match(pattern2)
      if (match2) {
        accounts.push({
          platform: "twitter",
          username: `@${match2[1]}`,
          display_name: match2[1],
        })
        continue
      }

      // Pattern 4: sadece username
      if (line.match(/^[\w-]+$/)) {
        accounts.push({
          platform: "twitter",
          username: line.startsWith("@") ? line : `@${line}`,
          display_name: line,
        })
      }
    }

    return accounts
  }

  // Hesap düzenle
  const updateAccount = (id: string, field: keyof AccountCreate, value: any) => {
    setParsedAccounts((prev) =>
      prev.map((acc) => {
        if (acc._id === id) {
          const updated = { ...acc, [field]: value }
          // Re-validate
          const errors: string[] = []
          if (!updated.platform) errors.push("Platform eksik")
          if (!updated.username) errors.push("Username eksik")
          return {
            ...updated,
            _status: errors.length > 0 ? "error" : "valid",
            _errors: errors,
          }
        }
        return acc
      }),
    )
  }

  // Hesap sil
  const removeAccount = (id: string) => {
    setParsedAccounts((prev) => prev.filter((acc) => acc._id !== id))
  }

  // Import işlemi
  const handleImport = async () => {
    const validAccounts = parsedAccounts.filter((acc) => acc._status !== "error")

    if (validAccounts.length === 0) {
      toast.error("İçe aktarılacak geçerli hesap yok")
      return
    }

    setIsImporting(true)
    try {
      // Backend'e gönder
      const accountsToImport = validAccounts.map(({ _id, _status, _errors, ...acc }) => acc)

      const result = await apiClient.createAccountsBulk(accountsToImport)
      setImportResult(result)

      toast.success("Import tamamlandı!", {
        description: `${result.created} hesap eklendi, ${result.skipped} hesap atlandı`,
      })

      if (onImportComplete) onImportComplete()

      // Biraz bekle ve kapat
      setTimeout(() => {
        setOpen(false)
        setParsedAccounts([])
        setFile(null)
        setImportResult(null)
      }, 3000)
    } catch (error: any) {
      toast.error("Import hatası", { description: error.message })
    } finally {
      setIsImporting(false)
    }
  }

  const validCount = parsedAccounts.filter((a) => a._status === "valid").length
  const warningCount = parsedAccounts.filter((a) => a._status === "warning").length
  const errorCount = parsedAccounts.filter((a) => a._status === "error").length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Hesap İçe Aktar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Hesap İçe Aktarma</DialogTitle>
          <DialogDescription>JSON, CSV, TXT veya MD formatında hesap listesi yükleyin</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* File Upload */}
          {parsedAccounts.length === 0 && (
            <div className="border-2 border-dashed rounded-lg p-12 text-center space-y-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="font-medium mb-2">Dosya Yükle</p>
                <p className="text-sm text-muted-foreground mb-4">Desteklenen formatlar: JSON, CSV, TXT, MD</p>
                <input
                  type="file"
                  accept=".json,.csv,.txt,.md"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      setFile(f)
                      parseFile(f)
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>Dosya Seç</span>
                  </Button>
                </label>
              </div>

              {/* Format Örnekleri */}
              <div className="text-left mt-8 space-y-2 text-xs">
                <p className="font-medium">Format Örnekleri:</p>
                <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded">
                  <div>
                    <p className="font-medium mb-1">TXT (Twitter Format):</p>
                    <pre className="text-[10px]">
                      {`username:password:phone:hash
wEeN5cgz0M97nbG:19901990:+9647710862120:...
Rain16928888:Aa123456:+966550134793:...`}
                    </pre>
                    <p className="text-[9px] text-muted-foreground mt-1">
                      Password ve hash saklanmaz, sadece parse edilir
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">CSV/TXT (Genel):</p>
                    <pre className="text-[10px]">
                      {`platform,username,display_name
twitter,@user1,User One
linkedin,john-doe,John Doe`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedAccounts.length > 0 && !importResult && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {validCount} Geçerli
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                  {warningCount} Uyarı
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <AlertCircle className="h-3 w-3 text-red-500" />
                  {errorCount} Hata
                </Badge>
              </div>

              {/* Table */}
              <ScrollArea className="h-96 border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Durum</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-20">Aktif</TableHead>
                      <TableHead className="w-20">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedAccounts.map((account) => (
                      <TableRow key={account._id}>
                        <TableCell>
                          {account._status === "valid" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {account._status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                          {account._status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </TableCell>
                        <TableCell>
                          <Select value={account.platform} onValueChange={(v) => updateAccount(account._id, "platform", v)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="tiktok">TikTok</SelectItem>
                              <SelectItem value="google">Google</SelectItem>
                              <SelectItem value="unknown">Other / Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={account.username}
                            onChange={(e) => updateAccount(account._id, "username", e.target.value)}
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={account.display_name}
                            onChange={(e) => updateAccount(account._id, "display_name", e.target.value)}
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={account.email}
                            onChange={(e) => updateAccount(account._id, "email", e.target.value)}
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={account.is_active}
                            onCheckedChange={(checked) => updateAccount(account._id, "is_active", checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeAccount(account._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="text-center space-y-4 py-8">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
              <div>
                <p className="text-xl font-semibold mb-2">Import Tamamlandı!</p>
                <p className="text-muted-foreground">
                  {importResult.created} hesap eklendi, {importResult.skipped} hesap atlandı
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {parsedAccounts.length > 0 && !importResult && (
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setParsedAccounts([])
                setFile(null)
              }}
            >
              İptal
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting || errorCount > 0 || validCount === 0}
              className="gap-2"
            >
              {isImporting ? "İçe Aktarılıyor..." : `${validCount} Hesabı İçe Aktar`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
