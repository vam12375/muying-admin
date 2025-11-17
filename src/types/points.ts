/**
 * 积分管理类型定义
 * Points Management Type Definitions
 * 
 * Source: 基于后端实体类
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

// ==================== 用户积分 ====================

/**
 * 用户积分信息
 * Source: 后端 UserPoints 实体 + User 实体
 */
export interface UserPoints {
  id: number;                 // 积分记录ID
  userId: number;             // 用户ID
  points: number;             // 积分总数（当前积分）
  level?: string;             // 会员等级
  createTime: string;         // 创建时间
  updateTime: string;         // 更新时间
  
  // 用户信息（来自关联的User对象）
  user?: {
    userId: number;
    username: string;
    nickname?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    status: number;           // 用户状态：0-禁用，1-正常
  };
  
  // 统计字段（非数据库字段）
  totalEarned?: number;       // 累计获得积分
  totalUsed?: number;         // 累计使用积分
  availablePoints?: number;   // 可用积分
  expiredPoints?: number;     // 已过期积分
  expiringSoonPoints?: number;// 即将过期积分
  
  // 兼容字段（用于前端展示）
  username?: string;          // 用户名（从user.username映射）
  nickname?: string;          // 昵称（从user.nickname映射）
  email?: string;             // 邮箱（从user.email映射）
  phone?: string;             // 手机号（从user.phone映射）
  status?: number;            // 状态（从user.status映射）
  currentPoints?: number;     // 当前积分（从points映射）
  totalSpent?: number;        // 累计消费（从totalUsed映射）
  pointsId?: number;          // 积分ID（从id映射）
}

/**
 * 积分交易记录（积分历史）
 * Source: 后端 PointsHistory 实体
 */
export interface PointsTransaction {
  id: number;                 // 历史ID
  userId: number;             // 用户ID
  username?: string;          // 用户名（扩展字段）
  nickname?: string;          // 昵称（扩展字段）
  points: number;             // 积分变动数量（正为增加，负为减少）
  type: string;               // 类型：earn(获得), spend(消费)
  source?: string;            // 来源：order(订单), signin(签到), review(评论), register(注册), exchange(兑换)等
  referenceId?: string;       // 关联ID（如订单ID等）
  description?: string;       // 描述
  createTime: string;         // 操作时间
  
  // 兼容字段（用于前端展示）
  transactionId?: number;     // 交易ID（从id映射）
  transactionNo?: string;     // 交易流水号（从id生成）
  beforePoints?: number;      // 交易前积分（计算得出）
  afterPoints?: number;       // 交易后积分（计算得出）
  status?: number;            // 状态（默认为1-成功）
  relatedOrderId?: number;    // 关联订单ID（从referenceId解析）
}

/**
 * 积分列表查询参数
 */
export interface PointsListParams {
  page?: number;              // 页码
  size?: number;              // 每页大小
  keyword?: string;           // 搜索关键词（用户名/昵称/邮箱/手机）
  status?: number;            // 状态筛选
}

/**
 * 积分交易记录查询参数
 */
export interface PointsTransactionListParams {
  page?: number;              // 页码
  size?: number;              // 每页大小
  userId?: number;            // 用户ID
  type?: number;              // 交易类型
  status?: number;            // 交易状态
  source?: string;            // 积分来源
  transactionNo?: string;     // 交易流水号
  startTime?: string;         // 开始时间
  endTime?: string;           // 结束时间
  keyword?: string;           // 搜索关键词
}

/**
 * 积分调整请求参数
 */
export interface AdjustPointsRequest {
  userId: number;             // 用户ID
  points: number;             // 调整积分数（正数为增加，负数为减少）
  reason: string;             // 调整原因
  source?: string;            // 积分来源
}

/**
 * 积分统计信息
 */
export interface PointsStatistics {
  totalUsers: number;         // 总用户数
  totalPoints: number;        // 总积分数
  totalEarned: number;        // 累计发放积分
  totalSpent: number;         // 累计消费积分
  activeUsers: number;        // 活跃用户数（有积分的用户）
}

// ==================== 积分规则 ====================

/**
 * 积分规则
 * Source: 后端 PointsRule 实体
 */
