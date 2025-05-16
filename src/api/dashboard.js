import request from '@/utils/request'

/**
 * 获取仪表盘统计数据
 * @returns {Promise} 请求Promise
 */
export function getDashboardStats() {
  return request({
    url: '/admin/dashboard/stats',
    method: 'get'
  })
}

/**
 * 获取订单趋势数据
 * @param {number} days 天数
 * @returns {Promise} 请求Promise
 */
export function getOrderTrend(days = 7) {
  return request({
    url: '/admin/dashboard/order-trend',
    method: 'get',
    params: { days }
  })
}

/**
 * 获取商品分类数据
 * @returns {Promise} 请求Promise
 */
export function getProductCategories() {
  return request({
    url: '/admin/dashboard/product-categories',
    method: 'get'
  })
}

/**
 * 获取月度销售额数据
 * @param {number} months 月数
 * @returns {Promise} 请求Promise
 */
export function getMonthlySales(months = 6) {
  return request({
    url: '/admin/dashboard/monthly-sales',
    method: 'get',
    params: { months }
  })
}

/**
 * 获取待处理事项数据
 * @returns {Promise} 请求Promise
 */
export function getTodoItems() {
  return request({
    url: '/admin/dashboard/todo-items',
    method: 'get'
  })
}

/**
 * 获取用户增长数据
 * @param {number} months 月数
 * @returns {Promise} 请求Promise
 */
export function getUserGrowth(months = 6) {
  return request({
    url: '/admin/dashboard/user-growth',
    method: 'get',
    params: { months }
  })
} 