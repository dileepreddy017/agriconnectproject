export type UserRole = 'CUSTOMER' | 'FARMER' | 'DELIVERY' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  farmName?: string;
  farmLocation?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  rating?: number;
  totalSales?: number;
  totalEarnings?: number;
}

export type User = UserProfile;

export type PaymentMethodType = 
  | 'RAZORPAY'
  | 'UPI' 
  | 'CARD' 
  | 'NET_BANKING' 
  | 'COD'
  | 'CASH_ON_DELIVERY';

export type ProductCategoryType = 
  | 'VEGETABLE'
  | 'FRUIT'
  | 'GRAIN'
  | 'PULSE'
  | 'SPICE'
  | 'ORGANIC_PRODUCE'
  | 'SEEDS'
  | 'FERTILIZERS'
  | 'FERTILIZER'
  | 'CROP_PROTECTION'
  | 'EQUIPMENT'
  | 'IRRIGATION'
  | 'TOOLS';

export type ProductType = 'FARM_PRODUCE' | 'AGRI_SUPPLY';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategoryType;
  productType: ProductType;
  price: number;
  unit: string; // 'kg' | 'quintal' | 'bag (50kg)' | 'litre' | 'packet' | 'piece'
  stock: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  sellerId: string;
  sellerName: string;
  sellerRole?: 'FARMER' | 'SUPPLIER';
  farmLocation: string;
  distanceKm?: number;
  active: boolean;
  featured?: boolean;
  organicCertified?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  priceSnapshot: number;
}

export interface Address {
  id?: string;
  name?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'CREATED'
  | 'PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PACKED'
  | 'READY_FOR_PICKUP'
  | 'ASSIGNED'
  | 'DELIVERY_ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface SimulatedGPS {
  active: boolean;
  progressPercent: number; // 0 to 100
  currentLat: number;
  currentLng: number;
  farmerLat: number;
  farmerLng: number;
  customerLat: number;
  customerLng: number;
  estimatedMinutes: number;
  distanceRemainingKm: number;
  lastUpdated: string;
}

export interface OrderMilestone {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber?: string; // e.g. AGRI-10001
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  buyerAddress?: string;
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  farmLocation?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus?: PaymentStatus;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  orderStatus: OrderStatus;
  deliveryAddress?: Address;
  deliveryOtp?: string; // 4-digit delivery handoff verification code
  carrierName?: string; // e.g. AgriConnect Express Fleet
  trackingNumber?: string;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  deliveryPartnerVehicle?: string;
  deliveryPartnerPhoto?: string;
  proofOfDelivery?: {
    deliveredAt: string;
    recipientName: string;
    verifiedViaOtp: boolean;
  };
  simulatedGps?: SimulatedGPS;
  milestones?: OrderMilestone[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  orderId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string; // 'ALL' or specific user ID or role
  roleTarget?: UserRole;
  title: string;
  message: string;
  type: 'ORDER' | 'DELIVERY' | 'PAYMENT' | 'SYSTEM';
  read: boolean;
  orderId?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId?: string;
  subject: string;
  category: 'ORDER_ISSUE' | 'PAYMENT' | 'DELIVERY' | 'PRODUCT_QUALITY' | 'GENERAL';
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  adminReply?: string;
  createdAt: string;
}

export interface WeatherData {
  city: string;
  state: string;
  tempC: number;
  condition: string;
  humidity: number;
  windKmh: number;
  rainChancePercent: number;
  soilMoisture: string;
  advisory: string;
  forecast: {
    day: string;
    temp: number;
    icon: string;
    condition: string;
    rainProb: number;
  }[];
}

export interface MandiPriceItem {
  id: string;
  commodity: string;
  variety: string;
  market: string;
  state: string;
  minPrice: number; // ₹ per quintal
  maxPrice: number;
  modalPrice: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  arrivalDate: string;
}
