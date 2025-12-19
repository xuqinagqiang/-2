
import React, { useState, useMemo, useEffect } from 'react';
import { Equipment, LubeRecord, PhotoAttachment } from '../types';
import { updateRecord, deleteRecord, getAppSettings, saveAppSettings, cleanupOldPhotos } from '../services/storageService';
import { Download, Filter, Calendar, User, FileText, Search, History as HistoryIcon, Edit2, X, Save, Trash2, Settings, Image as ImageIcon, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryLogProps {
  records: LubeRecord[];
  equipment: Equipment[];
  onUpdate: () => void; 
}

interface EditRecordModalProps {
  record: LubeRecord;
  onClose: () => void;
  onSave: (updatedRecord: LubeRecord) => void;
}

const EditRecordModal: React.FC<EditRecordModalProps> = ({ record, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...record });
  const { t } = useLanguage();

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{t.common.edit}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-500">{t.inventory.name}</p>
            <p className="font-medium text-slate-800 text-lg">{formData.equipmentName}</p>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.date}</label>
             <input 
               type="date" 
               value={formData.date} 
               onChange={(e) => setFormData({...formData, date: e.target.value})}
               className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
             />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.user}</label>
             <input 
               type="text" 
               value={formData.performedBy}
               onChange={(e) => setFormData({...formData, performedBy: e.target.value})}
               className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
             />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.notes}</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded border border-slate-200"
            >
              {t.common.cancel}
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {t.common.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsModal: React.FC<{ onClose: () => void, onSave: () => void }> = ({ onClose, onSave }) => {
    const { t } = useLanguage();
    const [days, setDays] = useState(getAppSettings().photoRetentionDays);
    const [cleanedCount, setCleanedCount] = useState<number | null>(null);

    const handleSave = async () => {
        saveAppSettings({ photoRetentionDays: days });
        // Fix: Await cleanupOldPhotos
        const count = await cleanupOldPhotos();
        if (count > 0) {
            setCleanedCount(count);
            // Delay closing to show success msg
            setTimeout(() => {
                onSave();
                onClose();
            }, 1500);
        } else {
            onSave();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">{t.history.settings}</h3>
                    <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" size={20}/></button>
                </div>
                
                <div className="mb-6">
                    <label className="block font-medium text-slate-700 mb-2">{t.history.retentionPolicy}</label>
                    <p className="text-xs text-slate-500 mb-3">{t.history.retentionDesc}</p>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            min="0"
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            className="w-24 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="text-slate-600">{t.history.days}</span>
                    </div>
                </div>

                {cleanedCount !== null && (
                    <div className="bg-green-50 text-green-700 p-2 rounded text-sm mb-4 flex items-center gap-2">
                        <Check size={16} />
                        {cleanedCount} {t.history.photosCleaned}
                    </div>
                )}

                <button onClick={handleSave} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                    {t.common.save}
                </button>
            </div>
        </div>
    );
}

const PhotoGalleryModal: React.FC<{ photos: PhotoAttachment[], onClose: () => void }> = ({ photos, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Photos ({photos.length})</h3>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {photos.map(p => (
                        <div key={p.id} className="border p-2 rounded">
                            <img src={p.dataUrl} alt="Evidence" className="w-full h-auto rounded mb-2" />
                            {p.comment && <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">{p.comment}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const HistoryLog: React.FC<HistoryLogProps> = ({ records, equipment, onUpdate }) => {
  const [selectedEqId, setSelectedEqId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState<LubeRecord | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [viewPhotos, setViewPhotos] = useState<PhotoAttachment[] | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Run cleanup on mount just in case
    cleanupOldPhotos();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesEq = selectedEqId === 'all' || record.equipmentId === selectedEqId;
      const matchesSearch = 
        record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesEq && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, selectedEqId, searchTerm]);

  const handleExportHtml = () => {
    if (filteredRecords.length === 0) {
      alert("No records.");
      return;
    }

    let htmlContent = `
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
            th { background-color: #f2f2f2; }
            .photo-cell { max-width: 300px; }
            .photo-container { margin-bottom: 10px; border: 1px solid #eee; padding: 5px; }
            img { max-width: 150px; height: auto; display: block; margin-bottom: 5px; }
            .comment { font-size: 11px; color: #555; }
        </style>
    </head>
    <body>
        <h2>Lubrication History Report - ${new Date().toISOString().split('T')[0]}</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Equipment</th>
                    <th>User</th>
                    <th>Notes</th>
                    <th>Photos</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredRecords.forEach(r => {
        let photosHtml = '';
        if (r.photos && r.photos.length > 0) {
            photosHtml = r.photos.map(p => `
                <div class="photo-container">
                    <img src="${p.dataUrl}" />
                    <div class="comment">${p.comment || ''}</div>
                </div>
            `).join('');
        }

        htmlContent += `
            <tr>
                <td>${r.date}</td>
                <td>${r.equipmentName}</td>
                <td>${r.performedBy}</td>
                <td>${r.notes}</td>
                <td class="photo-cell">${photosHtml}</td>
            </tr>
        `;
    });

    htmlContent += `
            </tbody>
        </table>
    </body>
    </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `History_Report_${new Date().toISOString().split('T')[0]}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveEdit = async (updatedRecord: LubeRecord) => {
    // Fix: Await updateRecord
    await updateRecord(updatedRecord);
    setEditingRecord(null);
    onUpdate(); 
  };

  const handleDelete = async (id: string) => {
    if (confirm(t.history.deleteConfirm)) {
        // Fix: Await deleteRecord
        await deleteRecord(id);
        onUpdate();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.history.title}</h2>
          <p className="text-slate-500">{t.history.subtitle}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                title={t.history.settings}
            >
                <Settings size={18} />
            </button>
            <button 
            onClick={handleExportHtml}
            className="flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
            <Download size={18} />
            {t.common.export}
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={t.common.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-64 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={selectedEqId}
            onChange={(e) => setSelectedEqId(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">{t.history.filterEq}</option>
            {equipment.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline / List View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <HistoryIcon size={48} className="mb-4 opacity-50" />
            <p>{t.history.noRecords}</p>
          </div>
        ) : (
          <div className="p-6">
             {selectedEqId !== 'all' && (
                <div className="mb-6 pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                        {equipment.find(e => e.id === selectedEqId)?.name} 
                        <span className="text-sm font-normal text-slate-500">{t.history.timeline}</span>
                    </h3>
                </div>
             )}

            <div className="space-y-0 relative">
              {/* Vertical line for timeline view when filtered */}
              {selectedEqId !== 'all' && (
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>
              )}

              {filteredRecords.map((record, index) => (
                <div key={record.id} className={`relative flex gap-4 pb-8 last:pb-0 ${selectedEqId !== 'all' ? 'pl-8' : ''}`}>
                  
                  {/* Timeline dot */}
                  {selectedEqId !== 'all' && (
                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-white bg-blue-500 shadow-sm z-10"></div>
                  )}

                  <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100 hover:shadow-md transition-shadow group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{record.equipmentName}</span>
                        {selectedEqId === 'all' && (
                            <span className="text-xs px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500">
                                {record.equipmentId === '1' ? 'A' : record.equipmentId === '2' ? 'P' : 'L'}
                            </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mr-2">
                            <Calendar size={14} />
                            <span>{record.date}</span>
                        </div>
                        <button 
                            onClick={() => setEditingRecord(record)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                            title={t.common.edit}
                        >
                            <Edit2 size={14} />
                        </button>
                        <button 
                            onClick={() => handleDelete(record.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                            title={t.common.delete}
                        >
                            <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="text-slate-600 text-sm flex items-start gap-2">
                        <FileText size={14} className="mt-0.5 shrink-0 text-slate-400" />
                        <span>{record.notes || "-"}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <User size={12} />
                            <span>{t.common.user}: {record.performedBy}</span>
                          </div>

                          {record.photos && record.photos.length > 0 && (
                              <button 
                                onClick={() => setViewPhotos(record.photos!)}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                              >
                                  <ImageIcon size={14} />
                                  {record.photos.length} photos
                              </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {editingRecord && (
        <EditRecordModal 
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={handleSaveEdit}
        />
      )}

      {showSettings && (
          <SettingsModal 
            onClose={() => setShowSettings(false)} 
            onSave={onUpdate} 
          />
      )}

      {viewPhotos && (
          <PhotoGalleryModal 
            photos={viewPhotos} 
            onClose={() => setViewPhotos(null)} 
          />
      )}
    </div>
  );
};

export default HistoryLog;
