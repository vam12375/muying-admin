/**
 * 物流追踪时间轴组件
 * Logistics Tracking Timeline Component
 * 
 * 带路径绘制动画的时间轴
 * 
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { MapPin, Package, CheckCircle, Clock } from 'lucide-react';
import { useLogisticsGSAP } from '@/hooks/useLogisticsGSAP';
import type { LogisticsTrack } from '@/types/logistics';
import { formatDate } from '@/lib/utils';

interface TrackingTimelineProps {
  tracks: LogisticsTrack[];
  currentStatus?: string;
}

export function TrackingTimeline({ tracks, currentStatus }: TrackingTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { animateTimeline } = useLogisticsGSAP();

  useEffect(() => {
    if (timelineRef.current) {
      const items = Array.from(timelineRef.current.querySelectorAll('[data-timeline-item]')) as HTMLElement[];
      if (items.length > 0) {
        animateTimeline(items);
      }
    }
  }, [tracks]);

  // 获取状态图标
  const getStatusIcon = (status: string, index: number) => {
    if (index === 0) return CheckCircle;
    if (status.includes('派送') || status.includes('送达')) return Package;
    if (status.includes('到达') || status.includes('转运')) return MapPin;
    return Clock;
  };

  // 获取状态颜色
  const getStatusColor = (index: number) => {
    if (index === 0) return {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-500',
      line: 'bg-green-500'
    };
    if (index < 3) return {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-500',
      line: 'bg-blue-500'
    };
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-400',
      line: 'bg-gray-400'
    };
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>暂无物流追踪信息</p>
      </div>
    );
  }

  return (
    <div ref={timelineRef} className="relative space-y-0">
      {tracks.map((track, index) => {
        const Icon = getStatusIcon(track.status, index);
        const colors = getStatusColor(index);
        const isFirst = index === 0;
        const isLast = index === tracks.length - 1;

        return (
          <div
            key={track.id}
            data-timeline-item
            className="relative flex gap-6 pb-8 last:pb-0"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* 时间轴线 */}
            {!isLast && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700">
                <div
                  data-line
                  className={`w-full h-full ${colors.line} origin-top`}
                  style={{ willChange: 'transform' }}
                />
              </div>
            )}

            {/* 图标节点 */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full border-4 ${colors.border} ${colors.bg}
                           flex items-center justify-center shadow-lg
                           ${isFirst ? 'animate-pulse' : ''}`}
              >
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>

              {/* 脉冲圆环（仅第一个） */}
              {isFirst && (
                <div
                  className={`absolute inset-0 rounded-full ${colors.border} animate-ping opacity-75`}
                />
              )}
            </div>

            {/* 内容卡片 */}
            <div
              className={`flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md
                         border border-gray-200 dark:border-gray-700
                         ${isFirst ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
            >
              {/* 时间和状态 */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className={`font-semibold ${colors.text} mb-1`}>
                    {track.status}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {track.content}
                  </div>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {formatDate(track.trackingTime, 'datetime')}
                </div>
              </div>

              {/* 位置信息 */}
              {track.location && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>{track.location}</span>
                </div>
              )}

              {/* 操作员 */}
              {track.operator && (
                <div className="text-xs text-gray-400 mt-2">
                  操作员: {track.operator}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
