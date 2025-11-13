/**
 * Coupons API - 优惠券管理
 * 对应后端: AdminCouponController
 * Source: 基于后端 Spring Boot 接口实现
 */

import { fetchApi, ApiResponse } from './index';
import { Coupon, CouponFormData, CouponListParams, CouponStats } from '@/types/coupon';
import { PageResult } from '@/types/common';

export const couponsApi = {
  /**
   * 获取优惠券分页列表
   * 注意：后端路径为 /admin/coupon/list (单数)
   */
  getList: async (params: CouponListParams = {}) => {
    const { page = 1, pageSize = 10, ...rest } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(), // 后端使用 size 参数
    });
    
    // 添加其他查询参数
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    return fetchApi<PageResult<Coupon>>(`/admin/coupon/list?${queryParams}`);
  },

  /**
   * 获取优惠券详情
   */
  getDetail: async (id: number) => {
    return fetchApi<Coupon>(`/admin/coupon/${id}`);
  },

  /**
   * 创建优惠券
   */
  create: async (data: CouponFormData) => {
    return fetchApi<Coupon>('/admin/coupon', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * 更新优惠券
   */
  update: async (id: number, data: Partial<CouponFormData>) => {
    return fetchApi<Coupon>(`/admin/coupon/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * 删除优惠券
   */
  delete: async (id: number) => {
    return fetchApi<void>(`/admin/coupon/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * 批量删除优惠券
   * 注意：后端暂无此接口，保留以备后续实现
   */
  batchDelete: async (ids: number[]) => {
    return fetchApi<void>('/admin/coupon/batch', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  },

  /**
   * 更新优惠券状态
   */
  updateStatus: async (id: number, status: string) => {
    return fetchApi<void>(`/admin/coupon/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  /**
   * 批量更新优惠券状态
   * 注意：后端暂无此接口，保留以备后续实现
   */
  batchUpdateStatus: async (ids: number[], status: string) => {
    return fetchApi<void>('/admin/coupon/batch/status', {
      method: 'PUT',
      body: JSON.stringify({ ids, status }),
    });
  },

  /**
   * 获取优惠券统计
   */
  getStatistics: async () => {
    return fetchApi<CouponStats>('/admin/coupon/stats');
  },

  /**
   * 导出优惠券数据
   * 注意：后端暂无此接口，保留以备后续实现
   */
  export: async (params: CouponListParams = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    return fetchApi<Blob>(`/admin/coupon/export?${queryParams}`, {
      method: 'GET',
    });
  },
};
