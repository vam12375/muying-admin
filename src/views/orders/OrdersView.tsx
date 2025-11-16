/**
 * 订单管理视图
 * Source: 基于旧版本 order/list.tsx，适配 Next.js + Tailwind CSS
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye,
  Send,
  X,
  MoreVertical,
  ShoppingCart,
  DollarSign,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { OrderStatCard } from '@/components/orders/OrderStatCard';
import { OrderStatusTag } from '@/components/orders/OrderStatusTag';
import { ShipDialog } from '@/components/orders/ShipDialog';
import { CancelDialog } from '@/components/orders/CancelDialog';
import { showSuccess, showError } from '@/lib/utils/toast';
import { 
  getOrderList, 
  getOrderStatistics,
  shipOrder as shipOrderApi,
  cancelOrder as cancelOrderApi,
  exportOrders
} from '@/lib/api/orders';
import type { Order, OrderQueryParams, OrderStatistics } from '@/types/order';
import { formatDate, formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export function OrdersView() {
  // 状态管理
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics>({
    total: 0,
    pending_payment: 0,
    pending_shipment: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // 搜索筛选
  const [searchParams, setSearchParams] = useState<OrderQueryParams>({});
  const [orderNo, setOrderNo] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState<string>('');
  
  // 对话框状态
  const [shipDialogOpen, setShipDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // 模拟趋势数据（实际项目中应该从后端获取）
  const trendData = {
    total: [120, 132, 101, 134, 90, 230, 210, 240, 280, 300, 320, 350],
    pending_payment: [20, 32, 18, 30, 20, 40, 30, 50, 40, 60, 50, 40],
    pending_shipment: [30, 40, 28, 40, 30, 50, 60, 70, 80, 90, 100, 110],
    shipped: [40, 30, 20, 30, 20, 70, 60, 80, 70, 80, 90, 100],
    completed: [30, 30, 35, 34, 20, 70, 60, 70, 80, 70, 60, 100],
    cancelled: [10, 10, 15, 14, 10, 20, 10, 20, 10, 20, 10, 20]
  };
  
  // 初始加载
  useEffect(() => {
    fetchOrders();
    fetchStatistics();
  }, [currentPage, pageSize]);
  
  // 获取订单列表
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: OrderQueryParams = {
        page: currentPage,
        pageSize,
        ...searchParams
      };
      
      const response = await getOrderList(params);
      console.log('[订单列表] API响应:', response);
      
      if (response.success && response.data) {
        const orders = response.data.list || [];
        console.log('[订单列表] 订单数据:', orders);
        console.log('[订单列表] 第一个订单状态:', orders[0]?.status);
        
        setOrders(orders);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await getOrderStatistics();
      if (response.success && response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };
  
  // 搜索处理
  const handleSearch = () => {
    const params: OrderQueryParams = {};
    if (orderNo) params.orderNo = orderNo;
    if (userId) params.userId = parseInt(userId);
    if (status) params.status = status as any;
    
    setSearchParams(params);
    setCurrentPage(1);
    setTimeout(fetchOrders, 100);
  };
  
  // 重置搜索
  const handleReset = () => {
    setOrderNo('');
    setUserId('');
    setStatus('');
    setSearchParams({});
    setCurrentPage(1);
    setTimeout(fetchOrders, 100);
  };
  
  // 导出订单
  const handleExport = async () => {
    try {
      const blob = await exportOrders(searchParams);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `订单列表_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出失败:', error);
      showError('导出失败');
    }
  };
  
  // 查看详情
  const handleViewDetail = (orderId: number) => {
    // 将数字转换为字符串以确保URL格式正确
    window.location.href = `/orders/${orderId.toString()}`;
  };
  
  // 发货
  const handleShip = (order: Order) => {
    setCurrentOrder(order);
    setShipDialogOpen(true);
  };
  
  // 确认发货
  const handleConfirmShip = async (data: any) => {
    if (!currentOrder) return;
    
    try {
      const response = await shipOrderApi(currentOrder.orderId, data);
      if (response.success) {
        toast({
          title: '发货成功',
          description: '订单已成功发货',
          variant: 'default'
        });
        fetchOrders();
        fetchStatistics();
      } else {
        throw new Error(response.message || '发货失败');
      }
    } catch (error: any) {
      toast({
        title: '发货失败',
        description: error.message || '发货操作失败，请重试',
        variant: 'destructive'
      });
      throw error;
    }
  };
  
  // 取消订单
  const handleCancel = (order: Order) => {
    setCurrentOrder(order);
    setCancelDialogOpen(true);
  };
  
  // 确认取消订单
  const handleConfirmCancel = async (reason: string) => {
    if (!currentOrder) return;
    
    try {
      const response = await cancelOrderApi(currentOrder.orderId, { reason });
      if (response.success) {
        showSuccess('订单已取消');
        fetchOrders();
        fetchStatistics();
      } else {
        throw new Error(response.message || '取消订单失败');
      }
    } catch (error: any) {
      showError(error.message || '取消订单失败');
      throw error;
    }
  };
  
  // 获取支付方式文本
  const getPaymentMethodText = (method?: string) => {
    const map: Record<string, string> = {
      'alipay': '支付宝',
      'wechat': '微信支付',
      'wallet': '钱包支付',
      'bank': '银行卡',
      'balance': '余额支付',
      'credit_card': '信用卡',
      'cod': '货到付款'
    };
    return map[method || ''] || method || '未支付';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 页面标题 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300"
          >
            <Download className="h-4 w-4" />
            导出订单
          </button>
          <button
            onClick={() => {
              fetchOrders();
              fetchStatistics();
            }}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300"
          >
            <RefreshCw className="h-4 w-4" />
            刷新
          </button>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <AnimatePresence>
        {showStatistics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <OrderStatCard
                title="总订单数"
                value={statistics.total}
                previousValue={statistics.total > 0 ? statistics.total - 20 : 0}
                trend={trendData.total}
                icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
                color="#ffffff"
                trendColor="#3b82f6"
                onClick={() => {
                  setStatus('');
                  handleSearch();
                }}
              />
              <OrderStatCard
                title="待支付"
                value={statistics.pending_payment}
                previousValue={statistics.pending_payment > 0 ? statistics.pending_payment - 5 : 0}
                trend={trendData.pending_payment}
                icon={<DollarSign className="h-5 w-5 text-orange-600" />}
                color="#fff7e6"
                trendColor="#f97316"
                onClick={() => {
                  setStatus('pending_payment');
                  handleSearch();
                }}
              />
              <OrderStatCard
                title="待发货"
                value={statistics.pending_shipment}
                previousValue={statistics.pending_shipment > 0 ? statistics.pending_shipment - 8 : 0}
                trend={trendData.pending_shipment}
                icon={<Clock className="h-5 w-5 text-blue-600" />}
                color="#e6f7ff"
                trendColor="#3b82f6"
                onClick={() => {
                  setStatus('pending_shipment');
                  handleSearch();
                }}
              />
              <OrderStatCard
                title="已发货"
                value={statistics.shipped}
                previousValue={statistics.shipped > 0 ? statistics.shipped - 3 : 0}
                trend={trendData.shipped}
                icon={<Truck className="h-5 w-5 text-cyan-600" />}
                color="#e6fffb"
                trendColor="#06b6d4"
                onClick={() => {
                  setStatus('shipped');
                  handleSearch();
                }}
              />
              <OrderStatCard
                title="已完成"
                value={statistics.completed}
                previousValue={statistics.completed > 0 ? statistics.completed - 10 : 0}
                trend={trendData.completed}
                icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                color="#f6ffed"
                trendColor="#22c55e"
                onClick={() => {
                  setStatus('completed');
                  handleSearch();
                }}
              />
              <OrderStatCard
                title="已取消"
                value={statistics.cancelled}
                previousValue={statistics.cancelled > 0 ? statistics.cancelled - 2 : 0}
                trend={trendData.cancelled}
                icon={<XCircle className="h-5 w-5 text-red-600" />}
                color="#fff1f0"
                trendColor="#ef4444"
                onClick={() => {
                  setStatus('cancelled');
                  handleSearch();
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 搜索筛选 */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              订单编号
            </label>
            <input
              type="text"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              placeholder="请输入订单编号"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              用户ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="请输入用户ID"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              订单状态
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">全部</option>
              <option value="pending_payment">待支付</option>
              <option value="pending_shipment">待发货</option>
              <option value="shipped">已发货</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
          
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              搜索
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              重置
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <button
            onClick={() => setShowStatistics(!showStatistics)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <BarChart3 className="h-4 w-4" />
            {showStatistics ? '隐藏统计' : '显示统计'}
          </button>
        </div>
      </div>
      
      {/* 订单列表 */}
      <div className="rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    加载中...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <motion.tr
                    key={order.orderId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                             onClick={() => handleViewDetail(order.orderId)}>
                          {order.orderNo}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          用户: {order.username || `用户${order.userId}`}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(order.createTime, 'datetime')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-red-600">
                          {formatPrice(order.actualAmount)}
                        </div>
                        {order.totalAmount !== order.actualAmount && (
                          <div className="text-xs text-gray-400 line-through">
                            {formatPrice(order.totalAmount)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <OrderStatusTag status={order.status} />
                        {order.paymentMethod && (
                          <div className="text-xs text-gray-500 mt-1">
                            {getPaymentMethodText(order.paymentMethod)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(order.orderId)}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                          详情
                        </button>
                        
                        {order.status === 'pending_shipment' && (
                          <button
                            onClick={() => handleShip(order)}
                            className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800"
                          >
                            <Send className="h-4 w-4" />
                            发货
                          </button>
                        )}
                        
                        {(order.status === 'pending_payment' || order.status === 'pending_shipment') && (
                          <button
                            onClick={() => handleCancel(order)}
                            className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                            取消
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页 */}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <div className="text-sm text-gray-700">
              共 {total} 条记录，第 {currentPage} / {Math.ceil(total / pageSize)} 页
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* 发货对话框 */}
      {currentOrder && (
        <ShipDialog
          open={shipDialogOpen}
          onClose={() => setShipDialogOpen(false)}
          onConfirm={handleConfirmShip}
          orderNo={currentOrder.orderNo}
          defaultReceiver={{
            name: currentOrder.receiverName,
            phone: currentOrder.receiverPhone,
            address: `${currentOrder.receiverProvince} ${currentOrder.receiverCity} ${currentOrder.receiverDistrict} ${currentOrder.receiverAddress}`
          }}
        />
      )}
      
      {/* 取消订单对话框 */}
      {currentOrder && (
        <CancelDialog
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          onConfirm={handleConfirmCancel}
          orderNo={currentOrder.orderNo}
        />
      )}
    </div>
  );
}
