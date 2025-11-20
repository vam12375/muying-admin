/**
 * 物流管理 API 服务
 * Logistics Management API Service
 * 
 * 
 * Source: 基于 muying-admin-react/src/api/logistics.ts，适配 Next.js fetchApi
 */

import { fetchApi } from './index';
import type { 
  Logistics, 
  LogisticsStatus,
  LogisticsCompany,
  LogisticsTrack,
  LogisticsQueryParams,
  LogisticsCompanyQueryParams,
  LogisticsTrackParams
} from '@/types/logistics';
import type { PageResult } from '@/types/common';

// ==================== 物流信息管理 API ====================

/**
 * 获取物流列表
 * @param params 查询参数
 */
export async function getLogisticsList(params: LogisticsQueryParams): Promise<PageResult<Logistics>> {
  try {
    const response = await fetchApi<any>('/api/admin/logistics', {
      method: 'GET',
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        status: params.status,
        keyword: params.keyword
      }
    });

    // 后端返回格式: { list: [], total: number }
    // 转换为前端 PageResult 格式
    const data = response.data;
    return {
      records: data?.list || [],
      total: data?.total || 0,
      current: params.page || 1,
      size: params.pageSize || 10,
      pages: Math.ceil((data?.total || 0) / (params.pageSize || 10))
    };
  } catch (error) {
    console.error('获取物流列表失败:', error);
    throw error;
  }
}

/**
 * 获取物流详情
 * @param id 物流ID
 */
export async function getLogisticsDetail(id: number | string): Promise<Logistics> {
  try {
    const response = await fetchApi<Logistics>(`/api/admin/logistics/${id}`, {
      method: 'GET'
    });
    return response.data!;
  } catch (error) {
    console.error('获取物流详情失败:', error);
    throw error;
  }
}

/**
 * 根据订单ID获取物流信息
 * @param orderId 订单ID
 */
export async function getLogisticsByOrderId(orderId: number | string): Promise<Logistics> {
  try {
    const response = await fetchApi<Logistics>(`/api/admin/logistics/order/${orderId}`, {
      method: 'GET'
    });
    return response.data!;
  } catch (error) {
    console.error('根据订单获取物流信息失败:', error);
    throw error;
  }
}

/**
 * 更新物流状态
 * @param id 物流ID
 * @param status 物流状态
 * @param remark 备注
 */
export async function updateLogisticsStatus(
  id: number | string, 
  status: string, 
  remark?: string
): Promise<void> {
  try {
    console.log(`更新物流状态，ID: ${id}，状态: ${status}，备注: ${remark || '无'}`);
    
    await fetchApi<void>(`/api/admin/logistics/${id}/status`, {
      method: 'PUT',
      params: { status, remark }
    });
  } catch (error) {
    console.error('更新物流状态失败:', error);
    throw error;
  }
}

// ==================== 物流公司管理 API ====================

/**
 * 获取物流公司列表
 * @param params 查询参数
 */
export async function getLogisticsCompanies(params?: LogisticsCompanyQueryParams): Promise<PageResult<LogisticsCompany>> {
  try {
    const response = await fetchApi<any>('/api/admin/logistics/companies', {
      method: 'GET',
      params: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        keyword: params?.keyword
      }
    });

    // 后端返回格式: { list: [], total: number }
    const data = response.data;
    return {
      records: data?.list || [],
      total: data?.total || 0,
      current: params?.page || 1,
      size: params?.pageSize || 10,
      pages: Math.ceil((data?.total || 0) / (params?.pageSize || 10))
    };
  } catch (error) {
    console.error('获取物流公司列表失败:', error);
    throw error;
  }
}

/**
 * 获取所有启用的物流公司
 */
export async function getEnabledLogisticsCompanies(): Promise<LogisticsCompany[]> {
  try {
    const response = await fetchApi<LogisticsCompany[]>('/api/admin/logistics/companies/enabled', {
      method: 'GET'
    });
    return response.data!;
  } catch (error) {
    console.error('获取启用的物流公司失败:', error);
    throw error;
  }
}

/**
 * 添加物流公司
 * @param data 物流公司数据
 */
