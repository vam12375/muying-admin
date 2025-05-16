import request from '@/utils/request'

/**
 * 获取优惠券列表(分页)
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回优惠券列表
 */
export function getCouponList(query) {
  return request({
    url: '/admin/coupon/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取优惠券详情
 * @param {number} id - 优惠券ID
 * @returns {Promise} - 返回优惠券详情
 */
export function getCouponDetail(id) {
  return request({
    url: `/admin/coupon/${id}`,
    method: 'get'
  })
}

/**
 * 创建优惠券
 * @param {Object} data - 优惠券数据
 * @returns {Promise} - 返回创建结果
 */
export function createCoupon(data) {
  return request({
    url: '/admin/coupon',
    method: 'post',
    data
  })
}

/**
 * 更新优惠券
 * @param {number} id - 优惠券ID
 * @param {Object} data - 优惠券数据
 * @returns {Promise} - 返回更新结果
 */
export function updateCoupon(id, data) {
  return request({
    url: `/admin/coupon/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除优惠券
 * @param {number} id - 优惠券ID
 * @returns {Promise} - 返回删除结果
 */
export function deleteCoupon(id) {
  return request({
    url: `/admin/coupon/${id}`,
    method: 'delete'
  })
}

/**
 * 更新优惠券状态
 * @param {number} id - 优惠券ID
 * @param {string} status - 优惠券状态
 * @returns {Promise} - 返回更新结果
 */
export function updateCouponStatus(id, status) {
  return request({
    url: `/admin/coupon/${id}/status`,
    method: 'put',
    params: { status }
  })
}

/**
 * 获取优惠券批次列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回批次列表
 */
export function getCouponBatchList(query) {
  return request({
    url: '/admin/coupon/batch/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取优惠券批次详情
 * @param {number} batchId - 批次ID
 * @returns {Promise} - 返回批次详情
 */
export function getCouponBatchDetail(batchId) {
  return request({
    url: `/admin/coupon/batch/${batchId}`,
    method: 'get'
  })
}

/**
 * 创建优惠券批次
 * @param {Object} data - 批次数据
 * @returns {Promise} - 返回创建结果
 */
export function createCouponBatch(data) {
  return request({
    url: '/admin/coupon/batch',
    method: 'post',
    data
  })
}

/**
 * 获取优惠券规则列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回规则列表
 */
export function getCouponRuleList(query) {
  return request({
    url: '/admin/coupon/rule/list',
    method: 'get',
    params: query
  })
}

/**
 * 创建优惠券规则
 * @param {Object} data - 规则数据
 * @returns {Promise} - 返回创建结果
 */
export function createCouponRule(data) {
  return request({
    url: '/admin/coupon/rule',
    method: 'post',
    data
  })
}

/**
 * 更新优惠券规则
 * @param {number} ruleId - 规则ID
 * @param {Object} data - 规则数据
 * @returns {Promise} - 返回更新结果
 */
export function updateCouponRule(ruleId, data) {
  return request({
    url: `/admin/coupon/rule/${ruleId}`,
    method: 'put',
    data
  })
}

/**
 * 获取优惠券统计数据
 * @returns {Promise} - 返回统计数据
 */
export function getCouponStats() {
  return request({
    url: '/admin/coupon/stats',
    method: 'get'
  })
}

/**
 * 获取用户优惠券列表
 * @param {number} userId - 用户ID
 * @param {string} status - 优惠券状态
 * @returns {Promise} - 返回用户优惠券列表
 */
export function getUserCoupons(userId, status = 'all') {
  return request({
    url: `/admin/coupon/user/${userId}`,
    method: 'get',
    params: { status }
  })
} 