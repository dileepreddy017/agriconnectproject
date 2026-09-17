import express from 'express';
import path from 'path';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { 
  UserProfile, 
  Product, 
  Order, 
  Review, 
  AppNotification, 
  SupportTicket, 
  MandiPriceItem, 
  WeatherData,
  OrderStatus,
  PaymentMethodType
} from './src/types';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Lazy Razorpay Client initialization
let razorpayClient: Razorpay | null = null;
function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return null;
  }
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return razorpayClient;
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-Memory Database Store
const USERS: UserProfile[] = [
  {
    id: 'user_cust_1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'CUSTOMER',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    address: 'Flat 402, Shantiniketan Apts, Sector 14',
    city: 'Udaipur',
    state: 'Rajasthan',
    pincode: '313001'
  },
  {
    id: 'user_farm_1',
    name: 'Ramesh Kumar Patel',
    email: 'ramesh@example.com',
    role: 'FARMER',
    phone: '+91 91234 56780',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    farmName: 'Patel Organic Farms & Orchards',
    farmLocation: 'Badgaon Village, Udaipur Outskirts',
    city: 'Udaipur',
    state: 'Rajasthan',
    pincode: '313011',
    rating: 4.9,
    totalSales: 342,
    totalEarnings: 89450
  },
  {
    id: 'user_farm_2',
    name: 'Mohan Singh Rajput',
    email: 'mohan@example.com',
    role: 'FARMER',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    farmName: 'Mewar Krishi Organics',
    farmLocation: 'Gogunda Tehsil, Udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    pincode: '313505',
    rating: 4.8,
    totalSales: 215,
    totalEarnings: 54300
  },
  {
    id: 'user_del_1',
    name: 'Vikram Gurjar',
    email: 'vikram@example.com',
    role: 'DELIVERY',
    phone: '+91 94140 88990',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    vehicleType: 'Hero Electric Cargo Bike',
    vehicleNumber: 'RJ-27-EK-8942',
    city: 'Udaipur',
    state: 'Rajasthan',
    rating: 4.95
  },
  {
    id: 'user_admin_1',
    name: 'AgriConnect Admin',
    email: 'admin@agriconnect.in',
    role: 'ADMIN',
    phone: '+91 90000 00000',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    city: 'Udaipur',
    state: 'Rajasthan'
  }
];

