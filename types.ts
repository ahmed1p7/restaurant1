
export enum Role {
  ADMIN = 'admin',
  WAITER = 'waiter',
}

export interface User {
  id: number;
  name: string;
  username: string;
  role: Role;
  password?: string;
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export enum OrderStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  READY = 'Ready',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface OrderItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: Date;
  waiterId: number;
}

export enum TableStatus {
    AVAILABLE = 'Available',
    OCCUPIED = 'Occupied',
}

export interface Table {
    id: number;
    capacity: number;
    status: TableStatus;
}
