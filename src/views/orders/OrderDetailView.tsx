/**
 * 订单详情视图
 * Source: 基于旧版本 order/detail.tsx，适配 Next.js
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Printer, 
  Download,
  User,
  Phone,
  MapPin,
  Mail,
  CreditCard,
  Clock,
  Package,
  Truck
} from 'lucide-react';
import { OrderStatusTag } from '@/components/orders/OrderStatusTag';
import { OrderFlowChart } from '@/components/orders/OrderFlowChart';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { ShipDialog } from '@/components/orders/ShipDialog';
import { getOrderDetail, shipOrder as shipOrderApi } from '@/lib/api/orders';
import { getLogisticsByOrderId, getLogisticsTracks } from '@/lib/api/logistics';
import type { Order, OrderHistory } from '@/types/order';
import type { Logistics, LogisticsTrack } from '@/types/logistics';
import { showInfo } from '@/lib/utils/toast';
import { formatDate, formatPrice } from '@/lib/utils';
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { toast } from '@/hooks/use-toast';

interface OrderDetailViewProps {
  orderId: string;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [shipDialogOpen, setShipDialogOpen] = useState(false);
  const [logisticsInfo, setLogisticsInfo] = useState<Logistics | null>(null);
  const [logisticsTracks, setLogisticsTracks] = useState<LogisticsTrack[]>([]);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await getOrderDetail(orderId);
      if (response.success && response.data) {
        setOrder(response.data);
        generateOrderHistory(response.data);
        
        // 如果订单已发货，获取物流信息
        if (response.data.status === 'shipped' || response.data.status === 'completed') {
          fetchLogisticsInfo(response.data.orderId);
        }
      }
    } catch (error) {
      console.error('获取订单详情失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取物流信息和追踪记录
  const fetchLogisticsInfo = async (orderId: number) => {
    try {
      const logistics = await getLogisticsByOrderId(orderId);
      if (logistics) {
        setLogisticsInfo(logistics);
        // 获取物流追踪记录
        const tracks = await getLogisticsTracks(logistics.id);
        setLogisticsTracks(tracks);
        // 重新生成订单历史，包含物流轨迹
        if (order) {
          generateOrderHistory(order, tracks);
        }
      }
    } catch (error) {
      console.error('获取物流信息失败:', error);
    }
  };
  
  // 生成订单历史记录（包含物流轨迹）
  const generateOrderHistory = (orderData: Order, tracks: LogisticsTrack[] = []) => {
    const history: OrderHistory[] = [
      {
        id: '1',
        title: '订单创建',
        time: formatDate(orderData.createTime, 'datetime'),
        description: `订单号: ${orderData.orderNo}`,
        type: 'default'
      }
    ];
    
    if (orderData.payTime) {
      history.push({
        id: '2',
        title: '订单支付',
        time: formatDate(orderData.payTime, 'datetime'),
        description: `支付方式: ${getPaymentMethodText(orderData.paymentMethod)}`,
        type: 'success'
      });
    }
    
    if (orderData.status === 'shipped' || orderData.status === 'completed') {
      history.push({
        id: '3',
        title: '订单发货',
        time: orderData.shippingTime ? formatDate(orderData.shippingTime, 'datetime') : '-',
        description: `物流公司: ${orderData.shippingCompany || '-'}, 物流单号: ${orderData.trackingNo || '-'}`,
        type: 'processing'
      });
      
      // 添加物流追踪记录
      if (tracks && tracks.length > 0) {
        // 按时间倒序排列（最新的在前）
        const sortedTracks = [...tracks].sort((a, b) => 
          new Date(b.trackingTime).getTime() - new Date(a.trackingTime).getTime()
        );
        
        sortedTracks.forEach((track, index) => {
          history.push({
            id: `track-${track.id}`,
            title: track.status,
            time: formatDate(track.trackingTime, 'datetime'),
            description: track.content + (track.location ? ` · ${track.location}` : ''),
            type: index === 0 ? 'processing' : 'default'
          });
        });
      }
    }
    
    if (orderData.status === 'completed') {
      history.push({
        id: '4',
        title: '订单完成',
        time: orderData.completionTime ? formatDate(orderData.completionTime, 'datetime') : '-',
        description: '订单已完成，感谢您的购买！',
        type: 'success'
      });
    }
    
    if (orderData.status === 'cancelled') {
      history.push({
        id: '5',
        title: '订单取消',
        time: orderData.cancelTime ? formatDate(orderData.cancelTime, 'datetime') : '-',
        description: orderData.cancelReason || '订单已取消',
        type: 'error'
      });
    }
    
    setOrderHistory(history);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    showInfo('导出功能待实现');
  };
  
  // 发货
  const handleShip = () => {
    setShipDialogOpen(true);
  };
  
  // 确认发货
  const handleConfirmShip = async (data: any) => {
    if (!order) return;
    
    try {
      const response = await shipOrderApi(order.orderId, data);
      if (response.success) {
        toast({
          title: '发货成功',
          description: '订单已成功发货',
          variant: 'default'
        });
        fetchOrderDetail();
      } else {
        throw new Error(response.message || '发货失败');
      }
    } catch (error: any) {
      toast({
        title: '发货失败',
        description: error.message || '发货操作失败，请重试',
        variant: 'destructive'
      });
      throw error;
    }
  };
  
  // 获取订单流程节点数据
  const getOrderFlowNodes = () => {
    if (!order) return [];
    
    const baseNodes = [
      {
        key: 'created',
        title: '下单',
        time: formatDate(order.createTime, 'datetime'),
        status: 'completed' as const
      },
      {
        key: 'paid',
        title: '支付',
        time: order.payTime ? formatDate(order.payTime, 'datetime') : '',
        status: 'waiting' as const
      },
      {
        key: 'shipped',
        title: '发货',
        time: order.shippingTime ? formatDate(order.shippingTime, 'datetime') : '',
        status: 'waiting' as const
      },
      {
        key: 'completed',
        title: '完成',
        time: order.completionTime ? formatDate(order.completionTime, 'datetime') : '',
        status: 'waiting' as const
      }
    ];
    
    // 根据订单状态设置节点状态
    if (order.status === 'pending_payment') {
      // 待支付
    } else if (order.status === 'pending_shipment') {
      baseNodes[1].status = 'completed';
    } else if (order.status === 'shipped') {
      baseNodes[1].status = 'completed';
      baseNodes[2].status = 'completed';
    } else if (order.status === 'completed') {
      baseNodes[1].status = 'completed';
      baseNodes[2].status = 'completed';
      baseNodes[3].status = 'completed';
    } else if (order.status === 'cancelled') {
      return [
        {
          key: 'created',
          title: '下单',
          time: formatDate(order.createTime, 'datetime'),
          status: 'completed' as const
        },
        {
          key: 'cancelled',
          title: '已取消',
          time: order.cancelTime ? formatDate(order.cancelTime, 'datetime') : '',
          status: 'failed' as const
        }
      ];
    }
    
    return baseNodes;
  };

  // 获取支付方式文本
  const getPaymentMethodText = (method?: string) => {
    const map: Record<string, string> = {
      'alipay': '支付宝',
      'wechat': '微信支付',
      'wallet': '钱包支付',
      'bank': '银行卡',
      'balance': '余额支付',
      'credit_card': '信用卡',
      'cod': '货到付款'
    };
    return map[method || ''] || method || '未支付';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg bg-white p-12 text-center shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">未找到订单信息</h2>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              返回订单列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* 页面标题 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              返回
            </button>
            <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
          </div>
          <div className="flex gap-2">
            {order.status === 'pending_shipment' && (
              <button
                onClick={handleShip}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Truck className="h-4 w-4" />
                发货
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300"
            >
              <Printer className="h-4 w-4" />
              打印
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300"
            >
              <Download className="h-4 w-4" />
              导出
            </button>
          </div>
        </div>

        {/* 订单流程 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <OrderFlowChart
            currentNodeKey={order.status}
            nodes={getOrderFlowNodes()}
          />
        </motion.div>

        {/* 订单信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-lg bg-white p-6 shadow-sm border border-gray-200"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">订单信息</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-sm text-gray-500">订单编号</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{order.orderNo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">下单时间</div>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(order.createTime, 'datetime')}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">订单状态</div>
              <div className="mt-1">
                <OrderStatusTag status={order.status} />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">订单金额</div>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {formatPrice(order.totalAmount)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">实付金额</div>
              <div className="mt-1 text-sm font-semibold text-red-600">
                {formatPrice(order.actualAmount)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">支付方式</div>
              <div className="mt-1 text-sm font-medium text-gray-900">
                {getPaymentMethodText(order.paymentMethod)}
              </div>
            </div>
            {order.payTime && (
              <div>
                <div className="text-sm text-gray-500">支付时间</div>
                <div className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(order.payTime, 'datetime')}
                </div>
              </div>
            )}
            {order.transactionId && (
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">支付流水号</div>
                <div className="mt-1 text-sm font-medium text-gray-900">{order.transactionId}</div>
              </div>
            )}
            {order.remark && (
              <div className="md:col-span-3">
                <div className="text-sm text-gray-500">订单备注</div>
                <div className="mt-1 text-sm font-medium text-gray-900">{order.remark}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 收货信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-lg bg-white p-6 shadow-sm border border-gray-200"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">收货信息</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">收货人:</span>
              <span className="text-sm font-medium text-gray-900">{order.receiverName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">联系电话:</span>
              <span className="text-sm font-medium text-gray-900">{order.receiverPhone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <span className="text-sm text-gray-500">收货地址:</span>
              <span className="text-sm font-medium text-gray-900">
                {order.receiverProvince} {order.receiverCity} {order.receiverDistrict} {order.receiverAddress}
              </span>
            </div>
            {order.receiverZip && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">邮编:</span>
                <span className="text-sm font-medium text-gray-900">{order.receiverZip}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 商品信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 rounded-lg bg-white p-6 shadow-sm border border-gray-200"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">商品信息</h2>
          {order.products && order.products.length > 0 ? (
            <div className="space-y-4">
              {order.products.map((product) => (
                <div key={product.id} className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  {/* 商品图片 */}
                  <div className="flex-shrink-0">
                    <OptimizedImage
                      src={product.productImg || product.productImage}
                      alt={product.productName}
                      className="h-24 w-24 rounded-lg object-cover border border-gray-200 bg-gray-50"
                      folder="products"
                      width={96}
                      height={96}
                      lazy={false}
                    />
                  </div>
                  
                  {/* 商品详细信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{product.productName}</h3>
                    
                    {/* 商品规格/属性 */}
                    {product.specs && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {(() => {
                          try {
                            const specsObj = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;
                            return Object.entries(specsObj).map(([key, value], index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {key}: {String(value)}
                              </span>
                            ));
                          } catch {
                            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {product.specs}
                            </span>;
                          }
                        })()}
                      </div>
                    )}
                    
                    {/* 价格和数量信息 */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">单价:</span>
                        <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">数量:</span>
                        <span className="font-medium text-gray-900">×{product.quantity}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 小计金额 */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs text-gray-500 mb-1">小计</div>
                    <div className="text-lg font-bold text-red-600">
                      {formatPrice(product.price * product.quantity)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 金额汇总 */}
              <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">商品总价:</span>
                  <span className="text-gray-900">{formatPrice(order.totalAmount)}</span>
                </div>
                {order.shippingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">运费:</span>
                    <span className="text-gray-900">{formatPrice(order.shippingFee)}</span>
                  </div>
                )}
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">优惠金额:</span>
                    <span className="text-green-600">-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                {order.couponAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">优惠券抵扣:</span>
                    <span className="text-green-600">-{formatPrice(order.couponAmount)}</span>
                  </div>
                )}
                {order.pointsDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">积分抵扣 ({order.pointsUsed}积分):</span>
                    <span className="text-green-600">-{formatPrice(order.pointsDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold">
                  <span className="text-gray-900">实付金额:</span>
                  <span className="text-red-600">{formatPrice(order.actualAmount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">暂无商品数据</div>
          )}
        </motion.div>

        {/* 物流信息 */}
        {(order.status === 'shipped' || order.status === 'completed') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-900">物流信息</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">物流公司:</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.shippingCompany || '顺丰速运'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">物流单号:</span>
                <span className="text-sm font-medium text-gray-900">
                  {order.trackingNo || '-'}
                </span>
              </div>
              {order.shippingTime && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">发货时间:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(order.shippingTime, 'datetime')}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* 订单动态 */}
        {orderHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
          >
            <OrderTimeline title="订单动态" items={orderHistory} />
          </motion.div>
        )}
      </div>
      
      {/* 发货对话框 */}
      {order && (
        <ShipDialog
          open={shipDialogOpen}
          onClose={() => setShipDialogOpen(false)}
          onConfirm={handleConfirmShip}
          orderNo={order.orderNo}
          defaultReceiver={{
            name: order.receiverName,
            phone: order.receiverPhone,
            address: `${order.receiverProvince} ${order.receiverCity} ${order.receiverDistrict} ${order.receiverAddress}`
          }}
        />
      )}
    </div>
  );
}