let PRODUCTS: Product[] = [
  // Produce (Farmers)
  {
    id: 'prod_1',
    name: 'Fresh Farm Vine Tomatoes',
    description: 'Naturally ripened, pesticide-free fresh red tomatoes harvested this morning from organic soil.',
    category: 'VEGETABLE',
    productType: 'FARM_PRODUCE',
    price: 35,
    unit: 'kg',
    stock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 48,
    sellerId: 'user_farm_1',
    sellerName: 'Patel Organic Farms',
    sellerRole: 'FARMER',
    farmLocation: 'Badgaon, Udaipur (5 km away)',
    distanceKm: 5,
    active: true,
    featured: true,
    organicCertified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_2',
    name: 'Golden Farm Potatoes',
    description: 'High-grade cooking potatoes, freshly dug out, great shelf life and earthy taste.',
    category: 'VEGETABLE',
    productType: 'FARM_PRODUCE',
    price: 28,
    unit: 'kg',
    stock: 300,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 32,
    sellerId: 'user_farm_2',
    sellerName: 'Mewar Krishi Organics',
    sellerRole: 'FARMER',
    farmLocation: 'Gogunda, Udaipur (8 km away)',
    distanceKm: 8,
    active: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_3',
    name: 'Sweet Kesar Mangoes',
    description: 'Sweet, fragrant tree-ripened Kesar mangoes from solar-irrigated orchard.',
    category: 'FRUIT',
    productType: 'FARM_PRODUCE',
    price: 90,
    unit: 'kg',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 65,
    sellerId: 'user_farm_1',
    sellerName: 'Patel Organic Farms',
    farmLocation: 'Badgaon, Udaipur (7 km away)',
    distanceKm: 7,
    active: true,
    featured: true,
    organicCertified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_4',
    name: 'Sharbati Whole Wheat Grain',
    description: 'Premium quality golden Sharbati wheat, cleaned and sun-dried, rich in natural fiber and nutrition.',
    category: 'GRAIN',
    productType: 'FARM_PRODUCE',
    price: 45,
    unit: 'kg',
    stock: 500,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 29,
    sellerId: 'user_farm_2',
    sellerName: 'Mewar Krishi Organics',
    farmLocation: 'Gogunda, Udaipur (10 km away)',
    distanceKm: 10,
    active: true,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_5',
    name: 'Fresh Red Onions',
    description: 'Crisp and pungent medium-sized Nashik/Mewar red onions, cured for long storage.',
    category: 'VEGETABLE',
    productType: 'FARM_PRODUCE',
    price: 32,
    unit: 'kg',
    stock: 240,
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 19,
    sellerId: 'user_farm_1',
    sellerName: 'Patel Organic Farms',
    farmLocation: 'Badgaon, Udaipur (5 km away)',
    distanceKm: 5,
    active: true,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_6',
    name: 'Organic Basmati Paddy Rice',
    description: 'Long-grain aromatic organic basmati rice with exquisite aroma and fluffy texture upon cooking.',
    category: 'GRAIN',
    productType: 'FARM_PRODUCE',
    price: 75,
    unit: 'kg',
    stock: 180,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 42,
    sellerId: 'user_farm_2',
    sellerName: 'Mewar Krishi Organics',
    farmLocation: 'Gogunda, Udaipur (9 km away)',
    distanceKm: 9,
    active: true,
    featured: true,
    organicCertified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_7',
    name: 'Farm Fresh Crunchy Carrots',
    description: 'Tender, sweet winter carrots directly harvested with green tops intact.',
    category: 'VEGETABLE',
    productType: 'FARM_PRODUCE',
    price: 40,
    unit: 'kg',
    stock: 110,
    imageUrl: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 22,
    sellerId: 'user_farm_1',
    sellerName: 'Patel Organic Farms',
    farmLocation: 'Badgaon, Udaipur (6 km away)',
    distanceKm: 6,
    active: true,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_8',
    name: 'Organic Desi Chana (Chickpeas)',
    description: 'High protein unpolished brown chickpea pulses grown with zero chemical residues.',
    category: 'PULSE',
    productType: 'FARM_PRODUCE',
    price: 85,
    unit: 'kg',
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 15,
    sellerId: 'user_farm_2',
    sellerName: 'Mewar Krishi Organics',
    farmLocation: 'Gogunda, Udaipur (8 km away)',
    distanceKm: 8,
    active: true,
    featured: false,
    organicCertified: true,
    createdAt: new Date().toISOString()
  },

  // Agri Store Supplies (Seeds, Fertilizers, Pesticides, Equipment, Irrigation, Tools)
  {
    id: 'agri_1',
    name: 'Hybrid F1 Tomato Seeds (Abhinav 10g)',
    description: 'High yielding disease resistant hybrid tomato seeds, suitable for year-round cultivation in Indian climate.',
    category: 'SEEDS',
    productType: 'AGRI_SUPPLY',
    price: 420,
    unit: 'packet',
    stock: 65,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 56,
    sellerId: 'user_admin_1',
    sellerName: 'AgriConnect Official Supplies Hub',
    sellerRole: 'SUPPLIER',
    farmLocation: 'AgriConnect Central Depot, Udaipur',
    active: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'agri_2',
    name: '100% Organic Vermicompost Fertilizer (25kg)',
    description: 'Earthworm digested nutrient-rich organic manure enriched with neem cake and beneficial soil microbes.',
    category: 'FERTILIZER',
    productType: 'AGRI_SUPPLY',
    price: 380,
    unit: 'bag (25kg)',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
    rating: 4.85,
    reviewsCount: 78,
    sellerId: 'user_admin_1',
    sellerName: 'AgriConnect Official Supplies Hub',
    sellerRole: 'SUPPLIER',
    farmLocation: 'AgriConnect Central Depot, Udaipur',
    active: true,
    featured: true,
    organicCertified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'agri_3',
    name: 'Bio-Neem Crop Protection Oil (10,000 PPM - 1L)',
    description: 'Pure cold-pressed neem seed extract bio-pesticide. Natural deterrent against aphids, whiteflies, and mites without harming bees.',
    category: 'CROP_PROTECTION',
    productType: 'AGRI_SUPPLY',
    price: 490,
    unit: 'litre',
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 38,
    sellerId: 'user_admin_1',
    sellerName: 'AgriConnect Official Supplies Hub',
    sellerRole: 'SUPPLIER',
    farmLocation: 'AgriConnect Central Depot, Udaipur',
    active: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'agri_4',
    name: 'Complete Drip Irrigation Starter Kit (0.5 Acre)',
    description: 'Includes 16mm main lateral line, inline drippers, micro-tubes, filter assembly, and end caps for water-efficient farming.',
    category: 'IRRIGATION',
    productType: 'AGRI_SUPPLY',
    price: 3200,
    unit: 'unit',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
    rating: 4.92,
    reviewsCount: 27,
    sellerId: 'user_admin_1',
    sellerName: 'AgriConnect Official Supplies Hub',
    sellerRole: 'SUPPLIER',
    farmLocation: 'AgriConnect Central Depot, Udaipur',
    active: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'agri_5',
    name: '16L Battery Operated Knapsack Sprayer',
    description: 'High capacity 12V rechargeable battery sprayer with brass lance and triple nozzles for effortless crop foliar spray.',
    category: 'EQUIPMENT',
    productType: 'AGRI_SUPPLY',
    price: 2450,
    unit: 'piece',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=800&q=80',
    rating: 4.75,
    reviewsCount: 34,
    sellerId: 'user_admin_1',
    sellerName: 'AgriConnect Official Supplies Hub',
    sellerRole: 'SUPPLIER',
    farmLocation: 'AgriConnect Central Depot, Udaipur',
    active: true,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'agri_6',
    name: 'Heavy Duty Ergonomic Pruning Secateurs & Sickle Set',
    description: 'Forged carbon steel blades with non-slip grip handles for effortless harvesting, pruning, and weed management.',
    category: 'TOOLS',
    productType: 'AGRI_SUPPLY',
    price: 650,
    unit: 'piece',
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 41,
    sellerId: 'user_admin_1',
    sellerName: 'AgriConnect Official Supplies Hub',
    sellerRole: 'SUPPLIER',
    farmLocation: 'AgriConnect Central Depot, Udaipur',
    active: true,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

let ORDERS: Order[] = [
  {
    id: 'order_10001',
    orderNumber: 'AGRI-10001',
    buyerId: 'user_cust_1',
    buyerName: 'Priya Sharma',
    buyerPhone: '+91 98765 43210',
    sellerId: 'user_farm_1',
    sellerName: 'Patel Organic Farms',
    items: [
      {
        product: PRODUCTS[0], // Tomatoes
        quantity: 2,
        priceSnapshot: 35
      },
      {
        product: PRODUCTS[1], // Potatoes
        quantity: 3,
        priceSnapshot: 28
      }
    ],
    subtotal: 154,
    deliveryFee: 30,
    discount: 0,
    totalAmount: 184,
    paymentMethod: 'RAZORPAY',
    paymentStatus: 'COMPLETED',
    transactionId: 'pay_rzp_9841249821',
    razorpayOrderId: 'order_rzp_10001',
    razorpayPaymentId: 'pay_rzp_9841249821',
    orderStatus: 'DELIVERED',
    deliveryOtp: '8942',
    carrierName: 'AgriConnect Express Fleet',
    trackingNumber: 'ACHE-984210',
    deliveryAddress: {
      id: 'addr_1',
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      addressLine: 'Flat 402, Shantiniketan Apts, Sector 14',
      city: 'Udaipur',
      state: 'Rajasthan',
      pincode: '313001',
      lat: 24.5854,
      lng: 73.7125,
      isDefault: true
    },
    deliveryPartnerId: 'user_del_1',
    deliveryPartnerName: 'Vikram Gurjar',
    deliveryPartnerPhone: '+91 94140 88990',
    deliveryPartnerVehicle: 'Hero Electric Cargo Bike (RJ-27-EK-8942)',
    proofOfDelivery: {
      deliveredAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      recipientName: 'Priya Sharma',
      verifiedViaOtp: true
    },
    simulatedGps: {
      active: false,
      progressPercent: 100,
      currentLat: 24.5854,
      currentLng: 73.7125,
      farmerLat: 24.6210,
      farmerLng: 73.6800,
      customerLat: 24.5854,
      customerLng: 73.7125,
      estimatedMinutes: 0,
      distanceRemainingKm: 0,
      lastUpdated: new Date().toISOString()
    },
    milestones: [
      { status: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', description: '₹184 verified via Razorpay Gateway', timestamp: '10:00 AM', completed: true },
      { status: 'ACCEPTED', label: 'Farmer Accepted', description: 'Ramesh Patel accepted the harvest order', timestamp: '10:05 AM', completed: true },
      { status: 'PACKED', label: 'Produce Packed', description: 'Packed in eco-friendly aerated crates', timestamp: '10:20 AM', completed: true },
      { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup', description: 'Waiting at farm gate for delivery partner', timestamp: '10:30 AM', completed: true },
      { status: 'DELIVERY_ASSIGNED', label: 'Partner Assigned', description: 'Vikram Gurjar assigned', timestamp: '10:32 AM', completed: true },
      { status: 'PICKED_UP', label: 'Picked Up', description: 'Cargo loaded onto delivery bike', timestamp: '10:45 AM', completed: true },
      { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'En route to Shantiniketan Apts', timestamp: '10:50 AM', completed: true },
      { status: 'DELIVERED', label: 'Delivered (OTP Verified)', description: 'Handed over and verified with OTP 8942', timestamp: '11:10 AM', completed: true }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

let REVIEWS: Review[] = [
  {
    id: 'rev_1',
    productId: 'prod_1',
    orderId: 'order_10001',
    userId: 'user_cust_1',
    userName: 'Priya Sharma',
    rating: 5,
    comment: 'The sweetest and freshest organic tomatoes I have ever tasted! Delivered within 40 minutes directly from Badgaon farm.',
    createdAt: new Date().toISOString()
  }
];

let NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_cust_1',
    roleTarget: 'CUSTOMER',
    title: '🌿 Welcome to AgriConnect',
    message: 'Browse farm-fresh organic produce directly from local farmers with instant Razorpay checkout and doorstep delivery!',
    type: 'SYSTEM',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif_2',
    userId: 'user_farm_1',
    roleTarget: 'FARMER',
    title: '👨‍🌾 Farmer Dashboard Active',
    message: 'You have active produce listings. You can also purchase Seeds and Bio-fertilizers from Agri Store.',
    type: 'SYSTEM',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif_3',
    userId: 'user_del_1',
    roleTarget: 'DELIVERY',
    title: '🛵 Delivery Partner Ready',
    message: 'Fleet dispatch system active. Accept pickup orders and verify customer delivery with 4-digit security OTP.',
    type: 'SYSTEM',
    read: false,
    createdAt: new Date().toISOString()
  }
];

let SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tick_1',
    userId: 'user_cust_1',
    userName: 'Priya Sharma',
    userEmail: 'priya@example.com',
    subject: 'Inquiry about bulk organic mango ordering',
    category: 'GENERAL',
    message: 'Can I order 50 kg of Kesar mangoes directly for a family celebration?',
    status: 'RESOLVED',
    adminReply: 'Yes! Farmers accept advance bulk bookings via AgriConnect. Contact Patel Farms directly or place via cart.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const MANDI_PRICES: MandiPriceItem[] = [
  { id: 'm_1', commodity: 'Tomato (Desi)', variety: 'Hybrid / Local', market: 'Udaipur APMC (Mandi)', state: 'Rajasthan', minPrice: 2800, maxPrice: 3800, modalPrice: 3500, trend: 'UP', arrivalDate: 'Today' },
  { id: 'm_2', commodity: 'Potato (Jyoti)', variety: 'Fresh Harvest', market: 'Udaipur APMC (Mandi)', state: 'Rajasthan', minPrice: 2200, maxPrice: 2900, modalPrice: 2700, trend: 'STABLE', arrivalDate: 'Today' },
  { id: 'm_3', commodity: 'Onion (Red)', variety: 'Medium Grade', market: 'Nashik / Udaipur APMC', state: 'Rajasthan', minPrice: 2600, maxPrice: 3300, modalPrice: 3000, trend: 'DOWN', arrivalDate: 'Today' },
  { id: 'm_4', commodity: 'Wheat (Sharbati)', variety: 'Grade A', market: 'Kota / Udaipur Mandi', state: 'Rajasthan', minPrice: 3900, maxPrice: 4600, modalPrice: 4350, trend: 'UP', arrivalDate: 'Today' },
  { id: 'm_5', commodity: 'Mustard (Sarson)', variety: 'Black High Oil', market: 'Alwar / Bharatpur Mandi', state: 'Rajasthan', minPrice: 5100, maxPrice: 5750, modalPrice: 5450, trend: 'UP', arrivalDate: 'Today' },
  { id: 'm_6', commodity: 'Cotton (Narma)', variety: 'Medium Staple', market: 'Sri Ganganagar Mandi', state: 'Rajasthan', minPrice: 6800, maxPrice: 7400, modalPrice: 7150, trend: 'STABLE', arrivalDate: 'Today' },
  { id: 'm_7', commodity: 'Gram (Desi Chana)', variety: 'Unpolished', market: 'Jaipur APMC', state: 'Rajasthan', minPrice: 5800, maxPrice: 6400, modalPrice: 6100, trend: 'UP', arrivalDate: 'Today' }
];

const WEATHER_INFO: WeatherData = {
  city: 'Udaipur',
  state: 'Rajasthan',
  tempC: 31,
  condition: 'Partly Cloudy & Pleasant',
  humidity: 58,
  windKmh: 14,
  rainChancePercent: 20,
  soilMoisture: 'Optimal (62%)',
  advisory: 'Favorable conditions for morning foliar spray and vegetable harvesting. Next 48 hours show mild cloud cover with low rain risk.',
  forecast: [
    { day: 'Today', temp: 31, icon: '🌤️', condition: 'Partly Cloudy', rainProb: 20 },
    { day: 'Tomorrow', temp: 32, icon: '☀️', condition: 'Sunny & Warm', rainProb: 10 },
    { day: 'Thursday', temp: 30, icon: '🌦️', condition: 'Isolated Showers', rainProb: 45 },
    { day: 'Friday', temp: 29, icon: '🌧️', condition: 'Light Rain', rainProb: 60 },
    { day: 'Saturday', temp: 30, icon: '🌤️', condition: 'Clearing Up', rainProb: 25 }
  ]
};

// Real-Time Server Sent Events (SSE) Client Pool for Phone + Laptop Cross-Device Sync
interface SSEClient {
  id: string;
  res: express.Response;
}
let sseClients: SSEClient[] = [];

function broadcastSSE(type: string, data: any) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (e) {
      // client disconnected
    }
  });
}

// SSE Connection Endpoint
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newClient: SSEClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial ping
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId, timestamp: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// Helper to push notifications
function createNotification(notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) {
  const newNotif: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    read: false,
    createdAt: new Date().toISOString()
  };
  NOTIFICATIONS.unshift(newNotif);
  broadcastSSE('NOTIFICATION', newNotif);
  return newNotif;
}

