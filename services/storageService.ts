
import { Equipment, LubeRecord, LubeInventory, StockTransaction, SOPCategory, SOPDocument, AppSettings } from '../types';
import { supabase } from './supabaseClient';

// Fallback to local keys for settings
const SETTINGS_KEY = 'lubetrack_settings';

// Helper: If Supabase is not configured, we might throw or return empty
const ensureSupabase = () => {
  if (!supabase) throw new Error("Supabase is not configured. Go to Sync Center.");
  return supabase;
};

export const getStoredEquipment = async (): Promise<Equipment[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('equipment').select('*').order('name');
  if (error) throw error;
  return data || [];
};

export const saveEquipment = async (equipment: Equipment[]) => {
  // In Supabase, we usually upsert one or many. 
  // Given the app's current logic of sending the whole list, we upsert the whole list.
  if (!supabase) return;
  const { error } = await supabase.from('equipment').upsert(equipment);
  if (error) throw error;
};

export const getStoredRecords = async (): Promise<LubeRecord[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('records').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const saveRecord = async (record: LubeRecord) => {
  if (!supabase) return;
  const { error } = await supabase.from('records').upsert([record]);
  if (error) throw error;
};

// Fix: Add updateRecord exported member
export const updateRecord = async (record: LubeRecord) => {
  return saveRecord(record);
};

export const deleteRecord = async (id: string) => {
  if (!supabase) return;
  const { error } = await supabase.from('records').delete().eq('id', id);
  if (error) throw error;
};

export const getStoredInventory = async (): Promise<LubeInventory[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('inventory').select('*').order('name');
  if (error) throw error;
  return data || [];
};

export const saveInventory = async (inventory: LubeInventory[]) => {
  if (!supabase) return;
  const { error } = await supabase.from('inventory').upsert(inventory);
  if (error) throw error;
};

export const updateInventoryStock = async (id: string, delta: number) => {
  if (!supabase) return;
  // Use a RPC call or manual fetch-update for atomicity in real DB
  const { data: item } = await supabase.from('inventory').select('stock').eq('id', id).single();
  if (item) {
    const newStock = parseFloat((item.stock + delta).toFixed(2));
    await supabase.from('inventory').update({ stock: newStock }).eq('id', id);
  }
};

export const getStoredTransactions = async (): Promise<StockTransaction[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addTransaction = async (tx: StockTransaction) => {
  if (!supabase) return;
  const { error } = await supabase.from('transactions').insert([tx]);
  if (error) throw error;
};

// Fix: Add updateTransaction exported member
export const updateTransaction = async (tx: StockTransaction) => {
  if (!supabase) return;
  const { error } = await supabase.from('transactions').upsert([tx]);
  if (error) throw error;
};

// Fix: Add deleteTransaction exported member
export const deleteTransaction = async (id: string) => {
  if (!supabase) return;
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
};

// Fix: Add SOP related storage functions
export const getSOPCategories = async (): Promise<SOPCategory[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('sop_categories').select('*').order('name');
  if (error) throw error;
  return data || [];
};

export const saveSOPCategories = async (categories: SOPCategory[]) => {
  if (!supabase) return;
  const { error } = await supabase.from('sop_categories').upsert(categories);
  if (error) throw error;
};

export const getSOPDocuments = async (): Promise<SOPDocument[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('sop_documents').select('*').order('title');
  if (error) throw error;
  return data || [];
};

export const saveSOPDocuments = async (documents: SOPDocument[]) => {
  if (!supabase) return;
  const { error } = await supabase.from('sop_documents').upsert(documents);
  if (error) throw error;
};

// Utilities
export const calculateNextDate = (lastDate: string, cycleDays: number): string => {
  const date = new Date(lastDate);
  date.setDate(date.getDate() + cycleDays);
  return date.toISOString().split('T')[0];
};

export const getStatus = (nextDate: string): 'OK' | 'DUE' | 'OVERDUE' => {
  const today = new Date().toISOString().split('T')[0];
  if (nextDate < today) return 'OVERDUE';
  if (nextDate === today) return 'DUE';
  return 'OK';
};

export const compressImage = (file: File, maxWidth = 800, quality = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(elem.toDataURL(file.type, quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const getAppSettings = (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return { photoRetentionDays: 0 };
    return JSON.parse(data);
};

export const saveAppSettings = (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Fix: Add cleanupOldPhotos exported member
export const cleanupOldPhotos = async (): Promise<number> => {
  if (!supabase) return 0;
  const settings = getAppSettings();
  if (settings.photoRetentionDays <= 0) return 0;

  const { data: records, error } = await supabase.from('records').select('*');
  if (error || !records) return 0;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - settings.photoRetentionDays);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  let cleanedCount = 0;
  for (const record of records) {
    if (record.date < cutoffStr && record.photos && record.photos.length > 0) {
      cleanedCount += record.photos.length;
      await supabase.from('records').update({ photos: [] }).eq('id', record.id);
    }
  }
  return cleanedCount;
};
