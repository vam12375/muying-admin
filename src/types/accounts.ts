/**
 * 用户账户信息
 */
export interface UserAccount {
  accountId: number;           // 账户ID
  userId: number;              // 用户ID
  username?: string;           // 用户名（关联查询）
  nickname?: string;           // 昵称（关联查询）
  email?: string;              // 邮箱（关联查询）
  phone?: string;              // 手机号（关联查询）
  avatar?: string;             // 头像URL（关联查询）
  balance: number;             // 账户余额
  totalRecharge: number;       // 累计充值
  totalConsumption: number;    // 累计消费
  status: number;              // 账户状态：0-冻结，1-正常
  createTime: string;          // 创建时间
  updateTime: string;          // 更新时间
}

/**
 * 交易记录
 * 注意：字段名与后端实体类保持一致
 */
export interface AccountTransaction {
  id: number;                  // 交易ID（后端使用id而不是transactionId）
  userId: number;              // 用户ID
  username?: string;           // 用户名（关联查询）
  nickname?: string;           // 昵称（关联查询）
  transactionNo: string;       // 交易流水号
  type: number;                // 交易类型：1-充值，2-消费，3-退款，4-管理员调整
  amount: number;              // 交易金额
  beforeBalance: number;       // 交易前余额（后端使用beforeBalance）
  afterBalance: number;        // 交易后余额（后端使用afterBalance）
  balance?: number;            // 账户余额（交易后，后端数据库字段）
  status: number;              // 交易状态：0-失败，1-成功，2-处理中
  paymentMethod?: string;      // 支付方式
  description?: string;        // 交易描述
  remark?: string;             // 备注
  createTime: string;          // 创建时间
  updateTime?: string;         // 更新时间
}

/**
 * 用户列表查询参数
 */
export interface UserListParams {
  page?: number;               // 页码
  size?: number;               // 每页大小
  keyword?: string;            // 搜索关键词（用户名/昵称/邮箱/手机）
  status?: number;             // 账户状态筛选
}

/**
 * 交易记录查询参数
 */
export interface TransactionListParams {
  page?: number;               // 页码
  size?: number;               // 每页大小
  userId?: number;             // 用户ID
  type?: number;               // 交易类型
  status?: number;             // 交易状态
  paymentMethod?: string;      // 支付方式
  transactionNo?: string;      // 交易流水号
  startTime?: string;          // 开始时间
  endTime?: string;            // 结束时间
  keyword?: string;            // 搜索关键词
}

/**
 * 充值请求参数
 */
export interface RechargeRequest {
  userId: number;              // 用户ID
  amount: number;              // 充值金额
  paymentMethod: string;       // 支付方式
  description?: string;        // 描述
  remark?: string;             // 备注
}

/**
 * 余额调整请求参数
 */
export interface BalanceAdjustRequest {
  userId: number;              // 用户ID
  amount: number;              // 调整金额（正数增加，负数减少）
  reason: string;              // 调整原因
}

/**
 * 账户状态变更请求参数
 */
export interface AccountStatusRequest {
  userId: number;              // 用户ID
  status: number;              // 状态：0-冻结，1-正常
  reason?: string;             // 操作原因
}