// ==================== AUTH API ====================
app.get('/api/auth/users', (req, res) => {
  res.json({ users: USERS });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, demoRole } = req.body;
  
  if (demoRole) {
    const user = USERS.find(u => u.role === demoRole);
    if (user) {
      return res.json({ success: true, user, token: `demo_token_${user.id}` });
    }
  }

  const user = USERS.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (user) {
    return res.json({ success: true, user, token: `token_${user.id}` });
  }

  // If new email provided in simple login, auto-register as customer
  if (email && email.includes('@')) {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'CUSTOMER',
      phone: '+91 98000 00000',
      city: 'Udaipur',
      state: 'Rajasthan',
      pincode: '313001'
    };
    USERS.push(newUser);
    return res.json({ success: true, user: newUser, token: `token_${newUser.id}` });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials. Use demo accounts or register.' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, phone, farmName, farmLocation, vehicleType, vehicleNumber, city, state, pincode } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser: UserProfile = {
    id: `user_${Date.now()}`,
    name,
    email,
    role: role || 'CUSTOMER',
    phone: phone || '+91 98000 00000',
    city: city || 'Udaipur',
    state: state || 'Rajasthan',
    pincode: pincode || '313001',
    farmName: role === 'FARMER' ? (farmName || `${name}'s Farm`) : undefined,
    farmLocation: role === 'FARMER' ? (farmLocation || 'Udaipur Outskirts') : undefined,
    vehicleType: role === 'DELIVERY' ? (vehicleType || 'Electric Cargo Scooter') : undefined,
    vehicleNumber: role === 'DELIVERY' ? (vehicleNumber || 'RJ-27-TEST') : undefined,
    totalSales: role === 'FARMER' ? 0 : undefined,
    totalEarnings: role === 'FARMER' ? 0 : undefined,
    rating: 5.0
  };

  USERS.push(newUser);
  createNotification({
    userId: newUser.id,
    title: '🌱 Welcome to AgriConnect!',
    message: `Account created successfully as ${newUser.role}. You are ready to start.`,
    type: 'SYSTEM'
  });

  return res.json({ success: true, user: newUser, token: `token_${newUser.id}` });
});

