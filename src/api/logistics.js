import request from '@/utils/request'

/**
 * 获取物流公司列表
 * @param {Object} params 查询参数
 * @returns {Promise} 请求Promise
 */
export function getLogisticsCompanyList(params) {
  return request({
    url: '/api/admin/logistics/companies',
    method: 'get',
    params
  })
}

/**
 * 获取所有启用的物流公司
 * @returns {Promise} 请求Promise
 */
export function getEnabledLogisticsCompanies() {
  return request({
    url: '/api/admin/logistics/companies/enabled',
    method: 'get'
  })
}

/**
 * 获取物流公司详情
 * @param {Number} id 物流公司ID
 * @returns {Promise} 请求Promise
 */
export function getLogisticsCompanyDetail(id) {
  return request({
    url: `/api/admin/logistics/companies/${id}`,
    method: 'get'
  })
}

/**
 * 添加物流公司
 * @param {Object} data 物流公司信息
 * @returns {Promise} 请求Promise
 */
export function addLogisticsCompany(data) {
  return request({
    url: '/api/admin/logistics/companies',
    method: 'post',
    data
  })
}

/**
 * 更新物流公司
 * @param {Number} id 物流公司ID
 * @param {Object} data 物流公司信息
 * @returns {Promise} 请求Promise
 */
export function updateLogisticsCompany(id, data) {
  return request({
    url: `/api/admin/logistics/companies/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除物流公司
 * @param {Number} id 物流公司ID
 * @returns {Promise} 请求Promise
 */
export function deleteLogisticsCompany(id) {
  return request({
    url: `/api/admin/logistics/companies/${id}`,
    method: 'delete'
  })
}

/**
 * 获取物流列表
 * @param {Object} params 查询参数
 * @returns {Promise} 请求Promise
 */
export function getLogisticsList(params) {
  return request({
    url: '/api/admin/logistics',
    method: 'get',
    params
  })
}

/**
 * 获取物流详情
 * @param {Number} id 物流ID
 * @returns {Promise} 请求Promise
 */
export function getLogisticsDetail(id) {
  return request({
    url: `/api/admin/logistics/${id}`,
    method: 'get'
  })
}

/**
 * 根据订单ID获取物流信息
 * @param {Number} orderId 订单ID
 * @returns {Promise} 请求Promise
 */
export function getLogisticsByOrderId(orderId) {
  return request({
    url: `/api/admin/logistics/order/${orderId}`,
    method: 'get'
  })
}

/**
 * 更新物流状态
 * @param {Number} id 物流ID
 * @param {String} status 物流状态
 * @param {String} remark 备注
 * @returns {Promise} 请求Promise
 */
export function updateLogisticsStatus(id, status, remark) {
  return request({
    url: `/api/admin/logistics/${id}/status`,
    method: 'put',
    params: {
      status,
      remark
    }
  })
}

/**
 * 获取物流轨迹
 * @param {Number} logisticsId 物流ID
 * @returns {Promise} 请求Promise
 */
export function getLogisticsTracks(logisticsId) {
  return request({
    url: `/api/admin/logistics/${logisticsId}/tracks`,
    method: 'get'
  })
}

/**
 * 添加物流轨迹
 * @param {Number} logisticsId 物流ID
 * @param {Object} data 轨迹信息
 * @returns {Promise} 请求Promise
 */
export function addLogisticsTrack(logisticsId, data) {
  return request({
    url: `/api/admin/logistics/${logisticsId}/tracks`,
    method: 'post',
    data
  })
}

/**
 * 生成物流单号
 * @param {String} companyCode 物流公司代码
 * @returns {Promise} 请求Promise
 */
export function generateTrackingNo(companyCode) {
  return request({
    url: '/api/admin/logistics/generateTrackingNo',
    method: 'get',
    params: {
      companyCode
    }
  })
} 