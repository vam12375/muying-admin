/**
 * 系统日志API
 * Source: 自定义实现，匹配现有后端接口
 */

import { fetchApi } from './index';
import type {
  SystemLog,
  SystemLogQuery,
  SystemLogPageResponse,
} from '@/types/systemLog';

const BASE_URL = '/admin/system/logs';

/**
 * 分页查询系统日志
 * 匹配后端 AdminController.getSystemLogs 接口
 */
export async function getSystemLogs(
  params: SystemLogQuery
): Promise<SystemLogPageResponse> {
  // 转换参数格式以匹配后端
  const queryParams: Record<string, any> = {
    page: params.page || 1,
    size: params.pageSize || 10,
  };

  if (params.startTime) {
    // 转换为 YYYY-MM-DD 格式
    queryParams.startTime = params.startTime.split('T')[0];
  }
  if (params.endTime) {
    queryParams.endTime = params.endTime.split('T')[0];
  }
  if (params.operationType) {
    queryParams.operationType = params.operationType;
  }
  if (params.module) {
    queryParams.module = params.module;
  }
  if (params.operationResult) {
    queryParams.operationResult = params.operationResult;
  }

  const response = await fetchApi<{
    records: SystemLog[];
    total: number;
    current: number;
    size: number;
  }>(BASE_URL, {
    method: 'GET',
    params: queryParams,
  });

  // fetchApi 返回 ApiResponse 格式，数据在 data 字段中
  const data = response.data || { records: [], total: 0, current: 1, size: 10 };

  // 转换响应格式
  return {
    list: data.records || [],
    total: data.total || 0,
    page: data.current || 1,
    pageSize: data.size || 10,
    totalPages: Math.ceil((data.total || 0) / (data.size || 10)),
  };
}

/**
 * 获取系统日志详情
 * 匹配后端 AdminController.getSystemLogDetail 接口
 */
export async function getSystemLogDetail(id: number): Promise<SystemLog> {
  const response = await fetchApi<SystemLog>(`${BASE_URL}/${id}`, {
    method: 'GET',
  });
  return response.data as SystemLog;
}

/**
 * 获取系统日志统计信息
 */
export async function getSystemLogStatistics(
  adminId?: number,
  days: number = 7
) {
  const response = await fetchApi<any>(`${BASE_URL}/statistics`, {
    method: 'GET',
    params: { adminId, days },
  });
  return response.data || {};
}

/**
 * 批量删除系统日志
 */
export async function batchDeleteSystemLogs(ids: number[]): Promise<void> {
  return fetchApi<void>(`${BASE_URL}/batch`, {
    method: 'DELETE',
    body: JSON.stringify(ids),
  });
}

/**
 * 清空指定天数之前的日志
 */
export async function clearOldLogs(days: number): Promise<void> {
  return fetchApi<void>(`${BASE_URL}/clear`, {
    method: 'DELETE',
    params: { days },
  });
}

/**
 * 获取操作类型列表（模拟数据，后端暂无此接口）
 */
export async function getOperationTypes() {
  return [
    { code: 'CREATE', description: '新增' },
    { code: 'READ', description: '查看' },
    { code: 'UPDATE', description: '更新' },
    { code: 'DELETE', description: '删除' },
    { code: 'EXPORT', description: '导出' },
    { code: 'IMPORT', description: '导入' },
    { code: 'LOGIN', description: '登录' },
    { code: 'LOGOUT', description: '登出' },
  ];
}

/**
 * 获取模块列表（从已有日志中提取，后端暂无此接口）
 */
export async function getModules(): Promise<string[]> {
  // 返回常用模块列表
  return [
    '管理员管理',
    '系统管理',
    '商品管理',
    '订单管理',
    '用户管理',
    '评价管理',
    '优惠券管理',
    '积分管理',
    '物流管理',
    '消息管理',
  ];
}
