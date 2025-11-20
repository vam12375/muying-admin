/**
 * 积分规则管理 API
 * Points Rules Management API
 * 
 * Source: 基于后端 AdminPointsController
 * 
 */

import { fetchApi } from '../index';
import type { PointsRule, PointsRuleFormData, PageResult } from '@/types/points';

/**
 * 分页查询积分规则列表
 * GET /admin/points/rule/list
 */
export async function getPointsRuleList(params: {
  page?: number;
  size?: number;
  name?: string;
}) {
  return fetchApi<PageResult<PointsRule>>('/admin/points/rule/list', {
    method: 'GET',
    params,
  });
}

/**
 * 创建积分规则
 * POST /admin/points/rule
 */
export async function createPointsRule(data: PointsRuleFormData) {
  return fetchApi<PointsRule>('/admin/points/rule', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 更新积分规则
 * PUT /admin/points/rule/{id}
 */
export async function updatePointsRule(id: number, data: PointsRuleFormData) {
  return fetchApi<void>(`/admin/points/rule/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 删除积分规则
 * DELETE /admin/points/rule/{id}
 */
export async function deletePointsRule(id: number) {
  return fetchApi<void>(`/admin/points/rule/${id}`, {
    method: 'DELETE',
  });
}
