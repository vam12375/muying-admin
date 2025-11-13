/**
 * 优惠券类型定义
 * Coupon Type Definitions
 * Source: 基于后端 CouponDTO 和旧系统实现
 */

/**
 * 优惠券类型枚举
 */
export enum CouponType {
  FIXED = 'FIXED',           // 固定金额
  PERCENTAGE = 'PERCENTAGE', // 折扣比例
}

/**
 * 优惠券状态枚举
 */
export enum CouponStatus {
  ACTIVE = 'ACTIVE',         // 生效中
  INACTIVE = 'INACTIVE',     // 未生效
  EXPIRED = 'EXPIRED',       // 已过期
}

/**
 * 优惠券信息
 */
export interface Coupon {
  id: number;                // 优惠券ID
  name: string;              // 优惠券名称
  description?: string;      // 优惠券描述
  type: CouponType;          // 优惠券类型
  value: number;             // 优惠值(金额或折扣)
  minSpend: number;          // 最低消费金额
  maxDiscount?: number;      // 最大折扣金额(仅折扣券)
  totalQuantity: number;     // 发行总量
  receivedQuantity: number;  // 已领取数量
  usedQuantity: number;      // 已使用数量
  userLimit: number;         // 每用户领取限制
  isStackable: number;       // 是否可叠加(0-否,1-是)
  status: CouponStatus;      // 状态
  startTime?: string;        // 开始时间
  endTime?: string;          // 结束时间
  categoryIds?: string;      // 适用分类ID(逗号分隔)
  brandIds?: string;         // 适用品牌ID(逗号分隔)
  productIds?: string;       // 适用商品ID(逗号分隔)
  batchId?: number;          // 批次ID
  ruleId?: number;           // 规则ID
  createTime?: string;       // 创建时间
  updateTime?: string;       // 更新时间
}

/**
 * 优惠券列表查询参数
 */
export interface CouponListParams {
  page?: number;             // 页码
  pageSize?: number;         // 每页大小
  name?: string;             // 优惠券名称
  type?: CouponType;         // 优惠券类型
  status?: CouponStatus;     // 状态
  startTime?: string;        // 开始时间
  endTime?: string;          // 结束时间
}

/**
 * 优惠券表单数据
 */
export interface CouponFormData {
  name: string;              // 优惠券名称(必填)
  description?: string;      // 优惠券描述
  type: CouponType;          // 优惠券类型(必填)
  value: number;             // 优惠值(必填)
  minSpend: number;          // 最低消费金额(必填)
  maxDiscount?: number;      // 最大折扣金额
  totalQuantity: number;     // 发行总量(必填)
  userLimit: number;         // 每用户领取限制(必填)
  isStackable: number;       // 是否可叠加(必填)
  status: CouponStatus;      // 状态(必填)
  startTime?: string;        // 开始时间
  endTime?: string;          // 结束时间
  categoryIds?: string[] | string;    // 适用分类ID（数组或逗号分隔字符串）
  brandIds?: string[] | string;       // 适用品牌ID（数组或逗号分隔字符串）
  productIds?: string[] | string;     // 适用商品ID（数组或逗号分隔字符串）
  batchId?: number;          // 批次ID
  ruleId?: number;           // 规则ID
}

/**
 * 优惠券统计数据
 */
export interface CouponStats {
  totalCoupons: number;      // 优惠券总数
  activeCoupons: number;     // 生效中的优惠券数
  receivedCount: number;     // 已领取总数
  usedCoupons: number;       // 已使用总数
  expiredCoupons: number;    // 已过期总数
  usageRate?: number;        // 使用率(百分比)
}
