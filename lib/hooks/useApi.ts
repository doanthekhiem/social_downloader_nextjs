import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiResponse, ApiError } from '../api/client';
import { API_ENDPOINTS } from '../api/config';
import { useDownloadFile } from './useYtDlp';

// Generic query hook
export function useApiQuery<T>(
  queryKey: string[],
  endpoint: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
  }
) {
  return useQuery<ApiResponse<T>, ApiError>({
    queryKey,
    queryFn: () => apiClient.get<T>(endpoint),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime,
    gcTime: options?.gcTime,
  });
}

// Generic mutation hook
export function useApiMutation<TData, TVariables = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: {
    onSuccess?: (data: ApiResponse<TData>) => void;
    onError?: (error: ApiError) => void;
    invalidateQueries?: string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, ApiError, TVariables>({
    mutationFn: (variables) => {
      switch (method) {
        case 'POST':
          return apiClient.post<TData>(endpoint, variables);
        case 'PUT':
          return apiClient.put<TData>(endpoint, variables);
        case 'DELETE':
          return apiClient.delete<TData>(endpoint);
        default:
          return apiClient.post<TData>(endpoint, variables);
      }
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      // Invalidate related queries
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
    },
    onError: options?.onError,
  });
}

// Specific hooks for social media download
export function useDownloadYoutube(jobId: string) {
  return useDownloadFile(jobId, true);
}

// Note: These hooks are placeholders for future implementation
// Currently only YouTube download is supported through the job system
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDownloadTiktok(_url: string) {
  throw new Error('TikTok download not implemented yet');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDownloadInstagram(_url: string) {
  throw new Error('Instagram download not implemented yet');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDownloadFacebook(_url: string) {
  throw new Error('Facebook download not implemented yet');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDownloadTwitter(_url: string) {
  throw new Error('Twitter download not implemented yet');
}

// Health check hook
export function useHealthCheck() {
  return useApiQuery(['health'], API_ENDPOINTS.health, {
    staleTime: 30 * 1000, // 30 seconds
  });
}
