import React, { useState, useEffect, useRef } from 'react';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  Play, 
  Pause, 
  Sparkles, 
  Smartphone,
  ShieldCheck,
  Radio,
  Clock,
  RefreshCw,
  KeyRound,
  AlertCircle
} from 'lucide-react';

interface DeliveryDashboardPageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedOrderId: (id: string) => void;
}

export const DeliveryDashboardPage: React.FC<DeliveryDashboardPageProps> = ({ setCurrentTab, setSelectedOrderId }) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeMission, setActiveMission] = useState<Order | null>(null);
  const [isSimulatingGps, setIsSimulatingGps] = useState(false);
  const [gpsProgress, setGpsProgress] = useState(0);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const simIntervalRef = useRef<any>(null);

  const fetchDeliveryOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        // Find active order in progress
        const inProgress = data.orders.find((o: Order) => 
          o.orderStatus === 'OUT_FOR_DELIVERY' || 
          o.orderStatus === 'PICKED_UP' || 
          o.orderStatus === 'READY_FOR_PICKUP' || 
          o.orderStatus === 'ACCEPTED'
        );
        if (inProgress) {
          setActiveMission(inProgress);
          setGpsProgress(inProgress.simulatedGps?.progressPercent || 0);
        } else if (data.orders.length > 0 && !activeMission) {
          setActiveMission(data.orders[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDeliveryOrders();
    const interval = setInterval(fetchDeliveryOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update order status on server
  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          partnerId: user?.id || 'user_del_1',
          partnerName: user?.name || 'Vikram Gurjar',
          partnerPhone: user?.phone || '+91 94140 88990',
          partnerVehicle: 'Hero Electric Cargo Bike (RJ-27-EK-8942)'
        })
      });
      fetchDeliveryOrders();
      addToast({
        title: '🛵 Delivery Status Updated',
        message: `Order marked as ${status.replace(/_/g, ' ')}`,
        type: 'DELIVERY'
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Push GPS coordinate telemetry update to server
  const sendGpsTelemetry = async (progressPercent: number) => {
    if (!activeMission) return;
    const distanceTotal = 6.8;
    const remainingKm = Number((distanceTotal * (1 - progressPercent / 100)).toFixed(1));
    const estMins = Math.max(1, Math.round(25 * (1 - progressPercent / 100)));

    try {
      await fetch(`/api/orders/${activeMission.id}/gps`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressPercent,
          currentLat: 24.6210 - (24.6210 - 24.5854) * (progressPercent / 100),
          currentLng: 73.6800 + (73.7125 - 73.6800) * (progressPercent / 100),
          estimatedMinutes: estMins,
          distanceRemainingKm: remainingKm
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Live GPS Transit navigation
  const toggleGpsSimulation = () => {
    if (isSimulatingGps) {
      clearInterval(simIntervalRef.current);
      setIsSimulatingGps(false);
    } else {
      setIsSimulatingGps(true);
      if (activeMission && activeMission.orderStatus !== 'OUT_FOR_DELIVERY') {
        updateStatus(activeMission.id, 'OUT_FOR_DELIVERY');
      }

      simIntervalRef.current = setInterval(() => {
        setGpsProgress((prev) => {
          const next = prev + 5;
          sendGpsTelemetry(Math.min(100, next));
          if (next >= 100) {
            clearInterval(simIntervalRef.current);
            setIsSimulatingGps(false);
            return 100;
          }
          return next;
        });
      }, 1200);
    }
  };

  // Verify OTP at doorstep
  const handleVerifyDeliveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMission) return;
    setOtpError(null);
    setIsVerifying(true);

    try {
      const res = await fetch(`/api/orders/${activeMission.id}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: otpInput.trim(),
          recipientName: activeMission.buyerName
        })
      });
      const data = await res.json();
      if (data.success && data.order) {
        setActiveMission(data.order);
        setOtpInput('');
        setGpsProgress(100);
        fetchDeliveryOrders();
        addToast({
          title: '✅ Doorstep Delivery Completed!',
          message: `Order #${data.order.orderNumber || data.order.id} verified with customer OTP.`,
          type: 'DELIVERY'
        });
      } else {
        setOtpError(data.error || 'Invalid OTP code. Ask customer for 4-digit code shown on tracking screen.');
      }
    } catch (err: any) {
      setOtpError('Server verification error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    return () => clearInterval(simIntervalRef.current);
  }, []);

  const completedCount = orders.filter(o => o.orderStatus === 'DELIVERED').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Fleet Driver Profile Card */}
      <div className="bg-gradient-to-r from-[#17301c] to-[#254f30] rounded-3xl p-5 sm:p-7 text-white shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ffd45c] text-[#19351e] flex items-center justify-center text-2xl font-bold shadow-md">
            🛵
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#ffd45c] uppercase">
              <span>AgriConnect Express Fleet Rider</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-['Poppins',sans-serif]">
              {user?.name || 'Vikram Gurjar'}
            </h1>
            <p className="text-xs text-[#cadfcb]">Hero Electric Cargo Bike (RJ-27-EK-8942) • Udaipur Hub</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-300 font-bold uppercase block">Today's Earnings</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#b7e66c]">
            ₹{completedCount * 45 + 320}
          </div>
          <span className="text-[11px] text-gray-300">{completedCount} Delivered Crates</span>
        </div>
      </div>

      {/* ACTIVE MISSION CARD */}
      {activeMission ? (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#176b3a] shadow-xl space-y-5">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-extrabold text-sm text-[#17351f]">
                Active Dispatch Mission: #{activeMission.orderNumber || activeMission.id}
              </span>
            </div>
            <span className="bg-[#eaf7e8] text-[#176b3a] text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              {activeMission.orderStatus.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Route Pins */}
          <div className="space-y-3 bg-[#f8faf7] p-4 rounded-2xl border border-gray-200">
            {/* Pickup Farm */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#176b3a] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                🌾
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">1. Farm Gate Pickup</span>
                <p className="font-bold text-xs text-gray-800">{activeMission.sellerName}</p>
                <p className="text-xs text-gray-500">{activeMission.farmLocation}</p>
              </div>
            </div>

            <div className="w-[2px] h-4 bg-gray-300 ml-3.5" />

            {/* Dropoff Customer */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#e34b35] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                🏠
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">2. Customer Destination</span>
                <p className="font-bold text-xs text-gray-800">{activeMission.buyerName} ({activeMission.buyerPhone})</p>
                <p className="text-xs text-gray-500">{activeMission.buyerAddress}</p>
              </div>
            </div>
          </div>

          {/* GPS Transit Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-600">Route Transit Progress:</span>
              <span className="text-[#176b3a]">{gpsProgress}% Completed</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#79bd45] to-[#176b3a] h-full transition-all duration-500"
                style={{ width: `${gpsProgress}%` }}
              />
            </div>
          </div>

          {/* REAL DELIVERY ACTIONS & DOORSTEP OTP FORM */}
          <div className="space-y-3 pt-2">
            
            {activeMission.orderStatus === 'READY_FOR_PICKUP' && (
              <button
                onClick={() => updateStatus(activeMission.id, 'PICKED_UP')}
                className="w-full bg-[#176b3a] text-white py-3 rounded-xl font-extrabold text-sm hover:bg-[#12552e] shadow-md flex items-center justify-center gap-2"
              >
                <span>🌾 Confirm Harvest Pickup from Farm Gate</span>
              </button>
            )}

            {(activeMission.orderStatus === 'PICKED_UP' || activeMission.orderStatus === 'OUT_FOR_DELIVERY') && (
              <div className="space-y-3">
                <button
                  onClick={toggleGpsSimulation}
                  className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isSimulatingGps
                      ? 'bg-amber-500 text-white hover:bg-amber-600 animate-pulse'
                      : 'bg-[#ffd45c] hover:bg-[#ffca36] text-[#19351e]'
                  }`}
                >
                  {isSimulatingGps ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isSimulatingGps ? 'Pause GPS Telemetry' : '📍 Start Live GPS Transit Telemetry'}</span>
                </button>

                {/* Secure OTP Verification Form for Driver at Doorstep */}
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-[#176b3a]" />
                      Doorstep Customer OTP Hand-Off
                    </span>
                    <span className="text-[11px] text-emerald-700">Ask recipient for 4-digit code</span>
                  </div>

                  <form onSubmit={handleVerifyDeliveryOtp} className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit OTP"
                      className="flex-1 px-4 py-2.5 bg-white rounded-xl border border-emerald-300 text-sm font-mono font-bold text-center tracking-widest focus:outline-none focus:border-[#176b3a]"
                    />
                    <button
                      type="submit"
                      disabled={isVerifying || otpInput.length < 4}
                      className="bg-[#176b3a] hover:bg-[#12552e] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isVerifying ? 'Verifying...' : 'Verify & Deliver'}</span>
                    </button>
                  </form>

                  {otpError && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{otpError}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMission.orderStatus === 'DELIVERED' && (
              <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>✓ Order delivered and OTP verified with recipient!</span>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedOrderId(activeMission.id);
                setCurrentTab('orders');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-semibold"
            >
              View on Public Live GPS Radar
            </button>

          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 text-gray-400">
          <Truck className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="font-bold text-sm text-gray-600">No active delivery mission</p>
          <p className="text-xs">Select any order below to accept dispatch.</p>
        </div>
      )}

      {/* ALL AVAILABLE PICKUP ORDERS LIST */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e1ede0] shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-[#17351f] flex items-center justify-between">
          <span>Recent Dispatch Orders</span>
          <span className="text-xs text-[#176b3a] bg-[#eaf7e8] font-bold px-2 py-0.5 rounded-full">
            {orders.length} Total
          </span>
        </h3>

        <div className="space-y-3">
          {orders.map(ord => (
            <div
              key={ord.id}
              onClick={() => setActiveMission(ord)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                activeMission?.id === ord.id
                  ? 'border-[#176b3a] bg-[#f7fbf6]'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-xs text-[#176b3a]">#{ord.orderNumber || ord.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 uppercase">
                    {ord.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-800 mt-1">
                  {ord.items.map(i => `${i.product?.name || 'Item'} (${i.quantity})`).join(', ')}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Farm: {ord.sellerName} ➔ Customer: {ord.buyerName}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold text-[#176b3a]">₹{ord.totalAmount}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMission(ord);
                  }}
                  className="block mt-1 text-[11px] text-[#176b3a] font-bold hover:underline"
                >
                  Select Mission ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
