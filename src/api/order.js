import request from '@/utils/request'

/**
 * 获取订单列表
 * @param {Object} params 查询参数
 * @returns {Promise} 请求Promise
 */
export function getOrderList(params) {
  return request({
    url: '/api/admin/orders',
    method: 'get',
    params
  })
}

/**
 * 获取订单详情
 * @param {Number} id 订单ID
 * @returns {Promise} 请求Promise
 */
export function getOrderDetail(id) {
  return request({
    url: `/api/admin/orders/${id}`,
    method: 'get'
  })
}

/**
 * 更新订单状态
 * @param {Number} id 订单ID
 * @param {String} status 订单状态
 * @param {String} remark 备注
 * @returns {Promise} 请求Promise
 */
export function updateOrderStatus(id, status, remark) {
  return request({
    url: `/api/admin/orders/${id}/status`,
    method: 'put',
    data: {
      status,
      remark
    }
  })
}

/**
 * 订单发货
 * @param {Number} id 订单ID
 * @param {Number} companyId 物流公司ID
 * @param {String} trackingNo 物流单号，可选，不传则自动生成
 * @param {String} receiverName 收件人姓名，可选，不传则使用订单收件人
 * @param {String} receiverPhone 收件人电话，可选，不传则使用订单收件人电话
 * @param {String} receiverAddress 收件人地址，可选，不传则使用订单收件人地址
 * @returns {Promise} 请求Promise
 */
export function shipOrder(id, companyId, trackingNo, receiverName, receiverPhone, receiverAddress) {
  return request({
    url: `/api/admin/orders/${id}/ship`,
    method: 'put',
    params: {
      companyId,
      trackingNo,
      receiverName,
      receiverPhone,
      receiverAddress
    }
  })
}

/**
 * 获取订单统计数据
 * @returns {Promise} 请求Promise
 */
export function getOrderStatistics() {
  return request({
    url: '/api/admin/orders/statistics',
    method: 'get'
  })
}

/**
 * 导出订单数据
 * @param {Object} params 导出参数
 * @returns {Promise} 请求Promise
 */
export function exportOrders(params) {
  return request({
    url: '/api/admin/orders/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
} 