// yt-dlp API Types based on Postman collection

// Health check response
export interface HealthResponse {
  status: 'ok' | 'error';
  message: string;
  timestamp: string;
}

// Format request/response
export interface FormatRequest {
  url: string;
}

export interface VideoFormat {
  itag: string;
  ext: string;
  height: number;
  width: number;
  fps: number;
  vcodec: string;
  acodec: string;
  tbrKbps: number;
  filesizeBytes: number;
  filesizeApprox: number;
  progressive: boolean;
  note: string;
  direct: boolean;
  url: string;
}

export interface AudioFormat {
  itag: string;
  ext: string;
  abrKbps: number;
  filesizeBytes: number;
  filesizeApprox: number;
  url: string;
}

export interface FormatsResponse {
  videoId: string;
  title: string;
  durationSec: number;
  thumbnailUrl: string;
  audios: AudioFormat[];
  videos: VideoFormat[];
}

// Job management
export interface JobSubmitRequest {
  url: string;
  format: string;
}

export interface JobInfo {
  id: string;
  url: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  created_at: string;
  updated_at: string;
  error_message?: string;
  file_path?: string;
  file_size?: number;
  duration?: number;
  title?: string;
  thumbnail?: string;
}

export interface JobListResponse {
  jobs: JobInfo[];
  total: number;
  page: number;
  limit: number;
}

export interface JobDetailResponse extends JobInfo {}

// Download response
export interface DownloadResponse {
  file_url: string;
  filename: string;
  content_type: string;
  file_size: number;
}

// Error response
export interface YtDlpError {
  error: string;
  message: string;
  code: string;
  details?: any;
}
