/**
 * 订单统计卡片组件
 * Source: 基于旧版本 OrderStatCard，使用 Framer Motion 动画
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OrderStatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

export function OrderStatCard({
  title,
  value,
  previousValue,
  icon,
  color = '#ffffff',
  onClick
}: OrderStatCardProps) {
  // 计算增长率
  const growth = previousValue !== undefined && previousValue > 0
    ? ((value - previousValue) / previousValue) * 100
    : 0;
  
  const isPositive = growth > 0;
  const hasGrowth = previousValue !== undefined && growth !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 cursor-pointer"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          
          {hasGrowth && (
            <div className="mt-2 flex items-center text-sm">
              {isPositive ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span className="text-green-600">+{growth.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
                  <span className="text-red-600">{growth.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1 text-gray-500">vs 上期</span>
            </div>
          )}
        </div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/50">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
