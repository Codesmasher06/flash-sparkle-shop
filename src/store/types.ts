export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  category: string;
  subCategory: string;
  description: string;
  stock: number;
  isFlashSale: boolean;
  flashSaleTime?: string;
  flashSaleStock?: number;
  flashDiscountLimit?: number;
  flashDiscountExtra?: number;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  flashDiscount?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: DeliveryStatus;
  paymentMethod: string;
  paymentStatus: 'completed' | 'pending' | 'refunded';
  createdAt: string;
  estimatedDelivery: string;
  refundRequested?: boolean;
  refundStatus?: 'pending' | 'approved' | 'rejected';
}

export type DeliveryStatus = 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface Notification {
  id: string;
  message: string;
  type: 'payment' | 'shipping' | 'refund' | 'restock';
  read: boolean;
  createdAt: string;
}
