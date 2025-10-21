import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "../api/client";
import { API_ENDPOINTS } from "../api/config";
import {
  DownloadResponse,
  FormatsResponse,
  HealthResponse,
  JobDetailResponse,
  JobInfo,
  JobSubmitRequest,
  YtDlpError,
} from "../types/ytdlp";

// Health check hook
export function useHealthCheck() {
  return useQuery<HealthResponse, YtDlpError>({
    queryKey: ["ytdlp", "health"],
    queryFn: async () => {
      const response = await apiClient.get<HealthResponse>(API_ENDPOINTS.health);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

// Get available formats for a URL
export function useFormats(url: string, enabled: boolean = true) {
  return useQuery<FormatsResponse, YtDlpError>({
    queryKey: ["ytdlp", "formats", url],
    queryFn: async () => {
      const response = await apiClient.post<FormatsResponse>(API_ENDPOINTS.formats, { url });
      return response.data;
    },
    enabled: enabled && !!url,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Submit download job
export function useSubmitJob() {
  const queryClient = useQueryClient();

  return useMutation<JobInfo, YtDlpError, JobSubmitRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.post<JobInfo>(API_ENDPOINTS.jobs.submit, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate jobs list when new job is submitted
      queryClient.invalidateQueries({ queryKey: ["ytdlp", "jobs"] });
    },
  });
}

// Get jobs list
export function useJobsList(page: number = 0, pageSize: number = 10) {
  return useQuery<JobInfo[], YtDlpError>({
    queryKey: ["ytdlp", "jobs", "list", page, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<JobInfo[]>(`${API_ENDPOINTS.jobs.list}?page=${page}&pageSize=${pageSize}`);
      return response.data;
    },
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 5 * 1000, // Refetch every 5 seconds for real-time updates
  });
}

// Get job detail
export function useJobDetail(jobId: string, enabled: boolean = true) {
  return useQuery<JobDetailResponse, ApiError>({
    queryKey: ["ytdlp", "jobs", "detail", jobId],
    queryFn: async () => {
      const response = await apiClient.get<JobDetailResponse>(API_ENDPOINTS.jobs.detail(jobId));
      return response.data;
    },
    enabled: enabled && !!jobId,
    staleTime: 5 * 1000, // 5 seconds
    refetchInterval: (data) => {
      // Stop refetching if job is completed or failed
      if (data?.state?.data?.status === "COMPLETED" || data?.state?.data?.status === "FAILED") {
        return false;
      }
      return 3 * 1000; // Refetch every 3 seconds for active jobs
    },
  });
}

// Download file
export function useDownloadFile(jobId: string, enabled: boolean = true) {
  return useQuery<DownloadResponse, ApiError>({
    queryKey: ["ytdlp", "jobs", "download", jobId],
    queryFn: async () => {
      const response = await apiClient.get<DownloadResponse>(API_ENDPOINTS.jobs.download(jobId));
      return response.data;
    },
    enabled: enabled && !!jobId,
    staleTime: 0, // Always fetch fresh data for downloads
  });
}

// Combined hook for complete download flow
export function useDownloadFlow() {
  const submitJob = useSubmitJob();

  const startDownload = async (url: string, format: string) => {
    try {
      const job = await submitJob.mutateAsync({ url, format });
      return job;
    } catch (error) {
      throw error;
    }
  };

  const getJobStatus = useJobDetail;

  const downloadFile = useDownloadFile;

  return {
    startDownload,
    getJobStatus,
    downloadFile,
    isSubmitting: submitJob.isPending,
    submitError: submitJob.error,
  };
}

// Utility hooks for common operations
export function useActiveJobs() {
  const { data: jobsList } = useJobsList();

  return jobsList?.filter((job) => job.status === "RUNNING") || [];
}

export function useCompletedJobs() {
  const { data: jobsList } = useJobsList();

  return jobsList?.filter((job) => job.status === "COMPLETED") || [];
}

export function useFailedJobs() {
  const { data: jobsList } = useJobsList();

  return jobsList?.filter((job) => job.status === "FAILED") || [];
}
