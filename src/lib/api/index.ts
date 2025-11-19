/**
 * API Service - 统一导出和通用工具
 * API Service - Unified exports and common utilities
 * 
 * Source: 基于后端 Spring Boot 接口实现
 */

// 开发环境：直接请求后端 API（通过环境变量配置）
// 生产环境：通过 Nginx 反向代理
// 注意：NEXT_PUBLIC_API_URL 应该包含 /api 前缀
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// 不需要 token 的白名单路径
const AUTH_WHITELIST = ['/admin/login', '/public'];

// API 响应类型定义
export interface ApiResponse<T = any> {
  code?: number;
  message?: string;
  msg?: string;
  data?: T;
  success?: boolean;
}

/**
 * 检查请求是否需要认证
 */
function isAuthRequired(url: string): boolean {
  return !AUTH_WHITELIST.some(path => url.includes(path));
}

/**
 * 处理认证失败，跳转到登录页
 */
function handleAuthFailure(message: string = '登录已失效，请重新登录') {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  
  const currentPath = window.location.pathname;
  if (currentPath !== '/login') {
    console.warn(`[Auth] ${message}, 重定向到登录页`);
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  }
}

/**
 * 显示错误提示
 */
function showError(message: string) {
  if (typeof window !== 'undefined') {
    console.error('[API Error]', message);
  }
}

/**
 * 通用 API 请求函数
 * 统一处理认证、错误和响应格式
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, any> } = {}
): Promise<ApiResponse<T>> {
  // 规范化路径：确保以 / 开头，移除多余的斜杠
  let url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  url = url.replace(/\/+/g, '/'); // 将连续的斜杠替换为单个斜杠
  
  // 处理查询参数
  if (options.params) {
    const params = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }
  
  // 为 GET 请求添加时间戳，防止缓存（与旧版本保持一致）
  const method = (options.method || 'GET').toUpperCase();
  if (method === 'GET') {
    const separator = url.includes('?') ? '&' : '?';
    url += `${separator}_t=${new Date().getTime()}`;
  }
  
  // 构建完整URL：确保API_BASE_URL和url之间没有重复的斜杠
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const fullUrl = `${baseUrl}${url}`;
  
  const needAuth = isAuthRequired(url);
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  
  if (needAuth && !token) {
    handleAuthFailure('未登录，请先登录');
    throw new Error('未登录');
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    console.log('[API Request]', {
      endpoint,
      fullUrl,
      method: options.method || 'GET',
      hasToken: !!token,
      body: options.body
    });
    
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log('[API Response Status]', {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    // 先尝试读取响应体
    let result: any;
    try {
      const text = await response.text();
      //console.log('[API Response Text]', text);
      result = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('[API Parse Error]', parseError);
      throw new Error('响应数据格式错误');
    }

    console.log('[API Response Data]', {
      endpoint,
      result
    });

    // 检查 HTTP 状态码
    if (!response.ok) {
      if (response.status === 401) {
        handleAuthFailure('登录已失效');
        throw new Error('登录已失效，请重新登录');
      }
      
      if (response.status === 403) {
        if (!token) {
          handleAuthFailure('需要登录');
        } else {
          showError('无权限访问此功能');
        }
        throw new Error('无权限访问');
      }
      
      if (response.status === 404) {
        showError('请求的资源不存在');
        throw new Error('资源不存在');
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // 构建统一的响应格式
    const apiResponse: ApiResponse<T> = {
      success: result.success !== undefined ? result.success : result.code === 200,
      code: result.code,
      message: result.message || result.msg,
      data: result.data
    };
    
    // 检查业务逻辑是否成功
    if (!apiResponse.success && apiResponse.code !== 200) {
      const errorMsg = apiResponse.message || '操作失败';
      showError(errorMsg);
      throw new Error(errorMsg);
    }
    
    return apiResponse;
    
  } catch (error: any) {
    console.error('[API Error]', {
      endpoint,
      error: error.message,
      stack: error.stack
    });
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = '网络连接失败，请检查网络或后端服务';
      showError(networkError);
      throw new Error(networkError);
    }
    throw error;
  }
}

// 统一导出所有 API 模块
export * from './auth';
export * from './dashboard';
export * from './products';
export * from './categories';
export * from './brands';
export * from './coupons';
export * from './orders';
export * from './reviews';
export * from './points';
export * from './users';
export * from './accounts';
export * from './profile';
export * from './refund';

// 兼容旧的对象导出方式
export { categoriesApi } from './categories';
export { productsApi } from './products';
export { dashboardApi } from './dashboard';
export { ordersApi } from './orders';
export { profileApi } from './profile';
export { refundApi, userRefundApi } from './refund';
export { usersApi } from './users';
export { accountsApi } from './accounts';
