
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'lubetrack_supabase_config';

export interface SupabaseConfig {
  url: string;
  key: string;
}

export const getSupabaseConfig = (): SupabaseConfig | null => {
  // Priority 1: Environment Variables
  const envUrl = process.env.SUPABASE_URL;
  const envKey = process.env.SUPABASE_ANON_KEY;
  
  if (envUrl && envKey && envUrl !== "undefined" && envKey !== "undefined") {
    return { url: envUrl, key: envKey };
  }

  // Priority 2: Local Storage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  
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
