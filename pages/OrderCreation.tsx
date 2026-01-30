
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { useAuth } from '../hooks/useAuth';
import type { OrderItem, Dish, MenuPage, LocalizedString } from '../types';
import { MenuStyle, OrderStatus } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { 
    Plus, ShoppingCart, MessageSquare, 
    ChevronLeft, Users, ChevronRight, X, 
    Clock, Send, Utensils, AlertTriangle, Timer, Ban,
    Globe, Languages
} from 'lucide-react';

// --- المكونات الفرعية ---

const CartItemRow: React.FC<{
    item: OrderItem;
    isDrink: boolean;
    updateCartQuantity: (dish: Dish, delta: number) => void;
    updateCartNotes: (dishId: number, notes: string, isAllergy?: boolean) => void;
}> = ({ item, isDrink, updateCartQuantity, updateCartNotes }) => {
    const lang = (localStorage.getItem('lang') as any) || 'ar';
    return (
        <div className="relative group bg-white dark:bg-dark-card p-5 rounded-2xl border border-neutral dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <h4 className="font-black text-xl text-primary-dark dark:text-white">{item.dish.name[lang as keyof LocalizedString]}</h4>
                <span className="font-black text-accent">{(item.dish.price * item.quantity).toFixed(2)} ر.س</span>
            </div>
            
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-muted dark:bg-gray-800 rounded-xl overflow-hidden border border-neutral dark:border-gray-700">
                        <button onClick={() => updateCartQuantity(item.dish, -1)} className="w-10 h-10 flex items-center justify-center text-danger hover:bg-danger/10 transition-colors">-</button>
                        <span className="w-12 text-center font-black text-lg dark:text-white">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.dish, 1)} className="w-10 h-10 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">+</button>
                    </div>
                    
                    {!isDrink && (
                        <div className="flex-grow relative">
                            <MessageSquare size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-dark/30" />
                            <input 
                                type="text" 
                                placeholder="إضافة ملاحظات..." 
                                className="w-full pr-12 pl-4 py-3 bg-muted dark:bg-gray-800 rounded-xl text-sm font-bold border border-neutral dark:border-gray-700 focus:border-accent outline-none dark:text-white"
                                value={item.notes || ''}
                                onChange={(e) => updateCartNotes(item.dish.id, e.target.value, item.isAllergy)}
                            />
                        </div>
                    )}
                </div>
                
                {!isDrink && (
                    <button 
                        onClick={() => updateCartNotes(item.dish.id, item.notes || '', !item.isAllergy)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all border-2 ${item.isAllergy ? 'bg-red-500 text-white border-red-500' : 'bg-white dark:bg-transparent text-danger border-danger/20 hover:bg-red-50'}`}
                    >
                        <AlertTriangle size={14} /> {item.isAllergy ? 'تحذير حساسية مفعل ⚠️' : 'تحديد كحساسية؟'}
                    </button>
                )}
            </div>
        </div>
    );
};

const CartDetails: React.FC<{
  cartItems: OrderItem[];
  sentItems: OrderItem[];
  updateCartQuantity: (dish: Dish, delta: number) => void;
  updateCartNotes: (dishId: number, notes: string, isAllergy?: boolean) => void;
  handleSendToKitchen: () => void;
  estimatedMinutes?: number;
  barCategories: string[];
}> = ({ cartItems, sentItems, updateCartQuantity, updateCartNotes, handleSendToKitchen, estimatedMinutes, barCategories }) => {
  const cartTotal = cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const sentTotal = sentItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const lang = (localStorage.getItem('lang') as any) || 'ar';

  return (
    <div className="flex flex-col h-full max-h-[75vh] space-y-4">
      <div className="flex-grow overflow-y-auto space-y-6 px-4 py-8 bg-[#fffdfa] dark:bg-dark-bg rounded-[2rem] shadow-inner border-l-[15px] border-primary-dark relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }} />
        
        {cartItems.length > 0 && (
          <section className="relative z-10">
            <h3 className="text-xs font-black text-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                <Send size={14} /> بانتظار الإرسال للمطبخ
            </h3>
            <div className="space-y-4">
              {cartItems.map(item => (
                <CartItemRow 
                    key={item.dish.id} 
                    item={item} 
                    isDrink={barCategories.includes(item.dish.category)}
                    updateCartQuantity={updateCartQuantity}
                    updateCartNotes={updateCartNotes}
                />
              ))}
            </div>
          </section>
        )}

        {sentItems.length > 0 && (
          <section className="opacity-50 relative z-10 border-t-2 border-dashed border-neutral dark:border-gray-800 pt-6">
            <h3 className="text-xs font-black text-primary-dark dark:text-gray-400 opacity-40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={14} /> أصناف قيد التحضير
            </h3>
            <div className="space-y-2">
              {sentItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 text-sm font-bold dark:text-gray-300">
                  <div className="flex items-center gap-2">
                      <span className="bg-primary-dark text-white px-2 py-0.5 rounded text-[10px]">{item.quantity}x</span>
                      <span>{item.dish.name[lang as keyof LocalizedString]}</span>
                  </div>
                  <span className="opacity-60">{(item.dish.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {cartItems.length === 0 && sentItems.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-4 opacity-20 dark:text-white">
              <Utensils size={64} strokeWidth={1} />
              <p className="font-black italic text-xl">لا توجد أصناف في النوتة حالياً...</p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t-2 border-neutral dark:border-gray-800">
        <div className="flex justify-between items-end mb-4">
            <div>
                <p className="text-[10px] font-black opacity-40 uppercase mb-1 dark:text-gray-400">المجموع النهائي</p>
                <h3 className="text-4xl font-black text-primary-dark dark:text-white">{(cartTotal + sentTotal).toFixed(2)} <small className="text-sm font-bold opacity-30">ر.س</small></h3>
            </div>
            {cartItems.length > 0 && estimatedMinutes && (
                <div className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-2xl font-black text-xs">
                    <Timer size={14} /> وقت التحضير المتوقع: ~{estimatedMinutes} دقيقة
                </div>
            )}
        </div>
        <Button 
            className="w-full py-5 text-2xl font-black rounded-3xl shadow-2xl shadow-primary/20 flex gap-4"
            onClick={handleSendToKitchen}
            disabled={cartItems.length === 0}
        >
            <Send size={24} /> إرسال للمطبخ ({cartItems.length})
        </Button>
      </div>
    </div>
  );
};

// --- المكون الرئيسي ---

const OrderCreation: React.FC = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dishes, pages, createOrUpdateOrder, getActiveOrderByTable, screenSettings } = useRestaurantData();
  
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [sentItems, setSentItems] = useState<OrderItem[]>([]);
  const [guestCount, setGuestCount] = useState<number | null>(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickNavOpen, setIsQuickNavOpen] = useState(false);

  // لغة عرض محتوى الطبق للنادل (تختلف عن لغة الواجهة)
  const [contentLang, setContentLang] = useState<'ar' | 'en' | 'it'>((localStorage.getItem('lang') as any) || 'ar');
  const uiLang = (localStorage.getItem('lang') as any) || 'ar';

  const numericTableId = Number(tableId);

  useEffect(() => {
    if (isLoadingExisting) {
      const order = getActiveOrderByTable(numericTableId);
      if (order) {
        setSentItems(order.items);
        setGuestCount(order.guestCount);
        setActiveOrder(order);
      }
      setIsLoadingExisting(false);
    }
  }, [numericTableId, getActiveOrderByTable, isLoadingExisting]);

  const updateCartQuantity = useCallback((dish: Dish, delta: number) => {
    if (dish.isOutOfStock && delta > 0) return;
    setCartItems(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(item => item.dish.id !== dish.id);
        return prev.map(item => item.dish.id === dish.id ? { ...item, quantity: newQty } : item);
      }
      if (delta > 0) return [...prev, { dish, quantity: 1, notes: '', isAllergy: false, isReady: false }];
      return prev;
    });
  }, []);

  const updateCartNotes = useCallback((dishId: number, notes: string, isAllergy?: boolean) => {
    setCartItems(prev => prev.map(item => item.dish.id === dishId ? { ...item, notes, isAllergy } : item));
  }, []);

  const handleSendToKitchen = useCallback(() => {
    if (cartItems.length > 0 && guestCount !== null) {
      createOrUpdateOrder(numericTableId, cartItems, user.id, guestCount);
      setSentItems(prev => [...prev, ...cartItems]);
      setCartItems([]);
      setIsCartOpen(false);
      navigate('/waiter');
    }
  }, [cartItems, guestCount, numericTableId, user.id, createOrUpdateOrder, navigate]);

  const sortedPages = useMemo(() => [...pages].sort((a, b) => a.order - b.order), [pages]);
  const activePage = sortedPages[currentPageIndex];
  const pageDishes = useMemo(() => dishes.filter(d => d.pageId === activePage?.id), [dishes, activePage]);

  if (isLoadingExisting) return null;

  if (guestCount === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/95 p-6 animate-fade-in backdrop-blur-md">
        <Card className="w-full max-w-sm p-12 text-center space-y-10 rounded-[3rem] shadow-2xl border-t-8 border-accent">
          <h2 className="text-4xl font-black text-primary-dark">طاولة {tableId}</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} onClick={() => setGuestCount(num)} className="py-6 bg-muted rounded-2xl font-black text-2xl hover:bg-primary hover:text-white transition-all">
                {num}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/waiter')} className="text-danger font-black hover:underline">إلغاء والعودة</button>
        </Card>
      </div>
    );
  }

  const totalPrice = (cartItems.reduce((s,i) => s + i.dish.price * i.quantity, 0) + sentItems.reduce((s,i) => s + i.dish.price * i.quantity, 0)).toFixed(2);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden">
      {/* Table Header Info */}
      <div className="mb-4 flex justify-between items-center px-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/waiter')} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-dark-card border border-neutral dark:border-gray-700 rounded-xl hover:bg-primary hover:text-white transition-all">
            <ChevronRight size={20}/>
          </button>
          <div>
            <h1 className="text-2xl font-black text-primary-dark dark:text-white tracking-tighter leading-none">طاولة {tableId}</h1>
            <p className="text-[10px] font-black text-accent mt-1 uppercase flex items-center gap-1">
                <Users size={10} /> {guestCount} ضيوف
            </p>
          </div>
        </div>

        {/* زر التبديل السريع للغة المحتوى */}
        <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2 rounded-2xl border border-neutral dark:border-gray-700">
           <Languages size={18} className="text-accent" />
           <div className="flex gap-1">
              {['ar', 'en', 'it'].map(l => (
                  <button 
                    key={l}
                    onClick={() => setContentLang(l as any)}
                    className={`w-8 h-8 rounded-lg font-black text-[10px] uppercase transition-all ${contentLang === l ? 'bg-primary text-white shadow-lg' : 'opacity-40 hover:opacity-100 dark:text-white'}`}
                  >
                    {l}
                  </button>
              ))}
           </div>
        </div>
      </div>
      
      {/* Booklet Content */}
      <div className="flex flex-col flex-grow items-center justify-center animate-fade-in relative transition-all duration-500 origin-center" style={{ transform: `scale(${screenSettings.menuScale})` }}>
        <div className="relative w-full max-w-4xl flex flex-col items-center">
            
            <div 
                className="w-full h-[75vh] bg-[#FDFBF8] dark:bg-dark-card rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] relative border-[14px] border-[#0D2C4A] dark:border-black overflow-hidden flex flex-col z-10 transition-colors duration-500"
            >
                <div className="absolute left-3 top-0 bottom-0 w-1 flex flex-col items-center justify-around py-20 opacity-10 pointer-events-none">
                    {[...Array(15)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-black dark:bg-white" />)}
                </div>

                <div className="flex-grow flex flex-col p-10 lg:p-14 relative z-10">
                    <div className="mb-12 text-center flex flex-col items-center">
                        <h2 className="text-4xl font-black text-[#0D2C4A] dark:text-accent tracking-tight">{activePage?.title[contentLang]}</h2>
                        <button 
                            onClick={() => setIsQuickNavOpen(true)}
                            className="w-24 h-2 bg-[#D4C3A3] rounded-full mt-4 hover:scale-x-110 transition-transform cursor-pointer shadow-sm border-none outline-none"
                        />
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                            {pageDishes.map(dish => {
                                const qtyInCart = cartItems.find(i => i.dish.id === dish.id)?.quantity || 0;
                                return (
                                    <div 
                                        key={dish.id} 
                                        className={`relative group flex gap-6 items-center cursor-pointer transition-all duration-300 ${dish.isOutOfStock ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:-translate-x-1'}`} 
                                        onClick={() => !dish.isOutOfStock && updateCartQuantity(dish, 1)}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className="w-24 h-24 rounded-full overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.1)] border-2 border-white transition-all group-hover:scale-105 group-hover:rotate-3">
                                                <img src={dish.imageUrl} className="w-full h-full object-cover" alt={dish.name[contentLang]} />
                                            </div>
                                            {qtyInCart > 0 && (
                                                <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-md border-2 border-white animate-pop">
                                                    {qtyInCart}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow text-right space-y-1">
                                            <h4 className="font-black text-xl text-[#0D2C4A] dark:text-white leading-tight">{dish.name[contentLang]}</h4>
                                            <p className="text-[10px] text-neutral-dark/40 dark:text-gray-400 font-bold line-clamp-2 leading-relaxed italic">{dish.description[contentLang]}</p>
                                            <div className="flex items-center justify-end">
                                                <span className="font-black text-[#C7A27C] text-lg">{dish.price} <small className="text-[10px]">ر.س</small></span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-auto pt-10 flex flex-col items-center">
                        <div className="relative w-full max-w-[450px] flex flex-col items-center">
                            <svg width="450" height="60" viewBox="0 0 450 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                                <path d="M100 40C60 40 40 20 10 30" stroke="currentColor" className="text-primary-dark dark:text-accent" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
                                <path d="M350 40C390 40 410 20 440 30" stroke="currentColor" className="text-primary-dark dark:text-accent" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
                            </svg>
                            <div className="absolute top-1 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-[#0D2C4A]/5 flex items-center justify-center border border-[#0D2C4A]/10 shadow-inner">
                                    <span className="text-2xl font-black text-[#0D2C4A] dark:text-accent">{currentPageIndex + 1}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))} 
                    disabled={currentPageIndex === 0} 
                    className="absolute right-4 top-[50%] -translate-y-1/2 w-12 h-12 bg-white dark:bg-dark-bg rounded-full flex items-center justify-center shadow-2xl hover:bg-[#C7A27C] hover:text-white disabled:opacity-0 transition-all z-30 border border-neutral/10"
                >
                    <ChevronRight size={28} />
                </button>
                <button 
                    onClick={() => setCurrentPageIndex(prev => Math.min(sortedPages.length - 1, prev + 1))} 
                    disabled={currentPageIndex === sortedPages.length - 1} 
                    className="absolute left-4 top-[50%] -translate-y-1/2 w-12 h-12 bg-white dark:bg-dark-bg rounded-full flex items-center justify-center shadow-2xl hover:bg-[#C7A27C] hover:text-white disabled:opacity-0 transition-all z-30 border border-neutral/10"
                >
                    <ChevronLeft size={28} />
                </button>
            </div>
        </div>

        {/* Floating Cart Button */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-[#0D2C4A] text-white px-10 py-5 rounded-[1.5rem] shadow-[0_25px_50px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border border-[#D4C3A3] group"
            >
                <div className="text-right">
                    <p className="text-[9px] font-black opacity-40 uppercase tracking-widest leading-none mb-1 text-center">عرض السلة</p>
                    <div className="flex items-center gap-4">
                        <p className="text-2xl font-black">{totalPrice} <small className="text-xs font-bold opacity-60">ر.س</small></p>
                        <div className="w-px h-6 bg-white/20" />
                        <ShoppingCart size={24} className="text-[#C7A27C] group-hover:rotate-12 transition-transform" />
                    </div>
                </div>
            </button>
        </div>

        {/* Quick Nav Modal */}
        <Modal isOpen={isQuickNavOpen} onClose={() => setIsQuickNavOpen(false)} title="الانتقال السريع">
            <div className="grid grid-cols-1 gap-3 py-4">
                {sortedPages.map((page, idx) => (
                    <button 
                        key={page.id}
                        onClick={() => { setCurrentPageIndex(idx); setIsQuickNavOpen(false); }}
                        className={`p-5 rounded-2xl border-2 font-black transition-all text-right flex items-center justify-between gap-4 ${currentPageIndex === idx ? 'bg-[#0D2C4A] text-white border-[#C7A27C]' : 'bg-muted dark:bg-gray-800 border-neutral dark:border-gray-700 hover:border-[#D4C3A3] text-primary-dark dark:text-gray-300 opacity-70'}`}
                    >
                        <span className="text-lg">{page.title[contentLang]}</span>
                        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-xs font-black">{idx + 1}</div>
                    </button>
                ))}
            </div>
        </Modal>

        {/* Cart Modal */}
        <Modal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title={`سلة الطلبات - طاولة ${tableId}`}>
            <CartDetails 
                cartItems={cartItems} 
                sentItems={sentItems} 
                updateCartQuantity={updateCartQuantity} 
                updateCartNotes={updateCartNotes} 
                handleSendToKitchen={handleSendToKitchen}
                estimatedMinutes={activeOrder?.estimatedMinutes}
                barCategories={screenSettings.barCategories}
            />
        </Modal>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(13, 44, 74, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(13, 44, 74, 0.2); }
        @keyframes pop {
            0% { transform: scale(0.8); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .animate-pop { animation: pop 0.3s ease-out; }
      `}} />
    </div>
  );
};

export default OrderCreation;
