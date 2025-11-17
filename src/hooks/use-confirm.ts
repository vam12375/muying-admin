/**
 * 确认对话框 Hook
 * Confirm Dialog Hook
 * 
 * 提供一个简单的hook来使用确认对话框，替代原生confirm()
 * Source: 自定义实现，遵循KISS/YAGNI/SOLID原则
 */

import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  onConfirm: () => void;
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    title: '提示',
    message: '',
    confirmText: '确定',
    cancelText: '取消',
    variant: 'default',
    onConfirm: () => {},
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        title: options.title || '提示',
        message: options.message,
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        variant: options.variant || 'default',
        onConfirm: () => {
          resolve(true);
          setConfirmState((prev) => ({ ...prev, open: false }));
        },
      });
    });
  }, []);

  const handleCancel = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    confirm,
    confirmState,
    handleCancel,
  };
}
