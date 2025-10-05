import React, { useState, useMemo } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import type { Dish } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2, DollarSign, Tag, FileText, Search } from 'lucide-react';

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
        <label htmlFor="name" className="block text-sm font-medium text-neutral-dark">Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-neutral rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-dark">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full border border-neutral rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-neutral-dark">Price</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-neutral-dark opacity-60" />
            </div>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="pl-10 mt-1 block w-full border border-neutral rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-dark">Category</label>
          <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border border-neutral rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{dish ? 'Save Changes' : 'Add Dish'}</Button>
      </div>
    </form>
  );
};

const MenuManagement: React.FC = () => {
  const { dishes, addDish, updateDish, deleteDish } = useRestaurantData();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dishes, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark">Menu Management</h1>
          <p className="mt-1 text-neutral-dark opacity-75">Manage your restaurant's culinary offerings.</p>
        </div>
        <Button onClick={() => handleOpenModal()} Icon={Plus}>Add New Dish</Button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-dark opacity-50" />
        </div>
        <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-neutral rounded-md leading-5 bg-white placeholder-neutral-dark placeholder-opacity-60 focus:outline-none focus:placeholder-opacity-40 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map(dish => (
          <Card key={dish.id} className="flex flex-col">
            <img src={dish.imageUrl} alt={dish.name} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-neutral-dark">{dish.name}</h3>
                <p className="text-lg font-bold text-primary">${dish.price.toFixed(2)}</p>
              </div>
              <p className="text-sm text-neutral-dark opacity-80 mt-1 mb-2"><Tag className="inline h-4 w-4 mr-1"/>{dish.category}</p>
              <p className="text-neutral-dark opacity-90 text-sm flex-grow">{dish.description}</p>
              <div className="mt-4 pt-4 border-t border-neutral flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => handleOpenModal(dish)} Icon={Edit} size="sm">Edit</Button>
                <Button variant="danger" onClick={() => deleteDish(dish.id)} Icon={Trash2} size="sm">Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingDish ? 'Edit Dish' : 'Add New Dish'}>
        <DishForm dish={editingDish} onSave={handleSaveDish} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default MenuManagement;