// ==================== PRODUCTS API ====================
app.get('/api/products', (req, res) => {
  let list = [...PRODUCTS];
  const { category, type, search, sellerId, minRating, maxPrice, sort } = req.query;

  if (category && category !== 'ALL') {
    list = list.filter(p => p.category === category);
  }
  if (type) {
    list = list.filter(p => p.productType === type);
  }
  if (sellerId) {
    list = list.filter(p => p.sellerId === sellerId);
  }
  if (search) {
    const s = String(search).toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(s) || 
      p.description.toLowerCase().includes(s) ||
      p.sellerName.toLowerCase().includes(s) ||
      p.farmLocation.toLowerCase().includes(s)
    );
  }
  if (minRating) {
    list = list.filter(p => p.rating >= Number(minRating));
  }
  if (maxPrice) {
    list = list.filter(p => p.price <= Number(maxPrice));
  }

  // Sort
  if (sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else {
    // Newest
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ products: list });
});

app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const reviews = REVIEWS.filter(r => r.productId === req.params.id);
  res.json({ product, reviews });
});

app.post('/api/products', (req, res) => {
  const { name, description, category, productType, price, unit, stock, imageUrl, sellerId, sellerName, farmLocation, organicCertified } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const newProd: Product = {
    id: `prod_${Date.now()}`,
    name,
    description: description || 'Fresh farm produce listed directly by producer.',
    category,
    productType: productType || 'FARM_PRODUCE',
    price: Number(price),
    unit: unit || 'kg',
    stock: Number(stock) || 50,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 0,
    sellerId: sellerId || 'user_farm_1',
    sellerName: sellerName || 'Local Farmer',
    sellerRole: productType === 'AGRI_SUPPLY' ? 'SUPPLIER' : 'FARMER',
    farmLocation: farmLocation || 'Udaipur, Rajasthan',
    distanceKm: 5 + Math.floor(Math.random() * 10),
    active: true,
    featured: false,
    organicCertified: Boolean(organicCertified),
    createdAt: new Date().toISOString()
  };

  PRODUCTS.unshift(newProd);

  // Notify buyers / system
  createNotification({
    userId: 'ALL',
    title: '🌾 New Harvest Product Listed!',
    message: `${newProd.sellerName} listed ${newProd.name} at ₹${newProd.price}/${newProd.unit}`,
    type: 'ORDER'
  });

  broadcastSSE('PRODUCT_CREATED', newProd);

  res.json({ success: true, product: newProd });
});

app.delete('/api/products/:id', (req, res) => {
  PRODUCTS = PRODUCTS.filter(p => p.id !== req.params.id);
  broadcastSSE('PRODUCT_DELETED', { id: req.params.id });
  res.json({ success: true });
});

app.patch('/api/products/:id/toggle', (req, res) => {
  const prod = PRODUCTS.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  prod.active = !prod.active;
  broadcastSSE('PRODUCT_UPDATED', prod);
  res.json({ success: true, product: prod });
});

// ==================== ORDERS & CHECKOUT API ====================
app.get('/api/orders', (req, res) => {
  const { userId, role, status } = req.query;
  let list = [...ORDERS];

  if (role === 'CUSTOMER' && userId) {
    list = list.filter(o => o.buyerId === userId);
  } else if (role === 'FARMER' && userId) {
    list = list.filter(o => o.sellerId === userId || o.buyerId === userId);
  } else if (role === 'DELIVERY' && userId) {
    list = list.filter(o => o.deliveryPartnerId === userId || o.orderStatus === 'READY_FOR_PICKUP');
  }

  if (status) {
    list = list.filter(o => o.orderStatus === status);
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ orders: list });
});

