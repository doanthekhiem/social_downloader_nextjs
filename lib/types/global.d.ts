// Global type declarations
declare global {
  // Allow any type globally
  type AnyType = any;
  
  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL?: string;
      JWT_SECRET?: string;
      NEXTAUTH_SECRET?: string;
      NEXTAUTH_URL?: string;
      YOUTUBE_API_KEY?: string;
      TIKTOK_API_KEY?: string;
      INSTAGRAM_API_KEY?: string;
    }
  }
}

// Make it a module
export {};
