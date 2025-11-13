/**
 * Admin Authentication API - 管理员认证
 * Source: 基于后端 AdminController
 */

import { fetchApi, ApiResponse } from './index';

export const authApi = {
  /**
   * 管理员登录
   */
  login: async (username: string, password: string) => {
    return fetchApi<{ token: string; user: any }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ 
        admin_name: username, 
        admin_pass: password 
      }),
    });
  },

  /**
   * 获取当前管理员信息
   */
  getUserInfo: async () => {
    return fetchApi<any>('/admin/info');
  },

  /**
   * 管理员登出
   */
  logout: async () => {
    return fetchApi<void>('/admin/logout', {
      method: 'POST',
    });
  },
};
