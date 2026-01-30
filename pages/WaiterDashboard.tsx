
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurantData } from '../hooks/useRestaurantData';
import type { Table, ScreenSettings } from '../types';
import { TableStatus, MenuStyle } from '../types';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { 
    Utensils, Users, CalendarCheck, Settings, Maximize, 
    UserCheck, X, PlusCircle, LayoutGrid, Sliders, Info, ChevronLeft
} from 'lucide-react';
import { uiTranslations } from '../translations';

const TableItem: React.FC<{ table: Table }> = ({ table }) => {
    const navigate = useNavigate();
    const { getActiveOrderByTable, releaseTable } = useRestaurantData();
    const lang = (localStorage.getItem('lang') as any) || 'ar';
    const t = uiTranslations[lang as keyof typeof uiTranslations];
    
    const activeOrder = getActiveOrderByTable(table.id);
    const status = table.status;

    const statusStyles = {
        [TableStatus.AVAILABLE]: "bg-white border-neutral hover:border-green-500/50",
        [TableStatus.OCCUPIED]: "bg-primary/5 border-primary/30",
        [TableStatus.RESERVED]: "bg-accent/5 border-accent/30",
    };

    const badgeStyles = {
        [TableStatus.AVAILABLE]: "bg-green-500",
        [TableStatus.OCCUPIED]: "bg-primary",
        [TableStatus.RESERVED]: "bg-accent",
    };

    return (
        <div 
            onClick={() => navigate(`/waiter/order/${table.id}`)}
            className={`group relative cursor-pointer border-2 p-6 rounded-[2.5rem] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${statusStyles[status]}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">{t.table}</p>
                    <h3 className="text-4xl font-black text-primary-dark dark:text-white">{table.id}</h3>
                </div>
                <div className={`w-3 h-3 rounded-full ${badgeStyles[status]} shadow-lg shadow-current/50 animate-pulse`} />
            </div>

            <div className="space-y-3">
                {status === TableStatus.RESERVED ? (
                    <div className="py-2">
                        <p className="text-[10px] font-black opacity-40 mb-1">{t.reservedFor}</p>
                        <p className="text-lg font-black text-primary-dark dark:text-white truncate">{table.reservationName}</p>
                    </div>
                ) : status === TableStatus.OCCUPIED ? (
                    <div className="flex items-center gap-3 py-2">
                        <Users size={18} className="text-primary opacity-60" />
                        <span className="text-lg font-black text-primary-dark dark:text-white">{activeOrder?.guestCount || '...'} {t.guestCount}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 py-2 opacity-30">
                        <Info size={14} />
                        <span className="text-xs font-bold dark:text-gray-400">{t.capacity} {table.capacity}</span>
                    </div>
                )}
            </div>

            {status === TableStatus.RESERVED && (
                <button 
                    onClick={(e) => { e.stopPropagation(); releaseTable(table.id); }}
                    className={`absolute -top-3 ${lang === 'ar' ? '-left-3' : '-right-3'} w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-danger hover:bg-danger hover:text-white transition-all border border-neutral/50`}
                >
                    <X size={18}/>
                </button>
            )}
        </div>
    );
};

const WaiterDashboard: React.FC = () => {
  const { tables, reserveTable, screenSettings, updateScreenSettings } = useRestaurantData();
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [resData, setResData] = useState({ tableId: '', name: '' });
  const lang = (localStorage.getItem('lang') as any) || 'ar';
  const t = uiTranslations[lang as keyof typeof uiTranslations];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] shadow-sm border border-neutral/50 dark:border-dark-border flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary-dark dark:text-white flex items-center gap-3">
            <LayoutGrid className="text-accent" size={32} /> {t.yakootHall}
          </h1>
          <p className="text-neutral-dark/40 dark:text-gray-400 font-bold mt-1">{t.liveOrderManagement}</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="w-14 h-14 bg-muted dark:bg-gray-800 text-primary-dark dark:text-white rounded-2xl flex items-center justify-center hover:bg-neutral dark:hover:bg-gray-700 transition-all border border-neutral dark:border-gray-600 shadow-sm"
                title={t.settings}
            >
                <Settings size={24} />
            </button>
            <button 
                onClick={() => setIsReserveModalOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-black shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
            >
                <CalendarCheck size={22} /> {t.newReservation}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.sort((a,b) => a.id - b.id).map(table => (
          <TableItem key={table.id} table={table} />
        ))}
      </div>

      <Modal isOpen={isReserveModalOpen} onClose={() => setIsReserveModalOpen(false)} title={t.newReservation}>
          <div className="space-y-6 py-2">
              <div className="space-y-2 text-right">
                <label className="text-xs font-black opacity-40 px-2 uppercase dark:text-gray-400">{t.selectAvailableTable}</label>
                <select 
                    className="w-full p-4 bg-muted dark:bg-gray-800 border-2 border-neutral dark:border-gray-700 rounded-2xl font-black text-lg outline-none focus:border-accent appearance-none transition-all dark:text-white"
                    value={resData.tableId}
                    onChange={(e) => setResData({...resData, tableId: e.target.value})}
                >
                    <option value="">-- {t.search} --</option>
                    {tables.filter(t => t.status === TableStatus.AVAILABLE).map(t => (
                        <option key={t.id} value={t.id}>{t.table} {t.id} ({t.capacity}: {t.capacity})</option>
                    ))}
                </select>
              </div>
              <div className="space-y-2 text-right">
                <label className="text-xs font-black opacity-40 px-2 uppercase dark:text-gray-400">{t.clientName}</label>
                <input 
                    type="text" 
                    placeholder={t.clientName} 
                    className="w-full p-4 bg-muted dark:bg-gray-800 border-2 border-neutral dark:border-gray-700 rounded-2xl font-black text-lg outline-none focus:border-accent transition-all dark:text-white"
                    value={resData.name}
                    onChange={(e) => setResData({...resData, name: e.target.value})}
                />
              </div>
              <Button 
                className="w-full py-5 text-xl font-black rounded-2xl mt-4" 
                onClick={() => { reserveTable(Number(resData.tableId), resData.name); setIsReserveModalOpen(false); setResData({tableId:'', name:''}); }}
                disabled={!resData.tableId || !resData.name}
              >
                  {t.confirmReservation}
              </Button>
          </div>
      </Modal>

      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title={t.settings}>
          <div className="space-y-10 py-4">
              <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black flex items-center gap-2 text-primary-dark dark:text-white"><Maximize size={20} className="text-accent" /> {t.menuScale}</h3>
                    <span className="bg-primary text-white px-3 py-1 rounded-full font-black text-xs">{(screenSettings.menuScale * 100).toFixed(0)}%</span>
                  </div>
                  <div className="p-6 bg-muted dark:bg-gray-800 rounded-[2rem] border border-neutral dark:border-gray-700">
                      <input 
                        type="range" 
                        min="0.7" 
                        max="1.3" 
                        step="0.05" 
                        className="w-full h-3 bg-white dark:bg-gray-900 rounded-full appearance-none cursor-pointer accent-accent"
                        value={screenSettings.menuScale}
                        onChange={(e) => updateScreenSettings({...screenSettings, menuScale: parseFloat(e.target.value)})}
                      />
                      <div className="flex justify-between mt-4 text-[10px] font-black opacity-30 dark:text-gray-500 uppercase tracking-[0.2em]">
                          <span>{t.small}</span>
                          <span>{t.default} (100%)</span>
                          <span>{t.large}</span>
                      </div>
                  </div>
              </section>

              <section className="space-y-4">
                  <h3 className="font-black flex items-center gap-2 text-primary-dark dark:text-white"><LayoutGrid size={20} className="text-accent" /> {t.displayStyle}</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => updateScreenSettings({...screenSettings, menuStyle: MenuStyle.BOOKLET})}
                        className={`p-6 rounded-2xl border-2 font-black transition-all flex flex-col items-center gap-2 ${screenSettings.menuStyle === MenuStyle.BOOKLET ? 'bg-primary text-white border-primary shadow-xl scale-105' : 'bg-white dark:bg-gray-800 border-neutral dark:border-gray-700 text-neutral-dark/40 dark:text-gray-500 opacity-70'}`}
                      >
                        <Utensils size={24} /> {t.booklet}
                      </button>
                      <button 
                        onClick={() => updateScreenSettings({...screenSettings, menuStyle: MenuStyle.GRID})}
                        className={`p-6 rounded-2xl border-2 font-black transition-all flex flex-col items-center gap-2 ${screenSettings.menuStyle === MenuStyle.GRID ? 'bg-primary text-white border-primary shadow-xl scale-105' : 'bg-white dark:bg-gray-800 border-neutral dark:border-gray-700 text-neutral-dark/40 dark:text-gray-500 opacity-70'}`}
                      >
                        <LayoutGrid size={24} /> {t.grid}
                      </button>
                  </div>
              </section>
              
              <Button className="w-full py-4 rounded-2xl" variant="secondary" onClick={() => setIsSettingsModalOpen(false)}>{t.save}</Button>
          </div>
      </Modal>
    </div>
  );
};

export default WaiterDashboard;
