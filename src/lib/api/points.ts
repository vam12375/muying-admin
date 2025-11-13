/**
 * Points API - 积分管理
 * 对应后端: AdminPointsController
 * Source: 基于后端 Spring Boot 接口实现
 */

import { fetchApi, ApiResponse } from './index';

export const pointsApi = {
  /**
   * 获取积分记录分页列表
   */
  getList: async (
    page: number = 1,
    pageSize: number = 10,
    userId?: number,
    type?: string
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(userId && { userId: userId.toString() }),
      ...(type && { type }),
    });
    return fetchApi<any>(`/admin/points?${params}`);
  },

  /**
   * 获取积分记录详情
   */
  getDetail: async (id: number) => {
    return fetchApi<any>(`/admin/points/${id}`);
  },

  /**
   * 调整用户积分
   */
  adjust: async (userId: number, points: number, type: string, remark?: string) => {
    return fetchApi<any>('/admin/points/adjust', {
      method: 'POST',
      body: JSON.stringify({ userId, points, type, remark }),
    });
  },

  /**
   * 获取积分统计
   */
  getStatistics: async () => {
    return fetchApi<any>('/admin/points/statistics');
  },

  /**
   * 获取用户积分信息
   */
  getUserPoints: async (userId: number) => {
    return fetchApi<any>(`/admin/points/user/${userId}`);
  },
};
