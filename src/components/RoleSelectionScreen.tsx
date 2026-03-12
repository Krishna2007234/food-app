import React from 'react';
import { useStore } from '../StoreContext';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Users, Store } from 'lucide-react';
import { Role } from '../types';

export const RoleSelectionScreen: React.FC = () => {
  const { setRole } = useStore();

  const roles: { id: Role; title: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'student', title: 'Student', icon: <GraduationCap size={32} />, desc: 'Order from campus shops' },
    { id: 'teacher', title: 'Teacher', icon: <BookOpen size={32} />, desc: 'Quick campus ordering' },
    { id: 'public', title: 'General Public', icon: <Users size={32} />, desc: 'Discover city restaurants' },
    { id: 'shop_owner', title: 'Shop Owner', icon: <Store size={32} />, desc: 'Manage your shop & orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Who are you?</h2>
          <p className="text-gray-500 mt-3 text-lg">Select your role to personalize your experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, idx) => (
            <motion.button
              key={role.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setRole(role.id)}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                {role.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
              <p className="text-gray-500 text-sm">{role.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
