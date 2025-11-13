/**
 * API Service for MomBaby Admin Dashboard
 * 母婴商城后台管理系统 API 服务层
 * 
 * 基于后端 Spring Boot 接口实现
 * 统一处理 Result<T> 和 CommonResult<T> 两种响应格式
 * 
 * Source: 参考 muying-admin-react/src/utils/request.ts
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 不需要 token 的白名单路径
const AUTH_WHITELIST = ['/api/admin/login', '/public'];

// API 响应类型定义
interface ApiResponse<T = any> {
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
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_BASE_URL}${url}`;
  
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
      hasToken: !!token
    });
    
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

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

    const result = await response.json();
    
    const apiResponse: ApiResponse<T> = {
      success: result.success !== undefined ? result.success : result.code === 200,
      code: result.code,
      message: result.message || result.msg,
      data: result.data
    };
    
    if (!apiResponse.success && apiResponse.code !== 200) {
      const errorMsg = apiResponse.message || '操作失败';
      showError(errorMsg);
      throw new Error(errorMsg);
    }
    
    return apiResponse;
    
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = '网络连接失败，请检查网络或后端服务';
      showError(networkError);
      throw new Error(networkError);
    }
    throw error;
  }
}

/**
 * Admin Authentication - 管理员认证
 */
export const authApi = {
  login: async (username: string, password: string) => {
    return fetchApi<{ token: string; user: any }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  getUserInfo: async () => {
    return fetchApi<any>('/api/admin/info');
  },

  logout: async () => {
    return fetchApi<void>('/api/admin/logout', {
      method: 'POST',
    });
  },
};

/**
 * Dashboard Statistics API - 仪表盘统计
 * 对应后端: DashboardController
 */
export const dashboardApi = {
  getStats: async () => {
    return fetchApi<any>('/api/admin/dashboard/stats');
  },

  getOrderTrend: async (days: number = 7) => {
    return fetchApi<any>(`/api/admin/dashboard/order-trend?days=${days}`);
  },

  getProductCategories: async () => {
    return fetchApi<any[]>('/api/admin/dashboard/product-categories');
  },

  getMonthlySales: async (months: number = 6) => {
    return fetchApi<any>(`/api/admin/dashboard/monthly-sales?months=${months}`);
  },

  getTodoItems: async () => {
    return fetchApi<any[]>('/api/admin/dashboard/todo-items');
  },

  getUserGrowth: async (months: number = 6) => {
    return fetchApi<any>(`/api/admin/dashboard/user-growth?months=${months}`);
  },

  getRefundTrend: async (days: number = 7) => {
    return fetchApi<any>(`/api/admin/dashboard/refund-trend?days=${days}`);
  },
};

/**
 * Products API - 商品管理
 * 对应后端: AdminProductController
 */
export const productsApi = {
  getList: async (page: number = 1, size: number = 10, keyword?: string, categoryId?: number, brandId?: number, status?: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(keyword && { keyword }),
      ...(categoryId && { categoryId: categoryId.toString() }),
      ...(brandId && { brandId: brandId.toString() }),
      ...(status !== undefined && { status: status.toString() }),
    });
    return fetchApi<any>(`/api/admin/products/page?${params}`);
  },

  getDetail: async (id: number) => {
    return fetchApi<any>(`/api/admin/products/${id}`);
  },

  create: async (product: any) => {
    return fetchApi<any>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: async (id: number, product: any) => {
    return fetchApi<any>(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  delete: async (id: number) => {
    return fetchApi<void>(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id: number, status: number) => {
    return fetchApi<any>(`/api/admin/products/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },
};

/**
 * Coupons API - 优惠券管理
 * 对应后端: AdminCouponController
 * 注意：后端 Controller 路径包含 /api，所以使用 /api/api 前缀
 */
export const couponsApi = {
  getList: async (page: number = 1, pageSize: number = 10, name?: string, type?: string, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(name && { name }),
      ...(type && { type }),
      ...(status && { status }),
    });
    return fetchApi<any>(`/api/api/admin/coupons?${params}`);
  },

  getDetail: async (id: number) => {
    return fetchApi<any>(`/api/api/admin/coupons/${id}`);
  },

  create: async (data: any) => {
    return fetchApi<any>('/api/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return fetchApi<any>(`/api/api/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return fetchApi<any>(`/api/api/admin/coupons/${id}`, {
      method: 'DELETE',
    });
  },

  updateStatus: async (id: number, status: string) => {
    return fetchApi<any>(`/api/api/admin/coupons/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  getStatistics: async () => {
    return fetchApi<any>('/api/api/admin/coupons/statistics');
  },
};

/**
 * Orders API - 订单管理
 * 对应后端: AdminOrderController
 * 注意：后端 Controller 路径包含 /api，所以使用 /api/api 前缀
 */
export const ordersApi = {
  getList: async (page: number = 1, pageSize: number = 10, status?: string, orderNo?: string, userId?: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(status && { status }),
      ...(orderNo && { orderNo }),
      ...(userId && { userId: userId.toString() }),
    });
    return fetchApi<any>(`/api/api/admin/orders?${params}`);
  },

  getDetail: async (id: number) => {
    return fetchApi<any>(`/api/api/admin/orders/${id}`);
  },

  getStatistics: async () => {
    return fetchApi<any>('/api/api/admin/orders/statistics');
  },

  updateStatus: async (id: number, status: string, remark?: string) => {
    return fetchApi<any>(`/api/api/admin/orders/${id}/status?status=${status}${remark ? `&remark=${remark}` : ''}`, {
      method: 'PUT',
    });
  },

  ship: async (id: number, companyId: number, trackingNo?: string, receiverName?: string, receiverPhone?: string, receiverAddress?: string) => {
    const params = new URLSearchParams({
      companyId: companyId.toString(),
      ...(trackingNo && { trackingNo }),
      ...(receiverName && { receiverName }),
      ...(receiverPhone && { receiverPhone }),
      ...(receiverAddress && { receiverAddress }),
    });
    return fetchApi<any>(`/api/api/admin/orders/${id}/ship?${params}`, {
      method: 'PUT',
    });
  },

  export: async (status?: string, orderNo?: string, userId?: number) => {
    const params = new URLSearchParams({
      ...(status && { status }),
      ...(orderNo && { orderNo }),
      ...(userId && { userId: userId.toString() }),
    });
    window.open(`${API_BASE_URL}/api/api/admin/orders/export?${params}`, '_blank');
  },
};

/**
 * Reviews API - 评价管理
 * 对应后端: AdminReviewController
 */
export const reviewsApi = {
  getList: async (page: number = 1, pageSize: number = 10, productId?: number, userId?: number, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(productId && { productId: productId.toString() }),
      ...(userId && { userId: userId.toString() }),
      ...(status && { status }),
    });
    return fetchApi<any>(`/api/api/admin/reviews?${params}`);
  },

  getDetail: async (id: number) => {
    return fetchApi<any>(`/api/api/admin/reviews/${id}`);
  },

  updateStatus: async (id: number, status: string) => {
    return fetchApi<any>(`/api/api/admin/reviews/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  },

  reply: async (id: number, replyContent: string) => {
    return fetchApi<any>(`/api/api/admin/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyContent }),
    });
  },

  delete: async (id: number) => {
    return fetchApi<any>(`/api/api/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  getStatistics: async () => {
    return fetchApi<any>('/api/api/admin/reviews/statistics');
  },
};

/**
 * Points API - 积分管理
 * 对应后端: AdminPointsController
 */
export const pointsApi = {
  getList: async (page: number = 1, pageSize: number = 10, userId?: number, type?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(userId && { userId: userId.toString() }),
      ...(type && { type }),
    });
    return fetchApi<any>(`/api/api/admin/points?${params}`);
  },

  getDetail: async (id: number) => {
    return fetchApi<any>(`/api/api/admin/points/${id}`);
  },

  adjust: async (userId: number, points: number, type: string, remark?: string) => {
    return fetchApi<any>('/api/api/admin/points/adjust', {
      method: 'POST',
      body: JSON.stringify({ userId, points, type, remark }),
    });
  },

  getStatistics: async () => {
    return fetchApi<any>('/api/api/admin/points/statistics');
  },

  getUserPoints: async (userId: number) => {
    return fetchApi<any>(`/api/api/admin/points/user/${userId}`);
  },
};
