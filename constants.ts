
import { Role, TableStatus, type User, type Dish, type Table } from './types';

const defaultPermissions = { canCancelOrder: false, canApplyDiscount: false, canViewReports: false };

export const USERS: User[] = [
  { id: 1, name: 'مدير النظام', pin: '999', role: Role.ADMIN, password: 'admin', permissions: { canCancelOrder: true, canApplyDiscount: true, canViewReports: true } },
  { id: 2, name: 'أحمد النادل', pin: '101', role: Role.WAITER, permissions: defaultPermissions },
  { id: 3, name: 'سارة النادلة', pin: '102', role: Role.WAITER, permissions: defaultPermissions },
  { id: 4, name: 'المطبخ الرئيسي', pin: '000', role: Role.KITCHEN, permissions: defaultPermissions },
  { id: 5, name: 'ركن المشروبات', pin: '001', role: Role.BAR, permissions: defaultPermissions },
];

export const MENU_DISHES: Dish[] = [
  { 
    id: 1, 
    name: { ar: 'مشاوي مشكلة', en: 'Mixed Grill', it: 'Grigliata Mista' }, 
    description: { ar: 'تشكيلة من الكباب والشيش طاووق والريش.', en: 'Selection of kebab, shish taouk, and lamb chops.', it: 'Selezione di kebab, shish taouk e costolette di agnello.' }, 
    price: 45.0, 
    category: 'الأطباق الرئيسية', 
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' 
  },
  { 
    id: 2, 
    name: { ar: 'حمص باللحمة', en: 'Hummus with Meat', it: 'Hummus con Carne' }, 
    description: { ar: 'حمص كريمي مغطى بقطع اللحم المقلية.', en: 'Creamy hummus topped with sautéed meat chunks.', it: 'Hummus cremoso guarnito con pezzi di carne saltati.' }, 
    price: 18.5, 
    category: 'المقبلات', 
    imageUrl: 'https://images.unsplash.com/photo-1577906030559-060d4486a4c1?w=400' 
  },
  { 
    id: 3, 
    name: { ar: 'فتوش', en: 'Fattoush', it: 'Fattoush' }, 
    description: { ar: 'سلطة لبنانية تقليدية بخبز محمص.', en: 'Traditional Lebanese salad with toasted bread.', it: 'Insalata tradizionale libanese con pane tostato.' }, 
    price: 12.0, 
    category: 'المقبلات', 
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400' 
  },
];

export const TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    capacity: i % 3 === 0 ? 6 : (i % 2 === 0 ? 4 : 2),
    status: TableStatus.AVAILABLE
}));
