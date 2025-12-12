
import React, { useState } from 'react';
import { getMaintenanceAdvice, analyzeSchedule } from '../services/geminiService';
import { Equipment } from '../types';
import { Sparkles, Send, Loader2, BarChart2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';

interface AiAssistantProps {
  equipment: Equipment[];
}

const AiAssistant: React.FC<AiAssistantProps> = ({ equipment }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    try {
      // Pass the current language code to the service
      const result = await getMaintenanceAdvice(query, equipment, language);
      setResponse(result);
    } catch (error) {
      setResponse(t.ai.error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const result = await analyzeSchedule(equipment, language);
      setResponse(result);
    } catch (error) {
      setResponse(t.ai.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
       <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full text-indigo-600 mb-2">
          <Sparkles size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{t.ai.title}</h2>
        <p className="text-slate-500">{t.ai.subtitle}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleAsk} className="relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.ai.placeholder}
            className="w-full pl-4 pr-14 py-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-sm"
          />
          <button 
            type="submit" 
            disabled={loading || !query}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors whitespace-nowrap"
            >
                <BarChart2 size={16} />
                {t.ai.analyze}
            </button>
            <button 
                onClick={() => setQuery(language === 'en' ? "General safety precautions for industrial lubricants?" : "工业润滑油的一般操作安全预防措施有哪些？")}
                className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
                {t.ai.safety}
            </button>
            <button 
                onClick={() => setQuery(language === 'en' ? "Explain ISO VG 46 vs 68 viscosity grades." : "解释一下 ISO VG 46 和 68 粘度等级的区别。")}
                className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
                {t.ai.viscosity}
            </button>
        </div>
      </div>

      {response && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-indigo-100 animate-fade-in">
            <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-4">{t.ai.reply}</h3>
            <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{response}</ReactMarkdown>
            </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
