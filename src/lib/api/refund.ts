/**
 * 售后/退款 API
 * Refund & After-sales API
 * 
 * Source: 基于后端 RefundController 和 AdminRefundController
 */

import { fetchApi } from './index';
import type {
  Refund,
  RefundApplyDTO,
  RefundReviewDTO,
  RefundProcessDTO,
  RefundStatistics,
  RefundQueryParams,
  RefundStatus,
} from '@/types/refund';

/**
 * 分页响应类型
 */
export interface Page<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 管理端退款API
 */
export const refundApi = {
  /**
   * 获取退款列表（分页）
   */
  getRefundList: async (params: RefundQueryParams): Promise<Page<Refund>> => {
    const response = await fetchApi<Page<Refund>>('/admin/refund/list', {
      method: 'GET',
      params,
    });
    return response.data || { records: [], total: 0, size: 10, current: 1, pages: 0 };
  },

  /**
   * 获取退款详情
   */
  getRefundDetail: async (refundId: number): Promise<Refund> => {
    const response = await fetchApi<Refund>(`/admin/refund/${refundId}`);
    return response.data!;
  },

  /**
   * 获取退款统计
   */
  getRefundStatistics: async (): Promise<RefundStatistics> => {
    const response = await fetchApi<RefundStatistics>('/admin/refund/statistics');
    return response.data!;
  },

  /**
   * 审核退款申请
   */
  reviewRefund: async (data: RefundReviewDTO): Promise<boolean> => {
    const response = await fetchApi<boolean>('/admin/refund/review', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || false;
  },

  /**
   * 处理退款
   */
  processRefund: async (data: RefundProcessDTO): Promise<boolean> => {
    const response = await fetchApi<boolean>('/admin/refund/process', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || false;
  },

  /**
   * 完成退款
   */
  completeRefund: async (
    refundId: number,
    transactionId?: string,
    remark?: string
  ): Promise<boolean> => {
    const response = await fetchApi<boolean>('/admin/refund/complete', {
      method: 'POST',
      body: JSON.stringify({
        refundId,
        transactionId,
        remark,
      }),
    });
    return response.data || false;
  },

  /**
   * 拒绝退款
   */
  rejectRefund: async (refundId: number, reason: string): Promise<boolean> => {
    const response = await fetchApi<boolean>('/admin/refund/fail', {
      method: 'POST',
      body: JSON.stringify({ refundId, reason }),
    });
    return response.data || false;
  },

  /**
   * 获取待处理退款数量
   */
  getPendingCount: async (): Promise<number> => {
    const response = await fetchApi<number>('/admin/refund/pending/count');
    return response.data || 0;
  },

  /**
   * 获取所有可用的退款状态
   */
  getRefundStatusList: async (): Promise<RefundStatus[]> => {
    const response = await fetchApi<RefundStatus[]>('/admin/refund/status/list');
    return response.data || [];
  },

  /**
   * 根据状态获取退款列表
   */
  getRefundsByStatus: async (status: RefundStatus): Promise<Refund[]> => {
    const response = await fetchApi<Refund[]>(`/admin/refund/status/${status}`);
    return response.data || [];
  },

  /**
   * 批量查询（Alipay）
   */
  alipayQuery: async (params: { page?: number; size?: number }): Promise<Page<Refund>> => {
    const response = await fetchApi<Page<Refund>>('/admin/refund/alipay/query', {
      method: 'GET',
      params,
    });
    return response.data || { records: [], total: 0, size: 10, current: 1, pages: 0 };
  },
};

/**
 * 用户端退款API
 */
export const userRefundApi = {
  /**
   * 申请退款
   */
  applyRefund: async (data: RefundApplyDTO): Promise<number> => {
    const response = await fetchApi<number>('/refund/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || 0;
  },

  /**
   * 获取退款详情
   */
  getRefundDetail: async (refundId: number): Promise<Refund> => {
    const response = await fetchApi<Refund>(`/refund/${refundId}`);
    return response.data!;
  },

  /**
   * 获取用户退款列表
   */
  getUserRefunds: async (userId: number, page: number = 1, size: number = 10): Promise<Page<Refund>> => {
    const response = await fetchApi<Page<Refund>>(`/refund/user/${userId}`, {
      method: 'GET',
      params: { page, size },
    });
    return response.data || { records: [], total: 0, size: 10, current: 1, pages: 0 };
  },

  /**
   * 获取订单退款列表
   */
  getOrderRefunds: async (orderId: number, page: number = 1, size: number = 10): Promise<Page<Refund>> => {
    const response = await fetchApi<Page<Refund>>(`/refund/order/${orderId}`, {
      method: 'GET',
      params: { page, size },
    });
    return response.data || { records: [], total: 0, size: 10, current: 1, pages: 0 };
  },

  /**
   * 取消退款申请
   */
  cancelRefund: async (refundId: number, userId: number, reason: string): Promise<boolean> => {
    const response = await fetchApi<boolean>(`/refund/${refundId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ userId, reason }),
    });
    return response.data || false;
  },

  /**
   * 获取下一个可用状态
   */
  getNextStatuses: async (status: string): Promise<RefundStatus[]> => {
    const response = await fetchApi<RefundStatus[]>(`/refund/next-statuses/${status}`);
    return response.data || [];
  },

  /**
   * 获取所有退款状态
   */
  getRefundStatusList: async (): Promise<RefundStatus[]> => {
    const response = await fetchApi<RefundStatus[]>('/refund/status-list');
    return response.data || [];
  },
};
