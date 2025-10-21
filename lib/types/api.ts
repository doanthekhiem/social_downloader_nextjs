// Download request types
export interface DownloadRequest {
  url: string;
  quality?: 'low' | 'medium' | 'high' | 'best';
  format?: 'mp4' | 'mp3' | 'webm';
}

// Download response types
export interface DownloadResponse {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  size: number;
  quality: string;
  format: string;
  downloadUrl: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitter';
  createdAt: string;
}

// Platform-specific types
export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  uploadDate: string;
  channel: {
    name: string;
    id: string;
    avatar: string;
  };
}

export interface TiktokVideo {
  id: string;
  description: string;
  thumbnail: string;
  duration: number;
  playCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  createdAt: string;
  author: {
    username: string;
    nickname: string;
    avatar: string;
  };
}

export interface InstagramPost {
  id: string;
  caption: string;
  mediaType: 'image' | 'video' | 'carousel';
  thumbnail: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  author: {
    username: string;
    fullName: string;
    avatar: string;
  };
}

// Error types
export interface ApiErrorResponse {
  message: string;
  code: string;
  details?: any;
}

// Query key types for better type safety
export type QueryKeys = {
  downloads: ['downloads'];
  download: (id: string) => ['download', string];
  health: ['health'];
  platform: (platform: string) => ['platform', string];
};
