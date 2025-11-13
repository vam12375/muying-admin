/**
 * Redis管理API
 * Redis Management API
 * 
 * Source: 基于后端 SystemController
 */

import { fetchApi, ApiResponse } from './index';
import type { 
  RedisKeyData, 
  RedisInfoData, 
  RedisValueData, 
  RedisListParams,
  SetRedisValueParams 
} from '@/types/redis';

export const redisApi = {
  /**
   * 获取Redis服务器信息
   */
  getInfo: async () => {
    return fetchApi<RedisInfoData>('/admin/system/redis/info');
  },

  /**
   * 获取Redis键列表（分页）
   */
  getKeys: async (params: RedisListParams) => {
    return fetchApi<{
      items: RedisKeyData[];
      total: number;
      page: number;
      size: number;
    }>('/admin/system/redis/keys', { params });
  },

  /**
   * 获取Redis键值
   */
  getValue: async (key: string) => {
    return fetchApi<RedisValueData>('/admin/system/redis/key', {
      params: { key }
    });
  },

  /**
   * 设置Redis键值
   */
  setValue: async (data: SetRedisValueParams) => {
    return fetchApi<void>('/admin/system/redis/set', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * 删除Redis键
   */
  deleteKey: async (keys: string | string[]) => {
    return fetchApi<void>('/admin/system/redis/delete', {
      method: 'POST',
      body: JSON.stringify({ 
        keys: Array.isArray(keys) ? keys : [keys] 
      })
    });
  },

  /**
   * 清空Redis数据库
   */
  clearDb: async () => {
    return fetchApi<void>('/admin/system/redis/clear', {
      method: 'POST'
    });
  }
};
