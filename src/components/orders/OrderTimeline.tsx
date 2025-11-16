/**
 * 订单时间轴组件
 * Source: 基于旧版本订单动态展示
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { OrderHistory } from '@/types/order';

interface OrderTimelineProps {
  title?: string;
  items: OrderHistory[];
}

export function OrderTimeline({ title = '订单动态', items }: OrderTimelineProps) {
  const getStatusColor = (type?: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-orange-500';
      case 'error':
        return 'bg-red-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div>
      {title && <h3 className="mb-4 text-base font-semibold text-gray-900">{title}</h3>}
      <div className="relative">
        {/* 时间轴线 */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* 时间轴项目 */}
        <div className="space-y-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4"
            >
              {/* 时间点 */}
              <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${getStatusColor(item.type)}`}>
                <Clock className="h-4 w-4 text-white" />
              </div>

              {/* 内容 */}
              <div className="flex-1 pb-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                      )}
                      {item.operator && (
                        <p className="mt-1 text-xs text-gray-500">操作人: {item.operator}</p>
                      )}
                    </div>
                    <div className="ml-4 text-xs text-gray-500 whitespace-nowrap">{item.time}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
