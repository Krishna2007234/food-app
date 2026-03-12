import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { motion } from 'motion/react';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useStore();
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      login(phone);
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
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to continue to QuickBite</p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter your 10-digit number"
                  required
                  pattern="[0-9]{10}"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Send OTP
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors text-center tracking-widest text-lg"
                  placeholder="1234"
                  required
                  maxLength={4}
                />
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                OTP sent to {phone}. <button type="button" onClick={() => setOtpSent(false)} className="text-orange-600 hover:underline">Change</button>
              </p>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Verify & Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
