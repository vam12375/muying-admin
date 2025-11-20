/**
 * 兑换记录管理 API
 * Exchange Records Management API
 * 
 * Source: 基于后端 AdminPointsController
 * 
 */

import { fetchApi } from '../index';
import type { PointsExchange, ShipExchangeData, ExchangeStats, PageResult } from '@/types/points';

/**
 * 分页查询兑换记录列表
 * GET /admin/points/exchange/list
 */
export async function getExchangeList(params: {
  page?: number;
  size?: number;
  userId?: number;
  productId?: number;
  status?: string;
  orderNo?: string;
  startDate?: string;
  endDate?: string;
}) {
  return fetchApi<PageResult<PointsExchange>>('/admin/points/exchange/list', {
    method: 'GET',
    params,
  });
}

/**
 * 获取兑换详情
 * GET /admin/points/exchange/{id}
 */
export async function getExchangeDetail(id: number) {
  return fetchApi<PointsExchange>(`/admin/points/exchange/${id}`, {
    method: 'GET',
  });
}

/**
 * 获取兑换统计数据
 * GET /admin/points/exchange/stats
 */
export async function getExchangeStats(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return fetchApi<ExchangeStats>('/admin/points/exchange/stats', {
    method: 'GET',
    params,
  });
}

/**
 * 更新兑换状态
 * PUT /admin/points/exchange/{id}/status
 */
export async function updateExchangeStatus(id: number, status: string) {
  return fetchApi<void>(`/admin/points/exchange/${id}/status`, {
    method: 'PUT',
    params: { status },
  });
}

/**
 * 兑换发货
 * POST /admin/points/exchange/{id}/ship
 */
export async function shipExchange(id: number, data: ShipExchangeData) {
  return fetchApi<void>(`/admin/points/exchange/${id}/ship`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
