import React, { useState } from 'react';
import { StoreProvider, useStore } from './StoreContext';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { RoleSelectionScreen } from './components/RoleSelectionScreen';
import { ProfileSetupScreen } from './components/ProfileSetupScreen';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ShopOwnerDashboard } from './components/ShopOwnerDashboard';

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useStore();

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (!user.role) {
    return <RoleSelectionScreen />;
  }

  // Check if profile setup is complete
  const isStudentOrTeacher = user.role === 'student' || user.role === 'teacher';
  const isPublic = user.role === 'public';
  const isShopOwner = user.role === 'shop_owner';

  const needsProfileSetup = 
    (isStudentOrTeacher && (!user.name || !user.university)) ||
    (isPublic && !user.name) ||
    (isShopOwner && !user.name); // We also need shop details, but we handle that in ProfileSetup

  if (needsProfileSetup) {
    return <ProfileSetupScreen />;
  }

  if (isShopOwner) {
    return <ShopOwnerDashboard />;
  }

  return <CustomerDashboard />;
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
