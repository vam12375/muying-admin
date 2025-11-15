export interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
  children?: NavigationItem[]; // 支持子菜单
}

export interface StatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  image: string;
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

export type ViewType = 
  | 'overview' 
  | 'products' 
  | 'product-list'
  | 'product-category'
  | 'brand-management'
  | 'product-analytics'
  | 'reviews' 
  | 'orders' 
  | 'after-sales' 
  | 'customers' 
  | 'coupons'
  | 'points'
  | 'messages'
  | 'logistics'
  | 'profile'
  | 'settings'
  | 'system-monitor'
  | 'system-config'
  | 'system-logs'
  | 'redis-manage';

// 评价数据类型
export interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  content: string;
  images?: string[];
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

// 售后数据类型
export interface AfterSale {
  id: string;
  orderId: string;
  customerName: string;
  type: 'refund' | 'return' | 'exchange';
  reason: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  date: string;
}

// 优惠券数据类型（仪表盘简化版）
export interface Coupon {
  id: string;
  name: string;
  code: string;
  type: 'discount' | 'fixed';
  value: number;
  minAmount: number;
  startDate: string;
  endDate: string;
  used: number;
  total: number;
  status: 'active' | 'inactive' | 'expired';
}

// 积分记录类型
export interface PointRecord {
  id: string;
  customerName: string;
  type: 'earn' | 'spend';
  points: number;
  reason: string;
  date: string;
  balance: number;
}

// 消息类型
export interface Message {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'order' | 'promotion';
  recipient: 'all' | 'specific';
  status: 'draft' | 'sent';
  date: string;
  readCount?: number;
}

// 物流公司类型
export interface LogisticsCompany {
  id: string;
  name: string;
  code: string;
  phone: string;
  website: string;
  status: 'active' | 'inactive';
  orderCount: number;
}
