import React, { useState, useEffect } from 'react';
import { Product, Order, ProductCategoryType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  Sprout, 
  Plus, 
  Wheat, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Trash2, 
  Edit3, 
  X, 
  Sparkles,
  MapPin,
  Check,
  RefreshCw
} from 'lucide-react';

interface FarmerDashboardPageProps {
  setCurrentTab: (tab: string) => void;
}

export const FarmerDashboardPage: React.FC<FarmerDashboardPageProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  
  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'orders' | 'supplies'>('orders');
  const [farmerProducts, setFarmerProducts] = useState<Product[]>([]);
  const [incomingOrders, setIncomingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // New Produce Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategoryType>('VEGETABLE');
  const [price, setPrice] = useState('40');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('100');
  const [description, setDescription] = useState('Freshly harvested organic crop from Badgaon farm.');
  const [organicCertified, setOrganicCertified] = useState(true);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80');

  const presetImages: { label: string; url: string }[] = [
    { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80' },
    { label: 'Mangoes', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80' },
    { label: 'Potatoes', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
    { label: 'Wheat', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
    { label: 'Green Peas', url: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80' },
  ];

  const loadFarmerData = async () => {
    try {
      // Products
      const prodRes = await fetch('/api/products?type=FARM_PRODUCE');
      const prodData = await prodRes.json();
      if (prodData.products) {
        setFarmerProducts(prodData.products);
      }

      // Orders
      const orderRes = await fetch('/api/orders');
      const orderData = await orderRes.json();
      if (orderData.orders) {
        setIncomingOrders(orderData.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmerData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadFarmerData();
      addToast({
        title: `Harvest Order Updated`,
        message: `Order #${orderId} marked as ${status.replace(/_/g, ' ')}`,
        type: 'ORDER'
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProduce = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          productType: 'FARM_PRODUCE',
          price: Number(price),
          unit,
          stock: Number(stock),
          description,
          imageUrl,
          organicCertified,
          farmLocation: user?.farmName ? `${user.farmName}, Udaipur` : 'Patel Organic Farms, Badgaon, Udaipur',
          sellerId: user?.id || 'usr_farmer_1',
          sellerName: user?.name || 'Ramesh Patel',
          sellerRole: 'FARMER',
          distanceKm: 4.8
        })
      });
      const data = await res.json();
      if (data.product) {
        setFarmerProducts([data.product, ...farmerProducts]);
        setIsAddModalOpen(false);
        addToast({
          title: '🌾 Harvest Published!',
          message: `${name} is now live on the marketplace for buyers.`,
          type: 'SYSTEM'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduce = async (id: string) => {
    if (confirm('Are you sure you want to remove this harvest listing?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setFarmerProducts(farmerProducts.filter(p => p.id !== id));
      addToast({
        title: 'Listing Removed',
        message: 'Product removed from marketplace',
        type: 'SYSTEM'
      });
    }
  };

  const totalEarnings = incomingOrders
    .filter(o => o.orderStatus === 'DELIVERED')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner with Farmer Greeting */}
      <div className="bg-gradient-to-r from-[#0e3b1e] via-[#17582d] to-[#21733c] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#b7e66c] text-[#0d3b1e] px-3 py-1 rounded-full text-xs font-extrabold uppercase">
            <span>👨‍🌾 Farmer Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins',sans-serif]">
            Welcome, {user?.name || 'Ramesh Patel'}!
          </h1>
          <p className="text-xs sm:text-sm text-[#d0ebd4]">
            {user?.farmName || 'Patel Organic Farms'} • Badgaon Valley, Udaipur, Rajasthan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#ffd45c] text-[#19351e] hover:bg-[#f3c644] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ List New Harvest</span>
          </button>

          <button
            onClick={() => setCurrentTab('agri-store')}
            className="bg-white/15 hover:bg-white/25 border border-white/40 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 transition-all"
          >
            <Wheat className="w-4 h-4 text-[#a8d95b]" />
            <span>Buy Agri Supplies</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e1ede0] shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold uppercase">Harvest Orders</span>
          <div className="text-2xl font-extrabold text-[#176b3a] font-['Poppins',sans-serif]">
            {incomingOrders.length}
          </div>
          <span className="text-[11px] text-gray-400">Total consumer orders</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1ede0] shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold uppercase">Live Produce Listings</span>
          <div className="text-2xl font-extrabold text-[#17351f] font-['Poppins',sans-serif]">
            {farmerProducts.length}
          </div>
          <span className="text-[11px] text-gray-400">Active in marketplace</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1ede0] shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold uppercase">Settled Earnings</span>
          <div className="text-2xl font-extrabold text-[#176b3a] font-['Poppins',sans-serif]">
            ₹{totalEarnings || 4200}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Direct bank transfer</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1ede0] shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold uppercase">Farmer Rating</span>
          <div className="text-2xl font-extrabold text-[#f39a3d] font-['Poppins',sans-serif]">
            4.9 ★
          </div>
          <span className="text-[11px] text-gray-400">Based on 48 reviews</span>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'orders'
              ? 'bg-[#176b3a] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Incoming Harvest Orders ({incomingOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'listings'
              ? 'bg-[#176b3a] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>My Farm Produce Listings ({farmerProducts.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: INCOMING ORDERS */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {incomingOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 text-gray-400">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="font-bold text-sm text-gray-600">No incoming orders right now</p>
              <p className="text-xs">Place a ₹1 demo order on the marketplace to see it appear here instantly!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incomingOrders.map(ord => (
                <div key={ord.id} className="bg-white p-5 rounded-3xl border border-[#e1ede0] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <span className="font-mono font-extrabold text-sm text-[#176b3a]">#{ord.id}</span>
                      <p className="text-xs text-gray-500">Customer: <strong>{ord.buyerName}</strong></p>
                    </div>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
                      ord.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {ord.items.map(item => (
                      <div key={item.product.id} className="flex justify-between font-semibold text-gray-800">
                        <span>{item.product.name} × {item.quantity} {item.product.unit}</span>
                        <span>₹{item.priceSnapshot * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100 flex justify-between font-extrabold text-sm text-[#17351f]">
                      <span>Total Payout:</span>
                      <span className="text-[#176b3a]">₹{ord.totalAmount}</span>
                    </div>
                  </div>

                  <div className="bg-[#f8faf7] p-3 rounded-xl text-xs text-gray-600 space-y-1">
                    <p><strong>Deliver to:</strong> {ord.buyerAddress}</p>
                    {ord.deliveryPartnerName && (
                      <p className="text-[#176b3a]"><strong>Assigned Partner:</strong> {ord.deliveryPartnerName} ({ord.deliveryPartnerPhone})</p>
                    )}
                  </div>

                  {/* Farmer Action Pipeline */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {ord.orderStatus === 'CREATED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'ACCEPTED')}
                        className="flex-1 bg-[#176b3a] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#12552e]"
                      >
                        ✓ Accept Harvest Order
                      </button>
                    )}

                    {ord.orderStatus === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'PACKED')}
                        className="flex-1 bg-[#258b4f] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#1a6e3d]"
                      >
                        📦 Mark Harvest Packed
                      </button>
                    )}

                    {ord.orderStatus === 'PACKED' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(ord.id, 'READY_FOR_PICKUP')}
                        className="flex-1 bg-[#f39a3d] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#d8842e]"
                      >
                        🌾 Mark Ready for Farm Gate Pickup
                      </button>
                    )}

                    {ord.orderStatus === 'READY_FOR_PICKUP' && (
                      <span className="text-xs font-bold text-gray-500 italic py-2">
                        Waiting for Delivery Partner to pick up at farm gate...
                      </span>
                    )}

                    {ord.orderStatus === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => setCurrentTab('orders')}
                        className="flex-1 bg-[#eaf7e8] text-[#176b3a] py-2 rounded-xl text-xs font-bold hover:bg-[#d8f2d5]"
                      >
                        View Live Delivery GPS
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: FARM PRODUCE LISTINGS */}
      {activeSubTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmerProducts.map(prod => (
              <div key={prod.id} className="bg-white rounded-2xl overflow-hidden border border-[#e1ede0] shadow-xs flex flex-col justify-between">
                <div className="relative h-44 bg-gray-100">
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  {prod.organicCertified && (
                    <span className="absolute top-2 left-2 bg-[#176b3a] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      100% ORGANIC
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-[#17351f]">{prod.name}</h4>
                    <span className="font-extrabold text-sm text-[#176b3a]">₹{prod.price}/{prod.unit}</span>
                  </div>
                  <p className="text-xs text-gray-500">{prod.stock} {prod.unit} available in stock</p>
                  
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[11px] text-[#176b3a] font-semibold">Active on Marketplace</span>
                    <button
                      onClick={() => handleDeleteProduce(prod.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PRODUCE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-up my-8">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#f4faf2]">
              <h3 className="font-extrabold text-base text-[#17351f] flex items-center gap-2">
                <Sprout className="w-5 h-5 text-[#176b3a]" />
                <span>List New Farm Harvest</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-500 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduce} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Crop / Produce Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Desi Tomatoes, Alphonso Mangoes"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategoryType)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  >
                    <option value="VEGETABLE">Vegetables</option>
                    <option value="FRUIT">Fruits</option>
                    <option value="GRAIN">Grains & Wheat</option>
                    <option value="PULSE">Pulses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  >
                    <option value="kg">Per Kilogram (kg)</option>
                    <option value="quintal">Per Quintal</option>
                    <option value="box">Per Box</option>
                    <option value="bundle">Per Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Available Stock</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                  />
                </div>
              </div>

              {/* Preset Image Quick Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quick Select Crop Photo</label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {presetImages.map(p => (
                    <button
                      type="button"
                      key={p.label}
                      onClick={() => setImageUrl(p.url)}
                      className={`px-3 py-1 rounded-lg text-xs border font-semibold shrink-0 ${
                        imageUrl === p.url ? 'bg-[#176b3a] text-white border-[#176b3a]' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Produce Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organic"
                  checked={organicCertified}
                  onChange={(e) => setOrganicCertified(e.target.checked)}
                  className="rounded text-[#176b3a] focus:ring-[#176b3a]"
                />
                <label htmlFor="organic" className="text-xs font-bold text-gray-700 cursor-pointer">
                  100% Certified Organic Harvest (No synthetic chemical spray)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#176b3a] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#12552e] shadow-lg shadow-[#176b3a]/25"
              >
                Publish Harvest to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
