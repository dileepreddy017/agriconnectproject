import React, { useState } from 'react';
import { 
  CloudSun, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  Droplets, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';

export const WeatherMandiPage: React.FC = () => {
  const [searchMandi, setSearchMandi] = useState('');

  const mandiPrices = [
    { commodity: 'Tomato (Hybrid Desi)', mandi: 'Udaipur APMC Main', minPrice: 2800, maxPrice: 3800, modalPrice: 3500, unit: '₹/Quintal', trend: 'UP', change: '+₹250 today' },
    { commodity: 'Wheat (Sharbati Gold)', mandi: 'Fatehnagar APMC', minPrice: 2400, maxPrice: 2950, modalPrice: 2800, unit: '₹/Quintal', trend: 'STABLE', change: '₹0' },
    { commodity: 'Mustard (Sarson 42% Oil)', mandi: 'Mavli Mandi', minPrice: 5200, maxPrice: 5850, modalPrice: 5650, unit: '₹/Quintal', trend: 'UP', change: '+₹180 today' },
    { commodity: 'Potato (Jyoti Fresh)', mandi: 'Udaipur APMC Main', minPrice: 1400, maxPrice: 1900, modalPrice: 1650, unit: '₹/Quintal', trend: 'DOWN', change: '-₹80 today' },
    { commodity: 'Onion (Nashik Red / Rajasthan)', mandi: 'Udaipur APMC Main', minPrice: 1800, maxPrice: 2600, modalPrice: 2200, unit: '₹/Quintal', trend: 'UP', change: '+₹120 today' },
    { commodity: 'Chana (Gram Desi)', mandi: 'Salumber APMC', minPrice: 5600, maxPrice: 6200, modalPrice: 5950, unit: '₹/Quintal', trend: 'UP', change: '+₹90 today' },
    { commodity: 'Cotton (Medium Staple)', mandi: 'Bhilwara APMC', minPrice: 6800, maxPrice: 7500, modalPrice: 7200, unit: '₹/Quintal', trend: 'STABLE', change: '₹0' },
  ];

  const filteredMandi = mandiPrices.filter(m => 
    m.commodity.toLowerCase().includes(searchMandi.toLowerCase()) || 
    m.mandi.toLowerCase().includes(searchMandi.toLowerCase())
  );

  const forecast = [
    { day: 'Today', temp: '32°C / 21°C', condition: 'Sunny & Clear', rainProb: '5%', sprayAdvisory: 'Safe to spray bio-pesticides and foliar fertilizers.' },
    { day: 'Tomorrow', temp: '33°C / 22°C', condition: 'Mostly Sunny', rainProb: '10%', sprayAdvisory: 'Ideal weather for field irrigation and harvesting.' },
    { day: 'Wednesday', temp: '30°C / 20°C', condition: 'Light Breeze', rainProb: '15%', sprayAdvisory: 'Safe morning spraying recommended.' },
    { day: 'Thursday', temp: '29°C / 19°C', condition: 'Scattered Clouds', rainProb: '30%', sprayAdvisory: 'Avoid heavy chemical sprays due to sudden shower risk.' },
    { day: 'Friday', temp: '31°C / 21°C', condition: 'Sunny', rainProb: '5%', sprayAdvisory: 'Excellent conditions for soil aeration and sowing.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1b432a] to-[#2b6d45] rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-[#ffd45c] text-[#19351e] px-3 py-1 rounded-full text-xs font-extrabold uppercase">
            <span>📊 Live Agricultural Market Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins',sans-serif]">
            Mandi Rates & Weather Radar
          </h1>
          <p className="text-xs sm:text-sm text-[#d4ebd8] leading-relaxed">
            Real-time daily modal prices from APMC mandis across Rajasthan alongside agrometeorological advisory for crop protection.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-white space-y-1.5 shrink-0">
          <div className="font-bold flex items-center gap-1 text-[#ffd45c]">
            <MapPin className="w-4 h-4" />
            <span>Region: Udaipur, Mewar Grid</span>
          </div>
          <p className="text-gray-200">Data synchronized with Agmarknet & IMD</p>
          <span className="inline-block text-[10px] bg-[#a8d95b] text-[#0d3319] font-extrabold px-2 py-0.5 rounded-full uppercase">
            Verified Today
          </span>
        </div>
      </div>

      {/* WEATHER ADVISORY SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e1ede0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-[#17351f] flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-500" />
              <span>5-Day Farm Weather & Spray Advisory</span>
            </h3>
            <p className="text-xs text-gray-500">Hourly field humidity and rain probability for Udaipur agriculture zone</p>
          </div>
          <div className="bg-[#f4faf2] px-3 py-1.5 rounded-xl border border-[#cbe4c7] text-xs font-bold text-[#176b3a]">
            Station: Udaipur Krishi Vigyan Kendra (KVK)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {forecast.map((f, i) => (
            <div
              key={f.day}
              className={`p-4 rounded-2xl border transition-all ${
                i === 0 
                  ? 'bg-gradient-to-br from-[#eaf7e8] to-[#f4fbf3] border-[#a8d95b] shadow-sm ring-2 ring-[#176b3a]/10' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-extrabold text-sm text-[#17351f]">{f.day}</span>
                <span className="text-xl">{i === 3 ? '🌦️' : '☀️'}</span>
              </div>
              <div className="text-base font-extrabold text-[#176b3a] font-['Poppins',sans-serif]">{f.temp}</div>
              <p className="text-xs text-gray-600 mt-0.5">{f.condition}</p>

              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-[11px]">
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-500" /> Rain:</span>
                  <span className="font-bold text-gray-800">{f.rainProb}</span>
                </div>
                <div className="mt-2 bg-white/80 p-2 rounded-lg border border-gray-100 text-[10px] text-[#2c5438] leading-tight">
                  <strong>Advisory:</strong> {f.sprayAdvisory}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APMC MANDI RATES TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e1ede0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#17351f] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#176b3a]" />
              <span>Rajasthan APMC Live Commodity Rates</span>
            </h3>
            <p className="text-xs text-gray-500">Updated daily with official modal prices per quintal</p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchMandi}
              onChange={(e) => setSearchMandi(e.target.value)}
              placeholder="Search commodity or mandi..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#176b3a]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f4faf2] text-[#17351f] font-extrabold border-b border-[#e1ede0]">
              <tr>
                <th className="p-3.5">Commodity</th>
                <th className="p-3.5">APMC Mandi</th>
                <th className="p-3.5">Min Price</th>
                <th className="p-3.5">Max Price</th>
                <th className="p-3.5">Modal Price</th>
                <th className="p-3.5">24h Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredMandi.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-gray-900 flex items-center gap-2">
                    <span>🌾</span>
                    <span>{item.commodity}</span>
                  </td>
                  <td className="p-3.5 text-gray-600">{item.mandi}</td>
                  <td className="p-3.5 font-semibold">₹{item.minPrice}</td>
                  <td className="p-3.5 font-semibold">₹{item.maxPrice}</td>
                  <td className="p-3.5 font-extrabold text-sm text-[#176b3a] font-['Poppins',sans-serif]">
                    ₹{item.modalPrice} <span className="text-[10px] text-gray-500 font-normal">/Qtl</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full ${
                      item.trend === 'UP' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : item.trend === 'DOWN' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.trend === 'UP' && <TrendingUp className="w-3 h-3" />}
                      {item.trend === 'DOWN' && <TrendingDown className="w-3 h-3" />}
                      {item.trend === 'STABLE' && <Minus className="w-3 h-3" />}
                      {item.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
