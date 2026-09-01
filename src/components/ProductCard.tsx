import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Star, MapPin, Plus, Check, ShieldCheck, Sparkles, Sprout, QrCode } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  onShowQr?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onShowQr }) => {
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.find(item => item.product.id === product.id);

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden border border-[#e5eee4] hover:border-[#a8d95b] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Container */}
      <div 
        onClick={() => onSelect && onSelect(product)}
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100 cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.organicCertified && (
            <span className="bg-[#176b3a] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sprout className="w-3 h-3" />
              ORGANIC
            </span>
          )}
          {product.productType === 'FARM_PRODUCE' && (
            <span className="bg-white/95 backdrop-blur-xs text-[#17351f] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              🌿 FARM FRESH
            </span>
          )}
          {product.productType === 'AGRI_SUPPLY' && (
            <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              🌾 AGRI SUPPLY
            </span>
          )}
        </div>

        {/* Top Right Quick QR Code Trigger */}
        {onShowQr && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShowQr(product);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#17351f] flex items-center justify-center shadow-md z-10 hover:scale-110 transition-transform"
            title="Show Scannable QR Tag"
          >
            <QrCode className="w-4 h-4 text-[#176b3a]" />
          </button>
        )}

        {/* Stock status */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          {product.stock > 0 ? `${product.stock} ${product.unit} left` : 'Out of Stock'}
        </div>
      </div>

      {/* Product Body Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating and Distance */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <div className="flex items-center gap-1 text-[#f39a3d] font-bold">
              <Star className="w-3.5 h-3.5 fill-[#f39a3d]" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
            {product.distanceKm && (
              <span className="text-[11px] text-[#176b3a] font-semibold flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {product.distanceKm} km away
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onSelect && onSelect(product)}
            className="font-bold text-base text-[#17351f] group-hover:text-[#176b3a] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Seller / Farm Info */}
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 line-clamp-1">
            <span>👨‍🌾</span>
            <span className="font-semibold text-gray-700">{product.sellerName}</span>
          </p>
          <p className="text-[11px] text-gray-400 truncate mt-0.5">{product.farmLocation}</p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold text-[#176b3a] font-['Poppins',sans-serif] leading-tight">
              ₹{product.price}
              <span className="text-xs text-gray-500 font-normal ml-1">/{product.unit}</span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              inCart
                ? 'bg-[#eaf7e8] text-[#176b3a] border border-[#a8d95b] hover:bg-[#d8f2d5]'
                : 'bg-[#176b3a] text-white hover:bg-[#12552e] shadow-md shadow-[#176b3a]/20 active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added ({inCart.quantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
