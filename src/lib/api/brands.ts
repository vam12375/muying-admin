/**
 * 品牌管理 API
 * Brand Management API
 * 
 * Source: 基于 context7-mcp 和后端 BrandController
 */

import { fetchApi } from './index';
import type { Brand, BrandListParams, BrandFormData } from '@/types/brand';
import type { PageResult } from '../../types/common';

/**
 * 获取品牌分页列表
 */
export async function getBrandList(params: BrandListParams = {}) {
  const { page = 1, size = 10, keyword } = params;
  
  return fetchApi<PageResult<Brand>>('/admin/brands', {
    method: 'GET',
    params: { page, size, keyword }
  });
}

/**
 * 获取所有品牌（不分页）
 */
export async function getAllBrands() {
  return fetchApi<Brand[]>('/admin/brands/all', {
    method: 'GET'
  });
}

/**
 * 获取品牌详情
 */
export async function getBrandDetail(id: number) {
  return fetchApi<Brand>(`/admin/brands/${id}`, {
    method: 'GET'
  });
}

/**
 * 创建品牌
 */
export async function createBrand(data: BrandFormData) {
  return fetchApi<boolean>('/admin/brands', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 更新品牌
 */
export async function updateBrand(id: number, data: Partial<BrandFormData>) {
  return fetchApi<boolean>(`/admin/brands/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * 删除品牌
 */
export async function deleteBrand(id: number) {
  return fetchApi<boolean>(`/admin/brands/${id}`, {
    method: 'DELETE'
  });
}
