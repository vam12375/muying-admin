/**
 * 商品管理 API
 * Product Management API
 * 
 * Source: 基于 context7-mcp 和后端 ProductController
 */

import { fetchApi } from './index';
import type { Product, ProductListParams, ProductFormData, ProductAnalysis } from '@/types/product';
import type { PageResult } from '../../types/common';

/**
 * 获取商品分页列表
 */
export async function getProductList(params: ProductListParams = {}) {
  const { page = 1, size = 10, keyword, categoryId, brandId, status } = params;
  
  return fetchApi<PageResult<Product>>('/admin/products/page', {
    method: 'GET',
    params: { page, size, keyword, categoryId, brandId, status }
  });
}

/**
 * 获取商品详情
 */
export async function getProductDetail(id: number) {
  return fetchApi<Product>(`/admin/products/${id}`, {
    method: 'GET'
  });
}

/**
 * 创建商品
 */
export async function createProduct(data: ProductFormData) {
  return fetchApi<boolean>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 更新商品
 */
export async function updateProduct(id: number, data: Partial<ProductFormData>) {
  return fetchApi<boolean>(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * 删除商品
 */
export async function deleteProduct(id: number) {
  return fetchApi<boolean>(`/admin/products/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 更新商品状态
 */
export async function updateProductStatus(id: number, status: number) {
  return fetchApi<boolean>(`/admin/products/${id}/status`, {
    method: 'PUT',
    params: { status }
  });
}

/**
 * 获取商品分析数据
 */
export async function getProductAnalysis(params: {
  timeRange?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  return fetchApi<ProductAnalysis>('/admin/products/analysis', {
    method: 'GET',
    params
  });
}

/**
 * 兼容旧版本的对象导出方式
 */
export const productsApi = {
  getList: (page: number = 1, size: number = 10, keyword?: string, categoryId?: number, brandId?: number, status?: number) => {
    return getProductList({ page, size, keyword, categoryId, brandId, status });
  },
  getDetail: getProductDetail,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  updateStatus: updateProductStatus,
  getAnalysis: getProductAnalysis,
};
