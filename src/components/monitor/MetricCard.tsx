/**
 * 指标卡片组件
 * Metric Card Component with animations
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { MiniChart } from './MiniChart';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: LucideIcon;
  trend?: number[]; // 趋势数据
  change?: number; // 变化百分比
  color?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  unit = '',
  icon: Icon,
  trend,
  change,
  color = 'blue',
  delay = 0,
}: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
    yellow: 'from-yellow-500 to-orange-500',
  };

  const bgColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* 渐变背景 */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10', bgColor)} />
      
      {/* 图标背景 */}
      <div className={cn('absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl', bgColor)} />
      
      <div className="relative p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-3 rounded-xl bg-gradient-to-br', bgColor)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
              className={cn(
                'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg',
                change >= 0 ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'
              )}
            >
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
            </motion.div>
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          {title}
        </h3>

        {/* 数值 */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            <AnimatedNumber value={value} decimals={unit === '%' ? 1 : 0} />
          </span>
          {unit && (
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
              {unit}
            </span>
          )}
        </div>

        {/* 趋势图 */}
        {trend && trend.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="mt-4"
          >
            <MiniChart data={trend} color={`var(--${color}-500)`} />
          </motion.div>
        )}
      </div>

      {/* 脉冲动画 */}
      <motion.div
        className={cn('absolute inset-0 bg-gradient-to-br opacity-0', bgColor)}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.div>
  );
}
