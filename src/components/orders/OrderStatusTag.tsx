/**
 * 订单状态标签组件
 * Source: 基于旧版本 OrderStatusTag
 */

'use client';

import React from 'react';
import type { OrderStatus } from '@/types/order';

interface OrderStatusTagProps {
  status: OrderStatus;
  size?: 'small' | 'default' | 'large';
}

export function OrderStatusTag({ status, size = 'default' }: OrderStatusTagProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending_payment':
        return {
          text: '待支付',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-300'
        };
      case 'pending_shipment':
        return {
          text: '待发货',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-300'
        };
      case 'shipped':
        return {
          text: '已发货',
          bgColor: 'bg-cyan-100',
          textColor: 'text-cyan-700',
          borderColor: 'border-cyan-300'
        };
      case 'completed':
        return {
          text: '已完成',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-300'
        };
      case 'cancelled':
        return {
          text: '已取消',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300'
        };
      default:
        return {
          text: '未知',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClass = size === 'small' ? 'text-xs px-2 py-0.5' : 
                    size === 'large' ? 'text-base px-4 py-2' : 
                    'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClass} font-medium`}
    >
      {config.text}
    </span>
  );
}
