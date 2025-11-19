/**
 * 积分商品管理 API
 * Points Products Management API
 * 
 * Source: 基于后端 AdminPointsController
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { fetchApi } from '../index';
import type { PointsProduct, PointsProductFormData, PageResult } from '@/types/points';

/**
 * 分页查询积分商品列表
 * GET /admin/points/product/list
 */
export async function getPointsProductList(params: {
  page?: number;
  size?: number;
  name?: string;
  category?: string;
}) {
  return fetchApi<PageResult<PointsProduct>>('/admin/points/product/list', {
    method: 'GET',
    params,
  });
}

/**
 * 创建积分商品
 * POST /admin/points/product
 */
export async function createPointsProduct(data: PointsProductFormData) {
  return fetchApi<PointsProduct>('/admin/points/product', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 更新积分商品
 * PUT /admin/points/product/{id}
 */
export async function updatePointsProduct(id: number, data: PointsProductFormData) {
  return fetchApi<void>(`/admin/points/product/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 删除积分商品
 * DELETE /admin/points/product/{id}
 */
export async function deletePointsProduct(id: number) {
  return fetchApi<void>(`/admin/points/product/${id}`, {
    method: 'DELETE',
  });
}
