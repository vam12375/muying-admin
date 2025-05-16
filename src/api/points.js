import request from '@/utils/request'

/**
 * 获取积分历史记录列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回积分历史记录列表
 */
export function getPointsHistoryList(query) {
  return request({
    url: '/admin/points/history/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取积分操作日志列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回积分操作日志列表
 */
export function getPointsOperationLogs(query) {
  return request({
    url: '/admin/points/operation/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取用户积分信息
 * @param {Object} query - 查询参数，包含page、size、userId、username等
 * @returns {Promise} - 返回用户积分列表
 */
export function getUserPoints(query) {
  return request({
    url: '/admin/points/user/list',
    method: 'get',
    params: query
  })
}

/**
 * 管理员调整用户积分
 * @param {number} userId - 用户ID
 * @param {number} points - 积分值，正数为增加，负数为减少
 * @param {string} description - 描述
 * @returns {Promise} - 返回调整结果
 */
export function adjustUserPoints(userId, points, description) {
  return request({
    url: `/admin/points/user/${userId}/adjust`,
    method: 'post',
    params: {
      points,
      description
    }
  })
}

/**
 * 获取积分规则列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回积分规则列表
 */
export function getPointsRuleList(query) {
  return request({
    url: '/admin/points/rule/list',
    method: 'get',
    params: query
  })
}

/**
 * 创建积分规则
 * @param {Object} data - 规则数据
 * @returns {Promise} - 返回创建结果
 */
export function createPointsRule(data) {
  return request({
    url: '/admin/points/rule',
    method: 'post',
    data
  })
}

/**
 * 更新积分规则
 * @param {number} id - 规则ID
 * @param {Object} data - 规则数据
 * @returns {Promise} - 返回更新结果
 */
export function updatePointsRule(id, data) {
  return request({
    url: `/admin/points/rule/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除积分规则
 * @param {number} id - 规则ID
 * @returns {Promise} - 返回删除结果
 */
export function deletePointsRule(id) {
  return request({
    url: `/admin/points/rule/${id}`,
    method: 'delete'
  })
}

/**
 * 获取积分商品列表
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回积分商品列表
 */
export function getPointsProductList(query) {
  return request({
    url: '/admin/points/product/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取单个积分商品详情
 * @param {number} id - 商品ID
 * @returns {Promise} - 返回商品详情
 */
export function getPointsProduct(id) {
  return request({
    url: `/admin/points/product/${id}`,
    method: 'get'
  })
}

/**
 * 创建积分商品
 * @param {Object} data - 商品数据
 * @returns {Promise} - 返回创建结果
 */
export function createPointsProduct(data) {
  return request({
    url: '/admin/points/product',
    method: 'post',
    data
  })
}

/**
 * 更新积分商品
 * @param {number} id - 商品ID
 * @param {Object} data - 商品数据
 * @returns {Promise} - 返回更新结果
 */
export function updatePointsProduct(id, data) {
  return request({
    url: `/admin/points/product/${id}`,
    method: 'put',
    data
  })
}

/**
 * 更新积分商品状态
 * @param {number} id - 商品ID
 * @param {number} status - 状态值 0:下架 1:上架
 * @returns {Promise} - 返回更新结果
 */
export function updatePointsProductStatus(id, status) {
  return request({
    url: `/admin/points/product/${id}/status`,
    method: 'put',
    params: { status }
  })
}

/**
 * 删除积分商品
 * @param {number} id - 商品ID
 * @returns {Promise} - 返回删除结果
 */
export function deletePointsProduct(id) {
  return request({
    url: `/admin/points/product/${id}`,
    method: 'delete'
  })
}

/**
 * 获取积分兑换记录
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回积分兑换记录
 */
export function getPointsExchangeList(query) {
  return request({
    url: '/admin/points/exchange/list',
    method: 'get',
    params: query
  })
}

/**
 * 更新积分兑换状态
 * @param {number} id - 兑换记录ID
 * @param {string} status - 状态
 * @returns {Promise} - 返回更新结果
 */
export function updateExchangeStatus(id, status) {
  return request({
    url: `/admin/points/exchange/${id}/status`,
    method: 'put',
    params: { status }
  })
}

/**
 * 获取积分统计数据
 * @param {Object} query - 查询参数
 * @returns {Promise} - 返回统计数据
 */
export function getPointsStats(query) {
  return request({
    url: '/admin/points/stats',
    method: 'get',
    params: query
  })
}

/**
 * 获取单个用户的积分详情
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回用户积分详情
 */
export function getUserPointsDetail(userId) {
  return request({
    url: `/admin/points/user/${userId}`,
    method: 'get'
  })
} 