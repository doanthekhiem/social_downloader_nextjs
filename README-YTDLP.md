# YT-DLP API Integration

## Tổng quan

Đã setup hoàn chỉnh API integration cho yt-dlp backend dựa trên Postman collection.

## Cấu trúc API

### Endpoints
- `GET /api/v1/health` - Health check
- `POST /api/v1/formats` - Lấy danh sách formats có sẵn
- `POST /api/v1/jobs` - Submit download job
- `GET /api/v1/jobs` - Lấy danh sách jobs
- `GET /api/v1/jobs/{id}` - Chi tiết job
- `GET /api/v1/jobs/{id}/download` - Download file

## Cách sử dụng

### 1. Basic Usage

```tsx
import { useYtDlp } from '@/lib/hooks/useYtDlp';

function MyComponent() {
  // Health check
  const { data: health } = useYtDlp.useHealthCheck();
  
  // Get formats
  const { data: formats } = useYtDlp.useFormats('https://youtube.com/watch?v=...');
  
  // Submit job
  const submitJob = useYtDlp.useSubmitJob();
  
  const handleDownload = async () => {
    const job = await submitJob.mutateAsync({
      url: 'https://youtube.com/watch?v=...',
      format: '137'
    });
  };
}
```

### 2. Complete Download Flow

```tsx
import { useDownloadFlow } from '@/lib/hooks/useYtDlp';

function DownloadComponent() {
  const downloadFlow = useDownloadFlow();
  
  const handleStartDownload = async (url: string, format: string) => {
    try {
      const job = await downloadFlow.startDownload(url, format);
      console.log('Job started:', job.id);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
}
```

### 3. Job Monitoring

```tsx
import { useJobDetail } from '@/lib/hooks/useYtDlp';

function JobMonitor({ jobId }: { jobId: string }) {
  const { data: job, isLoading } = useJobDetail(jobId);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h3>{job?.title}</h3>
      <p>Status: {job?.status}</p>
      <p>Progress: {job?.progress}%</p>
    </div>
  );
}
```

## Utility Functions

### Format Helpers
```tsx
import { 
  formatFileSize, 
  formatDuration, 
  getJobStatusText,
  getPlatformFromUrl 
} from '@/lib/utils/ytdlpHelpers';

// Format file size
const size = formatFileSize(1024000); // "1000 KB"

// Format duration
const duration = formatDuration(3661); // "1:01:01"

// Get status text
const status = getJobStatusText('processing'); // "Đang xử lý"

// Get platform from URL
const platform = getPlatformFromUrl('https://youtube.com/watch?v=...'); // "YouTube"
```

## Types

### JobInfo
```tsx
interface JobInfo {
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
```

### FormatInfo
```tsx
interface FormatInfo {
  format_id: string;
  ext: string;
  resolution: string;
  fps: number;
  vcodec: string;
  acodec: string;
  filesize: number;
  quality: number;
}
```

## Environment Variables

Cập nhật `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Example Component

Xem `components/YtDlpExample.tsx` để có ví dụ hoàn chỉnh về cách sử dụng tất cả các hooks và utilities.

## Features

- ✅ Health check
- ✅ Format detection
- ✅ Job submission
- ✅ Real-time job monitoring
- ✅ File download
- ✅ Error handling
- ✅ TypeScript support
- ✅ Utility functions
- ✅ Example component
