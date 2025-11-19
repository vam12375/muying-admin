import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  DollarSign,
  MessageSquare,
  FileText,
  Headphones,
  Gift,
  Award,
  Bell,
  Truck,
  LayoutGrid,
  FolderTree,
  Tag,
  TrendingUp,
  Activity,
  Sliders,
  FileText as FileLog,
  Database,
  Image,
} from 'lucide-react';
import { NavigationItem, StatCard, Product, Order } from '@/types/dashboard';

export const navigationItems: NavigationItem[] = [
  { 
    id: "dashboard", 
    name: "仪表盘", 
    icon: Home, 
    href: "/dashboard" 
  },
  { 
    id: "products", 
    name: "商品管理", 
    icon: Package,
    children: [
      { id: "product-list", name: "商品列表", icon: LayoutGrid, href: "/products/list" },
      { id: "product-category", name: "商品分类", icon: FolderTree, href: "/products/category" },
      { id: "brand-management", name: "品牌管理", icon: Tag, href: "/products/brands" },
      { id: "product-images", name: "商品图片", icon: Image, href: "/products/images" },
      { id: "product-analytics", name: "商品分析", icon: TrendingUp, href: "/products/analytics" },
    ]
  },
  { 
    id: "reviews", 
    name: "评价管理", 
    icon: MessageSquare, 
    href: "/reviews"
  },
  { 
    id: "orders", 
    name: "订单管理", 
    icon: ShoppingCart, 
    href: "/orders"
  },
  { 
    id: "after-sales", 
    name: "售后管理", 
    icon: Headphones, 
    href: "/after-sales"
  },
  { 
    id: "users", 
    name: "用户管理", 
    icon: Users, 
    href: "/users" 
  },
  { 
    id: "coupons", 
    name: "优惠券管理", 
    icon: Gift, 
    href: "/coupons" 
  },
  { 
    id: "points", 
    name: "积分管理", 
    icon: Award,
    children: [
      { id: "points-products", name: "积分商品", icon: Package, href: "/points/products" },
      { id: "points-rules", name: "积分规则", icon: FileText, href: "/points/rules" },
      { id: "points-users", name: "用户积分", icon: Users, href: "/points/users" },
      { id: "points-exchanges", name: "兑换记录", icon: ShoppingCart, href: "/points/exchanges" },
    ]
  },
  { 
    id: "messages", 
    name: "消息管理", 
    icon: Bell, 
    href: "/messages" 
  },
  { 
    id: "logistics", 
    name: "物流管理", 
    icon: Truck, 
    href: "/logistics" 
  },
  { 
    id: "settings", 
    name: "系统设置", 
    icon: Settings,
    children: [
      { id: "system-monitor", name: "系统监控", icon: Activity, href: "/settings/monitor" },
      { id: "system-config", name: "系统配置", icon: Sliders, href: "/settings/config" },
      { id: "system-logs", name: "系统日志", icon: FileLog, href: "/settings/logs" },
      { id: "redis-manage", name: "Redis管理", icon: Database, href: "/settings/redis" },
    ]
  },
];

export const stats: StatCard[] = [
  { id: "revenue", label: "总收入", value: "¥45,231", change: "+20.1%", trend: "up", icon: DollarSign },
  { id: "orders", label: "订单数", value: "1,234", change: "+15.3%", trend: "up", icon: ShoppingCart },
  { id: "products", label: "商品数", value: "567", change: "+8.2%", trend: "up", icon: Package },
  { id: "customers", label: "用户数", value: "892", change: "+12.5%", trend: "up", icon: Users },
];

export const sampleProducts: Product[] = [
  { id: "1", name: "Baby Stroller Premium", category: "Strollers", price: 299.99, stock: 45, sales: 234, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop" },
  { id: "2", name: "Organic Baby Food Set", category: "Food", price: 49.99, stock: 120, sales: 567, image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=100&h=100&fit=crop" },
  { id: "3", name: "Baby Monitor HD", category: "Electronics", price: 159.99, stock: 32, sales: 189, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=100&h=100&fit=crop" },
  { id: "4", name: "Nursing Pillow", category: "Accessories", price: 39.99, stock: 78, sales: 345, image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=100&h=100&fit=crop" },
  { id: "5", name: "Baby Carrier Wrap", category: "Carriers", price: 79.99, stock: 56, sales: 278, image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=100&h=100&fit=crop" },
];

export const sampleOrders: Order[] = [
  { id: "ORD-001", customer: "Sarah Johnson", product: "Baby Stroller Premium", amount: 299.99, status: "completed", date: "2024-01-15" },
  { id: "ORD-002", customer: "Michael Chen", product: "Organic Baby Food Set", amount: 49.99, status: "processing", date: "2024-01-15" },
  { id: "ORD-003", customer: "Emily Davis", product: "Baby Monitor HD", amount: 159.99, status: "pending", date: "2024-01-14" },
  { id: "ORD-004", customer: "James Wilson", product: "Nursing Pillow", amount: 39.99, status: "completed", date: "2024-01-14" },
  { id: "ORD-005", customer: "Lisa Anderson", product: "Baby Carrier Wrap", amount: 79.99, status: "processing", date: "2024-01-13" },
];
