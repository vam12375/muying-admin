/**
 * 物流信息卡片组件
 * Logistics Information Card Component
 * 
 * 带3D悬浮效果的物流卡片
 * 
 */

'use client';

import React, { useRef, useState } from 'react';
import { Package, MapPin, Clock, Eye, Edit, Truck } from 'lucide-react';
import { useLogisticsGSAP } from '@/hooks/useLogisticsGSAP';
import { CompanyLogo } from './CompanyLogoMap';
import type { Logistics } from '@/types/logistics';
import { formatDate } from '@/lib/utils';

interface LogisticsCardProps {
  logistics: Logistics;
  onViewDetail?: (logistics: Logistics) => void;
  onUpdate?: (logistics: Logistics) => void;
}

export function LogisticsCard({ logistics, onViewDetail, onUpdate }: LogisticsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { animateCardHover } = useLogisticsGSAP();
  const [isHovered, setIsHovered] = useState(false);

  // 状态样式配置
  const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    CREATED: { label: '已创建', color: 'text-orange-700', bgColor: 'bg-orange-100' },
    SHIPPING: { label: '运输中', color: 'text-blue-700', bgColor: 'bg-blue-100' },
    DELIVERED: { label: '已送达', color: 'text-green-700', bgColor: 'bg-green-100' },
    EXCEPTION: { label: '异常', color: 'text-red-700', bgColor: 'bg-red-100' }
  };

  const status = statusConfig[logistics.status] || statusConfig.CREATED;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      animateCardHover(cardRef.current, true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      animateCardHover(cardRef.current, false);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 
                 dark:border-gray-700 p-6 cursor-pointer overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {/* 背景渐变装饰 */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-0
                   transition-opacity duration-500 ${isHovered ? 'opacity-10' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${
            logistics.status === 'DELIVERED' ? '#10b981' :
            logistics.status === 'SHIPPING' ? '#3b82f6' :
            logistics.status === 'EXCEPTION' ? '#ef4444' : '#f59e0b'
          }, transparent)`
        }}
      />

      {/* 内容区域 */}
      <div className="relative z-10 space-y-4">
        {/* 头部：Logo + 物流单号 + 状态 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <CompanyLogo 
              code={logistics.company?.code || 'UNKNOWN'} 
              name={logistics.company?.name}
              size="md"
            />
            <div>
              <div className="font-mono font-bold text-lg text-gray-900 dark:text-gray-100">
                {logistics.trackingNo}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {logistics.company?.name || '未知物流公司'}
              </div>
            </div>
          </div>

          {/* 状态标签 */}
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${status.bgColor} ${status.color}
                       shadow-sm`}
            data-status-badge
          >
            {status.label}
          </div>
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

        {/* 收件信息 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {logistics.receiverName} · {logistics.receiverPhone}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {logistics.receiverAddress}
              </div>
            </div>
          </div>

          {/* 时间信息 */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>创建: {formatDate(logistics.createTime)}</span>
            </div>
            {logistics.shippingTime && (
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>发货: {formatDate(logistics.shippingTime)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail?.(logistics);
            }}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700
                     text-white rounded-xl font-medium shadow-md
                     hover:from-blue-700 hover:to-blue-800 hover:shadow-lg
                     transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            查看详情
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate?.(logistics);
            }}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700
                     text-white rounded-xl font-medium shadow-md
                     hover:from-green-700 hover:to-green-800 hover:shadow-lg
                     transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            更新状态
          </button>
        </div>
      </div>

      {/* 悬浮时的光效 */}
      {isHovered && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent
                     pointer-events-none"
        />
      )}
    </div>
  );
}
