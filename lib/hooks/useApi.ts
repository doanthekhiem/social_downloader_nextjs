import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiResponse, ApiError } from '../api/client';
import { API_ENDPOINTS } from '../api/config';

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
export function useDownloadYoutube(url: string) {
  return useApiMutation(
    API_ENDPOINTS.download.youtube,
    'POST',
    {
      invalidateQueries: [['downloads']],
    }
  );
}

export function useDownloadTiktok(url: string) {
  return useApiMutation(
    API_ENDPOINTS.download.tiktok,
    'POST',
    {
      invalidateQueries: [['downloads']],
    }
  );
}

export function useDownloadInstagram(url: string) {
  return useApiMutation(
    API_ENDPOINTS.download.instagram,
    'POST',
    {
      invalidateQueries: [['downloads']],
    }
  );
}

export function useDownloadFacebook(url: string) {
  return useApiMutation(
    API_ENDPOINTS.download.facebook,
    'POST',
    {
      invalidateQueries: [['downloads']],
    }
  );
}

export function useDownloadTwitter(url: string) {
  return useApiMutation(
    API_ENDPOINTS.download.twitter,
    'POST',
    {
      invalidateQueries: [['downloads']],
    }
  );
}

// Health check hook
export function useHealthCheck() {
  return useApiQuery(['health'], API_ENDPOINTS.health, {
    staleTime: 30 * 1000, // 30 seconds
  });
}
