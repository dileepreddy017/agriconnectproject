import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Zap, 
  Check, 
  Sprout, 
  Truck,
  MessageSquareQuote,
  QrCode
} from 'lucide-react';
import { QrCodeModal } from './QrCodeModal';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onQuickBuy?: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onQuickBuy }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setIsLoadingReviews(true);
      fetch(`/api/reviews?productId=${product.id}`)
        .then(r => r.json())
        .then(d => {
          setReviews(d.reviews || []);
          setIsLoadingReviews(false);
        })
        .catch(() => setIsLoadingReviews(false));
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    if (onQuickBuy) {
      onQuickBuy(product, quantity);
    } else {
      addToCart(product, quantity);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-up my-8">
          
          {/* Header Bar */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#176b3a] bg-[#eaf7e8] px-3 py-1 rounded-full">
                {product.productType === 'FARM_PRODUCE' ? '🌱 Fresh Harvest Produce' : '🌾 Agricultural Supplies'}
              </span>
              <button
                onClick={() => setShowQrModal(true)}
                className="text-xs font-bold text-[#176b3a] bg-[#eaf7e8] hover:bg-[#d5f0d2] px-2.5 py-1 rounded-full border border-[#b2d9a6] flex items-center gap-1 transition-colors"
                title="View Scannable QR Tag"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Show QR</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Large Image */}
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.organicCertified && (
                <div className="absolute top-3 left-3 bg-[#176b3a] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5" />
                  100% ORGANIC
                </div>
              )}
            </div>

            {/* Product Meta */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#f39a3d] font-bold">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#f39a3d]' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span>{product.rating} ({product.reviewsCount} reviews)</span>
                </div>

                <h2 className="text-2xl font-extrabold text-[#17351f] font-['Poppins',sans-serif] mt-2">
                  {product.name}
                </h2>

                <div className="mt-3 text-3xl font-extrabold text-[#176b3a] font-['Poppins',sans-serif]">
                  ₹{product.price}
                  <span className="text-sm font-normal text-gray-500 ml-1">/{product.unit}</span>
                </div>

                <div className="mt-3 bg-[#f6faf5] p-3 rounded-xl border border-[#e0ede0] text-xs text-gray-600 space-y-1">
                  <p className="flex items-center gap-1.5 font-semibold text-[#17351f]">
                    <span>👨‍🌾 Producer:</span>
                    <span>{product.sellerName}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#176b3a]" />
                    <span>{product.farmLocation}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[#176b3a] font-bold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Direct farm pickup & doorstep delivery available</span>
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Quantity:</span>
                <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white text-gray-700 font-bold flex items-center justify-center hover:bg-gray-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-sm min-w-[2rem] text-center">
                    {quantity} {product.unit}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-white text-gray-700 font-bold flex items-center justify-center hover:bg-gray-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Product Description */}
          <div>
            <h4 className="font-bold text-sm text-[#17351f] mb-1">About this Produce / Supply</h4>
            <p className="text-xs text-gray-600 leading-relaxed bg-[#fbfdfa] p-3.5 rounded-xl border border-gray-100">
              {product.description}
            </p>
          </div>

          {/* Customer Reviews Spotlight */}
          <div>
            <h4 className="font-bold text-sm text-[#17351f] mb-2 flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-[#176b3a]" />
              Customer Reviews ({reviews.length})
            </h4>
            
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No reviews yet for this product batch. Be the first to order and review!</p>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {reviews.map(r => (
                  <div key={r.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-800">
                      <span>{r.userName}</span>
                      <span className="text-[#f39a3d]">{'★'.repeat(r.rating)}</span>
                    </div>
                    <p className="text-gray-600 mt-1 leading-snug">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#eaf7e8] text-[#176b3a] border border-[#a8d95b] hover:bg-[#d5f0d2] flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add {quantity} {product.unit} to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#176b3a] to-[#258b4f] text-white hover:brightness-105 shadow-md shadow-[#176b3a]/30 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              Direct Checkout (₹{product.price * quantity})
            </button>
          </div>

          </div>

        </div>

      </div>

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title={product.name}
        subtitle="Farm Provenance & Batch Traceability Tag"
        value={`agri://product/${product.id}`}
        type="PRODUCT"
        meta={{
          id: product.id,
          name: product.name,
          price: product.price,
          location: product.farmLocation
        }}
      />
    </>
  );
};
