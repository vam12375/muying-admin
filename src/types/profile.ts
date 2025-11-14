/**
 * 个人中心类型定义
 * Profile Type Definitions
 * 
 * Source: 基于后端 AdminController 和 User 实体
 */

/**
 * 管理员信息
 */
export interface AdminInfo {
  id: number;                    // 管理员ID
  username: string;              // 用户名
  nickname?: string;             // 昵称
  avatar?: string;               // 头像URL
  email?: string;                // 邮箱
  phone?: string;                // 手机号
  role: string;                  // 角色
  status: number;                // 状态：0-禁用，1-正常
  createTime: string;            // 创建时间
  lastLogin?: string;            // 最后登录时间
  loginCount?: number;           // 登录次数
}

/**
 * 登录记录
 */
export interface LoginRecord {
  id: number;                    // 记录ID
  adminId: number;               // 管理员ID
  adminName: string;             // 管理员名称
  loginTime: string;             // 登录时间
  loginStatus: string;           // 登录状态：SUCCESS-成功，FAILED-失败
  ipAddress: string;             // IP地址
  location?: string;             // 登录地点
  browser?: string;              // 浏览器
  os?: string;                   // 操作系统
  device?: string;               // 设备类型
}

/**
 * 操作记录
 * Source: 基于后端 AdminOperationLog 实体
 */
export interface OperationRecord {
  id: number;                    // 记录ID
  adminId: number;               // 管理员ID
  adminName: string;             // 管理员名称
  operation: string;             // 操作名称
  module: string;                // 模块名称
  operationType: string;         // 操作类型：CREATE/READ/UPDATE/DELETE/EXPORT
  operationResult: string;       // 操作结果：success/failed (小写)
  createTime: string;            // 创建时间 (后端字段名)
  ipAddress: string;             // IP地址
  requestUrl?: string;           // 请求URL
  requestMethod?: string;        // 请求方法
  requestParams?: string;        // 请求参数
  responseStatus?: number;       // 响应状态码
  errorMessage?: string;         // 错误信息
  executionTimeMs?: number;      // 执行时间（毫秒，后端字段名）
  userAgent?: string;            // 用户代理信息
  description?: string;          // 操作描述
}

/**
 * 统计信息
 */
export interface AdminStatistics {
  // 登录统计
  totalLogins?: number;          // 总登录次数
  todayLogins?: number;          // 今日登录次数
  weekLogins?: number;           // 本周登录次数
  monthLogins?: number;          // 本月登录次数
  successLogins?: number;        // 成功登录次数
  failedLogins?: number;         // 失败登录次数
  
  // 操作统计
  totalOperations?: number;      // 总操作次数
  todayOperations?: number;      // 今日操作次数
  weekOperations?: number;       // 本周操作次数
  monthOperations?: number;      // 本月操作次数
  successOperations?: number;    // 成功操作次数
  failedOperations?: number;     // 失败操作次数
  
  // 活跃度统计
  activeHours?: number[];        // 24小时活跃度数据
  operationTypes?: Record<string, number>; // 操作类型分布
  
  // 其他统计
  accountAge?: number;           // 账号年龄（天）
  securityScore?: number;        // 安全评分
  onlineAdmins?: number;         // 在线管理员数量
}

/**
 * 查询参数
 */
export interface ProfileQueryParams {
  page?: number;                 // 页码
  size?: number;                 // 每页大小
  startTime?: string;            // 开始时间
  endTime?: string;              // 结束时间
  loginStatus?: string;          // 登录状态
  ipAddress?: string;            // IP地址
  operationType?: string;        // 操作类型
  module?: string;               // 模块名称
  operationResult?: string;      // 操作结果
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  records: T[];                  // 记录列表
  total: number;                 // 总记录数
  current: number;               // 当前页码
  size: number;                  // 每页大小
}

/**
 * 密码修改参数
 */
export interface PasswordChangeParams {
  oldPassword: string;           // 旧密码
  newPassword: string;           // 新密码
}

/**
 * 管理员信息更新参数
 */
export interface AdminInfoUpdateParams {
  nickname?: string;             // 昵称
  avatar?: string;               // 头像URL
  email?: string;                // 邮箱
  phone?: string;                // 手机号
}

/**
 * 系统日志
 */
export interface SystemLog {
  id: number;                    // 日志ID
  level: string;                 // 日志级别：INFO/WARN/ERROR/DEBUG
  module: string;                // 模块名称
  message: string;               // 日志消息
  details?: string;              // 详细信息
  createTime: string;            // 创建时间
  userId?: number;               // 用户ID
  username?: string;             // 用户名
  ipAddress?: string;            // IP地址
  requestUrl?: string;           // 请求URL
  stackTrace?: string;           // 堆栈跟踪
}

/**
 * 通知发送参数
 */
export interface NotificationParams {
  title: string;                 // 通知标题
  content: string;               // 通知内容
  type?: string;                 // 通知类型：INFO/WARNING/ERROR/SUCCESS
  targetUsers?: number[];        // 目标用户ID列表
  sendAll?: boolean;             // 是否发送给所有用户
}

/**
 * WebSocket状态
 */
export interface WebSocketStatus {
  connected: boolean;            // 是否连接
  onlineUsers: number;           // 在线用户数
  totalConnections: number;      // 总连接数
  serverTime: string;            // 服务器时间
}
