import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';

import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Product } from './types';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AgriStorePage } from './pages/AgriStorePage';
import { CartCheckoutPage } from './pages/CartCheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { DeliveryDashboardPage } from './pages/DeliveryDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { WeatherMandiPage } from './pages/WeatherMandiPage';
import { AiDoctorPage } from './pages/AiDoctorPage';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('AGRI-10001');
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const { toasts, removeToast } = useNotification();

  const renderActivePage = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage setCurrentTab={setCurrentTab} />;
      case 'marketplace':
        return <MarketplacePage setCurrentTab={setCurrentTab} />;
      case 'agri-store':
        return <AgriStorePage setCurrentTab={setCurrentTab} />;
      case 'checkout':
        return <CartCheckoutPage setCurrentTab={setCurrentTab} setSelectedOrderId={setSelectedOrderId} />;
      case 'orders':
        return (
          <OrderTrackingPage 
            selectedOrderId={selectedOrderId} 
            setSelectedOrderId={setSelectedOrderId} 
            setCurrentTab={setCurrentTab} 
          />
        );
      case 'farmer-dashboard':
        return <FarmerDashboardPage setCurrentTab={setCurrentTab} />;
      case 'delivery-dashboard':
        return <DeliveryDashboardPage setCurrentTab={setCurrentTab} setSelectedOrderId={setSelectedOrderId} />;
      case 'admin-dashboard':
        return <AdminDashboardPage setCurrentTab={setCurrentTab} />;
      case 'weather-mandi':
        return <WeatherMandiPage />;
      case 'ai-doctor':
        return <AiDoctorPage />;
      default:
        return <HomePage setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf6] text-[#17351f] font-sans antialiased selection:bg-[#cbe9c7]">
      
      {/* Top Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
      />

      {/* Main Page Render */}
      <main className="flex-1">
        {renderActivePage()}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Global Slide-In Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setCurrentTab('checkout')} />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <ProductDetailModal
          product={selectedProductModal}
          onClose={() => setSelectedProductModal(null)}
          onQuickBuy={() => {
            setSelectedProductModal(null);
            setCurrentTab('marketplace');
          }}
        />
      )}


      {/* Toast Notification Stream Portal */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#cbe4c7] shadow-xl text-xs flex items-start gap-3 animate-slide-left"
          >
            <span className="text-xl shrink-0 mt-0.5">
              {t.type === 'ORDER' ? '🌾' : t.type === 'DELIVERY' ? '🛵' : '🌱'}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-[#17351f]">{t.title}</h4>
              <p className="text-gray-600 mt-0.5 leading-snug">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 font-bold"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
