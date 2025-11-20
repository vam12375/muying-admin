/**
 * 图片预加载工具
 * 
 * 功能：
 * - 预加载关键图片
 * - 优先级队列
 * - 并发控制
 * 
 * Source: 性能优化 - 图片预加载
 * 
 */

interface PreloadOptions {
  priority?: 'high' | 'low';
  timeout?: number;
}

class ImagePreloader {
  private queue: Array<{ url: string; priority: 'high' | 'low' }> = [];
  private loading = new Set<string>();
  private loaded = new Set<string>();
  private maxConcurrent = 3;

  /**
   * 预加载单张图片
   */
  preload(url: string, options: PreloadOptions = {}): Promise<void> {
    const { priority = 'low', timeout = 10000 } = options;

    // 已加载或正在加载，跳过
    if (this.loaded.has(url) || this.loading.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // 添加到队列
      this.queue.push({ url, priority });
      
      // 按优先级排序
      this.queue.sort((a, b) => {
        if (a.priority === 'high' && b.priority === 'low') return -1;
        if (a.priority === 'low' && b.priority === 'high') return 1;
        return 0;
      });

      // 处理队列
      this.processQueue();

      // 设置超时
      const timer = setTimeout(() => {
        reject(new Error(`Image preload timeout: ${url}`));
      }, timeout);

      // 创建图片对象
      const img = new Image();
      
      img.onload = () => {
        clearTimeout(timer);
        this.loading.delete(url);
        this.loaded.add(url);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timer);
        this.loading.delete(url);
        reject(new Error(`Failed to preload image: ${url}`));
      };

      this.loading.add(url);
      img.src = url;
    });
  }

  /**
   * 批量预加载图片
   */
  preloadBatch(urls: string[], options: PreloadOptions = {}): Promise<void[]> {
    return Promise.all(urls.map(url => this.preload(url, options)));
  }

  /**
   * 处理队列
   */
  private processQueue(): void {
    while (this.loading.size < this.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        this.preload(item.url, { priority: item.priority });
      }
    }
  }

  /**
   * 清除缓存
   */
  clear(): void {
    this.queue = [];
    this.loading.clear();
    this.loaded.clear();
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      queued: this.queue.length,
      loading: this.loading.size,
      loaded: this.loaded.size,
    };
  }
}

// 导出单例
export const imagePreloader = new ImagePreloader();

/**
 * 预加载关键图片（首屏）
 */
export function preloadCriticalImages(urls: string[]): void {
  if (typeof window === 'undefined') return;
  
  imagePreloader.preloadBatch(urls, { priority: 'high' }).catch(err => {
    console.warn('[ImagePreloader] Failed to preload critical images:', err);
  });
}

/**
 * 预加载次要图片（后台）
 */
export function preloadSecondaryImages(urls: string[]): void {
  if (typeof window === 'undefined') return;
  
  // 延迟预加载，避免阻塞首屏
  setTimeout(() => {
    imagePreloader.preloadBatch(urls, { priority: 'low' }).catch(err => {
      console.warn('[ImagePreloader] Failed to preload secondary images:', err);
    });
  }, 2000);
}
