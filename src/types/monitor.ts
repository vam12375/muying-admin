/**
 * 系统监控类型定义
 * System Monitor Type Definitions
 * 
 * Source: 基于后端 SystemMetricsDTO
 */

/**
 * 系统监控完整指标
 */
export interface SystemMetrics {
  health: SystemHealth;
  serverPerformance: ServerPerformance;
  databaseMetrics: DatabaseMetrics;
  redisMetrics: RedisMetrics;
  apiStatistics: ApiStatistics;
  errorLogStatistics: ErrorLogStatistics;
}

/**
 * 系统健康状态
 */
export interface SystemHealth {
  status: 'UP' | 'DOWN' | 'WARNING';
  timestamp: number;
  components: Record<string, ComponentHealth>;
}

/**
 * 组件健康状态
 */
export interface ComponentHealth {
  status: 'UP' | 'DOWN' | 'WARNING' | 'UNKNOWN';
  message: string;
  details?: Record<string, any>;
}

/**
 * 服务器性能指标
 */
export interface ServerPerformance {
  // CPU相关
  cpuUsage: number;
  cpuCores: number;
  systemLoadAverage: number;
  
  // 内存相关
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
  memoryUsage: number;
  
  // JVM相关
  jvmTotalMemory: number;
  jvmUsedMemory: number;
  jvmFreeMemory: number;
  jvmMemoryUsage: number;
  threadCount: number;
  peakThreadCount: number;
  
  // 磁盘相关
  totalDiskSpace: number;
  usedDiskSpace: number;
  freeDiskSpace: number;
  diskUsage: number;
  
  // 运行时间
  uptime: number;
  uptimeFormatted: string;
}

/**
 * 数据库监控指标
 */
export interface DatabaseMetrics {
  status: string;
  activeConnections: number;
  idleConnections: number;
  maxConnections: number;
  connectionUsage: number;
  
  // 查询性能
  totalQueries: number;
  slowQueries: number;
  avgQueryTime: number;
  
  // 数据库大小
  databaseSize: number;
  tableSizes: Record<string, number>;
  
  // 最近慢查询
  recentSlowQueries: SlowQuery[];
}

/**
 * 慢查询信息
 */
export interface SlowQuery {
  sql: string;
  executionTime: number;
  timestamp: string;
}

/**
 * Redis监控指标
 */
export interface RedisMetrics {
  status: string;
  version: string;
  connectedClients: number;
  usedMemory: number;
  usedMemoryHuman: string;
  memFragmentationRatio: number;
  
  // 性能指标
  totalCommandsProcessed: number;
  opsPerSec: number;
  keyspaceHits: number;
  keyspaceMisses: number;
  hitRate: number;
  
  // 键空间信息
  totalKeys: number;
  expiredKeys: number;
  evictedKeys: number;
  
  // 持久化
  rdbLastSaveTime: string;
  aofEnabled: string;
}

/**
 * API调用统计
 */
export interface ApiStatistics {
  totalRequests: number;
  successRequests: number;
  failedRequests: number;
  successRate: number;
  avgResponseTime: number;
  
  // 请求分布
  requestsByEndpoint: Record<string, number>;
  requestsByMethod: Record<string, number>;
  requestsByStatus: Record<number, number>;
  
  // 最慢的API
  slowestApis: SlowApi[];
  
  // 最频繁的API
  mostFrequentApis: FrequentApi[];
  
  // 时间序列数据
  requestTimeSeries: TimeSeriesData[];
}

/**
 * 慢API信息
 */
export interface SlowApi {
  endpoint: string;
  method: string;
  avgResponseTime: number;
  maxResponseTime: number;
  requestCount: number;
}

/**
 * 频繁API信息
 */
export interface FrequentApi {
  endpoint: string;
  method: string;
  requestCount: number;
  avgResponseTime: number;
}

/**
 * 时间序列数据
 */
export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

/**
 * 错误日志统计
 */
export interface ErrorLogStatistics {
  totalErrors: number;
  last24hErrors: number;
  lastHourErrors: number;
  
  // 错误类型分布
  errorsByType: Record<string, number>;
  
  // 错误级别分布
  errorsByLevel: Record<string, number>;
  
  // 最近错误
  recentErrors: RecentError[];
  
  // 错误趋势
  errorTrend: TimeSeriesData[];
}

/**
 * 最近错误信息
 */
export interface RecentError {
  timestamp: string;
  level: string;
  message: string;
  exception: string;
  endpoint: string;
}
