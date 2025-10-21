// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints based on yt-dlp Postman collection
export const API_ENDPOINTS = {
  // Health check
  health: '/v1/health',
  
  // Get available formats for a URL
  formats: '/v1/formats',
  
  // Job management
  jobs: {
    submit: '/v1/jobs',
    list: '/v1/jobs',
    detail: (jobId: string) => `/v1/jobs/${jobId}`,
    download: (jobId: string) => `/v1/jobs/${jobId}/download`,
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;
