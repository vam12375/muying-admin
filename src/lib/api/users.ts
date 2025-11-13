/**
 * Users API - 用户管理
 * 对应后端: AdminUserAccountController
 * Source: 基于 muying-admin-react 的用户管理API
 */

import { fetchApi, ApiResponse } from './index';

export const usersApi = {
  /**
   * 获取用户列表（分页）
   */
  getList: async (
    page: number = 1,
    pageSize: number = 10,
    keyword?: string,
    status?: string,
    role?: string
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      ...(keyword && { keyword }),
      ...(status && { status }),
    });
    return fetchApi<any>(`/admin/user-accounts/page?${params}`);
  },

  /**
   * 获取用户详情
   */
  getDetail: async (userId: number) => {
    return fetchApi<any>(`/admin/user-accounts/${userId}`);
  },

  /**
   * 切换用户状态（启用/禁用）
   */
  toggleStatus: async (userId: number, status: number) => {
    return fetchApi<any>(`/admin/user-accounts/${userId}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  /**
   * 删除用户
   */
  delete: async (userId: number) => {
    return fetchApi<any>(`/admin/user-accounts/${userId}`, {
      method: 'DELETE',
    });
  },

  /**
   * 管理员充值
   */
  recharge: async (data: {
    userId: number;
    amount: number;
    paymentMethod?: string;
    description?: string;
    remark?: string;
  }) => {
    return fetchApi<any>('/admin/user-accounts/recharge', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * 调整用户余额
   */
  adjustBalance: async (userId: number, amount: number, reason: string) => {
    return fetchApi<any>(
      `/admin/user-accounts/${userId}/balance?amount=${amount}&reason=${encodeURIComponent(reason)}`,
      {
        method: 'PUT',
      }
    );
  },

  /**
   * 获取交易记录列表
   */
  getTransactions: async (
    page: number = 1,
    pageSize: number = 10,
    query?: {
      userId?: number;
      type?: number;
      status?: number;
      paymentMethod?: string;
      transactionNo?: string;
      startTime?: string;
      endTime?: string;
      keyword?: string;
    }
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      ...(query?.userId && { userId: query.userId.toString() }),
      ...(query?.type !== undefined && { type: query.type.toString() }),
      ...(query?.status !== undefined && { status: query.status.toString() }),
      ...(query?.paymentMethod && { paymentMethod: query.paymentMethod }),
      ...(query?.transactionNo && { transactionNo: query.transactionNo }),
      ...(query?.startTime && { startTime: query.startTime }),
      ...(query?.endTime && { endTime: query.endTime }),
      ...(query?.keyword && { keyword: query.keyword }),
    });
    return fetchApi<any>(`/admin/user-accounts/transactions/page?${params}`);
  },

  /**
   * 获取交易记录详情
   */
  getTransactionDetail: async (id: number) => {
    return fetchApi<any>(`/admin/user-accounts/transactions/${id}`);
  },
};
