
import React, { useState, useEffect } from 'react';
import { getSupabaseConfig, saveSupabaseConfig, SupabaseConfig } from '../services/supabaseClient';
import { Download, Upload, Copy, Check, FileJson, Share2, AlertTriangle, Database, Info, Link, ShieldCheck, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SyncCenterProps {
    onUpdate: () => void;
}

const SyncCenter: React.FC<SyncCenterProps> = ({ onUpdate }) => {
    const { t } = useLanguage();
    const [config, setConfig] = useState<SupabaseConfig>(getSupabaseConfig() || { url: '', key: '' });
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const handleSaveConfig = () => {
        if (!config.url || !config.key) {
            setStatus({ type: 'error', msg: '请填写完整的 URL 和 Key' });
            return;
        }
        saveSupabaseConfig(config);
        setStatus({ type: 'success', msg: '配置已保存，请刷新页面以生效' });
        // Trigger a slight delay then update/reload
        setTimeout(() => {
            window.location.reload(); 
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t.sync.title}</h2>
                    <p className="text-slate-500">通过 Supabase 实现跨设备同步与实时协作。</p>
                </div>
            </div>

            {status && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-bounce ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {status.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
                    <span className="font-medium">{status.msg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Supabase Config Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Link size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Supabase 连接设置</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">请输入您的 Supabase 凭据以连接共同数据库。</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Project URL</label>
                            <input 
                                type="text" 
                                value={config.url}
                                onChange={e => setConfig({...config, url: e.target.value})}
                                placeholder="https://xyz.supabase.co"
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Anon Key</label>
                            <input 
                                type="password" 
                                value={config.key}
                                onChange={e => setConfig({...config, key: e.target.value})}
                                placeholder="eyJhbGciOiJIUzI1Ni..."
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>
                        <button 
                            onClick={handleSaveConfig}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <ShieldCheck size={18} />
                            保存并连接
                        </button>
                    </div>
                </div>

                {/* DB Instructions Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <HelpCircle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">如何配置数据库？</h3>
                    </div>
                    <div className="text-sm text-slate-600 space-y-3">
                        <p>1. 登录 <a href="https://supabase.com" target="_blank" className="text-blue-600 hover:underline">Supabase</a> 并创建一个新项目。</p>
                        <p>2. 在 <b>SQL Editor</b> 中运行必要的建表 SQL 脚本。</p>
                        <p>3. 在 <b>Settings {'>'} API</b> 页面找到您的 URL 和 Key。</p>
                        <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-100">
                           <p className="text-xs font-mono text-slate-400">注意：请确保已启用 Realtime 同步功能以实现实时协作。</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 items-start">
                <Info className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-amber-800">
                    <p className="font-bold mb-1">关于实时更新：</p>
                    <p>当手机端完成润滑记录并上传照片后，电脑端会自动通过 WebSocket 收到推送并同步显示，无需手动刷新。这要求您的 Supabase 项目已开启 Postgres Changes 订阅。</p>
                </div>
            </div>
        </div>
    );
};

export default SyncCenter;
