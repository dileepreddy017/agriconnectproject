import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Wheat, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, switchRole } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'switch'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [farmName, setFarmName] = useState('');
  const [city, setCity] = useState('Udaipur');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) {
      setError('Invalid credentials. You can also select a profile from the Switch Role tab.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await register({
      name,
      email,
      phone,
      role: selectedRole,
      farmName: selectedRole === 'FARMER' ? farmName : undefined,
      city,
      state: 'Rajasthan',
      pincode: '313001'
    });
    setLoading(false);
    if (!ok) {
      setError('Registration failed. Please check your details and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-up my-6">
        
        {/* Header */}
        <div className="bg-[#f4faf2] p-5 border-b border-[#e1ede0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#176b3a] text-white flex items-center justify-center font-bold">
              🌱
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#17351f] font-['Poppins',sans-serif]">
                AgriConnect Access
              </h3>
              <p className="text-xs text-gray-500">Sign in to your account</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-2 bg-gray-50 border-b border-gray-100 text-xs font-bold">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${tab === 'login' ? 'bg-white text-[#176b3a] shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Login
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${tab === 'register' ? 'bg-white text-[#176b3a] shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('switch'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${tab === 'switch' ? 'bg-white text-[#176b3a] shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Quick Profile
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* QUICK PROFILES */}
          {tab === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-2">
                Quickly switch into any registered user profile:
              </p>

              <button
                onClick={() => switchRole('CUSTOMER')}
                className="w-full p-3.5 rounded-2xl border-2 border-[#d8ecd4] hover:border-[#176b3a] bg-[#f8fcf8] hover:bg-[#eef8eb] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#dcf1d8] text-[#176b3a] flex items-center justify-center text-lg font-bold">
                    👩
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#17351f] group-hover:text-[#176b3a]">
                      Priya Sharma (Customer)
                    </div>
                    <div className="text-xs text-gray-500">Shop fresh produce, place orders, live GPS tracking</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#176b3a] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => switchRole('FARMER')}
                className="w-full p-3.5 rounded-2xl border-2 border-[#d8ecd4] hover:border-[#176b3a] bg-[#f8fcf8] hover:bg-[#eef8eb] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-[#dcf1d8] text-[#176b3a] flex items-center justify-center text-lg font-bold">
                    👨‍🌾
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#17351f] group-hover:text-[#176b3a]">
                      Ramesh Patel (Farmer)
                    </div>
                    <div className="text-xs text-gray-500">List harvests, accept orders, buy seeds/fertilizers</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#176b3a] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => switchRole('DELIVERY')}
                className="w-full p-3.5 rounded-2xl border-2 border-amber-200 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg font-bold">
                    🛵
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#17351f] group-hover:text-amber-800">
                      Vikram Gurjar (Delivery Partner)
                    </div>
                    <div className="text-xs text-gray-500">Mobile ready: Pickup from farm, simulate GPS to doorstep</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => switchRole('ADMIN')}
                className="w-full p-3.5 rounded-2xl border-2 border-purple-200 hover:border-purple-600 bg-purple-50/40 hover:bg-purple-50 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-lg font-bold">
                    🛡️
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#17351f] group-hover:text-purple-800">
                      AgriConnect Admin
                    </div>
                    <div className="text-xs text-gray-500">Full system oversight, deliveries, analytics & approvals</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-800 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com or ramesh@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••• (Any password for demo)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#176b3a] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#12552e] shadow-md shadow-[#176b3a]/20"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">I want to join as:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['CUSTOMER', 'FARMER', 'DELIVERY'] as UserRole[]).map(r => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedRole === r 
                          ? 'bg-[#176b3a] text-white border-[#176b3a]' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {r === 'CUSTOMER' ? 'Customer' : r === 'FARMER' ? 'Farmer' : 'Delivery'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Meena"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                />
              </div>

              {selectedRole === 'FARMER' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Farm / Orchard Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Meena Organic Orchards"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">City & State</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Udaipur, Rajasthan"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#176b3a] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#12552e] shadow-md shadow-[#176b3a]/20"
              >
                {loading ? 'Creating Account...' : `Register as ${selectedRole}`}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
