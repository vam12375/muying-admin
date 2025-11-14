/**
 * Orders API - 订单管理
 * 对应后端: AdminOrderController (/admin/orders)
 * Source: 基于后端 Spring Boot 接口实现
 */

import { fetchApi, type ApiResponse } from './index';
import type {
  Order,
  OrderListParams,
  OrderStatistics,
  OrderPageResponse,
  ShipOrderParams,
  OrderStatus
} from '@/types/order';

/**
 * 获取订单分页列表
 * Source: AdminOrderController.getOrderList()
 * GET /admin/orders
 */
export async function getOrderList(
  params: OrderListParams
): Promise<ApiResponse<OrderPageResponse>> {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.orderNo) queryParams.append('orderNo', params.orderNo);
  if (params.userId) queryParams.append('userId', params.userId.toString());
  
  return fetchApi<OrderPageResponse>(`/admin/orders?${queryParams}`);
}

/**
 * 获取订单详情
 * Source: AdminOrderController.getOrderDetail()
 * GET /admin/orders/{id}
 */
export async function getOrderDetail(id: number): Promise<ApiResponse<Order>> {
  return fetchApi<Order>(`/admin/orders/${id}`);
}

/**
 * 获取订单统计数据
 * Source: AdminOrderController.getOrderStatistics()
 * GET /admin/orders/statistics
 */
export async function getOrderStatistics(): Promise<ApiResponse<OrderStatistics>> {
  return fetchApi<OrderStatistics>('/admin/orders/statistics');
}

/**
 * 更新订单状态
 * Source: AdminOrderController.updateOrderStatus()
 * PUT /admin/orders/{id}/status
 */
export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
  remark?: string
): Promise<ApiResponse<boolean>> {
  const params = new URLSearchParams({ status });
  if (remark) params.append('remark', remark);
  
  return fetchApi<boolean>(`/admin/orders/${id}/status?${params}`, {
    method: 'PUT'
  });
}

/**
 * 订单发货
 * Source: AdminOrderController.shipOrder()
 * PUT /admin/orders/{id}/ship
 */
export async function shipOrder(
  id: number,
  params: ShipOrderParams
): Promise<ApiResponse<boolean>> {
  const queryParams = new URLSearchParams({
    companyId: params.companyId.toString()
  });
  
  if (params.trackingNo) queryParams.append('trackingNo', params.trackingNo);
  if (params.receiverName) queryParams.append('receiverName', params.receiverName);
  if (params.receiverPhone) queryParams.append('receiverPhone', params.receiverPhone);
  if (params.receiverAddress) queryParams.append('receiverAddress', params.receiverAddress);
  
  return fetchApi<boolean>(`/admin/orders/${id}/ship?${queryParams}`, {
    method: 'PUT'
  });
}

/**
 * 导出订单数据
 * Source: AdminOrderController.exportOrders()
 * GET /admin/orders/export
 */
export async function exportOrders(params?: OrderListParams): Promise<void> {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.append('status', params.status);
  if (params?.orderNo) queryParams.append('orderNo', params.orderNo);
  if (params?.userId) queryParams.append('userId', params.userId.toString());
  
  const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/export?${queryParams}`;
  
  // 使用fetch下载文件
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  
  if (!response.ok) {
    throw new Error('导出失败');
  }
  
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `订单数据_${new Date().toLocaleDateString()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(a);
}

// 导出为对象形式（兼容旧代码）
export const ordersApi = {
  getList: getOrderList,
  getDetail: getOrderDetail,
  getStatistics: getOrderStatistics,
  updateStatus: updateOrderStatus,
  ship: shipOrder,
  export: exportOrders
};
