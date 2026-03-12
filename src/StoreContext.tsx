import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Shop, Order, Role } from './types';

interface StoreContextType {
  user: User | null;
  login: (phone: string) => void;
  setRole: (role: Role) => void;
  updateProfile: (data: Partial<User>) => void;
  logout: () => void;
  
  shops: Shop[];
  addShop: (shop: Omit<Shop, 'id' | 'ownerId'>) => void;
  updateShopMenu: (shopId: string, menu: Shop['menu']) => void;
  
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], timeSlot?: string) => void;
}

const MOCK_SHOPS: Shop[] = [
  {
    id: 'shop_1',
    ownerId: 'owner_1',
    name: 'Campus Canteen',
    address: 'Main Block, Ground Floor',
    university: 'Delhi University',
    location: { lat: 28.6896, lng: 77.2046 },
    menu: [
      { id: 'm1', name: 'Samosa', price: 15, isAvailable: true },
      { id: 'm2', name: 'Chai', price: 10, isAvailable: true },
      { id: 'm3', name: 'Veg Thali', price: 60, isAvailable: true },
    ]
  },
  {
    id: 'shop_2',
    ownerId: 'owner_2',
    name: 'City Cafe',
    address: 'Connaught Place',
    location: { lat: 28.6304, lng: 77.2177 },
    menu: [
      { id: 'm4', name: 'Cold Coffee', price: 80, isAvailable: true },
      { id: 'm5', name: 'Sandwich', price: 50, isAvailable: true },
    ]
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [shops, setShops] = useState<Shop[]>(MOCK_SHOPS);
  const [orders, setOrders] = useState<Order[]>([]);

  const login = (phone: string) => {
    // Simulate login/registration
    setUser({ id: `user_${Date.now()}`, phone, role: null });
  };

  const setRole = (role: Role) => {
    if (user) setUser({ ...user, role });
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  const logout = () => setUser(null);

  const addShop = (shopData: Omit<Shop, 'id' | 'ownerId'>) => {
    if (!user) return;
    const newShop: Shop = {
      ...shopData,
      id: `shop_${Date.now()}`,
      ownerId: user.id,
    };
    setShops([...shops, newShop]);
  };

  const updateShopMenu = (shopId: string, menu: Shop['menu']) => {
    setShops(shops.map(s => s.id === shopId ? { ...s, menu } : s));
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}`,
      status: 'pending',
      createdAt: Date.now(),
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], timeSlot?: string) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status, ...(timeSlot ? { timeSlot } : {}) };
      }
      return o;
    }));
  };

  return (
    <StoreContext.Provider value={{
      user, login, setRole, updateProfile, logout,
      shops, addShop, updateShopMenu,
      orders, placeOrder, updateOrderStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
