/**
 * E-Punisher Backend API Client
 * 
 * Backend API ile iletişim için client sınıfı
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export interface PostTaskRequest {
  account_id: number;
  text: string;
  media_urls?: string[];
}

export interface PostTaskResponse {
  job_id: string;
  message: string;
}

export interface JobStatus {
  job_id: string;
  status: "queued" | "started" | "finished" | "failed" | "canceled";
  progress: number;
  error: string | null;
  result?: any;
  created_at?: string;
  started_at?: string;
  ended_at?: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  redis_connected: boolean;
  database_connected: boolean;
}

export interface QueueInfo {
  name: string;
  count: number;
  started_jobs: number;
  finished_jobs: number;
  failed_jobs: number;
  deferred_jobs: number;
}

// Playground interfaces
export interface PlaygroundStartRequest {
  account_id: number;
  platform: string;
  headless?: boolean;
}

export interface PlaygroundStartResponse {
  session_id: string;
  status: string;
  message: string;
  browser_url?: string;
}

export interface PlaygroundActionRequest {
  action_type: string;
  description?: string;
  metadata?: any;
}

export interface PlaygroundStatusResponse {
  session_id: string;
  status: string;
  platform: string;
  account_id: number;
  captured_endpoints_count: number;
  actions_performed: any[];
  logs: any[];
  started_at: string;
  ended_at?: string;
}

export interface CapturedEndpoint {
  id: number;
  platform: string;
  action_type: string;
  method: string;
  url: string;
  headers?: any;
  payload_template?: any;
  description?: string;
  is_active: boolean;
  success_rate: number;
  captured_at: string;
}

export interface CapturedEndpointsResponse {
  endpoints: CapturedEndpoint[];
  total: number;
}

export interface PlaygroundSaveResponse {
  message: string;
  saved_count: number;
  statistics?: {
    total_captured: number;
    saved: number;
    duplicates_filtered: number;
    static_assets_filtered: number;
  };
}

// Scraper interfaces
export interface ScrapeRequest {
  url: string;
  format: "markdown" | "json" | "html" | "text" | "csv";
  options?: Record<string, any>;
}

export interface ScrapeResponse {
  url: string;
  format: string;
  content: string;
  metadata: {
    title: string;
    links_count: number;
    headings_count: number;
    images_count: number;
    content_length: number;
  };
  scraped_at: string;
  session_id?: number;
}

export interface ScrapingSession {
  id: number;
  url: string;
  title?: string;
  format: string;
  content?: string;
  metadata?: Record<string, any>;
  template_id?: number;
  template_name?: string;
  status: string;
  error_message?: string;
  scraped_at: string;
  applied_filters?: Record<string, any>;
}

export interface ScrapingSessionListResponse {
  sessions: ScrapingSession[];
  total: number;
}

export interface ScrapingTemplate {
  id: number;
  name: string;
  description?: string;
  target_domain?: string;
  format: string;
  css_selectors?: Record<string, any>;
  keyword_filters?: Record<string, any>;
  element_filters?: Record<string, any>;
  extract_rules?: Record<string, any>;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface ScrapingTemplateListResponse {
  templates: ScrapingTemplate[];
  total: number;
}

export interface ScrapingTemplateCreate {
  name: string;
  description?: string;
  target_domain?: string;
  format: string;
  css_selectors?: Record<string, any>;
  keyword_filters?: Record<string, any>;
  element_filters?: Record<string, any>;
  extract_rules?: Record<string, any>;
}

export interface Account {
  id: number;
  platform: string;
  username: string;
  display_name?: string;
  email?: string;
  password?: string;
  is_active: boolean;
  is_verified: boolean;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountCreate {
  platform: string;
  username: string;
  display_name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
}

export interface AccountUpdate {
  display_name?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

export interface AccountListResponse {
  accounts: Account[];
  total: number;
}

export interface AccountBulkImportResponse {
  created: number;
  skipped: number;
  errors: number;
  created_accounts: Array<{ username: string; platform: string }>;
  skipped_accounts: Array<{ username: string; platform: string; reason: string }>;
  error_details?: Array<{ index: number; username: string; error: string }>;
  message: string;
}

export interface AccountStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  by_platform: Record<string, number>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Genel fetch wrapper
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Sağlık kontrolü
   */
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  /**
   * Yeni post işi oluştur
   */
  async createPostTask(data: PostTaskRequest): Promise<PostTaskResponse> {
    return this.request<PostTaskResponse>("/tasks/post", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * İş durumunu sorgula
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.request<JobStatus>(`/status/${jobId}`);
  }

  /**
   * İş loglarını getir
   */
  async getJobLogs(jobId: string): Promise<any> {
    return this.request<any>(`/status/${jobId}/logs`);
  }

  /**
   * İşi iptal et
   */
  async cancelTask(jobId: string): Promise<{ message: string; job_id: string }> {
    return this.request(`/tasks/cancel/${jobId}`, {
      method: "POST",
    });
  }

  /**
   * Kuyruk bilgisini getir
   */
  async getQueueInfo(): Promise<QueueInfo> {
    return this.request<QueueInfo>("/tasks/queue/info");
  }

  /**
   * İş durumunu polling ile takip et
   * 
   * @param jobId - İşin ID'si
   * @param onProgress - İlerleme callback'i
   * @param interval - Polling aralığı (ms)
   * @returns Final job status
   */
  async pollJobStatus(
    jobId: string,
    onProgress?: (status: JobStatus) => void,
    interval: number = 2000
  ): Promise<JobStatus> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getJobStatus(jobId);
          
          // Callback çağır
          if (onProgress) {
            onProgress(status);
          }

          // Terminal durumlar
          if (["finished", "failed", "canceled"].includes(status.status)) {
            clearInterval(intervalId);
            resolve(status);
          }
        } catch (error) {
          clearInterval(intervalId);
          reject(error);
        }
      };

      // İlk kontrolü hemen yap
      poll();

      // Sonra düzenli aralıklarla kontrol et
      const intervalId = setInterval(poll, interval);
    });
  }

  // ===== Account Metodları =====

  /**
   * Tüm hesapları getir
   */
  async getAccounts(platform?: string, isActive?: boolean): Promise<AccountListResponse> {
    const params = new URLSearchParams();
    if (platform) params.append("platform", platform);
    if (isActive !== undefined) params.append("is_active", String(isActive));
    
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<AccountListResponse>(`/accounts${query}`);
  }

  /**
   * Belirli bir hesabı getir
   */
  async getAccount(accountId: number): Promise<Account> {
    return this.request<Account>(`/accounts/${accountId}`);
  }

  /**
   * Yeni hesap oluştur
   */
  async createAccount(data: AccountCreate): Promise<Account> {
    return this.request<Account>("/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Toplu hesap oluştur (import)
   */
  async createAccountsBulk(accounts: AccountCreate[]): Promise<AccountBulkImportResponse> {
    return this.request<AccountBulkImportResponse>("/accounts/bulk", {
      method: "POST",
      body: JSON.stringify(accounts),
    });
  }

  /**
   * Hesap bilgilerini güncelle
   */
  async updateAccount(accountId: number, data: AccountUpdate): Promise<Account> {
    return this.request<Account>(`/accounts/${accountId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Hesap durumunu aktif/pasif çevir
   */
  async toggleAccountStatus(accountId: number): Promise<Account> {
    return this.request<Account>(`/accounts/${accountId}/toggle`, {
      method: "POST",
    });
  }

  /**
   * Hesabı sil
   */
  async deleteAccount(accountId: number): Promise<void> {
    await this.request(`/accounts/${accountId}`, {
      method: "DELETE",
    });
  }

  /**
   * Hesap istatistiklerini getir
   */
  async getAccountStats(): Promise<AccountStats> {
    return this.request<AccountStats>("/accounts/stats/summary");
  }

  // ===== Playground Metodları =====

  /**
   * Playground session başlat
   */
  async startPlaygroundSession(data: PlaygroundStartRequest): Promise<PlaygroundStartResponse> {
    return this.request<PlaygroundStartResponse>("/playground/start", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Playground session durumunu getir
   */
  async getPlaygroundStatus(sessionId: string): Promise<PlaygroundStatusResponse> {
    return this.request<PlaygroundStatusResponse>(`/playground/${sessionId}`);
  }

  /**
   * Manuel action kaydet
   */
  async recordPlaygroundAction(sessionId: string, action: PlaygroundActionRequest): Promise<any> {
    return this.request<any>(`/playground/${sessionId}/action`, {
      method: "POST",
      body: JSON.stringify(action),
    });
  }

  /**
   * Endpoint'leri kaydet (otomatik parse)
   */
  async savePlaygroundEndpoints(sessionId: string): Promise<PlaygroundSaveResponse> {
    return this.request<PlaygroundSaveResponse>(`/playground/${sessionId}/save`, {
      method: "POST",
    });
  }

  /**
   * Session'ı durdur
   */
  async stopPlaygroundSession(sessionId: string): Promise<any> {
    return this.request<any>(`/playground/${sessionId}/stop`, {
      method: "POST",
    });
  }

  /**
   * Kaydedilmiş endpoint'leri listele
   */
  async getCapturedEndpoints(
    platform?: string,
    actionType?: string
  ): Promise<CapturedEndpointsResponse> {
    const params = new URLSearchParams();
    if (platform) params.append("platform", platform);
    if (actionType) params.append("action_type", actionType);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<CapturedEndpointsResponse>(`/playground/endpoints${query}`);
  }

  /**
   * Endpoint sil
   */
  async deleteCapturedEndpoint(endpointId: number): Promise<any> {
    return this.request<any>(`/playground/endpoints/${endpointId}`, {
      method: "DELETE",
    });
  }

  // ===== Scraper Metodları =====

  /**
   * Web sitesini scrape et
   */
  async scrapeWebsite(request: ScrapeRequest): Promise<ScrapeResponse> {
    return this.request<ScrapeResponse>("/scraper/scrape", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Scraping sessions listele
   */
  async getScrapingSessions(skip: number = 0, limit: number = 50): Promise<ScrapingSessionListResponse> {
    return this.request<ScrapingSessionListResponse>(`/scraper/sessions?skip=${skip}&limit=${limit}`);
  }

  /**
   * Specific scraping session getir
   */
  async getScrapingSession(sessionId: number): Promise<ScrapingSession> {
    return this.request<ScrapingSession>(`/scraper/sessions/${sessionId}`);
  }

  /**
   * Scraping session sil
   */
  async deleteScrapingSession(sessionId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/scraper/sessions/${sessionId}`, {
      method: "DELETE",
    });
  }

  /**
   * Scraping templates listele
   */
  async getScrapingTemplates(skip: number = 0, limit: number = 50): Promise<ScrapingTemplateListResponse> {
    return this.request<ScrapingTemplateListResponse>(`/scraper/templates?skip=${skip}&limit=${limit}`);
  }

  /**
   * Scraping template oluştur
   */
  async createScrapingTemplate(template: ScrapingTemplateCreate): Promise<ScrapingTemplate> {
    return this.request<ScrapingTemplate>("/scraper/templates", {
      method: "POST",
      body: JSON.stringify(template),
    });
  }

  /**
   * Scraping template getir
   */
  async getScrapingTemplate(templateId: number): Promise<ScrapingTemplate> {
    return this.request<ScrapingTemplate>(`/scraper/templates/${templateId}`);
  }

  /**
   * Scraping template güncelle
   */
  async updateScrapingTemplate(
    templateId: number,
    updates: Partial<ScrapingTemplateCreate>
  ): Promise<ScrapingTemplate> {
    return this.request<ScrapingTemplate>(`/scraper/templates/${templateId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Scraping template sil
   */
  async deleteScrapingTemplate(templateId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/scraper/templates/${templateId}`, {
      method: "DELETE",
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Default export
export default apiClient;
