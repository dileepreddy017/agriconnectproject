import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string, demoRole?: UserRole) => Promise<boolean>;
  register: (userData: Partial<UserProfile>) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  openAuthModal: (initialRole?: UserRole) => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agriconnect_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default to customer for instant usability
    return {
      id: 'user_cust_1',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'CUSTOMER',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      address: 'Flat 402, Shantiniketan Apts, Sector 14',
      city: 'Udaipur',
      state: 'Rajasthan',
      pincode: '313001'
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agriconnect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agriconnect_user');
    }
  }, [user]);

  const login = async (email: string, password?: string, demoRole?: UserRole): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, demoRole })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const register = async (userData: Partial<UserProfile>): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Register error:', e);
      return false;
    }
  };

  const switchRole = async (newRole: UserRole) => {
    // Quick demo login to the pre-seeded account for that role
    await login('', '', newRole);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || 'CUSTOMER',
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      switchRole,
      updateProfile,
      openAuthModal,
      closeAuthModal,
      isAuthModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
