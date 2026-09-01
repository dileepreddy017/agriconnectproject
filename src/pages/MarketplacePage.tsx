import React, { useState, useEffect } from 'react';
import { Product, ProductCategoryType } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { QrCodeModal } from '../components/QrCodeModal';
import { 
  Search, 
  Filter, 
  Sparkles, 
  MapPin, 
  SlidersHorizontal, 
  Sprout, 
  ArrowUpDown,
  ShoppingBag,
  QrCode
} from 'lucide-react';

interface MarketplacePageProps {
  setCurrentTab: (tab: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ setCurrentTab }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qrProduct, setQrProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Produce', icon: '🌾' },
    { id: 'VEGETABLE', label: 'Vegetables', icon: '🥬' },
    { id: 'FRUIT', label: 'Fruits', icon: '🍎' },
    { id: 'GRAIN', label: 'Grains & Wheat', icon: '🌾' },
    { id: 'PULSE', label: 'Pulses & Dal', icon: '🫘' },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?type=FARM_PRODUCE`;
      if (selectedCategory !== 'ALL') url += `&category=${selectedCategory}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (sortBy) url += `&sort=${sortBy}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.products) {
        let list = data.products;
        if (organicOnly) {
          list = list.filter((p: Product) => p.organicCertified);
        }
        list = list.filter((p: Product) => p.price <= maxPrice);
        setProducts(list);
      }
    } catch (e) {
      console.error('Failed to load marketplace products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, organicOnly, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#176b3a] to-[#2b8850] rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Direct Farm to Kitchen</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins',sans-serif]">
            Fresh Farm Marketplace 🛒
          </h1>
          <p className="text-xs sm:text-sm text-[#e0f3e3] leading-relaxed">
            Order pesticide-free vegetables, tree-ripened fruits, and nutritious grains directly harvested by local farmers around Udaipur.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-white space-y-1.5 shrink-0">
          <div className="font-bold flex items-center gap-1 text-[#ffd45c]">
            <MapPin className="w-4 h-4" />
            <span>Hyperlocal Delivery Radius</span>
          </div>
          <p className="text-gray-200">5–15 km around Udaipur, Rajasthan</p>
          <span className="inline-block text-[10px] bg-[#ffd45c] text-[#19351e] font-extrabold px-2 py-0.5 rounded-full uppercase">
            Same-Day Harvest Guarantee
          </span>
        </div>
      </div>

      {/* Search and Category Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e1ede0] shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tomatoes, mangoes, potatoes, wheat..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#176b3a] bg-gray-50/50"
            />
          </div>

          {/* Sort & Quick Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
              <ArrowUpDown className="w-4 h-4 text-[#176b3a]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="newest">Fresh Harvest (Newest)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Organic Only Toggle */}
            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                organicOnly
                  ? 'bg-[#176b3a] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Organic Certified</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
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

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-10 h-10 border-3 border-[#176b3a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold">Loading harvest listings from Udaipur farms...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center text-2xl">
            🔍
          </div>
          <h3 className="font-extrabold text-base text-[#17351f]">No matching farm produce found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search keyword or clearing the filters to view all fresh farm items.
          </p>
          <button
            onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); setOrganicOnly(false); }}
            className="px-4 py-2 bg-[#176b3a] text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(prod => (
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

      {/* Scannable Product QR Tag Modal */}
      {qrProduct && (
        <QrCodeModal
          isOpen={!!qrProduct}
          onClose={() => setQrProduct(null)}
          title={qrProduct.name}
          subtitle="Farm Batch Traceability QR Tag"
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
