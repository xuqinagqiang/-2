
import React, { useMemo, useState } from 'react';
import { Equipment, PhotoAttachment } from '../types';
import { getStatus, saveEquipment, saveRecord, calculateNextDate, compressImage } from '../services/storageService';
import { Download, CheckSquare, Calendar, AlertCircle, X, Save, User, Camera, Trash2, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DailyScheduleProps {
  equipment: Equipment[];
  onUpdate: () => void;
}

interface CompletionModalProps {
  equipment: Equipment;
  onClose: () => void;
  onConfirm: (performDate: string, nextDate: string, notes: string, performer: string, photos: PhotoAttachment[]) => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ equipment, onClose, onConfirm }) => {
  const today = new Date().toISOString().split('T')[0];
  const [performDate, setPerformDate] = useState(today);
  const [nextDate, setNextDate] = useState(calculateNextDate(today, equipment.cycleDays));
  const [notes, setNotes] = useState('');
  const [performer, setPerformer] = useState('');
  const [photos, setPhotos] = useState<PhotoAttachment[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const { t } = useLanguage();

  // Auto-calculate next date when perform date changes
  const handlePerformDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setPerformDate(newDate);
    setNextDate(calculateNextDate(newDate, equipment.cycleDays));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsCompressing(true);
      const newPhotos: PhotoAttachment[] = [];
      try {
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];
          const compressedDataUrl = await compressImage(file);
          newPhotos.push({
            id: crypto.randomUUID(),
            dataUrl: compressedDataUrl,
            comment: '',
            createdAt: new Date().toISOString()
          });
        }
        setPhotos(prev => [...prev, ...newPhotos]);
      } catch (error) {
        console.error("Compression failed", error);
        alert("Image upload failed");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const updatePhotoComment = (id: string, comment: string) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, comment } : p));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{t.schedule.modalTitle}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-500">{t.inventory.name}</p>
            <p className="font-medium text-slate-800 text-lg">{equipment.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.schedule.actualDate}</label>
                <input 
                  type="date" 
                  value={performDate} 
                  onChange={handlePerformDateChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.schedule.performer}</label>
                <div className="relative">
                  <User size={16} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    value={performer}
                    onChange={(e) => setPerformer(e.target.value)}
                    placeholder=""
                    className="w-full border pl-8 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.schedule.nextDate}</label>
            <input 
              type="date" 
              value={nextDate} 
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
            />
            <p className="text-xs text-slate-400 mt-1">{t.schedule.cycleHint.replace('{days}', equipment.cycleDays.toString())}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.common.notes}</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder=""
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
            />
          </div>

          {/* Photos Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t.schedule.addPhoto}</label>
            <div className="space-y-3">
              {photos.map(photo => (
                <div key={photo.id} className="flex gap-3 bg-slate-50 p-2 rounded border border-slate-100">
                  <img src={photo.dataUrl} alt="Evidence" className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder={t.schedule.photoComment}
                      value={photo.comment}
                      onChange={(e) => updatePhotoComment(photo.id, e.target.value)}
                      className="w-full text-sm border p-1 rounded mb-1 outline-none"
                    />
                    <button onClick={() => removePhoto(photo.id)} className="text-xs text-red-500 flex items-center gap-1">
                      <Trash2 size={12} /> {t.common.delete}
                    </button>
                  </div>
                </div>
              ))}

              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isCompressing}
                />
                <button 
                  disabled={isCompressing}
                  className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-500 flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-all"
                >
                   {isCompressing ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
                   {isCompressing ? t.schedule.compressing : t.schedule.addPhoto}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded border border-slate-200"
            >
              {t.common.cancel}
            </button>
            <button 
              onClick={() => onConfirm(performDate, nextDate, notes, performer, photos)}
              disabled={isCompressing}
              className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {t.common.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DailySchedule: React.FC<DailyScheduleProps> = ({ equipment, onUpdate }) => {
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  const { t } = useLanguage();
  const today = new Date().toISOString().split('T')[0];

  const dueItems = useMemo(() => {
    return equipment.filter(eq => eq.nextLubricated <= today).sort((a, b) => a.nextLubricated.localeCompare(b.nextLubricated));
  }, [equipment, today]);

  const handleExport = () => {
    if (dueItems.length === 0) {
      alert("No tasks to export.");
      return;
    }

    const headers = [
      t.schedule.status, 
      t.inventory.name, 
      t.inventory.location, 
      // Fixed: Use t.common.type instead of t.inventory.type
      t.common.type, 
      t.inventory.lubricant, 
      t.inventory.capacity, 
      t.schedule.planDate, 
      t.schedule.actualDate, 
      t.schedule.performer, 
      t.common.notes
    ];

    const csvContent = [
      headers.join(","),
      ...dueItems.map(item => {
        const status = getStatus(item.nextLubricated) === 'OVERDUE' ? 'Overdue' : 'Due';
        return `"${status}","${item.name}","${item.location}","${item.type}","${item.lubricant}","${item.capacity}","${item.nextLubricated}","","",""`;
      })
    ].join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Lube_Tasks_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCompleteConfirm = (performDate: string, nextDate: string, notes: string, performer: string, photos: PhotoAttachment[]) => {
    if (!selectedEq) return;

    const record = {
      id: crypto.randomUUID(),
      equipmentId: selectedEq.id,
      equipmentName: selectedEq.name,
      date: performDate,
      performedBy: performer || 'N/A',
      notes: notes || 'Routine lubrication',
      photos: photos
    };
    saveRecord(record);

    const updatedEq = {
      ...selectedEq,
      lastLubricated: performDate,
      nextLubricated: nextDate
    };
    
    // Update master list
    const newList = equipment.map(item => item.id === selectedEq.id ? updatedEq : item);
    saveEquipment(newList);
    onUpdate();
    setSelectedEq(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.schedule.title}</h2>
          <p className="text-slate-500">{t.schedule.subtitle} ({today})</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Download size={18} />
          {t.schedule.export}
        </button>
      </div>

      {dueItems.length === 0 ? (
        <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center">
          <CheckSquare className="mx-auto text-green-500 mb-3" size={48} />
          <h3 className="text-lg font-medium text-green-800">{t.schedule.allDone}</h3>
          <p className="text-green-600">{t.schedule.noTasks}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 text-sm">{t.schedule.status}</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">{t.schedule.eqInfo}</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm hidden md:table-cell">{t.schedule.location}</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">{t.schedule.req}</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm hidden md:table-cell">{t.schedule.planDate}</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-right">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dueItems.map(item => {
                  const status = getStatus(item.nextLubricated);
                  const isOverdue = status === 'OVERDUE';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          isOverdue ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                          {isOverdue ? t.common.overdue : t.common.due}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500 md:hidden">{item.location}</div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-slate-600">{item.location}</td>
                      <td className="p-4 text-slate-600">
                        <div className="text-sm">{item.lubricant}</div>
                        <div className="text-xs text-slate-400">Cap: {item.capacity}</div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-slate-600 text-sm">{item.nextLubricated}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedEq(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                        >
                          {t.schedule.complete}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedEq && (
        <CompletionModal 
          equipment={selectedEq} 
          onClose={() => setSelectedEq(null)} 
          onConfirm={handleCompleteConfirm} 
        />
      )}
    </div>
  );
};

export default DailySchedule;
