/**
 * 取消订单对话框组件
 * Source: 基于旧版本取消订单功能
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface CancelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  orderNo: string;
}

export function CancelDialog({
  open,
  onClose,
  onConfirm,
  orderNo
}: CancelDialogProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert('请输入取消原因');
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm(reason);
      handleClose();
    } catch (error) {
      console.error('取消订单失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />

          {/* 对话框 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-lg bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 标题 */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">取消订单</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 内容 */}
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    订单编号
                  </label>
                  <div className="text-sm text-gray-900">{orderNo}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    取消原因 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="请输入取消订单的原因"
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>注意：</strong>取消订单后将无法恢复，请谨慎操作。
                  </p>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  确认取消订单
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
