import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { motion } from 'motion/react';
import { Building2, MapPin, Store, ArrowRight } from 'lucide-react';

export const ProfileSetupScreen: React.FC = () => {
  const { user, updateProfile, addShop } = useStore();
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  
  const isStudentOrTeacher = user?.role === 'student' || user?.role === 'teacher';
  const isShopOwner = user?.role === 'shop_owner';
  const isPublic = user?.role === 'public';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStudentOrTeacher) {
      updateProfile({ name, university });
    } else if (isPublic) {
      updateProfile({ name });
    } else if (isShopOwner) {
      updateProfile({ name });
      addShop({
        name: shopName,
        address: shopAddress,
        university: university || undefined,
        location: { lat: 28.6, lng: 77.2 }, // Mock location
        menu: []
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Complete Profile</h2>
          <p className="text-gray-500 mt-2">Just a few more details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="John Doe"
              required
            />
          </div>

          {isStudentOrTeacher && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="e.g., Delhi University"
                  required
                />
              </div>
            </div>
          )}

          {isShopOwner && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="e.g., Campus Canteen"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="e.g., Main Block, Ground Floor"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">University (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="If shop is inside a university"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
