import React from 'react';
import { Sprout, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-[#092b18] text-[#d3e2d7] pt-16 pb-20 border-t border-[#1a4e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#176b3a] to-[#79bd45] flex items-center justify-center text-white font-bold text-xl shadow-md">
                🌱
              </div>
              <span className="font-extrabold text-2xl text-white font-['Poppins',sans-serif]">
                Agri<span className="text-[#a8d95b]">Connect</span>
              </span>
            </div>
            <p className="text-xs text-[#aebfb3] leading-relaxed max-w-sm">
              India's transparent direct-to-consumer agricultural ecosystem. Connecting local farmers directly with consumers and agricultural suppliers for fair pricing and zero food wastage.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#a8d95b]">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified APMC & Organic Certified Producers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-white font-['Poppins',sans-serif] mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs text-[#aebfb3]">
              <li>
                <button onClick={() => setCurrentTab('marketplace')} className="hover:text-[#a8d95b] transition-colors">
                  Fresh Vegetables & Fruits
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('marketplace')} className="hover:text-[#a8d95b] transition-colors">
                  Organic Grains & Pulses
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('agri-store')} className="hover:text-[#a8d95b] transition-colors">
                  Hybrid Seeds & Bio-Fertilizers
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('agri-store')} className="hover:text-[#a8d95b] transition-colors">
                  Drip Irrigation Equipment
                </button>
              </li>
            </ul>
          </div>

          {/* Agriculture Hub */}
          <div>
            <h4 className="font-bold text-sm text-white font-['Poppins',sans-serif] mb-4">
              Smart Farming
            </h4>
            <ul className="space-y-2.5 text-xs text-[#aebfb3]">
              <li>
                <button onClick={() => setCurrentTab('ai-doctor')} className="hover:text-[#a8d95b] transition-colors">
                  AI Crop Doctor (Gemini)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('weather-mandi')} className="hover:text-[#a8d95b] transition-colors">
                  Mandi Live APMC Prices
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('weather-mandi')} className="hover:text-[#a8d95b] transition-colors">
                  Weather Advisory & Forecast
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('orders')} className="hover:text-[#a8d95b] transition-colors">
                  Live GPS Order Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Helpline */}
          <div>
            <h4 className="font-bold text-sm text-white font-['Poppins',sans-serif] mb-4">
              Farmer Helpline
            </h4>
            <ul className="space-y-2.5 text-xs text-[#aebfb3]">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#a8d95b] shrink-0" />
                <span>Udaipur Krishi Bhawan, Rajasthan</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#a8d95b] shrink-0" />
                <span>support@agriconnect.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#a8d95b] shrink-0" />
                <span>1800-180-1551 (Kisan Call Center)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-[#1c4d2e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7b9884]">
          <p>© 2026 AgriConnect. Built for a smarter, sustainable agricultural future.</p>
          <div className="flex items-center gap-4">
            <span>₹1 Sandbox Presentation Ready</span>
            <span>•</span>
            <span>Cross-Device Real-Time Sync</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
