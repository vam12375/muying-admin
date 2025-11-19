/**
 * 兑换详情模态框
 * Exchange Detail Modal
 * 
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Package, User, MapPin, Truck, Calendar, CreditCard } from 'lucide-react';
import type { PointsExchange } from '@/types/points';

interface ExchangeDetailModalProps {
  open: boolean;
  onClose: () => void;
  exchange: PointsExchange | null;
}

export function ExchangeDetailModal({ open, onClose, exchange }: ExchangeDetailModalProps) {
  if (!exchange) return null;

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-700 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-700 border-purple-200',
      'completed': 'bg-green-100 text-green-700 border-green-200',
      'cancelled': 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'pending': '待处理',
      'processing': '处理中',
      'shipped': '已发货',
      'completed': '已完成',
      'cancelled': '已取消',
    };
    return texts[status] || status;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold">兑换详情</h2>
                  <p className="text-sm text-gray-500 mt-1">订单号：{exchange.orderNo}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* 内容 */}
              <div className="p-6 space-y-6">
                {/* 状态 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">订单状态</span>
                  <span className={`px-3 py-1 text-sm rounded-full border ${getStatusStyle(exchange.status)}`}>
                    {getStatusText(exchange.status)}
                  </span>
                </div>

                {/* 商品信息 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Package className="w-5 h-5" />
                    <span>商品信息</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">商品名称</p>
                      <p className="text-sm font-medium mt-1">{exchange.productName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">兑换数量</p>
                      <p className="text-sm font-medium mt-1">{exchange.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">消耗积分</p>
                      <p className="text-sm font-medium text-blue-600 mt-1">{exchange.points}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">商品ID</p>
                      <p className="text-sm font-medium mt-1">{exchange.productId}</p>
                    </div>
                  </div>
                </div>

                {/* 用户信息 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="w-5 h-5" />
                    <span>用户信息</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">用户名</p>
                      <p className="text-sm font-medium mt-1">{exchange.username || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">用户ID</p>
                      <p className="text-sm font-medium mt-1">{exchange.userId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">联系电话</p>
                      <p className="text-sm font-medium mt-1">{exchange.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">联系人</p>
                      <p className="text-sm font-medium mt-1">{exchange.contact || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* 收货地址 */}
                {exchange.address && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <MapPin className="w-5 h-5" />
                      <span>收货地址</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm">{exchange.address}</p>
                    </div>
                  </div>
                )}

                {/* 物流信息 */}
                {(exchange.trackingNumber || exchange.logisticsCompany) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Truck className="w-5 h-5" />
                      <span>物流信息</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">物流公司</p>
                        <p className="text-sm font-medium mt-1">{exchange.logisticsCompany || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">物流单号</p>
                        <p className="text-sm font-medium mt-1">{exchange.trackingNumber || '-'}</p>
                      </div>
                      {exchange.shipTime && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">发货时间</p>
                          <p className="text-sm font-medium mt-1">{exchange.shipTime}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 时间信息 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Calendar className="w-5 h-5" />
                    <span>时间信息</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">创建时间</p>
                      <p className="text-sm font-medium mt-1">{exchange.createTime?.substring(0, 19)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">更新时间</p>
                      <p className="text-sm font-medium mt-1">{exchange.updateTime?.substring(0, 19)}</p>
                    </div>
                  </div>
                </div>

                {/* 备注 */}
                {exchange.remark && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <CreditCard className="w-5 h-5" />
                      <span>备注信息</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm">{exchange.remark}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部 */}
              <div className="flex items-center justify-end gap-3 p-6 border-t">
                <Button onClick={onClose}>关闭</Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
