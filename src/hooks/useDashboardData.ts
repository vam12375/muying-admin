/**
 * Dashboard数据加载Hook
 * 
 * 功能：
 * - 并行加载所有数据
 * - 自动缓存
 * - 错误处理
 * 
 * Source: 性能优化 - Dashboard数据加载
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { useState, useEffect } from 'react';
import { parallelFetch } from '@/lib/utils/parallelFetch';
import { cachedFetch } from '@/lib/api/cachedFetch';

interface DashboardData {
  stats: any;
  recentOrders: any[];
  topProducts: any[];
  salesChart: any[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    recentOrders: [],
    topProducts: [],
    salesChart: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // 并行加载所有数据
      const results = await parallelFetch(
        {
          stats: () => cachedFetch('/admin/dashboard/stats', {
            cache: true,
            cacheTTL: 2 * 60 * 1000, // 2分钟
          }),
          recentOrders: () => cachedFetch('/admin/orders?page=1&size=5', {
            cache: true,
            cacheTTL: 1 * 60 * 1000, // 1分钟
          }),
          topProducts: () => cachedFetch('/admin/products/top?limit=5', {
            cache: true,
            cacheTTL: 5 * 60 * 1000, // 5分钟
          }),
          salesChart: () => cachedFetch('/admin/dashboard/sales-chart', {
            cache: true,
            cacheTTL: 5 * 60 * 1000, // 5分钟
          }),
        },
        {
          timeout: 8000,
          ignoreErrors: true, // 允许部分数据加载失败
        }
      );

      setData({
        stats: results.stats?.data || null,
        recentOrders: results.recentOrders?.data?.records || [],
        topProducts: results.topProducts?.data || [],
        salesChart: results.salesChart?.data || [],
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('[Dashboard] 加载数据失败:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message || '加载失败',
      }));
    }
  };

  const refresh = () => {
    loadDashboardData();
  };

  return { ...data, refresh };
}
