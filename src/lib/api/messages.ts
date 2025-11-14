/**
 * 消息管理 API
 * Message Management API
 * 
 * Source: 基于 Swagger 文档和旧系统 message.ts
 */

import { fetchApi } from './index';
import type { 
  Message, 
  MessageListParams, 
  MessageFormData, 
  MessageStatistics,
  MessageTemplate,
  MessageTemplateFormData
} from '@/types/message';
import type { PageResult } from '@/types/common';

/**
 * 获取消息列表
 * GET /admin/message/list
 */
export async function getMessageList(
  params: MessageListParams
): Promise<PageResult<Message>> {
  const response = await fetchApi('/admin/message/list', {
    params
  });
  return response.data;
}

/**
 * 获取消息详情
 * GET /admin/message/{id}
 */
export async function getMessageDetail(
  id: number
): Promise<Message> {
  const response = await fetchApi(`/admin/message/${id}`);
  return response.data;
}

/**
 * 创建系统消息
 * POST /admin/message/system
 */
export async function createMessage(
  data: MessageFormData
): Promise<Message> {
  const response = await fetchApi('/admin/message/system', {
    method: 'POST',
    params: {
      title: data.title,
      content: data.content,
      type: data.type,
      recipientType: data.recipientType,
      recipientIds: data.recipientIds?.join(',')
    }
  });
  return response.data;
}

/**
 * 删除消息
 * DELETE /admin/message/{id}
 */
export async function deleteMessage(
  id: number
): Promise<void> {
  await fetchApi(`/admin/message/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 标记消息为已读
 * PUT /admin/message/read
 */
export async function markMessageAsRead(
  id: number
): Promise<void> {
  await fetchApi('/admin/message/read', {
    method: 'PUT',
    params: { id }
  });
}

/**
 * 标记所有消息为已读
 * PUT /admin/message/readAll
 */
export async function markAllMessagesAsRead(): Promise<void> {
  await fetchApi('/admin/message/readAll', {
    method: 'PUT'
  });
}

/**
 * 获取未读消息数量
 * GET /admin/message/unread/count
 */
export async function getUnreadCount(): Promise<number> {
  const response = await fetchApi('/admin/message/unread/count');
  return response.data;
}

/**
 * 获取消息统计数据
 * 注意：此接口可能需要后端实现
 */
export async function getMessageStatistics(): Promise<MessageStatistics> {
  try {
    const response = await fetchApi('/admin/message/statistics');
    return response.data;
  } catch (error) {
    // 如果后端未实现，返回默认值
    console.warn('消息统计接口未实现，返回默认值');
    return {
      totalMessages: 0,
      sentMessages: 0,
      draftMessages: 0,
      totalReadCount: 0,
      totalRecipients: 0
    };
  }
}

/**
 * 获取发货提醒消息
 * GET /admin/message/shipping-reminder
 */
export async function getShippingReminders(): Promise<Message[]> {
  const response = await fetchApi('/admin/message/shipping-reminder');
  return response.data;
}

// ==================== 消息模板相关 API ====================

/**
 * 获取消息模板列表
 */
export async function getMessageTemplateList(
  params: MessageListParams
): Promise<PageResult<MessageTemplate>> {
  try {
    const response = await fetchApi('/admin/message/template/list', {
      params
    });
    return response.data;
  } catch (error) {
    // 如果后端未实现，返回空列表
    console.warn('消息模板接口未实现');
    return {
      records: [],
      total: 0,
      current: 1,
      size: 10,
      pages: 0
    };
  }
}

/**
 * 获取消息模板详情
 */
export async function getMessageTemplateDetail(
  id: number
): Promise<MessageTemplate> {
  const response = await fetchApi(`/admin/message/template/${id}`);
  return response.data;
}

/**
 * 创建消息模板
 */
export async function createMessageTemplate(
  data: MessageTemplateFormData
): Promise<MessageTemplate> {
  const response = await fetchApi('/admin/message/template', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.data;
}

/**
 * 更新消息模板
 */
export async function updateMessageTemplate(
  id: number,
  data: Partial<MessageTemplateFormData>
): Promise<MessageTemplate> {
  const response = await fetchApi(`/admin/message/template/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.data;
}

/**
 * 删除消息模板
 */
export async function deleteMessageTemplate(
  id: number
): Promise<void> {
  await fetchApi(`/admin/message/template/${id}`, {
    method: 'DELETE'
  });
}
