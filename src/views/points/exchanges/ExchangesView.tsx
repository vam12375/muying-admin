'use client';

/**
 * 兑换记录管理视图
 * Exchange Records Management View
 * 
 * Source: 基于 muying-admin-react points/exchange.tsx 改造
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Eye, Send, CheckCircle, XCircle, ShoppingCart, RefreshCw
} from 'lucide-react';
import { showSuccess, showError } from '@/lib/utils/toast';
import { getExchangeList, getExchangeStats, updateExchangeStatus, shipExchange } from '@/lib/api/points';
import type { PointsExchange, ExchangeStats } from '@/types/points';
import { ShipExchangeModal } from '../ShipExchangeModal';
import { ExchangeDetailModal } from '../ExchangeDetailModal';

// 使用后端返回的类型
type ExchangeRecord = PointsExchange;

export function ExchangesView() {
  const [loading, setLoading] = useState(false);
  const [exchanges, setExchanges] = useState<ExchangeRecord[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 统计数据
  const [stats, setStats] = useState<ExchangeStats>({
    totalCount: 0,
    totalPoints: 0,
    pendingCount: 0,
    processingCount: 0,
    shippedCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    todayCount: 0,
    todayPoints: 0,
  });

  // 模态框状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<ExchangeRecord | null>(null);

  // 加载数据
  useEffect(() => {
    loadExchanges();
    loadStats();
  }, [currentPage, keyword, selectedStatus]);

  const loadExchanges = async () => {
    try {
      setLoading(true);
      const response = await getExchangeList({
        page: currentPage,
        size: pageSize,
        orderNo: keyword || undefined,
        status: selectedStatus || undefined,
      });
      
      if (response.success && response.data) {
        setExchanges(response.data.records || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载兑换记录失败:', error);
      showError('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getExchangeStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  // 搜索处理
  const handleSearch = () => {
    setCurrentPage(1);
    loadExchanges();
  };

  // 重置筛选
  const handleReset = () => {
    setKeyword('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'processing': 'bg-blue-100 text-blue-700',
      'shipped': 'bg-purple-100 text-purple-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'pending': '待处理',
      'processing': '处理中',
      'shipped': '已发货',
      'completed': '已完成',
      'cancelled': '已取消',
    };
    return texts[status] || status;
  };

  // 查看详情
  const handleViewDetail = (exchange: ExchangeRecord) => {
    setSelectedExchange(exchange);
    setDetailModalOpen(true);
  };

  // 发货
  const handleShip = (exchange: ExchangeRecord) => {
    setSelectedExchange(exchange);
    setShipModalOpen(true);
  };

  // 完成订单
  const handleComplete = async (exchange: ExchangeRecord) => {
    if (!confirm('确认完成此兑换订单吗？')) return;

    try {
      await updateExchangeStatus(exchange.id, 'completed');
      showSuccess('订单已完成');
      loadExchanges();
      loadStats();
    } catch (error) {
      console.error('完成订单失败:', error);
      showError('操作失败');
    }
  };

  // 取消订单
  const handleCancel = async (exchange: ExchangeRecord) => {
    const reason = prompt('请输入取消原因：');
    if (!reason) return;

    try {
      await updateExchangeStatus(exchange.id, 'cancelled');
      showSuccess('订单已取消');
      loadExchanges();
      loadStats();
    } catch (error) {
      console.error('取消订单失败:', error);
      showError('操作失败');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">兑换记录管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理积分兑换订单</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总兑换次数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">总消耗积分</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.totalPoints}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">待处理订单</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">今日兑换</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.todayCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 搜索和筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号/用户名"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 状态筛选 */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="shipped">已发货</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              搜索
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              重置
            </button>
          </div>
        </div>
      </motion.div>

      {/* 兑换记录列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : exchanges.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-4" />
            <p>暂无兑换记录数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">兑换时间</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {exchanges.map((exchange, index) => (
                  <motion.tr
                    key={exchange.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exchange.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{exchange.username}</p>
                        <p className="text-xs text-gray-500">ID: {exchange.userId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{exchange.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{exchange.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exchange.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(exchange.status)}`}>
                        {getStatusText(exchange.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exchange.createTime?.substring(0, 16)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewDetail(exchange)}
                          className="text-blue-600 hover:text-blue-800 p-1" 
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(exchange.status === 'pending' || exchange.status === 'processing') && (
                          <button 
                            onClick={() => handleShip(exchange)}
                            className="text-purple-600 hover:text-purple-800 p-1" 
                            title="发货"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {exchange.status === 'shipped' && (
                          <button 
                            onClick={() => handleComplete(exchange)}
                            className="text-green-600 hover:text-green-800 p-1" 
                            title="完成"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(exchange.status === 'pending' || exchange.status === 'processing') && (
                          <button 
                            onClick={() => handleCancel(exchange)}
                            className="text-red-600 hover:text-red-800 p-1" 
                            title="取消"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {!loading && exchanges.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              共 {total} 条记录，第 {currentPage} / {Math.ceil(total / pageSize)} 页
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* 查看详情模态框 */}
      <ExchangeDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        exchange={selectedExchange}
      />

      {/* 发货模态框 */}
      <ShipExchangeModal
        open={shipModalOpen}
        onClose={() => setShipModalOpen(false)}
        exchange={selectedExchange}
        onSuccess={() => {
          loadExchanges();
          loadStats();
        }}
      />
    </div>
  );
}
