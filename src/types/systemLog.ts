/**
 * 系统日志类型定义
 * Source: 自定义实现
 */

/**
 * 系统日志
 */
export interface SystemLog {
  id: number;
  adminId: number;
  adminName: string;
  operation: string;
  module: string;
  operationType: string;
  targetType?: string;
  targetId?: string;
  requestMethod: string;
  requestUrl: string;
  requestParams?: string;
  responseStatus: number;
  ipAddress: string;
  userAgent?: string;
  operationResult: string;
  errorMessage?: string;
  executionTimeMs?: number;
  description?: string;
  createTime: string;
}

/**
 * 系统日志查询参数
 */
export interface SystemLogQuery {
  page?: number;
  pageSize?: number;
  adminId?: number;
  adminName?: string;
  operationType?: string;
  module?: string;
  operationResult?: string;
  startTime?: string;
  endTime?: string;
  ipAddress?: string;
  requestMethod?: string;
  keyword?: string;
}

/**
 * 系统日志统计
 */
export interface SystemLogStatistics {
  totalLogs: number;
  successCount: number;
  failedCount: number;
  successRate: number;
  avgExecutionTime: number;
  maxExecutionTime: number;
  minExecutionTime: number;
  todayLogs: number;
  operationTypeDistribution: Record<string, number>;
  moduleStats: Array<{
    module: string;
    count: number;
  }>;
  dailyTrend: Array<{
    date: string;
    count: number;
  }>;
}

/**
 * 操作类型
 */
export interface OperationType {
  code: string;
  description: string;
}

/**
 * 系统日志分页响应
 */
export interface SystemLogPageResponse {
  list: SystemLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
