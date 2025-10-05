
import type { User, Dish, Table } from './types';
import { Role, TableStatus } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Admin User', username: 'admin', role: Role.ADMIN, password: 'admin' },
  { id: 2, name: 'John Waiter', username: 'john', role: Role.WAITER },
  { id: 3, name: 'Jane Waiter', username: 'jane', role: Role.WAITER },
];

export const MENU_DISHES: Dish[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato, mozzarella, and basil.',
    price: 12.99,
    category: 'Main Course',
    imageUrl: 'https://picsum.photos/seed/pizza/400/300',
  },
  {
    id: 2,
    name: 'Spaghetti Carbonara',
    description: 'Pasta with eggs, cheese, pancetta, and pepper.',
    price: 15.50,
    category: 'Main Course',
    imageUrl: 'https://picsum.photos/seed/carbonara/400/300',
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Romaine lettuce and croutons with Caesar dressing.',
    price: 9.75,
    category: 'Appetizer',
    imageUrl: 'https://picsum.photos/seed/salad/400/300',
  },
  {
    id: 4,
    name: 'Tiramisu',
    description: 'Coffee-flavoured Italian dessert.',
    price: 8.00,
    category: 'Dessert',
    imageUrl: 'https://picsum.photos/seed/tiramisu/400/300',
  },
  {
    id: 5,
    name: 'Bruschetta',
    description: 'Grilled bread with garlic, topped with tomatoes and basil.',
    price: 7.50,
    category: 'Appetizer',
    imageUrl: 'https://picsum.photos/seed/bruschetta/400/300',
  },
  {
    id: 6,
    name: 'Filet Mignon',
    description: 'Tender beef steak cooked to perfection.',
    price: 29.99,
    category: 'Main Course',
    imageUrl: 'https://picsum.photos/seed/steak/400/300',
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
