
import React, { useState, useMemo } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import type { Dish, ScreenSettings } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2, DollarSign, Tag, Search, Monitor, Settings2 } from 'lucide-react';

const DishForm: React.FC<{ dish?: Dish; onSave: (dish: any) => void; onCancel: () => void }> = ({ dish, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: dish?.name || '',
    description: dish?.description || '',
    price: dish?.price || 0,
    category: dish?.category || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...dish, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-dark">اسم الطبق</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-neutral rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-dark">الوصف</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full border border-neutral rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-neutral-dark">السعر (ر.س)</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-neutral-dark opacity-60" />
            </div>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="pr-10 mt-1 block w-full border border-neutral rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-dark">التصنيف</label>
          <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border border-neutral rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
      </div>
      <div className="flex justify-end pt-4 space-x-reverse space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>إلغاء</Button>
        <Button type="submit">{dish ? 'حفظ التغييرات' : 'إضافة الطبق'}</Button>
      </div>
    </form>
  );
};

const ScreenRoutingModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  categories: string[]; 
  settings: ScreenSettings;
  onSave: (settings: ScreenSettings) => void;
}> = ({ isOpen, onClose, categories, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<ScreenSettings>(settings);

  const toggleCategory = (screen: 'kitchen' | 'bar', category: string) => {
    const key = screen === 'kitchen' ? 'kitchenCategories' : 'barCategories';
    const current = localSettings[key];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    
    setLocalSettings({ ...localSettings, [key]: updated });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="توزيع التصنيفات على الشاشات">
      <div className="space-y-6">
        <p className="text-sm text-neutral-dark opacity-70">اختر أين يظهر كل تصنيف عند طلب طبق منه.</p>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <Monitor size={18} /> شاشة المطبخ
            </h3>
            <div className="space-y-2 bg-muted p-3 rounded-lg max-h-60 overflow-y-auto">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-neutral/30 p-1 rounded">
                  <input 
                    type="checkbox" 
                    checked={localSettings.kitchenCategories.includes(cat)}
                    onChange={() => toggleCategory('kitchen', cat)}
                    className="w-4 h-4 text-primary rounded border-neutral"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-drinks-primary flex items-center gap-2">
              <Monitor size={18} /> شاشة المشروبات
            </h3>
            <div className="space-y-2 bg-muted p-3 rounded-lg max-h-60 overflow-y-auto">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer hover:bg-neutral/30 p-1 rounded">
                  <input 
                    type="checkbox" 
                    checked={localSettings.barCategories.includes(cat)}
                    onChange={() => toggleCategory('bar', cat)}
                    className="w-4 h-4 text-drinks-primary rounded border-neutral"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-reverse space-x-2 border-t">
          <Button variant="secondary" onClick={onClose}>إلغاء</Button>
          <Button onClick={() => { onSave(localSettings); onClose(); }}>حفظ التغييرات</Button>
        </div>
      </div>
    </Modal>
  );
};

const MenuManagement: React.FC = () => {
  const { dishes, addDish, updateDish, deleteDish, screenSettings, updateScreenSettings } = useRestaurantData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoutingModalOpen, setIsRoutingModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (dish?: Dish) => {
    setEditingDish(dish);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDish(undefined);
  };

  const handleSaveDish = (dishData: Dish) => {
    if (dishData.id) {
      updateDish(dishData);
    } else {
      addDish(dishData);
    }
    handleCloseModal();
  };

  const categories = useMemo(() => [...new Set(dishes.map(d => d.category))], [dishes]);

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dishes, searchTerm]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark">إدارة المنيو</h1>
          <p className="mt-1 text-neutral-dark opacity-75">إدارة قائمة الطعام والأسعار والتصنيفات.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="secondary" onClick={() => setIsRoutingModalOpen(true)} Icon={Settings2}>إعدادات الشاشات</Button>
          <Button onClick={() => handleOpenModal()} Icon={Plus}>إضافة طبق جديد</Button>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-dark opacity-50" />
        </div>
        <input
            type="text"
            placeholder="ابحث عن طبق أو تصنيف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pr-10 pl-3 py-2 border border-neutral rounded-md leading-5 bg-white placeholder-neutral-dark placeholder-opacity-60 focus:outline-none focus:placeholder-opacity-40 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map(dish => (
          <Card key={dish.id} className="flex flex-col overflow-hidden">
            <img src={dish.imageUrl} alt={dish.name} className="w-full h-48 object-cover transition-transform hover:scale-105 duration-500" />
            <div className="p-4 flex flex-col flex-grow bg-white">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-neutral-dark">{dish.name}</h3>
                <p className="text-lg font-bold text-primary">{dish.price.toFixed(2)} ر.س</p>
              </div>
              <p className="text-sm text-neutral-dark opacity-80 mt-1 mb-2"><Tag className="inline h-4 w-4 ml-1 text-accent"/>{dish.category}</p>
              <p className="text-neutral-dark opacity-90 text-sm flex-grow line-clamp-2">{dish.description}</p>
              <div className="mt-4 pt-4 border-t border-neutral flex justify-end space-x-reverse space-x-2">
                <Button variant="secondary" onClick={() => handleOpenModal(dish)} Icon={Edit} size="sm">تعديل</Button>
                <Button variant="danger" onClick={() => deleteDish(dish.id)} Icon={Trash2} size="sm">حذف</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingDish ? 'تعديل الطبق' : 'إضافة طبق جديد'}>
        <DishForm dish={editingDish} onSave={handleSaveDish} onCancel={handleCloseModal} />
      </Modal>

      <ScreenRoutingModal 
        isOpen={isRoutingModalOpen} 
        onClose={() => setIsRoutingModalOpen(false)} 
        categories={categories}
        settings={screenSettings}
        onSave={updateScreenSettings}
      />
    </div>
  );
};

export default MenuManagement;
