"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

/**
 * 订单管理视图
 * 展示订单列表、搜索、状态管理等功能
 * 
 * Source: 参考 muying-admin-react/src/views/order
 */
export function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>(null);

  // 加载订单列表
  useEffect(() => {
    loadOrders();
    loadStats();
  }, [currentPage, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersApi.getList(currentPage, pageSize, statusFilter === 'all' ? undefined : statusFilter);
      
      console.log('[Orders] API Response:', response);
      
      if (response.success && response.data) {
        const data = response.data;
        // 后端返回格式: { list: [], total: 0 }
        const orderList = data.list || data.records || [];
        console.log('[Orders] Order list:', orderList);
        setOrders(orderList);
        setTotal(data.total || 0);
      }
    } catch (err: any) {
      console.error('加载订单列表失败:', err);
      setError(err.message || '加载失败');
      // 即使失败也设置空数组，避免显示旧数据
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await ordersApi.getStatistics();
      console.log('[Orders] Statistics Response:', response);
      
      if (response.success && response.data) {
        // 后端返回格式可能是: { pending_payment: 0, pending_shipment: 0, ... }
        const data = response.data;
        setStats({
          pendingPayment: data.pending_payment || data.pendingPayment || 0,
          pendingShipment: data.pending_shipment || data.pendingShipment || 0,
          shipped: data.shipped || 0,
          completed: data.completed || 0
        });
      }
    } catch (err) {
      console.error('加载订单统计失败:', err);
      // 统计数据加载失败不影响主要功能，使用默认值
      setStats({
        pendingPayment: 0,
        pendingShipment: 0,
        shipped: 0,
        completed: 0
      });
    }
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadOrders();
  };

  // 订单状态映射
  const statusMap: Record<string, { label: string; color: string; icon: any }> = {
    'pending_payment': { label: '待支付', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: ShoppingCart },
    'pending_shipment': { label: '待发货', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: ShoppingCart },
    'shipped': { label: '已发货', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400', icon: Truck },
    'completed': { label: '已完成', color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
    'cancelled': { label: '已取消', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
  };

  // 格式化订单状态
  const formatStatus = (status: string) => {
    return statusMap[status]?.label || status;
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    return statusMap[status]?.color || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  // 加载状态
  if (loading && orders.length === 0 && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 错误提示 */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={() => {
                setError(null);
                loadOrders();
                loadStats();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
          <ShoppingCart className="mr-2 text-pink-500" />
          订单管理
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          共 {total} 个订单
        </p>
      </div>

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">待支付</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
              {stats.pendingPayment || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">待发货</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {stats.pendingShipment || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">已发货</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {stats.shipped || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">已完成</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {stats.completed || 0}
            </p>
          </div>
        </div>
      )}

      {/* 搜索和筛选栏 */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <form onSubmit={handleSearch} className="flex-1 flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索订单号、用户名..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              搜索
            </button>
          </form>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
          >
            <option value="all">全部状态</option>
            <option value="pending_payment">待支付</option>
            <option value="pending_shipment">待发货</option>
            <option value="shipped">已发货</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  订单信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  用户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <motion.tr
                    key={order.orderId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {order.orderNo}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          ID: {order.orderId}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {order.userName || '未知用户'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {formatPrice(order.actualAmount || order.totalAmount)}
                        </p>
                        {order.actualAmount !== order.totalAmount && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-through">
                            {formatPrice(order.totalAmount)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(order.createTime, 'datetime')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                          title="查看详情"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status === 'pending_shipment' && (
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:text-green-400 dark:hover:bg-green-900/20"
                            title="发货"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400">暂无订单数据</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {total > pageSize && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, total)} 条，共 {total} 条
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:hover:bg-slate-700"
              >
                上一页
              </button>
              <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
                第 {currentPage} / {Math.ceil(total / pageSize)} 页
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:hover:bg-slate-700"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
