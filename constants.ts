
import { Role, TableStatus, type User, type Dish, type Table } from './types';

export const USERS: User[] = [
  { id: 1, name: 'مدير النظام', username: 'admin', role: Role.ADMIN, password: 'admin' },
  { id: 2, name: 'أحمد النادل', username: '101', role: Role.WAITER },
  { id: 3, name: 'سارة النادلة', username: '102', role: Role.WAITER },
  { id: 4, name: 'شاشة المطبخ', username: 'kitchen', role: Role.KITCHEN, password: '111' },
  { id: 5, name: 'شاشة المشروبات', username: 'bar', role: Role.BAR, password: '222' },
];

export const MENU_DISHES: Dish[] = [
  { id: 1, name: 'مشاوي مشكلة', description: 'تشكيلة من الكباب والشيش طاووق والريش.', price: 45.0, category: 'الأطباق الرئيسية', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
  { id: 2, name: 'حمص باللحمة', description: 'حمص كريمي مغطى بقطع اللحم المقلية.', price: 18.5, category: 'المقبلات', imageUrl: 'https://images.unsplash.com/photo-1577906030559-060d4486a4c1?w=400' },
  { id: 3, name: 'فتوش', description: 'سلطة لبنانية تقليدية بخبز محمص.', price: 12.0, category: 'المقبلات', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400' },
  { id: 4, name: 'كنافة نابلسية', description: 'كنافة بالجبنة الساخنة والقطر.', price: 15.0, category: 'الحلويات', imageUrl: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=400' },
  { id: 5, name: 'بيبسي', description: 'مشروب غازي بارد.', price: 3.5, category: 'المشروبات', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },
];

export const TABLES: Table[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  capacity: i % 2 === 0 ? 4 : 2,
  status: TableStatus.AVAILABLE,
}));
