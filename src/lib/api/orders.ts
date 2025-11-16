/**
 * 订单管理 API
 * Source: 基于后端 AdminOrderController
 */

import { fetchApi } from './index';
import type { 
  Order, 
  OrderQueryParams, 
  OrderStatistics,
  ShipOrderParams,
  CancelOrderParams 
} from '@/types/order';

// 分页响应类型
interface PaginatedResponse<T> {
  list: T[];
  total: number;
}

/**
 * 获取订单列表（分页）
 */
export async function getOrderList(params: OrderQueryParams) {
  return fetchApi<PaginatedResponse<Order>>('/api/admin/orders', {
    params
  });
}

/**
 * 获取订单统计数据
 */
export async function getOrderStatistics() {
  return fetchApi<OrderStatistics>('/api/admin/orders/statistics');
}

/**
 * 获取订单详情
 */
export async function getOrderDetail(id: number | string) {
  return fetchApi<Order>(`/api/admin/orders/${id}`);
}

/**
 * 更新订单状态
 */
export async function updateOrderStatus(
  id: number | string,
  status: string,
  remark?: string
) {
  return fetchApi<boolean>(`/api/admin/orders/${id}/status`, {
    method: 'PUT',
    params: { status, remark }
  });
}

/**
 * 订单发货
 */
export async function shipOrder(id: number | string, data: ShipOrderParams) {
  return fetchApi<boolean>(`/api/admin/orders/${id}/ship`, {
    method: 'PUT',
    params: data
  });
}

/**
 * 取消订单
 * 注意：后端暂未实现此接口，需要后端添加
 */
export async function cancelOrder(id: number | string, data: CancelOrderParams) {
  return fetchApi<boolean>(`/api/admin/orders/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 导出订单
 */
export async function exportOrders(params: OrderQueryParams) {
  // 导出功能返回 Blob
  const response = await fetch('/api/admin/orders/export?' + new URLSearchParams(params as any), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('导出失败');
  }
  
  return response.blob();
}

// 兼容旧的对象导出方式
export const ordersApi = {
  getList: getOrderList, // 添加getList别名以兼容仪表盘调用
  getOrderList,
  getOrderStatistics,
  getOrderDetail,
  updateOrderStatus,
  shipOrder,
  cancelOrder,
  exportOrders
};