export async function addLogisticsCompany(data: Partial<LogisticsCompany>): Promise<void> {
  try {
    console.log('添加物流公司:', data);
    
    await fetchApi<void>('/api/admin/logistics/companies', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('添加物流公司失败:', error);
    throw error;
  }
}

/**
 * 更新物流公司
 * @param id 物流公司ID
 * @param data 更新数据
 */
export async function updateLogisticsCompany(id: number | string, data: Partial<LogisticsCompany>): Promise<void> {
  try {
    console.log(`更新物流公司，ID: ${id}，数据:`, data);
    
    await fetchApi<void>(`/api/admin/logistics/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('更新物流公司失败:', error);
    throw error;
  }
}

/**
 * 删除物流公司
 * @param id 物流公司ID
 */
export async function deleteLogisticsCompany(id: number | string): Promise<void> {
  try {
    console.log(`删除物流公司，ID: ${id}`);
    
    await fetchApi<void>(`/api/admin/logistics/companies/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('删除物流公司失败:', error);
    throw error;
  }
}

// ==================== 物流轨迹管理 API ====================

/**
 * 获取物流轨迹列表
 * @param logisticsId 物流ID
 */
export async function getLogisticsTracks(logisticsId: number | string): Promise<LogisticsTrack[]> {
  try {
    const response = await fetchApi<LogisticsTrack[]>(`/api/admin/logistics/${logisticsId}/tracks`, {
      method: 'GET'
    });
    return response.data!;
  } catch (error) {
    console.error('获取物流轨迹失败:', error);
    throw error;
  }
}

/**
 * 添加物流轨迹
 * @param logisticsId 物流ID
 * @param track 轨迹信息
 */
export async function addLogisticsTrack(logisticsId: number | string, track: LogisticsTrackParams): Promise<void> {
  try {
    console.log(`准备添加物流轨迹，物流ID: ${logisticsId}，轨迹信息:`, track);
    
    // 确保trackingTime字段格式正确
    const processedTrack = { ...track };
    if (processedTrack.trackingTime && typeof processedTrack.trackingTime === 'object') {
      processedTrack.trackingTime = (processedTrack.trackingTime as any).format('YYYY-MM-DD HH:mm:ss');
    }
    
    await fetchApi<void>(`/api/admin/logistics/${logisticsId}/tracks`, {
      method: 'POST',
      body: JSON.stringify(processedTrack)
    });
  } catch (error) {
    console.error('物流轨迹API请求失败:', error);
    throw error;
  }
}

/**
 * 生成物流单号
 * @param companyCode 物流公司代码
 */
export async function generateTrackingNo(companyCode: string): Promise<string> {
  try {
    const response = await fetchApi<string>('/api/admin/logistics/generateTrackingNo', {
      method: 'GET',
      params: { companyCode }
    });
    return response.data!;
  } catch (error) {
    console.error('生成物流单号失败:', error);
    throw error;
  }
}

/**
 * 批量添加物流轨迹
 * @param logisticsId 物流ID
 * @param tracks 轨迹列表
 */
export async function batchAddLogisticsTracks(logisticsId: number | string, tracks: LogisticsTrackParams[]): Promise<LogisticsTrack[]> {
  try {
    console.log(`准备批量添加物流轨迹，物流ID: ${logisticsId}，轨迹数量: ${tracks.length}`);
    
    // 确保每个轨迹中trackingTime字段格式正确
    const processedTracks = tracks.map(track => {
      const processedTrack = { ...track };
      if (processedTrack.trackingTime && typeof processedTrack.trackingTime === 'object') {
        processedTrack.trackingTime = (processedTrack.trackingTime as any).format('YYYY-MM-DD HH:mm:ss');
      }
      return processedTrack;
    });
    
    const response = await fetchApi<LogisticsTrack[]>(`/api/admin/logistics/${logisticsId}/batch-tracks`, {
      method: 'POST',
      body: JSON.stringify(processedTracks)
    });
    
    return response.data!;
  } catch (error) {
    console.error('批量添加物流轨迹API请求失败:', error);
    throw error;
  }
}