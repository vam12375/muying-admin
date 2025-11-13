/**
 * Reviews API - 评价管理
 * 对应后端: AdminReviewController
 * Source: 基于后端 Spring Boot 接口实现
 */

import { fetchApi, ApiResponse } from './index';

export const reviewsApi = {
  /**
   * 获取评价分页列表
   */
  getList: async (
    page: number = 1,
    pageSize: number = 10,
    productId?: number,
    userId?: number,
    status?: string
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(productId && { productId: productId.toString() }),
      ...(userId && { userId: userId.toString() }),
      ...(status && { status }),
    });
    return fetchApi<any>(`/admin/reviews?${params}`);
  },

  /**
   * 获取评价详情
   */
  getDetail: async (id: number) => {
    return fetchApi<any>(`/admin/reviews/${id}`);
  },

  /**
   * 更新评价状态
   */
  updateStatus: async (id: number, status: string) => {
    return fetchApi<any>(`/admin/reviews/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  /**
   * 回复评价
   */
  reply: async (id: number, replyContent: string) => {
    return fetchApi<any>(`/admin/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyContent }),
    });
  },

  /**
   * 删除评价
   */
  delete: async (id: number) => {
    return fetchApi<any>(`/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * 获取评价统计
   */
  getStatistics: async () => {
    return fetchApi<any>('/admin/reviews/statistics');
  },
};
