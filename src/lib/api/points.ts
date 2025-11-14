/**
 * 积分管理 API
 * Points Management API
 * 
 * Source: 对接后端 /admin/points 接口
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { fetchApi } from './index';
import type {
  UserPoints,
  PointsTransaction,
  PointsListParams,
  PointsTransactionListParams,
  AdjustPointsRequest,
  PointsStatistics
} from '@/types/points';
import type { PageResult } from '@/types/common';

export const pointsApi = {
  /**
   * 分页获取用户积分列表
   */
  getUserPointsPage: async (params: PointsListParams) => {
    const response = await fetchApi<PageResult<UserPoints>>('/admin/points/user/list', { params });
    return response.data;
  },

  /**
   * 获取用户积分详情
   */
  getUserPoints: async (userId: number) => {
    const response = await fetchApi<UserPoints>(`/admin/points/user/${userId}`);
    return response.data;
  },

  /**
   * 管理员调整用户积分
   */
  adjustUserPoints: async (data: AdjustPointsRequest) => {
    const response = await fetchApi<void>(`/admin/points/user/${data.userId}/adjust`, {
      method: 'POST',
      params: {
        points: data.points,
        description: data.reason
      }
    });
    return response.data;
  },

  /**
   * 更改用户积分状态（冻结/解冻）
   */
  togglePointsStatus: async (userId: number, status: number, reason?: string) => {
    const response = await fetchApi<void>(`/admin/points/user/${userId}/status`, {
      method: 'PUT',
      params: {
        status,
        reason
      }
    });
    return response.data;
  },

  /**
   * 分页获取积分交易记录列表（积分历史）
   */
  getPointsTransactionPage: async (params: PointsTransactionListParams) => {
    const response = await fetchApi<PageResult<PointsTransaction>>('/admin/points/history/list', { params });
    return response.data;
  },

  /**
   * 获取积分交易记录详情
   */
  getPointsTransaction: async (id: number) => {
    const response = await fetchApi<PointsTransaction>(`/admin/points/history/${id}`);
    return response.data;
  },

  /**
   * 获取积分统计信息
   */
  getPointsStatistics: async () => {
    const response = await fetchApi<PointsStatistics>('/admin/points/stats');
    return response.data;
  }
};

// 兼容旧的导出方式
export const {
  getUserPointsPage,
  getUserPoints,
  adjustUserPoints,
  togglePointsStatus,
  getPointsTransactionPage,
  getPointsTransaction,
  getPointsStatistics
} = pointsApi;
