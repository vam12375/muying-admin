/**
 * 用户管理API
 * User Management API
 * 
 * Source: 基于后端 AdminUserAccountController
 */

import { fetchApi } from './index'
import type { 
  UserAccount, 
  AccountTransaction, 
  UserListParams, 
  TransactionListParams,
  RechargeRequest
} from '@/types/user'
import type { PageResult } from '@/types/common'

export const usersApi = {
  /**
   * 分页获取用户账户列表
   */
  getUserAccountPage: async (params: UserListParams) => {
    return fetchApi<PageResult<UserAccount>>('/admin/users/page', { params })
  },

  /**
   * 获取用户账户详情
   */
  getUserAccount: async (userId: number) => {
    return fetchApi<UserAccount>(`/admin/users/${userId}`)
  },

  /**
   * 管理员给用户充值
   */
  recharge: async (data: RechargeRequest) => {
    return fetchApi<void>('/admin/users/recharge', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /**
   * 管理员调整用户余额
   */
  adjustBalance: async (userId: number, amount: number, reason: string) => {
    return fetchApi<void>(`/admin/users/${userId}/balance`, {
      method: 'PUT',
      params: { amount, reason }
    })
  },

  /**
   * 更改用户账户状态（冻结/解冻）
   */
  toggleStatus: async (userId: number, status: number, reason?: string) => {
    return fetchApi<void>(`/admin/users/${userId}/status`, {
      method: 'PUT',
      params: { status, reason }
    })
  },

  /**
   * 分页获取交易记录列表
   */
  getTransactionPage: async (params: TransactionListParams) => {
    return fetchApi<PageResult<AccountTransaction>>('/admin/users/transactions/page', { params })
  },

  /**
   * 获取交易记录详情
   */
  getTransactionDetail: async (transactionId: number) => {
    return fetchApi<AccountTransaction>(`/admin/users/transactions/${transactionId}`)
  }
}
