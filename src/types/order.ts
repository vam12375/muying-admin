/**
 * 订单相关类型定义
 * Source: 基于后端 Order 实体和旧版本类型定义
 */

/**
 * 订单状态枚举
 */
export type OrderStatus = 
  | 'pending_payment'    // 待支付
  | 'pending_shipment'   // 待发货
  | 'shipped'            // 已发货
  | 'completed'          // 已完成
  | 'cancelled';         // 已取消

/**
 * 支付方式枚举
 */
export type PaymentMethod = 
  | 'alipay'       // 支付宝
  | 'wechat'       // 微信支付
  | 'wallet'       // 钱包支付
  | 'bank'         // 银行卡
  | 'balance'      // 余额支付
  | 'credit_card'  // 信用卡
  | 'cod';         // 货到付款

/**
 * 订单商品信息
 */
export interface OrderProduct {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
  attributes?: string;
  specs?: string;
}

/**
 * 订单基本信息
 */
export interface Order {
  orderId: number;
  orderNo: string;
  userId: number;
  username?: string;
  totalAmount: number;
  actualAmount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentId?: number;
  payTime?: string;
  transactionId?: string;
  
  // 配送信息
  shippingMethod?: string;
  shippingFee: number;
  receiverName: string;
  receiverPhone: string;
  receiverProvince: string;
  receiverCity: string;
  receiverDistrict: string;
  receiverAddress: string;
  receiverZip?: string;
  
  // 优惠信息
  couponId?: number;
  couponAmount: number;
  discountAmount: number;
  pointsUsed: number;
  pointsDiscount: number;
  
  // 物流信息
  trackingNo?: string;
  shippingCompany?: string;
  shippingTime?: string;
  
  // 时间信息
  createTime: string;
  paidTime?: string;
  completionTime?: string;
  cancelTime?: string;
  cancelReason?: string;
  
  // 其他
  remark?: string;
  isCommented: number;
  
  // 关联数据
  products?: OrderProduct[];
}

/**
 * 订单列表查询参数
 */
export interface OrderQueryParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus | '';
  orderNo?: string;
  userId?: number;
  username?: string;
  paymentMethod?: PaymentMethod | '';
  dateRange?: [string, string];
  minAmount?: number;
  maxAmount?: number;
}

/**
 * 订单统计数据
 */
export interface OrderStatistics {
  total: number;
  pending_payment: number;
  pending_shipment: number;
  shipped: number;
  completed: number;
  cancelled: number;
}

/**
 * 发货参数
 */
export interface ShipOrderParams {
  companyId: number;
  trackingNo?: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress?: string;
}

/**
 * 取消订单参数
 */
export interface CancelOrderParams {
  reason: string;
}

/**
 * 物流轨迹信息
 */
export interface LogisticsTrack {
  id: string;
  trackingTime: string;
  location: string;
  content: string;
  operator?: string;
}

/**
 * 订单历史记录
 */
export interface OrderHistory {
  id: string;
  title: string;
  time: string;
  description?: string;
  operator?: string;
  type?: 'success' | 'warning' | 'error' | 'processing' | 'default';
}
