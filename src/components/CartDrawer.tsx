import React from 'react';
import { useCart } from '../context/CartContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag,
  Sparkles,
  Truck
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { 
    cartItems, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    deliveryFee, 
    totalAmount
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left">
        
        {/* Top Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#f8faf8]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#176b3a]" />
            <h3 className="font-extrabold text-base text-[#17351f] font-['Poppins',sans-serif]">
              Your Cart ({cartItems.length})
            </h3>
          </div>
          <div className="flex items-center gap-3">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 font-semibold hover:underline"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Delivery Incentive Header */}
        <div className="mx-4 mt-3 p-3 rounded-2xl bg-[#eaf7e8] border border-[#cbe4c7] flex items-center justify-between gap-2 text-xs text-[#176b3a]">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#176b3a] shrink-0" />
            <span className="font-medium text-[11px]">
              {subtotal >= 500 
                ? '🎉 You unlocked FREE direct farm delivery!' 
                : `Add ₹${500 - subtotal} more for FREE delivery`}
            </span>
          </div>
          <span className="font-bold text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#cbe4c7]">
            {subtotal >= 500 ? 'FREE' : '₹30'}
          </span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#eaf7e8] text-[#176b3a] mx-auto flex items-center justify-center text-2xl font-bold">
                🛒
              </div>
              <p className="text-sm font-bold text-gray-600">Your basket is empty!</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Explore our Marketplace for fresh farmer produce or Agri Store for seeds & bio-fertilizers.
              </p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#17351f] truncate">{item.product.name}</h4>
                  <p className="text-[11px] text-gray-500">
                    ₹{item.priceSnapshot}/{item.product.unit} • {item.product.sellerName}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Modifier */}
                    <div className="flex items-center gap-2 bg-gray-100 px-2 py-0.5 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="text-gray-600 hover:text-black font-bold text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="text-gray-600 hover:text-black font-bold text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-xs font-extrabold text-[#176b3a]">
                      ₹{item.priceSnapshot * item.quantity}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-[#fbfdfb] border-t border-gray-100 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#176b3a]" />
                  Farm Delivery Fee:
                </span>
                <span className="font-semibold text-gray-800">
                  {deliveryFee === 0 ? <span className="text-[#176b3a] font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline font-extrabold text-base text-[#17351f]">
                <span>Payable Total:</span>
                <span className="text-2xl text-[#176b3a] font-['Poppins',sans-serif]">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                onProceedToCheckout();
              }}
              className="w-full bg-[#176b3a] text-white py-3.5 px-4 rounded-xl font-bold text-sm hover:bg-[#12552e] shadow-lg shadow-[#176b3a]/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>Proceed to Checkout (₹{totalAmount})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

