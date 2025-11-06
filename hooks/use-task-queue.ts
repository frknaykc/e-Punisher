/**
 * Task Queue Hook
 * 
 * Backend task queue ile çalışmak için React hook
 */

import { useState, useCallback } from "react";
import { apiClient, PostTaskRequest, JobStatus } from "@/lib/api-client";
import { toast } from "sonner";

export function useTaskQueue() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);

  /**
   * Yeni post işi oluştur ve otomatik polling başlat
   */
  const createPostTask = useCallback(
    async (request: PostTaskRequest) => {
      setIsSubmitting(true);
      setJobId(null);
      setJobStatus(null);

      try {
        // İşi kuyruğa ekle
        const response = await apiClient.createPostTask(request);
        setJobId(response.job_id);

        toast.success("İş kuyruğa eklendi", {
          description: `Job ID: ${response.job_id}`,
        });

        // Polling başlat
        const finalStatus = await apiClient.pollJobStatus(
          response.job_id,
          (status) => {
            setJobStatus(status);

            // İlerleme bildirimleri
            if (status.status === "started" && status.progress === 0) {
              toast.info("İş başlatıldı");
            } else if (status.progress === 50) {
              toast.info("İş devam ediyor...", {
                description: `%${status.progress} tamamlandı`,
              });
            }
          },
          2000
        );

        // Final durum
        if (finalStatus.status === "finished") {
          toast.success("İş başarıyla tamamlandı!", {
            description: "Paylaşım yapıldı",
          });
        } else if (finalStatus.status === "failed") {
          toast.error("İş başarısız oldu", {
            description: finalStatus.error || "Bilinmeyen hata",
          });
        }

        setJobStatus(finalStatus);
        return finalStatus;
      } catch (error: any) {
        toast.error("İş oluşturulamadı", {
          description: error.message,
        });
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  /**
   * İşi iptal et
   */
  const cancelTask = useCallback(async (jobId: string) => {
    try {
      await apiClient.cancelTask(jobId);
      toast.success("İş iptal edildi");
      
      // Durumu güncelle
      const status = await apiClient.getJobStatus(jobId);
      setJobStatus(status);
    } catch (error: any) {
      toast.error("İş iptal edilemedi", {
        description: error.message,
      });
    }
  }, []);

  /**
   * Durumu manuel yenile
   */
  const refreshStatus = useCallback(async (jobId: string) => {
    try {
      const status = await apiClient.getJobStatus(jobId);
      setJobStatus(status);
      return status;
    } catch (error: any) {
      toast.error("Durum alınamadı", {
        description: error.message,
      });
      throw error;
    }
  }, []);

  /**
   * Durumu sıfırla
   */
  const reset = useCallback(() => {
    setJobId(null);
    setJobStatus(null);
    setIsSubmitting(false);
  }, []);

  return {
    // State
    isSubmitting,
    jobId,
    jobStatus,
    
    // Actions
    createPostTask,
    cancelTask,
    refreshStatus,
    reset,
  };
}
