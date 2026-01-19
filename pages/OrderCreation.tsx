
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { useAuth } from '../hooks/useAuth';
import type { OrderItem, Dish } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus, Minus, ShoppingCart, MessageSquare } from 'lucide-react';

const OrderCreation: React.FC = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dishes, createOrder } = useRestaurantData();
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  
  const QUICK_NOTES = ['بدون بصل', 'حار زيادة', 'حساسية طعام', 'صوص جانبي'];
  const numericTableId = Number(tableId);

  if (!user) {
    navigate('/login');
    return null;
  }

  const addToOrder = (dish: Dish) => {
    const existingItem = currentOrderItems.find(item => item.dish.id === dish.id);
    if (existingItem) {
      setCurrentOrderItems(
        currentOrderItems.map(item =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCurrentOrderItems([...currentOrderItems, { dish, quantity: 1, notes: '' }]);
    }
  };

  const updateQuantity = (dishId: number, delta: number) => {
    setCurrentOrderItems(prevItems => {
        const updatedItems = prevItems.map(item =>
            item.dish.id === dishId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        );
        return updatedItems.filter(item => item.quantity > 0);
    });
  };

  const updateItemNotes = (dishId: number, notes: string) => {
    setCurrentOrderItems(prevItems => 
        prevItems.map(item => 
            item.dish.id === dishId ? { ...item, notes } : item
        )
    );
  };

  const appendNote = (dishId: number, noteToAppend: string) => {
    setCurrentOrderItems(prevItems =>
      prevItems.map(item => {
        if (item.dish.id === dishId) {
          const newNote = item.notes ? `${item.notes}, ${noteToAppend}` : noteToAppend;
          return { ...item, notes: newNote };
        }
        return item;
      })
    );
  };

  const total = currentOrderItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (currentOrderItems.length > 0) {
      createOrder(numericTableId, currentOrderItems, user.id);
      navigate('/waiter');
    }
  };

  const categories = [...new Set(dishes.map(d => d.category))];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-neutral-dark">طلب جديد لطاولة {tableId}</h1>
            <p className="mt-1 text-neutral-dark opacity-75">اختر الأطباق لإضافتها إلى الطلب.</p>
        </div>
        {categories.map(category => (
            <div key={category}>
                <h2 className="text-2xl font-semibold text-primary mb-4 border-r-4 border-accent pr-3">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {dishes.filter(d => d.category === category).map(dish => (
                        <Card key={dish.id} className="flex flex-col cursor-pointer overflow-hidden hover:scale-105 transition-transform" onClick={() => addToOrder(dish)}>
                            <img src={dish.imageUrl} alt={dish.name} className="w-full h-40 object-cover" />
                            <div className="p-3 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold text-neutral-dark">{dish.name}</h3>
                                    <p className="text-primary font-bold text-sm">{dish.price.toFixed(2)} ر.س</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        ))}
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-24 shadow-2xl border-t-4 border-accent">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-neutral-dark">ملخص الطلب</h2>
                <p className="text-sm text-neutral-dark opacity-80">طاولة {tableId}</p>
            </div>
            <div className="p-4 divide-y divide-neutral max-h-[60vh] overflow-y-auto">
                {currentOrderItems.length === 0 ? (
                    <div className="text-center py-12">
                        <ShoppingCart size={48} className="mx-auto text-neutral opacity-40 mb-3" />
                        <p className="text-neutral-dark opacity-50">لم يتم إضافة أطباق بعد.</p>
                    </div>
                ) : (
                    currentOrderItems.map(item => (
                        <div key={item.dish.id} className="py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{item.dish.name}</p>
                                    <p className="text-sm text-neutral-dark opacity-80">{item.dish.price.toFixed(2)} ر.س</p>
                                </div>
                                <div className="flex items-center space-x-reverse space-x-2">
                                    <Button size="sm" variant="secondary" className="p-1 h-7 w-7" onClick={() => updateQuantity(item.dish.id, -1)}><Minus size={16}/></Button>
                                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                                    <Button size="sm" variant="secondary" className="p-1 h-7 w-7" onClick={() => updateQuantity(item.dish.id, 1)}><Plus size={16}/></Button>
                                </div>
                            </div>
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <MessageSquare className="h-4 w-4 text-neutral-dark opacity-60" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="أضف ملاحظات..."
                                    value={item.notes}
                                    onChange={(e) => updateItemNotes(item.dish.id, e.target.value)}
                                    className="pr-9 pl-2 py-1 text-sm block w-full border border-neutral rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {QUICK_NOTES.map(note => (
                                    <button
                                        key={note}
                                        type="button"
                                        onClick={() => appendNote(item.dish.id, note)}
                                        className="px-2 py-0.5 text-xs rounded-full bg-muted text-neutral-dark hover:bg-neutral transition-colors"
                                    >
                                        + {note}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {currentOrderItems.length > 0 && (
                <div className="p-4 border-t bg-muted rounded-b-lg">
                    <div className="flex justify-between font-bold text-xl mb-4">
                        <span>الإجمالي:</span>
                        <span className="text-primary">{total.toFixed(2)} ر.س</span>
                    </div>
                    <Button className="w-full !py-3 text-lg font-bold" Icon={ShoppingCart} onClick={handlePlaceOrder}>
                        إرسال الطلب للمطبخ
                    </Button>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default OrderCreation;