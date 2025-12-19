
import React, { useState, useMemo } from 'react';
import { LubeInventory, StockTransaction } from '../types';
import { saveInventory, updateInventoryStock, addTransaction, updateTransaction, deleteTransaction } from '../services/storageService';
import { Plus, Search, Edit2, Trash2, Download, Package, ArrowUpRight, ArrowDownLeft, X, Save, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LubeStockManagerProps {
  inventory: LubeInventory[];
  transactions: StockTransaction[];
  onUpdate: () => void;
}

interface ItemModalProps {
  item: Partial<LubeInventory>;
  onClose: () => void;
  onSave: (item: LubeInventory) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onSave }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<LubeInventory>>({
    name: '',
    type: 'Oil',
    stock: 0,
    unit: 'L',
    minThreshold: 10,
    ...item
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.unit) {
      onSave(formData as LubeInventory);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{item.id ? t.common.edit : t.stock.add}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock.itemName}</label>
            <input required type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Shell Gadus" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.type}</label>
            <select className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
               value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
               <option value="润滑油">Oil</option>
               <option value="润滑脂">Grease</option>
               <option value="液压油">Hydraulic Oil</option>
               <option value="齿轮油">Gear Oil</option>
               <option value="其他">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock.currentStock}</label>
              <input required type="number" step="0.1" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.stock} onChange={e => setFormData({...formData, stock: parseFloat(e.target.value)})} />
            </div>
             <div>
              {/* Fixed: Use t.common.unit instead of t.stock.unit */}
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.unit}</label>
              <input required type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="kg, L" />
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock.threshold}</label>
              <input required type="number" step="1" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.minThreshold} onChange={e => setFormData({...formData, minThreshold: parseFloat(e.target.value)})} />
            </div>
          
          <div className="pt-2 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded border border-slate-200">{t.common.cancel}</button>
             <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t.common.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface TransactionModalProps {
  item: LubeInventory;
  type: 'IN' | 'OUT';
  onClose: () => void;
  onConfirm: (amount: number, user: string) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ item, type, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [user, setUser] = useState('');
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">{type === 'IN' ? t.stock.stockIn : t.stock.stockOut}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
                <p className="font-medium text-slate-700">{item.name}</p>
                <div>
                    {/* Fixed: Use t.common.amount instead of t.stock.amount */}
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.amount} ({item.unit})</label>
                    <input type="number" step="0.1" autoFocus
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0.0" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.user}</label>
                    <input type="text" 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="" value={user} onChange={e => setUser(e.target.value)} />
                </div>
                <button 
                    onClick={() => onConfirm(parseFloat(amount), user)}
                    disabled={!amount || !user}
                    className={`w-full py-2 text-white rounded mt-2 ${type === 'IN' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {t.stock.confirm}
                </button>
            </div>
        </div>
    </div>
  );
};

interface EditTransactionModalProps {
  transaction: StockTransaction;
  onClose: () => void;
  onSave: (tx: StockTransaction) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState<StockTransaction>({ ...transaction });
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">{t.common.edit}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
                <p className="font-medium text-slate-700">{formData.inventoryName}</p>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.type}</label>
                    <div className="flex gap-2">
                        <button 
                          onClick={() => setFormData({...formData, type: 'IN'})}
                          className={`flex-1 py-1.5 rounded text-sm font-medium ${formData.type === 'IN' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {t.common.in}
                        </button>
                        <button 
                          onClick={() => setFormData({...formData, type: 'OUT'})}
                          className={`flex-1 py-1.5 rounded text-sm font-medium ${formData.type === 'OUT' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {t.common.out}
                        </button>
                    </div>
                </div>

                <div>
                    {/* Fixed: Use t.common.amount instead of t.stock.amount */}
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.amount}</label>
                    <input type="number" step="0.1" 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.user}</label>
                    <input type="text" 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.user} onChange={e => setFormData({...formData, user: e.target.value})} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.date}</label>
                    <input type="datetime-local" 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={new Date(formData.date).toISOString().slice(0, 16)} 
                        onChange={e => setFormData({...formData, date: new Date(e.target.value).toISOString()})} />
                </div>

                <div className="pt-2 flex gap-3">
                  <button onClick={onClose} className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded border border-slate-200">{t.common.cancel}</button>
                  <button 
                      onClick={() => onSave(formData)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                      {t.common.save}
                  </button>
                </div>
            </div>
        </div>
    </div>
  );
};

const LubeStockManager: React.FC<LubeStockManagerProps> = ({ inventory, transactions, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItemModal, setActiveItemModal] = useState<Partial<LubeInventory> | null>(null);
  const [activeTransModal, setActiveTransModal] = useState<{item: LubeInventory, type: 'IN'|'OUT'} | null>(null);
  const [editingTx, setEditingTx] = useState<StockTransaction | null>(null);
  const { t } = useLanguage();

  const filteredInventory = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
        t.inventoryName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.user.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm]);

  const handleSaveItem = async (item: LubeInventory) => {
    let newInventory = [...inventory];
    if (item.id) {
        newInventory = newInventory.map(i => i.id === item.id ? item : i);
    } else {
        newInventory.push({ ...item, id: crypto.randomUUID() });
    }
    // Fix: Await saveInventory
    await saveInventory(newInventory);
    onUpdate();
    setActiveItemModal(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm(t.history.deleteConfirm)) {
        const newInventory = inventory.filter(i => i.id !== id);
        // Fix: Await saveInventory
        await saveInventory(newInventory);
        onUpdate();
    }
  };

  const handleTransaction = async (amount: number, user: string) => {
    if (!activeTransModal) return;
    const { item, type } = activeTransModal;
    const delta = type === 'IN' ? amount : -amount;
    
    // Fix: Await updateInventoryStock
    await updateInventoryStock(item.id, delta);
    // Fix: Await addTransaction
    await addTransaction({
        id: crypto.randomUUID(),
        inventoryId: item.id,
        inventoryName: item.name,
        type,
        amount,
        date: new Date().toISOString(),
        user
    });
    
    onUpdate();
    setActiveTransModal(null);
  };

  const handleUpdateTransaction = async (tx: StockTransaction) => {
    // Fix: Await updateTransaction
    await updateTransaction(tx);
    onUpdate();
    setEditingTx(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (confirm(t.history.deleteConfirm)) {
      // Fix: Await deleteTransaction
      await deleteTransaction(id);
      onUpdate();
    }
  };

  const handleExportTransactions = () => {
    if (filteredTransactions.length === 0) {
        alert("No records.");
        return;
    }
    // Fixed: Use t.common.amount instead of t.stock.amount
    const headers = [t.common.date, t.stock.itemName, t.common.type, t.common.amount, t.common.user];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(t => 
        `"${new Date(t.date).toLocaleString()}","${t.inventoryName}","${t.type === 'IN' ? 'IN' : 'OUT'}","${t.amount}","${t.user}"`
      )
    ].join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Stock_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
            <h2 className="text-2xl font-bold text-slate-800">{t.stock.title}</h2>
            <p className="text-slate-500">{t.stock.subtitle}</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveItemModal({})}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} />
                    {t.stock.add}
                </button>
            </div>
        </div>

        {/* Global Search */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder={t.common.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Section 1: Inventory List */}
        <div>
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Package size={20} /> {t.stock.list}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                                <p className="text-xs text-slate-500">{item.type}</p>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => setActiveItemModal(item)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-slate-50"><Edit2 size={14} /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-slate-50"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        
                        <div className="flex items-end gap-2 my-4">
                            <span className={`text-4xl font-bold ${item.stock <= item.minThreshold ? 'text-red-600' : 'text-slate-700'}`}>
                                {item.stock}
                            </span>
                            <span className="text-sm text-slate-500 font-medium mb-1.5">{item.unit}</span>
                            {item.stock <= item.minThreshold && (
                                <span className="ml-auto flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                                    <AlertTriangle size={12} /> {t.stock.warning}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                             <button 
                                onClick={() => setActiveTransModal({item, type: 'IN'})}
                                className="flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded text-sm font-bold transition-colors">
                                <ArrowDownLeft size={16} /> {t.common.in}
                             </button>
                             <button 
                                onClick={() => setActiveTransModal({item, type: 'OUT'})}
                                className="flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-sm font-bold transition-colors">
                                <ArrowUpRight size={16} /> {t.common.out}
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Section 2: Transaction History */}
        <div className="pt-4">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <Download size={20} /> {t.stock.history}
                </h3>
                <button 
                    onClick={handleExportTransactions}
                    className="flex items-center gap-1 text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-200 transition-colors"
                >
                    <Save size={14} /> {t.stock.export}
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-semibold text-slate-600 text-sm">{t.common.date}</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">{t.common.type}</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">{t.stock.itemName}</th>
                                {/* Fixed: Use t.common.amount instead of t.stock.amount */}
                                <th className="p-4 font-semibold text-slate-600 text-sm">{t.common.amount}</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">{t.common.user}</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm text-right">{t.common.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4 text-slate-500 text-sm">{new Date(tx.date).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${tx.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {tx.type === 'IN' ? t.common.in : t.common.out}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-slate-800">{tx.inventoryName}</td>
                                    <td className="p-4 font-bold text-slate-700">
                                        {tx.type === 'IN' ? '+' : '-'}{tx.amount}
                                    </td>
                                    <td className="p-4 text-slate-600">{tx.user}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setEditingTx(tx)} 
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTransaction(tx.id)} 
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        No records.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {activeItemModal && (
            <ItemModal 
                item={activeItemModal} 
                onClose={() => setActiveItemModal(null)}
                onSave={handleSaveItem} 
            />
        )}

        {activeTransModal && (
            <TransactionModal 
                item={activeTransModal.item}
                type={activeTransModal.type}
                onClose={() => setActiveTransModal(null)}
                onConfirm={handleTransaction}
            />
        )}

        {editingTx && (
            <EditTransactionModal 
                transaction={editingTx}
                onClose={() => setEditingTx(null)}
                onSave={handleUpdateTransaction}
            />
        )}
    </div>
  );
};

export default LubeStockManager;
