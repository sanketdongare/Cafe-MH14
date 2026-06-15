export interface MenuItemOption {
  name: string;
  choices: { name: string; priceModifier: number }[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string; // CSS Gradient description
  available: boolean;
  options: MenuItemOption[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  selectedOptions: Record<string, string>;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  notes?: string;
  status: 'Received' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
  createdAt: string;
}

// Helper to format prices dynamically in Rupees (whole numbers only)
export function formatPrice(price: number): string {
  return `₹${Math.round(price)}`;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1-5
  text: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  unit: string;
}

