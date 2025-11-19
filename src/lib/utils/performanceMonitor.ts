/**
 * 性能监控工具
 * 
 * 功能：
 * - 监控页面加载性能
 * - 跟踪API请求时间
 * - 记录缓存命中率
 * 
 * Source: 性能优化 - 监控工具
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

interface ApiMetrics {
  url: string;
  duration: number;
  cached: boolean;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private apiMetrics: ApiMetrics[] = [];
  private cacheHits = 0;
  private cacheMisses = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initWebVitals();
    }
  }

  /**
   * 初始化Web Vitals监控
   */
  private initWebVitals(): void {
    // 监控 LCP
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
          console.log('[Performance] LCP:', this.metrics.lcp, 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('[Performance] LCP observer failed:', e);
      }

      // 监控 FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            console.log('[Performance] FID:', this.metrics.fid, 'ms');
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('[Performance] FID observer failed:', e);
      }

      // 监控 CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.cls = clsValue;
            }
          });
          console.log('[Performance] CLS:', this.metrics.cls);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('[Performance] CLS observer failed:', e);
      }
    }

    // 监控页面加载
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as any;
        if (perfData) {
          this.metrics.fcp = perfData.responseStart - perfData.fetchStart;
          this.metrics.ttfb = perfData.responseStart - perfData.requestStart;
          console.log('[Performance] FCP:', this.metrics.fcp, 'ms');
          console.log('[Performance] TTFB:', this.metrics.ttfb, 'ms');
        }
      }, 0);
    });
  }

  /**
   * 记录API请求
   */
  recordApiCall(url: string, duration: number, cached: boolean): void {
    this.apiMetrics.push({
      url,
      duration,
      cached,
      timestamp: Date.now(),
    });

    if (cached) {
      this.cacheHits++;
    } else {
      this.cacheMisses++;
    }

    // 只保留最近100条记录
    if (this.apiMetrics.length > 100) {
      this.apiMetrics.shift();
    }
  }

  /**
   * 获取性能报告
   */
  getReport() {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const cacheHitRate = totalRequests > 0 
      ? ((this.cacheHits / totalRequests) * 100).toFixed(2) 
      : '0';

    const avgApiDuration = this.apiMetrics.length > 0
      ? (this.apiMetrics.reduce((sum, m) => sum + m.duration, 0) / this.apiMetrics.length).toFixed(2)
      : '0';

    return {
      webVitals: this.metrics,
      api: {
        totalRequests,
        cacheHits: this.cacheHits,
        cacheMisses: this.cacheMisses,
        cacheHitRate: `${cacheHitRate}%`,
        avgDuration: `${avgApiDuration}ms`,
      },
      recentCalls: this.apiMetrics.slice(-10),
    };
  }

  /**
   * 打印性能报告
   */
  printReport(): void {
    const report = this.getReport();
    console.group('📊 Performance Report');
    console.log('Web Vitals:', report.webVitals);
    console.log('API Metrics:', report.api);
    console.log('Recent API Calls:', report.recentCalls);
    console.groupEnd();
  }

  /**
   * 清除数据
   */
  clear(): void {
    this.metrics = {};
    this.apiMetrics = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor();

// 开发环境下，每30秒打印一次报告
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setInterval(() => {
    performanceMonitor.printReport();
  }, 30000);
}
