/**
 * 订单状态标签组件
 * Source: 基于旧版本 OrderStatusTag，增强版带图标和动画
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Truck,
  AlertTriangle,
  RefreshCw,
  XCircle
} from 'lucide-react';
import type { OrderStatus } from '@/types/order';

interface OrderStatusTagProps {
  status: OrderStatus | string;
  size?: 'small' | 'default' | 'large';
  showIcon?: boolean;
  showTooltip?: boolean;
}

export function OrderStatusTag({ 
  status, 
  size = 'default',
  showIcon = true,
  showTooltip = true
}: OrderStatusTagProps) {
  // 规范化状态值：处理可能的对象格式或大小写问题
  const normalizedStatus = typeof status === 'string' 
    ? status.toLowerCase() 
    : String(status).toLowerCase();
  
  const getStatusConfig = () => {
    // 使用规范化后的状态值进行匹配
    const statusKey = normalizedStatus as OrderStatus;
    switch (statusKey) {
      case 'pending_payment':
        return {
          text: '待支付',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-200',
          icon: <DollarSign className="h-3.5 w-3.5" />,
          description: '订单已创建，等待买家付款'
        };
      case 'pending_shipment':
        return {
          text: '待发货',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          icon: <Clock className="h-3.5 w-3.5" />,
          description: '买家已付款，等待商家发货'
        };
      case 'shipped':
        return {
          text: '已发货',
          bgColor: 'bg-cyan-50',
          textColor: 'text-cyan-700',
          borderColor: 'border-cyan-200',
          icon: <Truck className="h-3.5 w-3.5" />,
          description: '商家已发货，等待买家确认收货'
        };
      case 'completed':
        return {
          text: '已完成',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          description: '订单已完成'
        };
      case 'cancelled':
        return {
          text: '已取消',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          icon: <XCircle className="h-3.5 w-3.5" />,
          description: '订单已取消'
        };
      case 'refunding':
        return {
          text: '退款中',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          icon: <RefreshCw className="h-3.5 w-3.5 animate-spin" />,
          description: '订单正在退款处理中'
        };
      case 'refunded':
        return {
          text: '已退款',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
          icon: <AlertTriangle className="h-3.5 w-3.5" />,
          description: '订单已退款'
        };
      default:
        // 添加调试日志
        console.warn('[OrderStatusTag] 未知的订单状态:', {
          original: status,
          normalized: normalizedStatus,
          type: typeof status
        });
        return {
          text: String(status) || '未知',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          icon: <Clock className="h-3.5 w-3.5" />,
          description: '未知状态'
        };
    }
  };

  const config = getStatusConfig();
  
  // 根据尺寸设置样式
  const sizeClasses = {
    small: 'text-xs px-2 py-0.5 gap-1',
    default: 'text-sm px-2.5 py-1 gap-1.5',
    large: 'text-base px-3 py-1.5 gap-2'
  };

  const tag = (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center rounded border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]} font-medium`}
    >
      {showIcon && (
        <span className="flex-shrink-0">
          {config.icon}
        </span>
      )}
      <span>{config.text}</span>
    </motion.span>
  );

  // 如果显示提示，则包装在悬浮提示中
  if (showTooltip) {
    return (
      <div className="group relative inline-block">
        {tag}
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
          {config.description}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return tag;
}
