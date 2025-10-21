import { ApiError } from '../api/client';

// Error handling utilities
export class ErrorHandler {
  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return (error as ApiError).message;
    }
    
    return 'Đã xảy ra lỗi không xác định';
  }

  static getErrorCode(error: unknown): string | undefined {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      return (error as ApiError).code;
    }
    return undefined;
  }

  static isNetworkError(error: unknown): boolean {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const status = (error as ApiError).status;
      return status >= 500 || status === 0;
    }
    return false;
  }

  static isClientError(error: unknown): boolean {
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const status = (error as ApiError).status;
      return status >= 400 && status < 500;
    }
    return false;
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attempt), 16000);
  }

  static shouldRetry(error: unknown, attempt: number): boolean {
    if (attempt >= 3) return false;
    
    if (this.isNetworkError(error)) return true;
    if (this.isClientError(error)) {
      const status = (error as ApiError).status;
      // Retry on 408 (timeout), 429 (rate limit), 502, 503, 504
      return [408, 429, 502, 503, 504].includes(status);
    }
    
    return false;
  }
}

// Toast notification helper (you can integrate with your preferred toast library)
export const showErrorToast = (message: string) => {
  // This is a placeholder - integrate with your toast library
  console.error('Error:', message);
  // Example with react-hot-toast:
  // toast.error(message);
};

export const showSuccessToast = (message: string) => {
  // This is a placeholder - integrate with your toast library
  console.log('Success:', message);
  // Example with react-hot-toast:
  // toast.success(message);
};
