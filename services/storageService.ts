
import { Equipment, LubeRecord, LubeInventory, StockTransaction, SOPCategory, SOPDocument, AppSettings } from '../types';

const EQ_KEY = 'lubetrack_equipment';
const REC_KEY = 'lubetrack_records';
const INV_KEY = 'lubetrack_inventory';
const TX_KEY = 'lubetrack_transactions';
const SOP_CAT_KEY = 'lubetrack_sop_categories';
const SOP_DOC_KEY = 'lubetrack_sop_documents';
const SETTINGS_KEY = 'lubetrack_settings';

// Initial Mock Data (Chinese)
const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: '1',
    name: '主输送带电机',
    type: '电机',
    location: 'A区',
    lubricant: '锂基脂 EP2',
    cycleDays: 30,
    lastLubricated: '2023-10-01', 
    nextLubricated: '2023-10-31',
    capacity: '40g',
    notes: '检查轴承是否有异响'
  },
  {
    id: '2',
    name: '液压泵 P-102',
    type: '泵',
    location: '泵房',
    lubricant: 'ISO VG 46 液压油',
    cycleDays: 90,
    lastLubricated: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    nextLubricated: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    capacity: '200L',
    notes: '需要更换滤芯'
  },
  {
    id: '3',
    name: '包装机齿轮箱',
    type: '齿轮箱',
    location: '3号线',
    lubricant: '合成齿轮油 220',
    cycleDays: 180,
    lastLubricated: new Date().toISOString().split('T')[0],
    nextLubricated: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    capacity: '5L',
    notes: ''
  }
];

const MOCK_INVENTORY: LubeInventory[] = [
  { id: '1', name: '锂基脂 EP2', type: '润滑脂', stock: 15.5, unit: 'kg', minThreshold: 5 },
  { id: '2', name: 'ISO VG 46 液压油', type: '液压油', stock: 180, unit: 'L', minThreshold: 50 },
  { id: '3', name: '合成齿轮油 220', type: '齿轮油', stock: 40, unit: 'L', minThreshold: 10 },
];

const MOCK_TRANSACTIONS: StockTransaction[] = [
  { id: 't1', inventoryId: '1', inventoryName: '锂基脂 EP2', type: 'OUT', amount: 0.5, date: new Date().toISOString(), user: '张三' },
];

const MOCK_RECORDS: LubeRecord[] = [
  {
    id: 'r1',
    equipmentId: '1',
    equipmentName: '主输送带电机',
    date: '2023-10-01',
    performedBy: '张三',
    notes: '常规加油，运行平稳'
  },
  {
    id: 'r2',
    equipmentId: '1',
    equipmentName: '主输送带电机',
    date: '2023-09-01',
    performedBy: '张三',
    notes: '清理了注油口'
  },
  {
    id: 'r3',
    equipmentId: '2',
    equipmentName: '液压泵 P-102',
    date: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    performedBy: '李四',
    notes: '油位偏低，补油20L'
  },
  {
    id: 'r4',
    equipmentId: '3',
    equipmentName: '包装机齿轮箱',
    date: new Date().toISOString().split('T')[0],
    performedBy: '王五',
    notes: '季度保养，已取样分析'
  }
];

const MOCK_SOP_CATEGORIES: SOPCategory[] = [
  { id: 'c1', name: '电机类', description: '各类高低压电机润滑标准' },
  { id: 'c2', name: '泵类', description: '离心泵、齿轮泵等' },
  { id: 'c3', name: '输送带系统', description: '滚筒、托辊润滑' },
];

const MOCK_SOP_DOCS: SOPDocument[] = [
  {
    id: 'd1',
    categoryId: 'c1',
    title: '三相异步电机轴承润滑标准作业程序',
    content: `### 1. 目的\n规范电机轴承润滑作业，防止因润滑不良导致电机损坏。\n\n### 2. 准备工具\n- 黄油枪\n- 干净抹布\n- 对应型号润滑脂 (通常为 EP2)\n\n### 3. 操作步骤\n1. **清洁**: 在注油前，必须将注油嘴周围擦拭干净，防止灰尘进入。\n2. **打开排油口**: 如果电机有排油口，请先打开，以便旧油排出。\n3. **注油**: 均匀按压黄油枪，按照铭牌规定的克数加注。注意观察是否有异常阻力。\n4. **运行**: 加注后，让电机运行 20 分钟，排出多余油脂。\n5. **清理**: 擦去溢出的油脂，关闭排油口。`,
    updatedAt: '2023-10-25'
  },
  {
    id: 'd2',
    categoryId: 'c2',
    title: '液压泵站换油SOP',
    content: `1. 停机并挂牌上锁。\n2. 准备接油盘，打开放油阀。\n3. 清理油箱底部沉淀物。\n4. 更换回油滤芯和呼吸器。\n5. 泵送新油至规定液位。`,
    updatedAt: '2023-11-10'
  }
];

export const getStoredEquipment = (): Equipment[] => {
  const data = localStorage.getItem(EQ_KEY);
  if (!data) {
    localStorage.setItem(EQ_KEY, JSON.stringify(MOCK_EQUIPMENT));
    return MOCK_EQUIPMENT;
  }
  return JSON.parse(data);
};

export const saveEquipment = (equipment: Equipment[]) => {
  localStorage.setItem(EQ_KEY, JSON.stringify(equipment));
};

export const getStoredRecords = (): LubeRecord[] => {
  const data = localStorage.getItem(REC_KEY);
  if (!data) {
    localStorage.setItem(REC_KEY, JSON.stringify(MOCK_RECORDS));
    return MOCK_RECORDS;
  }
  return JSON.parse(data);
};

