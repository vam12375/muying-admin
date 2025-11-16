/**
 * 订单统计卡片组件
 * Source: 基于旧版本 OrderStatCard，增强版带趋势图表
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface OrderStatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  trend?: number[];
  icon: React.ReactNode;
  color?: string;
  trendColor?: string;
  onClick?: () => void;
}

export function OrderStatCard({
  title,
  value,
  previousValue,
  trend = [],
  icon,
  color = '#ffffff',
  trendColor = '#3b82f6',
  onClick
}: OrderStatCardProps) {
  // 计算增长率
  const growth = previousValue !== undefined && previousValue > 0
    ? ((value - previousValue) / previousValue) * 100
    : 0;
  
  const isPositive = growth > 0;
  const hasGrowth = previousValue !== undefined && growth !== 0;

  // 将趋势数据转换为图表格式
  const chartData = trend.map((val, index) => ({
    index,
    value: val
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 cursor-pointer"
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {/* 标题和图标 */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80">
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <Info className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* 数值 */}
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      
      {/* 增长率标签 */}
      {hasGrowth && (
        <div className="mb-3 flex items-center gap-2">
          <div className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
            isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{isPositive ? '+' : ''}{growth.toFixed(1)}%</span>
          </div>
          <span className="text-xs text-gray-500">较上期</span>
        </div>
      )}
      
      {/* 趋势图表 */}
      {trend.length > 0 && (
        <div className="h-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={trendColor} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={trendColor} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="value"
                stroke={trendColor}
                strokeWidth={2}
                dot={false}
                fill={`url(#gradient-${title})`}
                fillOpacity={1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
