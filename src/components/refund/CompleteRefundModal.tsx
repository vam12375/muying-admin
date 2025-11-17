/**
 * 完成退款弹窗
 * Complete Refund Modal
 * 
 * Source: 基于旧系统完成退款功能
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showWarning } from '@/lib/utils/toast';

interface CompleteRefundModalProps {
  open: boolean;
  orderNo: string;
  refundAmount: number;
  onClose: () => void;
  onSubmit: (data: {
    transactionId: string;
    evidence?: string;
    remark?: string;
  }) => Promise<void>;
}

export function CompleteRefundModal({
  open,
  orderNo,
  refundAmount,
  onClose,
  onSubmit,
}: CompleteRefundModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [evidence, setEvidence] = useState('');
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 当弹窗打开时，自动填充订单号作为交易ID
  useEffect(() => {
    if (open && orderNo) {
      // 自动填充订单号作为交易ID
      setTransactionId(orderNo);
      setEvidence('');
      setRemark('');
    }
  }, [open, orderNo]);

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      showWarning('请输入交易ID');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        transactionId: transactionId.trim(),
        evidence: evidence || undefined,
        remark: remark || undefined,
      });
      onClose();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小
    if (file.size > 2 * 1024 * 1024) {
      showWarning('文件大小不能超过2MB');
      return;
    }

    // 检查文件类型
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      showWarning('只支持JPG、PNG格式');
      return;
    }

    // 这里应该上传到服务器，暂时使用本地预览
    const reader = new FileReader();
    reader.onload = (event) => {
      setEvidence(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4"
        >
          {/* 头部 */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">完成退款</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-4">
            {/* 提示信息 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-900 font-medium">订单号: {orderNo}</p>
                <p className="text-sm text-blue-700 mt-1">
                  退款金额: ¥{refundAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* 交易ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> 交易ID
              </label>
              <Input
                placeholder="请输入支付宝交易号或其他交易凭证ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                请输入支付宝、微信或其他支付平台的交易凭证ID
              </p>
            </div>

            {/* 上传凭证 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上传凭证
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-500 transition-colors">
                {evidence ? (
                  <div className="relative">
                    <img
                      src={evidence}
                      alt="凭证"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => setEvidence('')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">上传</p>
                    <p className="text-xs text-gray-500 mt-1">
                      支持JPG、PNG格式，大小不超过2MB
                    </p>
                  </label>
                )}
              </div>
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                备注
              </label>
              <textarea
                placeholder="请输入备注信息（可选）"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? '提交中...' : '提交'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
