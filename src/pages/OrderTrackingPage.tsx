import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  ChevronRight, 
  Phone, 
  Star, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Search,
  Check,
  KeyRound,
  Send,
  Navigation,
  Lock,
  MessageSquare
} from 'lucide-react';

interface OrderTrackingPageProps {
  selectedOrderId?: string;
  setSelectedOrderId: (id: string) => void;
  setCurrentTab: (tab: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ 
  selectedOrderId, 
  setSelectedOrderId, 
  setCurrentTab 
}) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Doorstep OTP Verification State
  const [otpInput, setOtpInput] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('Super fresh farm produce! Harvest quality is exceptional.');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        if (selectedOrderId) {
          const found = data.orders.find((o: Order) => o.id === selectedOrderId || o.orderNumber === selectedOrderId);
          if (found) setActiveOrder(found);
          else if (data.orders.length > 0 && !activeOrder) setActiveOrder(data.orders[0]);
        } else if (data.orders.length > 0 && !activeOrder) {
          setActiveOrder(data.orders[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [selectedOrderId]);

  // Status timeline definition
  const timelineSteps: { status: OrderStatus; label: string; icon: string }[] = [
    { status: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', icon: '💳' },
    { status: 'ACCEPTED', label: 'Farmer Accepted', icon: '👨‍🌾' },
    { status: 'PACKED', label: 'Produce Packed', icon: '📦' },
    { status: 'READY_FOR_PICKUP', label: 'Ready at Farm Gate', icon: '🌾' },
    { status: 'PICKED_UP', label: 'Courier Picked Up', icon: '🛵' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '📍' },
    { status: 'DELIVERED', label: 'Delivered (OTP Verified)', icon: '✅' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    const map: Partial<Record<OrderStatus, number>> = {
      CREATED: 0,
      PENDING: 0,
      PAYMENT_CONFIRMED: 0,
      ACCEPTED: 1,
      PACKED: 2,
      READY_FOR_PICKUP: 3,
      ASSIGNED: 3,
      DELIVERY_ASSIGNED: 3,
      PICKED_UP: 4,
      OUT_FOR_DELIVERY: 5,
      DELIVERED: 6,
      CANCELLED: -1,
      REJECTED: -1
    };
    return map[status] ?? 0;
  };

  // Dispatch driver immediately
  const handleDispatchDriver = async () => {
    if (!activeOrder) return;
    try {
      const res = await fetch(`/api/orders/${activeOrder.id}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.order) {
        setActiveOrder(data.order);
        fetchOrders();
        addToast({
          title: '🚚 Courier En Route!',
          message: `Rider Vikram Gurjar is on the way. Share OTP ${data.order.deliveryOtp} at doorstep.`,
          type: 'DELIVERY',
          orderId: data.order.id
        });
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    }
  };

  // Doorstep OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    setOtpError(null);
    setIsVerifyingOtp(true);

    try {
      const res = await fetch(`/api/orders/${activeOrder.id}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: otpInput.trim(),
          recipientName: activeOrder.buyerName
        })
      });
      const data = await res.json();

      if (data.success && data.order) {
        setActiveOrder(data.order);
        setOtpInput('');
        fetchOrders();
        addToast({
          title: '✅ Delivery Verified & Completed!',
          message: 'Doorstep hand-off confirmed successfully with 4-digit security OTP.',
          type: 'DELIVERY',
          orderId: data.order.id
        });
      } else {
        setOtpError(data.error || 'Incorrect OTP. Please check the code provided above.');
      }
    } catch (err: any) {
      setOtpError('Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCopyOtp = () => {
    if (!activeOrder?.deliveryOtp) return;
    navigator.clipboard.writeText(activeOrder.deliveryOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeOrder.id,
          productId: activeOrder.items[0]?.product?.id || 'prod_1',
          userId: user?.id || 'usr_customer_1',
          userName: user?.name || activeOrder.buyerName || 'Priya Sharma',
          rating,
          comment: reviewComment
        })
      });
      setReviewSubmitted(true);
      addToast({
        title: '🌟 Review Submitted!',
        message: 'Thank you for supporting our local farmers with your feedback.',
        type: 'SYSTEM'
      });
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#176b3a] mb-2" />
        <p className="text-xs font-bold">Connecting to Live Delivery Radar...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#eaf7e8] text-[#176b3a] mx-auto flex items-center justify-center text-2xl font-bold">
          📦
        </div>
        <h2 className="text-xl font-extrabold text-[#17351f]">No Active Orders Yet</h2>
        <p className="text-xs text-gray-500">
          Explore fresh harvests in the marketplace and place an order to track real delivery with OTP verification!
        </p>
        <button
          onClick={() => setCurrentTab('marketplace')}
          className="bg-[#176b3a] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#12552e]"
        >
          Explore Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#176b3a] bg-[#eaf7e8] px-3 py-1 rounded-full uppercase tracking-wider">
            Real Delivery Tracking System
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17351f] font-['Poppins',sans-serif] mt-2">
            Live Farm Dispatch & GPS Radar
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time telemetry, driver location, and 4-digit doorstep delivery OTP security verification.
          </p>
        </div>

        {/* Real Dispatch Action */}
        {activeOrder && activeOrder.orderStatus !== 'DELIVERED' && activeOrder.orderStatus !== 'OUT_FOR_DELIVERY' && (
          <button
            onClick={handleDispatchDriver}
            className="bg-[#176b3a] hover:bg-[#12552e] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#176b3a]/20"
          >
            <Truck className="w-4 h-4 text-[#ffd45c]" />
            <span>Dispatch Express Courier</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Orders Selector Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">
              Your Orders ({orders.length})
            </h3>
            <span className="text-[11px] font-bold text-[#176b3a]">
              Live Feed
            </span>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (e.g. AGRI-10001)..."
              className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {orders
              .filter(ord => 
                !searchQuery || 
                ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ord.orderNumber && ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
                ord.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ord.items.some(i => i.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .map(ord => {
              const isSelected = activeOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => { setActiveOrder(ord); setSelectedOrderId(ord.id); }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#176b3a] shadow-md ring-2 ring-[#176b3a]/15'
                      : 'bg-white/80 hover:bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-xs text-[#176b3a]">
                      #{ord.orderNumber || ord.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      ord.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-gray-700 font-bold">
                    {ord.items.map(i => `${i.product?.name || 'Item'} (${i.quantity})`).join(', ')}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                    <span>👨‍🌾 {ord.sellerName}</span>
                    <span className="font-extrabold text-gray-800">₹{ord.totalAmount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Active Order Live Map & Status Timeline (8 cols) */}
        {activeOrder && (
          <div className="lg:col-span-8 space-y-6">
            
            {/* REAL DELIVERY OTP & DRIVER CARD */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e1ede0] shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#eaf7e8] text-[#176b3a] flex items-center justify-center font-bold text-lg shadow-inner">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-base text-[#17351f]">
                        #{activeOrder.orderNumber || activeOrder.id}
                      </span>
                      <span className="bg-[#ffd45c] text-[#19351e] text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                        {activeOrder.orderStatus === 'DELIVERED' ? 'DELIVERED' : 'EXPRESS FLEET'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Carrier: <strong>{activeOrder.carrierName || 'AgriConnect Express Fleet'}</strong> • Tracking: <span className="font-mono">{activeOrder.trackingNumber || 'ACHE-984210'}</span>
                    </p>
                  </div>
                </div>

                {/* 4-Digit Secure Delivery OTP */}
                <div className="bg-[#f5faf3] p-3 rounded-2xl border border-[#a8d95b] flex items-center gap-3 shrink-0">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#176b3a] block">Doorstep OTP</span>
                    <div className="text-2xl font-mono font-black text-[#17351f] tracking-wider">
                      {activeOrder.deliveryOtp || '8942'}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyOtp}
                    title="Copy OTP"
                    className="p-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold flex items-center gap-1 shadow-2xs"
                  >
                    {copiedOtp ? <Check className="w-4 h-4 text-emerald-600" /> : <KeyRound className="w-4 h-4 text-[#176b3a]" />}
                    <span>{copiedOtp ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Delivery Partner Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#f8faf7] p-4 rounded-2xl border border-gray-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned Delivery Partner</span>
                  <p className="font-extrabold text-sm text-[#17351f]">{activeOrder.deliveryPartnerName || 'Vikram Gurjar'}</p>
                  <p className="text-gray-500">{activeOrder.deliveryPartnerVehicle || 'Hero Electric Cargo Bike (RJ-27-EK-8942)'}</p>
                </div>
                <div className="flex items-center sm:justify-end gap-2">
                  <a
                    href={`tel:${activeOrder.deliveryPartnerPhone || '+919414088990'}`}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#176b3a] border border-[#a8d95b] px-3.5 py-2 rounded-xl font-bold text-xs shadow-2xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Driver ({activeOrder.deliveryPartnerPhone || '+91 94140 88990'})</span>
                  </a>
                </div>
              </div>

              {/* Doorstep OTP Verification Form (for completing delivery) */}
              {activeOrder.orderStatus !== 'DELIVERED' ? (
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-[#176b3a]" />
                      Doorstep OTP Hand-off Verification
                    </span>
                    <span className="text-[11px] text-emerald-700">Required at package receipt</span>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="flex flex-col sm:flex-row items-center gap-2.5">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder={`Enter 4-digit OTP (${activeOrder.deliveryOtp})`}
                      className="w-full sm:w-64 px-4 py-2 bg-white rounded-xl border border-emerald-300 text-xs font-mono font-bold text-center tracking-widest focus:outline-none focus:border-[#176b3a]"
                    />
                    <button
                      type="submit"
                      disabled={isVerifyingOtp || otpInput.length < 4}
                      className="w-full sm:w-auto bg-[#176b3a] hover:bg-[#12552e] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isVerifyingOtp ? 'Verifying...' : 'Verify OTP & Complete Delivery'}</span>
                    </button>
                  </form>
                  {otpError && (
                    <p className="text-xs text-rose-600 font-bold">{otpError}</p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>✓ Proof of Delivery Verified with Security OTP • Handed over to {activeOrder.proofOfDelivery?.recipientName || activeOrder.buyerName}</span>
                </div>
              )}

            </div>

            {/* LIVE GPS MAP */}
            <LiveTrackingMap order={activeOrder} />

            {/* STATUS TIMELINE STEPPER */}
            <div className="bg-white rounded-3xl p-6 border border-[#e1ede0] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-base text-[#17351f] font-['Poppins',sans-serif]">
                  Order Journey Timeline
                </h3>
                <span className="text-xs text-gray-500">
                  Updated: {new Date(activeOrder.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {timelineSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(activeOrder.orderStatus);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={step.status}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                        isCurrent
                          ? 'bg-[#eaf7e8] border-[#176b3a] shadow-xs ring-2 ring-[#176b3a]/20'
                          : isCompleted
                          ? 'bg-white border-emerald-200 text-gray-700'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="text-xl mb-1">{step.icon}</div>
                      <span className={`text-[11px] font-bold leading-tight ${isCurrent ? 'text-[#176b3a]' : 'text-gray-700'}`}>
                        {step.label}
                      </span>
                      <div className="mt-2">
                        {isCompleted ? (
                          <span className="text-[10px] font-extrabold text-emerald-700 flex items-center gap-0.5 justify-center">
                            <Check className="w-3 h-3 text-emerald-600" /> Done
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ORDER DETAILS ACCORDION */}
            <div className="bg-white rounded-3xl p-6 border border-[#e1ede0] shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-[#17351f]">
                Crate Items & Breakdown
              </h3>

              <div className="space-y-3">
                {activeOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
                        <img 
                          src={it.product?.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'} 
                          alt={it.product?.name || 'Produce'} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{it.product?.name || 'Fresh Produce'}</p>
                        <p className="text-gray-400 text-[11px]">Quantity: {it.quantity} {it.product?.unit || 'kg'}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-800">
                      ₹{(it.priceSnapshot || it.product?.price || 0) * it.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-600">Total Amount ({activeOrder.paymentMethod}):</span>
                <span className="text-base font-extrabold text-[#176b3a]">₹{activeOrder.totalAmount}</span>
              </div>
            </div>

            {/* CUSTOMER REVIEW SUBMISSION (When delivered) */}
            {activeOrder.orderStatus === 'DELIVERED' && (
              <div className="bg-white rounded-3xl p-6 border border-[#e1ede0] shadow-xs space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#17351f]">
                    Rate Harvest Freshness & Delivery
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {reviewSubmitted ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold text-center">
                    ✓ Thank you for supporting {activeOrder.sellerName} with your honest review!
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <textarea
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your feedback regarding harvest taste, crispness, and delivery..."
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:border-[#176b3a]"
                    />

                    <button
                      type="submit"
                      className="bg-[#176b3a] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#12552e]"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
