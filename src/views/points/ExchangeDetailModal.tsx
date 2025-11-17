/**
 * 兑换详情模态框
 * Exchange Detail Modal
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { PointsExchange } from '@/types/points';

interface ExchangeDetailModalProps {
  open: boolean;
  onClose: () => void;
  exchange: PointsExchange | null;
}

export function ExchangeDetailModal({ open, onClose, exchange }: ExchangeDetailModalProps) {
  if (!exchange) return null;

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

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">兑换详情</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600">兑换单号</div>
                    <div className="font-semibold">{exchange.orderNo}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">用户</div>
                    <div className="font-semibold">{exchange.username}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">商品名称</div>
                    <div className="font-semibold">{exchange.productName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">兑换数量</div>
                    <div className="font-semibold">{exchange.quantity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">消耗积分</div>
                    <div className="font-semibold text-purple-600">{exchange.points}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">状态</div>
                    <div className="font-semibold">{exchange.status}</div>
                  </div>
                  {exchange.contact && (
                    <div>
                      <div className="text-sm text-slate-600">联系人</div>
                      <div className="font-semibold">{exchange.contact}</div>
                    </div>
                  )}
                  {exchange.phone && (
                    <div>
                      <div className="text-sm text-slate-600">手机号</div>
                      <div className="font-semibold">{exchange.phone}</div>
                    </div>
                  )}
                  {exchange.address && (
                    <div className="col-span-2">
                      <div className="text-sm text-slate-600">收货地址</div>
                      <div className="font-semibold">{exchange.address}</div>
                    </div>
                  )}
                  {exchange.trackingNumber && (
                    <>
                      <div>
                        <div className="text-sm text-slate-600">物流公司</div>
                        <div className="font-semibold">{exchange.logisticsCompany}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">物流单号</div>
                        <div className="font-semibold">{exchange.trackingNumber}</div>
                      </div>
                    </>
                  )}
                  {exchange.remark && (
                    <div className="col-span-2">
                      <div className="text-sm text-slate-600">备注</div>
                      <div className="font-semibold">{exchange.remark}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-slate-600">创建时间</div>
                    <div className="font-semibold">{new Date(exchange.createTime).toLocaleString()}</div>
                  </div>
                  {exchange.shipTime && (
                    <div>
                      <div className="text-sm text-slate-600">发货时间</div>
                      <div className="font-semibold">{new Date(exchange.shipTime).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>

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
