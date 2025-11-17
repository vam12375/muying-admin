/**
 * 退款详情弹窗
 * Refund Detail Modal
 * 
 * Source: 基于旧系统退款详情页面
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Refund } from '@/types/refund';

interface RefundDetailModalProps {
  open: boolean;
  refund: Refund | null;
  onClose: () => void;
  onComplete?: (refundId: number) => void;
}

export function RefundDetailModal({
  open,
  refund,
  onClose,
  onComplete,
}: RefundDetailModalProps) {
  if (!open || !refund) return null;

  // 获取字段值的辅助函数
  const getRefundNo = () => refund.refund_no || refund.refundNo || '-';
  const getOrderNo = () => refund.order_no || refund.orderNo || '-';
  const getUserId = () => refund.user_id || refund.userId || 0;
  const getAmount = () => refund.amount || refund.refundAmount || 0;
  const getRefundReason = () => refund.refund_reason || refund.refundReason || '-';
  const getCreateTime = () => refund.create_time || refund.createTime || '';
  const getRefundTime = () => refund.refund_time || refund.refundTime || '';

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

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `¥${amount.toFixed(2)}`;
  };

  // 获取状态步骤
  const getStatusSteps = () => {
    const steps = [
      {
        label: '申请中',
        description: '用户已提交退款申请',
        status: 'completed',
        icon: Clock,
      },
      {
        label: '已审核',
        description: '管理员已审核通过',
        status: refund.status === 'PENDING' ? 'pending' : 'completed',
        icon: CheckCircle,
      },
      {
        label: '处理中',
        description: '正在处理退款',
        status:
          refund.status === 'PROCESSING'
            ? 'active'
            : refund.status === 'COMPLETED'
            ? 'completed'
            : 'pending',
        icon: AlertCircle,
      },
      {
        label: '退款完成',
        description: '退款已完成',
        status: refund.status === 'COMPLETED' ? 'completed' : 'pending',
        icon: CheckCircle,
      },
    ];

    return steps;
  };

  const steps = getStatusSteps();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
        >
          {/* 头部 */}
          <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50">
            <h3 className="text-lg font-semibold text-gray-900">退款详情</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* 退款流程 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">退款流程</h4>
              <div className="relative">
                {/* 进度线 */}
                <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                    style={{
                      width: `${
                        (steps.filter((s) => s.status === 'completed').length /
                          steps.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                {/* 步骤 */}
                <div className="grid grid-cols-4 gap-4">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={index} className="relative flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 z-10 transition-all ${
                            step.status === 'completed'
                              ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white'
                              : step.status === 'active'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          <StepIcon
                            className={`h-6 w-6 ${
                              step.status === 'active' ? 'animate-pulse' : ''
                            }`}
                          />
                        </div>
                        <p
                          className={`text-sm font-medium ${
                            step.status === 'completed' || step.status === 'active'
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 退款信息 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-900 mb-3">退款信息</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">退款单号</p>
                  <p className="text-sm text-gray-900 font-mono mt-1">{getRefundNo()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">关联订单号</p>
                  <p className="text-sm text-gray-900 font-mono mt-1">{getOrderNo()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">退款金额</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">
                    {formatAmount(getAmount())}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">用户ID</p>
                  <p className="text-sm text-gray-900 mt-1">{getUserId()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">申请时间</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatTime(getCreateTime())}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">退款原因</p>
                  <p className="text-sm text-gray-900 mt-1">{getRefundReason()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
            {(refund.status === 'PROCESSING' || refund.status === 'APPROVED') &&
              onComplete && (
                <Button
                  onClick={() => {
                    const refundId = refund.id || refund.refundId || 0;
                    onComplete(refundId);
                  }}
                >
                  完成退款
                </Button>
              )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
