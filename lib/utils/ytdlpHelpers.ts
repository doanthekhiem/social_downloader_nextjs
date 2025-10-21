import { JobInfo, FormatInfo } from '../types/ytdlp';

// Utility functions for yt-dlp operations

// Format job status for display
export function getJobStatusText(status: JobInfo['status']): string {
  switch (status) {
    case 'pending':
      return 'Đang chờ';
    case 'processing':
      return 'Đang xử lý';
    case 'completed':
      return 'Hoàn thành';
    case 'failed':
      return 'Thất bại';
    default:
      return 'Không xác định';
  }
}

// Get status color for UI
export function getJobStatusColor(status: JobInfo['status']): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600';
    case 'processing':
      return 'text-blue-600';
    case 'completed':
      return 'text-green-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format duration
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Get best quality format
export function getBestQualityFormat(formats: FormatInfo[]): FormatInfo | null {
  if (!formats || formats.length === 0) return null;
  
  // Sort by quality (higher is better) and file size (larger is usually better quality)
  return formats.sort((a, b) => {
    if (a.quality !== b.quality) {
      return b.quality - a.quality;
    }
    return b.filesize - a.filesize;
  })[0];
}

// Get audio-only formats
export function getAudioFormats(formats: FormatInfo[]): FormatInfo[] {
  return formats.filter(format => 
    format.acodec !== 'none' && format.vcodec === 'none'
  );
}

// Get video formats
export function getVideoFormats(formats: FormatInfo[]): FormatInfo[] {
  return formats.filter(format => 
    format.vcodec !== 'none'
  );
}

// Check if job is active (pending or processing)
export function isJobActive(job: JobInfo): boolean {
  return job.status === 'pending' || job.status === 'processing';
}

// Check if job is finished (completed or failed)
export function isJobFinished(job: JobInfo): boolean {
  return job.status === 'completed' || job.status === 'failed';
}

// Get progress percentage
export function getJobProgress(job: JobInfo): number {
  if (job.status === 'completed') return 100;
  if (job.status === 'failed') return 0;
  return job.progress || 0;
}

// Generate download filename
export function generateFilename(job: JobInfo): string {
  if (!job.title) return `download_${job.id}`;
  
  // Clean title for filename
  const cleanTitle = job.title
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 50); // Limit length
  
  return `${cleanTitle}_${job.id}`;
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Extract platform from URL
export function getPlatformFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'YouTube';
    }
    if (hostname.includes('tiktok.com')) {
      return 'TikTok';
    }
    if (hostname.includes('instagram.com')) {
      return 'Instagram';
    }
    if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
      return 'Facebook';
    }
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return 'Twitter';
    }
    
    return 'Unknown';
  } catch {
    return 'Invalid URL';
  }
}
