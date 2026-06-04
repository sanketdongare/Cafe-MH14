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
