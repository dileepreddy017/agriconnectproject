import React, { useState, useEffect } from 'react';
import { Product, Order, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  Truck, 
  Wheat, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminDashboardPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'users'>('overview');

  const loadData = async () => {
    try {
      const pRes = await fetch('/api/products');
      const pData = await pRes.json();
      if (pData.products) setProducts(pData.products);

      const oRes = await fetch('/api/orders');
      const oData = await oRes.json();
      if (oData.orders) setOrders(oData.orders);

      const uRes = await fetch('/api/users');
      const uData = await uRes.json();
      if (uData.users) setUsers(uData.users);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const deliveredOrders = orders.filter(o => o.orderStatus === 'DELIVERED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#21173d] via-[#35255f] to-[#45307a] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-purple-400 text-purple-950 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Governance & Oversight</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins',sans-serif]">
            AgriConnect Admin Panel
          </h1>
          <p className="text-xs sm:text-sm text-purple-200">
            Monitoring Rajasthan rural-to-urban supply chain nodes, transactions, and partner fleet.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-white space-y-1 shrink-0">
          <div className="font-bold text-[#ffd45c]">Platform Health: 99.98%</div>
          <p className="text-purple-200">SSE Telemetry Streaming Active</p>
          <span className="inline-block text-[10px] bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full uppercase">
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold uppercase">Total Platform GMV</span>
          <div className="text-2xl font-extrabold text-[#176b3a] font-['Poppins',sans-serif]">
            ₹{totalGMV}
          </div>
          <span className="text-[11px] text-gray-400">Total transaction volume</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold uppercase">Total Orders</span>
          <div className="text-2xl font-extrabold text-[#17351f] font-['Poppins',sans-serif]">
            {orders.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">{deliveredOrders} completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold uppercase">Active Products</span>
          <div className="text-2xl font-extrabold text-[#17351f] font-['Poppins',sans-serif]">
            {products.length}
          </div>
          <span className="text-[11px] text-gray-400">Produce & Agri supplies</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-xs text-gray-500 font-bold uppercase">Registered Users</span>
          <div className="text-2xl font-extrabold text-purple-700 font-['Poppins',sans-serif]">
            {users.length}
          </div>
          <span className="text-[11px] text-gray-400">Farmers, Buyers & Riders</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${activeTab === 'overview' ? 'bg-purple-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Dispatch Oversight
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${activeTab === 'products' ? 'bg-purple-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          All Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold ${activeTab === 'users' ? 'bg-purple-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          User Accounts ({users.length})
        </button>
      </div>

      {/* DISPATCH OVERSIGHT TAB */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#17351f]">Live Dispatch Queue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Producer / Farm</th>
                  <th className="p-3">Assigned Delivery Partner</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-mono font-bold text-[#176b3a]">#{o.id}</td>
                    <td className="p-3 font-bold text-gray-800">{o.buyerName}</td>
                    <td className="p-3 text-gray-600">{o.sellerName}</td>
                    <td className="p-3 text-gray-600">{o.deliveryPartnerName || 'Auto-assigning...'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        o.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-gray-900">₹{o.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALL PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#17351f]">Catalog Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="p-3.5 rounded-2xl border border-gray-200 flex items-center gap-3">
                <img src={p.imageUrl} alt={p.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-xs text-gray-800 block truncate">{p.name}</span>
                  <span className="text-[11px] text-gray-500">{p.category} • ₹{p.price}/{p.unit}</span>
                  <span className="text-[10px] text-[#176b3a] font-semibold block">{p.sellerName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-[#17351f]">Platform Directory</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(u => (
              <div key={u.id} className="p-4 rounded-2xl border border-gray-200 flex items-center gap-3">
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-[#17351f]">{u.name}</h4>
                  <p className="text-[11px] text-gray-500">{u.email}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 uppercase">
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
