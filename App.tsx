
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Equipment, LubeRecord, LubeInventory, StockTransaction } from './types';
import { 
  getStoredEquipment, 
  getStoredRecords, 
  getStoredInventory, 
  getStoredTransactions, 
} from './services/storageService';
import { supabase } from './services/supabaseClient';
import Dashboard from './components/Dashboard';
import InventoryManager from './components/InventoryManager';
import DailySchedule from './components/DailySchedule';
import AiAssistant from './components/AiAssistant';
import HistoryLog from './components/HistoryLog';
import LubeStockManager from './components/LubeStockManager';
import SOPManager from './components/SOPManager';
import SyncCenter from './components/SyncCenter';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
// Fix: Add Globe to imports
import { LayoutDashboard, Database, CalendarCheck, History, Menu, X, Sparkles, Droplet, Package, BookOpen, Cloud, CloudOff, RefreshCw, Globe } from 'lucide-react';

const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [records, setRecords] = useState<LubeRecord[]>([]);
  const [inventory, setInventory] = useState<LubeInventory[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();

  const refreshData = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [eq, rec, inv, tx] = await Promise.all([
        getStoredEquipment(),
        getStoredRecords(),
        getStoredInventory(),
        getStoredTransactions()
      ]);
      setEquipment(eq);
      setRecords(rec);
      setInventory(inv);
      setTransactions(tx);
    } catch (error) {
      console.error("Data fetch error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();

    if (supabase) {
      // Set up Real-time subscriptions for cross-device sync
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          // Instead of fetching everything, we could update local state, 
          // but for a simple implementation, re-fetching ensures consistency.
          refreshData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [refreshData]);

  const NavItem = ({ target, icon: Icon, label }: { target: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(target);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        view === target 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Droplet size={24} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t.appName}</h1>
          </div>
          <div>
            {supabase ? <Cloud size={16} className="text-green-500" /> : <CloudOff size={16} className="text-red-400" />}
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem target="dashboard" icon={LayoutDashboard} label={t.nav.dashboard} />
          <NavItem target="schedule" icon={CalendarCheck} label={t.nav.schedule} />
          <NavItem target="inventory" icon={Database} label={t.nav.inventory} />
          <NavItem target="stock" icon={Package} label={t.nav.stock} />
          <NavItem target="sop" icon={BookOpen} label={t.nav.sop} />
          <NavItem target="history" icon={History} label={t.nav.history} />
          <NavItem target="sync" icon={RefreshCw} label={t.nav.sync} />
          <NavItem target="assistant" icon={Sparkles} label={t.nav.assistant} />
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button 
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <Globe size={16} />
            {language === 'zh' ? 'English' : '简体中文'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen relative">
        {/* Header - Mobile */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Droplet size={24} className="text-blue-600" />
            <h1 className="font-bold text-slate-800">{t.appName}</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="animate-spin text-blue-600" size={32} />
                <p className="text-sm font-medium text-slate-500">{t.common.loading}</p>
              </div>
            </div>
          )}

          {!supabase && view !== 'sync' && (
             <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-red-700">
                  <CloudOff size={20} />
                  <p className="text-sm font-medium">数据库未连接。请前往“数据同步”配置 Supabase 以实现多端协同。</p>
                </div>
                <button 
                  onClick={() => setView('sync')}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                >
                  去配置
                </button>
             </div>
          )}

          {view === 'dashboard' && <Dashboard equipment={equipment} records={records} inventory={inventory} transactions={transactions} onInventoryUpdate={refreshData} />}
          {view === 'inventory' && <InventoryManager equipment={equipment} onUpdate={refreshData} />}
          {view === 'schedule' && <DailySchedule equipment={equipment} onUpdate={refreshData} />}
          {view === 'stock' && <LubeStockManager inventory={inventory} transactions={transactions} onUpdate={refreshData} />}
          {view === 'sop' && <SOPManager />}
          {view === 'history' && <HistoryLog records={records} equipment={equipment} onUpdate={refreshData} />}
          {view === 'sync' && <SyncCenter onUpdate={refreshData} />}
          {view === 'assistant' && <AiAssistant equipment={equipment} />}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl animate-fade-in flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">{t.appName}</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-2 flex-1">
              <NavItem target="dashboard" icon={LayoutDashboard} label={t.nav.dashboard} />
              <NavItem target="schedule" icon={CalendarCheck} label={t.nav.schedule} />
              <NavItem target="inventory" icon={Database} label={t.nav.inventory} />
              <NavItem target="stock" icon={Package} label={t.nav.stock} />
              <NavItem target="sop" icon={BookOpen} label={t.nav.sop} />
              <NavItem target="history" icon={History} label={t.nav.history} />
              <NavItem target="sync" icon={RefreshCw} label={t.nav.sync} />
              <NavItem target="assistant" icon={Sparkles} label={t.nav.assistant} />
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
