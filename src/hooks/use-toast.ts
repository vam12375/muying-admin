/**
 * Toast Hook
 * 用于显示通知消息
 */

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

let toastCount = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 3000 }: Omit<Toast, 'id'>) => {
      const id = `toast-${++toastCount}`;
      const newToast: Toast = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      // 自动移除
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
}

// 全局 toast 实例（简化版）
let globalToastFn: ((options: Omit<Toast, 'id'>) => void) | null = null;

export function setGlobalToast(fn: (options: Omit<Toast, 'id'>) => void) {
  globalToastFn = fn;
}

export function toast(options: Omit<Toast, 'id'>) {
  if (globalToastFn) {
    globalToastFn(options);
  } else {
    // 降级到 console
    console.log('[Toast]', options.title, options.description);
  }
}
