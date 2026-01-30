
import React, { createContext, useState, useCallback, useMemo, useContext } from 'react';
import { OrderStatus, TableStatus, MenuStyle, type Dish, type Order, type OrderItem, type Table, type ScreenSettings, type MenuPage, type LocalizedString } from '../types';
import { MENU_DISHES, TABLES } from '../constants';
import { AuthContext } from './AuthContext';

interface DataContextType {
  dishes: Dish[];
  pages: MenuPage[];
  orders: Order[];
  tables: Table[];
  screenSettings: ScreenSettings;
  addDish: (dish: Omit<Dish, 'id' | 'imageUrl'>) => void;
  updateDish: (dish: Dish) => void;
  deleteDish: (dishId: number) => void;
  toggleStock: (dishId: number) => void;
  addPage: (page: Omit<MenuPage, 'id'>) => void;
  updatePage: (page: MenuPage) => void;
  deletePage: (pageId: string) => void;
  createOrUpdateOrder: (tableId: number, newItems: OrderItem[], waiterId: number, guestCount: number) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markItemsAsReady: (orderId: string, categories: string[]) => void;
  updateScreenSettings: (settings: ScreenSettings) => void;
  updateGuestCount: (tableId: number, newCount: number) => void;
  getActiveOrderByTable: (tableId: number) => Order | undefined;
  reserveTable: (tableId: number, name: string) => void;
  releaseTable: (tableId: number) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_PAGES: MenuPage[] = [
  { id: 'p1', title: { ar: 'المقبلات الشهية', en: 'Delicious Starters', it: 'Antipasti Sfiziosi' }, backgroundColor: '#FDF5E6', order: 1, category: 'المقبلات' },
  { id: 'p2', title: { ar: 'الأطباق الرئيسية', en: 'Main Courses', it: 'Piatti Principali' }, backgroundColor: '#FFF0F5', order: 2, category: 'الأطباق الرئيسية' },
  { id: 'p3', title: { ar: 'الحلويات الفاخرة', en: 'Premium Desserts', it: 'Dolci Premium' }, backgroundColor: '#F0FFF0', order: 3, category: 'الحلويات' },
  { id: 'p4', title: { ar: 'ركن المشروبات', en: 'Drinks Corner', it: 'Angolo Bevande' }, backgroundColor: '#F0F8FF', order: 4, category: 'المشروبات' },
];

const DEFAULT_SETTINGS: ScreenSettings = {
  kitchenCategories: ['الأطباق الرئيسية', 'المقبلات', 'الحلويات'],
  barCategories: ['المشروبات'],
  menuStyle: MenuStyle.BOOKLET,
  menuScale: 1.0,
  kitchenColumns: 4,
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const [dishes, setDishes] = useState<Dish[]>(MENU_DISHES.map((d, i) => ({ 
    ...d, 
    pageId: DEFAULT_PAGES[Math.min(i, 3)].id, 
    isOutOfStock: false 
  })));
  const [pages, setPages] = useState<MenuPage[]>(DEFAULT_PAGES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>(TABLES.map(t => ({...t, status: TableStatus.AVAILABLE})));
  const [screenSettings, setScreenSettings] = useState<ScreenSettings>(DEFAULT_SETTINGS);

  const activeOrdersCount = useMemo(() => orders.filter(o => [OrderStatus.NEW, OrderStatus.IN_PROGRESS].includes(o.status)).length, [orders]);

  const toggleStock = (id: number) => setDishes(prev => prev.map(d => d.id === id ? { ...d, isOutOfStock: !d.isOutOfStock } : d));
  const addDish = (d: any) => setDishes(prev => [...prev, { ...d, id: Date.now(), imageUrl: 'https://picsum.photos/400/300', isOutOfStock: false }]);
  const updateDish = (d: Dish) => setDishes(prev => prev.map(item => item.id === d.id ? d : item));
  const deleteDish = (id: number) => setDishes(prev => prev.filter(item => item.id !== id));

  const addPage = (p: any) => setPages(prev => [...prev, { ...p, id: `pg-${Date.now()}` }]);
  const updatePage = (p: MenuPage) => setPages(prev => prev.map(item => item.id === p.id ? p : item));
  const deletePage = (id: string) => setPages(prev => prev.filter(item => item.id !== id));

  const getActiveOrderByTable = useCallback((tableId: number) => {
    return orders.find(o => o.tableId === tableId && o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED);
  }, [orders]);

  const reserveTable = (tableId: number, name: string) => setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: TableStatus.RESERVED, reservationName: name } : t));
  const releaseTable = (tableId: number) => setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: TableStatus.AVAILABLE, reservationName: undefined } : t));

  const createOrUpdateOrder = (tableId: number, newItems: OrderItem[], waiterId: number, guestCount: number) => {
    const existingOrder = getActiveOrderByTable(tableId);
    const estimatedTime = 10 + (activeOrdersCount * 2);
    const waiterName = auth?.allStaff.find(s => s.id === waiterId)?.name || 'نادل';

    if (existingOrder) {
      const mergedItems = [...existingOrder.items, ...newItems.map(i => ({...i, isReady: false}))];
      setOrders(prev => prev.map(o => o.id === existingOrder.id ? { ...o, items: mergedItems, guestCount, estimatedMinutes: estimatedTime } : o));
    } else {
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        tableId,
        items: newItems.map(i => ({...i, isReady: false})),
        status: OrderStatus.NEW,
        timestamp: new Date(),
        waiterId,
        waiterName,
        guestCount,
        estimatedMinutes: estimatedTime,
      };
      setOrders(prev => [...prev, newOrder]);
      setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: TableStatus.OCCUPIED, reservationName: undefined } : t));
    }
  };

  const updateGuestCount = (tableId: number, newCount: number) => {
    const activeOrder = getActiveOrderByTable(tableId);
    if (activeOrder) setOrders(prev => prev.map(o => o.id === activeOrder.id ? { ...o, guestCount: newCount } : o));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (status === OrderStatus.COMPLETED) setTables(prevT => prevT.map(t => t.id === o.tableId ? { ...t, status: TableStatus.AVAILABLE } : t));
        return { ...o, status };
      }
      return o;
    }));
  };

  const markItemsAsReady = (orderId: string, categories: string[]) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(item => categories.includes(item.dish.category) ? { ...item, isReady: true } : item);
        const allReady = updatedItems.every(item => item.isReady);
        return { ...o, items: updatedItems, status: allReady ? OrderStatus.READY : OrderStatus.IN_PROGRESS };
      }
      return o;
    }));
  };

  const updateScreenSettings = (s: ScreenSettings) => setScreenSettings(s);

  return (
    <DataContext.Provider value={{ 
      dishes, pages, orders, tables, screenSettings, addDish, updateDish, deleteDish, toggleStock,
      addPage, updatePage, deletePage,
      createOrUpdateOrder, updateOrderStatus, markItemsAsReady, updateScreenSettings, updateGuestCount, getActiveOrderByTable,
      reserveTable, releaseTable
    }}>
      {children}
    </DataContext.Provider>
  );
};
