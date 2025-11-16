'use client';

/**
 * 消息详情模态框
 * Message Detail Modal
 * 
 * 功能：查看消息详细信息
 */

import { X, Eye, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Message } from '@/types/message';

interface MessageDetailModalProps {
  open: boolean;
  onClose: () => void;
  message: Message;
}

export function MessageDetailModal({ open, onClose, message }: MessageDetailModalProps) {
  // 消息类型标签颜色
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      system: 'bg-blue-100 text-blue-800',
      order: 'bg-green-100 text-green-800',
      promotion: 'bg-purple-100 text-purple-800',
      notification: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // 消息状态标签颜色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-green-100 text-green-800',
      read: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // 消息类型中文
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      system: '系统消息',
      order: '订单消息',
      promotion: '促销消息',
      notification: '通知消息'
    };
    return labels[type] || type;
  };

  // 消息状态中文
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: '草稿',
      sent: '已发送',
      read: '已读'
    };
    return labels[status] || status;
  };

  // 接收者类型中文
  const getRecipientTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      all: '全部用户',
      specific: '指定用户',
      group: '用户组'
    };
    return labels[type] || type;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              消息详情
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* 基本信息 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {message.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getTypeColor(message.type)}>
                    {getTypeLabel(message.type)}
                  </Badge>
                  <Badge className={getStatusColor(message.status)}>
                    {getStatusLabel(message.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 消息内容 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">接收者类型</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {getRecipientTypeLabel(message.recipientType)}
              </p>
            </div>

            {message.recipientIds && (
              <div>
                <p className="text-sm text-gray-500">接收者ID</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {message.recipientIds}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">阅读情况</p>
              <div className="flex items-center gap-2 mt-1">
                <p className={`text-sm font-medium ${message.isRead === 1 ? 'text-green-600' : 'text-gray-900'}`}>
                  {message.isRead === 1 ? '1 / 1' : `${message.readCount || 0} / ${message.totalCount || 0}`}
                </p>
                {message.isRead === 1 && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    已查看
                  </Badge>
                )}
              </div>
            </div>

            {message.senderName && (
              <div>
                <p className="text-sm text-gray-500">发送者</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {message.senderName}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">创建时间</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {message.createTime}
              </p>
            </div>

            {message.sendTime && (
              <div>
                <p className="text-sm text-gray-500">发送时间</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {message.sendTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button 
            onClick={onClose}
            className="px-8 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
          >
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}
