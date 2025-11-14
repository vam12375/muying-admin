/**
 * 消息管理类型定义
 * Message Management Type Definitions
 * 
 * Source: 基于后端 API 和旧系统 messageSlice
 */

/**
 * 消息类型枚举
 */
export type MessageType = 'system' | 'order' | 'promotion' | 'notification';

/**
 * 消息状态枚举
 */
export type MessageStatus = 'draft' | 'sent' | 'read';

/**
 * 消息接收者类型
 */
export type RecipientType = 'all' | 'specific' | 'group';

/**
 * 消息信息
 */
export interface Message {
  messageId: number;              // 消息ID
  title: string;                  // 消息标题
  content: string;                // 消息内容
  type: MessageType;              // 消息类型
  status: MessageStatus;          // 消息状态
  recipientType: RecipientType;   // 接收者类型
  recipientIds?: string;          // 接收者ID列表（逗号分隔）
  senderId?: number;              // 发送者ID
  senderName?: string;            // 发送者名称
  isRead?: number;                // 是否已读：0-未读，1-已读
  readCount?: number;             // 已读数量
  totalCount?: number;            // 总接收数量
  createTime?: string;            // 创建时间
  updateTime?: string;            // 更新时间
  sendTime?: string;              // 发送时间
}

/**
 * 消息列表查询参数
 */
export interface MessageListParams {
  page?: number;                  // 页码
  pageSize?: number;              // 每页大小
  type?: MessageType;             // 消息类型
  status?: MessageStatus;         // 消息状态
  keyword?: string;               // 搜索关键词
  startTime?: string;             // 开始时间
  endTime?: string;               // 结束时间
}

/**
 * 消息表单数据
 */
export interface MessageFormData {
  title: string;                  // 消息标题（必填）
  content: string;                // 消息内容（必填）
  type: MessageType;              // 消息类型（必填）
  recipientType: RecipientType;   // 接收者类型（必填）
  recipientIds?: string[];        // 接收者ID数组
}

/**
 * 消息统计数据
 */
export interface MessageStatistics {
  totalMessages: number;          // 总消息数
  sentMessages: number;           // 已发送消息数
  draftMessages: number;          // 草稿消息数
  totalReadCount: number;         // 总阅读量
  totalRecipients: number;        // 总覆盖用户数
  avgReadRate?: number;           // 平均阅读率
  typeDistribution?: {            // 消息类型分布
    type: MessageType;
    count: number;
  }[];
}

/**
 * 消息模板信息
 */
export interface MessageTemplate {
  templateId: number;             // 模板ID
  name: string;                   // 模板名称
  type: MessageType;              // 消息类型
  title: string;                  // 消息标题模板
  content: string;                // 消息内容模板
  variables?: string[];           // 模板变量
  description?: string;           // 模板描述
  isDefault?: number;             // 是否默认：0-否，1-是
  createTime?: string;            // 创建时间
  updateTime?: string;            // 更新时间
}

/**
 * 消息模板表单数据
 */
export interface MessageTemplateFormData {
  name: string;                   // 模板名称（必填）
  type: MessageType;              // 消息类型（必填）
  title: string;                  // 消息标题模板（必填）
  content: string;                // 消息内容模板（必填）
  variables?: string[];           // 模板变量
  description?: string;           // 模板描述
  isDefault?: number;             // 是否默认
}
