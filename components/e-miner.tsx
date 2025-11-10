"use client"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useState } from "react"
import { ThemedCard, ThemedCardContent, HeaderCard } from "@/components/ui/themed-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ThemedTabs, ThemedTabsList, ThemedTabsTrigger, ThemedTabsContent } from "@/components/ui/themed-tabs"
import { InteractiveContentViewer } from "./interactive-content-viewer"
import {
  Database,
  Search,
  Map,
  Globe,
  Table,
  Code,
  Loader2,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
  Edit,
  Save,
  Link2,
  ExternalLink,
  Plus,
  EyeOff,
  Layers,
} from "lucide-react"
import { apiClient, type ScrapeResponse, type ScrapingSession, type ScrapingTemplate } from "@/lib/api-client"
import { toast } from "sonner"
import { useEffect } from "react"
import { TemplateEditorModal } from "./template-editor-modal"
import { SaveAsTemplateDialog } from "./save-as-template-dialog"
import { AdvancedDataExtractor } from "./advanced-data-extractor" // Import AdvancedDataExtractor
import { TemplateManagementPanel } from "./template-management-panel" // Import TemplateManagementPanel

interface EMinerProps {
  demoMode: boolean
}

export function EMiner({ demoMode }: EMinerProps) {
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState<"markdown" | "json" | "html" | "text" | "csv">("markdown")
  const [activeTab, setActiveTab] = useState("scrape")
  const [isLoading, setIsLoading] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<ScrapeResponse | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [searchIn, setSearchIn] = useState<"web" | "sites">("web")
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [customSite, setCustomSite] = useState("")

  const [mapUrl, setMapUrl] = useState("")
  const [mappedUrls, setMappedUrls] = useState<string[]>([])
  const [isMapping, setIsMapping] = useState(false)

  const [crawlUrl, setCrawlUrl] = useState("")
  const [crawlDepth, setCrawlDepth] = useState(2)
  const [crawledPages, setCrawledPages] = useState<any[]>([])
  const [isCrawling, setIsCrawling] = useState(false)

  // History
  const [sessions, setSessions] = useState<ScrapingSession[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [selectedSession, setSelectedSession] = useState<ScrapingSession | null>(null)

  const [templates, setTemplates] = useState<ScrapingTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none")
  const [selectedTemplate, setSelectedTemplate] = useState<ScrapingTemplate | null>(null)
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [editingTemplateId, setEditingTemplateId] = useState<number | undefined>(undefined)
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false)

  // State for template management panel
  const [showTemplatePanel, setShowTemplatePanel] = useState(false)

  const [savedResults, setSavedResults] = useState<any[]>([])

  // State for Advanced Data Extractor
  const [showAdvancedExtractor, setShowAdvancedExtractor] = useState(false)

  // Load templates
  const loadTemplates = async () => {
    try {
      const response = await apiClient.getScrapingTemplates(0, 50)
      setTemplates(response.templates)
    } catch (error: any) {
      toast.error("Failed to load templates", {
        description: error.message,
      })
    }
  }

  useEffect(() => {
    loadTemplates()

    // Also load from localStorage
    const savedTemplates = localStorage.getItem("eminer_templates")
    if (savedTemplates) {
      const parsed = JSON.parse(savedTemplates)
      setTemplates((prev) => {
        // Merge API templates with localStorage templates, avoid duplicates
        const allTemplates = [...prev, ...parsed]
        const uniqueTemplates = allTemplates.filter(
          (template, index, self) => index === self.findIndex((t) => t.id === template.id),
        )
        return uniqueTemplates
      })
    }
  }, [])

  useEffect(() => {
    if (selectedTemplateId !== "none") {
      const template = templates.find((t) => t.id === Number.parseInt(selectedTemplateId))
      setSelectedTemplate(template || null)

      if (template) {
        setFormat(template.format as any)
      }
    } else {
      setSelectedTemplate(null)
    }
  }, [selectedTemplateId, templates])

  const loadSessions = async () => {
    setIsLoadingSessions(true)
    try {
      const response = await apiClient.getScrapingSessions(0, 50)
      setSessions(response.sessions)
    } catch (error: any) {
      toast.error("Failed to load sessions", {
        description: error.message,
      })
    } finally {
      setIsLoadingSessions(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    if (demoMode) {
      const pttRealData = `İhale Duyuruları</button></div><div class="styles_body__g_uHy " style="padding: 0px 11rem 0px 0px;"><div class="styles_list__IjI0b" aria-live="polite"><div class="col-3 col-t-4 col-tv-6" aria-labelledby="announcement-0"><div class="styles_container__owTXb"><div class="styles_content____3ti"><div class="styles_datetime__k3_TF"><span class="styles_bidDate__V2R4S" aria-label="İlan Tarihi">İlan Tarihi</span><div class="styles_number__F5HHX">7</div><div>Kasım</div><div class="styles_year__AH3RD">2025</div></div><div class="styles_description__B88D_"><p id="announcement-title-0" aria-label="İzmir PTT Başmüdürlüğü 23 kişilik Hamaliye Hizmet Alımı (17-30 Kasım 2025)">İzmir PTT Başmüdürlüğü 23 kişilik Hamaliye Hizmet Alımı (17-30 Kasım 2025)</p></div></div><div class="styles_readMore__KL9m3"><a aria-label="Daha Fazla Oku - İzmir PTT Başmüdürlüğü 23 kişilik Hamaliye Hizmet Alımı (17-30 Kasım 2025)" href="https://www.ptt.gov.tr/duyurular/izmir-ptt-basmudurlugu-23-kisilik-hamaliye-hizmet-alimi-17-30-kasim-2025-20788b06e1534b6aae27d7a30934feb8">Daha Fazla Oku</a></div></div></div><div class="col-3 col-t-4 col-tv-6" aria-labelledby="announcement-1"><div class="styles_container__owTXb"><div class="styles_content____3ti"><div class="styles_datetime__k3_TF"><span class="styles_bidDate__V2R4S" aria-label="İlan Tarihi">İlan Tarihi</span><div class="styles_number__F5HHX">6</div><div>Kasım</div><div class="styles_year__AH3RD">2025</div></div><div class="styles_description__B88D_"><p id="announcement-title-1" aria-label="PTT AŞ. Genel Müdürlüğü Dâhil Dâhilinde Bulunan Taşınmaz Satış İhalesi (Yozgat İli Merkez İlçesi 2383/2 Parsel)">PTT AŞ. Genel Müdürlüğü Dâhilinde Bulunan Taşınmaz Satış İhalesi (Yozgat İli Merkez İlçesi 2383/2 Parsel)</p></div></div><div class="styles_readMore__KL9m3"><a aria-label="Daha Fazla Oku - PTT AŞ. Genel Müdürlüğü Dâhilinde Bulunan Taşınmaz Satış İhalesi (Yozgat İli Merkez İlçesi 2383/2 Parsel)" href="https://www.ptt.gov.tr/duyurular/ptt-as-genel-mudurlugu-dahilinde-bulunan-tasinmaz-satis-ihalesi-yozgat-ili-merkez-ilcesi-2383-2-parsel-8f1a88a6e4c74d31962ad3e6c5fc5291">Daha Fazla Oku</a></div></div></div><div class="col-3 col-t-4 col-tv-6" aria-labelledby="announcement-2"><div class="styles_container__owTXb"><div class="styles_content____3ti"><div class="styles_datetime__k3_TF"><span class="styles_bidDate__V2R4S" aria-label="İlan Tarihi">İlan Tarihi</span><div class="styles_number__F5HHX">5</div><div>Kasım</div><div class="styles_year__AH3RD">2025</div></div><div class="styles_description__B88D_"><p id="announcement-title-2" aria-label="Antalya Bölge Müdürlüğü'ne Bağlı Muratpaşa PTT Başmüdürlüğünün 2024 Yılında Faturalandırılan ve Tahakkuk Etmiş Olan Elektrik Bedellerinin Ödenmesi">Antalya Bölge Müdürlüğü'ne Bağlı Muratpaşa PTT Başmüdürlüğünün 2024 Yılında Faturalandırılan ve Tahakkuk Etmiş Olan Elektrik Bedellerinin Ödenmesi</p></div></div><div class="styles_readMore__KL9m3"><a aria-label="Daha Fazla Oku - Antalya Bölge Müdürlüğü'ne Bağlı Muratpaşa PTT Başmüdürlüğünün 2024 Yılında Faturalandırılan ve Tahakkuk Etmiş Olan Elektrik Bedellerinin Ödenmesi" href="https://www.ptt.gov.tr/duyurular/antalya-bolge-mudurlugune-bagli-muratpasa-ptt-basmudurlugu-nun-2024-yilinda-faturala-c4dd4c2b63754b35b4e13d36dd4ed5e1">Daha Fazla Oku</a></div></div></div><div class="col-3 col-t-4 col-tv-6" aria-labelledby="announcement-3"><div class="styles_container__owTXb"><div class="styles_content____3ti"><div class="styles_datetime__k3_TF"><span class="styles_bidDate__V2R4S" aria-label="İlan Tarihi">İlan Tarihi</span><div class="styles_number__F5HHX">5</div><div>Kasım</div><div class="styles_year__AH3RD">2025</div></div><div class="styles_description__B88D_"><p id="announcement-title-3" aria-label="Antalya Bölge Müdürlüğü'ne Bağlı Alanya, Antalya, Elmalı, Finike, Gazipaşa, Kaş, Kemer, Kumluca, Manavgat, Muratpaşa ve Serik PTT Başmüdürlüklerinin 2024 Yılında Faturalandırılan ve Tahakkuk Etmiş Olan Doğalgaz Bedellerinin Ödenmesi">Antalya Bölge Müdürlüğü'ne Bağlı Alanya, Antalya, Elmalı, Finike, Gazipaşa, Kaş, Kemer, Kumluca, Manavgat, Muratpaşa ve Serik PTT Başmüdürlüklerinin 2024 Yılında Faturalandırılan ve Tahakkuk Etmiş Olan Doğalgaz Bedellerinin Ödenmesi</p></div></div><div class="styles_readMore__KL9m3"><a aria-label="Daha Fazla Oku" href="https://www.ptt.gov.tr/duyurular/antalya-bolge-mudurlugune-bagli-alanya-antalya-elmali-finike-gazipasa-kas-kemer-kumluc-fb83a02bdb3c421aa0fc92fe8eff8cd5">Daha Fazla Oku</a></div></div></div>`

      setScrapeResult({
        url: "https://www.ptt.gov.tr/duyurular?page=1&announcementType=3&pageSize=200",
        format: "html",
        content: pttRealData,
        metadata: {
          title: "T.C. Posta ve Telgraf Teşkilatı | İhale Duyuruları",
          links_count: 47,
          headings_count: 12,
          images_count: 8,
        },
        scraped_at: new Date().toISOString(),
        session_id: 1,
      })
      setEditedContent(pttRealData)

      // Demo sessions with real data
      setSessions([
        {
          id: 1,
          url: "https://www.ptt.gov.tr/duyurular?page=1&announcementType=3&pageSize=200",
          title: "T.C. Posta ve Telgraf Teşkilatı | Duyurular",
          format: "json",
          scraped_at: new Date(Date.now() - 3600000).toISOString(),
          content: JSON.stringify(
            {
              rawHtml: `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="T.C. Posta ve Telgraf Teşkilatı Duyurular Sayfası">
  <meta name="google-site-verification" content="bVx0mhHpHVWbn0cO6FDyC09w8-cFYjRd0m_x6BFB__A">
  <title>T.C. Posta ve Telgraf Teşkilatı | Duyurular</title>
  <link rel="icon" href="https://www.ptt.gov.tr/pttfavicon/favicon-32x32.png">
</head>
<body>
  <div class="container">
    <header class="main-header">
      <h1>T.C. Posta ve Telgraf Teşkilatı</h1>
      <nav class="main-nav">
        <a href="/">Anasayfa</a>
        <a href="/kurumsal">Kurumsal</a>
        <a href="/duyurular">Duyurular</a>
        <a href="/iletisim">İletişim</a>
      </nav>
    </header>
    
    <main class="content">
      <section class="announcements">
        <h2>Duyurular</h2>
        
        <article class="announcement-item">
          <h3>2025 Yılı Personel Alımı Duyurusu</h3>
          <p class="date">07.11.2025</p>
          <p class="summary">PTT A.Ş. 2025 yılı personel alım süreci başlamıştır. Detaylı bilgi için tıklayınız.</p>
          <a href="/duyurular/personel-alimi-2025" class="read-more">Devamını Oku</a>
        </article>
        
        <article class="announcement-item">
          <h3>Kargo Ücret Tarifesi Güncellendi</h3>
          <p class="date">05.11.2025</p>
          <p class="summary">2025 yılı kargo ücret tarifemiz güncellenmiştir. Yeni tarife için sayfamızı ziyaret ediniz.</p>
          <a href="/duyurular/kargo-ucret-tarifesi" class="read-more">Devamını Oku</a>
        </article>
        
        <article class="announcement-item">
          <h3>Bayram Öncesi Çalışma Saatleri</h3>
          <p class="date">03.11.2025</p>
          <p class="summary">Bayram öncesi şubelerimiz hafta sonu açık olacaktır. Çalışma saatlerimiz için tıklayınız.</p>
          <a href="/duyurular/bayram-calisma-saatleri" class="read-more">Devamını Oku</a>
        </article>
        
        <article class="announcement-item">
          <h3>Yeni PTT Mobil Uygulama Yayında</h3>
          <p class="date">01.11.2025</p>
          <p class="summary">Yenilenen PTT Mobil uygulaması tüm hizmetlerimizi cebinize taşıyor. Hemen indirin!</p>
          <a href="/duyurular/ptt-mobil-uygulama" class="read-more">Devamını Oku</a>
        </article>
        
        <article class="announcement-item">
          <h3>Dijital Posta Hizmeti Başladı</h3>
          <p class="date">28.10.2025</p>
          <p class="summary">Artık belgelerinizi dijital ortamda güvenli bir şekilde gönderebilirsiniz.</p>
          <a href="/duyurular/dijital-posta" class="read-more">Devamını Oku</a>
        </article>
      </section>
      
      <aside class="sidebar">
        <div class="widget">
          <h4>Hızlı Erişim</h4>
          <ul>
            <li><a href="/kargo-takip">Kargo Takip</a></li>
            <li><a href="/posta-kodu">Posta Kodu Sorgula</a></li>
            <li><a href="/subeler">Şube Bul</a></li>
            <li><a href="/ucret-hesapla">Ücret Hesapla</a></li>
          </ul>
        </div>
        
        <div class="widget">
          <h4>İletişim</h4>
          <p>Müşteri Hizmetleri: 444 1 788</p>
          <p>Email: info@ptt.gov.tr</p>
        </div>
      </aside>
    </main>
    
    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h5>Kurumsal</h5>
          <ul>
            <li><a href="/hakkimizda">Hakkımızda</a></li>
            <li><a href="/vizyon-misyon">Vizyon & Misyon</a></li>
            <li><a href="/yonetim">Yönetim</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Hizmetlerimiz</h5>
          <ul>
            <li><a href="/kargo">Kargo</a></li>
            <li><a href="/posta">Posta</a></li>
            <li><a href="/bankacilk">Bankacılık</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Yasal</h5>
          <ul>
            <li><a href="/kvkk">KVKK</a></li>
            <li><a href="/gizlilik">Gizlilik Politikası</a></li>
            <li><a href="/kullanim-kosullari">Kullanım Koşulları</a></li>
          </ul>
        </div>
      </div>
      <p class="copyright">© 2025 T.C. Posta ve Telgraf Teşkilatı A.Ş. Tüm hakları saklıdır.</p>
    </footer>
  </div>
  
  <script src="/js/main.js"></script>
  <script>
    // Analytics
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXXX');
  </script>
</body>
</html>`,
              metadata: {
                title: "T.C. Posta ve Telgraf Teşkilatı | Duyurular",
                google: "notranslate",
                language: "tr",
                "next-head-count": "20",
                "google-site-verification": "bVx0mhHpHVWbn0cO6FDyC09w8-cFYjRd0m_x6BFB__A",
                description: "T.C. Posta ve Telgraf Teşkilatı Duyurular Sayfası",
                viewport: [
                  "width=device-width",
                  "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
                ],
                favicon: "https://www.ptt.gov.tr/pttfavicon/android-icon-192x192.png",
                scrapeId: "3b9254b8-7149-47e6-ba15-114f438cadcc",
                sourceURL: "https://www.ptt.gov.tr/duyurular?page=1&announcementType=3&pageSize=200",
                url: "https://www.ptt.gov.tr/duyurular?page=1&announcementType=3&pageSize=200",
                statusCode: 200,
                contentType: "text/html; charset=utf-8",
                proxyUsed: "basic",
                cacheState: "hit",
                cachedAt: "2025-11-07T19:17:36.735Z",
                creditsUsed: 1,
                links_count: 47,
                headings_count: 12,
                images_count: 8,
              },
            },
            null,
            2,
          ),
          metadata: {
            title: "T.C. Posta ve Telgraf Teşkilatı | Duyurular",
            links_count: 47,
            headings_count: 12,
            images_count: 8,
          },
        },
        {
          id: 2,
          url: "https://demo-site.com/products",
          title: "Product Catalog",
          format: "json",
          scraped_at: new Date(Date.now() - 7200000).toISOString(),
          content: JSON.stringify(
            {
              products: [
                { id: 1, name: "Laptop Pro 15", price: 1299.99, stock: 45 },
                { id: 2, name: "Wireless Mouse", price: 29.99, stock: 120 },
                { id: 3, name: "USB-C Hub", price: 49.99, stock: 78 },
              ],
              total: 3,
              page: 1,
            },
            null,
            2,
          ),
          metadata: {
            title: "Products API",
            links_count: 12,
            headings_count: 5,
            images_count: 8,
          },
        },
        {
          id: 3,
          url: "https://tech-news.com/articles",
          title: "Latest Tech News",
          format: "markdown",
          scraped_at: new Date(Date.now() - 10800000).toISOString(),
          content:
            "# Tech News\n\n## Breaking: New AI Model Released\n\nA groundbreaking AI model was announced today...\n\n## Industry Updates\n\n- Tech stocks rise 5%\n- New startup funding round\n- Conference dates announced",
          metadata: {
            title: "Tech News",
            links_count: 25,
            headings_count: 8,
            images_count: 15,
          },
        },
      ])

      // Demo saved results with varied data
      setSavedResults([
        {
          id: 1001,
          url: "https://api.example.com/users",
          format: "json",
          content: JSON.stringify(
            {
              users: [
                { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
                { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
                { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "moderator" },
              ],
              total: 3,
              timestamp: new Date().toISOString(),
            },
            null,
            2,
          ),
          savedAt: new Date(Date.now() - 14400000).toISOString(),
        },
        {
          id: 1002,
          url: "https://api-docs.com/reference",
          format: "markdown",
          content:
            "# API Reference\n\n## Authentication\n\nAll API requests require authentication using Bearer tokens.\n\n```bash\nAuthorization: Bearer YOUR_TOKEN_HERE\n```\n\n## Endpoints\n\n### GET /users\nRetrieve all users\n\n### POST /users\nCreate a new user\n\n### DELETE /users/:id\nDelete a specific user",
          savedAt: new Date(Date.now() - 21600000).toISOString(),
        },
      ])

      // Demo templates
      setTemplates([
        {
          id: 101,
          name: "Blog Post Scraper",
          description: "Extract blog posts with title, content, and metadata",
          target_domain: "blog.example.com",
          format: "markdown",
          css_selectors: {
            title: "h1.post-title",
            content: "div.post-content",
            author: "span.author-name",
          },
          keyword_filters: {
            include: ["tutorial", "guide"],
            exclude: ["sponsored", "ad"],
          },
          element_filters: ["article", "main"],
        },
        {
          id: 102,
          name: "Product Data Extractor",
          description: "Get product names, prices, and images",
          target_domain: "shop.example.com",
          format: "json",
          css_selectors: {
            name: "h2.product-name",
            price: "span.price",
            image: "img.product-image",
          },
          keyword_filters: {
            include: [],
            exclude: ["out of stock"],
          },
          element_filters: ["div.product-card"],
        },
      ])

      toast.info("Demo mode enabled", {
        description: "Showing sample data for E-Miner",
      })
    } else {
      // Clear demo data when disabled
      setScrapeResult(null)
      setEditedContent("")
      setSessions([])
      setSavedResults([])
      // Keep templates but reload from API
      loadTemplates()
    }
  }, [demoMode])

  const handleStartScraping = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL")
      return
    }

    setIsLoading(true)
    setScrapeResult(null)

    try {
      const request: any = {
        url: url,
        format: format,
      }

      if (selectedTemplateId !== "none") {
        request.template_id = Number.parseInt(selectedTemplateId)
      }

      const result = await apiClient.scrapeWebsite(request)

      if (selectedTemplate && result.content) {
        result.content = applyTemplateFilters(result.content, selectedTemplate)
      }

      setScrapeResult(result)
      setEditedContent(result.content)
      toast.success("Scraping completed!", {
        description: selectedTemplate
          ? `Applied template: ${selectedTemplate.name}`
          : `${result.metadata.links_count} links, ${result.metadata.headings_count} headings found`,
      })

      loadSessions()
    } catch (error: any) {
      toast.error("Scraping failed", {
        description: error.message || "Failed to scrape the website",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyTemplateFilters = (content: string, template: ScrapingTemplate): string => {
    let filteredContent = content

    // Apply keyword filters
    if (template.keyword_filters) {
      const { include, exclude } = template.keyword_filters as any

      // Highlight included keywords
      if (include && include.length > 0) {
        include.forEach((keyword: string) => {
          const regex = new RegExp(`(${keyword})`, "gi")
          filteredContent = filteredContent.replace(regex, '<mark class="bg-green-500/20 text-green-400">$1</mark>')
        })
      }

      // Strike through excluded keywords
      if (exclude && exclude.length > 0) {
        exclude.forEach((keyword: string) => {
          const regex = new RegExp(`(${keyword})`, "gi")
          filteredContent = filteredContent.replace(regex, '<span class="line-through opacity-50">$1</span>')
        })
      }
    }

    return filteredContent
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query")
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement search API call
      toast.info("Search functionality", {
        description: `Searching for: ${searchQuery}`,
      })
    } catch (error: any) {
      toast.error("Search failed", {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMapUrls = async () => {
    if (!mapUrl.trim()) {
      toast.error("Please enter a URL")
      return
    }

    setIsMapping(true)
    setMappedUrls([])
    try {
      // TODO: Implement map API call
      // Demo data
      const demoUrls = [mapUrl, `${mapUrl}/about`, `${mapUrl}/contact`, `${mapUrl}/products`, `${mapUrl}/services`]
      setMappedUrls(demoUrls)
      toast.success("URL mapping completed!", {
        description: `Found ${demoUrls.length} URLs`,
      })
    } catch (error: any) {
      toast.error("Mapping failed", {
        description: error.message,
      })
    } finally {
      setIsMapping(false)
    }
  }

  const handleCrawl = async () => {
    if (!crawlUrl.trim()) {
      toast.error("Please enter a URL")
      return
    }

    setIsCrawling(true)
    setCrawledPages([])
    try {
      // TODO: Implement crawl API call
      toast.success("Crawl started!", {
        description: `Crawling ${crawlUrl} with depth ${crawlDepth}`,
      })
    } catch (error: any) {
      toast.error("Crawl failed", {
        description: error.message,
      })
    } finally {
      setIsCrawling(false)
    }
  }

  const handleSaveResult = () => {
    if (!scrapeResult) return

    const newResult = {
      id: Date.now(),
      url: scrapeResult.url,
      format: scrapeResult.format,
      content: isEditing ? editedContent : scrapeResult.content,
      savedAt: new Date().toISOString(),
    }

    setSavedResults((prev) => [newResult, ...prev])
    toast.success("Result saved!")
    setIsEditing(false)
  }

  const handleDeleteSession = async (sessionId: number) => {
    try {
      await apiClient.deleteScrapingSession(sessionId)
      toast.success("Session deleted")
      loadSessions()
    } catch (error: any) {
      toast.error("Failed to delete session", {
        description: error.message,
      })
    }
  }

  const handleViewSession = async (sessionId: number) => {
    try {
      const session = await apiClient.getScrapingSession(sessionId)
      setSelectedSession(session)
      setScrapeResult({
        url: session.url,
        format: session.format,
        content: session.content || "",
        metadata: session.metadata || {},
        scraped_at: session.scraped_at,
        session_id: session.id,
      })
      setEditedContent(session.content || "")
    } catch (error: any) {
      toast.error("Failed to load session", {
        description: error.message,
      })
    }
  }

  const handleTemplateEditorClose = () => {
    setShowTemplateEditor(false)
    setEditingTemplateId(undefined)
    loadTemplates()
  }

  const handleSaveAsTemplateClose = () => {
    setShowSaveAsTemplate(false)
    loadTemplates()
  }

  const handleAddCSSSelector = (selector: string) => {
    console.log("[v0] Adding CSS Selector:", selector)
    toast.info("CSS Selector added", {
      description: `Use Template Editor to save: ${selector}`,
    })
  }

  const handleAddKeywordFilter = (keyword: string, type: "include" | "exclude") => {
    console.log("[v0] Adding Keyword Filter:", keyword, type)
    toast.info(`Keyword ${type}d`, {
      description: `"${keyword}" - Use Template Editor to save`,
    })
  }

  const handleAddElementFilter = (element: string) => {
    console.log("[v0] Adding Element Filter:", element)
    toast.info("Element filter added", {
      description: `<${element}> - Use Template Editor to save`,
    })
  }

  const handleSaveSchemaAsTemplate = (schema: any) => {
    const newTemplate: Partial<ScrapingTemplate> = {
      name: schema.name,
      description: `Extraction schema with ${schema.fields.length} field(s) - Created from Advanced Extractor`,
      format: format,
      css_selectors: {},
      keyword_filters: { include: [], exclude: [] },
      element_filters: [],
    }

    // Convert schema fields to CSS selectors
    schema.fields.forEach((field: any) => {
      if (newTemplate.css_selectors) {
        // Use the pattern as a reference for the selector
        ;(newTemplate.css_selectors as any)[field.name] = field.pattern.substring(0, 50)
      }
    })

    // Create mock template with proper structure
    const mockTemplate: ScrapingTemplate = {
      id: Date.now(),
      name: newTemplate.name!,
      description: newTemplate.description,
      format: newTemplate.format!,
      css_selectors: newTemplate.css_selectors,
      keyword_filters: newTemplate.keyword_filters,
      element_filters: newTemplate.element_filters,
      target_domain: scrapeResult?.url ? new URL(scrapeResult.url).hostname : undefined,
    }

    // Add to templates state
    setTemplates((prev) => [...prev, mockTemplate])

    // Save to localStorage for persistence
    const savedTemplates = localStorage.getItem("eminer_templates")
    const existingTemplates = savedTemplates ? JSON.parse(savedTemplates) : []
    existingTemplates.push(mockTemplate)
    localStorage.setItem("eminer_templates", JSON.stringify(existingTemplates))

    toast.success("Schema saved as template!", {
      description: `"${schema.name}" is now available in templates. Open Template Management to view.`,
    })

    // Close Advanced Extractor view to show the result
    setShowAdvancedExtractor(false)
  }

  const renderResultsSection = () => {
    return (
      <ThemedCard className="glass-card border-primary/20">
        <div className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Results</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedExtractor(!showAdvancedExtractor)}>
                {showAdvancedExtractor ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Simple View
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Advanced Extractor
                  </>
                )}
              </Button>
              <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <ThemedCardContent spacing="lg">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-muted-foreground">Processing...</p>
            </div>
          ) : !scrapeResult ? (
            <div className="text-center py-12">
              <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">No results yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Start an operation to see results here</p>
            </div>
          ) : showAdvancedExtractor ? (
            // Pass handleSaveSchemaAsTemplate to AdvancedDataExtractor
            <AdvancedDataExtractor
              rawData={scrapeResult.content}
              format={format === "html" || format === "json" ? format : "html"}
              onSaveSchema={handleSaveSchemaAsTemplate}
            />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Title</span>
                  </div>
                  <p className="text-sm font-medium truncate">{scrapeResult.metadata.title}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Code className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-muted-foreground">Links</span>
                  </div>
                  <p className="text-sm font-medium">{scrapeResult.metadata.links_count}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Table className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Headings</span>
                  </div>
                  <p className="text-sm font-medium">{scrapeResult.metadata.headings_count}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Images</span>
                  </div>
                  <p className="text-sm font-medium">{scrapeResult.metadata.images_count}</p>
                </div>
              </div>

              {selectedTemplate && scrapeResult && (
                <div className="glass-card border border-primary/20 p-4 rounded-xl mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Template Applied: {selectedTemplate.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{selectedTemplate.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.keyword_filters &&
                      (selectedTemplate.keyword_filters as any).include?.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Include:</span>
                          {(selectedTemplate.keyword_filters as any).include.map((kw: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-green-500/10 text-green-400 border-green-500/30"
                            >
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      )}
                    {selectedTemplate.keyword_filters &&
                      (selectedTemplate.keyword_filters as any).exclude?.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Exclude:</span>
                          {(selectedTemplate.keyword_filters as any).exclude.map((kw: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      )}
                    {selectedTemplate.css_selectors && Object.keys(selectedTemplate.css_selectors).length > 0 && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {Object.keys(selectedTemplate.css_selectors).length} CSS Selector(s)
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-background/50 border border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Content ({format.toUpperCase()})</span>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            if (scrapeResult) {
                              scrapeResult.content = editedContent
                            }
                            setIsEditing(false)
                            toast.success("Changes applied")
                          }}
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Apply
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(scrapeResult?.content || "")
                            toast.success("Copied to clipboard!")
                          }}
                        >
                          <Code className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button variant="default" size="sm" onClick={handleSaveResult}>
                          <Save className="h-3 w-3 mr-1" />
                          Save to Table
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <InteractiveContentViewer
                    content={editedContent}
                    format={format}
                    onAddCSSSelector={handleAddCSSSelector}
                    onAddKeywordFilter={handleAddKeywordFilter}
                    onAddElementFilter={handleAddElementFilter}
                  />
                ) : (
                  <InteractiveContentViewer
                    content={scrapeResult?.content || ""}
                    format={format}
                    onAddCSSSelector={handleAddCSSSelector}
                    onAddKeywordFilter={handleAddKeywordFilter}
                    onAddElementFilter={handleAddElementFilter}
                  />
                )}
              </div>
            </div>
          )}
        </ThemedCardContent>
      </ThemedCard>
    )
  }

  const renderSavedResultsTable = () => {
    return (
      <ThemedCard className="glass-card border-primary/20 mt-6">
        <div className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Saved Results</h3>
            <span className="text-sm text-muted-foreground">({savedResults.length} items)</span>
          </div>
        </div>
        <ThemedCardContent spacing="lg">
          {savedResults.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">No saved results yet</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Save results to see them here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium truncate">{result.url}</h4>
                        <Badge variant="outline">{result.format.toUpperCase()}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Saved: {new Date(result.savedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setScrapeResult({
                            url: result.url,
                            format: result.format,
                            content: result.content,
                            metadata: {},
                            scraped_at: result.savedAt,
                          })
                          setEditedContent(result.content)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSavedResults((prev) => prev.filter((r) => r.id !== result.id))
                          toast.success("Result deleted")
                        }}
                        className="border-red-500/30 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ThemedCardContent>
      </ThemedCard>
    )
  }

  return (
    <div className="space-y-6">
      <HeaderCard title="e-Miner" description="API, Docs and Playground - all in one place" />

      <ThemedCard variant="glass">
        <ThemedCardContent spacing="lg">
          <ThemedTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ThemedTabsList variant="glass">
              <ThemedTabsTrigger value="scrape" variant="glow">
                <Database className="h-4 w-4 mr-2" />
                Scrape
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="search" variant="glow">
                <Search className="h-4 w-4 mr-2" />
                Search
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="map" variant="glow">
                <Map className="h-4 w-4 mr-2" />
                Map
              </ThemedTabsTrigger>
              <ThemedTabsTrigger value="crawl" variant="glow">
                <Globe className="h-4 w-4 mr-2" />
                Crawl
              </ThemedTabsTrigger>
            </ThemedTabsList>

            {/* Scrape Tab Content */}
            <ThemedTabsContent value="scrape" className="space-y-6 mt-6">
              {/* URL Input */}
              <div className="glass-card border border-primary/20 p-6 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium">https://</span>
                  <Input
                    placeholder="example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                  />
                </div>
              </div>

              <div className="glass-card border border-primary/20 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Template (Optional)</Label>
                  <Button variant="ghost" size="sm" onClick={() => setShowTemplateEditor(true)} className="text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    New Template
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-between bg-transparent"
                  onClick={() => setShowTemplatePanel(true)}
                >
                  <span>
                    {selectedTemplateId === "none"
                      ? "No template - Use manual settings"
                      : templates.find((t) => t.id.toString() === selectedTemplateId)?.name || "Select template"}
                  </span>
                  <Layers className="h-4 w-4 ml-2" />
                </Button>

                {/* Template Info */}
                {selectedTemplate && (
                  <div className="mt-2 p-2 bg-primary/5 rounded text-xs">
                    <p className="text-muted-foreground">{selectedTemplate.description || "No description"}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{selectedTemplate.format.toUpperCase()}</Badge>
                      {selectedTemplate.css_selectors && Object.keys(selectedTemplate.css_selectors).length > 0 && (
                        <Badge variant="outline">Custom Selectors</Badge>
                      )}
                      {selectedTemplate.keyword_filters &&
                        (selectedTemplate.keyword_filters as any).include?.length > 0 && (
                          <Badge variant="outline">Keyword Filters</Badge>
                        )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="glass-card border border-primary/20 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Removed Settings and Table buttons as they were not explicitly updated */}
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Format:</span>
                    <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                      <SelectTrigger className="w-[140px] border-primary/20 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="text">Plain Text</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 glow-red-md smooth-transition px-6"
                  onClick={handleStartScraping}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    "Start scraping"
                  )}
                </Button>
              </div>

              {renderResultsSection()}

              {renderSavedResultsTable()}

              {/* Scraping History */}
              <ThemedCard className="glass-card border-primary/20 mt-6">
                <div className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Scraping History</h3>
                      <span className="text-sm text-muted-foreground">
                        ({sessions.length} session{sessions.length !== 1 ? "s" : ""})
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadSessions}
                      disabled={isLoadingSessions}
                      className="border-primary/30 hover:bg-primary/10 bg-transparent"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingSessions ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
                <ThemedCardContent spacing="lg">
                  {isLoadingSessions ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground">Loading sessions...</p>
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No scraping sessions yet</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">Start scraping a website to see it here</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-sm font-medium truncate">{session.title || session.url}</h4>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${
                                    session.format === "markdown"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : session.format === "json"
                                        ? "bg-green-500/20 text-green-400"
                                        : session.format === "html"
                                          ? "bg-orange-500/20 text-orange-400"
                                          : session.format === "text"
                                            ? "bg-gray-500/20 text-gray-400"
                                            : "bg-purple-500/20 text-purple-400"
                                  }`}
                                >
                                  {session.format.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-2">{session.url}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {session.metadata && (
                                  <>
                                    <span>{session.metadata.links_count || 0} links</span>
                                    <span>{session.metadata.headings_count || 0} headings</span>
                                    <span>{session.metadata.images_count || 0} images</span>
                                  </>
                                )}
                                <span className="ml-auto">{new Date(session.scraped_at).toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewSession(session.id)}
                                className="border-primary/30 hover:bg-primary/10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSession(session.id)}
                                className="border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ThemedCardContent>
              </ThemedCard>
            </ThemedTabsContent>

            <ThemedTabsContent value="search" className="space-y-6 mt-6">
              <div className="glass-card border border-primary/20 p-6 rounded-xl space-y-4">
                <div>
                  <Label className="mb-2">Search Query</Label>
                  <Input
                    placeholder="Enter keywords or phrases to search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-2">Search In</Label>
                  <Select value={searchIn} onValueChange={(v: any) => setSearchIn(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web (Google, Bing)</SelectItem>
                      <SelectItem value="sites">Specific Sites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {searchIn === "sites" && (
                  <div>
                    <Label className="mb-2">Target Sites</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="e.g., reddit.com"
                        value={customSite}
                        onChange={(e) => setCustomSite(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && customSite.trim()) {
                            setSelectedSites((prev) => [...prev, customSite.trim()])
                            setCustomSite("")
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (customSite.trim()) {
                            setSelectedSites((prev) => [...prev, customSite.trim()])
                            setCustomSite("")
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSites.map((site, idx) => (
                        <Badge key={idx} variant="secondary" className="cursor-pointer">
                          {site}
                          <button
                            onClick={() => setSelectedSites((prev) => prev.filter((_, i) => i !== idx))}
                            className="ml-2"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button className="w-full" onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {renderResultsSection()}
              {renderSavedResultsTable()}
            </ThemedTabsContent>

            <ThemedTabsContent value="map" className="space-y-6 mt-6">
              <div className="glass-card border border-primary/20 p-6 rounded-xl space-y-4">
                <div>
                  <Label className="mb-2">Website URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">https://</span>
                    <Input
                      placeholder="example.com"
                      value={mapUrl}
                      onChange={(e) => setMapUrl(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handleMapUrls} disabled={isMapping}>
                  {isMapping ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mapping URLs...
                    </>
                  ) : (
                    <>
                      <Map className="h-4 w-4 mr-2" />
                      Map All URLs
                    </>
                  )}
                </Button>
              </div>

              {renderResultsSection()}

              {mappedUrls.length > 0 && (
                <ThemedCard className="glass-card border-primary/20">
                  <div className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4">
                    <div className="flex items-center gap-3">
                      <Link2 className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Discovered URLs</h3>
                      <span className="text-sm text-muted-foreground">({mappedUrls.length} found)</span>
                    </div>
                  </div>
                  <ThemedCardContent spacing="lg">
                    <div className="space-y-2">
                      {mappedUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-background/50 border border-primary/10 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate">{url}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUrl(url)
                              setActiveTab("scrape")
                            }}
                          >
                            Scrape
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ThemedCardContent>
                </ThemedCard>
              )}

              {renderSavedResultsTable()}
            </ThemedTabsContent>

            <ThemedTabsContent value="crawl" className="space-y-6 mt-6">
              <div className="glass-card border border-primary/20 p-6 rounded-xl space-y-4">
                <div>
                  <Label className="mb-2">Website URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">https://</span>
                    <Input
                      placeholder="example.com"
                      value={crawlUrl}
                      onChange={(e) => setCrawlUrl(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2">Crawl Depth</Label>
                  <Select value={crawlDepth.toString()} onValueChange={(v) => setCrawlDepth(Number.parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Level (Current page + direct links)</SelectItem>
                      <SelectItem value="2">2 Levels (Recommended)</SelectItem>
                      <SelectItem value="3">3 Levels</SelectItem>
                      <SelectItem value="4">4 Levels (May take longer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleCrawl} disabled={isCrawling}>
                  {isCrawling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Crawling Site...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Start Crawling
                    </>
                  )}
                </Button>
              </div>

              {renderResultsSection()}
              {renderSavedResultsTable()}
            </ThemedTabsContent>
          </ThemedTabs>
        </ThemedCardContent>
      </ThemedCard>

      <TemplateEditorModal
        isOpen={showTemplateEditor}
        onClose={handleTemplateEditorClose}
        templateId={editingTemplateId}
        onSave={handleTemplateEditorClose}
      />

      <SaveAsTemplateDialog
        isOpen={showSaveAsTemplate}
        onClose={handleSaveAsTemplateClose}
        scrapeData={scrapeResult} // Can now be null
        onSave={handleSaveAsTemplateClose}
      />

      <TemplateManagementPanel
        isOpen={showTemplatePanel}
        onClose={() => setShowTemplatePanel(false)}
        templates={templates}
        onSelectTemplate={(id) => {
          setSelectedTemplateId(id)
          setShowTemplatePanel(false)
        }}
        onRefreshTemplates={loadTemplates}
        selectedTemplateId={selectedTemplateId}
      />
    </div>
  )
}
