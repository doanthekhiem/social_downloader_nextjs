# API Configuration Guide

## Environment Variables

Tạo file `.env.local` trong thư mục gốc với nội dung:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Development settings
NODE_ENV=development
```

## Cách sử dụng React Query

### 1. Sử dụng hooks có sẵn

```tsx
import { useDownloadYoutube, useHealthCheck } from '@/lib/hooks/useApi';

function MyComponent() {
  const downloadMutation = useDownloadYoutube();
  const { data: healthData, isLoading } = useHealthCheck();

  const handleDownload = async (url: string) => {
    try {
      const result = await downloadMutation.mutateAsync({ url });
      console.log('Download successful:', result.data);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Checking API health...</p>}
      <button onClick={() => handleDownload('https://youtube.com/watch?v=...')}>
        Download Video
      </button>
    </div>
  );
}
```

### 2. Tạo custom hooks

```tsx
import { useApiQuery, useApiMutation } from '@/lib/hooks/useApi';
import { API_ENDPOINTS } from '@/lib/api/config';

function useCustomData() {
  return useApiQuery(['custom-data'], '/custom-endpoint');
}

function useCustomMutation() {
  return useApiMutation('/custom-endpoint', 'POST', {
    onSuccess: (data) => {
      console.log('Success:', data);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });
}
```

### 3. Error Handling

```tsx
import { ErrorHandler, showErrorToast } from '@/lib/utils/errorHandler';

function MyComponent() {
  const mutation = useDownloadYoutube();

  const handleDownload = async (url: string) => {
    try {
      await mutation.mutateAsync({ url });
      showSuccessToast('Download thành công!');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      showErrorToast(message);
    }
  };

  return (
    <button 
      onClick={() => handleDownload('https://youtube.com/watch?v=...')}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Đang tải...' : 'Download'}
    </button>
  );
}
```

## Cấu trúc thư mục

```
lib/
├── api/
│   ├── config.ts          # API configuration
│   └── client.ts          # HTTP client
├── hooks/
│   └── useApi.ts          # React Query hooks
├── types/
│   └── api.ts             # TypeScript types
└── utils/
    └── errorHandler.ts    # Error handling utilities
```

## Tính năng

- ✅ React Query setup với TypeScript
- ✅ HTTP client với error handling
- ✅ Custom hooks cho API calls
- ✅ Type safety với TypeScript
- ✅ Error handling và retry logic
- ✅ Query invalidation
- ✅ DevTools integration
- ✅ Environment configuration
