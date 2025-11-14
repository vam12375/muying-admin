/**
 * 积分调整模态框组件
 * Adjust Points Modal Component
 * 
 * 功能：管理员调整用户积分（增加/减少）
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adjustUserPoints } from '@/lib/api/points';
import { X } from 'lucide-react';
import type { UserPoints } from '@/types/points';

interface AdjustPointsModalProps {
  open: boolean;
  onClose: () => void;
  userPoints: UserPoints | null;
  onSuccess: () => void;
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window !== 'undefined') {
    console.log(`[${type.toUpperCase()}]`, message);
  }
};

export function AdjustPointsModal({ open, onClose, userPoints, onSuccess }: AdjustPointsModalProps) {
  const [loading, setLoading] = useState(false);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [source, setSource] = useState('管理员调整');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userPoints) return;

    const pointsNum = Number(points);
    if (isNaN(pointsNum) || pointsNum <= 0) {
      showToast('请输入有效的积分数量', 'error');
      return;
    }

    if (!reason.trim()) {
      showToast('请输入调整原因', 'error');
      return;
    }

    setLoading(true);
    try {
      await adjustUserPoints({
        userId: userPoints.userId,
        points: adjustType === 'add' ? pointsNum : -pointsNum,
        reason: reason.trim(),
        source: source.trim()
      });

      showToast('积分调整成功', 'success');
      onSuccess();
      handleClose();
    } catch (error: any) {
      showToast(error.response?.data?.message || '积分调整失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPoints('');
    setReason('');
    setSource('管理员调整');
    setAdjustType('add');
    onClose();
  };

  if (!open || !userPoints) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">调整积分</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 用户信息 */}
          <div className="rounded-lg bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">用户名：</span>
              <span className="text-sm font-medium">{userPoints.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">当前积分：</span>
              <span className="text-sm font-medium">{userPoints.currentPoints}</span>
            </div>
          </div>

          {/* 调整类型 */}
          <div className="space-y-2">
            <Label htmlFor="adjustType">调整类型</Label>
            <Select value={adjustType} onValueChange={(value) => setAdjustType(value as 'add' | 'subtract')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">增加积分</SelectItem>
                <SelectItem value="subtract">减少积分</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 积分数量 */}
          <div className="space-y-2">
            <Label htmlFor="points">积分数量</Label>
            <Input
              id="points"
              type="number"
              min="1"
              step="1"
              placeholder="请输入积分数量"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
            />
          </div>

          {/* 积分来源 */}
          <div className="space-y-2">
            <Label htmlFor="source">积分来源</Label>
            <Input
              id="source"
              placeholder="例如：活动奖励、补偿等"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          {/* 调整原因 */}
          <div className="space-y-2">
            <Label htmlFor="reason">调整原因 *</Label>
            <Textarea
              id="reason"
              placeholder="请输入调整原因"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* 预览 */}
          {points && (
            <div className="rounded-lg bg-blue-50 p-4 space-y-1">
              <div className="text-sm text-blue-900">
                调整后积分：
                <span className="ml-2 font-bold">
                  {adjustType === 'add'
                    ? userPoints.currentPoints + Number(points)
                    : userPoints.currentPoints - Number(points)}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '处理中...' : '确认调整'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
