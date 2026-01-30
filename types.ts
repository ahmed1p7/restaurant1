
export enum Role {
  ADMIN = 'admin',
  WAITER = 'waiter',
  KITCHEN = 'kitchen',
  BAR = 'bar',
}

export interface LocalizedString {
  ar: string;
  en: string;
  it: string;
}

export interface UserPermissions {
  canCancelOrder: boolean;
  canApplyDiscount: boolean;
  canViewReports: boolean;
}

export interface User {
  id: number;
  name: string;
  pin: string;
  role: Role;
  password?: string;
  permissions: UserPermissions;
}

export enum MenuStyle {
  GRID = 'grid',
  BOOKLET = 'booklet',
}

export interface MenuPage {
  id: string;
  title: LocalizedString;
  backgroundColor: string;
  order: number;
  category: string; // Internal category identifier
}

export interface Dish {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  category: string;
  imageUrl: string;
  pageId?: string;
  isOutOfStock?: boolean;
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
  isAllergy?: boolean;
  isReady?: boolean;
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: Date;
  waiterId: number;
  waiterName: string;
  guestCount: number;
  estimatedMinutes?: number;
}

export enum TableStatus {
    AVAILABLE = 'Available',
    OCCUPIED = 'Occupied',
    RESERVED = 'Reserved',
}

export interface Table {
    id: number;
    capacity: number;
    status: TableStatus;
    reservationName?: string;
}

export interface ScreenSettings {
  kitchenCategories: string[];
  barCategories: string[];
  menuStyle: MenuStyle;
  menuScale: number;
  kitchenColumns: number;
}