app.get('/api/orders/:id', (req, res) => {
  const order = ORDERS.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

// Create Order & Process Payment Helper
const createRealOrderInstance = (payload: any): Order => {
  const { 
    buyerId, 
    buyerName, 
    buyerPhone, 
    buyerAddress, 
    items, 
    deliveryAddress, 
    paymentMethod, 
    transactionId: customTxnId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    notes,
    subtotal: passedSubtotal,
    deliveryFee: passedDeliveryFee,
    totalAmount: passedTotal
  } = payload;

  const buyer = USERS.find(u => u.id === buyerId) || {
    id: buyerId || `user_cust_${Date.now()}`,
    name: buyerName || 'Customer',
    phone: buyerPhone || '+91 98000 00000',
    email: 'customer@agriconnect.in',
    role: 'CUSTOMER' as const
  };

  const orderIndex = ORDERS.length + 10001;
  const orderNumber = `AGRI-${orderIndex}`;

  let calculatedSubtotal = 0;
  (items || []).forEach((it: any) => {
    calculatedSubtotal += (it.priceSnapshot || it.product?.price || 0) * (it.quantity || 1);
  });

  const subtotal = passedSubtotal ?? calculatedSubtotal;
  const deliveryFee = passedDeliveryFee ?? (subtotal > 500 ? 0 : 30);
  const totalAmount = passedTotal ?? (subtotal + deliveryFee);

  // Get primary seller from first item
  const primarySellerId = items?.[0]?.product?.sellerId || 'user_farm_1';
  const primarySellerName = items?.[0]?.product?.sellerName || 'Patel Organic Farms';
  const primaryFarmLocation = items?.[0]?.product?.farmLocation || 'Badgaon Organic Valley, Udaipur';

  // Farmer coordinate (Badgaon, Udaipur)
  const farmerLat = 24.6210;
  const farmerLng = 73.6800;
  // Customer coordinate
  const customerLat = deliveryAddress?.lat || 24.5854;
  const customerLng = deliveryAddress?.lng || 73.7125;

  const resolvedPaymentMethod: PaymentMethodType = paymentMethod || 'RAZORPAY';
  const isCod = resolvedPaymentMethod === 'COD' || resolvedPaymentMethod === 'CASH_ON_DELIVERY';
  const txnId = razorpayPaymentId || customTxnId || (isCod 
    ? `COD_REF_${Math.floor(100000 + Math.random() * 900000)}` 
    : `TXN_${resolvedPaymentMethod}_${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`);

  const paymentLabel = resolvedPaymentMethod === 'RAZORPAY'
    ? 'Razorpay Verified Payment'
    : resolvedPaymentMethod === 'UPI' 
    ? 'UPI Payment Verified' 
    : resolvedPaymentMethod === 'CARD'
    ? 'Card Payment Gateway Approved'
    : resolvedPaymentMethod === 'NET_BANKING'
    ? 'Net Banking Authorized'
    : 'Cash on Delivery';

  // Generate 4-digit Secure Delivery Hand-off OTP
  const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));
  const trackingNumber = `ACHE-${Date.now().toString().slice(-6)}`;

  const newOrder: Order = {
    id: `order_${Date.now()}`,
    orderNumber,
    buyerId: buyer.id,
    buyerName: buyerName || buyer.name,
    buyerPhone: buyerPhone || buyer.phone,
    buyerAddress: typeof buyerAddress === 'string' ? buyerAddress : (deliveryAddress?.addressLine || 'Sector 14, Hiran Magri, Udaipur'),
    sellerId: primarySellerId,
    sellerName: primarySellerName,
    sellerPhone: '+91 94140 12345',
    farmLocation: primaryFarmLocation,
    items: items || [],
    subtotal,
    deliveryFee,
    discount: 0,
    totalAmount,
    paymentMethod: resolvedPaymentMethod,
    paymentStatus: isCod ? 'PENDING' : 'COMPLETED',
    transactionId: txnId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderStatus: 'PAYMENT_CONFIRMED',
    deliveryOtp,
    carrierName: 'AgriConnect Express Fleet',
    trackingNumber,
    deliveryPartnerId: 'user_del_1',
    deliveryPartnerName: 'Vikram Gurjar',
    deliveryPartnerPhone: '+91 94140 88990',
    deliveryPartnerVehicle: 'Hero Electric Cargo Bike (RJ-27-EK-8942)',
    deliveryAddress: typeof deliveryAddress === 'object' ? deliveryAddress : {
      id: 'addr_default',
      name: buyerName || buyer.name,
      phone: buyerPhone || buyer.phone,
      addressLine: typeof buyerAddress === 'string' ? buyerAddress : 'Sector 14, Hiran Magri, Udaipur',
      city: 'Udaipur',
      state: 'Rajasthan',
      pincode: '313001',
      lat: customerLat,
      lng: customerLng,
      isDefault: true
    },
    notes: notes || 'Farm-fresh direct delivery',
    simulatedGps: {
      active: false,
      progressPercent: 0,
      currentLat: farmerLat,
      currentLng: farmerLng,
      farmerLat,
      farmerLng,
      customerLat,
      customerLng,
      estimatedMinutes: 28,
      distanceRemainingKm: 6.5,
      lastUpdated: new Date().toISOString()
    },
    milestones: [
      { 
        status: 'PAYMENT_CONFIRMED', 
        label: isCod ? 'Order Placed (COD)' : 'Payment Verified (Razorpay)', 
        description: isCod ? 'Payment to be collected on doorstep delivery' : `₹${totalAmount} verified (${paymentLabel} • Ref: ${txnId})`, 
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
        completed: true 
      },
      { status: 'ACCEPTED', label: 'Farmer Acceptance', description: 'Farm manager scheduled harvesting & quality check', completed: false },
      { status: 'PACKED', label: 'Fresh Crate Pack', description: 'Harvest packed in temperature-controlled crate', completed: false },
      { status: 'READY_FOR_PICKUP', label: 'Ready for Dispatch', description: 'Loaded at farm gate, awaiting express courier', completed: false },
      { status: 'DELIVERY_ASSIGNED', label: 'Fleet Driver Assigned', description: 'Vikram Gurjar (Hero Electric Cargo Bike) assigned', completed: false },
      { status: 'PICKED_UP', label: 'Cargo Picked Up', description: 'Driver collected produce from farm dispatch bay', completed: false },
      { status: 'OUT_FOR_DELIVERY', label: 'Out for Doorstep Delivery', description: `Driver en route • Share OTP ${deliveryOtp} at doorstep`, completed: false },
      { status: 'DELIVERED', label: 'Doorstep Delivered', description: 'Delivered and verified with security OTP', completed: false }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  ORDERS.unshift(newOrder);

  // Update seller stats
  const seller = USERS.find(u => u.id === primarySellerId);
  if (seller) {
    seller.totalSales = (seller.totalSales || 0) + 1;
    seller.totalEarnings = (seller.totalEarnings || 0) + totalAmount;
  }

  // Deduct stock
  (items || []).forEach((it: any) => {
    const prodId = it.product?.id || it.productId;
    const p = PRODUCTS.find(prod => prod.id === prodId);
    if (p) {
      p.stock = Math.max(0, p.stock - (it.quantity || 1));
    }
  });

  // Notifications
  createNotification({
    userId: buyer.id,
    roleTarget: 'CUSTOMER',
    title: `🎉 Order Confirmed: ${orderNumber}`,
    message: isCod 
      ? `Order placed! ₹${totalAmount} payable on delivery. Delivery OTP is ${deliveryOtp}.` 
      : `Payment of ₹${totalAmount} confirmed via Razorpay! Your delivery OTP is ${deliveryOtp}.`,
    type: 'PAYMENT',
    orderId: newOrder.id
  });

  createNotification({
    userId: primarySellerId,
    roleTarget: 'FARMER',
    title: `🔔 New Order Received: ${orderNumber}`,
    message: `${buyerName || buyer.name} ordered ${items?.length || 1} item(s) (₹${totalAmount}). Please prepare for dispatch.`,
    type: 'ORDER',
    orderId: newOrder.id
  });

  createNotification({
    userId: 'user_del_1',
    roleTarget: 'DELIVERY',
    title: `📦 Delivery Task: ${orderNumber}`,
    message: `Delivery assigned for ${orderNumber} (${items?.length || 1} items to ${deliveryAddress?.city || 'Udaipur'}).`,
    type: 'DELIVERY',
    orderId: newOrder.id
  });

  broadcastSSE('ORDER_CREATED', newOrder);
  return newOrder;
};

// Create Order (Standard / COD)
const handleOrderCreation = (req: express.Request, res: express.Response) => {
  if (!req.body.items || !req.body.items.length) {
    return res.status(400).json({ error: 'No items in order' });
  }
  const order = createRealOrderInstance(req.body);
  return res.json({ success: true, order });
};

app.post('/api/orders', handleOrderCreation);
app.post('/api/orders/checkout', handleOrderCreation);

// ==================== RAZORPAY REAL PAYMENT ENDPOINTS ====================

// 1. Get Razorpay Config
app.get('/api/payment/razorpay/config', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_AgriConnectLive';
  const isCustomConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  res.json({
    keyId,
    currency: 'INR',
    companyName: 'AgriConnect India',
    themeColor: '#176b3a',
    isCustomConfigured
  });
});

// 2. Create Razorpay Order
app.post('/api/payment/razorpay/create-order', async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount in INR is required' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const rzReceipt = receipt || `rcpt_${Date.now()}`;
    const rzClient = getRazorpay();

    if (rzClient) {
      const order = await rzClient.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: rzReceipt,
        notes: notes || { app: 'AgriConnect' }
      });
      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        isLive: true
      });
    }

    // Standard sandbox Razorpay compliant order payload
    const mockRzOrderId = `order_rzp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    return res.json({
      success: true,
      orderId: mockRzOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_AgriConnectLive',
      isLive: false,
      note: 'Razorpay standard sandbox checkout'
    });
  } catch (err: any) {
    console.error('Razorpay order creation failed:', err);
    res.status(500).json({ error: err.message || 'Failed to create Razorpay order' });
  }
});

// 3. Verify Razorpay Payment and finalize order
app.post('/api/payment/razorpay/verify', (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderDetails 
    } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ error: 'Razorpay Payment ID is required' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keySecret && razorpay_order_id && razorpay_signature) {
      const hmac = crypto.createHmac('sha256', keySecret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid Razorpay payment signature verification' });
      }
    }

    const order = createRealOrderInstance({
      ...orderDetails,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'COMPLETED',
      transactionId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    return res.json({
      success: true,
      verified: true,
      order
    });
  } catch (err: any) {
    console.error('Razorpay verify error:', err);
    res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
});

// ==================== REAL DELIVERY ENDPOINTS ====================

// Verify Doorstep Delivery OTP
app.post('/api/orders/:id/verify-otp', (req, res) => {
  const { otp, recipientName } = req.body;
  const order = ORDERS.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (!otp || String(otp).trim() !== String(order.deliveryOtp).trim()) {
    return res.status(400).json({ 
      success: false, 
      error: `Invalid OTP. Please check the 4-digit code provided on the customer tracking screen (OTP: ${order.deliveryOtp}).` 
    });
  }

  order.orderStatus = 'DELIVERED';
  order.updatedAt = new Date().toISOString();
  order.proofOfDelivery = {
    deliveredAt: new Date().toISOString(),
    recipientName: recipientName || order.buyerName,
    verifiedViaOtp: true
  };

  order.simulatedGps = {
    ...order.simulatedGps,
    active: false,
    progressPercent: 100,
    estimatedMinutes: 0,
    distanceRemainingKm: 0,
    lastUpdated: new Date().toISOString()
  };

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  order.milestones.forEach(m => {
    m.completed = true;
    if (m.status === 'DELIVERED') {
      m.timestamp = nowTime;
      m.description = `Delivered & Verified via OTP (${order.proofOfDelivery?.recipientName})`;
    }
  });

  createNotification({
    userId: order.buyerId,
    roleTarget: 'CUSTOMER',
    title: `✅ Delivered: ${order.orderNumber}`,
    message: `Your order was successfully delivered! Handed over to ${recipientName || order.buyerName}. Thank you for choosing fresh farm produce.`,
    type: 'DELIVERY',
    orderId: order.id
  });

  broadcastSSE('ORDER_UPDATED', order);
  return res.json({ success: true, order, message: 'Delivery OTP verified successfully! Order completed.' });
});

// Auto-dispatch delivery fleet
app.post('/api/orders/:id/dispatch', (req, res) => {
  const order = ORDERS.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.orderStatus = 'OUT_FOR_DELIVERY';
  order.updatedAt = new Date().toISOString();
  order.deliveryPartnerId = 'user_del_1';
  order.deliveryPartnerName = 'Vikram Gurjar';
  order.deliveryPartnerPhone = '+91 94140 88990';
  order.deliveryPartnerVehicle = 'Hero Electric Cargo Bike (RJ-27-EK-8942)';
  
  order.simulatedGps = {
    ...order.simulatedGps,
    active: true,
    progressPercent: 20,
    estimatedMinutes: 20,
    distanceRemainingKm: 4.8,
    lastUpdated: new Date().toISOString()
  };

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let found = false;
  order.milestones.forEach(m => {
    if (m.status === 'OUT_FOR_DELIVERY') {
      m.completed = true;
      m.timestamp = nowTime;
      found = true;
    } else if (!found) {
      m.completed = true;
      if (!m.timestamp) m.timestamp = nowTime;
    }
  });

  createNotification({
    userId: order.buyerId,
    roleTarget: 'CUSTOMER',
    title: `🚚 Out for Delivery: ${order.orderNumber}`,
    message: `Delivery rider Vikram Gurjar is en route. Please keep your 4-digit Delivery OTP (${order.deliveryOtp}) ready at doorstep.`,
    type: 'DELIVERY',
    orderId: order.id
  });

  broadcastSSE('ORDER_UPDATED', order);
  return res.json({ success: true, order });
});

// Update Order Status (Farmer, Delivery Partner, Admin)
app.patch('/api/orders/:id/status', (req, res) => {
  const { status, partnerId, partnerName, partnerPhone, partnerVehicle } = req.body;
  const order = ORDERS.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.orderStatus = status as OrderStatus;
  order.updatedAt = new Date().toISOString();

  if (partnerId) {
    order.deliveryPartnerId = partnerId;
    order.deliveryPartnerName = partnerName || 'Vikram Gurjar';
    order.deliveryPartnerPhone = partnerPhone || '+91 94140 88990';
    order.deliveryPartnerVehicle = partnerVehicle || 'Hero Electric Cargo Bike';
  }

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Update milestones
  const milestoneMap: Record<string, string> = {
    'ACCEPTED': 'Farmer accepted the order for immediate fulfillment',
    'PACKED': 'Harvest freshly sorted and packed in sanitized crates',
    'READY_FOR_PICKUP': 'Package ready at farm gate for delivery agent',
    'DELIVERY_ASSIGNED': `${order.deliveryPartnerName || 'Delivery Partner'} assigned for dispatch`,
    'PICKED_UP': 'Collected from farm gate, loaded onto transport',
    'OUT_FOR_DELIVERY': 'Out for delivery to customer address',
    'DELIVERED': 'Order delivered successfully to recipient'
  };

  let found = false;
  order.milestones.forEach(m => {
    if (m.status === status) {
      m.completed = true;
      m.timestamp = nowTime;
      if (milestoneMap[status]) m.description = milestoneMap[status];
      found = true;
    } else if (!found) {
      m.completed = true;
    }
  });

  if (status === 'OUT_FOR_DELIVERY') {
    order.simulatedGps.active = true;
    order.simulatedGps.progressPercent = 10;
  } else if (status === 'DELIVERED') {
    order.simulatedGps.active = false;
    order.simulatedGps.progressPercent = 100;
    order.simulatedGps.estimatedMinutes = 0;
    order.simulatedGps.distanceRemainingKm = 0;
  }

  // Send role notifications
  const notifMsgs: Record<string, { title: string; msg: string }> = {
    'ACCEPTED': { title: `👨‍🌾 Order Accepted: ${order.orderNumber}`, msg: `Farmer ${order.sellerName} accepted your order.` },
    'PACKED': { title: `📦 Order Packed: ${order.orderNumber}`, msg: 'Your farm produce has been packed fresh.' },
    'READY_FOR_PICKUP': { title: `🌾 Ready for Pickup: ${order.orderNumber}`, msg: 'Package is ready at farm gate.' },
    'DELIVERY_ASSIGNED': { title: `🛵 Delivery Assigned: ${order.orderNumber}`, msg: `${order.deliveryPartnerName} is on the way to pick up.` },
    'PICKED_UP': { title: `🛵 Package Picked Up: ${order.orderNumber}`, msg: `${order.deliveryPartnerName} has picked up your produce from farm.` },
    'OUT_FOR_DELIVERY': { title: `🚚 Out for Delivery: ${order.orderNumber}`, msg: 'Delivery partner is heading towards your location! Track on live map.' },
    'DELIVERED': { title: `✅ Delivered: ${order.orderNumber}`, msg: 'Your order was delivered fresh! Please leave a review.' }
  };

  if (notifMsgs[status]) {
    createNotification({
      userId: order.buyerId,
      roleTarget: 'CUSTOMER',
      title: notifMsgs[status].title,
      message: notifMsgs[status].msg,
      type: 'DELIVERY',
      orderId: order.id
    });
  }

  // Also notify delivery partner if ready for pickup
  if (status === 'READY_FOR_PICKUP') {
    createNotification({
      userId: 'user_del_1',
      roleTarget: 'DELIVERY',
      title: `📦 Delivery Available: ${order.orderNumber}`,
      message: `Pickup ready at ${order.sellerName} (${order.items.length} items, ₹${order.totalAmount}). Tap to accept.`,
      type: 'DELIVERY',
      orderId: order.id
    });
  }

  broadcastSSE('ORDER_UPDATED', order);

  res.json({ success: true, order });
});

// Update Simulated GPS Coordinates (Triggered by Delivery Phone or Auto-simulator)
app.patch('/api/orders/:id/gps', (req, res) => {
  const { progressPercent, currentLat, currentLng, estimatedMinutes, distanceRemainingKm } = req.body;
  const order = ORDERS.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const prog = Math.min(100, Math.max(0, Number(progressPercent)));
  
  // Calculate interpolated coordinate between farmer and customer if not explicitly passed
  const fLat = order.simulatedGps.farmerLat;
  const fLng = order.simulatedGps.farmerLng;
  const cLat = order.simulatedGps.customerLat;
  const cLng = order.simulatedGps.customerLng;

  const lat = currentLat ?? (fLat + (cLat - fLat) * (prog / 100));
  const lng = currentLng ?? (fLng + (cLng - fLng) * (prog / 100));
  const dist = distanceRemainingKm ?? Number((6.8 * (1 - prog / 100)).toFixed(1));
  const mins = estimatedMinutes ?? Math.ceil(25 * (1 - prog / 100));

  order.simulatedGps = {
    ...order.simulatedGps,
    active: prog < 100,
    progressPercent: prog,
    currentLat: lat,
    currentLng: lng,
    estimatedMinutes: mins,
    distanceRemainingKm: dist,
    lastUpdated: new Date().toISOString()
  };

  if (prog >= 100 && order.orderStatus !== 'DELIVERED') {
    order.orderStatus = 'DELIVERED';
    order.milestones.forEach(m => {
      if (m.status === 'DELIVERED') {
        m.completed = true;
        m.timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    });
    createNotification({
      userId: order.buyerId,
      roleTarget: 'CUSTOMER',
      title: `✅ Delivered: ${order.orderNumber}`,
      message: 'Your order was delivered successfully! Enjoy your fresh farm produce.',
      type: 'DELIVERY',
      orderId: order.id
    });
  }

  broadcastSSE('GPS_UPDATED', { orderId: order.id, simulatedGps: order.simulatedGps, orderStatus: order.orderStatus });

  res.json({ success: true, simulatedGps: order.simulatedGps, orderStatus: order.orderStatus });
});

// ==================== REVIEWS API ====================
app.get('/api/reviews', (req, res) => {
  const { productId } = req.query;
  const list = productId ? REVIEWS.filter(r => r.productId === productId) : REVIEWS;
  res.json({ reviews: list });
});

app.post('/api/reviews', (req, res) => {
  const { productId, orderId, userId, userName, rating, comment } = req.body;
  if (!productId || !rating) return res.status(400).json({ error: 'Product and rating required' });

  const newReview: Review = {
    id: `rev_${Date.now()}`,
    productId,
    orderId: orderId || 'order_10001',
    userId: userId || 'user_cust_1',
    userName: userName || 'Customer',
    rating: Number(rating),
    comment: comment || 'Fresh and high quality!',
    createdAt: new Date().toISOString()
  };

  REVIEWS.unshift(newReview);

  // Recalculate product rating
  const prod = PRODUCTS.find(p => p.id === productId);
  if (prod) {
    const prodReviews = REVIEWS.filter(r => r.productId === productId);
    const avg = prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length;
    prod.rating = Number(avg.toFixed(1));
    prod.reviewsCount = prodReviews.length;
  }

  broadcastSSE('REVIEW_ADDED', newReview);
  res.json({ success: true, review: newReview });
});

// ==================== NOTIFICATIONS API ====================
app.get('/api/notifications', (req, res) => {
  const { userId, role } = req.query;
  let list = [...NOTIFICATIONS];
  if (userId) {
    list = list.filter(n => n.userId === 'ALL' || n.userId === userId || n.roleTarget === role);
  }
  res.json({ notifications: list });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const notif = NOTIFICATIONS.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  NOTIFICATIONS.forEach(n => n.read = true);
  res.json({ success: true });
});

// ==================== SUPPORT TICKETS API ====================
app.get('/api/support', (req, res) => {
  const { userId } = req.query;
  let list = [...SUPPORT_TICKETS];
  if (userId) list = list.filter(t => t.userId === userId);
  res.json({ tickets: list });
});

app.post('/api/support', (req, res) => {
  const { userId, userName, userEmail, subject, category, message, orderId } = req.body;
  if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });

  const newTicket: SupportTicket = {
    id: `tick_${Date.now()}`,
    userId: userId || 'user_cust_1',
    userName: userName || 'Customer',
    userEmail: userEmail || 'user@example.com',
    subject,
    category: category || 'GENERAL',
    message,
    orderId,
    status: 'OPEN',
    createdAt: new Date().toISOString()
  };

  SUPPORT_TICKETS.unshift(newTicket);
  createNotification({
    userId: 'user_admin_1',
    roleTarget: 'ADMIN',
    title: '📩 New Support Request',
    message: `${userName}: "${subject}"`,
    type: 'SYSTEM'
  });

  res.json({ success: true, ticket: newTicket });
});

app.patch('/api/support/:id', (req, res) => {
  const ticket = SUPPORT_TICKETS.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  const { status, adminReply } = req.body;
  if (status) ticket.status = status;
  if (adminReply) ticket.adminReply = adminReply;
  res.json({ success: true, ticket });
});

// ==================== WEATHER & MANDI API ====================
app.get('/api/weather', (req, res) => {
  res.json({ weather: WEATHER_INFO });
});

app.get('/api/mandi-prices', (req, res) => {
  const { search } = req.query;
  let list = [...MANDI_PRICES];
  if (search) {
    const s = String(search).toLowerCase();
    list = list.filter(m => m.commodity.toLowerCase().includes(s) || m.market.toLowerCase().includes(s));
  }
  res.json({ mandiPrices: list });
});

// ==================== AI FARMING ASSISTANT (GEMINI API) ====================
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

app.post('/api/ai-assistant', async (req, res) => {
  const { prompt, context } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  const ai = getAIClient();
  const systemInstruction = `You are "Kisan Mitra AI" — an expert Agricultural Advisor, Agronomist, and Crop Health Consultant on the AgriConnect platform.
