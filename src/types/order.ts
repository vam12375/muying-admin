/**
 * 订单管理类型定义
 * Order Management Type Definitions
 * 
 * Source: 基于后端 Order 实体和 AdminOrderController
 */

/**
 * 订单状态枚举
 */
export type OrderStatus = 
  | 'pending_payment'    // 待付款
  | 'pending_shipment'   // 待发货
  | 'shipped'            // 已发货
  | 'completed'          // 已完成
  | 'cancelled';         // 已取消

/**
 * 支付方式
 */
export type PaymentMethod = 
  | 'alipay'   // 支付宝
  | 'wechat'   // 微信
  | 'wallet';  // 钱包

/**
 * 订单信息
 * Source: Order.java
 */
export interface Order {
  orderId: number;                    // 订单ID
  orderNo: string;                    // 订单编号
  userId: number;                     // 用户ID
  totalAmount: number;                // 订单总金额
  actualAmount: number;               // 实付金额
  status: OrderStatus;                // 订单状态
  paymentId?: number;                 // 支付ID
  payTime?: string;                   // 支付时间
  paymentMethod?: PaymentMethod;      // 支付方式
  shippingMethod?: string;            // 配送方式
  shippingFee?: number;               // 运费
  addressId?: number;                 // 收货地址ID
  receiverName?: string;              // 收货人姓名
  receiverPhone?: string;             // 收货人电话
  receiverProvince?: string;          // 省份
  receiverCity?: string;              // 城市
  receiverDistrict?: string;          // 区/县
  receiverAddress?: string;           // 详细地址
  receiverZip?: string;               // 邮编
  couponId?: number;                  // 优惠券ID
  couponAmount?: number;              // 优惠券金额
  remark?: string;                    // 订单备注
  discountAmount?: number;            // 优惠金额
  pointsUsed?: number;                // 使用的积分
  pointsDiscount?: number;            // 积分抵扣金额
  paidTime?: string;                  // 支付时间
  shippingTime?: string;              // 发货时间
  trackingNo?: string;                // 物流单号
  shippingCompany?: string;           // 物流公司
  completionTime?: string;            // 完成时间
  cancelTime?: string;                // 取消时间
  cancelReason?: string;              // 取消原因
  isCommented?: number;               // 是否已评价：0-未评价，1-已评价
  isDeleted?: number;                 // 是否删除：0-未删除，1-已删除
  version?: number;                   // 版本号
  createTime?: string;                // 创建时间
  updateTime?: string;                // 更新时间
  products?: OrderProduct[];          // 订单商品列表
  transactionId?: string;             // 支付流水号
  expireTime?: string;                // 支付超时时间
}

/**
 * 订单商品
 * Source: OrderProduct.java
 */
export interface OrderProduct {
  orderProductId: number;             // 订单商品ID
  orderId: number;                    // 订单ID
  productId: number;                  // 商品ID
  productName: string;                // 商品名称
  productImage?: string;              // 商品图片
  price: number;                      // 商品单价
  quantity: number;                   // 购买数量
  subtotal: number;                   // 小计金额
  skuId?: number;                     // SKU ID
  skuName?: string;                   // SKU名称
  specifications?: string;            // 规格信息（JSON）
}

/**
 * 订单列表查询参数
 * Source: AdminOrderController.getOrderList()
 */
export interface OrderListParams {
  page?: number;                      // 页码（默认1）
  pageSize?: number;                  // 每页大小（默认10）
  status?: OrderStatus;               // 订单状态
  orderNo?: string;                   // 订单编号
  userId?: number;                    // 用户ID
}

/**
 * 订单统计数据
 * Source: AdminOrderController.getOrderStatistics()
 */
export interface OrderStatistics {
  total: number;                      // 总订单数
  pending_payment: number;            // 待付款
  pending_shipment: number;           // 待发货
  shipped: number;                    // 已发货
  completed: number;                  // 已完成
  cancelled: number;                  // 已取消
}

/**
 * 订单发货参数
 * Source: AdminOrderController.shipOrder()
 */
export interface ShipOrderParams {
  companyId: number;                  // 物流公司ID（必填）
  trackingNo?: string;                // 物流单号（可选，不填自动生成）
  receiverName?: string;              // 收件人姓名（可选，不填使用订单信息）
  receiverPhone?: string;             // 收件人电话（可选，不填使用订单信息）
  receiverAddress?: string;           // 收件人地址（可选，不填使用订单信息）
}

/**
 * 物流公司
 * Source: LogisticsCompany.java
 */
export interface LogisticsCompany {
  companyId: number;                  // 物流公司ID
  name: string;                       // 公司名称
  code: string;                       // 公司代码
  phone?: string;                     // 客服电话
  website?: string;                   // 官网地址
  status?: number;                    // 状态：0-禁用，1-启用
}

/**
 * 物流信息
 * Source: Logistics.java
 */
export interface Logistics {
  logisticsId: number;                // 物流ID
  orderId: number;                    // 订单ID
  companyId: number;                  // 物流公司ID
  trackingNo: string;                 // 物流单号
  receiverName: string;               // 收件人姓名
  receiverPhone: string;              // 收件人电话
  receiverAddress: string;            // 收件人地址
  status?: string;                    // 物流状态
  currentLocation?: string;           // 当前位置
  createTime?: string;                // 创建时间
  updateTime?: string;                // 更新时间
}

/**
 * 分页响应
 */
export interface OrderPageResponse {
  list: Order[];                      // 订单列表
  total: number;                      // 总记录数
}
