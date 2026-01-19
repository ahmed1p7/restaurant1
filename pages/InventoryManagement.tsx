import React, { useState } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import type { Dish } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { Package, Plus, Edit3, Trash2, Search } from 'lucide-react';

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
}

interface DishIngredient {
  dishId: number;
  ingredientId: number;
  quantityNeeded: number;
}

const InventoryManagement: React.FC = () => {
  const { dishes, addDish, updateDish, deleteDish } = useRestaurantData();
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: 'Tomato', quantity: 50, unit: 'kg', minThreshold: 10 },
    { id: 2, name: 'Mozzarella Cheese', quantity: 30, unit: 'kg', minThreshold: 5 },
    { id: 3, name: 'Basil Leaves', quantity: 2, unit: 'kg', minThreshold: 0.5 },
    { id: 4, name: 'Pasta', quantity: 100, unit: 'kg', minThreshold: 20 },
    { id: 5, name: 'Eggs', quantity: 200, unit: 'pieces', minThreshold: 50 },
    { id: 6, name: 'Pancetta', quantity: 15, unit: 'kg', minThreshold: 3 },
    { id: 7, name: 'Parmesan Cheese', quantity: 25, unit: 'kg', minThreshold: 5 },
    { id: 8, name: 'Romaine Lettuce', quantity: 10, unit: 'kg', minThreshold: 2 },
    { id: 9, name: 'Croutons', quantity: 8, unit: 'kg', minThreshold: 1 },
    { id: 10, name: 'Caesar Dressing', quantity: 5, unit: 'L', minThreshold: 1 },
  ]);
  
  const [ingredientForm, setIngredientForm] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    minThreshold: 0
  });
  
  const [lowStockAlerts, setLowStockAlerts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const lowStockIngredients = ingredients.filter(ing => ing.quantity <= ing.minThreshold);

  const handleAddIngredient = () => {
    if (ingredientForm.name.trim()) {
      const newIngredient: Ingredient = {
        id: Date.now(),
        name: ingredientForm.name,
        quantity: ingredientForm.quantity,
        unit: ingredientForm.unit,
        minThreshold: ingredientForm.minThreshold
      };
      
      setIngredients([...ingredients, newIngredient]);
      setIngredientForm({ name: '', quantity: 0, unit: 'kg', minThreshold: 0 });
      
      // Check for low stock alerts
      if (newIngredient.quantity <= newIngredient.minThreshold) {
        setLowStockAlerts([...lowStockAlerts, `Low stock: ${newIngredient.name}`]);
      }
    }
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id === id) {
        const updatedIng = { ...ing, quantity: newQuantity };
        
        // Check if this update caused a low stock alert
        if (updatedIng.quantity <= updatedIng.minThreshold) {
          if (!lowStockAlerts.includes(`Low stock: ${updatedIng.name}`)) {
            setLowStockAlerts([...lowStockAlerts, `Low stock: ${updatedIng.name}`]);
          }
        } else {
          // Remove the alert if stock is above threshold
          setLowStockAlerts(lowStockAlerts.filter(alert => alert !== `Low stock: ${updatedIng.name}`));
        }
        
        return updatedIng;
      }
      return ing;
    }));
  };

  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-dark">Inventory Management</h1>
        <p className="mt-1 text-neutral-dark opacity-75">Track ingredients and manage stock levels.</p>
      </div>

      {/* Low Stock Alerts */}
      {lowStockIngredients.length > 0 && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <div className="flex items-center text-red-700">
            <Package className="h-5 w-5 mr-2" />
            <h3 className="font-semibold">Low Stock Alert</h3>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockIngredients.map(ing => (
              <div key={ing.id} className="flex justify-between items-center bg-red-100 p-2 rounded">
                <span className="text-sm">{ing.name}</span>
                <span className="text-sm font-semibold">{ing.quantity} {ing.unit}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add New Ingredient Form */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-neutral-dark">Add New Ingredient</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-dark mb-1">Ingredient Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package className="h-4 w-4 text-neutral-dark/40" />
              </div>
              <input
                type="text"
                value={ingredientForm.name}
                onChange={(e) => setIngredientForm({...ingredientForm, name: e.target.value})}
                className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
                placeholder="Enter ingredient name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Quantity</label>
            <input
              type="number"
              value={ingredientForm.quantity || ''}
              onChange={(e) => setIngredientForm({...ingredientForm, quantity: Number(e.target.value)})}
              className="block w-full px-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Unit</label>
            <select
              value={ingredientForm.unit}
              onChange={(e) => setIngredientForm({...ingredientForm, unit: e.target.value})}
              className="block w-full px-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="L">L</option>
              <option value="ml">ml</option>
              <option value="pieces">pieces</option>
              <option value="dozen">dozen</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Min Threshold</label>
            <input
              type="number"
              value={ingredientForm.minThreshold || ''}
              onChange={(e) => setIngredientForm({...ingredientForm, minThreshold: Number(e.target.value)})}
              className="block w-full px-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button onClick={handleAddIngredient} Icon={Plus}>
            Add Ingredient
          </Button>
        </div>
      </Card>

      {/* Inventory List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-neutral-dark">Current Inventory</h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-dark/40" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light text-sm"
              placeholder="Search ingredients..."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIngredients.map(ingredient => (
            <Card key={ingredient.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-neutral-dark">{ingredient.name}</h3>
                  <p className={`text-lg font-bold mt-1 ${ingredient.quantity <= ingredient.minThreshold ? 'text-red-600' : 'text-green-600'}`}>
                    {ingredient.quantity} {ingredient.unit}
                  </p>
                  <p className="text-sm text-neutral-dark opacity-70">Min: {ingredient.minThreshold} {ingredient.unit}</p>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-primary hover:bg-primary/10 rounded-full"
                    onClick={() => handleUpdateQuantity(ingredient.id, ingredient.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                  <button 
                    className="p-2 text-danger hover:bg-danger/10 rounded-full"
                    onClick={() => ingredient.quantity > 0 && handleUpdateQuantity(ingredient.id, ingredient.quantity - 1)}
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-neutral/20 flex justify-between">
                <span className={`text-sm ${ingredient.quantity <= ingredient.minThreshold ? 'text-red-600 font-semibold' : 'text-neutral-dark opacity-70'}`}>
                  {ingredient.quantity <= ingredient.minThreshold ? 'LOW STOCK' : 'In Stock'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;