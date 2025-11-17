"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

/**
 * 系统日志统计卡片组件
 * Source: 自定义实现，遵循KISS原则
 */

interface SystemLogStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color: string;
  index: number;
}

export function SystemLogStatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  color,
  index,
}: SystemLogStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 dark:bg-slate-800 dark:border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
