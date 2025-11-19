/**
 * 资源预加载组件
 * 
 * 功能：
 * - 预加载关键资源
 * - 优化首屏加载
 * - 智能预测用户行为
 * 
 * Source: 性能优化 - 资源预加载
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useEffect } from 'react';
import { prefetchData } from '@/lib/utils/parallelFetch';
import { preloadCriticalImages } from '@/lib/utils/imagePreloader';

interface ResourcePreloaderProps {
  preloadApis?: Array<() => Promise<any>>;
  preloadImages?: string[];
}

export function ResourcePreloader({
  preloadApis = [],
  preloadImages = [],
}: ResourcePreloaderProps) {
  useEffect(() => {
    // 延迟预加载，避免阻塞首屏
    const timer = setTimeout(() => {
      // 预加载API数据
      if (preloadApis.length > 0) {
        const apiRequests = preloadApis.reduce((acc, fn, index) => {
          acc[`api_${index}`] = fn;
          return acc;
        }, {} as Record<string, () => Promise<any>>);

        prefetchData(apiRequests).catch(err => {
          console.warn('[ResourcePreloader] API预加载失败:', err);
        });
      }

      // 预加载图片
      if (preloadImages.length > 0) {
        preloadCriticalImages(preloadImages);
      }
    }, 1000); // 1秒后开始预加载

    return () => clearTimeout(timer);
  }, []);

  return null; // 不渲染任何内容
}

/**
 * 使用示例：
 * 
 * <ResourcePreloader
 *   preloadApis={[
 *     () => cachedFetch('/admin/users'),
 *     () => cachedFetch('/admin/products'),
 *   ]}
 *   preloadImages={[
 *     '/products/product1.jpg',
 *     '/products/product2.jpg',
 *   ]}
 * />
 */
