import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { QrCodeModal } from '../components/QrCodeModal';
import { 
  Wheat, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Sprout, 
  Layers, 
  Droplets,
  PackageCheck,
  QrCode
} from 'lucide-react';

interface AgriStorePageProps {
  setCurrentTab: (tab: string) => void;
}

export const AgriStorePage: React.FC<AgriStorePageProps> = ({ setCurrentTab }) => {
  const [supplies, setSupplies] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qrProduct, setQrProduct] = useState<Product | null>(null);

  const supplyCategories = [
    { id: 'ALL', label: 'All Supplies', icon: '🌾' },
    { id: 'SEEDS', label: 'Hybrid Seeds', icon: '🌱' },
    { id: 'FERTILIZERS', label: 'Bio-Fertilizers', icon: '🪱' },
    { id: 'CROP_PROTECTION', label: 'Neem Crop Protection', icon: '🌿' },
    { id: 'EQUIPMENT', label: 'Sprayers & Tools', icon: '⚙️' },
    { id: 'IRRIGATION', label: 'Drip Irrigation', icon: '💧' },
  ];

  const fetchSupplies = async () => {
    setLoading(true);
    try {
      let url = `/api/products?type=AGRI_SUPPLY`;
      if (selectedCategory !== 'ALL') url += `&category=${selectedCategory}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.products) {
        setSupplies(data.products);
      }
    } catch (e) {
      console.error('Failed to load supplies:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Agri Store Hero Header */}
      <div className="bg-gradient-to-r from-[#1b3d22] via-[#245230] to-[#2f6a3f] rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-[#ffd45c] text-[#19351e] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <span>🌾 Certified Agri Inputs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins',sans-serif]">
            Agri Supplies & Input Store
          </h1>
          <p className="text-xs sm:text-sm text-[#d5ead8] leading-relaxed">
            High-germination hybrid seeds, 100% organic vermicompost, bio-neem protection, and battery sprayers delivered straight to your farm gate.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-white space-y-2 shrink-0">
          <div className="flex items-center gap-2 font-bold text-[#b7e66c]">
            <ShieldCheck className="w-4 h-4" />
            <span>Govt / APMC Certified Supplies</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-[#ffd45c]">
            <Truck className="w-4 h-4" />
            <span>Direct Delivery to Farm Coordinates</span>
          </div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e1ede0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hybrid seeds, vermicompost, neem oil..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#176b3a] bg-gray-50/50"
            />
          </div>

          <span className="text-xs font-semibold text-gray-500">
            Showing {supplies.length} certified supplies
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {supplyCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#176b3a] text-white shadow-sm'
                  : 'bg-[#f4faf2] text-[#2c5438] hover:bg-[#e6f4e3] border border-[#d6ebd1]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Supplies Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-10 h-10 border-3 border-[#176b3a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold">Loading certified agricultural supplies...</p>
        </div>
      ) : supplies.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center text-2xl">
            🌱
          </div>
          <h3 className="font-extrabold text-base text-[#17351f]">No supplies found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the filter.
          </p>
          <button
            onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
            className="px-4 py-2 bg-[#176b3a] text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {supplies.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={setSelectedProduct}
              onShowQr={setQrProduct}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onQuickBuy={() => setCurrentTab('checkout')}
        />
      )}

      {/* Agri Supply Scannable QR Tag Modal */}
      {qrProduct && (
        <QrCodeModal
          isOpen={!!qrProduct}
          onClose={() => setQrProduct(null)}
          title={qrProduct.name}
          subtitle="Certified Agri Input Batch Code"
          value={`agri://product/${qrProduct.id}`}
          type="PRODUCT"
          meta={{
            id: qrProduct.id,
            name: qrProduct.name,
            price: qrProduct.price,
            location: qrProduct.farmLocation
          }}
        />
      )}

    </div>
  );
};
