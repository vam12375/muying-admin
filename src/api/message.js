import request from '@/utils/request'

/**
 * 获取消息列表
 * @param {Object} params 查询参数 {type, isRead, page, size, keyword}
 * @returns {Promise}
 */
export function getMessageList(params) {
  return request({
    url: '/admin/message/list',
    method: 'get',
    params
  })
}

/**
 * 获取催发货消息列表
 * @param {Object} params 查询参数 {page, size}
 * @returns {Promise}
 */
export function getShippingReminderMessages(params) {
  return request({
    url: '/admin/message/shipping-reminder',
    method: 'get',
    params
  })
}

/**
 * 创建系统消息
 * @param {Object} data {title, content, extra}
 * @returns {Promise}
 */
export function createSystemMessage(data) {
  return request({
    url: '/admin/message/system',
    method: 'post',
    params: data
  })
}

/**
 * 获取未读消息数量
 * @returns {Promise}
 */
export function getUnreadCount() {
  return request({
    url: '/admin/message/unread/count',
    method: 'get'
  })
}

/**
 * 标记消息为已读
 * @param {string} id 消息ID
 * @returns {Promise}
 */
export function markMessageRead(id) {
  return request({
    url: '/admin/message/read',
    method: 'put',
    params: { id }
  })
}

/**
 * 标记所有消息为已读
 * @returns {Promise}
 */
export function markAllRead() {
  return request({
    url: '/admin/message/readAll',
    method: 'put'
  })
}

/**
 * 删除消息
 * @param {string} id 消息ID
 * @returns {Promise}
 */
export function deleteMessage(id) {
  return request({
    url: `/admin/message/${id}`,
    method: 'delete'
  })
} 