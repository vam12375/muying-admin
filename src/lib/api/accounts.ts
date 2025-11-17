/**
 * 用户账户余额管理API
 * User Account Balance Management API
 * 
 * Source: 参考旧系统 muying-admin-react/src/api/userAccount.ts
 * 路径: /admin/user-accounts/* - 管理员对用户余额进行增删改查
 */

import { fetchApi } from './index'
import type { 
  UserAccount, 
  UserListParams,
  AccountTransaction,
  TransactionListParams,
  RechargeRequest,
  BalanceAdjustRequest,
  AccountStatusRequest,
} from '@/types/accounts'

import type { PageResult } from '@/types/common'

export const accountsApi = {
  // ==================== 用户账户管理 ====================
  
  /**
   * 分页获取用户账户列表（带用户信息）
   * GET /admin/user-accounts/page
   */
  getUserAccountPage: async (params: UserListParams) => {
    return fetchApi<PageResult<UserAccount>>('/admin/user-accounts/page', { params })
  },

  /**
   * 获取用户账户详情
   * GET /admin/user-accounts/{userId}
   */
  getUserAccountByUserId: async (userId: number) => {
    return fetchApi<UserAccount>(`/admin/user-accounts/${userId}`)
  },

  /**
   * 管理员给用户充值
   * POST /admin/user-accounts/recharge
   */
  rechargeUserAccount: async (data: RechargeRequest) => {
    return fetchApi<AccountTransaction>('/admin/user-accounts/recharge', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /**
   * 管理员调整用户余额
   * PUT /admin/user-accounts/{userId}/balance
   */
  adjustUserBalance: async (data: BalanceAdjustRequest) => {
    return fetchApi<AccountTransaction>(`/admin/user-accounts/${data.userId}/balance`, {
      method: 'PUT',
      params: {
        amount: data.amount,
        reason: data.reason
      }
    })
  },

  /**
   * 更改用户账户状态（冻结/解冻）
   * PUT /admin/user-accounts/{userId}/status
   */
  toggleUserAccountStatus: async (data: AccountStatusRequest) => {
    return fetchApi<void>(`/admin/user-accounts/${data.userId}/status`, {
      method: 'PUT',
      params: {
        status: data.status,
        reason: data.reason
      }
    })
  },

  // ==================== 交易记录管理 ====================
  
  /**
   * 分页获取交易记录列表
   * GET /admin/user-accounts/transactions/page
   */
  getTransactionPage: async (params: TransactionListParams) => {
    return fetchApi<PageResult<AccountTransaction>>('/admin/user-accounts/transactions/page', { params })
  },

  /**
   * 获取交易记录详情
   * GET /admin/user-accounts/transactions/{id}
   */
  getTransactionDetail: async (transactionId: number) => {
    return fetchApi<AccountTransaction>(`/admin/user-accounts/transactions/${transactionId}`)
  },
}