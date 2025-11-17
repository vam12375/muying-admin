/**
 * 确认对话框组件
 * Confirm Dialog Component
 * 
 * 用于替代原生的 confirm() 弹框，提供更优雅的用户体验
 * Source: 自定义实现，遵循KISS/YAGNI/SOLID原则
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './button';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title = '提示',
  message,
  confirmText = '确定',
  cancelText = '取消',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className={`px-6 py-4 border-b flex items-center justify-between ${
            variant === 'danger' 
              ? 'bg-gradient-to-r from-red-50 to-pink-50' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                variant === 'danger' 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 内容 */}
          <div className="px-6 py-6">
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* 底部按钮 */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="min-w-[80px]"
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === 'danger' ? 'destructive' : 'default'}
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className="min-w-[80px]"
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
