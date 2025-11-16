/**
 * 消息列表项组件（带 GSAP 动画）
 * Message List Item Component (with GSAP Animations)
 * 
 * 功能：
 * - 列表项入场动画
 * - 进度条填充动画
 * - 删除动画
 */

'use client';

import { LucideIcon, Eye, Users, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  useListItemAnimation, 
  useProgressBarAnimation 
} from '@/hooks/useGSAPAnimations';
import type { Message } from '@/types/message';

interface MessageListItemProps {
  message: Message;
  index: number;
  typeConfig: any;
  statusConfig: any;
  TypeIcon: LucideIcon;
  StatusIcon: LucideIcon;
  readPercentage: number;
  onViewDetail: (message: Message) => void;
  onDelete: (id: number) => void;
}

export function MessageListItem({
  message,
  index,
  typeConfig,
  statusConfig,
  TypeIcon,
  StatusIcon,
  readPercentage,
  onViewDetail,
  onDelete
}: MessageListItemProps) {
  // GSAP 动画 Hooks
  const itemRef = useListItemAnimation(index, true);
  const progressBarRef = useProgressBarAnimation(readPercentage, index * 0.05 + 0.5);

  return (
    <div
      ref={itemRef}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden"
      style={{
        willChange: 'transform, opacity'
      }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* 左侧图标 - 带未读红点 */}
          <div className="relative flex-shrink-0">
            <div className={`w-12 h-12 rounded-xl ${typeConfig?.lightColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <TypeIcon className={`w-6 h-6 ${typeConfig?.textColor}`} />
            </div>
            {/* 未读红点标识 - 带脉冲动画 */}
            {message.isRead === 0 && (
              <div className="absolute -top-1 -right-1">
                <div className="relative">
                  {/* 外层脉冲圆圈 */}
                  <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                  {/* 内层实心圆点 */}
                  <div className="relative w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg" />
                </div>
              </div>
            )}
          </div>

          {/* 中间内容 */}
          <div className="flex-1 min-w-0">
            {/* 标题和标签 */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate mb-2">
                  {message.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${typeConfig?.lightColor} ${typeConfig?.textColor} border-0 text-xs`}>
                    {typeConfig?.label}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <StatusIcon className={`w-3.5 h-3.5 ${statusConfig?.color.replace('bg-', 'text-')}`} />
                    <span>{statusConfig?.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {message.recipientType === 'all' ? '全部用户' : 
                       message.recipientType === 'specific' ? '指定用户' : '用户组'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetail(message)}
                  className="h-8 px-3 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  查看
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(message.messageId)}
                  className="h-8 px-3 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  删除
                </Button>
              </div>
            </div>

            {/* 底部信息栏 */}
            <div className="flex items-center gap-6 text-sm">
              {/* 阅读进度 - 使用 GSAP 动画 */}
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Eye className={`w-4 h-4 flex-shrink-0 ${message.isRead === 1 ? 'text-green-500' : 'text-gray-400'}`} />
                  <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-[80px] max-w-[120px] overflow-hidden">
                    <div 
                      ref={progressBarRef}
                      className={`h-2 rounded-full ${
                        message.isRead === 1 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}
                      style={{
                        width: '0%',
                        willChange: 'width'
                      }}
                    />
                  </div>
                  <span className={`text-xs whitespace-nowrap ${
                    message.isRead === 1 ? 'text-green-600 font-medium' : 'text-gray-600'
                  }`}>
                    {message.isRead === 1 ? '1/1' : `${message.readCount || 0}/${message.totalCount || 0}`}
                  </span>
                </div>
              </div>

              {/* 创建时间 */}
              <div className="flex items-center gap-1.5 text-gray-500 flex-shrink-0">
                <Clock className="w-4 h-4" />
                <span className="text-xs">{message.createTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部装饰条 */}
      <div className={`h-1 ${typeConfig?.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
}
