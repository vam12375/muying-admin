import request from '@/utils/request';

/**
 * 获取Redis服务器信息
 * @returns {Promise} Redis服务器信息
 */
export function getRedisInfo() {
  return request({
    url: '/admin/system/redis/info',
    method: 'get'
  });
}

/**
 * 获取Redis缓存键列表
 * @param {Object} params 查询参数
 * @param {string} params.pattern 键名匹配模式
 * @param {number} params.page 页码
 * @param {number} params.size 每页条数
 * @returns {Promise} Redis缓存键列表
 */
export function getRedisCacheKeys(params) {
  return request({
    url: '/admin/system/redis/keys',
    method: 'get',
    params
  });
}

/**
 * 获取指定键的值
 * @param {string} key 缓存键名
 * @returns {Promise} 键值数据
 */
export function getRedisCacheValue(key) {
  return request({
    url: '/admin/system/redis/key',
    method: 'get',
    params: { key }
  });
}

/**
 * 删除指定的缓存键
 * @param {string|Array} keys 缓存键名或键名数组
 * @returns {Promise} 操作结果
 */
export function deleteRedisCache(keys) {
  return request({
    url: '/admin/system/redis/delete',
    method: 'post',
    data: { keys: Array.isArray(keys) ? keys : [keys] }
  });
}

/**
 * 清空所有缓存
 * @returns {Promise} 操作结果
 */
export function clearAllRedisCache() {
  return request({
    url: '/admin/system/redis/clear',
    method: 'post'
  });
}

/**
 * 刷新Redis统计信息
 * @returns {Promise} 最新的Redis统计信息
 */
export function refreshRedisStats() {
  return request({
    url: '/admin/system/redis/refresh',
    method: 'post'
  });
} 