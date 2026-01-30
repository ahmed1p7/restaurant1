
import React, { useMemo, useEffect, useState } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { useAuth } from '../hooks/useAuth';
import { OrderStatus, type OrderItem, type Dish, type LocalizedString } from '../types';
import { 
    ChefHat, Coffee, AlertTriangle, 
    CheckCircle2, Timer, Info, Undo2, Ban, User, Hash,
    Clock, ChevronLeft
} from 'lucide-react';
import Modal from '../components/Modal';

const OrderTimer: React.FC<{ timestamp: Date }> = ({ timestamp }) => {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [timestamp]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isLate = elapsed > 600; // 10 minutes
    const isCritical = elapsed > 1200; // 20 minutes

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-lg transition-all ${
            isCritical ? 'bg-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]' :
            isLate ? 'bg-orange-500 text-white' :
            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
            <Clock size={16} />
            <span className="tabular-nums">{formatTime(elapsed)}</span>
        </div>
    );
};

const KitchenDashboard: React.FC<{ screenType: 'kitchen' | 'bar' }> = ({ screenType }) => {
  const { orders, markItemsAsReady, updateOrderStatus, toggleStock } = useRestaurantData();
  const { logout } = useAuth();
  const [recipeDish, setRecipeDish] = useState<Dish | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  // Get current language from localStorage for display localization
  const lang = (localStorage.getItem('lang') as any) || 'ar';

  // استخدام التصنيفات الافتراضية بناءً على نوع الشاشة
  const allowedCategories = useMemo(() => 
    screenType === 'kitchen' ? ['الأطباق الرئيسية', 'المقبلات', 'الحلويات'] : ['المشروبات'],
  [screenType]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => o.status === OrderStatus.NEW || o.status === OrderStatus.IN_PROGRESS)
      .map(o => ({
        ...o,
        items: o.items.filter(item => allowedCategories.includes(item.dish.category) && !item.isReady)
      }))
      .filter(o => o.items.length > 0)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [orders, allowedCategories]);

  const handleBump = (orderId: string) => {
      markItemsAsReady(orderId, allowedCategories);
      setHistory(prev => [orderId, ...prev.slice(0, 4)]);
  };

  const stationColor = screenType === 'kitchen' ? 'text-orange-500' : 'text-cyan-400';
  const stationBg = screenType === 'kitchen' ? 'bg-orange-500' : 'bg-cyan-500';

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden font-sans select-none" dir="rtl">
      {/* Header Bar - Simplified */}
      <header className="px-6 py-3 flex justify-between items-center bg-[#111] border-b border-white/5 shadow-2xl z-50">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stationBg} shadow-xl shadow-current/10`}>
                {screenType === 'kitchen' ? <ChefHat size={28} className="text-white" /> : <Coffee size={28} className="text-white" />}
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                    {screenType === 'kitchen' ? 'مطبخ ياقوت' : 'بار ياقوت'} 
                    <span className={`text-[10px] not-italic font-black px-2 py-0.5 rounded-lg bg-white/5 ${stationColor}`}>STATION</span>
                </h1>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Active Orders: {filteredOrders.length}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            {history.length > 0 && (
                <button onClick={() => updateOrderStatus(history[0], OrderStatus.IN_PROGRESS)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group">
                    <Undo2 size={20} className="text-white/40 group-hover:text-white" />
                </button>
            )}
            <button onClick={logout} className="px-5 py-2.5 bg-red-600/10 text-red-500 rounded-xl font-black text-sm hover:bg-red-600 hover:text-white transition-all border border-red-600/20">
              خروج
            </button>
        </div>
      </header>

      {/* Main Grid - Masonry style layout using items-start to prevent stretching */}
      <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto items-start scrollbar-hide">
        {filteredOrders.map((order) => (
          <div key={order.id} className="flex flex-col animate-in zoom-in-95 duration-200">
            <div className="bg-[#1a1a1a] rounded-[2rem] shadow-2xl flex flex-col border border-white/10 overflow-hidden relative h-fit">
              
              {/* Ticket Header - Compact */}
              <div className={`p-4 flex justify-between items-center ${order.status === OrderStatus.NEW ? 'bg-orange-600' : 'bg-[#222]'} transition-colors`}>
                <div className="flex items-center gap-3">
                    <div className="bg-black/20 w-12 h-12 rounded-xl flex flex-col items-center justify-center border border-white/10">
                        <span className="text-[8px] font-black opacity-60 leading-none">طاولة</span>
                        <span className="text-2xl font-black leading-none">{order.tableId}</span>
                    </div>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-white/80 font-black text-[11px] uppercase">
                            <User size={12} /> {order.waiterName}
                        </div>
                        <div className="text-white/30 font-bold text-[9px]">
                            <Hash size={10} className="inline mr-1" />{order.id.split('-')[1].slice(-4)}
                        </div>
                    </div>
                </div>
                <OrderTimer timestamp={order.timestamp} />
              </div>

              {/* Items List - Compact */}
              <div className="p-4 space-y-3 overflow-hidden">
                {order.items.map((item, idx) => (
                  <div key={idx} className={`group relative p-3.5 rounded-2xl transition-all border-2 ${
                      item.isAllergy ? 'bg-red-950/40 border-red-500' : 'bg-white/5 border-transparent hover:border-white/5'
                  }`}>
                      <div className="flex items-start gap-4">
                        {/* Compact Quantity Badge */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg ${
                            item.isAllergy ? 'bg-red-600 text-white' : 'bg-accent text-primary-dark'
                        }`}>
                            {item.quantity}
                        </div>

                        <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-black leading-tight text-white group-hover:text-accent transition-colors truncate">
                                    {/* Fix: Access the localized dish name using current language */}
                                    {item.dish.name[lang as keyof LocalizedString]}
                                </h3>
                                <button onClick={() => setRecipeDish(item.dish)} className="opacity-10 hover:opacity-100 transition-opacity">
                                    <Info size={14}/>
                                </button>
                            </div>

                            {/* Highlighter Notes - Very Prominent */}
                            {item.notes && (
                                <div className={`mt-2 p-3 rounded-xl border-r-4 ${
                                    item.isAllergy 
                                    ? 'bg-red-600 text-white border-red-900 animate-pulse' 
                                    : 'bg-[#facc15] text-black border-yellow-700'
                                } shadow-lg`}>
                                    <div className="flex items-center gap-1.5 mb-1 opacity-60 text-[8px] font-black uppercase">
                                        <AlertTriangle size={10} /> ملاحظة هامة
                                    </div>
                                    <p className="text-sm font-black leading-tight">{item.notes}</p>
                                </div>
                            )}
                        </div>
                      </div>
                      
                      {/* Out of Stock Quick Action */}
                      <button 
                        onClick={() => toggleStock(item.dish.id)}
                        className="absolute -bottom-1 -left-1 p-1.5 bg-red-500/10 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-500/20"
                      >
                        <Ban size={12} />
                      </button>
                  </div>
                ))}
              </div>

              {/* Action Button - Large and Fixed to Ticket Bottom */}
              <div className="p-4 bg-black/20 border-t border-white/5">
                <button 
                  className={`w-full py-4 rounded-2xl text-xl font-black transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${
                      order.status === OrderStatus.NEW 
                      ? 'bg-white text-black hover:bg-neutral-200' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                  onClick={() => handleBump(order.id)}
                >
                  <CheckCircle2 size={24} /> تم التحضير
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Modal */}
      <Modal isOpen={!!recipeDish} onClose={() => setRecipeDish(null)} title="وصفة الطبق">
          {recipeDish && (
              <div className="space-y-6">
                  <div className="relative h-56 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                      <img src={recipeDish.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-3">
                      {/* Fix: Localized dish name in recipe modal */}
                      <h3 className="text-2xl font-black text-primary-dark">{recipeDish.name[lang as keyof LocalizedString]}</h3>
                      <div className="p-6 bg-muted rounded-2xl border border-neutral/50 italic text-lg text-primary-dark/80 leading-relaxed">
                          {/* Fix: Localized dish description in recipe modal */}
                          {recipeDish.description[lang as keyof LocalizedString]}
                      </div>
                  </div>
              </div>
          )}
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default KitchenDashboard;
