/**
 * 全局类型定义
 * Global Type Definitions
 */

// ==================== 用户相关类型 | User Types ====================

/**
 * 用户信息
 * User information
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  createdAt?: string;
}

/**
 * 登录请求
 * Login request
 */
export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * 登录响应
 * Login response
 */
export interface LoginResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

// ==================== API 响应类型 | API Response Types ====================

/**
 * 标准 API 响应
 * Standard API response
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

/**
 * 分页响应
 * Paginated response
 */
export interface PaginatedResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}

/**
 * 分页请求参数
 * Pagination request params
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== 商品相关类型 | Product Types ====================

/**
 * 商品信息
 * Product information
 */
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  categoryId?: string;
  brand?: string;
  brandId?: string;
  images: string[];
  thumbnail?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  sales?: number;
  rating?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 商品分类
 * Product category
 */
export interface Category {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  icon?: string;
  sort?: number;
}

/**
 * 品牌信息
 * Brand information
 */
export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

// ==================== 订单相关类型 | Order Types ====================

/**
 * 订单状态
 * Order status
 */
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

/**
 * 订单信息
 * Order information
 */
export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  customer: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount?: number;
  shippingFee?: number;
  actualAmount: number;
  status: OrderStatus;
  paymentMethod?: string;
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  shippingMethod?: string;
  trackingNo?: string;
  remark?: string;
  createdAt: string;
  updatedAt?: string;
  paidAt?: string;
  shippedAt?: string;
  completedAt?: string;
}

/**
 * 订单项
 * Order item
 */
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  subtotal: number;
  sku?: string;
  specs?: Record<string, string>;
}

// ==================== 统计相关类型 | Statistics Types ====================

/**
 * 统计卡片数据
 * Statistics card data
 */
export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

/**
 * 图表数据点
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

/**
 * 仪表盘统计数据
 * Dashboard statistics
 */
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange?: number;
  ordersChange?: number;
  productsChange?: number;
  customersChange?: number;
}

// ==================== 通用类型 | Common Types ====================

/**
 * 选项类型
 * Option type
 */
export interface Option<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
}

/**
 * 表格列配置
 * Table column configuration
 */
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

/**
 * 表单字段配置
 * Form field configuration
 */
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  rules?: any[];
  options?: Option[];
  defaultValue?: any;
}

// ==================== 导航相关类型 | Navigation Types ====================

/**
 * 导航项
 * Navigation item
 */
export interface NavigationItem {
  id: string;
  name: string;
  icon?: any;
  href?: string;
  badge?: number;
  children?: NavigationItem[];
}

/**
 * 面包屑项
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ==================== 工具类型 | Utility Types ====================

/**
 * 深度部分类型
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 必需字段
 * Required fields
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * 可选字段
 * Optional fields
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ==================== 模块类型导出 | Module Type Exports ====================

export * from './common';
export * from './product';
export * from './category';
export * from './brand';
export * from './dashboard';
export * from './coupon';
