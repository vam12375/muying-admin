'use client';

/**
 * 消息表单模态框
 * Message Form Modal
 * 
 * 功能：创建和发送消息
 */

import { useState } from 'react';
import { X, Plus, Send, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createMessage } from '@/lib/api/messages';
import type { MessageFormData, MessageType, RecipientType } from '@/types/message';

interface MessageFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MessageFormModal({ open, onClose, onSuccess }: MessageFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<MessageFormData>({
    title: '',
    content: '',
    type: 'system',
    recipientType: 'all',
    recipientIds: []
  });

  if (!open) return null;

  // 表单验证
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('请输入消息标题');
      return false;
    }
    if (!formData.content.trim()) {
      setError('请输入消息内容');
      return false;
    }
    if (formData.recipientType === 'specific' && (!formData.recipientIds || formData.recipientIds.length === 0)) {
      setError('请输入接收者ID');
      return false;
    }
    return true;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createMessage(formData);
      onSuccess();
      onClose();
      // 重置表单
      setFormData({
        title: '',
        content: '',
        type: 'system',
        recipientType: 'all',
        recipientIds: []
      });
    } catch (error: any) {
      setError(error.message || '创建失败，请重试');
      console.error('创建消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              新建消息
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* 消息标题 */}
          <div className="space-y-2">
            <Label htmlFor="title">消息标题 *</Label>
            <Input
              id="title"
              placeholder="请输入消息标题"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* 消息类型 */}
          <div className="space-y-2">
            <Label htmlFor="type">消息类型 *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as MessageType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">系统消息</SelectItem>
                <SelectItem value="order">订单消息</SelectItem>
                <SelectItem value="promotion">促销消息</SelectItem>
                <SelectItem value="notification">通知消息</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 接收者类型 */}
          <div className="space-y-2">
            <Label htmlFor="recipientType">接收者 *</Label>
            <Select
              value={formData.recipientType}
              onValueChange={(value) => setFormData({ ...formData, recipientType: value as RecipientType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部用户</SelectItem>
                <SelectItem value="specific">指定用户</SelectItem>
                <SelectItem value="group">用户组</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 接收者ID（仅当选择指定用户时显示） */}
          {formData.recipientType === 'specific' && (
            <div className="space-y-2">
              <Label htmlFor="recipientIds">接收者ID *</Label>
              <Input
                id="recipientIds"
                placeholder="请输入用户ID，多个ID用逗号分隔"
                value={formData.recipientIds?.join(',') || ''}
                onChange={(e) => {
                  const ids = e.target.value.split(',').map(id => id.trim()).filter(id => id);
                  setFormData({ ...formData, recipientIds: ids });
                }}
              />
              <p className="text-xs text-gray-500">
                例如：1,2,3 或 1, 2, 3
              </p>
            </div>
          )}

          {/* 消息内容 */}
          <div className="space-y-2">
            <Label htmlFor="content">消息内容 *</Label>
            <Textarea
              id="content"
              placeholder="请输入消息内容"
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 hover:bg-gray-50"
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>创建中...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>创建并发送</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
