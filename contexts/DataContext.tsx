
import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { Dish, Order, OrderItem, Table, ScreenSettings } from '../types';
import { OrderStatus, TableStatus } from '../types';
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

const DEFAULT_SCREEN_SETTINGS: ScreenSettings = {
  kitchenCategories: ['الأطباق الرئيسية', 'المقبلات', 'الحلويات'],
  barCategories: ['المشروبات'],
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<Dish[]>(MENU_DISHES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>(TABLES);
  const [screenSettings, setScreenSettings] = useState<ScreenSettings>(DEFAULT_SCREEN_SETTINGS);

  // Sync settings if new categories appear that aren't mapped yet
  useEffect(() => {
    const allCategories = Array.from(new Set(dishes.map(d => d.category)));
    const mappedCategories = [...screenSettings.kitchenCategories, ...screenSettings.barCategories];
    const unmapped = allCategories.filter(cat => !mappedCategories.includes(cat));
    
    if (unmapped.length > 0) {
      setScreenSettings(prev => ({
        ...prev,
        kitchenCategories: [...prev.kitchenCategories, ...unmapped]
      }));
    }
  }, [dishes]);

  const addDish = useCallback((dishData: Omit<Dish, 'id' | 'imageUrl'>) => {
    setDishes(prev => [
      ...prev,
      {
        ...dishData,
        id: Date.now(),
        imageUrl: `https://picsum.photos/seed/${dishData.name.split(' ').join('')}/400/300`,
      },
    ]);
  }, []);

  const updateDish = useCallback((updatedDish: Dish) => {
    setDishes(prev => prev.map(d => (d.id === updatedDish.id ? updatedDish : d)));
  }, []);

  const deleteDish = useCallback((dishId: number) => {
    setDishes(prev => prev.filter(d => d.id !== dishId));
  }, []);

  const createOrder = useCallback((tableId: number, items: OrderItem[], waiterId: number) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      tableId,
      items,
      status: OrderStatus.NEW,
      timestamp: new Date(),
      waiterId,
    };
    setOrders(prev => [...prev, newOrder]);
    setTables(prev => prev.map(t => t.id === tableId ? {...t, status: TableStatus.OCCUPIED} : t));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status };
          if (status === OrderStatus.COMPLETED || status === OrderStatus.CANCELLED) {
            setTables(prevTables => prevTables.map(t => t.id === order.tableId ? {...t, status: TableStatus.AVAILABLE} : t));
          }
          return updatedOrder;
        }
        return order;
      })
    );
  }, []);

  const updateScreenSettings = useCallback((settings: ScreenSettings) => {
    setScreenSettings(settings);
  }, []);
  
  return (
    <DataContext.Provider value={{ 
      dishes, 
      orders, 
      tables, 
      screenSettings,
      addDish, 
      updateDish, 
      deleteDish, 
      createOrder, 
      updateOrderStatus,
      updateScreenSettings
    }}>
      {children}
    </DataContext.Provider>
  );
};