You assist Indian farmers and agricultural enthusiasts with:
1. Crop cultivation, soil health, and organic farming techniques.
2. Pest & disease identification and natural/bio-pesticide treatments (Neem oil, Trichoderma, Beauveria).
3. Fertilizer calculations (NPK, Vermicompost dosage, Micronutrients).
4. Efficient irrigation (Drip irrigation layout, scheduling, water conservation).
5. Mandi marketing strategies and harvest post-handling.

Always format your response with clean Markdown headers, bullet points, and practical step-by-step guidance.
Include this mandatory disclaimer at the very end: "*Note: AI agricultural guidance is for reference; verify with your local Krishi Vigyan Kendra (KVK) or agronomist for critical field decisions.*"`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Gemini API call failed, falling back to expert knowledge base:', err);
    }
  }

  // Fallback intelligent agricultural advisory engine
  const pLower = prompt.toLowerCase();
  let fallbackReply = '';

  if (pLower.includes('tomato') || pLower.includes('leaf curl') || pLower.includes('blight')) {
    fallbackReply = `### 🍅 Tomato Crop Health & Yield Advisory

**1. Sowing & Soil Preparation:**
- Ideal soil pH: 6.0 to 7.0 (well-drained sandy loam rich in organic matter).
- Apply 10–12 tons of well-rotted Farm Yard Manure (FYM) or 2.5 tons of Vermicompost per acre during field preparation.

