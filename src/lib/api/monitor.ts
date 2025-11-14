/**
 * 系统监控API
 * System Monitor API
 */

import { fetchApi } from './index';
import type {
  SystemMetrics,
  SystemHealth,
  ServerPerformance,
  DatabaseMetrics,
  RedisMetrics,
  ApiStatistics,
} from '@/types/monitor';

/**
 * 获取完整的系统监控指标
 */
export async function getSystemMetrics(): Promise<SystemMetrics> {
  const response = await fetchApi<SystemMetrics>('/admin/system/monitor/metrics');
  return response.data!;
}

/**
 * 获取系统健康状态
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  const response = await fetchApi<SystemHealth>('/admin/system/monitor/health');
  return response.data!;
}

/**
 * 获取服务器性能指标
 */
export async function getServerPerformance(): Promise<ServerPerformance> {
  const response = await fetchApi<ServerPerformance>('/admin/system/monitor/server');
  return response.data!;
}

/**
 * 获取数据库监控指标
 */
export async function getDatabaseMetrics(): Promise<DatabaseMetrics> {
  const response = await fetchApi<DatabaseMetrics>('/admin/system/monitor/database');
  return response.data!;
}

/**
 * 获取Redis监控指标
 */
export async function getRedisMetrics(): Promise<RedisMetrics> {
  const response = await fetchApi<RedisMetrics>('/admin/system/monitor/redis');
  return response.data!;
}

/**
 * 获取API调用统计
 */
export async function getApiStatistics(): Promise<ApiStatistics> {
  const response = await fetchApi<ApiStatistics>('/admin/system/monitor/api-statistics');
  return response.data!;
}

/**
 * 重置API统计数据
 */
export async function resetApiStatistics(): Promise<string> {
  const response = await fetchApi<string>('/admin/system/monitor/api-statistics/reset', {
    method: 'POST',
  });
  return response.data!;
}

/**
 * 获取数据库版本信息
 */
export async function getDatabaseVersion(): Promise<string> {
  const response = await fetchApi<string>('/admin/system/monitor/database/version');
  return response.data!;
}

/**
 * 检查Redis连接状态
 */
export async function pingRedis(): Promise<boolean> {
  const response = await fetchApi<boolean>('/admin/system/monitor/redis/ping');
  return response.data!;
}
