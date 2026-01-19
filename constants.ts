
import type { User, Dish, Table } from './types';
import { Role, TableStatus } from './types';

export const USERS: User[] = [
  { id: 1, name: 'مدير النظام', username: 'admin', role: Role.ADMIN, password: 'admin' },
  { id: 2, name: 'أحمد النادل', username: '101', role: Role.WAITER },
  { id: 3, name: 'سارة النادلة', username: '102', role: Role.WAITER },
  { id: 4, name: 'شاشة المطبخ', username: 'kitchen', role: Role.KITCHEN, password: '111' },
  { id: 5, name: 'شاشة المشروبات', username: 'bar', role: Role.BAR, password: '222' },
];

export const MENU_DISHES: Dish[] = [
  {
    id: 1,
    name: 'مشاوي مشكلة',
    description: 'تشكيلة من الكباب والشيش طاووق والريش المشوية على الفحم.',
    price: 45.00,
    category: 'الأطباق الرئيسية',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&h=300&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'حمص باللحمة',
    description: 'حمص كريمي مغطى بقطع اللحم المقلية والمكسرات.',
    price: 18.50,
    category: 'المقبلات',
    imageUrl: 'https://images.unsplash.com/photo-1577906030559-060d4486a4c1?q=80&w=400&h=300&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'فتوش',
    description: 'سلطة لبنانية تقليدية بخبز محمص ودبس رمان.',
    price: 12.00,
    category: 'المقبلات',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&h=300&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'كنافة نابلسية',
    description: 'كنافة بالجبنة الساخنة والقطر.',
    price: 15.00,
    category: 'الحلويات',
    imageUrl: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?q=80&w=400&h=300&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'مندي دجاج',
    description: 'أرز مندي أصيل مع دجاج مشوي بفرن المندي.',
    price: 35.00,
    category: 'الأطباق الرئيسية',
    imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=400&h=300&auto=format&fit=crop',
  },
  {
    id: 7,
    name: 'بيبسي',
    description: 'مشروب غازي بارد.',
    price: 3.50,
    category: 'المشروبات',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&h=300&auto=format&fit=crop',
  },
  {
    id: 8,
    name: 'عصير برتقال طازج',
    description: 'عصير برتقال طبيعي 100%.',
    price: 10.00,
    category: 'المشروبات',
    imageUrl: 'https://images.unsplash.com/photo-16002718863aa-2396dcc2323b?q=80&w=400&h=300&auto=format&fit=crop',
  },
  {
    id: 9,
    name: 'قهوة عربية',
    description: 'دلة قهوة عربية بالهيل.',
    price: 8.00,
    category: 'المشروبات',
    imageUrl: 'https://images.unsplash.com/photo-1599398054066-846f28917f38?q=80&w=400&h=300&auto=format&fit=crop',
  },
];

export const TABLES: Table[] = [
    { id: 1, capacity: 4, status: TableStatus.AVAILABLE },
    { id: 2, capacity: 2, status: TableStatus.AVAILABLE },
    { id: 3, capacity: 6, status: TableStatus.OCCUPIED },
    { id: 4, capacity: 4, status: TableStatus.AVAILABLE },
    { id: 5, capacity: 8, status: TableStatus.AVAILABLE },
    { id: 6, capacity: 2, status: TableStatus.OCCUPIED },
    { id: 7, capacity: 4, status: TableStatus.AVAILABLE },
    { id: 8, capacity: 4, status: TableStatus.AVAILABLE },
];
