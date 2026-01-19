
import React, { useMemo, useEffect, useState } from 'react';
import { useRestaurantData } from '../hooks/useRestaurantData';
import { OrderStatus, type Order } from '../types';
import { ChefHat, Clock, CheckCircle, Coffee } from 'lucide-react';
import Button from '../components/Button';

const KitchenDashboard: React.FC<{ screenType: 'kitchen' | 'bar' }> = ({ screenType }) => {
  const { orders, updateOrderStatus, screenSettings } = useRestaurantData();

  const filteredOrders = useMemo(() => {
    const allowedCats = screenType === 'kitchen' ? screenSettings.kitchenCategories : screenSettings.barCategories;
    return orders
      .filter(o => o.status === OrderStatus.NEW || o.status === OrderStatus.IN_PROGRESS)
      .map(o => ({
        ...o,
        items: o.items.filter(item => allowedCats.includes(item.dish.category))
      }))
      .filter(o => o.items.length > 0);
  }, [orders, screenType, screenSettings]);

  return (
    <div className="h-screen flex flex-col bg-neutral">
      <header className={`p-6 text-white flex justify-between items-center ${screenType === 'kitchen' ? 'bg-kitchen-primary' : 'bg-drinks-primary'}`}>
        <h1 className="text-4xl font-black flex items-center gap-4">
          {screenType === 'kitchen' ? <ChefHat size={48} /> : <Coffee size={48} />}
          {screenType === 'kitchen' ? 'شاشة المطبخ' : 'شاشة المشروبات'}
        </h1>
        <div className="text-2xl font-bold bg-black/20 px-6 py-2 rounded-full">
          طلبات نشطة: {filteredOrders.length}
        </div>
      </header>

      <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border-2">
            <div className={`p-4 text-white flex justify-between items-center ${order.status === OrderStatus.NEW ? 'bg-orange-500' : 'bg-blue-600'}`}>
              <span className="text-3xl font-black">طاولة {order.tableId}</span>
              <div className="flex items-center gap-2"><Clock size={24} /> {new Date(order.timestamp).toLocaleTimeString('ar-SA', { minute: '2-digit', second: '2-digit' })}</div>
            </div>
            <ul className="p-6 flex-grow space-y-4">
              {order.items.map((item, idx) => (
                <li key={idx} className="border-b pb-2 last:border-0">
                  <div className="text-2xl font-bold">
                    <span className="text-primary ml-2">{item.quantity}x</span> {item.dish.name}
                  </div>
                  {item.notes && <p className="text-danger italic mt-1 bg-red-50 p-2 rounded text-lg">ملاحظة: {item.notes}</p>}
                </li>
              ))}
            </ul>
            <div className="p-4 bg-muted border-t">
              <Button 
                className="w-full py-6 text-2xl font-bold" 
                onClick={() => updateOrderStatus(order.id, order.status === OrderStatus.NEW ? OrderStatus.IN_PROGRESS : OrderStatus.READY)}
              >
                {order.status === OrderStatus.NEW ? 'بدء التحضير' : 'تم التجهيز'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenDashboard;
