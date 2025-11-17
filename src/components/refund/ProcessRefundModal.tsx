"use client";

/**
 * 处理退款弹窗组件
 * Process Refund Modal Component
 * 
 * Source: 基于后端 RefundController.processRefund 接口
 * Design: 遵循 KISS, YAGNI, SOLID 原则
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, CreditCard, Building, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProcessRefundModalProps {
  open: boolean;
  orderNo: string;
  refundAmount: number;
  onClose: () => void;
  onSubmit: (data: { refundChannel: string; refundAccount?: string }) => Promise<void>;
}

export function ProcessRefundModal({
  open,
  orderNo,
  refundAmount,
  onClose,
  onSubmit,
}: ProcessRefundModalProps) {
  const [refundChannel, setRefundChannel] = useState('');
  const [refundAccount, setRefundAccount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!refundChannel) {
      alert('请选择退款渠道');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        refundChannel,
        refundAccount: refundAccount || undefined,
      });
      // 重置表单
      setRefundChannel('');
      setRefundAccount('');
    } catch (error) {
      // 错误已在父组件处理
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setRefundChannel('');
    setRefundAccount('');
    onClose();
  };

  // 退款渠道选项
  const channelOptions = [
    { value: 'ALIPAY', label: '支付宝', icon: DollarSign },
    { value: 'WECHAT', label: '微信支付', icon: CreditCard },
    { value: 'BANK', label: '银行转账', icon: Building },
    { value: 'WALLET', label: '账户余额', icon: Wallet },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* 弹窗内容 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* 标题栏 */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">处理退款</h3>
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 内容区域 */}
              <div className="px-6 py-4 space-y-4">
                {/* 订单信息 */}
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">订单号：</span>
                    <span className="font-mono text-gray-900">{orderNo}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">退款金额：</span>
                    <span className="text-lg font-bold text-pink-600">
                      ¥{refundAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 退款渠道选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> 退款渠道
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {channelOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRefundChannel(option.value)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            refundChannel === option.value
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 mx-auto mb-2 ${
                              refundChannel === option.value
                                ? 'text-pink-500'
                                : 'text-gray-400'
                            }`}
                          />
                          <div
                            className={`text-sm font-medium ${
                              refundChannel === option.value
                                ? 'text-pink-600'
                                : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 退款账号（可选） */}
                {refundChannel && refundChannel !== 'WALLET' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      退款账号（可选）
                    </label>
                    <Input
                      value={refundAccount}
                      onChange={(e) => setRefundAccount(e.target.value)}
                      placeholder={`请输入${
                        channelOptions.find((o) => o.value === refundChannel)?.label
                      }账号`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      如果不填写，将退款到原支付账号
                    </p>
                  </motion.div>
                )}

                {/* 提示信息 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    请仔细核对退款信息，提交后将开始处理退款流程
                  </p>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose} disabled={submitting}>
                  取消
                </Button>
                <Button onClick={handleSubmit} disabled={submitting || !refundChannel}>
                  {submitting ? '提交中...' : '提交'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
