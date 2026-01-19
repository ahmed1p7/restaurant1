
import React, { useState, useMemo } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import type { Dish, ScreenSettings } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2, Settings2, Monitor } from 'lucide-react';

const MenuManagement: React.FC = () => {
  const { dishes, addDish, updateDish, deleteDish, screenSettings, updateScreenSettings } = useRestaurantData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoutingModalOpen, setIsRoutingModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | undefined>();

  const categories = useMemo(() => [...new Set(dishes.map(d => d.category))], [dishes]);

  const toggleCategoryRouting = (screen: 'kitchen' | 'bar', cat: string) => {
    const key = screen === 'kitchen' ? 'kitchenCategories' : 'barCategories';
    const current = screenSettings[key];
    const updated = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
    updateScreenSettings({ ...screenSettings, [key]: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المنيو</h1>
        <div className="flex gap-2">
          <Button variant="secondary" Icon={Settings2} onClick={() => setIsRoutingModalOpen(true)}>توجيه الشاشات</Button>
          <Button Icon={Plus} onClick={() => { setEditingDish(undefined); setIsModalOpen(true); }}>إضافة طبق</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map(dish => (
          <Card key={dish.id} className="overflow-hidden flex flex-col">
            <img src={dish.imageUrl} className="h-40 w-full object-cover" alt={dish.name} />
            <div className="p-4 flex-grow">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold text-xl">{dish.name}</h3>
                <span className="text-primary font-bold">{dish.price} ر.س</span>
              </div>
              <p className="text-sm opacity-70 mb-4">{dish.description}</p>
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button size="sm" variant="secondary" onClick={() => { setEditingDish(dish); setIsModalOpen(true); }}><Edit size={16} /></Button>
                <Button size="sm" variant="danger" onClick={() => deleteDish(dish.id)}><Trash2 size={16} /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isRoutingModalOpen} onClose={() => setIsRoutingModalOpen(false)} title="إعدادات توجيه الطلبات">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-4 text-kitchen-primary"><Monitor /> المطبخ</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-muted rounded">
                  <input type="checkbox" checked={screenSettings.kitchenCategories.includes(cat)} onChange={() => toggleCategoryRouting('kitchen', cat)} />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-4 text-drinks-primary"><Monitor /> المشروبات</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-muted rounded">
                  <input type="checkbox" checked={screenSettings.barCategories.includes(cat)} onChange={() => toggleCategoryRouting('bar', cat)} />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MenuManagement;
