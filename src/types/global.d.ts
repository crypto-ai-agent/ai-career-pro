/// <reference types="vite/client" />

// Extend Window interface
interface Window {
  gtag?: (...args: any[]) => void;
}

// Extend ImportMeta interface for Vite env variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_BASE?: string;
  readonly VITE_EMAIL_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Utility types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Nullable<T> = T | null;

type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;