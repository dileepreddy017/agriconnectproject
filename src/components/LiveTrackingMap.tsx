import React from 'react';
import { Order, SimulatedGPS } from '../types';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Radio, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Sparkles,
  Phone,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface LiveTrackingMapProps {
  order: Order;
  onSimulateStep?: (progressPercent: number) => void;
  isDeliveryView?: boolean;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ order, onSimulateStep, isDeliveryView = false }) => {
  const gps = order.simulatedGps || {
    active: false,
    progressPercent: 0,
    currentLat: 24.6210,
    currentLng: 73.6800,
    farmerLat: 24.6210,
    farmerLng: 73.6800,
    customerLat: 24.5854,
    customerLng: 73.7125,
    estimatedMinutes: 25,
    distanceRemainingKm: 6.8
  };

  const progress = Math.min(100, Math.max(0, gps.progressPercent || 0));

  // Visual SVG coordinates mapping
  // Start (Farm): top-left area (X: 80, Y: 60)
  // End (Customer): bottom-right area (X: 520, Y: 220)
  const startX = 80;
  const startY = 70;
  const endX = 520;
  const endY = 220;

  // Curvature route waypoints
  // Route goes: (80,70) -> (180, 110) -> (310, 85) -> (420, 180) -> (520, 220)
  // We calculate current bike marker position along the curved path based on progress %
  const currentX = startX + (endX - startX) * (progress / 100);
  // Quadratic-like elevation offset for realistic road contour
  const arcOffset = Math.sin((progress / 100) * Math.PI) * 35;
  const currentY = startY + (endY - startY) * (progress / 100) - arcOffset;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e1ede0] shadow-md space-y-4">
      {/* Map Header Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className={`w-3 h-3 rounded-full ${order.orderStatus === 'DELIVERED' ? 'bg-emerald-500' : progress > 0 ? 'bg-amber-500 animate-ping' : 'bg-gray-400'}`} />
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#17351f] font-['Poppins',sans-serif] flex items-center gap-1.5">
              <span>Live GPS Delivery Radar</span>
              <span className="text-[10px] bg-[#eaf7e8] text-[#176b3a] font-bold px-2 py-0.5 rounded-full uppercase">
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              {order.orderStatus === 'DELIVERED'
                ? 'Package has reached your doorstep successfully!'
                : progress > 0
                ? 'Delivery partner is navigating towards destination'
                : 'Waiting for pickup dispatch at farm'}
            </p>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center gap-3 bg-[#f6faf5] px-3.5 py-1.5 rounded-xl border border-[#e0ece0]">
          <div className="text-right">
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Distance</span>
            <span className="font-extrabold text-xs sm:text-sm text-[#176b3a]">
              {order.orderStatus === 'DELIVERED' ? '0.0 km' : `${gps.distanceRemainingKm || 0} km`}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-gray-200" />
          <div className="text-right">
            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Estimated ETA</span>
            <span className="font-extrabold text-xs sm:text-sm text-[#17351f] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {order.orderStatus === 'DELIVERED' ? 'Arrived' : `${gps.estimatedMinutes || 0} mins`}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Canvas Map */}
      <div className="relative w-full h-72 sm:h-80 bg-[#eaf4ea] rounded-2xl overflow-hidden border border-[#d2e7d0] shadow-inner">
        {/* Map Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#176b3a 1px, transparent 1px), radial-gradient(#176b3a 1px, #eaf4ea 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Geographic Zones & Road Networks */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
          {/* Secondary road arteries */}
          <path d="M 0 100 Q 150 140 300 120 T 600 160" fill="none" stroke="#d5e8d4" strokeWidth="6" />
          <path d="M 120 0 Q 200 150 250 300" fill="none" stroke="#d5e8d4" strokeWidth="6" />
          <path d="M 450 0 Q 400 160 500 300" fill="none" stroke="#d5e8d4" strokeWidth="6" />

          {/* Lake Pichola / Fatehsagar green zone decoration */}
          <ellipse cx="280" cy="180" rx="65" ry="35" fill="#cbe6ca" opacity="0.7" />
          <text x="250" y="185" fill="#4d7c4a" fontSize="10" fontWeight="bold">Lake Area</text>

          {/* Primary Route Path (Dashed background) */}
          <path
            d={`M ${startX} ${startY} Q 200 60 300 110 T ${endX} ${endY}`}
            fill="none"
            stroke="#94b892"
            strokeWidth="5"
            strokeDasharray="6,6"
          />

          {/* Active Travelled Route Segment */}
          <path
            d={`M ${startX} ${startY} Q 200 60 300 110 T ${endX} ${endY}`}
            fill="none"
            stroke="#176b3a"
            strokeWidth="6"
            strokeDasharray="1000"
            strokeDashoffset={1000 - (1000 * (progress / 100))}
            strokeLinecap="round"
          />

          {/* START PIN: Farmer (Badgaon Farm) */}
          <g transform={`translate(${startX}, ${startY})`}>
            <circle r="22" fill="#176b3a" opacity="0.15" />
            <circle r="12" fill="#176b3a" />
            <text x="0" y="4" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">🌾</text>
            <rect x="-45" y="16" width="90" height="20" rx="6" fill="white" stroke="#176b3a" strokeWidth="1" />
            <text x="0" y="30" fill="#176b3a" fontSize="9" fontWeight="bold" textAnchor="middle">
              {order.sellerName.split(' ')[0]} Farm
            </text>
          </g>

          {/* DESTINATION PIN: Customer Residence */}
          <g transform={`translate(${endX}, ${endY})`}>
            <circle r="22" fill="#e34b35" opacity="0.15" />
            <circle r="12" fill="#e34b35" />
            <text x="0" y="4" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">🏠</text>
            <rect x="-45" y="16" width="90" height="20" rx="6" fill="white" stroke="#e34b35" strokeWidth="1" />
            <text x="0" y="30" fill="#e34b35" fontSize="9" fontWeight="bold" textAnchor="middle">
              {order.buyerName.split(' ')[0]}'s Home
            </text>
          </g>

          {/* MOVING DELIVERY PARTNER BIKE MARKER */}
          <g 
            transform={`translate(${currentX}, ${currentY})`}
            className="transition-transform duration-700 ease-out"
          >
            {/* Animated pulsating radar circle */}
            <circle r="24" fill="#f39a3d" opacity="0.3" className="animate-ping" />
            <circle r="15" fill="#f39a3d" stroke="white" strokeWidth="2.5" className="shadow-lg" />
            <text x="0" y="4" fill="#183a21" fontSize="12" textAnchor="middle" fontWeight="bold">🛵</text>
            
            {/* Driver Tag */}
            <g transform="translate(0, -22)">
              <rect x="-50" y="-12" width="100" height="18" rx="6" fill="#0d3d20" />
              <text x="0" y="1" fill="#ffd45c" fontSize="9" fontWeight="bold" textAnchor="middle">
                {order.deliveryPartnerName ? order.deliveryPartnerName.split(' ')[0] : 'Partner'} • {progress}%
              </text>
            </g>
          </g>
        </svg>

        {/* Compass and Scale in Corner */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-700 flex items-center gap-1.5 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-[#176b3a]" />
          <span>Udaipur Urban & Rural Grid</span>
        </div>

        {/* Live Status Overlay Tag */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-xl border border-gray-200 text-xs font-extrabold text-[#17351f] flex items-center gap-1.5 shadow-xs">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{order.orderStatus === 'DELIVERED' ? 'COMPLETED' : 'LIVE GPS TRANSMITTING'}</span>
        </div>
      </div>

      {/* Driver Contact & Delivery Progress Bar */}
      <div className="bg-[#fcfdfc] p-4 rounded-2xl border border-gray-100 space-y-3">
        
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-gray-600">Transit Milestone</span>
            <span className="text-[#176b3a]">{progress}% Completed</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#79bd45] to-[#176b3a] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Driver Card Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
              alt="Vikram Gurjar"
              className="w-10 h-10 rounded-xl object-cover border border-[#c4e6be]"
            />
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#17351f] flex items-center gap-1">
                <span>{order.deliveryPartnerName || 'Vikram Gurjar'}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#176b3a]" />
              </div>
              <p className="text-[11px] text-gray-500">
                {order.deliveryPartnerVehicle || 'Hero Electric Cargo Bike'} • Verified Agent
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${order.deliveryPartnerPhone || '+919414088990'}`}
              className="px-3 py-1.5 rounded-xl bg-[#eaf7e8] text-[#176b3a] hover:bg-[#d8f2d5] font-bold text-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Partner</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
