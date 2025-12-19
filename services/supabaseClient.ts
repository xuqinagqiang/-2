
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'lubetrack_supabase_config';

export interface SupabaseConfig {
  url: string;
  key: string;
}

export const getSupabaseConfig = (): SupabaseConfig | null => {
  // Priority 1: Environment Variables (Production/Vercel)
  // Note: Vercel environment variables are available via process.env
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return { 
      url: process.env.SUPABASE_URL, 
      key: process.env.SUPABASE_ANON_KEY 
    };
  }

  // Priority 2: Local Storage (Manual user config)
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  
  return null;
};

export const saveSupabaseConfig = (config: SupabaseConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const initSupabase = () => {
  const config = getSupabaseConfig();
  if (!config || !config.url || !config.key) return null;
  
  try {
    return createClient(config.url, config.key);
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
};

export const supabase = initSupabase();
