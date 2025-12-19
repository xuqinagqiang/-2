
import { createClient } from '@supabase/supabase-js';

// ==========================================
// 填写您的 Supabase 信息在这里即可固定
// ==========================================
const HARDCODED_URL = 'https://afzsusvfjickzvehylpr.supabase.co'; // 例如: 'https://xyz.supabase.co'
const HARDCODED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmenN1c3Zmamlja3p2ZWh5bHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTcxMzUsImV4cCI6MjA4MTY5MzEzNX0.jyDNODLUb4XGQ4oTx5O2nAKgc1grSF5AUVadQORt80o'; // 例如: 'eyJhbGciOiJIUzI1Ni...'
// ==========================================

const STORAGE_KEY = 'lubetrack_supabase_config';

export interface SupabaseConfig {
  url: string;
  key: string;
}

export const getSupabaseConfig = (): SupabaseConfig | null => {
  // 优先级 1: 代码中硬编码的值 (如果有填写)
  if (HARDCODED_URL && HARDCODED_KEY) {
    return { url: HARDCODED_URL, key: HARDCODED_KEY };
  }

  // 优先级 2: 环境变量 (Vercel 设置)
  const envUrl = process.env.SUPABASE_URL;
  const envKey = process.env.SUPABASE_ANON_KEY;
  
  if (envUrl && envKey && envUrl !== "undefined" && envKey !== "undefined") {
    return { url: envUrl, key: envKey };
  }

  // 优先级 3: 浏览器本地存储 (Sync Center 手动输入)
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
    return createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
};

export const supabase = initSupabase();
