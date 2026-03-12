import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { motion } from 'motion/react';
import { Store, Plus, Edit2, Trash2, CheckCircle, Clock, TrendingUp, IndianRupee } from 'lucide-react';
import { Order, MenuItem } from '../types';

export const ShopOwnerDashboard: React.FC = () => {
  const { user, shops, orders, updateShopMenu, updateOrderStatus, logout } = useStore();
  const [activeTab, setActiveTab] = useState<'queue' | 'menu' | 'analytics'>('queue');
  
  const myShop = shops.find(s => s.ownerId === user?.id);
  const shopOrders = orders.filter(o => o.shopId === myShop?.id).sort((a, b) => b.createdAt - a.createdAt);
  
  const pendingOrders = shopOrders.filter(o => o.status === 'pending');
  const preparingOrders = shopOrders.filter(o => o.status === 'preparing');
  const readyOrders = shopOrders.filter(o => o.status === 'ready');
  const completedOrders = shopOrders.filter(o => o.status === 'completed');

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [timeSlotInput, setTimeSlotInput] = useState<{ [orderId: string]: string }>({});

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myShop || !newItemName || !newItemPrice) return;
    
    const newItem: MenuItem = {
      id: `m_${Date.now()}`,
      name: newItemName,
      price: Number(newItemPrice),
      isAvailable: true
    };
    
    updateShopMenu(myShop.id, [...myShop.menu, newItem]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const toggleAvailability = (itemId: string) => {
    if (!myShop) return;
    const updatedMenu = myShop.menu.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    updateShopMenu(myShop.id, updatedMenu);
  };

  const deleteItem = (itemId: string) => {
    if (!myShop) return;
    const updatedMenu = myShop.menu.filter(item => item.id !== itemId);
    updateShopMenu(myShop.id, updatedMenu);
  };

  const handleAcceptOrder = (orderId: string) => {
    const slot = timeSlotInput[orderId];
    if (!slot) {
      alert('Please provide a time slot for pickup (e.g., 12:30 PM)');
      return;
    }
    updateOrderStatus(orderId, 'preparing', slot);
  };

  // Analytics
  const todayOrders = shopOrders.filter(o => {
    const today = new Date().setHours(0,0,0,0);
    return o.createdAt >= today;
  });
  const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const ordersCount = todayOrders.length;
  const cashbackEligible = ordersCount >= 1000;

  if (!myShop) {
    return <div className="p-8 text-center">Shop not found. Please setup profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Store className="text-orange-600 mr-2" size={24} />
            <h1 className="text-xl font-bold text-gray-900">{myShop.name}</h1>
          </div>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('queue')}
            className={`pb-4 px-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'queue' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Order Queue ({pendingOrders.length + preparingOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`pb-4 px-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'menu' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Menu Management
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 px-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'analytics' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Analytics & Rewards
          </button>
        </div>

        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending */}
            <div className="bg-gray-100 rounded-2xl p-4 min-h-[500px]">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                <Clock className="mr-2" size={18} /> New Orders ({pendingOrders.length})
              </h3>
              <div className="space-y-4">
                {pendingOrders.map(order => (
                  <motion.div layout key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-gray-500">#{order.id.slice(-6)}</span>
                      <span className="text-xs font-bold text-green-600">Paid: ₹{order.totalAmount}</span>
                    </div>
                    <ul className="text-sm space-y-1 mb-4">
                      {order.items.map(item => (
                        <li key={item.menuItemId} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="Time slot (e.g., 12:30 PM)"
                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        value={timeSlotInput[order.id] || ''}
                        onChange={(e) => setTimeSlotInput({...timeSlotInput, [order.id]: e.target.value})}
                      />
                      <button 
                        onClick={() => handleAcceptOrder(order.id)}
                        className="w-full py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700"
                      >
                        Accept & Assign Slot
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Preparing */}
            <div className="bg-orange-50 rounded-2xl p-4 min-h-[500px]">
              <h3 className="font-bold text-orange-800 mb-4 flex items-center">
                <Store className="mr-2" size={18} /> Preparing ({preparingOrders.length})
              </h3>
              <div className="space-y-4">
                {preparingOrders.map(order => (
                  <motion.div layout key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-gray-500">#{order.id.slice(-6)}</span>
                      <span className="text-xs font-bold text-orange-600">Slot: {order.timeSlot}</span>
                    </div>
                    <ul className="text-sm space-y-1 mb-4">
                      {order.items.map(item => (
                        <li key={item.menuItemId} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      Mark as Ready
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Ready */}
            <div className="bg-green-50 rounded-2xl p-4 min-h-[500px]">
              <h3 className="font-bold text-green-800 mb-4 flex items-center">
                <CheckCircle className="mr-2" size={18} /> Ready for Pickup ({readyOrders.length})
              </h3>
              <div className="space-y-4">
                {readyOrders.map(order => (
                  <motion.div layout key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-green-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-gray-500">#{order.id.slice(-6)}</span>
                      <span className="text-xs font-bold text-green-600">Slot: {order.timeSlot}</span>
                    </div>
                    <ul className="text-sm space-y-1 mb-4">
                      {order.items.map(item => (
                        <li key={item.menuItemId} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                    >
                      Handed Over (Complete)
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Item</h3>
              <form onSubmit={handleAddItem} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500"
                  required
                  min="1"
                />
                <button 
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 flex items-center"
                >
                  <Plus size={18} className="mr-1" /> Add
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myShop.menu.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => toggleAvailability(item.id)}
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {item.isAvailable ? 'Available' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {myShop.menu.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No items in menu yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Today's Sales</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <IndianRupee size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">₹{todaySales}</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Today's Orders</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{ordersCount}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Completed</h3>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <CheckCircle size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{completedOrders.length}</p>
              </div>
            </div>

            {/* Reward Section */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Daily Milestone Reward</h2>
              <p className="text-orange-100 mb-6">Complete 1000 orders today to receive ₹200 cashback directly to your linked account.</p>
              
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Progress: {ordersCount} / 1000</span>
                  <span>{Math.min(100, (ordersCount / 1000) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (ordersCount / 1000) * 100)}%` }}
                  ></div>
                </div>
                
                {cashbackEligible ? (
                  <div className="mt-4 p-3 bg-green-500/30 border border-green-400/50 rounded-lg flex items-center">
                    <CheckCircle className="mr-2" size={20} />
                    <span className="font-bold">Congratulations! You've earned ₹200 cashback today.</span>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-orange-100 text-center">
                    {1000 - ordersCount} more orders to go!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
