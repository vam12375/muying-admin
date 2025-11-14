/**
 * 积分管理类型定义
 * Points Management Type Definitions
 * 
 * Source: 基于后端 UserPoints 和 PointsTransaction 实体
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

/**
 * 用户积分信息
 */
export interface UserPoints {
  pointsId: number;           // 积分记录ID
  userId: number;             // 用户ID
  username?: string;          // 用户名
  nickname?: string;          // 昵称
  email?: string;             // 邮箱
  phone?: string;             // 手机号
  currentPoints: number;      // 当前积分
  totalEarned: number;        // 累计获得积分
  totalSpent: number;         // 累计消费积分
  status: number;             // 状态：0-冻结，1-正常
  createTime: string;         // 创建时间
  updateTime: string;         // 更新时间
}

/**
 * 积分交易记录
 */
export interface PointsTransaction {
  transactionId: number;      // 交易ID
  userId: number;             // 用户ID
  username?: string;          // 用户名
  nickname?: string;          // 昵称
  transactionNo: string;      // 交易流水号
  type: number;               // 交易类型：1-获得，2-消费，3-过期，4-管理员调整
  points: number;             // 积分数量（正数为增加，负数为减少）
  beforePoints: number;       // 交易前积分
  afterPoints: number;        // 交易后积分
  status: number;             // 状态：0-失败，1-成功，2-处理中
  source?: string;            // 积分来源（签到、购物、活动等）
  description?: string;       // 交易描述
  relatedOrderId?: number;    // 关联订单ID
  createTime: string;         // 创建时间
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
