import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Sprout, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Wheat, 
  TrendingUp, 
  Star, 
  Sparkles, 
  ShoppingBag, 
  Bot, 
  CloudSun,
  CheckCircle2,
  Zap,
  Users,
  Search
} from 'lucide-react';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab }) => {
  const { switchRole } = useAuth();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [locationQuery, setLocationQuery] = useState('Udaipur, Rajasthan (Within 10 km)');

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d.products) {
          setFeaturedProducts(d.products.slice(0, 4));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[640px] rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 overflow-hidden bg-gradient-to-br from-[#09351a] via-[#135028] to-[#1e6f3b] text-white p-6 sm:p-12 lg:p-16 flex items-center shadow-xl">
        {/* Background decorative textures */}
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=85')`
          }}
        />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#a8d95b]/20 blur-3xl" />

        <div className="relative z-10 max-w-2xl space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
            <span>🌿</span>
            <span>India's Smart Agricultural Marketplace & Supply Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-['Poppins',sans-serif]">
            From <span className="text-[#b7e66c]">Farm</span> to Your <span className="text-[#ffd45c]">Table.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#e1f0e3] leading-relaxed max-w-xl">
            Connecting farmers directly with nearby consumers for farm-fresh produce, and empowering growers with certified seeds, bio-fertilizers, and equipment.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className="bg-[#ffd45c] text-[#16351d] hover:bg-[#ffdf7e] font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg shadow-black/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { switchRole('FARMER'); setCurrentTab('farmer-dashboard'); }}
              className="bg-white/15 hover:bg-white/25 border border-white/40 text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl backdrop-blur-xs flex items-center gap-2 transition-all"
            >
              <span>👨‍🌾 Sell Your Harvest</span>
            </button>

            <button
              onClick={() => setCurrentTab('agri-store')}
              className="bg-[#176b3a] hover:bg-[#12552e] border border-[#a8d95b]/40 text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl flex items-center gap-2 transition-all"
            >
              <Wheat className="w-4 h-4 text-[#a8d95b]" />
              <span>Shop Agri Supplies</span>
            </button>
          </div>

          {/* Mini Stats in Hero */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#b7e66c] font-['Poppins',sans-serif]">5,000+</div>
              <span className="text-xs text-gray-300">Registered Farmers</span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#ffd45c] font-['Poppins',sans-serif]">25K+</div>
              <span className="text-xs text-gray-300">Batches Harvested</span>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Poppins',sans-serif]">0%</div>
              <span className="text-xs text-gray-300">Middleman Cuts</span>
            </div>
          </div>

        </div>

        {/* Floating Hero Harvest Spotlight Card */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-80 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/80 text-[#17351f] animate-float">
          <div className="relative h-44 rounded-2xl overflow-hidden bg-gray-100 mb-3">
            <img
              src="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80"
              alt="Farm Fresh Tomatoes"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2.5 left-2.5 bg-[#176b3a] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
              ✓ HARVESTED TODAY
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#f39a3d] font-bold">
              <span>★★★★★ 4.9 (48)</span>
              <span className="text-[#176b3a] font-semibold">📍 5 km away</span>
            </div>
            <h4 className="font-extrabold text-base">Fresh Vine Tomatoes</h4>
            <p className="text-xs text-gray-500">Patel Organic Farms, Badgaon</p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-400">Direct Price</span>
                <div className="text-xl font-extrabold text-[#176b3a]">₹35<span className="text-xs text-gray-500 font-normal">/kg</span></div>
              </div>
              <button
                onClick={() => {
                  if (featuredProducts[0]) {
                    addToCart(featuredProducts[0], 2);
                  }
                  setCurrentTab('marketplace');
                }}
                className="bg-[#ffd45c] text-[#19351e] font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-[#f3c644] flex items-center gap-1 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Buy Farm Fresh
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* PLATFORM KEY PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-[#e2ede1] shadow-xs hover:border-[#176b3a] transition-all flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#eaf7e8] text-[#176b3a] flex items-center justify-center text-xl shrink-0 font-bold">
              👨‍🌾
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#17351f]">Direct Farmer Trade</h4>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                Farmers keep up to 90% of retail price without exploitative commission agents.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2ede1] shadow-xs hover:border-[#176b3a] transition-all flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shrink-0 font-bold">
              📍
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#17351f]">Hyperlocal Radius</h4>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                Discover farms within 5-15 km radius for same-day crisp doorstep delivery.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2ede1] shadow-xs hover:border-[#176b3a] transition-all flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl shrink-0 font-bold">
              🌾
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#17351f]">Complete Agri Store</h4>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                Certified seeds, organic bio-fertilizers, neem pesticides, and drip kits.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2ede1] shadow-xs hover:border-[#176b3a] transition-all flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl shrink-0 font-bold">
              🛵
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#17351f]">Live GPS Tracking</h4>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                Real-time cross-device delivery telemetry from farm gate to customer doorstep.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED FRESH HARVEST PRODUCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#176b3a] bg-[#eaf7e8] px-3 py-1 rounded-full uppercase tracking-wider">
              Today's Farm Harvests
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17351f] font-['Poppins',sans-serif] mt-2">
              Fresh Products Near You 🛒
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Harvested within the last 12 hours from verified local organic farms in Udaipur.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('marketplace')}
            className="text-xs sm:text-sm font-bold text-[#176b3a] hover:text-[#12552e] flex items-center gap-1.5 group"
          >
            <span>View All Marketplace Produce</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      {/* AGRI STORE SUPPLIES SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#173d23] to-[#25633b] rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-xl">
            <span className="bg-[#ffd45c] text-[#17351f] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              FOR FARMERS & GROWERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Poppins',sans-serif]">
              Everything Your Farm Needs for the Next Crop Season 🌾
            </h3>
            <p className="text-xs sm:text-sm text-[#d4ebd6] leading-relaxed">
              Buy certified high-yield hybrid seeds, 100% organic vermicompost, bio-neem crop protection oil, and drip irrigation kits with doorstep farm delivery.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#a8d95b]">
              <span>✓ Seeds</span>
              <span>•</span>
              <span>✓ Fertilizers</span>
              <span>•</span>
              <span>✓ Crop Protection</span>
              <span>•</span>
              <span>✓ Drip Irrigation</span>
              <span>•</span>
              <span>✓ Battery Sprayers</span>
            </div>
            <button
              onClick={() => setCurrentTab('agri-store')}
              className="mt-2 bg-[#ffd45c] text-[#183a21] hover:bg-[#f3c644] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
            >
              <span>Explore Agri Supplies Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full md:w-80 grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center space-y-1">
              <span className="text-2xl">🌱</span>
              <div className="font-extrabold text-sm">Hybrid Seeds</div>
              <p className="text-[10px] text-gray-300">High germination F1</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center space-y-1">
              <span className="text-2xl">🪱</span>
              <div className="font-extrabold text-sm">Vermicompost</div>
              <p className="text-[10px] text-gray-300">100% organic manure</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center space-y-1">
              <span className="text-2xl">🌿</span>
              <div className="font-extrabold text-sm">Bio-Neem Oil</div>
              <p className="text-[10px] text-gray-300">10,000 PPM protection</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center space-y-1">
              <span className="text-2xl">💧</span>
              <div className="font-extrabold text-sm">Drip Irrigation</div>
              <p className="text-[10px] text-gray-300">Water-saving setups</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW AGRI CONNECT WORKS (4-Step Diagram) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-[#176b3a] bg-[#eaf7e8] px-3 py-1 rounded-full uppercase tracking-wider">
            Simple 4-Step Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17351f] font-['Poppins',sans-serif]">
            How AgriConnect Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            A transparent digital bridge between rural growers and urban consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e2ede1] shadow-xs text-center space-y-3 relative">
            <div className="w-12 h-12 rounded-full bg-[#176b3a] text-white mx-auto flex items-center justify-center font-extrabold text-lg shadow-md shadow-[#176b3a]/20">
              01
            </div>
            <h3 className="font-bold text-base text-[#17351f]">Farmer Lists Harvest</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Farmer inputs crop name, photos, stock quantity, and price per kg directly from mobile.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2ede1] shadow-xs text-center space-y-3 relative">
            <div className="w-12 h-12 rounded-full bg-[#79bd45] text-white mx-auto flex items-center justify-center font-extrabold text-lg shadow-md shadow-[#79bd45]/20">
              02
            </div>
            <h3 className="font-bold text-base text-[#17351f]">Buyer Discovers</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Customer browses nearby harvests by radius and places ₹1 demo or real sandbox order.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2ede1] shadow-xs text-center space-y-3 relative">
            <div className="w-12 h-12 rounded-full bg-[#f39a3d] text-white mx-auto flex items-center justify-center font-extrabold text-lg shadow-md shadow-[#f39a3d]/20">
              03
            </div>
            <h3 className="font-bold text-base text-[#17351f]">Farmer Packs Produce</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Farmer accepts order in dashboard, packs in eco-crates, and marks ready for pickup.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e2ede1] shadow-xs text-center space-y-3 relative">
            <div className="w-12 h-12 rounded-full bg-[#2b6e41] text-white mx-auto flex items-center justify-center font-extrabold text-lg shadow-md shadow-[#2b6e41]/20">
              04
            </div>
            <h3 className="font-bold text-base text-[#17351f]">Live GPS Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Delivery partner picks up from farm gate and drives to customer doorstep with real-time GPS sync!
            </p>
          </div>
        </div>
      </section>

      {/* SMART TOOLS (AI CROP DOCTOR & MANDI PRICES TEASER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* AI Crop Doctor Widget */}
          <div className="bg-gradient-to-br from-[#16351d] to-[#1e582e] p-6 sm:p-8 rounded-3xl text-white flex flex-col justify-between shadow-md space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#b7e66c] uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>Powered by Gemini 3.7 Flash</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-['Poppins',sans-serif] mt-2">
                Kisan Mitra AI Crop Doctor
              </h3>
              <p className="text-xs sm:text-sm text-[#c9e4cb] mt-1 leading-relaxed">
                Diagnose crop diseases, calculate exact NPK / vermicompost dosages, and get scientific irrigation guidance in seconds.
              </p>
            </div>

            <button
              onClick={() => setCurrentTab('ai-doctor')}
              className="bg-[#b7e66c] text-[#0d3d20] hover:bg-[#c9f27d] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-between w-full"
            >
              <span>Ask AI Crop Doctor Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mandi APMC Prices Widget */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e1ede0] shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#176b3a] uppercase tracking-wider">
                <CloudSun className="w-4 h-4" />
                <span>Rajasthan APMC Live Mandi Rates</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#17351f] font-['Poppins',sans-serif] mt-2">
                Live Mandi & Weather Advisory
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                Check daily APMC modal prices for Wheat, Mustard, Tomato, Cotton, and Pulses alongside rain forecasts for field spraying.
              </p>
            </div>

            <button
              onClick={() => setCurrentTab('weather-mandi')}
              className="bg-[#eaf7e8] text-[#176b3a] hover:bg-[#d8f2d5] border border-[#a8d95b] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-between w-full"
            >
              <span>View Mandi Prices & Weather</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onQuickBuy={(p) => {
            setCurrentTab('checkout');
          }}
        />
      )}

    </div>
  );
};
