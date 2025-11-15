/**
 * 物流管理类型定义
 * Logistics Management Type Definitions
 * 
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 * Source: 基于后端 LogisticsStatus 枚举和 Logistics 实体
 */

/**
 * 物流状态枚举（与后端保持一致）
 */
export enum LogisticsStatus {
  /** 已创建 */
  CREATED = 'CREATED',
  /** 运输中 */
  SHIPPING = 'SHIPPING',
  /** 已送达 */
  DELIVERED = 'DELIVERED',
  /** 异常 */
  EXCEPTION = 'EXCEPTION'
}

/**
 * 物流状态显示配置
 */
export const LOGISTICS_STATUS_CONFIG: Record<LogisticsStatus, { label: string; color: string; bgColor: string }> = {
  [LogisticsStatus.CREATED]: { label: '已创建', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  [LogisticsStatus.SHIPPING]: { label: '运输中', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  [LogisticsStatus.DELIVERED]: { label: '已送达', color: 'text-green-600', bgColor: 'bg-green-100' },
  [LogisticsStatus.EXCEPTION]: { label: '异常', color: 'text-red-600', bgColor: 'bg-red-100' }
};

/**
 * 物流追踪记录（与后端 LogisticsTrack 实体对应）
 */
export interface LogisticsTrack {
  /** 追踪记录ID */
  id: number;
  /** 物流ID */
  logisticsId: number;
  /** 追踪时间 */
  trackingTime: string;
  /** 位置信息 */
  location?: string;
  /** 状态 */
  status: string;
  /** 内容描述 */
  content: string;
  /** 操作员 */
  operator?: string;
  /** 创建时间 */
  createTime: string;
  /** 详细信息JSON */
  detailsJson?: Record<string, any>;
}

/**
 * 物流信息（与后端 Logistics 实体对应）
 */
export interface Logistics {
  /** 物流ID */
  id: number;
  /** 订单ID */
  orderId: number;
  /** 物流公司ID */
  companyId: number;
  /** 物流单号 */
  trackingNo: string;
  /** 物流状态 */
  status: LogisticsStatus;
  /** 发件人姓名 */
  senderName: string;
  /** 发件人电话 */
  senderPhone: string;
  /** 发件地址 */
  senderAddress: string;
  /** 收件人姓名 */
  receiverName: string;
  /** 收件人电话 */
  receiverPhone: string;
  /** 收件地址 */
  receiverAddress: string;
  /** 发货时间 */
  shippingTime?: string;
  /** 送达时间 */
  deliveryTime?: string;
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
  /** 物流公司信息（关联对象） */
  company?: LogisticsCompany;
  /** 物流追踪记录列表 */
  tracks?: LogisticsTrack[];
  /** 订单信息（关联对象） */
  order?: any;
}

/**
 * 物流查询参数
 */
export interface LogisticsQueryParams {
  /** 当前页码 */
  page?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 物流状态 */
  status?: string;
  /** 搜索关键词 */
  keyword?: string;
}

/**
 * 物流追踪创建参数
 */
export interface LogisticsTrackParams {
  /** 追踪时间 */
  trackingTime?: string;
  /** 位置信息 */
  location?: string;
  /** 状态 */
  status: string;
  /** 内容描述 */
  content: string;
  /** 操作员 */
  operator?: string;
  /** 详细信息JSON */
  detailsJson?: Record<string, any>;
}

/**
 * 物流公司信息
 */
export interface LogisticsCompany {
  /** 物流公司ID */
  id: number;
  /** 公司代码 */
  code: string;
  /** 公司名称 */
  name: string;
  /** 联系人 */
  contact?: string;
  /** 联系电话 */
  phone?: string;
  /** 公司地址 */
  address?: string;
  /** 状态：0-禁用，1-启用 */
  status: number;
  /** Logo地址 */
  logo?: string;
  /** 排序 */
  sortOrder: number;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 物流公司查询参数
 */
export interface LogisticsCompanyQueryParams {
  /** 当前页码 */
  page?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 搜索关键词 */
  keyword?: string;
}