export interface PointsRule {
  id: number;                 // 规则ID
  name: string;               // 规则名称
  description?: string;       // 规则描述
  type: string;               // 规则类型：signin(签到), order(订单), review(评论), register(注册), event(活动)
  points: number;             // 奖励积分数
  maxDaily?: number;          // 每日最大获取次数
  maxTotal?: number;          // 总最大获取次数
  status: number;             // 状态：0-禁用，1-启用
  startTime?: string;         // 开始时间
  endTime?: string;           // 结束时间
  createTime: string;         // 创建时间
  updateTime: string;         // 更新时间
}

/**
 * 积分规则查询参数
 */
export interface PointsRuleListParams {
  page?: number;              // 页码
  size?: number;              // 每页大小
  name?: string;              // 规则名称
  type?: string;              // 规则类型
  status?: number;            // 状态
}

// ==================== 积分商品 ====================

/**
 * 积分商品
 * Source: 后端 PointsProduct 实体
 */
export interface PointsProduct {
  id: number;                 // 商品ID
  name: string;               // 商品名称
  description?: string;       // 商品描述
  image?: string;             // 商品图片
  points: number;             // 所需积分
  stock: number;              // 库存数量
  category: string;           // 商品分类：virtual(虚拟商品), physical(实物商品), coupon(优惠券), vip(会员特权)
  needAddress: number;        // 是否需要收货地址：0-否，1-是
  needPhone: number;          // 是否需要手机号：0-否，1-是
  isHot: number;              // 是否热门：0-否，1-是
  status: number;             // 状态：0-下架，1-上架
  sortOrder: number;          // 排序号
  createTime: string;         // 创建时间
  updateTime: string;         // 更新时间
}

/**
 * 积分商品查询参数
 */
export interface PointsProductListParams {
  page?: number;              // 页码
  size?: number;              // 每页大小
  name?: string;              // 商品名称
  category?: string;          // 商品分类
  status?: number;            // 状态
}

// ==================== 积分兑换 ====================

/**
 * 积分兑换记录
 * Source: 后端 PointsExchange 实体
 */
export interface PointsExchange {
  id: number;                 // 兑换ID
  orderNo: string;            // 兑换单号
  userId: number;             // 用户ID
  username?: string;          // 用户名
  productId: number;          // 商品ID
  productName?: string;       // 商品名称
  productImage?: string;      // 商品图片
  quantity: number;           // 兑换数量
  points: number;             // 消耗积分
  addressId?: number;         // 收货地址ID
  contact?: string;           // 联系人
  phone?: string;             // 手机号码
  address?: string;           // 收货地址
  status: string;             // 状态：pending(待处理), processing(处理中), shipped(已发货), completed(已完成), cancelled(已取消)
  trackingNumber?: string;    // 物流单号
  logisticsCompany?: string;  // 物流公司
  shipTime?: string;          // 发货时间
  remark?: string;            // 备注
  createTime: string;         // 创建时间
  updateTime: string;         // 更新时间
}

/**
 * 积分兑换查询参数
 */
export interface PointsExchangeListParams {
  page?: number;              // 页码
  size?: number;              // 每页大小
  userId?: number;            // 用户ID
  productId?: number;         // 商品ID
  status?: string;            // 状态
  orderNo?: string;           // 兑换单号
  startDate?: string;         // 开始日期
  endDate?: string;           // 结束日期
}

/**
 * 积分兑换发货请求
 */
export interface ShipExchangeRequest {
  logisticsCompany: string;   // 物流公司
  trackingNumber: string;     // 物流单号
  shipRemark?: string;        // 发货备注
}

// ==================== 积分操作日志 ====================

/**
 * 积分操作日志
 * Source: 后端 PointsOperationLog 实体
 */
export interface PointsOperationLog {
  id: number;                 // 日志ID
  userId: number;             // 用户ID
  username?: string;          // 用户名
  operationType: string;      // 操作类型：SIGN_IN(签到), ORDER_REWARD(订单奖励), EXCHANGE_PRODUCT(兑换商品), ADMIN_ADJUSTMENT(管理员调整), EVENT_REWARD(活动奖励), OTHER(其他)
  pointsChange: number;       // 积分变动数量（正数为增加，负数为减少）
  currentBalance: number;     // 操作后当前积分余额
  description?: string;       // 描述
  relatedOrderId?: number;    // 关联订单ID
  createTime: string;         // 创建时间
}

/**
 * 积分操作日志查询参数
 */
export interface PointsOperationLogListParams {
  page?: number;              // 页码
  size?: number;              // 每页大小
  userId?: number;            // 用户ID
  operationType?: string;     // 操作类型
  startDate?: string;         // 开始日期
  endDate?: string;           // 结束日期
}
