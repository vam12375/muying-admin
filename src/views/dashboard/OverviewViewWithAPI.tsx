"use client";

/**
 * 仪表盘概览视图 - 集成后端 API
 * 
 * 这是一个完整的示例，展示如何将后端数据集成到仪表盘中
 * 可以用这个文件替换 OverviewView.tsx
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

interface DashboardStats {
  userCount: number;
  productCount: number;
  orderCount: number;
  totalIncome: number;
}

interface StatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}

export function OverviewViewWithAPI() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getStats();

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || '获取数据失败');
      }
    } catch (err) {
      console.error('获取仪表盘数据失败:', err);
      setError('网络错误，请检查后端服务');
    } finally {
      setLoading(false);
    }
  };

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">加载数据中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-center max-w-md">
          <div className="text-red-600 dark:text-red-400 mb-4 text-lg font-medium">
            {error}
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            重新加载
          </button>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            提示：请确保后端服务已启动在 http://localhost:8080
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12 text-slate-500">暂无数据</div>;
  }

  // 构建统计卡片数据
  const statCards: StatCard[] = [
    {
      id: 'revenue',
      label: '总收入',
      value: `¥${stats.totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`,
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      id: 'orders',
      label: '订单数',
      value: stats.orderCount.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      id: 'products',
      label: '商品数',
      value: stats.productCount.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: Package,
    },
    {
      id: 'customers',
      label: '用户数',
      value: stats.userCount.toString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                stat.id === 'revenue' ? 'bg-green-100 dark:bg-green-900/20' :
                stat.id === 'orders' ? 'bg-blue-100 dark:bg-blue-900/20' :
                stat.id === 'products' ? 'bg-purple-100 dark:bg-purple-900/20' :
                'bg-pink-100 dark:bg-pink-900/20'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.id === 'revenue' ? 'text-green-600 dark:text-green-400' :
                  stat.id === 'orders' ? 'text-blue-600 dark:text-blue-400' :
                  stat.id === 'products' ? 'text-purple-600 dark:text-purple-400' :
                  'text-pink-600 dark:text-pink-400'
                }`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 提示信息 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
      >
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong>数据来源：</strong>后端 API - /admin/dashboard/stats
        </p>
        <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">
          数据已成功从后端加载。您可以在其他视图中使用相同的方式集成 API。
        </p>
      </motion.div>

      {/* 刷新按钮 */}
      <div className="flex justify-end">
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors text-sm font-medium"
        >
          刷新数据
        </button>
      </div>
    </div>
  );
}

/**
 * 使用说明：
 * 
 * 1. 将此文件重命名为 OverviewView.tsx 或在 AdminDashboard.tsx 中导入
 * 2. 确保后端服务已启动
 * 3. 数据将自动从后端加载
 * 4. 可以参考这个模式更新其他视图组件
 */
