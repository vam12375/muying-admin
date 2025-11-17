/**
 * 积分商品编辑模态框
 * Points Product Edit Modal
 * 
 * 功能：创建和编辑积分商品
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pointsApi } from '@/lib/api/points';
import { showSuccess, showError } from '@/lib/utils/toast';
import { X } from 'lucide-react';
import type { PointsProduct } from '@/types/points';

interface PointsProductModalProps {
  open: boolean;
  onClose: () => void;
  product: PointsProduct | null;
  onSuccess: () => void;
}

export function PointsProductModal({ open, onClose, product, onSuccess }: PointsProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    points: 0,
    stock: 0,
    category: 'virtual',
    needAddress: 0,
    needPhone: 0,
    isHot: 0,
    status: 1,
    sortOrder: 0
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        image: product.image || '',
        points: product.points,
        stock: product.stock,
        category: product.category,
        needAddress: product.needAddress,
        needPhone: product.needPhone,
        isHot: product.isHot,
        status: product.status,
        sortOrder: product.sortOrder
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        points: 0,
        stock: 0,
        category: 'virtual',
        needAddress: 0,
        needPhone: 0,
        isHot: 0,
        status: 1,
        sortOrder: 0
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showError('请输入商品名称');
      return;
    }

    if (formData.points <= 0) {
      showError('所需积分必须大于0');
      return;
    }

    if (formData.stock < 0) {
      showError('库存不能为负数');
      return;
    }

    setLoading(true);
    try {
      const data: any = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image.trim() || undefined,
        points: formData.points,
        stock: formData.stock,
        category: formData.category,
        needAddress: formData.needAddress,
        needPhone: formData.needPhone,
        isHot: formData.isHot,
        status: formData.status,
        sortOrder: formData.sortOrder
      };

      if (product) {
        await pointsApi.updatePointsProduct(product.id, data);
        showSuccess('更新成功');
      } else {
        await pointsApi.createPointsProduct(data);
        showSuccess('创建成功');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      showError(error.response?.data?.message || (product ? '更新失败' : '创建失败'));
    } finally {
      setLoading(false);
    }
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

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {product ? '编辑商品' : '新建商品'}
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-white/50">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">商品名称 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="请输入商品名称"
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="description">商品描述</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="请输入商品描述"
                      rows={3}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="image">商品图片URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="请输入图片URL"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">商品分类 *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="virtual">虚拟商品</option>
                      <option value="physical">实物商品</option>
                      <option value="coupon">优惠券</option>
                      <option value="vip">会员特权</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="points">所需积分 *</Label>
                    <Input
                      id="points"
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                      placeholder="请输入所需积分"
                      min="1"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">库存数量 *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      placeholder="请输入库存数量"
                      min="0"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sortOrder">排序号</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                      placeholder="数字越小越靠前"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="needAddress">需要收货地址</Label>
                    <select
                      id="needAddress"
                      value={formData.needAddress}
                      onChange={(e) => setFormData({ ...formData, needAddress: Number(e.target.value) })}
                      className="mt-1 w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="0">否</option>
                      <option value="1">是</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="needPhone">需要手机号</Label>
                    <select
                      id="needPhone"
                      value={formData.needPhone}
                      onChange={(e) => setFormData({ ...formData, needPhone: Number(e.target.value) })}
                      className="mt-1 w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="0">否</option>
                      <option value="1">是</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="isHot">是否热门</Label>
                    <select
                      id="isHot"
                      value={formData.isHot}
                      onChange={(e) => setFormData({ ...formData, isHot: Number(e.target.value) })}
                      className="mt-1 w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="0">否</option>
                      <option value="1">是</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="status">状态</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                      className="mt-1 w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="1">上架</option>
                      <option value="0">下架</option>
                    </select>
                  </div>
                </div>
              </form>

              <div className="flex items-center justify-end gap-3 p-6 border-t bg-slate-50">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  取消
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? '保存中...' : '保存'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
