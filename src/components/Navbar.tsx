import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Sprout, 
  ShoppingCart, 
  Bell, 
  User, 
  LogOut, 
  ShieldCheck, 
  Truck, 
  Wheat, 
  CloudSun, 
  Bot, 
  ShoppingBag, 
  Menu, 
  X,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, role, logout, switchRole, openAuthModal } = useAuth();
  const { itemsCount, setIsCartDrawerOpen } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, badge: 'Farm Fresh' },
    { id: 'agri-store', label: 'Agri Store', icon: Wheat, badge: 'Supplies' },
    { id: 'weather-mandi', label: 'Mandi & Weather', icon: CloudSun },
    { id: 'ai-doctor', label: 'AI Crop Doctor', icon: Bot, badge: 'Gemini AI' },
    { id: 'orders', label: 'My Orders', icon: Truck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e2ece2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#176b3a] to-[#79bd45] flex items-center justify-center text-white shadow-md shadow-[#176b3a]/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-[#176b3a] font-['Poppins',sans-serif] block leading-none">
              Agri<span className="text-[#64aa2e]">Connect</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase block mt-0.5">
              Smart Agriculture Hub
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  active 
                    ? 'text-[#176b3a] bg-[#eaf7e8]' 
                    : 'text-[#405449] hover:text-[#176b3a] hover:bg-[#f3f9f2]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#176b3a]' : 'text-gray-400'}`} />
                {item.label}
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.badge === 'Gemini AI'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-[#d8f0d0] text-[#176b3a]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Role Dashboard Button */}
          {role === 'FARMER' && (
            <button
              onClick={() => setCurrentTab('farmer-dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'farmer-dashboard'
                  ? 'bg-[#176b3a] text-white'
                  : 'bg-[#eaf7e8] text-[#176b3a] border border-[#c4e6be] hover:bg-[#176b3a] hover:text-white'
              }`}
            >
              <Wheat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Farmer Dashboard</span>
              <span className="sm:hidden">Farmer</span>
            </button>
          )}

          {role === 'DELIVERY' && (
            <button
              onClick={() => setCurrentTab('delivery-dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'delivery-dashboard'
                  ? 'bg-[#f39a3d] text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-[#f39a3d] hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delivery Partner</span>
              <span className="sm:hidden">Delivery</span>
            </button>
          )}

          {role === 'ADMIN' && (
            <button
              onClick={() => setCurrentTab('admin-dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'admin-dashboard'
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-700 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Admin</span>
            </button>
          )}

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsUserMenuOpen(false); }}
              className="relative p-2 rounded-xl text-[#405449] hover:bg-[#f0f7ef] transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-fade-in">
                <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#17351f]">Notifications</h3>
                    <span className="bg-[#eaf7e8] text-[#176b3a] text-xs px-2 py-0.5 rounded-full font-bold">
                      {notifications.length}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#176b3a] font-semibold hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => { markAsRead(n.id); if (n.orderId) setCurrentTab('orders'); }}
                        className={`p-3 hover:bg-[#f9fbf9] cursor-pointer transition-colors ${!n.read ? 'bg-[#f4faf2]' : ''}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-base shrink-0 mt-0.5">
                            {n.type === 'ORDER' ? '🌾' : n.type === 'DELIVERY' ? '🛵' : n.type === 'PAYMENT' ? '💳' : '🌱'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[#17351f] flex items-center justify-between">
                              {n.title}
                              <span className="text-[10px] text-gray-400 font-normal">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </h4>
                            <p className="text-xs text-gray-600 mt-0.5 leading-snug">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2.5 rounded-xl bg-[#ffd45c] text-[#183a21] hover:bg-[#f3c644] transition-all flex items-center gap-1.5 font-bold text-sm shadow-xs"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline font-bold">Cart</span>
            {itemsCount > 0 && (
              <span className="w-5 h-5 bg-[#e34b35] text-white text-xs font-extrabold rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsNotifOpen(false); }}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-[#dce8dc] hover:bg-[#f5faf4] transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-[#b2d9a6]"
                />
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-[#17351f] block leading-tight truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-semibold text-[#176b3a] uppercase block">
                    {user.role}
                  </span>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50">
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="font-bold text-sm text-[#17351f] truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-[#eaf7e8] text-[#176b3a] rounded-full uppercase">
                      Active Role: {user.role}
                    </span>
                  </div>

                  <div className="py-2 px-2">
                    <p className="text-[11px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
                      Switch Demo Role
                    </p>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <button
                        onClick={() => { switchRole('CUSTOMER'); setIsUserMenuOpen(false); setCurrentTab('marketplace'); }}
                        className={`p-2 rounded-lg text-xs font-semibold text-left transition-all ${user.role === 'CUSTOMER' ? 'bg-[#eaf7e8] text-[#176b3a] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        👩 Customer
                      </button>
                      <button
                        onClick={() => { switchRole('FARMER'); setIsUserMenuOpen(false); setCurrentTab('farmer-dashboard'); }}
                        className={`p-2 rounded-lg text-xs font-semibold text-left transition-all ${user.role === 'FARMER' ? 'bg-[#eaf7e8] text-[#176b3a] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        👨‍🌾 Farmer
                      </button>
                      <button
                        onClick={() => { switchRole('DELIVERY'); setIsUserMenuOpen(false); setCurrentTab('delivery-dashboard'); }}
                        className={`p-2 rounded-lg text-xs font-semibold text-left transition-all ${user.role === 'DELIVERY' ? 'bg-[#eaf7e8] text-[#176b3a] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        🛵 Delivery
                      </button>
                      <button
                        onClick={() => { switchRole('ADMIN'); setIsUserMenuOpen(false); setCurrentTab('admin-dashboard'); }}
                        className={`p-2 rounded-lg text-xs font-semibold text-left transition-all ${user.role === 'ADMIN' ? 'bg-[#eaf7e8] text-[#176b3a] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        🛡️ Admin
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-2 px-2">
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="bg-[#176b3a] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-[#12552e] transition-all flex items-center gap-1.5 shadow-md shadow-[#176b3a]/20"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-2 animate-fade-in">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold ${
                  active ? 'bg-[#eaf7e8] text-[#176b3a]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#176b3a]" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#d8f0d0] text-[#176b3a]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
