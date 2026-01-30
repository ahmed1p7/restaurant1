
import React, { useState, useMemo } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { MenuStyle, type Dish, type MenuPage, type LocalizedString } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2, Settings2, Monitor, Layout, Book, Palette, Hash, Globe } from 'lucide-react';
import { uiTranslations } from '../translations';

const MenuManagement: React.FC = () => {
  const { 
    dishes, addDish, updateDish, deleteDish, 
    pages, addPage, updatePage, deletePage,
    screenSettings, updateScreenSettings 
  } = useRestaurantData();

  // جلب لغة الواجهة الحالية
  const lang = (localStorage.getItem('lang') as any) || 'ar';
  const t = uiTranslations[lang as keyof typeof uiTranslations];

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const [editingDish, setEditingDish] = useState<Dish | undefined>();
  const [editingPage, setEditingPage] = useState<MenuPage | undefined>();

  const [activeTab, setActiveTab] = useState<'dishes' | 'pages'>('dishes');

  // وظيفة التحقق من اكتمال الترجمات
  const validateTranslations = (obj: LocalizedString) => {
    return obj.ar.trim() !== '' && obj.en.trim() !== '' && obj.it.trim() !== '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary-dark dark:text-white">{t.menu}</h1>
          <p className="text-neutral-dark dark:text-gray-400 opacity-60 font-medium italic">إدارة المحتوى المترجم يدوياً (AR / EN / IT)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" Icon={Settings2} onClick={() => setIsSettingsModalOpen(true)}>{t.settings}</Button>
          <Button Icon={Plus} onClick={() => { 
            if (activeTab === 'dishes') setIsDishModalOpen(true);
            else setIsPageModalOpen(true);
            setEditingDish(undefined);
            setEditingPage(undefined);
          }}>
            {activeTab === 'dishes' ? t.addDish : t.addPage}
          </Button>
        </div>
      </div>

      <div className="flex border-b border-neutral dark:border-gray-800">
        <button 
            onClick={() => setActiveTab('dishes')}
            className={`px-6 py-3 font-bold transition-all border-b-4 ${activeTab === 'dishes' ? 'border-accent text-primary dark:text-accent' : 'border-transparent text-neutral-dark/40'}`}
        >
            الأطباق
        </button>
        <button 
            onClick={() => setActiveTab('pages')}
            className={`px-6 py-3 font-bold transition-all border-b-4 ${activeTab === 'pages' ? 'border-accent text-primary dark:text-accent' : 'border-transparent text-neutral-dark/40'}`}
        >
            الصفحات
        </button>
      </div>

      {activeTab === 'dishes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dishes.map(dish => (
            <Card key={dish.id} className="overflow-hidden flex flex-col group border-2 border-transparent hover:border-accent transition-all dark:bg-dark-card">
                <div className="relative h-40">
                    <img src={dish.imageUrl} className="w-full h-full object-cover" alt={dish.name.ar} />
                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded font-bold text-sm text-primary dark:text-accent shadow-sm">
                        {dish.price} ر.س
                    </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-black text-lg text-primary-dark dark:text-white leading-tight">{dish.name[lang as keyof LocalizedString]}</h3>
                        <Globe size={14} className="text-accent opacity-50" />
                    </div>
                    <p className="text-xs text-accent font-bold mb-2">
                        {pages.find(p => p.id === dish.pageId)?.title[lang as keyof LocalizedString] || '...'}
                    </p>
                    <p className="text-[10px] opacity-60 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed italic">{dish.description[lang as keyof LocalizedString]}</p>
                    <div className="flex justify-end gap-2 mt-auto pt-4 border-t dark:border-gray-800">
                        <button onClick={() => { setEditingDish(dish); setIsDishModalOpen(true); }} className="p-2 hover:bg-muted dark:hover:bg-gray-800 rounded-lg text-primary dark:text-accent"><Edit size={16} /></button>
                        <button onClick={() => deleteDish(dish.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-danger"><Trash2 size={16} /></button>
                    </div>
                </div>
            </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pages.sort((a,b) => a.order - b.order).map(page => (
                <Card key={page.id} className="p-6 border-r-8 dark:bg-dark-card" style={{ borderRightColor: page.backgroundColor }}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Hash size={14} className="text-neutral-dark/40" />
                                <span className="text-sm font-bold opacity-40 uppercase">Order {page.order}</span>
                            </div>
                            <h3 className="text-xl font-black text-primary-dark dark:text-white">{page.title[lang as keyof LocalizedString]}</h3>
                        </div>
                        <Palette size={20} style={{ color: page.backgroundColor }} />
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t dark:border-gray-800">
                        <Button size="sm" variant="secondary" onClick={() => { setEditingPage(page); setIsPageModalOpen(true); }}><Edit size={14} /></Button>
                        <Button size="sm" variant="danger" onClick={() => deletePage(page.id)}><Trash2 size={14} /></Button>
                    </div>
                </Card>
            ))}
        </div>
      )}

      {/* نموذج الطبق المطور ليدعم اللغات الثلاث */}
      <Modal isOpen={isDishModalOpen} onClose={() => setIsDishModalOpen(false)} title={editingDish ? 'تعديل طبق' : 'إضافة طبق جديد'}>
          <div className="space-y-6 py-4">
              <section className="space-y-3 bg-muted dark:bg-gray-800/50 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-black opacity-40 uppercase flex items-center gap-2"><Globe size={12}/> أسماء الطبق (إجباري)</h4>
                  <input type="text" placeholder="الاسم بالعربية..." className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl font-bold" defaultValue={editingDish?.name.ar} id="dish-name-ar" />
                  <input type="text" placeholder="Name in English..." className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl font-bold" defaultValue={editingDish?.name.en} id="dish-name-en" dir="ltr" />
                  <input type="text" placeholder="Nome in Italiano..." className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl font-bold" defaultValue={editingDish?.name.it} id="dish-name-it" dir="ltr" />
              </section>

              <section className="space-y-3 bg-muted dark:bg-gray-800/50 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-black opacity-40 uppercase flex items-center gap-2"><Globe size={12}/> وصف الطبق (إجباري)</h4>
                  <textarea placeholder="الوصف بالعربية..." className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl text-sm" defaultValue={editingDish?.description.ar} id="dish-desc-ar" />
                  <textarea placeholder="Description in English..." className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl text-sm" defaultValue={editingDish?.description.en} id="dish-desc-en" dir="ltr" />
                  <textarea placeholder="Descrizione in Italiano..." className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl text-sm" defaultValue={editingDish?.description.it} id="dish-desc-it" dir="ltr" />
              </section>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-[10px] font-black opacity-40 uppercase px-2">{t.price}</label>
                      <input type="number" step="0.5" className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl font-black" defaultValue={editingDish?.price} id="dish-price" />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-black opacity-40 uppercase px-2">{t.page}</label>
                      <select className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl font-bold" defaultValue={editingDish?.pageId} id="dish-page">
                          <option value="">--</option>
                          {pages.map(p => <option key={p.id} value={p.id}>{p.title.ar}</option>)}
                      </select>
                  </div>
              </div>

              <Button className="w-full py-5 text-xl font-black rounded-2xl shadow-xl" onClick={() => {
                  const name = {
                    ar: (document.getElementById('dish-name-ar') as HTMLInputElement).value,
                    en: (document.getElementById('dish-name-en') as HTMLInputElement).value,
                    it: (document.getElementById('dish-name-it') as HTMLInputElement).value,
                  };
                  const description = {
                    ar: (document.getElementById('dish-desc-ar') as HTMLTextAreaElement).value,
                    en: (document.getElementById('dish-desc-en') as HTMLTextAreaElement).value,
                    it: (document.getElementById('dish-desc-it') as HTMLTextAreaElement).value,
                  };
                  const price = parseFloat((document.getElementById('dish-price') as HTMLInputElement).value);
                  const pageId = (document.getElementById('dish-page') as HTMLSelectElement).value;
                  const selectedPage = pages.find(p => p.id === pageId);

                  if (!validateTranslations(name) || !validateTranslations(description)) {
                    alert('يرجى ملء كافة الترجمات قبل الحفظ (AR / EN / IT)');
                    return;
                  }
                  
                  if (editingDish) updateDish({...editingDish, name, description, price, pageId, category: selectedPage?.category || ''});
                  else addDish({name, description, price, pageId, category: selectedPage?.category || ''});
                  setIsDishModalOpen(false);
              }}>حفظ الطبق</Button>
          </div>
      </Modal>

      {/* نموذج الصفحة المطور */}
      <Modal isOpen={isPageModalOpen} onClose={() => setIsPageModalOpen(false)} title={editingPage ? 'تعديل صفحة' : 'إضافة صفحة جديدة'}>
          <div className="space-y-6 py-4">
              <section className="space-y-3 bg-muted dark:bg-gray-800/50 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-black opacity-40 uppercase">عناوين الصفحة</h4>
                  <input type="text" placeholder="العنوان بالعربية..." className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl font-bold" defaultValue={editingPage?.title.ar} id="page-title-ar" />
                  <input type="text" placeholder="Title in English..." className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl font-bold" defaultValue={editingPage?.title.en} id="page-title-en" dir="ltr" />
                  <input type="text" placeholder="Titolo in Italiano..." className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl font-bold" defaultValue={editingPage?.title.it} id="page-title-it" dir="ltr" />
              </section>

              <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-4 items-center bg-muted dark:bg-gray-800 p-3 rounded-xl">
                      <label className="text-[10px] font-black opacity-40 uppercase">اللون:</label>
                      <input type="color" className="w-10 h-10 rounded cursor-pointer border-none" defaultValue={editingPage?.backgroundColor || '#FDF5E6'} id="page-color" />
                  </div>
                  <input type="number" placeholder="الترتيب" className="w-full p-3 border-2 border-neutral dark:bg-gray-900 dark:border-gray-700 rounded-xl font-black" defaultValue={editingPage?.order || pages.length + 1} id="page-order" />
              </div>

              <Button className="w-full py-5 text-xl font-black rounded-2xl shadow-xl" onClick={() => {
                  const title = {
                    ar: (document.getElementById('page-title-ar') as HTMLInputElement).value,
                    en: (document.getElementById('page-title-en') as HTMLInputElement).value,
                    it: (document.getElementById('page-title-it') as HTMLInputElement).value,
                  };
                  const backgroundColor = (document.getElementById('page-color') as HTMLInputElement).value;
                  const order = parseInt((document.getElementById('page-order') as HTMLInputElement).value);

                  if (!validateTranslations(title)) {
                    alert('يرجى ملء كافة ترجمات العناوين');
                    return;
                  }

                  if (editingPage) updatePage({...editingPage, title, backgroundColor, order});
                  else addPage({title, backgroundColor, order, category: title.ar});
                  setIsPageModalOpen(false);
              }}>حفظ الصفحة</Button>
          </div>
      </Modal>
    </div>
  );
};

export default MenuManagement;
