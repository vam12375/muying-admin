/**
 * 用户基本信息管理API
 * User Basic Information Management API
 * 
 * Source: 参考 USER_API_DESIGN.md
 * 路径: /admin/users/* - 管理员对用户信息进行增删改查
 */

import { fetchApi } from './index'
import type { User, UserListParams } from '@/types/user'
import type { PageResult } from '@/types/common'

export const usersApi = {
  /**
   * 分页获取用户列表
   * GET /admin/users/page
   */
  getUserPage: async (params: UserListParams) => {
    return fetchApi<PageResult<User>>('/admin/users/page', { params })
  },

  /**
   * 获取用户详情
   * GET /admin/users/{id}
   */
  getUserById: async (userId: number) => {
    return fetchApi<User>(`/admin/users/${userId}`)
  },

  /**
   * 添加用户
   * POST /admin/users
   */
  addUser: async (data: Partial<User> & { password: string }) => {
    return fetchApi<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /**
   * 更新用户信息
   * PUT /admin/users/{id}
   */
  updateUser: async (userId: number, data: Partial<User>) => {
    return fetchApi<User>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  /**
   * 删除用户
   * DELETE /admin/users/{id}
   */
  deleteUser: async (userId: number) => {
    return fetchApi<void>(`/admin/users/${userId}`, {
      method: 'DELETE'
    })
  },

  /**
   * 修改用户状态
   * PUT /admin/users/{id}/status
   */
  toggleUserStatus: async (userId: number, status: number) => {
    return fetchApi<void>(`/admin/users/${userId}/status`, {
      method: 'PUT',
      params: { status }
    })
  },

  /**
   * 修改用户角色
   * PUT /admin/users/{id}/role
   */
  updateUserRole: async (userId: number, role: string) => {
    return fetchApi<void>(`/admin/users/${userId}/role`, {
      method: 'PUT',
      params: { role }
    })
  },
}
