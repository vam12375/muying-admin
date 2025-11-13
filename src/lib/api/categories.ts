/**
 * 分类管理 API
 * Category Management API
 * 
 * Source: 基于 context7-mcp 和后端 CategoryController
 */

import { fetchApi } from './index';
import type { Category, CategoryListParams, CategoryFormData } from '@/types/category';

/**
 * 获取所有分类（树形结构）
 */
export async function getCategoryTree() {
  return fetchApi<Category[]>('/admin/categories', {
    method: 'GET'
  });
}

/**
 * 获取所有分类（平铺结构）
 */
export async function getCategoryList(params: CategoryListParams = {}) {
  return fetchApi<Category[]>('/admin/categories/list', {
    method: 'GET',
    params
  });
}

/**
 * 获取分类详情
 */
export async function getCategoryDetail(id: number) {
  return fetchApi<Category>(`/admin/categories/${id}`, {
    method: 'GET'
  });
}

/**
 * 创建分类
 */
export async function createCategory(data: CategoryFormData) {
  return fetchApi<boolean>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 更新分类
 */
export async function updateCategory(id: number, data: Partial<CategoryFormData>) {
  return fetchApi<boolean>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * 删除分类
 */
export async function deleteCategory(id: number) {
  return fetchApi<boolean>(`/admin/categories/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 更新分类状态
 */
export async function updateCategoryStatus(id: number, status: number) {
  return fetchApi<boolean>(`/admin/categories/${id}/status`, {
    method: 'PUT',
    params: { status }
  });
}

/**
 * 获取分类下的商品数量
 */
export async function getCategoryProductCount(id: number) {
  return fetchApi<number>(`/admin/categories/${id}/product-count`, {
    method: 'GET'
  });
}

// 兼容旧的导出方式
export const categoriesApi = {
  getTree: getCategoryTree,
  getList: getCategoryList,
  getDetail: getCategoryDetail,
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory,
  updateStatus: updateCategoryStatus,
  getProductCount: getCategoryProductCount,
};