**2. Disease & Pest Protection:**
- **Leaf Curl Virus:** Transmitted by whiteflies. Spray Bio-Neem extract (10,000 PPM @ 3ml/litre water) or yellow sticky traps (15 traps/acre).
- **Early/Late Blight:** Avoid overhead sprinkler watering. Use Copper Oxychloride @ 2.5g/L or bio-fungicide *Trichoderma viride*.

**3. Water & Fertilizer Schedule:**
- Drip irrigation with 2.5–3 hours daily runtime in flowering stage.
- Foliar spray of 19:19:19 NPK during vegetative growth, transitioning to 0:52:34 & Calcium Nitrate during fruit setting.

*Note: AI agricultural guidance is for reference; verify with your local Krishi Vigyan Kendra (KVK) or agronomist for critical field decisions.*`;
  } else if (pLower.includes('yellow') || pLower.includes('leaf') || pLower.includes('fertilizer')) {
    fallbackReply = `### 🌿 Diagnosis for Yellowing Crop Leaves (Chlorosis)

**Common Causes & Remedies:**
1. **Nitrogen Deficiency:** Older bottom leaves turn uniformly pale yellow first.
   - *Remedy:* Apply top-dressing of Urea or Vermicompost tea / seaweed extract spray.
2. **Iron / Zinc Deficiency:** Interveinal chlorosis on top new leaves (veins stay green).
   - *Remedy:* Foliar spray of Chelated Zinc (1g/L) or Ferrous Sulphate (2g/L).
