/**
 * 兑换发货模态框
 * Ship Exchange Modal
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pointsApi } from '@/lib/api/points';
import { showSuccess, showError } from '@/lib/utils/toast';
import { X } from 'lucide-react';
import type { PointsExchange } from '@/types/points';

interface ShipExchangeModalProps {
  open: boolean;
  onClose: () => void;
  exchange: PointsExchange | null;
  onSuccess: () => void;
}

export function ShipExchangeModal({ open, onClose, exchange, onSuccess }: ShipExchangeModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    logisticsCompany: '',
    trackingNumber: '',
    shipRemark: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.logisticsCompany.trim()) {
      showError('请输入物流公司');
      return;
    }

    if (!formData.trackingNumber.trim()) {
      showError('请输入物流单号');
      return;
    }

    if (!exchange) return;

    setLoading(true);
    try {
      await pointsApi.shipExchange(exchange.id, {
        logisticsCompany: formData.logisticsCompany.trim(),
        trackingNumber: formData.trackingNumber.trim(),
        shipRemark: formData.shipRemark.trim() || undefined
      });

      showSuccess('发货成功');
      onSuccess();
      onClose();
      setFormData({ logisticsCompany: '', trackingNumber: '', shipRemark: '' });
    } catch (error: any) {
      showError(error.response?.data?.message || '发货失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && exchange && (
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">兑换发货</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <Label htmlFor="logisticsCompany">物流公司 *</Label>
                  <Input
                    id="logisticsCompany"
                    value={formData.logisticsCompany}
                    onChange={(e) => setFormData({ ...formData, logisticsCompany: e.target.value })}
                    placeholder="请输入物流公司"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="trackingNumber">物流单号 *</Label>
                  <Input
                    id="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                    placeholder="请输入物流单号"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="shipRemark">发货备注</Label>
                  <textarea
                    id="shipRemark"
                    value={formData.shipRemark}
                    onChange={(e) => setFormData({ ...formData, shipRemark: e.target.value })}
                    placeholder="请输入发货备注"
                    rows={3}
                    className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </form>

              <div className="flex items-center justify-end gap-3 p-6 border-t">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  取消
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? '发货中...' : '确认发货'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
