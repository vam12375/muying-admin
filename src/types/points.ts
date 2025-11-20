/**
 * 积分管理相关类型定义
 * Points Management Type Definitions
 * 
 * Source: 基于后端 Entity 定义
 * 
 */

// ==================== 积分商品 ====================

export interface PointsProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  points: number;
  stock: number;
  category: string; // virtual, physical, coupon, vip
  needAddress: number; // 0:否, 1:是
  needPhone: number; // 0:否, 1:是
  isHot: number; // 0:否, 1:是
  status: number; // 0:下架, 1:上架
  sortOrder: number;
  createTime: string;
  updateTime: string;
}

export interface PointsProductFormData {
  name: string;
  description?: string;
  image?: string;
  points: number;
  stock: number;
  category: string;
  needAddress?: number;
  needPhone?: number;
  isHot?: number;
  status?: number;
  sortOrder?: number;
}

// ==================== 积分规则 ====================

export interface PointsRule {
  id: number;
  title: string;
  description: string;
  type: string;
  value: number; // 积分值
  sort: number;
  enabled: number; // 0:禁用, 1:启用
  createTime: string;
  updateTime: string;
}

export interface PointsRuleFormData {
  title: string;
  description?: string;
  type: string;
  value: number;
  sort?: number;
  enabled?: number;
}

// ==================== 用户积分 ====================

export interface UserPoints {
  id: number;
  pointsId?: number;
  userId: number;
  points: number;
  currentPoints?: number;
  level: string;
  createTime: string;
  updateTime: string;
  // 扩展字段
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  levelName?: string;
  totalEarned?: number;
  totalUsed?: number;
  totalSpent?: number;
  availablePoints?: number;
  expiredPoints?: number;
  expiringSoonPoints?: number;
  status?: number;
  // 用户对象（嵌套）
  user?: {
    username?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    status?: number;
  };
}

export interface AdjustPointsData {
  points: number; // 正数为增加，负数为减少
  description: string;
}

// ==================== 兑换记录 ====================

export interface PointsExchange {
  id: number;
  orderNo: string;
  userId: number;
  productId: number;
  quantity: number;
  points: number;
  addressId: number;
  phone: string;
  status: number | string; // 0:待发货, 1:已发货, 2:已完成, 3:已取消 (或字符串pending/shipped/completed/cancelled)
  trackingNumber: string;
  logisticsCompany: string;
  shipTime: string;
  contact: string;
  address: string;
  remark: string;
  createTime: string;
  updateTime: string;
  // 扩展字段
  username?: string;
  productName?: string;
  productImage?: string;
}

export interface ShipExchangeData {
  logisticsCompany: string;
  trackingNumber: string;
  shipRemark?: string;
}

// ==================== 积分历史 ====================

export interface PointsHistory {
  id: number;
  userId: number;
  points: number;
  type: string; // earn, spend, expire, adjust
  source: string;
  description: string;
  createTime: string;
}

// ==================== 积分交易记录 ====================

export interface PointsTransaction {
  id: number;
  transactionId?: number;
  userId: number;
  points: number;
  type: string | number; // 1:获得, 2:消费, 3:过期, 4:管理员调整
  source?: string; // signin, order, exchange, admin, etc.
  description?: string;
  referenceId?: string | number;
  status?: number; // 0:失败, 1:成功, 2:处理中
  createTime: string;
  updateTime?: string;
}

// ==================== 积分操作日志 ====================

export interface PointsOperationLog {
  id: number;
  userId: number;
  operationType: string;
  points: number;
  description: string;
  operatorId: number;
  operatorName: string;
  createTime: string;
}

// ==================== 统计数据 ====================

export interface ExchangeStats {
  totalCount: number;
  totalPoints: number;
  pendingCount: number;
  processingCount: number;
  shippedCount: number;
  completedCount: number;
  cancelledCount: number;
  todayCount: number;
  todayPoints: number;
}

export interface PointsStats {
  totalUsers: number;
  totalPoints: number;
  totalEarned: number;
  totalSpent: number;
  activeUsers: number;
}

// ==================== API 响应类型 ====================

export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}
