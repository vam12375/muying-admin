/**
 * 积分规则编辑模态框
 * Points Rule Edit Modal
 * 
 * 功能：创建和编辑积分规则
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
import type { PointsRule } from '@/types/points';

interface PointsRuleModalProps {
  open: boolean;
  onClose: () => void;
  rule: PointsRule | null;
  onSuccess: () => void;
}

export function PointsRuleModal({ open, onClose, rule, onSuccess }: PointsRuleModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'signin',
    points: 0,
    maxDaily: 0,
    maxTotal: 0,
    status: 1,
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description || '',
        type: rule.type,
        points: rule.points,
        maxDaily: rule.maxDaily || 0,
        maxTotal: rule.maxTotal || 0,
        status: rule.status,
        startTime: rule.startTime ? rule.startTime.split('T')[0] : '',
        endTime: rule.endTime ? rule.endTime.split('T')[0] : ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'signin',
        points: 0,
        maxDaily: 0,
        maxTotal: 0,
        status: 1,
        startTime: '',
        endTime: ''
      });
    }
  }, [rule, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showError('请输入规则名称');
      return;
    }

    if (formData.points <= 0) {
      showError('奖励积分必须大于0');
      return;
    }

    setLoading(true);
    try {
      const data: any = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        points: formData.points,
        maxDaily: formData.maxDaily || undefined,
        maxTotal: formData.maxTotal || undefined,
        status: formData.status,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined
      };

      if (rule) {
        await pointsApi.updatePointsRule(rule.id, data);
        showSuccess('更新成功');
      } else {
        await pointsApi.createPointsRule(data);
        showSuccess('创建成功');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      showError(error.response?.data?.message || (rule ? '更新失败' : '创建失败'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* 模态框 */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* 标题栏 */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {rule ? '编辑规则' : '新建规则'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full hover:bg-white/50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* 表单内容 */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">规则名称 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="请输入规则名称"
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="description">规则描述</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="请输入规则描述"
                      rows={3}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">规则类型 *</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-1 w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="signin">签到</option>
                      <option value="order">订单</option>
                      <option value="review">评论</option>
                      <option value="register">注册</option>
                      <option value="event">活动</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="points">奖励积分 *</Label>
                    <Input
                      id="points"
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                      placeholder="请输入奖励积分"
                      min="1"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxDaily">每日上限</Label>
                    <Input
                      id="maxDaily"
                      type="number"
                      value={formData.maxDaily}
                      onChange={(e) => setFormData({ ...formData, maxDaily: Number(e.target.value) })}
                      placeholder="0表示不限制"
                      min="0"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxTotal">总上限</Label>
                    <Input
                      id="maxTotal"
                      type="number"
                      value={formData.maxTotal}
                      onChange={(e) => setFormData({ ...formData, maxTotal: Number(e.target.value) })}
                      placeholder="0表示不限制"
                      min="0"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="startTime">开始时间</Label>
                    <Input
                      id="startTime"
                      type="date"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime">结束时间</Label>
                    <Input
                      id="endTime"
                      type="date"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="status">状态</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                      className="mt-1 w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="1">启用</option>
                      <option value="0">禁用</option>
                    </select>
                  </div>
                </div>
              </form>

              {/* 底部按钮 */}
              <div className="flex items-center justify-end gap-3 p-6 border-t bg-slate-50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
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
