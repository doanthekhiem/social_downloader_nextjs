import { JobInfo, VideoFormat, AudioFormat } from '../types/ytdlp';

// Utility functions for yt-dlp operations

// Format job status for display
export function getJobStatusText(status: JobInfo['status']): string {
  switch (status) {
    case 'RUNNING':
      return 'Processing';
    case 'COMPLETED':
      return 'Download';
    case 'FAILED':
      return 'Failed';
    case 'EXPIRED':
      return 'Expired';
    default:
      return 'Unknown';
  }
}

// Get status color for UI
export function getJobStatusColor(status: JobInfo['status']): string {
  switch (status) {
    case 'RUNNING':
      return 'text-blue-600';
    case 'COMPLETED':
      return 'text-green-600';
    case 'FAILED':
      return 'text-red-600';
    case 'EXPIRED':
      return 'text-orange-600';
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

// Get best quality video format
export function getBestQualityVideoFormat(formats: VideoFormat[]): VideoFormat | null {
  if (!formats || formats.length === 0) return null;
  
  // Sort by height (higher is better) and file size (larger is usually better quality)
  return formats.sort((a, b) => {
    if (a.height !== b.height) {
      return b.height - a.height;
    }
    return b.filesizeBytes - a.filesizeBytes;
  })[0];
}

// Get audio-only formats
export function getAudioFormats(formats: AudioFormat[]): AudioFormat[] {
  return formats; // AudioFormat array already contains only audio formats
}

// Get video formats
export function getVideoFormats(formats: VideoFormat[]): VideoFormat[] {
  return formats; // VideoFormat array already contains only video formats
}

// Check if job is active (running)
export function isJobActive(job: JobInfo): boolean {
  return job.status === 'RUNNING';
}

// Check if job is finished (completed, failed, or expired)
export function isJobFinished(job: JobInfo): boolean {
  return job.status === 'COMPLETED' || job.status === 'FAILED' || job.status === 'EXPIRED';
}

// Get progress percentage
export function getJobProgress(job: JobInfo): number {
  if (job.status === 'COMPLETED') return 100;
  if (job.status === 'FAILED' || job.status === 'EXPIRED') return 0;
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
