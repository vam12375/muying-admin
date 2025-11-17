/**
 * 售后/退款相关类型定义
 * Refund & After-sales Types
 * 
 * Source: 基于后端 RefundController 和 AdminRefundController
 */

/**
 * 退款状态枚举
 * 根据数据库实际字段定义
 */
export enum RefundStatus {
  /** 待审核 */
  PENDING = 'PENDING',
  /** 审核通过 */
  APPROVED = 'APPROVED',
  /** 审核拒绝 */
  REJECTED = 'REJECTED',
  /** 处理中 */
  PROCESSING = 'PROCESSING',
  /** 已完成 */
  COMPLETED = 'COMPLETED',
  /** 退款失败 */
  FAILED = 'FAILED',
  /** 已取消 */
  CANCELLED = 'CANCELLED',
}

/**
 * 退款类型
 */
export enum RefundType {
  /** 仅退款 */
  REFUND_ONLY = 'REFUND_ONLY',
  /** 退货退款 */
  RETURN_REFUND = 'RETURN_REFUND',
}

/**
 * 退款原因
 */
export enum RefundReason {
  /** 商品质量问题 */
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  /** 商品描述不符 */
  DESCRIPTION_MISMATCH = 'DESCRIPTION_MISMATCH',
  /** 发错货 */
  WRONG_ITEM = 'WRONG_ITEM',
  /** 商品损坏 */
  DAMAGED = 'DAMAGED',
  /** 不想要了 */
  CHANGED_MIND = 'CHANGED_MIND',
  /** 其他原因 */
  OTHER = 'OTHER',
}

/**
 * 退款记录
 * 根据数据库实际字段定义
 */
export interface Refund {
  /** 退款ID */
  id?: number;
  refundId?: number;
  /** 退款单号 */
  refund_no?: string;
  refundNo?: string;
  /** 订单ID */
  order_id?: number;
  orderId?: number;
  /** 订单号 */
  order_no?: string;
  orderNo?: string;
  /** 用户ID */
  user_id?: number;
  userId?: number;
  /** 用户名 */
  username?: string;
  /** 用户对象 */
  user?: {
    userId?: number;
    username?: string;
    nickname?: string;
    email?: string;
  };
  /** 支付ID */
  payment_id?: number;
  paymentId?: number;
  /** 退款金额 */
  amount?: number;
  refundAmount?: number;
  /** 退款原因 */
  refund_reason?: string;
  refundReason?: string;
  /** 退款原因详情 */
  refund_reason_detail?: string;
  refundReasonDetail?: string;
  reasonDescription?: string;
  /** 凭证图片 */
  evidence_images?: string;
  evidenceImages?: string;
  proofImages?: string[];
  /** 退款状态 */
  status: RefundStatus | string;
  /** 拒绝原因 */
  reject_reason?: string;
  rejectReason?: string;
  /** 退款时间 */
  refund_time?: string;
  refundTime?: string;
  /** 退款账户 */
  refund_account?: string;
  refundAccount?: string;
  /** 退款渠道 */
  refund_channel?: string;
  refundChannel?: string;
  /** 交易ID */
  transaction_id?: string;
  transactionId?: string;
  /** 管理员ID */
  admin_id?: number;
  adminId?: number;
  /** 管理员名称 */
  admin_name?: string;
  adminName?: string;
  /** 是否删除 */
  is_deleted?: number;
  isDeleted?: number;
  /** 版本号 */
  version?: number;
  /** 创建时间 */
  create_time?: string;
  createTime?: string;
  /** 更新时间 */
  update_time?: string;
  updateTime?: string;
}

/**
 * 退款申请DTO
 */
export interface RefundApplyDTO {
  /** 订单ID */
  orderId: number;
  /** 退款类型 */
  refundType: RefundType;
  /** 退款原因 */
  refundReason: RefundReason;
  /** 退款原因描述 */
  reasonDescription?: string;
  /** 退款金额 */
  refundAmount: number;
  /** 凭证图片 */
  proofImages?: string[];
}

/**
 * 退款审核DTO
 */
export interface RefundReviewDTO {
  /** 退款ID */
  refundId: number;
  /** 是否通过 */
  approved: boolean;
  /** 审核备注 */
  reviewRemark?: string;
  /** 拒绝原因 */
  rejectReason?: string;
}

/**
 * 退款处理DTO
 * Source: 基于后端 RefundController.processRefund 接口
 */
export interface RefundProcessDTO {
  /** 退款ID */
  refundId: number;
  /** 退款渠道 */
  refundChannel: string;
  /** 退款账号（可选） */
  refundAccount?: string;
}

/**
 * 退款统计
 */
export interface RefundStatistics {
  /** 总申请数 */
  totalCount: number;
  /** 待审核数 */
  pendingCount: number;
  /** 处理中数 */
  processingCount: number;
  /** 已完成数 */
  completedCount: number;
  /** 已拒绝数 */
  rejectedCount: number;
  /** 总退款金额 */
  totalAmount: number;
  /** 今日申请数 */
  todayCount: number;
  /** 今日退款金额 */
  todayAmount: number;
}

/**
 * 退款查询参数
 */
export interface RefundQueryParams {
  /** 页码 */
  page?: number;
  /** 每页大小 */
  size?: number;
  /** 退款状态 */
  status?: RefundStatus;
  /** 退款类型 */
  refundType?: RefundType;
  /** 订单号 */
  orderNo?: string;
  /** 用户ID */
  userId?: number;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
}
