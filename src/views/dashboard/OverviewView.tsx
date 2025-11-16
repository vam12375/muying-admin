"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, Package, DollarSign } from 'lucide-react';
import { dashboardApi, ordersApi, productsApi } from '@/lib/api';
import { LineChart, BarChart, PieChart } from '@/components/charts';

// 统计卡片数据类型
interface StatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}

/**
 * 仪表盘概览视图
 * 展示系统关键数据和统计信息
 * 
 * Source: 参考 muying-admin-react/src/views/dashboard/index.tsx
 */
export function OverviewView() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载仪表盘数据
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 并行加载所有数据
      const [
        statsResponse, 
        ordersResponse, 
        productsResponse,
        monthlySalesResponse,
        categoriesResponse
      ] = await Promise.all([
        dashboardApi.getStats(),
        ordersApi.getList({ page: 1, pageSize: 5 }),
        productsApi.getList(1, 5),
        dashboardApi.getMonthlySales(6),
        dashboardApi.getProductCategories(),
      ]);

      // 处理统计数据
      if (statsResponse.success && statsResponse.data) {
        const data = statsResponse.data;
        const formattedStats: StatCard[] = [
          {
            id: 'users',
            label: '总用户数',
            value: data.userCount?.toString() || '0',
            change: '+12%',
            trend: 'up',
            icon: Users,
          },
          {
            id: 'orders',
            label: '总订单数',
            value: data.orderCount?.toString() || '0',
            change: '+8%',
            trend: 'up',
            icon: ShoppingCart,
          },
          {
            id: 'products',
            label: '商品总数',
            value: data.productCount?.toString() || '0',
            change: '+5%',
            trend: 'up',
            icon: Package,
          },
          {
            id: 'revenue',
            label: '总收入',
            value: `¥${data.totalIncome || '0'}`,
            change: '+15%',
            trend: 'up',
            icon: DollarSign,
          },
        ];
        setStats(formattedStats);
      }

      // 处理最近订单数据
      if (ordersResponse.success && ordersResponse.data) {
        const orders = ordersResponse.data.list || ordersResponse.data.records || [];
        setRecentOrders(orders.slice(0, 5));
      }

      // 处理热门商品数据
      if (productsResponse.success && productsResponse.data) {
        const products = productsResponse.data.records || [];
        setTopProducts(products.slice(0, 5));
      }

      // 处理月度销售数据
      if (monthlySalesResponse.success && monthlySalesResponse.data) {
        const { months, sales } = monthlySalesResponse.data;
        const chartData = months?.map((month: string, index: number) => ({
          month,
          sales: sales?.[index] || 0
        })) || [];
        setSalesTrend(chartData);
      }

      // 处理分类数据
      if (categoriesResponse.success && categoriesResponse.data) {
        const categories = categoriesResponse.data.slice(0, 7); // 取前7个分类
        setCategoryData(categories.map((cat: any) => ({
          category: cat.categoryName || cat.name || '未知',
          value: cat.productCount || cat.count || 0
        })));
      }

      // 模拟流量来源数据（后端暂无此接口）
      setTrafficData([
        { type: '直接访问', value: 35 },
        { type: '搜索引擎', value: 30 },
        { type: '社交媒体', value: 20 },
        { type: '外部链接', value: 10 },
        { type: '其他', value: 5 },
      ]);

    } catch (err: any) {
      console.error('加载仪表盘数据失败:', err);
      setError(err.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 格式化订单状态
  const formatOrderStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending_payment': '待支付',
      'pending_shipment': '待发货',
      'shipped': '已发货',
      'completed': '已完成',
      'cancelled': '已取消',
    };
    return statusMap[status] || status;
  };

  // 加载状态
  if (loading && stats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                  <Icon className={`h-6 w-6 ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <TrendingUp className="h-4 w-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1 dark:text-slate-100">{stat.value}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 dark:text-slate-100">销售趋势</h3>
          {salesTrend.length > 0 ? (
            <LineChart
              data={salesTrend}
              xKey="month"
              yKey="sales"
              color="#3182ff"
              height={280}
              formatter={(value) => `¥${value.toLocaleString()}`}
            />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-400">
              暂无数据
            </div>
          )}
        </div>

        {/* Traffic Source Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 dark:text-slate-100">流量来源</h3>
          {trafficData.length > 0 ? (
            <PieChart
              data={trafficData}
              nameKey="type"
              valueKey="value"
              height={280}
              innerRadius={60}
            />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-400">
              暂无数据
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution Chart */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 dark:text-slate-100">商品分类分布</h3>
          <BarChart
            data={categoryData}
            xKey="category"
            yKey="value"
            height={280}
            horizontal={true}
          />
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 dark:text-slate-100">最近订单</h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.orderId} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors dark:hover:bg-slate-700">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{order.orderNo || `订单 #${order.orderId}`}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{order.userName || '用户'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">¥{order.actualAmount || order.totalAmount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      order.status === 'shipped' || order.status === 'pending_shipment' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                      order.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {formatOrderStatus(order.status)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">暂无订单数据</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 dark:text-slate-100">热门商品</h3>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div key={product.productId} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors dark:hover:bg-slate-700">
                  <img 
                    src={product.productImg ? (product.productImg.startsWith('http') ? product.productImg : `http://localhost:5173/products/${product.productImg}`) : '/placeholder-product.png'} 
                    alt={product.productName} 
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-product.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate dark:text-slate-100">{product.productName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.sales || 0} 销量</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">¥{product.price}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.stock} 库存</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">暂无商品数据</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
