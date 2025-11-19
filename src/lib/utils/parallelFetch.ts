/**
 * API并行调用工具
 * 
 * 功能：
 * - 并行执行多个API请求
 * - 自动错误处理
 * - 超时控制
 * 
 * Source: 性能优化 - 并行请求
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

interface ParallelFetchOptions {
  timeout?: number; // 超时时间（毫秒）
  ignoreErrors?: boolean; // 是否忽略单个请求的错误
}

/**
 * 并行执行多个fetch请求
 */
export async function parallelFetch<T extends Record<string, any>>(
  requests: Record<keyof T, () => Promise<any>>,
  options: ParallelFetchOptions = {}
): Promise<T> {
  const { timeout = 10000, ignoreErrors = false } = options;

  const keys = Object.keys(requests) as Array<keyof T>;
  
  // 创建带超时的Promise
  const createTimeoutPromise = (promise: Promise<any>, key: string) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Request timeout: ${key}`)), timeout)
      ),
    ]);
  };

  // 并行执行所有请求
  const promises = keys.map(async (key) => {
    try {
      const result = await createTimeoutPromise(requests[key](), String(key));
      return { key, result, error: null };
    } catch (error) {
      if (ignoreErrors) {
        console.warn(`[ParallelFetch] Request failed: ${String(key)}`, error);
        return { key, result: null, error };
      }
      throw error;
    }
  });

  const results = await Promise.all(promises);

  // 组装结果
  const data = {} as T;
  results.forEach(({ key, result }) => {
    data[key] = result;
  });

  return data;
}

/**
 * 批量预加载数据
 */
export async function prefetchData<T extends Record<string, any>>(
  requests: Record<keyof T, () => Promise<any>>
): Promise<void> {
  try {
    await parallelFetch(requests, { ignoreErrors: true });
    console.log('[ParallelFetch] Prefetch completed');
  } catch (error) {
    console.warn('[ParallelFetch] Prefetch failed:', error);
  }
}

/**
 * 示例用法：
 * 
 * const data = await parallelFetch({
 *   users: () => fetchApi('/admin/users'),
 *   products: () => fetchApi('/admin/products'),
 *   orders: () => fetchApi('/admin/orders'),
 * });
 * 
 * // 访问结果
 * console.log(data.users, data.products, data.orders);
 */
