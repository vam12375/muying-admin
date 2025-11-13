/**
 * Orders API - 订单管理
 * 对应后端: AdminOrderController (/admin/orders)
 * Source: 基于后端 Spring Boot 接口实现
 */

import { fetchApi } from './index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const ordersApi = {
  /**
   * 获取订单分页列表
   */
  getList: async (
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    orderNo?: string,
    userId?: number
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(status && { status }),
      ...(orderNo && { orderNo }),
      ...(userId && { userId: userId.toString() }),
    });
    return fetchApi<any>(`/admin/orders?${params}`);
  },

  /**
   * 获取订单详情
   */
  getDetail: async (id: number) => {
    return fetchApi<any>(`/admin/orders/${id}`);
  },

  /**
   * 获取订单统计
   */
  getStatistics: async () => {
    return fetchApi<any>('/admin/orders/statistics');
  },

  /**
   * 更新订单状态
   */
  updateStatus: async (id: number, status: string, remark?: string) => {
    return fetchApi<any>(
      `/admin/orders/${id}/status?status=${status}${remark ? `&remark=${remark}` : ''}`,
      {
        method: 'PUT',
      }
    );
  },

  /**
   * 订单发货
   */
  ship: async (
    id: number,
    companyId: number,
    trackingNo?: string,
    receiverName?: string,
    receiverPhone?: string,
    receiverAddress?: string
  ) => {
    const params = new URLSearchParams({
      companyId: companyId.toString(),
      ...(trackingNo && { trackingNo }),
      ...(receiverName && { receiverName }),
      ...(receiverPhone && { receiverPhone }),
      ...(receiverAddress && { receiverAddress }),
    });
    return fetchApi<any>(`/admin/orders/${id}/ship?${params}`, {
      method: 'PUT',
    });
  },

  /**
   * 导出订单
   */
  export: async (status?: string, orderNo?: string, userId?: number) => {
    const params = new URLSearchParams({
      ...(status && { status }),
      ...(orderNo && { orderNo }),
      ...(userId && { userId: userId.toString() }),
    });
    window.open(`${API_BASE_URL}/admin/orders/export?${params}`, '_blank');
  },
};
