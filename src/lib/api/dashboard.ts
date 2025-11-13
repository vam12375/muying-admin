/**
 * Dashboard Statistics API - 仪表盘统计
 * 对应后端: DashboardController
 * Source: 基于后端 Spring Boot 接口实现
 */

import { fetchApi, ApiResponse } from './index';

export const dashboardApi = {
  /**
   * 获取仪表盘统计数据
   */
  getStats: async () => {
    return fetchApi<any>('/admin/dashboard/stats');
  },

  /**
   * 获取订单趋势
   * @param days 天数，默认7天
   */
  getOrderTrend: async (days: number = 7) => {
    return fetchApi<any>(`/admin/dashboard/order-trend?days=${days}`);
  },

  /**
   * 获取商品分类统计
   */
  getProductCategories: async () => {
    return fetchApi<any[]>('/admin/dashboard/product-categories');
  },

  /**
   * 获取月度销售额
   * @param months 月数，默认6个月
   */
  getMonthlySales: async (months: number = 6) => {
    return fetchApi<any>(`/admin/dashboard/monthly-sales?months=${months}`);
  },

  /**
   * 获取待办事项
   */
  getTodoItems: async () => {
    return fetchApi<any[]>('/admin/dashboard/todo-items');
  },

  /**
   * 获取用户增长趋势
   * @param months 月数，默认6个月
   */
  getUserGrowth: async (months: number = 6) => {
    return fetchApi<any>(`/admin/dashboard/user-growth?months=${months}`);
  },

  /**
   * 获取退款趋势
   * @param days 天数，默认7天
   */
  getRefundTrend: async (days: number = 7) => {
    return fetchApi<any>(`/admin/dashboard/refund-trend?days=${days}`);
  },
};
