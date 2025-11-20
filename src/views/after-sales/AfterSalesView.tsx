"use client";

/**
 * 售后管理视图
 * After-sales Management View
 * 
 * Source: 基于后端 AdminRefundController 实现
 * Design: 遵循 KISS, YAGNI, SOLID 原则
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  Search,
  DollarSign,
  Package,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Download,
  AlertCircle,
} from 'lucide-react';
import { refundApi } from '@/lib/api/refund';
import { showSuccess, showError, showWarning } from '@/lib/utils/toast';
import { useConfirm } from '@/hooks/use-confirm';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefundDetailModal } from '@/components/refund/RefundDetailModal';
import { ProcessRefundModal } from '@/components/refund/ProcessRefundModal';
import { CompleteRefundModal } from '@/components/refund/CompleteRefundModal';
import type { Refund, RefundStatus, RefundStatistics, RefundQueryParams } from '@/types/refund';

export function AfterSalesView() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [statistics, setStatistics] = useState<RefundStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<RefundStatus | 'ALL'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { confirm, confirmState, handleCancel } = useConfirm();

  // 弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);

  // 加载退款列表
  const loadRefunds = async () => {
    try {
      setLoading(true);
      const params: RefundQueryParams = {
        page: pagination.current,
        size: pagination.pageSize,
        status: filterStatus === 'ALL' ? undefined : filterStatus,
        orderNo: searchKeyword || undefined,
      };

      const response = await refundApi.getRefundList(params);
      setRefunds(response.records || []);
      setPagination((prev) => ({
        ...prev,
        total: response.total || 0,
      }));
    } catch (error: any) {
      console.error('加载退款列表失败:', error);
      showError(error.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStatistics = async () => {
    try {
      const stats = await refundApi.getRefundStatistics();
      setStatistics(stats);
    } catch (error: any) {
      console.error('加载统计数据失败:', error);
    }
  };

  useEffect(() => {
    loadRefunds();
    loadStatistics();
  }, [pagination.current, filterStatus]);

  // 搜索处理
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadRefunds();
  };

  const filteredData = refunds;

  // 审核退款
  const handleReview = async (refundId: number, approved: boolean) => {
    const confirmed = await confirm({
      title: approved ? '确认通过' : '确认拒绝',
      message: `确定要${approved ? '通过' : '拒绝'}这个退款申请吗？`,
      variant: approved ? 'default' : 'danger',
    });

    if (!confirmed) return;

    try {
      await refundApi.reviewRefund({
        refundId,
        approved,
        reviewRemark: approved ? '审核通过' : '不符合退款条件',
      });
      showSuccess(approved ? '审核通过' : '已拒绝');
      loadRefunds();
      loadStatistics();
    } catch (error: any) {
      console.error('审核失败:', error);
      showError(error.message || '操作失败');
    }
  };

  // 查看详情
  const handleViewDetail = (refund: Refund) => {
    setSelectedRefund(refund);
    setDetailModalOpen(true);
  };

  // 打开处理退款弹窗
  const handleOpenProcessModal = (refund: Refund) => {
    setSelectedRefund(refund);
    setProcessModalOpen(true);
  };

  // 打开完成退款弹窗
  const handleOpenCompleteModal = (refund: Refund) => {
    setSelectedRefund(refund);
    setCompleteModalOpen(true);
  };

  // 处理退款（选择退款渠道）
  const handleProcessRefund = async (data: {
    refundChannel: string;
    refundAccount?: string;
  }) => {
    if (!selectedRefund) return;

    const refundId = selectedRefund.id || selectedRefund.refundId || 0;

    try {
      await refundApi.processRefund({
        refundId,
        refundChannel: data.refundChannel,
        refundAccount: data.refundAccount,
      });
      showSuccess('退款处理已提交');
      setProcessModalOpen(false);
      loadRefunds();
      loadStatistics();
    } catch (error: any) {
      console.error('处理退款失败:', error);
      showError(error.message || '操作失败');
      throw error;
    }
  };

  // 完成退款
  const handleCompleteRefund = async (data: {
    transactionId: string;
    evidence?: string;
    remark?: string;
  }) => {
    if (!selectedRefund) return;

    const refundId = selectedRefund.id || selectedRefund.refundId || 0;

    try {
      await refundApi.completeRefund(refundId, data.transactionId, data.remark);
      showSuccess('退款已完成');
      setCompleteModalOpen(false);
      setDetailModalOpen(false);
      loadRefunds();
      loadStatistics();
    } catch (error: any) {
      console.error('完成退款失败:', error);
      showError(error.message || '操作失败');
      throw error;
    }
  };

  // 获取状态信息
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; icon: any; color: string }> = {
      PENDING: {
        label: '待审核',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700',
      },
      APPROVED: {
        label: '审核通过',
        icon: CheckCircle,
        color: 'bg-blue-100 text-blue-700',
      },
      REJECTED: {
        label: '审核拒绝',
        icon: XCircle,
        color: 'bg-red-100 text-red-700',
      },
      PROCESSING: {
        label: '处理中',
        icon: RefreshCw,
        color: 'bg-purple-100 text-purple-700',
      },
      COMPLETED: {
        label: '已完成',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700',
      },
      FAILED: {
        label: '退款失败',
        icon: XCircle,
        color: 'bg-red-100 text-red-700',
      },
      CANCELLED: {
        label: '已取消',
        icon: XCircle,
        color: 'bg-gray-100 text-gray-700',
      },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${(amount || 0).toFixed(2)}`;
  };

  // 格式化时间
  const formatTime = (time?: string) => {
    if (!time) return '-';
    try {
      const date = new Date(time);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      return '-';
    }
  };

  // 获取退款单号
  const getRefundNo = (refund: Refund) => {
    return refund.refund_no || refund.refundNo || '-';
  };

  // 获取订单号
  const getOrderNo = (refund: Refund) => {
    return refund.order_no || refund.orderNo || '-';
  };

  // 获取用户ID
  const getUserId = (refund: Refund) => {
    return refund.user_id || refund.userId || 0;
  };

  // 获取退款金额
  const getAmount = (refund: Refund) => {
    return refund.amount || refund.refundAmount || 0;
  };

  // 获取创建时间
  const getCreateTime = (refund: Refund) => {
    return refund.create_time || refund.createTime || '';
  };

  // 获取退款ID
  const getRefundId = (refund: Refund) => {
    return refund.id || refund.refundId || 0;
  };

  // 获取用户名
  const getUsername = (refund: Refund) => {
    // 优先使用username字段
    if (refund.username) return refund.username;
    
    // 尝试从user对象获取username
    if (refund.user?.username) return refund.user.username;
    
    // 尝试从user对象获取nickname
    if (refund.user?.nickname) return refund.user.nickname;
    
    // 最后使用用户ID
    const userId = getUserId(refund);
    return userId ? `用户${userId}` : '-';
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Headphones className="h-6 w-6 text-pink-500" />
              售后管理
            </h1>
            <p className="text-sm text-gray-500 mt-1">处理退款、退货和换货申请</p>
          </div>
          <Button variant="outline" onClick={loadRefunds}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: '总申请',
            value: statistics?.totalCount || refunds.length || 0,
            icon: Headphones,
            color: 'from-purple-500 to-pink-500',
            animate: false,
          },
          {
            label: '待审核',
            value: statistics?.pendingCount || refunds.filter((r) => r.status === 'PENDING').length || 0,
            icon: Clock,
            color: 'from-yellow-500 to-orange-500',
            animate: false,
          },
          {
            label: '处理中',
            value: statistics?.processingCount || refunds.filter((r) => r.status === 'PROCESSING').length || 0,
            icon: RefreshCw,
            color: 'from-blue-500 to-cyan-500',
            animate: true,
          },
          {
            label: '已完成',
            value: statistics?.completedCount || refunds.filter((r) => r.status === 'COMPLETED').length || 0,
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
            animate: false,
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}
            >
              <stat.icon className={`h-6 w-6 text-white ${stat.animate ? 'animate-spin' : ''}`} />
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="搜索订单号..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            搜索
          </Button>
        </div>

        {/* 状态筛选 */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'ALL', label: '全部' },
            { value: 'PENDING', label: '待审核' },
            { value: 'APPROVED', label: '审核通过' },
            { value: 'PROCESSING', label: '处理中' },
            { value: 'COMPLETED', label: '已完成' },
            { value: 'REJECTED', label: '已拒绝' },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status.value
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* 退款列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-[180px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  退款单号
                </th>
                <th className="w-[180px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  订单号
                </th>
                <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  用户
                </th>
                <th className="w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  退款金额
                </th>
                <th className="w-[100px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  状态
                </th>
                <th className="w-[140px] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  申请时间
                </th>
                <th className="w-[280px] px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    加载中...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                filteredData.map((refund) => {
                  const statusInfo = getStatusInfo(refund.status);
                  const StatusIcon = statusInfo.icon;
                  const refundId = getRefundId(refund);
                  const userId = getUserId(refund);

                  return (
                    <tr key={refundId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono truncate" title={getRefundNo(refund)}>
                        {getRefundNo(refund)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono truncate" title={getOrderNo(refund)}>
                        {getOrderNo(refund)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 truncate" title={getUsername(refund)}>
                        {getUsername(refund)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {formatAmount(getAmount(refund))}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                        >
                          <StatusIcon
                            className={`h-3 w-3 mr-1 ${
                              refund.status === 'PROCESSING' ? 'animate-spin' : ''
                            }`}
                          />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 truncate" title={formatTime(getCreateTime(refund))}>
                        {formatTime(getCreateTime(refund))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetail(refund)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            详情
                          </Button>
                          {refund.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleReview(refundId, true)}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                通过
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReview(refundId, false)}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                拒绝
                              </Button>
                            </>
                          )}
                          {refund.status === 'APPROVED' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleOpenProcessModal(refund)}
                            >
                              <RefreshCw className="h-3.5 w-3.5 mr-1" />
                              处理退款
                            </Button>
                          )}
                          {refund.status === 'PROCESSING' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleOpenCompleteModal(refund)}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              完成退款
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {pagination.total > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              共 {pagination.total} 条记录
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.current === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, current: prev.current - 1 }))
                }
              >
                上一页
              </Button>
              <span className="px-3 py-1 text-sm text-gray-700">
                第 {pagination.current} 页
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={
                  pagination.current * pagination.pageSize >= pagination.total
                }
                onClick={() =>
                  setPagination((prev) => ({ ...prev, current: prev.current + 1 }))
                }
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 确认对话框 */}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        onConfirm={confirmState.onConfirm}
        onCancel={handleCancel}
      />

      {/* 退款详情弹窗 */}
      <RefundDetailModal
        open={detailModalOpen}
        refund={selectedRefund}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedRefund(null);
        }}
        onComplete={(refundId) => {
          const refund = refunds.find(
            (r) => (r.id || r.refundId) === refundId
          );
          if (refund) {
            handleOpenCompleteModal(refund);
          }
        }}
      />

      {/* 处理退款弹窗 */}
      {selectedRefund && (
        <ProcessRefundModal
          open={processModalOpen}
          orderNo={selectedRefund.order_no || selectedRefund.orderNo || ''}
          refundAmount={selectedRefund.amount || selectedRefund.refundAmount || 0}
          onClose={() => {
            setProcessModalOpen(false);
          }}
          onSubmit={handleProcessRefund}
        />
      )}

      {/* 完成退款弹窗 */}
      {selectedRefund && (
        <CompleteRefundModal
          open={completeModalOpen}
          orderNo={selectedRefund.order_no || selectedRefund.orderNo || ''}
          refundAmount={selectedRefund.amount || selectedRefund.refundAmount || 0}
          onClose={() => {
            setCompleteModalOpen(false);
          }}
          onSubmit={handleCompleteRefund}
        />
      )}
    </div>
  );
}
