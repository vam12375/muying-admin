/**
 * 带缓存的API请求工具
 * 
 * 功能：
 * - 自动缓存GET请求
 * - POST/PUT/DELETE自动清除相关缓存
 * - 支持缓存配置
 * - 集成性能监控
 * 
 * Source: 性能优化 - API请求缓存
 * 
 */

import { apiCache } from '../utils/apiCache';
import { performanceMonitor } from '../utils/performanceMonitor';

interface FetchOptions extends RequestInit {
  cache?: boolean; // 是否使用缓存
  cacheTTL?: number; // 缓存时间（毫秒）
  cacheKey?: string; // 自定义缓存键
}

/**
 * 带缓存的fetch封装
 */
export async function cachedFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const startTime = performance.now();
  const {
    cache = true,
    cacheTTL,
    cacheKey,
    method = 'GET',
    ...fetchOptions
  } = options;

  const isGetRequest = method.toUpperCase() === 'GET';

  // GET请求且启用缓存时，先查缓存
  if (isGetRequest && cache) {
    const cached = apiCache.get<T>(cacheKey || url);
    if (cached) {
      const duration = performance.now() - startTime;
      performanceMonitor.recordApiCall(url, duration, true);
      console.log('[CachedFetch] 缓存命中:', url, `${duration.toFixed(2)}ms`);
      return cached;
    }
  }

  // 发起请求
  const response = await fetch(url, {
    ...fetchOptions,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    console.error(`[CachedFetch] HTTP ${response.status} for ${url}:`, errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const duration = performance.now() - startTime;

  // GET请求成功后缓存结果
  if (isGetRequest && cache) {
    apiCache.set(cacheKey || url, data, undefined, cacheTTL);
    performanceMonitor.recordApiCall(url, duration, false);
    console.log('[CachedFetch] 已缓存:', url, `${duration.toFixed(2)}ms`);
  } else {
    performanceMonitor.recordApiCall(url, duration, false);
  }

  // 非GET请求成功后，清除相关缓存
  if (!isGetRequest) {
    const resourcePattern = url.split('?')[0].split('/').slice(-2).join('/');
    apiCache.clearMatching(resourcePattern);
    console.log('[CachedFetch] 已清除相关缓存:', resourcePattern);
  }

  return data;
}

/**
 * 预加载数据（提前缓存）
 */
export async function prefetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<void> {
  try {
    await cachedFetch<T>(url, options);
  } catch (error) {
    console.warn('[CachedFetch] 预加载失败:', url, error);
  }
}

/**
 * 清除指定URL的缓存
 */
export function clearCache(url: string): void {
  apiCache.delete(url);
}

/**
 * 清除所有缓存
 */
export function clearAllCache(): void {
  apiCache.clear();
}