3. **Over-watering & Waterlogging:** Roots suffocate, causing general drooping and yellowing.
   - *Remedy:* Inspect soil drainage and reduce drip cycle duration.

*Note: AI agricultural guidance is for reference; verify with your local Krishi Vigyan Kendra (KVK) or agronomist for critical field decisions.*`;
  } else if (pLower.includes('drip') || pLower.includes('irrigation')) {
    fallbackReply = `### 💧 Smart Drip Irrigation & Water Management

**Key Benefits & Sizing:**
- **Water Saving:** Reduces water consumption by 50–70% compared to flood irrigation.
- **Fertigation:** Direct delivery of water-soluble fertilizers straight to the root zone.
- **Recommended Setup:** 16mm inline dripper pipes spaced at 40cm intervals with 2–4 LPH discharge emitters.

*Note: AI agricultural guidance is for reference; verify with your local Krishi Vigyan Kendra (KVK) or agronomist for critical field decisions.*`;
  } else {
    fallbackReply = `### 🌱 AgriConnect Agronomy Advisory

Thank you for your inquiry regarding agricultural best practices.

**Key Field Recommendations:**
1. **Soil Testing:** Conduct a Soil Health Card test every 2 years to avoid excessive synthetic fertilizer expenditure.
2. **Integrated Pest Management (IPM):** Combine biological controls (Neem oil, pheromone traps, Trichoderma) before turning to chemical pesticides.
3. **Market Timing:** Use AgriConnect Mandi tracker to check price trends across regional APMC markets before harvest.

*Note: AI agricultural guidance is for reference; verify with your local Krishi Vigyan Kendra (KVK) or agronomist for critical field decisions.*`;
  }

  return res.json({ reply: fallbackReply });
});

// ==================== VITE SPA SETUP ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 AgriConnect Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
