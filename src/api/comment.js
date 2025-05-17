import request from '@/utils/request'

/**
 * 管理员获取评价列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCommentList(params) {
  return request({
    url: '/comment/admin/list',
    method: 'get',
    params
  })
}

/**
 * 更新评价状态
 * @param {number} commentId - 评价ID
 * @param {number} status - 状态：0-隐藏，1-显示
 * @returns {Promise}
 */
export function updateCommentStatus(commentId, status) {
  return request({
    url: `/comment/${commentId}/status`,
    method: 'put',
    params: { status }
  })
}

/**
 * 删除评价
 * @param {number} commentId - 评价ID
 * @returns {Promise}
 */
export function deleteComment(commentId) {
  return request({
    url: `/comment/${commentId}`,
    method: 'delete'
  })
}

/**
 * 获取评价统计数据
 * @param {number} [days=7] - 统计天数
 * @returns {Promise}
 */
export function getCommentStats(days = 7) {
  return request({
    url: '/comment/admin/stats',
    method: 'get',
    params: { days }
  })
}

/**
 * 获取商品评分统计
 * @param {number} productId - 商品ID
 * @returns {Promise}
 */
export function getProductRatingStats(productId) {
  return request({
    url: `/comment/product/${productId}/stats`,
    method: 'get'
  })
}

/**
 * 导出评价数据
 * @param {Object} params - 筛选参数
 * @returns {Promise}
 */
export function exportCommentData(params) {
  return request({
    url: '/comment/admin/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
} 