/**
 * 个人中心 API 服务
 * Profile API Service
 * 
 * Source: 基于后端 UserController 和 AdminUserAccountController
 */

import { fetchApi, type ApiResponse } from './index';
import type {
  AdminInfo,
  AdminStatistics,
  LoginRecord,
  OperationRecord,
  PageResponse,
  ProfileQueryParams,
  PasswordChangeParams,
  AdminInfoUpdateParams
} from '@/types/profile';

/**
 * 获取当前管理员信息
 * Source: AdminController.getUserInfo() - /admin/info
 */
export async function getAdminInfo(): Promise<ApiResponse<AdminInfo>> {
  const response = await fetchApi<any>('/admin/info');
  
  console.log('[getAdminInfo] 原始响应:', response);
  console.log('[getAdminInfo] response.data:', response.data);
  console.log('[getAdminInfo] response.data 类型:', typeof response.data);
  
  // 字段映射：后端返回的字段名与前端类型定义不一致，需要转换
  if (response.success && response.data) {
    const data = response.data;
    console.log('[getAdminInfo] 开始映射字段，原始data:', data);
    
    const mappedData: AdminInfo = {
      id: data.userId,
      username: data.username,
      nickname: data.nickname,
      avatar: data.avatar,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      createTime: data.createTime,
      lastLogin: data.lastLoginTime,  // 后端字段名：lastLoginTime
      loginCount: data.loginCount
    };
    
    console.log('[getAdminInfo] 映射后的数据:', mappedData);
    response.data = mappedData;
  } else {
    console.warn('[getAdminInfo] 响应数据异常:', {
      success: response.success,
      hasData: !!response.data,
      response
    });
  }
  
  return response as ApiResponse<AdminInfo>;
}

/**
 * 更新管理员信息
 * Source: AdminController.updateAdminInfo() - /admin/update
 */
export async function updateAdminInfo(
  data: AdminInfoUpdateParams
): Promise<ApiResponse<void>> {
  return fetchApi<void>('/admin/update', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * 修改密码
 * Source: AdminController.updatePassword() - /admin/password
 */
export async function updatePassword(
  params: PasswordChangeParams
): Promise<ApiResponse<void>> {
  return fetchApi<void>('/admin/password', {
    method: 'PUT',
    body: JSON.stringify({
      oldPassword: params.oldPassword,
      newPassword: params.newPassword
    })
  });
}

/**
 * 上传头像
 * Source: AdminController.uploadAvatar() - /admin/avatar/upload
 */
export async function uploadAvatar(file: File): Promise<ApiResponse<string>> {
  const formData = new FormData();
  formData.append('file', file);
  
  return fetchApi<string>('/admin/avatar/upload', {
    method: 'POST',
    body: formData,
    headers: {
      // 移除 Content-Type，让浏览器自动设置 multipart/form-data
    }
  });
}

/**
 * 获取管理员统计信息
 * Source: AdminController.getAdminStatistics() - /admin/statistics
 */
export async function getAdminStatistics(): Promise<ApiResponse<AdminStatistics>> {
  return fetchApi<AdminStatistics>('/admin/statistics');
}

/**
 * 获取登录记录
 * Source: AdminController.getLoginRecords() - /admin/login-records
 */
export async function getLoginRecords(
  params: ProfileQueryParams
): Promise<ApiResponse<PageResponse<LoginRecord>>> {
  return fetchApi<PageResponse<LoginRecord>>('/admin/login-records', { params });
}

/**
 * 获取操作记录
 * Source: AdminController.getOperationRecords() - /admin/operation-records
 */
export async function getOperationRecords(
  params: ProfileQueryParams
): Promise<ApiResponse<PageResponse<OperationRecord>>> {
  return fetchApi<PageResponse<OperationRecord>>('/admin/operation-records', { params });
}

/**
 * 获取24小时活跃度统计
 * 注意：后端在 statistics 接口中返回 activeHours 字段
 */
export async function getHourlyActivity(days: number = 7): Promise<ApiResponse<number[]>> {
  // 从统计接口中获取活跃度数据
  const response = await getAdminStatistics();
  if (response.success && response.data) {
    return {
      success: true,
      data: (response.data as any).activeHours || []
    } as ApiResponse<number[]>;
  }
  return response as any;
}

/**
 * 获取系统日志列表
 * Source: AdminController.getSystemLogs() - /admin/system/logs
 */
export async function getSystemLogs(
  params: ProfileQueryParams & { level?: string }
): Promise<ApiResponse<PageResponse<any>>> {
  return fetchApi<PageResponse<any>>('/admin/system/logs', { params });
}

/**
 * 获取系统日志详情
 * Source: AdminController.getSystemLogDetail() - /admin/system/logs/{id}
 */
export async function getSystemLogDetail(id: number): Promise<ApiResponse<any>> {
  return fetchApi<any>(`/admin/system/logs/${id}`);
}

/**
 * 导出登录记录
 * Source: Swagger /admin/login-records/export
 */
export async function exportLoginRecords(params: ProfileQueryParams): Promise<Blob> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login-records/export?${new URLSearchParams(params as any)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('导出失败');
  }
  
  return response.blob();
}

/**
 * 导出操作记录
 * Source: Swagger /admin/operation-records/export
 */
export async function exportOperationRecords(params: ProfileQueryParams): Promise<Blob> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/operation-records/export?${new URLSearchParams(params as any)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('导出失败');
  }
  
  return response.blob();
}

/**
 * 发送通知
 * Source: Swagger /admin/notification/send
 */
export async function sendNotification(data: any): Promise<ApiResponse<void>> {
  return fetchApi<void>('/admin/notification/send', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 推送统计数据
 * Source: Swagger /admin/stats/push
 */
export async function pushStatistics(data: any): Promise<ApiResponse<void>> {
  return fetchApi<void>('/admin/stats/push', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * 获取WebSocket状态
 * Source: Swagger /admin/websocket/status
 */
export async function getWebSocketStatus(): Promise<ApiResponse<any>> {
  return fetchApi<any>('/admin/websocket/status');
}

// 导出为对象形式（兼容性）
export const profileApi = {
  getAdminInfo,
  updateAdminInfo,
  updatePassword,
  uploadAvatar,
  getAdminStatistics,
  getLoginRecords,
  getOperationRecords,
  getHourlyActivity,
  getSystemLogs,
  getSystemLogDetail,
  exportLoginRecords,
  exportOperationRecords,
  sendNotification,
  pushStatistics,
  getWebSocketStatus
};
