/**
 * 用户积分管理 API
 * User Points Management API
 * 
 * Source: 基于后端 AdminPointsController
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { fetchApi } from '../index';
import type { UserPoints, PageResult, PointsTransaction } from '@/types/points';

/**
 * 分页查询用户积分列表
 * GET /admin/points/user/list
 */
export async function getUserPointsList(params: {
  page?: number;
  size?: number;
  userId?: number;
  username?: string;
}) {
  const response = await fetchApi<PageResult<UserPoints>>('/admin/points/user/list', {
    method: 'GET',
    params,
  });

  // 映射后端数据到前端格式
  if (response.data && response.data.records) {
    response.data.records = response.data.records.map((item: any) => {
      // 调试日志：查看原始数据
      console.log('原始用户积分数据:', item);
      
      return {
        ...item,
        // 映射兼容字段
        pointsId: item.id,
        currentPoints: item.points,
        // 保留原始统计字段
        totalEarned: item.totalEarned || 0,
        totalUsed: item.totalUsed || 0,
        totalSpent: item.totalUsed || 0, // 兼容字段
        availablePoints: item.availablePoints || item.points || 0,
        // 映射用户信息 - 优先使用嵌套的user对象，然后是顶层字段
        username: item.user?.username || item.username || `用户${item.userId}`,
        nickname: item.user?.nickname || item.nickname || '',
        email: item.user?.email || item.email || '',
        phone: item.user?.phone || item.phone || '',
        status: item.user?.status !== undefined ? item.user.status : (item.status !== undefined ? item.status : 1), // 默认为正常状态
        // 保留原始user对象
        user: item.user ? {
          ...item.user,
          username: item.user.username || item.username,
          nickname: item.user.nickname || item.nickname,
          email: item.user.email || item.email,
          phone: item.user.phone || item.phone,
          avatar: item.user.avatar,
          status: item.user.status !== undefined ? item.user.status : 1
        } : undefined
      };
    });
  }

  return response;
}

/**
 * 获取用户积分详情
 * GET /admin/points/user/{userId}
 */
export async function getUserPointsDetail(userId: number) {
  return fetchApi<UserPoints>(`/admin/points/user/${userId}`, {
    method: 'GET',
  });
}

/**
 * 管理员调整用户积分
 * POST /admin/points/user/{userId}/adjust
 */
export async function adjustUserPoints(data: {
  userId: number;
  points: number;
  reason: string;
  source: string;
}) {
  return fetchApi<void>(`/admin/points/user/${data.userId}/adjust`, {
    method: 'POST',
    params: {
      points: data.points,
      description: data.reason
    },
  });
}

/**
 * 分页查询用户积分交易记录（积分历史）
 * GET /admin/points/history/list
 * 注意：后端返回的是PointsHistory，需要映射字段
 */
export async function getPointsTransactionPage(params: {
  userId?: number;
  page?: number;
  size?: number;
  type?: string | number;
  startTime?: string;
  endTime?: string;
}) {
  const response = await fetchApi<PageResult<PointsTransaction>>('/admin/points/history/list', {
    method: 'GET',
    params,
  });

  // 映射后端数据到前端格式
  if (response.data && response.data.records) {
    response.data.records = response.data.records.map((item: any) => ({
      ...item,
      // 映射兼容字段
      transactionId: item.id,
      transactionNo: `TXN${String(item.id).padStart(10, '0')}`, // 生成交易流水号
      status: 1, // 默认为成功状态
      referenceId: item.referenceId ? String(item.referenceId) : undefined
    }));
  }

  return response;
}

/**
 * 更改用户积分状态（冻结/解冻）
 * PUT /admin/points/user/{userId}/status
 */
export async function togglePointsStatus(userId: number, status: number, reason?: string) {
  return fetchApi<void>(`/admin/points/user/${userId}/status`, {
    method: 'PUT',
    params: {
      status,
      reason
    },
  });
}

/**
 * 获取积分统计信息
 * GET /admin/points/stats
 */
export async function getPointsStatistics() {
  return fetchApi<{
    totalUsers: number;
    activeUsers: number;
    totalEarned: number;
    totalSpent: number;
  }>('/admin/points/stats', {
    method: 'GET',
  });
}