export const saveRecord = (record: LubeRecord) => {
  try {
    const records = getStoredRecords();
    const index = records.findIndex(r => r.id === record.id);
    if (index !== -1) {
      records[index] = record;
    } else {
      records.unshift(record);
    }
    localStorage.setItem(REC_KEY, JSON.stringify(records));
  } catch (e) {
    console.error("Storage limit exceeded or error", e);
    alert("Storage Full! Cannot save photos. Please delete old records or export data.");
  }
};

export const updateRecord = (updatedRecord: LubeRecord) => {
  saveRecord(updatedRecord);
};

export const deleteRecord = (id: string) => {
  let records = getStoredRecords();
  records = records.filter(r => r.id !== id);
  localStorage.setItem(REC_KEY, JSON.stringify(records));
};

export const getStoredInventory = (): LubeInventory[] => {
  const data = localStorage.getItem(INV_KEY);
  if (!data) {
    localStorage.setItem(INV_KEY, JSON.stringify(MOCK_INVENTORY));
    return MOCK_INVENTORY;
  }
  return JSON.parse(data);
};

export const saveInventory = (inventory: LubeInventory[]) => {
  localStorage.setItem(INV_KEY, JSON.stringify(inventory));
};

export const updateInventoryStock = (id: string, delta: number) => {
  const inv = getStoredInventory();
  const item = inv.find(i => i.id === id);
  if (item) {
    item.stock = parseFloat((item.stock + delta).toFixed(2)); // Avoid float precision issues
    localStorage.setItem(INV_KEY, JSON.stringify(inv));
  }
  return inv;
};

export const getStoredTransactions = (): StockTransaction[] => {
  const data = localStorage.getItem(TX_KEY);
  if (!data) {
    localStorage.setItem(TX_KEY, JSON.stringify(MOCK_TRANSACTIONS));
    return MOCK_TRANSACTIONS;
  }
  return JSON.parse(data);
};

export const addTransaction = (tx: StockTransaction) => {
  const txs = getStoredTransactions();
  txs.unshift(tx);
  localStorage.setItem(TX_KEY, JSON.stringify(txs));
  return txs;
};

export const updateTransaction = (updatedTx: StockTransaction) => {
  const txs = getStoredTransactions();
  const oldTx = txs.find(t => t.id === updatedTx.id);
  if (!oldTx) return;

  const oldChange = oldTx.type === 'IN' ? oldTx.amount : -oldTx.amount;
  const newChange = updatedTx.type === 'IN' ? updatedTx.amount : -updatedTx.amount;
  const netAdjustment = newChange - oldChange;

  if (Math.abs(netAdjustment) > 0.001) {
    updateInventoryStock(updatedTx.inventoryId, netAdjustment);
  }

  const index = txs.findIndex(t => t.id === updatedTx.id);
  if (index !== -1) {
    txs[index] = updatedTx;
    localStorage.setItem(TX_KEY, JSON.stringify(txs));
  }
};

export const deleteTransaction = (id: string) => {
  const txs = getStoredTransactions();
  const tx = txs.find(t => t.id === id);
  if (!tx) return;

  const revertChange = tx.type === 'IN' ? -tx.amount : tx.amount;
  updateInventoryStock(tx.inventoryId, revertChange);

  const newTxs = txs.filter(t => t.id !== id);
  localStorage.setItem(TX_KEY, JSON.stringify(newTxs));
};

export const getSOPCategories = (): SOPCategory[] => {
  const data = localStorage.getItem(SOP_CAT_KEY);
  if (!data) {
    localStorage.setItem(SOP_CAT_KEY, JSON.stringify(MOCK_SOP_CATEGORIES));
    return MOCK_SOP_CATEGORIES;
  }
  return JSON.parse(data);
};

export const saveSOPCategories = (categories: SOPCategory[]) => {
  localStorage.setItem(SOP_CAT_KEY, JSON.stringify(categories));
};

export const getSOPDocuments = (): SOPDocument[] => {
  const data = localStorage.getItem(SOP_DOC_KEY);
  if (!data) {
    localStorage.setItem(SOP_DOC_KEY, JSON.stringify(MOCK_SOP_DOCS));
    return MOCK_SOP_DOCS;
  }
  return JSON.parse(data);
};

export const saveSOPDocuments = (docs: SOPDocument[]) => {
  localStorage.setItem(SOP_DOC_KEY, JSON.stringify(docs));
};

// Settings & Auto Cleanup
export const getAppSettings = (): AppSettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return { photoRetentionDays: 0 };
    return JSON.parse(data);
};

export const saveAppSettings = (settings: AppSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const cleanupOldPhotos = () => {
    const settings = getAppSettings();
    if (settings.photoRetentionDays <= 0) return 0; // Disabled

    const records = getStoredRecords();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - settings.photoRetentionDays);

    let changed = false;
    let removedCount = 0;

    const newRecords = records.map(record => {
        const recordDate = new Date(record.date);
        // Check if record is older than cutoff AND has photos
        if (recordDate < cutoffDate && record.photos && record.photos.length > 0) {
            removedCount += record.photos.length;
            changed = true;
            return { ...record, photos: [] }; // Remove photos but keep record
        }
        return record;
    });

    if (changed) {
        localStorage.setItem(REC_KEY, JSON.stringify(newRecords));
    }
    return removedCount;
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

// Image Compression Helper
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
