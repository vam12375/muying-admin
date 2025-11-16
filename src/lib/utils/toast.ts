/**
 * Toast 通知工具函数
 * Toast notification utility functions
 * 
 * 提供全局的 toast 通知功能，可在任何地方调用
 */

type ToastType = 'success' | 'error' | 'warning' | 'info';

// 全局 toast 函数引用
let globalShowToast: ((type: ToastType, message: string, duration?: number) => void) | null = null;

/**
 * 设置全局 toast 函数
 * 在 ToastProvider 中调用此函数来注册 showToast
 */
export function setGlobalToast(showToast: (type: ToastType, message: string, duration?: number) => void) {
  globalShowToast = showToast;
}

/**
 * 显示成功提示
 * @param message 提示消息
 * @param duration 持续时间（毫秒），默认 3000ms
 */
export function showSuccess(message: string, duration?: number) {
  if (globalShowToast) {
    globalShowToast('success', message, duration);
  } else {
    console.log('[Toast Success]', message);
  }
}

/**
 * 显示错误提示
 * @param message 错误消息
 * @param duration 持续时间（毫秒），默认 4000ms
 */
export function showError(message: string, duration: number = 4000) {
  if (globalShowToast) {
    globalShowToast('error', message, duration);
  } else {
    console.error('[Toast Error]', message);
  }
}

/**
 * 显示警告提示
 * @param message 警告消息
 * @param duration 持续时间（毫秒），默认 3000ms
 */
export function showWarning(message: string, duration?: number) {
  if (globalShowToast) {
    globalShowToast('warning', message, duration);
  } else {
    console.warn('[Toast Warning]', message);
  }
}

/**
 * 显示信息提示
 * @param message 信息消息
 * @param duration 持续时间（毫秒），默认 3000ms
 */
export function showInfo(message: string, duration?: number) {
  if (globalShowToast) {
    globalShowToast('info', message, duration);
  } else {
    console.info('[Toast Info]', message);
  }
}

/**
 * 通用 toast 函数
 * @param type toast 类型
 * @param message 消息内容
 * @param duration 持续时间（毫秒）
 */
export function toast(type: ToastType, message: string, duration?: number) {
  if (globalShowToast) {
    globalShowToast(type, message, duration);
  } else {
    console.log(`[Toast ${type}]`, message);
  }
}

// 默认导出
export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  toast,
};
