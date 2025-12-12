
import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { getStoredEquipment, getStoredRecords, getStoredInventory, getStoredTransactions } from './services/storageService';
import Dashboard from './components/Dashboard';
import InventoryManager from './components/InventoryManager';
import DailySchedule from './components/DailySchedule';
import AiAssistant from './components/AiAssistant';
import HistoryLog from './components/HistoryLog';
import LubeStockManager from './components/LubeStockManager';
import SOPManager from './components/SOPManager';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LayoutDashboard, Database, CalendarCheck, History, Menu, X, Sparkles, Droplet, Package, BookOpen, Globe } from 'lucide-react';

const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [equipment, setEquipment] = useState(getStoredEquipment());
  const [records, setRecords] = useState(getStoredRecords());
  const [inventory, setInventory] = useState(getStoredInventory());
  const [transactions, setTransactions] = useState(getStoredTransactions());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();

  const refreshData = () => {
    setEquipment(getStoredEquipment());
    setRecords(getStoredRecords());
    setInventory(getStoredInventory());
    setTransactions(getStoredTransactions());
  };

  useEffect(() => {
    refreshData();
  }, []);

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
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Droplet size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t.appName}</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem target="dashboard" icon={LayoutDashboard} label={t.nav.dashboard} />
          <NavItem target="schedule" icon={CalendarCheck} label={t.nav.schedule} />
          <NavItem target="inventory" icon={Database} label={t.nav.inventory} />
          <NavItem target="stock" icon={Package} label={t.nav.stock} />
          <NavItem target="sop" icon={BookOpen} label={t.nav.sop} />
          <NavItem target="history" icon={History} label={t.nav.history} />
          <NavItem target="assistant" icon={Sparkles} label={t.nav.assistant} />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-4">
           {/* Language Switcher */}
           <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setLanguage('zh')}
                className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${language === 'zh' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
              >
                中文
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${language === 'en' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
              >
                English
              </button>
           </div>

           <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
             <p className="text-xs text-slate-500 font-medium">{t.common.status}</p>
             <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-xs text-slate-700">Online • Local</span>
             </div>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
           <div className="bg-blue-600 p-1.5 rounded text-white">
            <Droplet size={20} fill="currentColor" />
          </div>
          <h1 className="text-lg font-bold text-slate-800">{t.appName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="text-slate-500 flex items-center gap-1 text-sm font-medium"
          >
            <Globe size={18} />
            {language === 'zh' ? 'EN' : '中'}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-20 px-4 space-y-2">
          <NavItem target="dashboard" icon={LayoutDashboard} label={t.nav.dashboard} />
          <NavItem target="schedule" icon={CalendarCheck} label={t.nav.schedule} />
          <NavItem target="inventory" icon={Database} label={t.nav.inventory} />
          <NavItem target="stock" icon={Package} label={t.nav.stock} />
          <NavItem target="sop" icon={BookOpen} label={t.nav.sop} />
          <NavItem target="history" icon={History} label={t.nav.history} />
          <NavItem target="assistant" icon={Sparkles} label={t.nav.assistant} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard 
                equipment={equipment} 
                records={records} 
                inventory={inventory}
                transactions={transactions}
                onInventoryUpdate={refreshData}
            />
          )}
          {view === 'schedule' && <DailySchedule equipment={equipment} onUpdate={refreshData} />}
          {view === 'inventory' && <InventoryManager equipment={equipment} onUpdate={refreshData} />}
          {view === 'stock' && <LubeStockManager inventory={inventory} transactions={transactions} onUpdate={refreshData} />}
          {view === 'sop' && <SOPManager />}
          {view === 'history' && <HistoryLog records={records} equipment={equipment} onUpdate={refreshData} />}
          {view === 'assistant' && <AiAssistant equipment={equipment} />}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
