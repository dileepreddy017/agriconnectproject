import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppNotification } from '../types';
import { useAuth } from './AuthContext';

interface Toast {
  id: string;
  title: string;
  message: string;
  type?: 'ORDER' | 'DELIVERY' | 'PAYMENT' | 'SYSTEM';
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'ORDER' | 'DELIVERY' | 'PAYMENT' | 'SYSTEM') => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  fetchNotifications: () => Promise<void>;
  lastEvent: { type: string; data: any } | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastEvent, setLastEvent] = useState<{ type: string; data: any } | null>(null);

  const showToast = useCallback((title: string, message: string, type: 'ORDER' | 'DELIVERY' | 'PAYMENT' | 'SYSTEM' = 'SYSTEM') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const url = user ? `/api/notifications?userId=${user.id}&role=${user.role}` : '/api/notifications';
      const res = await fetch(url);
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Connect to SSE for cross-device realtime synchronization
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');

      eventSource.addEventListener('connected', () => {
        // SSE connected
      });

      eventSource.addEventListener('NOTIFICATION', (e) => {
        const notif: AppNotification = JSON.parse(e.data);
        if (notif.userId === 'ALL' || notif.userId === user?.id || notif.roleTarget === user?.role) {
          setNotifications(prev => [notif, ...prev]);
          showToast(notif.title, notif.message, notif.type);
        }
        setLastEvent({ type: 'NOTIFICATION', data: notif });
      });

      eventSource.addEventListener('ORDER_CREATED', (e) => {
        const order = JSON.parse(e.data);
        setLastEvent({ type: 'ORDER_CREATED', data: order });
        if (user?.role === 'FARMER' && user.id === order.sellerId) {
          showToast('🔔 New Harvest Order Received!', `Order ${order.orderNumber} placed for ₹${order.totalAmount}`, 'ORDER');
        } else if (user?.role === 'ADMIN') {
          showToast('🛒 Platform Order Created', `${order.buyerName} placed ${order.orderNumber}`, 'ORDER');
        }
      });

      eventSource.addEventListener('ORDER_UPDATED', (e) => {
        const order = JSON.parse(e.data);
        setLastEvent({ type: 'ORDER_UPDATED', data: order });
        if (user?.id === order.buyerId) {
          showToast(`📦 Order Status: ${order.orderStatus}`, `Your order ${order.orderNumber} is now ${order.orderStatus.replace(/_/g, ' ')}`, 'DELIVERY');
        } else if (user?.role === 'DELIVERY' && order.orderStatus === 'READY_FOR_PICKUP') {
          showToast('🛵 Delivery Assignment Available!', `Pickup ready at ${order.sellerName} for ${order.orderNumber}`, 'DELIVERY');
        }
      });

      eventSource.addEventListener('GPS_UPDATED', (e) => {
        const payload = JSON.parse(e.data);
        setLastEvent({ type: 'GPS_UPDATED', data: payload });
      });

      eventSource.addEventListener('PRODUCT_CREATED', (e) => {
        const prod = JSON.parse(e.data);
        setLastEvent({ type: 'PRODUCT_CREATED', data: prod });
      });

      eventSource.onerror = () => {
        // Reconnection will happen automatically by browser EventSource
      };
    } catch (err) {
      console.warn('SSE not initialized:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [user, showToast]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (e) {
      // ignore
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (e) {
      // ignore
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      toasts,
      dismissToast,
      showToast,
      markAsRead,
      markAllAsRead,
      fetchNotifications,
      lastEvent
    }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#0d3d20] text-white p-4 rounded-xl shadow-2xl border border-[#2b6e41] flex items-start gap-3 transition-all animate-bounce-in"
          >
            <div className="text-xl shrink-0 mt-0.5">
              {toast.type === 'ORDER' ? '🌾' : toast.type === 'DELIVERY' ? '🛵' : toast.type === 'PAYMENT' ? '💳' : '🌱'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-[#b7e66c] leading-tight">{toast.title}</h4>
              <p className="text-xs text-gray-200 mt-0.5 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
