/**
 * 物流统计卡片组件
 * Logistics Statistics Card Component
 * 
 * 带GSAP动画的统计卡片
 * 
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { useLogisticsGSAP } from '@/hooks/useLogisticsGSAP';

interface LogisticsStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  delay?: number;
}

export function LogisticsStatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  trend,
  delay = 0
}: LogisticsStatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { animateStatCard } = useLogisticsGSAP();

  useEffect(() => {
    if (cardRef.current) {
      setTimeout(() => {
        animateStatCard(cardRef.current!, value);
      }, delay);
    }
  }, [value, delay]);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 
                 p-6 shadow-lg border border-gray-200 dark:border-gray-700
                 hover:shadow-2xl transition-all duration-300 group"
      style={{
        willChange: 'transform, opacity'
      }}
    >
      {/* 背景装饰 */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20
                   group-hover:opacity-30 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      />

      {/* 内容 */}
      <div className="relative z-10">
        {/* 图标 */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4
                     shadow-md group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="w-7 h-7" style={{ color }} />
        </div>

        {/* 标题 */}
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          {title}
        </h3>

        {/* 数值 */}
        <div className="flex items-end gap-3">
          <span
            data-counter
            className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${color}, ${color}dd)`
            }}
          >
            0
          </span>

          {/* 趋势指示器 */}
          {trend && (
            <span
              className={`text-sm font-semibold mb-2 ${
                trend.isUp ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>

      {/* 脉冲动画装饰点 */}
      <div
        className="absolute bottom-4 right-4 w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
