export type Role = 'student' | 'teacher' | 'public' | 'shop_owner';

export interface User {
  id: string;
  phone: string;
  role: Role | null;
  name?: string;
  university?: string; // For student/teacher
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  isAvailable: boolean;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  university?: string; // Optional, if inside a university
  menu: MenuItem[];
  location: { lat: number; lng: number }; // For map tracking
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  shopId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
  timeSlot?: string; // e.g., "12:30 PM - 12:45 PM"
  paymentMethod: 'UPI';
}
