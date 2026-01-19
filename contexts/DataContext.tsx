
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { OrderStatus, TableStatus, type Dish, type Order, type OrderItem, type Table, type ScreenSettings } from '../types';
import { MENU_DISHES, TABLES } from '../constants';

interface DataContextType {
  dishes: Dish[];
  orders: Order[];
  tables: Table[];
  screenSettings: ScreenSettings;
  addDish: (dish: Omit<Dish, 'id' | 'imageUrl'>) => void;
  updateDish: (dish: Dish) => void;
  deleteDish: (dishId: number) => void;
  createOrder: (tableId: number, items: OrderItem[], waiterId: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateScreenSettings: (settings: ScreenSettings) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_SETTINGS: ScreenSettings = {
  kitchenCategories: ['الأطباق الرئيسية', 'المقبلات', 'الحلويات'],
  barCategories: ['المشروبات'],
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<Dish[]>(MENU_DISHES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>(TABLES);
  const [screenSettings, setScreenSettings] = useState<ScreenSettings>(DEFAULT_SETTINGS);

  const addDish = (d: any) => setDishes(prev => [...prev, { ...d, id: Date.now(), imageUrl: 'https://picsum.photos/400/300' }]);
  const updateDish = (d: Dish) => setDishes(prev => prev.map(item => item.id === d.id ? d : item));
  const deleteDish = (id: number) => setDishes(prev => prev.filter(item => item.id !== id));

  const createOrder = (tableId: number, items: OrderItem[], waiterId: number) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      tableId,
      items,
      status: OrderStatus.NEW,
      timestamp: new Date(),
      waiterId,
    };
    setOrders(prev => [...prev, newOrder]);
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: TableStatus.OCCUPIED } : t));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (status === OrderStatus.COMPLETED) {
          setTables(prevT => prevT.map(t => t.id === o.tableId ? { ...t, status: TableStatus.AVAILABLE } : t));
        }
        return { ...o, status };
      }
      return o;
    }));
  };

  const updateScreenSettings = (s: ScreenSettings) => setScreenSettings(s);

  return (
    <DataContext.Provider value={{ dishes, orders, tables, screenSettings, addDish, updateDish, deleteDish, createOrder, updateOrderStatus, updateScreenSettings }}>
      {children}
    </DataContext.Provider>
  );
};
