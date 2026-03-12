import React, { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { Store, MapPin, Search, ShoppingBag, Clock, Navigation, CheckCircle2, Bell } from 'lucide-react';
import { Shop, MenuItem, OrderItem } from '../types';

export const CustomerDashboard: React.FC = () => {
  const { user, shops, orders, placeOrder, logout } = useStore();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState<'shops' | 'orders'>('shops');
  const [notification, setNotification] = useState<string | null>(null);

  // Filter shops based on role
  const availableShops = shops.filter(shop => {
    if (user?.role === 'student' || user?.role === 'teacher') {
      return shop.university?.toLowerCase() === user?.university?.toLowerCase();
    } else if (user?.role === 'public') {
      return !shop.university; // Only shops not in a university
    }
    return false;
  });

  const myOrders = orders.filter(o => o.customerId === user?.id).sort((a, b) => b.createdAt - a.createdAt);

  // Watch for ready orders to show notification
  useEffect(() => {
    const readyOrder = myOrders.find(o => o.status === 'ready');
    if (readyOrder) {
      const shop = shops.find(s => s.id === readyOrder.shopId);
      setNotification(`Your order from ${shop?.name || 'the shop'} is ready for pickup!`);
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [orders]);

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.menuItemId === item.id);
    if (existing) {
      setCart(cart.map(c => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existing = cart.find(c => c.menuItemId === itemId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(c => c.menuItemId === itemId ? { ...c, quantity: c.quantity - 1 } : c));
    } else {
      setCart(cart.filter(c => c.menuItemId !== itemId));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!selectedShop || !user || cart.length === 0) return;
    
    // Simulate UPI Payment
    setTimeout(() => {
      placeOrder({
        shopId: selectedShop.id,
        customerId: user.id,
        items: cart,
        totalAmount: cartTotal,
        paymentMethod: 'UPI'
      });
      setCart([]);
      setShowCart(false);
      setSelectedShop(null);
      setActiveTab('orders');
      alert('Payment successful via UPI! Order placed.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-600">QuickBite</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 font-medium hidden sm:block">
              Hi, {user?.name}
            </span>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('shops')}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${activeTab === 'shops' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Available Shops
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Orders
          </button>
        </div>

        {activeTab === 'shops' && (
          <>
            {!selectedShop ? (
              <div>
                <div className="mb-6 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search shops..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                
                {availableShops.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No shops available in your area/university yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableShops.map(shop => (
                      <motion.div 
                        key={shop.id}
                        whileHover={{ y: -4 }}
                        onClick={() => setSelectedShop(shop)}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="h-32 bg-orange-100 flex items-center justify-center">
                          <Store size={48} className="text-orange-300" />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-900">{shop.name}</h3>
                          <div className="flex items-center text-gray-500 text-sm mt-2">
                            <MapPin size={16} className="mr-1" />
                            {shop.address}
                          </div>
                          {shop.university && (
                            <div className="mt-3 inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">
                              {shop.university}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <button 
                  onClick={() => { setSelectedShop(null); setCart([]); }}
                  className="text-orange-600 text-sm font-medium mb-6 flex items-center hover:underline"
                >
                  &larr; Back to Shops
                </button>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedShop.name}</h2>
                  <p className="text-gray-500 flex items-center mt-2">
                    <MapPin size={16} className="mr-1" /> {selectedShop.address}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Menu</h3>
                    <div className="space-y-4">
                      {selectedShop.menu.filter(m => m.isAvailable).map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-gray-500 text-sm mt-1">₹{item.price}</p>
                          </div>
                          <button 
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg font-medium hover:bg-orange-100 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <ShoppingBag className="mr-2" size={20} /> Your Cart
                      </h3>
                      
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Cart is empty</p>
                      ) : (
                        <>
                          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                            {cart.map(item => (
                              <div key={item.menuItemId} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-sm text-gray-900">{item.name}</p>
                                  <p className="text-xs text-gray-500">₹{item.price} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <button onClick={() => removeFromCart(item.menuItemId)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">-</button>
                                  <span className="text-sm font-medium">{item.quantity}</span>
                                  <button onClick={() => addToCart(selectedShop.menu.find(m => m.id === item.menuItemId)!)} className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 hover:bg-orange-200">+</button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 pt-4 mb-6">
                            <div className="flex justify-between items-center font-bold text-lg">
                              <span>Total</span>
                              <span>₹{cartTotal}</span>
                            </div>
                          </div>
                          <button 
                            onClick={handleCheckout}
                            className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex justify-center items-center"
                          >
                            Pay via UPI & Order
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {myOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                You haven't placed any orders yet.
              </div>
            ) : (
              myOrders.map(order => {
                const shop = shops.find(s => s.id === order.shopId);
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{shop?.name || 'Unknown Shop'}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-700' : 
                          order.status === 'ready' ? 'bg-green-100 text-green-700' : 
                          'bg-gray-100 text-gray-700'}`}
                      >
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="border-t border-b border-gray-50 py-4 my-4 space-y-2">
                      {order.items.map(item => (
                        <div key={item.menuItemId} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.quantity}x {item.name}</span>
                          <span className="text-gray-900 font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-bold text-gray-900">Total Paid (UPI)</span>
                      <span className="font-bold text-lg text-gray-900">₹{order.totalAmount}</span>
                    </div>

                    {order.timeSlot && (
                      <div className="bg-orange-50 rounded-xl p-4 flex items-center mb-4 border border-orange-100">
                        <Clock className="text-orange-500 mr-3" size={24} />
                        <div>
                          <p className="text-sm text-orange-800 font-medium">Your Pickup Time Slot</p>
                          <p className="text-lg font-bold text-orange-900">{order.timeSlot}</p>
                        </div>
                      </div>
                    )}

                    {order.status === 'ready' && (
                      <div className="bg-green-50 rounded-xl p-4 flex items-center mb-4 border border-green-100">
                        <CheckCircle2 className="text-green-600 mr-3" size={24} />
                        <div>
                          <p className="text-sm text-green-800 font-medium">Order is Ready!</p>
                          <p className="text-xs text-green-700">Please collect your order from the shop.</p>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => setShowMap(true)}
                      className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex justify-center items-center"
                    >
                      <Navigation className="mr-2" size={18} /> View Shop on Map
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Map Modal (Simulated) */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Shop Location</h3>
              <button onClick={() => setShowMap(false)} className="text-gray-500 hover:text-gray-900">Close</button>
            </div>
            <div className="h-64 bg-blue-50 relative flex items-center justify-center">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* User Location Marker */}
              <div className="absolute bottom-1/4 left-1/4 flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                <span className="text-xs font-bold mt-1 bg-white px-2 py-0.5 rounded shadow-sm">You</span>
              </div>

              {/* Path line (simulated) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <path d="M 120 180 Q 200 150 250 100" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 6" />
              </svg>

              {/* Shop Location Marker */}
              <div className="absolute top-1/4 right-1/4 flex flex-col items-center z-10">
                <MapPin className="text-red-500 fill-red-100" size={32} />
                <span className="text-xs font-bold mt-1 bg-white px-2 py-0.5 rounded shadow-sm">Shop</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 text-sm text-gray-600 text-center">
              Follow the path to reach the shop.
            </div>
          </motion.div>
        </div>
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3"
          >
            <Bell size={20} className="text-orange-400" />
            <span className="font-medium">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
